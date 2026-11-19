/* 通行碼規則（網址：/antwOnline=<通行碼>）
   1. 只用 0-9 與大寫 A-Z
   2. 數字字元的總和 ≤ 48
   3. 英文字母換算成數字（A=1 … Z=26）後，所有字元合計的數字位數 ≤ 64
   例：0EEE0EEE0EEE0E → 數字總和 0、換算後共 14 位 */
(function (root) {
  'use strict';
  var MAX_DIGIT_SUM = 48;
  var MAX_DIGIT_LEN = 64;
  var LENGTH = 14;
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var KEY = 'antw_pass';
  var TTL = 30 * 60 * 1000; // 30 分鐘

  function stats(t) {
    var sum = 0, len = 0;
    for (var i = 0; i < t.length; i++) {
      var c = t.charAt(i);
      if (c >= '0' && c <= '9') { sum += +c; len += 1; }
      else { len += String(c.charCodeAt(0) - 64).length; }
    }
    return { sum: sum, len: len };
  }

  function valid(t) {
    if (typeof t !== 'string' || !/^[0-9A-Z]+$/.test(t)) return false;
    var s = stats(t);
    return s.sum <= MAX_DIGIT_SUM && s.len <= MAX_DIGIT_LEN;
  }

  function make() {
    for (var n = 0; n < 1000; n++) {
      var buf = new Uint8Array(LENGTH), out = '';
      crypto.getRandomValues(buf);
      for (var i = 0; i < LENGTH; i++) out += CHARS.charAt(buf[i] % 36);
      if (valid(out)) return out;
    }
    return '0EEE0EEE0EEE0E';
  }

  function save(t) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ pass: t, exp: Date.now() + TTL })); } catch (e) {}
  }

  function check(t) {
    var rec = null;
    try { rec = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
    return !!(valid(t) && rec && rec.pass === t && Date.now() < rec.exp);
  }

  function clear() { try { sessionStorage.removeItem(KEY); } catch (e) {} }

  root.ANTW_PASS = { make: make, valid: valid, stats: stats, save: save, check: check, clear: clear };
})(window);
