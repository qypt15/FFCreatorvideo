[English](./README.md) | [简体中文](./README.zh-CN.md)
###免责声明： 代码源于 [](https://github.com/drawcall/FFCreatorLite)   FFCreatorvideo 作为分支开发，二次开发，满足自己的需求；如侵权，联系调整
### Features

- Based on node.js development, it is very simple to use and easy to expand and develop.
- Only rely on `FFmpeg`, easy to install, cross-platform, and low requirements for machine configuration.
- The video processing speed is extremely fast, a 5-7 minute video only takes 1 minute.
- Supports multiple elements such as pictures, sounds, video clips, and text.
- Support for adding music and animation to the live stream before launching.
- The latest version supports more than 30 scene transition animations.
- Contains 70% animation effects of `animate.css`, which can convert css animation to video.


## Useage

### Install npm Package

```javascript
npm install FFCreatorvideo --save
```

Note: To run the preceding commands, Node.js and npm must be installed.

#### Node.js

```javascript
const { FFCreatorCenter, FFScene, FFImage, FFText, FFCreator } = require('FFCreatorvideo');

// create creator instance
const creator = new FFCreator({
  cacheDir,
  outputDir,
  width: 600,
  height: 400,
  log: true,
});

// create FFScene
const scene1 = new FFScene();
const scene2 = new FFScene();
scene1.setBgColor('#ff0000');
scene2.setBgColor('#b33771');

// scene1
const fbg = new FFImage({ path: bg1 });
scene1.addChild(fbg);

const fimg1 = new FFImage({ path: img1, x: 300, y: 60 });
fimg1.addEffect('moveInRight', 1.5, 1.2);
scene1.addChild(fimg1);

const text = new FFText({ text: '这是第一屏', font, x: 100, y: 100 });
text.setColor('#ffffff');
text.setBackgroundColor('#000000');
text.addEffect('fadeIn', 1, 1);
scene1.addChild(text);

scene1.setDuration(8);
creator.addChild(scene1);

// scene2
const fbg2 = new FFImage({ path: bg2 });
scene2.addChild(fbg2);
// logo
const flogo = new FFImage({ path: logo, x: 100, y: 100 });
flogo.addEffect('moveInUpBack', 1.2, 0.3);
scene2.addChild(flogo);

scene2.setDuration(4);
creator.addChild(scene2);

creator.addAudio(audio);
creator.start();

creator.on('progress', e => {
  console.log(colors.yellow(`FFCreatorvideo progress: ${(e.percent * 100) >> 0}%`));
});

creator.on('complete', e => {
  console.log(
    colors.magenta(`FFCreatorvideo completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
  );
});
```

## About Transition

The latest version of FFCreatorvideo already supports scene transition animation, which means you can use it to make cool effects like ffcreator.

Of course you need to install [4.3.0](https://stackoverflow.com/questions/60704545/xfade-filter-not-available-with-ffmpeg) above version of ffmpeg. Because here is the [Xfade](https://trac.ffmpeg.org/wiki/Xfade) filter to achieve Animation.

#### useage

```javascript
// https://trac.ffmpeg.org/wiki/Xfade
scene.setTransition('diagtl', 1.5);
```

## Installation

### `FFCreatorvideo` depends on `FFmpeg`, so you need to install `FFmpeg`

FFCreatorvideo depends on `FFmpeg>=0.9` and above. Please set FFmpeg as a global variable, otherwise you need to use setFFmpegPath to add FFmpeg native path. (The ffmpeg for windows users is probably not in your `%PATH`, so you must set `%FFMPEG_PATH`)

```javascript
FFCreator.setFFmpegPath('...');
```

Of course, you can also compile ffmpeg on your machine, please see [https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu).

### `FFmpeg` Installation tutorial

> For more `FFmpeg` tutorials, please view [https://trac.ffmpeg.org/wiki](https://trac.ffmpeg.org/wiki)

- How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)
- How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- How to Install FFmpeg on Windows [http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
- How to Install FFmpeg on Mac OSX [https://trac.ffmpeg.org/wiki/CompilationGuide/macOS](https://trac.ffmpeg.org/wiki/CompilationGuide/macOS)

## Contribute

You are very welcome to join us in developing `FFCreatorvideo`, if you want to contribute code, please read [here](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
