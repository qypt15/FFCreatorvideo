'use strict';

/**
 * 合成- Synthesis - A class for video synthesis.
 * Mainly rely on the function of ffmpeg to synthesize video and audio.
 *
 * ####Example:
 *
 *     const synthesis = new Synthesis(conf);
 *     synthesis.start();
 *
 *
 * @class
 */
const path = require('path');
const rmfr = require('rmfr');
const { promisify } = require('util');
const fs = require('fs-extra');
const FFBase = require('./base');
const isEmpty = require('lodash/isEmpty');
const forEach = require('lodash/forEach');
const Utils = require('../utils/utils');
const ScenesUtil = require('../utils/scenes');
const FFmpegUtil = require('../utils/ffmpeg');
const writeFileAsync = promisify(fs.writeFile);

class Synthesis extends FFBase {
  constructor(creator) {
    super({ type: 'synthesis' });

    this.creator = creator;
    this.conf = creator.rootConf();
    this.inputOptions = [];
    this.outputOptions = [];
    this.txtpath = '';
    this.command = FFmpegUtil.createCommand();
  }

  /**
   * Open ffmpeg production and processing
   * @public
   */
  async start() {
    const { creator, conf } = this;
    const upStreaming = conf.getVal('upStreaming');

    if (upStreaming) {
      // 推流
      this.liveOutput();
    } else if (ScenesUtil.isSingle(creator)) {
      // 完成一个
      this.mvOutput();
    } else {
      // 是否有转场
      if (ScenesUtil.hasTransition(creator)) {
        ScenesUtil.fillTransition(creator);
        this.addXfadeInput();
      } else {
        // 完成
        await this.addConcatInput();
      }

      this.addAudio(); // 【完整视频】添加视频背景音乐
     //   console.log('【完整视频】添加视频背景音乐')
      this.addOutputOptions();
      this.addCommandEvents();
      this.addOutput();
      this.command.run();
    }
  }

  liveOutput() {
    const { conf } = this;
    const output = conf.getVal('output');
    this.emits({ type: 'synthesis-complete', path: output, output });
  }

  /**
   * Produce final documents and move and save
   * @private
   */
  async mvOutput() {
    const { conf, creator } = this;
    const { scenes } = creator;

    const scene = scenes[0];
    const cacheFile = scene.getFile();
    const output = conf.getVal('output');
    await fs.move(cacheFile, output);

    const debug = conf.getVal('debug');
    if (!debug) this.deleteCacheFile();

    this.emits({ type: 'synthesis-complete', path: output, output });
  }

  /**
   * add input by xfade filter i case xfade-转场滤镜
   * @private
   */
  addXfadeInput() {
    const { scenes } = this.creator;
    const filters = [];
    let offset = 0;
    let cid;

    forEach(scenes, (scene, index) => {
      const file = scene.getFile();
      this.command.addInput(file);

      if (index >= scenes.length - 1) return;
      offset += scene.getNormalDuration();
      const filter = scene.toTransFilter(offset);

      cid = cid || `${index}:v`;
      const nid = `${index + 1}:v`;
      filter.inputs = [cid, nid];
      cid = `scene-${index}`;
      filter.outputs = [cid];
      filters.push(filter);
    });

    this.command.complexFilter(filters, cid);
  }

  /**
   * add input by concat multiple videos case
   * @private
   */
  async addConcatInput() {

    // create path txt
    const { creator } = this;
    const cacheDir = creator.rootConf('cacheDir').replace(/\/$/, '');
    this.txtpath = path.join(cacheDir, `${Utils.uid()}.txt`);

    let text = '';
    forEach(creator.scenes, scene => (text += `file '${scene.getFile()}'\n`));
    await writeFileAsync(this.txtpath, text, {
      encoding: 'utf8'
    });
    // Add the intermediate pictures processed in the cache directory to ffmpeg input
    this.command.addInput(this.txtpath);
    this.command.inputOptions(['-f', 'concat', '-safe', '0']);
  }

  /**
   * Add one background sounds
   * @param {array} audio - background sounds
   * @public
   */
  addAudio() {
    const { conf, command } = this;
    const audio = conf.getVal('audio');
    // console.log('音乐-audio',audio)
    if (isEmpty(audio)) return;

    command.addInput(audio);
    command.inputOptions(['-stream_loop', '-1']);
  }

