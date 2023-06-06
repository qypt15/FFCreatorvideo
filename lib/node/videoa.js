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
const isNumber = require('lodash/isNumber');
const FFImage = require('./image');
const DateUtil = require('../utils/da');

const DEFAULT_TIME = '-1';

class FFVideoa extends FFImage {
  constructor(conf) {
    console.log('conf-conf',conf)
    super({ type: 'video', ...conf });

    this.startTime = DEFAULT_TIME; // "00:00:15"
    this.sustainTime = conf.tt; // 持续时间 0s
    if(conf.ss) this.setTDuration(conf.ss);
  }

  // constructor(conf = { x: 0, y: 0, ss:0, animations: [] }) {
  //   super({ type: 'video', ...conf });
  // }

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
    console.log('DateUtil-startTime',startTime)
    this.startTime = startTime;
  }


  /**
   * Add video ffmpeg input
   * ex: loop 1 -t 20  -i imgs/logo.png
   * @private
   */
  addInput(command) {
    const { loop, delay } = this.conf;



    if (loop) {
      const num = isNumber(loop) ? isNumber(loop) : -1;
      command.addInput(this.getPath()).inputOption('-stream_loop', `${num}`);
    } else {
      command.addInput(this.getPath());
    }

    console.log('this.sustainTime',this.sustainTime)
    if (this.sustainTime != 0){
      command.inputOption('-ss', this.startTime);
      command.inputOption('-t', this.sustainTime);
    }

    if (delay) command.inputOption('-itsoffset', delay);
   

  }


  addOutput(command) {
    if (this.conf.audio) {
      command.outputOptions(["-map", `${this.index}:a`]);
    }



    // console.log('this.endTime',this.endTime)
    // let ssOpt = this.endTime === DEFAULT_TIME ? '' : ['-ss', this.startTime, '-to', this.endTime];
    // if (ssOpt !== '') {
    //   command.outputOptions(ssOpt);
    // }

  }

  setLoop(loop) {
    this.conf.loop = loop;
  }

  setDelay(delay) {
    this.conf.delay = delay;
  }

  isReady() {
    return new Promise(resolve => resolve());
  }

  /**
   * Extract the images file from the movie
   * @private
   */
  extractVideo() {
    return new Promise((resolve, reject) => {
      const fps = this.rootConf('fps');
      const qscale = this.clarity;
      let opts = `-loglevel info -pix_fmt rgba -start_number 0 -vf fps=${fps} -qscale:v ${qscale}`.split(
        ' ',
      );
      console.log('opts',opts)
      let times = this.endTime === DEFAULT_TIME ? [] : ['-ss', this.startTime, '-to', this.endTime];
      opts = opts.concat(times);
      console.log('concat-opts',opts)
      this.materials.path = this.getVOutput();
      this.vcommand.addInput(this.getPath());
      this.vcommand.inputOptions(this.codec ? ['-c:v', this.codec] : []);
      this.vcommand.outputOptions(opts);
      this.vcommand.output(this.materials.path);
      this.vcommand
        .on('start', commandLine => {
          FFLogger.info({ pos: 'FFVideo', msg: `开始-start Video preProcessing start: ${commandLine}` });
        })
        .on('progress', progress => {
          FFLogger.info({
              pos: 'FFVideo',
              msg: `进度-progress progress.frames: ${progress.frames}`,
            });
          this.materials.length = progress.frames;
        })
        .on('end', () => {
          FFLogger.info({
            pos: 'FFVideo',
            msg: `结束-end Video preProcessing completed: ${this.materials}`,
          });
          resolve();
        })
        .on('error', err => {
          FFLogger.error({ pos: 'FFVideo', msg: ` 结束-error Video preProcessing error`, error: err });
          reject(err);
        });
      this.vcommand.run();
    });
  }

}

module.exports = FFVideoa;
