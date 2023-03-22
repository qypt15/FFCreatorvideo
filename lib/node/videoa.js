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
    this.startTime = DEFAULT_TIME; //"00:00:15"
    this.endTime = DEFAULT_TIME; //"00:00:15"

    if(conf.ss) this.setDuration(conf.ss, conf.to);
  }

  /**
   * Set start/end time
   * @param {string|number} startTime - start time
   * @param {string|number} endTime - end time
   * @public
   */
  setDuration(startTime, endTime) {
    this.setStartTime(startTime);
    this.setEndTime(endTime);
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
   * Set end time
   * @param {string|number} endTime - end time
   * @public
   */
  setEndTime(endTime) {
    if (endTime === undefined) return;
    if (endTime === DEFAULT_TIME) return;

    endTime = DateUtil.secondsToHms(endTime);
    this.endTime = endTime;
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
    if (delay) command.inputOption('-itsoffset', delay);
  }

  addOutput(command) {
    if (this.conf.audio) {
      command.outputOptions(["-map", `${this.index}:a`]);
    }
     console.log('this.endTime',this.endTime)
    let ssOpt = this.endTime === DEFAULT_TIME ? '' : ['-ss', this.startTime, '-to', this.endTime];
    if (ssOpt !== '') {
      command.outputOptions(ssOpt);
    }

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
}

module.exports = FFVideoa;