  /**
   * Get default ffmpeg output configuration
   * @private
   */
  getDefaultOutputOptions() {
    const { conf } = this;
    const fps = conf.getVal('fps');
    const crf = conf.getVal('crf');
    const bv = conf.getVal('bv');

    // -stream_loop -1: 循环播放视频流。
    // -i C:\Users\Administrator\Downloads\video\视频\v1\0.mp3: 指定要循环播放的音频文件的路径。
    // -y: 覆盖同名输出文件。
    // -hide_banner: 隐藏ffmpeg的标志。
    // -map_metadata -1: 禁用metadata映射。
    // -map_chapters -1: 禁用章节映射。
    // -c copy: 复制视频流，不重新编码。
    // -c:v libx264: 使用H.264视频编解码器。
    // -profile:v main: 使用主H.264 profile 进行编码。
    // -preset medium: 使用中等预设进行编码速度和质量设置。
    // -crf 20: 设置视频质量，值越小质量越高。
    // -movflags faststart: 为MP4文件启用快速启动。
    // -pix_fmt yuv420p: 设置视频流的像素格式。
    // -r 24: 设置视频流的帧率。
    // -c:a aac: 使用AAC音频编解码器。
    // -shortest: 使用最短的音频文件长度。
    /**
     *   ffmpeg -f concat -safe 0 -i E:\fh\program\phpstudy_pro\WWW\git\FFCreatorvideo\examples\cache\
    rlt9jo6s50s3gb6f.txt -stream_loop -1
    -i C:\Users\Administrator\Downloads\video\视频\v1\0.mp3
    -y -hide_banner -map_metadata -1
    -map_chapters -1 -c copy -c:v libx264
    -profile:v main -preset medium -crf 20
    -movflags faststart -pix_fmt yuv420p -r 24
    -c:a aac -shortest
      E:\fh\program\phpstudy_pro\WWW\git\FFCreatorvideo\examples\output\/03.mp4

       command.outputOptions('-af volume=enable:volume=0');
     */
    // ffmpeg -f concat -safe 0 -i v.txt -i 2.mp3 -filter_complex [0:a][1:a]amix
    // -threads 5 -preset ultrafast  -shortest -y  output.mp4

    // ffmpeg -y -i 1.mp4 -i 0.mp3 -filter_complex
    // "[0:a]volume=10dB[a0];[1:a]volume=10dB[a1];[a0][a1]amix=inputs=2[a]"
    // -map 0:v -map "[a]" -c:v copy -c:a aac -shortest avm05.mp4
    let bgmVolume = 1.1 // 背景音乐的声音倍数
    let vVolume = 1.1 // 背景音乐的声音倍数
    const opts = []
      // misc
      .concat([
        '-hide_banner', // hide_banner - parameter, you can display only meta information
        '-map_metadata',
        '-1',
        '-map_chapters',
        '-1',
        // '-filter_complex',
        // '[0:a][1:a]amix;',
        '-filter_complex',
        // [0:a][1:a]amix;[1:a]volume=${bgmVolume}
        `[0:a]volume=${vVolume}[a0];[1:a]volume=${bgmVolume}[a1];[a0][a1]amix=inputs=2[a]`,
        '-map',
        '0:v',
        '-map',
        '[a]',

        // '-c:a',
        // 'libvorbis',
        // '-af',
        // 'volume=enable:volume=100',
        // '-filter_complex',
        // 'amix=inputs=2',


      ])

      // video
      .concat([
        '-c',
        'copy',
        '-c:v',
        'libx264', // c:v - H.264
        '-profile:v',
        'main', // profile:v - main profile: mainstream image quality. Provide I / P / B frames
        '-preset',
        'medium', // preset - compromised encoding speed
        '-crf',
        crf, // crf - The range of quantization ratio is 0 ~ 51, where 0 is lossless mode, 23 is the default value, 51 may be the worst
        '-movflags',
        'faststart',
        '-pix_fmt',
        'yuv420p',
        '-r',
        fps,
        '-b:v',
        bv,
      ]);

    return opts;
  }

  /**
   * Add ffmpeg output configuration
   * @private
   */
  addOutputOptions() {
    const { conf, creator } = this;
    const outputOptions = [];
    // default
    const defaultOpts = this.getDefaultOutputOptions(conf);
    FFmpegUtil.concatOpts(outputOptions, defaultOpts);

    // audio
    const audio = conf.getVal('audio');
    if (!isEmpty(audio)) {
      let apro = '';
      if (ScenesUtil.hasTransition(creator)) {
        const index = ScenesUtil.getLength(creator);
        apro += `-map ${index}:a `;
      }

      FFmpegUtil.concatOpts(outputOptions, `${apro}-c:a aac -shortest`.split(' '));
    }
    this.command.outputOptions(outputOptions);
  }

  /**
   * Set ffmpeg input path
   * @private
   */
  addOutput() {
    const { conf } = this;
    const output = conf.getVal('output');
    const dir = path.dirname(output);
    fs.ensureDir(dir);
    this.command.output(output);
  }

  /**
   * Add FFmpeg event to command
   * @private
   */
  addCommandEvents() {
    const { conf, command, creator } = this;
    const totalFrames = creator.getTotalFrames();
    const debug = conf.getVal('debug');

    // start
    command.on('start', commandLine => {
      const log = conf.getVal('log');
      if (log) console.log('最后合成',commandLine);
      this.emits({ type: 'synthesis-start', command: commandLine });
    });

    // progress
    command.on('progress', progress => {
      const percent = progress.frames / totalFrames;
      this.emits({ type: 'synthesis-progress', percent });
    });

    // complete
    command.on('end', () => {
      if (!debug) this.deleteCacheFile();
      const output = conf.getVal('output');
      this.emits({ type: 'synthesis-complete', path: output, output });
    });

    // error
    command.on('error', (error, stdout, stderr) => {
      if (!debug) this.deleteCacheFile();
      // const log = conf.getVal('log');
      // if (logFFmpegError)

      this.emits({
        type: 'synthesis-error',
        error: `${error} \n stdout: ${stdout} \n stderr: ${stderr}`,
        pos: 'Synthesis',
      });
    });
  }

  // 删除 txt
  deleteCacheFile() {
    if (this.txtpath) rmfr(this.txtpath);
  }

  destroy() {
    this.conf = null;
    this.creator = null;
    this.command = null;
    super.destroy();
  }
}

module.exports = Synthesis;
