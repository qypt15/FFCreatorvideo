const path = require('path');
const colors = require('colors');

const { FFCreatorCenter, FFScene, FFImage, FFText, FFVideo,FFVideoa, FFCreator,FFContext } = require('../');

// 创作者
// 镜头：

// 合成


const createFFTask = () => {
  const img3 = path.join(__dirname, './assets/imgs/06.png');
  const logo = path.join(__dirname, './assets/imgs/logo/logo2.png');
  let font = path.join(__dirname, './assets/font/scsf.ttf');
  console.log('font1',font)
  font = font.replace(/\\/g,"/");
  console.log('font2',font)
  const audio = path.join(__dirname, './assets/audio/03.wav');
  const mp3 = path.join(__dirname, './assets/audio/01.mp3');

  const video1 = path.join(__dirname, './assets/video/video1.mp4');
  const video2 = path.join(__dirname, './assets/video/video2.mp4');
  const video3 = path.join(__dirname, './assets/video/video3.mp4');
  const video4 = path.join(__dirname, './assets/video/video4.mp4');

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

  });
   console.log('audio-mp3',mp3)
   creator.addAudio(mp3)
   creator.setAudioVolume(0.1)
   creator.setVideoVolume(1)


  // create FFScene
  const scene1 = new FFScene();

  scene1.setBgColor('#9980fa');
  let tt = 8
  const fvideo1 = new FFVideoa({
      path: video1,
       audio: true,
      x:0,
      y:height/3*1,
       tt
    });

  fvideo1.on('progress', e => {
   console.log(colors.yellow(`第1个视频-转换 :  ${(e.percent) >> 0}%`));
  });

  fvideo1.on('complete', e => {
   console.log(colors.yellow(`第1个视频-转换 完成`));
  });

  fvideo1.setScale(0.6);
  fvideo1.getConf();
  fvideo1.setAudio(false);
  fvideo1.setVolume(2.6)

  // 设置动画效果
  fvideo1.addEffect('moveInRight', 2.5, 0.2);

  scene1.addChild(fvideo1);


  scene1.setDuration(tt);
  //
  // const s1_context = new FFContext({ input: "input-FFContext"});
  // scene1.addChild(s1_context);

  // const fvideo2 = new FFVideo({ path: video2, audio: false,  x: 300, y: 330 });
  // fvideo2.setScale(0.3);
  // fvideo2.addEffect('moveInRight', 2.5, 3.5);
  // scene1.addChild(fvideo2);

  const s1_img1 = new FFImage({ path: img3, x: 60, y: 600 });
  s1_img1.setScale(0.4);
  s1_img1.addEffect('rotateInBig', 2.5, 1.5);
  scene1.addChild(s1_img1);

  // 文字

  const text1 = new FFText({ text: 'FFVideo案例', font:font, x: 140, y: 100, fontSize: 42 });
  text1.setColor('#ffffff');
  text1.setBorder(5, '#000000');
  //text1.addEffect('fadeIn', 2, 1);
  scene1.addChild(text1);

// 转场
  scene1.setTransition('slideright', 1.5);    // 转场 -设置过渡动画(类型, 时间)


  //
  creator.addChild(scene1);

  // create FFScene
   const scene2= new FFScene();
   scene2.setBgColor('#0980fa');
   let tt2 = 8
   const fvideo2 = new FFVideoa({
       path: video2,
        audio: true,
         x:0,
         y:height/3*1,
        tt:tt2
     });
  fvideo2.on('progress', e => {
    console.log(colors.yellow(`第2个视频-转换 :  ${(e.percent) >> 0}%`));
  });
  fvideo2.addEffect('moveInRight', 2.5, 0.2);
   fvideo2.on('complete', e => {
     console.log(colors.yellow(`第2个视频-转换 完成`));
   });
   fvideo2.setScale(0.6);
   fvideo2.setAudio(true);

   scene2.addChild(fvideo2);
   scene2.setDuration(tt2);

   const text2 = new FFText({ text: '案例66', font, x: 140, y: 100, fontSize: 42 });
   text2.setColor('#56ff12');
   text2.setBorder(5, '#000000');
   text2.addEffect('fadeIn', 2, 1);
   scene2.addChild(text2);
  scene2.setTransition('slideright', 1.5);    // 转场 -设置过渡动画(类型, 时间)
  
   creator.addChild(scene2);


  // 333
  const scene3= new FFScene();
  scene3.setBgColor('#ff62fa');
   let timeT = 5
  const fvideo3 = new FFVideoa({
       path: video3,
        audio: true,
         x:0,
         y:height/3*1,
        tt:timeT
     });

  fvideo3.addEffect('moveInRight', 2.5, 0.2);

   fvideo3.setScale(0.6);
   fvideo3.setAudio(false);

   scene3.addChild(fvideo3);
   scene3.setDuration(timeT);
 scene3.setTransition('slideright', 1.5);    // 转场 -设置过渡动画(类型, 时间)
  
   creator.addChild(scene3);

  // 444

const scene4= new FFScene();
  scene4.setBgColor('#098000');

  const fvideo4 = new FFVideoa({
       path: video4,
        audio: true,
         x:0,
         y:height/3*1,
        tt:timeT
     });

  fvideo4.addEffect('moveInRight', 2.5, 0.2);

   fvideo4.setScale(0.6);
   fvideo4.setAudio(false);

   scene4.addChild(fvideo4);
   scene4.setDuration(timeT);

   creator.addChild(scene4);



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
