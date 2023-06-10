const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');
const inquirer = require('inquirer');

const printRestartInfo = () =>
  console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));

const clearAllFiles = () => {
  fs.remove(path.join(__dirname, './output'));
  fs.remove(path.join(__dirname, './cache'));
};

const choices = [
  {
    name: 'image-Picture animation video',
    value: 'image',
  },
  {
    name: 'text-Multiple text combinations',
    value: 'text',
  },
  {
    name: 'animate-Animation effect display',
    value: 'animate',
  },
  {
    name: 'transition-Scene transition effect',
    value: 'transition',
  },
  {
    name: 'dev-test',
    value: 'dev-test',
  },
  {
    name: 'test',
    value: 'test',
  },
  {
    name: 'videoa',
    value: 'videoa',
  },
  {
    name: 'video-Video animation demo',
    value: 'video',
  },
  {
    name: 'live-Push live rtmp stream',
    value: 'live',
  },
  {
    name: 'clear-Clear all caches and videos',
    value: 'clear',
    func: clearAllFiles,
  },
  new inquirer.Separator(),
];

const runDemo = answer => {
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (choice.value === answer.val) {
      if (answer.val !== 'clear') printRestartInfo();
      choice.func();
      break;
    }
  }
};

const initCommand = () => {
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    choice.name = `(${i + 1}) ${choice.name}`;
    if (choice.type !== 'separator' && choice.value)
      choice.func = choice.func || require(path.join(__dirname, `./${choice.value}`));
  }

  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Please select the demo you want to run:',
        name: 'val',
        choices,
        pageSize: choices.length,
        validate: function(answer) {
          if (answer.length < 1) {
            return 'You must choose at least one topping.';
          }
          return true;
        },
      },
    ])
    .then(runDemo);
};

initCommand();
