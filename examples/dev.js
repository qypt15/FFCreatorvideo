const path = require('path');
const colors = require('colors');

const { FFCreatorCenter, FFScene, FFImage, FFText, FFVideo,FFVideoa, FFCreator } = require('../');

// 创作者
// 镜头：

// 合成


const createFFTask = () => {
  const img3 = path.join(__dirname, './assets/imgs/06.png');
  const logo = path.join(__dirname, './assets/imgs/logo/logo2.png');
  const font = path.join(__dirname, './assets/font/scsf.ttf');

  const audio = path.join(__dirname, './assets/audio/03.wav');
  const mp3 = path.join(__dirname, './assets/audio/a0.mp3');

  const video1 = path.join(__dirname, './assets/video/video1.mp4');
  const video2 = path.join(__dirname, './assets/video/video2.mp4');
  const video3 = path.join(__dirname, './assets/video/a.MP4');
  const video4 = path.join(__dirname, './assets/video/01.mp4');

  const cacheDir = path.join(__dirname, './cache/');
  const outputDir = path.join(__dirname, './output/');

  const width = 576;
  const height = 1024;

  // create creator instance
  const creator = new FFCreator({
    cacheDir,
    outputDir,
    width: width,
    height: height,
    log: false,
    debug:true,
    audio:mp3,
  });

  // creator.addAudio(audio)
   console.log('audio-mp3',mp3)


  // create FFScene
  const scene1 = new FFScene();

  scene1.setBgColor('#9980fa');

  // 视频转换格式 + 随机截取视频
  // const trans1 = new FFVTrans({ path: video1,tt:6.3});
  // trans1.start();
  let tt = 20

  // const fvideo = new FFVideo({
  // 	path: video.url,
  // 	// w:width,
  // 	// h:height,
  // 	x:width/2,
  // 	y:height/2,

  // });

  const fvideo1 = new FFVideoa({
      path: video3,
       audio: true,
      x:0,
      y:height/3*1,
       tt
    });

 fvideo1.on('progress', e => {
   // console.log(`FFVideoa -progress-进度 `,e);
   console.log(colors.yellow(`FFVideoa-模块 :  ${(e.percent) >> 0}%`));
 });

  fvideo1.setScale(0.6);
  fvideo1.getConf();
  fvideo1.setAudio(true);

  scene1.addChild(fvideo1);
  scene1.setDuration(tt);
  // const fvideo2 = new FFVideo({ path: video2, audio: false,  x: 300, y: 330 });
  // fvideo2.setScale(0.3);
  // fvideo2.addEffect('moveInRight', 2.5, 3.5);
  // scene1.addChild(fvideo2);

  // const fimg3 = new FFImage({ path: img3, x: 60, y: 600 });
  // fimg3.setScale(0.4);
  // fimg3.addEffect('rotateInBig', 2.5, 1.5);
  // scene1.addChild(fimg3);

  // const text1 = new FFText({ text: 'FFVideo案例', font, x: 140, y: 100, fontSize: 42 });
  // text1.setColor('#ffffff');
  // text1.setBorder(5, '#000000');
  // //text1.addEffect('fadeIn', 2, 1);
  // scene1.addChild(text1);

  //  scene1.setDuration(17);

  creator.addChild(scene1);

  // const scene2 = new FFScene();
  // scene2.setBgColor('#ea2228');

  creator.start();
  creator.openLog();

  creator.on('start', () => {
    console.log(`FFCreatorLite start`);
  });

  creator.on('error', e => {
    console.log(`FFCreatorLite error:: \n ${e.error}`);
  });

  creator.on('module-progress', e => {
     // console.log(`FFCreatorLite -progress-进度 `,e);
    console.log(colors.yellow(`模块 :${e.model_key},${e.model_name}, ${(e.percent * 100) >> 0}%`));
  });
  creator.on('progress', e => {
     // console.log(`FFCreatorLite -progress-进度 `,e);
    console.log(colors.yellow(`FFCreatorLite progress: ${(e.percent * 100) >> 0}%`));
  });

  creator.on('complete', e => {
    console.log(
      colors.magenta(`FFCreatorLite completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
    );

    console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
  });

  return creator;
};




FFCreatorCenter.addTask(createFFTask)
