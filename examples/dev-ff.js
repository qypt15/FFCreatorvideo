
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const inputFilePath = path.join(__dirname, './assets/video/video1.mp4');
const outputFilePath = path.join(__dirname, './output/output.mp4');
const startTime = 1; // 从视频开头开始选择
const duration = 5; // 选择 5 秒

ffmpeg(inputFilePath)
  // .selectPeakAudio() // 根据音频峰值进行选择
  // .start(startTime) // 从 startTime 开始选择
  .duration(duration) // 选择 duration 秒
  .save(outputFilePath)
  .on('end', () => {
    console.log('随机截取的视频已保存到', outputFilePath);
  })
  .on('error', (err) => {
    console.error('发生错误：', err);
  });



  // ffmpeg()
  //     .addOptions([`-version`])
  //     .output('./')
  //     .on('end', (result = '') => {
  //       result = result.replace(/copyright[\s\S]*/gi, '');
  //       let version = result.split(' ')[2];
  //       version = version.split('.').join('');
  //       resolve(parseInt(version));
  //     })
  //     .on('error', () => {
  //       let version = '4.2.2';
  //       version = version.split('.').join('');
  //       resolve(parseInt(version));
  //     })
  //     .run();
  // });
