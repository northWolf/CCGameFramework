'use strict';

module.exports = {
  load () {
    // 当 package 被正确加载的时候执行
    Editor.log('打开Tools面板');
  },

  unload () {
    // 当 package 被正确卸载的时候执行
    Editor.log('关闭Tools面板');
  },

  messages: {
    'openPanel' () {
      Editor.Panel.open('tools');
    }
  },
};
