[English](./README.md) | [简体中文](./README.zh-CN.md)



## 使用

### Install npm Package

```javascript
npm install ffvideo --save
```

Note: To run the preceding commands, Node.js and npm must be installed.

#### Node.js

```javascript
const { FFCreatorCenter, FFScene, FFImage, FFText, FFCreator } = require('ffvideo');

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
  console.log(colors.yellow(`ffvideo progress: ${(e.percent * 100) >> 0}%`));
});

creator.on('complete', e => {
  console.log(
    colors.magenta(`ffvideo completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
  );
});
```


#### 使用
```javascript
// https://trac.ffmpeg.org/wiki/Xfade
scene.setTransition('diagtl', 1.5);
```


## 安装依赖

### `ffvideo`依赖于`FFmpeg`，因此您需要安装`FFmpeg`

ffvideo 依赖于`FFmpeg>=0.9`以上版本。请设置 FFmpeg 为全局变量, 否则需要使用 setFFmpegPath 添加 FFmpeg 本机路径。(windows 用户的 ffmpeg 很可能不在您的`%PATH`中，因此您必须设置`%FFMPEG_PATH`)

```javascript
FFCreator.setFFmpegPath('...');
```

当然您也可以在你的机器上编译 ffmpeg, 编译教程请看[https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu](https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu)。

### 安装教程

> 更多`FFmpeg`教程请查看[https://trac.ffmpeg.org/wiki](https://trac.ffmpeg.org/wiki)

- How to Install and Use FFmpeg on CentOS [https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/](https://linuxize.com/post/how-to-install-ffmpeg-on-centos-7/)
- How to Install FFmpeg on Debian [https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/](https://linuxize.com/post/how-to-install-ffmpeg-on-debian-9/)
- How to Install FFmpeg on Windows [http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/](http://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
- How to Install FFmpeg on Mac OSX [https://trac.ffmpeg.org/wiki/CompilationGuide/macOS](https://trac.ffmpeg.org/wiki/CompilationGuide/macOS)


## License

[MIT](./LICENSE)
