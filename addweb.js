(function () {
  'use strict';
  // 網址格式：/antwOnline=<通行碼>
  var m = location.pathname.match(/^\/antwOnline=([0-9A-Za-z]+)\/?$/);
  var pass = m ? m[1] : '';

  if (ANTW_PASS.check(pass)) {
    document.getElementById('pass-show').textContent = pass;
    document.getElementById('ok').hidden = false;
  } else {
    ANTW_PASS.clear();
    document.title = '此網頁已過期｜台灣匿名平台';
    document.getElementById('expired').hidden = false;
  }
})();
