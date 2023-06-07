'use strict';

/**
 * FFVideoa - Video component-based display component
 *
 * ####Example:
 *
 *     const video = new FFVideoa({ path, width: 500, height: 350, loop: true });
 *     scene.addChild(video);
 *
 *
 * @class
 */
const path = require('path');
const isNumber = require('lodash/isNumber');
const FFmpegUtil = require('../utils/ffmpeg');
const FFImage = require('./image');
const DateUtil = require('../utils/da');
const FS = require('../utils/fs');
const DEFAULT_TIME = '-1';

class FFVideoa extends FFImage {
  constructor(conf) {
    super({ type: 'video', ...conf });
    this.vcommand = FFmpegUtil.createCommand();
    this.startTime = DEFAULT_TIME; // "00:00:15"
    // 如果有开始（ss）时间，开头时间以ss
    if(conf.ss) this.setTDuration(conf.ss);
    this.sustainTime = conf.tt || DEFAULT_TIME; // 持续时间 0s
    // 镜头时长
    this.vDuration = this.sustainTime
    this.newVideoPath = this.getPath() // 视频新路径，没有转换，就取输入的
  }

  getConf() {
    const conf = this.conf;
    console.log('conf',conf)
  }

  /**
   * Set start  time
   * @param {string|number} startTime - start time
   * @public
   */
  setTDuration(startTime) {
    this.setStartTime(startTime);
  }

  /**
   * Set start time
   * @param {string|number} startTime - start time
   * @public
   */
  setStartTime(startTime) {
    if (startTime === undefined) return;
    if (startTime === DEFAULT_TIME) return;
    startTime = DateUtil.secondsToHms(startTime);
    this.startTime = startTime;
  }

  /**
   * Add video ffmpeg input
   * ex: loop 1 -t 20  -i imgs/logo.png
   * @private
   */
   addInput(command) {
    const { loop, delay } = this.conf;
    let videoPath = this.newVideoPath
    if (loop) {
      const num = isNumber(loop) ? isNumber(loop) : -1;
      command.addInput(videoPath).inputOption('-stream_loop', `${num}`);
    } else {
      command.addInput(videoPath);
    }
    if (delay) command.inputOption('-itsoffset', delay);
  }

  addOutput(command) {
    if (this.conf.audio) {
      command.outputOptions(["-map", `${this.index}:a`]);
    }
  }

  setLoop(loop) {
    this.conf.loop = loop;
  }

  setDelay(delay) {
    this.conf.delay = delay;
  }

  // 开始读
  isReady(cachePath) {
    return new Promise(async(resolve, reject) => {
      let that = this
      const rootConf = this.rootConf();
      let videoPath = this.getPath()
      let newVideoPath = path.join(cachePath, `${this.id}_input.mp4`);
      // console.log('转换视频-videoPath',{videoPath,newVideoPath})
      that.vcommand.addInput(videoPath);

      const fps = rootConf.getVal('fps');
      if (fps != 25) that.vcommand.outputFPS(fps);
      let infoObj =   await FFmpegUtil.getVideoInfo(videoPath);
      if (that.sustainTime != DEFAULT_TIME){
        if (that.startTime === DEFAULT_TIME){
          // 没定开始时间，则随机开始

          // 获取 视频信息
          let videoInfo =  {
            width:infoObj.streams[0].width || 0,
            height:infoObj.streams[0].height || 0,
            height:infoObj.streams[0].height || 0,
            duration:infoObj.format.duration || 0,
            size:infoObj.format.size || 0,
          }
          let duration = Math.floor(videoInfo.duration * 100) / 100
          if(that.sustainTime<duration){
            let maxLen = duration - that.sustainTime // 最大值
            let randNum = Math.random() * maxLen
            let startNum = Math.floor(randNum * 100) / 100 // 开始时间
            that.setTDuration(startNum);
            that.vcommand.inputOption('-ss', that.startTime);
            that.vcommand.inputOption('-t', that.sustainTime);
            const log = rootConf.getVal('log');
            if (log) {
              console.log('随机开始',{
              	duration,
              	maxLen,
              	randNum,
              	startNum,
                startTime:that.startTime,
                sustainTime:that.sustainTime
              })
            }
          }
        }else{
          // 有开始时间，用开始时间
          that.vcommand.inputOption('-ss', that.startTime);
          that.vcommand.inputOption('-t', that.sustainTime);
        }
      }

      that.vcommand.outputOptions(['-c copy']);
      that.vcommand.output(newVideoPath);

      that.vcommand
        .on('start', commandLine => {
          const log = rootConf.getVal('log');
          if (log) console.log('转换视频',commandLine);
          // that.emits({ type: 'transform-start', command: commandLine });

          // console.log({ pos: 'FFVideoa', msg: `转换视频 ffmpeg: ${commandLine}` });
        })
        .on('progress', progress => {

          // const totalFrames = this.parent.getTotalFrames();
          // const percent = progress.frames / totalFrames;
          // that.emits({type:'progress',percent:percent});

          // console.log({
          //     percent: percent,
          //     msg: `进度-progress progress.frames: ${progress.frames}`,
          //   });

        })
        .on('end', () => {
          // console.log({
          //     pos: 'FFVideoa',
          //     msg: `结束-end Video preProcessing completed:`,
          //   });
          that.newVideoPath = newVideoPath
          resolve();
        })
        .on('error', err => {
          // console.log({ pos: 'FFVideo', msg: ` 结束-error Video preProcessing error`, error: err });
          reject(err);
        });

      that.vcommand.run();
    });

  }





}

module.exports = FFVideoa;
