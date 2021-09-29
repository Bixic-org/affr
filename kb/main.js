function bodyOnload() {
  inputboxFocus();
}

function inputboxFocus() {
  document.getElementById('txt-input').focus();
}

function convert() {
  elTxtInput = document.getElementById('txt-input');
  elTxtOutput = document.getElementById('txt-output');
  res = _txtCnv(_outputType(), elTxtInput.value);
  elTxtOutput.value = res;
}

function copyVal() {
  var elTxtOutput = document.getElementById('txt-output');
  elTxtOutput.selectionStart = 0;
  elTxtOutput.selectionEnd = elTxtOutput.value.length;
  elTxtOutput.focus();
  document.execCommand('copy');
  inputboxFocus();
}

function _outputType() {
  const elSelectOutputType = document.getElementById('select-output-type');
  return elSelectOutputType.options[elSelectOutputType.selectedIndex].value;
}

function _txtCnv(outputType, txt) {
  const typeList = {
    '2nd-ortho': 0,
    'ipa': 1,
    'ltn-trans': 2,
    'ltn-trans-reversible': 3,
    // 'gulja': 4
  };
  o = typeList[outputType];
  
  txt = __toLtnr(txt);
  
  if (o == 0) {
    txt = __ltnr2so(txt);
  } else if (o == 1) {
    txt = __ltnr2ipa(txt);
  } else if (o == 2) {
    txt = __ltnr2ltn(txt);
  // } else if (o == 4) {
  //   txt = __ltnr2gj(txt);
  } else { // o == 3
    ;
  }
  
  return txt;
}

function __toLtnr(txt) { // LaTiN Reversible
  aposSplit = txt.split("'");
  _txt = aposSplit[0];
  for (_ = 1; _ < aposSplit.length; _ ++) {
    _txt += aposSplit[_].match(/^[A-ZА-ЯƢ]/) ? 'Hf' : 'hf';
    _txt += aposSplit[_].slice(0, 1).toLowerCase() + aposSplit[_].slice(1);
  }
  txt = _txt;

  const charsList = [
    ['ƣ', 'ff'],
    ['б', 'dm'],
    ['г', 'zm'],
    ['д', 'tf'],
    ['ж', 'zj'],
    ['м', 'nm'],
    ['п', 'tm'],
    ['ф', 'sm'],
    ['ч', 'sf'],
    ['ш', 'sj'],
    ['ъ', 'kf'],
    ['ā', 'af'],
    ['ē', 'ef'],
    ['ī', 'if'],
    ['ō', 'of'],
    ['ū', 'uf'],
    ['aa', 'af'],
    ['ee', 'ef'],
    ['ii', 'if'],
    ['oo', 'of'],
    ['uu', 'uf'],
  ];

  for (_ = 0; _ < charsList.length; _ ++) {
    txt = txt.replaceAll(charsList[_][0], charsList[_][1]);
    txt = txt.replaceAll(charsList[_][0].toUpperCase(), charsList[_][1].slice(0, 1).toUpperCase() + charsList[_][1].slice(1));
  }

  return txt;
}

function __ltnr2so(txt) { // Second Orthography
  aposSplit = txt.split(/H[Ff]/);
  _txt = aposSplit[0];
  for (_ = 1; _ < aposSplit.length; _ ++) {
    _txt += "'" + aposSplit[_].slice(0, 1).toUpperCase() + aposSplit[_].slice(1);
  }
  txt = _txt;

  const charsList = [
    ['ƣ', 'ff'],
    ['б', 'dm'],
    ['г', 'zm'],
    ['д', 'tf'],
    ['ж', 'zj'],
    ['м', 'nm'],
    ['п', 'tm'],
    ['ф', 'sm'],
    ['ч', 'sf'],
    ['ш', 'sj'],
    ['ъ', 'kf'],
    ['ā', 'af'],
    ['ē', 'ef'],
    ['ī', 'if'],
    ['ō', 'of'],
    ['ū', 'uf'],
    ["'", 'hf'],
  ];

  for (_ = 0; _ < charsList.length; _ ++) {
    regex1 = new RegExp(
      charsList[_][1].slice(0, 1).toLowerCase()
      + '['
      + charsList[_][1].slice(1).toUpperCase()
      + charsList[_][1].slice(1).toLowerCase()
      + ']', 'g'); // /x[Yy]/g
    txt = txt.replace(regex1, charsList[_][0]);
    regex2 = new RegExp(charsList[_][1], 'ig'); // /xy/ig
    txt = txt.replace(regex2, charsList[_][0].toUpperCase());
  }

  return txt;
}

function __ltnr2ipa(txt) {
  txt = txt.toLowerCase();
  txt = txt.replaceAll('ff', 'ʕ');

  const charsList = {
    'dm': 'd̼',
    'zm': 'ð̼',
    'tf': 'tʼ',
    'zj': 'ʐ',
    'nm': 'n̼',
    'tm': 't̼',
    'sm': 'θ̼',
    'sf': 't͡ɬʼ',
    'sj': 'ʂ',
    'kf': 'qʼ',
    'hf': 'ʔ',
    'af': 'ɶː',
    'ef': 'øː',
    'if': 'yː',
    'of': 'ɤː',
    'uf': 'ɯː',
    'p': 'ʙ̥',
    'b': 'ʙ',
    'c': 'c',
    'd': 'ɖ',
    'g': 'ɢ',
    'h': 'ħ',
    'k': 'q',
    'l': 'ʁ',
    'n': 'ɳ',
    'q': 'ɟ',
    'r': 'r',
    's': 'ɬ',
    't': 'ʈ',
    'v': 'ⱱ',
    'w': 'ɰ',
    'x': 'x',
    'y': 'ɥ',
    'z': 'ɮ',
    'a': 'ɶ',
    'e': 'ø',
    'i': 'y',
    'o': 'ɤ',
    'u': 'ɯ',
  };

  res = '';
  while (txt) {
    if (charsList[txt.slice(0, 2)]) {
      res += charsList[txt.slice(0, 2)];
      txt = txt.slice(2);
    } else if (charsList[txt.slice(0, 1)]) {
      res += charsList[txt.slice(0, 1)];
      txt = txt.slice(1);
    } else {
      res += txt.slice(0, 1);
      txt = txt.slice(1);
    }
  }

  return res;
}

function __ltnr2ltn(txt) {
  txt = txt.replace(/([aeiou])[Ff]/g, '$1$1');
  txt = txt.replace(/A[Ff]/g, 'Aa');
  txt = txt.replace(/E[Ff]/g, 'Ee');
  txt = txt.replace(/I[Ff]/g, 'Ii');
  txt = txt.replace(/O[Ff]/g, 'Oo');
  txt = txt.replace(/U[Ff]/g, 'Uu');
  return txt;
}

// const charsList = [
//   ['ƣ', 'ʕ',   'ff'],
//   ['б', 'd̼',   'dm'],
//   ['г', 'ð̼',   'zm'],
//   ['д', 'tʼ',  'tf'],
//   ['ж', 'ʐ',   'zj'],
//   ['м', 'n̼',   'nm'],
//   ['п', 't̼',   'tm'],
//   ['ф', 'θ̼',   'sm'],
//   ['ч', 't͡ɬʼ', 'sf'],
//   ['ш', 'ʂ',   'sj'],
//   ['ъ', 'qʼ',  'kf'],
//   ["'", 'ʔ',   'hf'],
//   ['p', 'ʙ̥'],
//   ['ā', 'ɶː',  'af'],
//   ['ē', 'øː',  'ef'],
//   ['ī', 'yː',  'if'],
//   ['ō', 'ɤː',  'of'],
//   ['ū', 'ɯː',  'uf'],
//   ['b', 'ʙ'],
//   ['c', 'c'],
//   ['d', 'ɖ'],
//   ['g', 'ɢ'],
//   ['h', 'ħ'],
//   ['k', 'q'],
//   ['l', 'ʁ'],
//   ['n', 'ɳ'],
//   ['q', 'ɟ'],
//   ['r', 'r'],
//   ['s', 'ɬ'],
//   ['t', 'ʈ'],
//   ['v', 'ⱱ'],
//   ['w', 'ɰ'],
//   ['x', 'x'],
//   ['y', 'ɥ'],
//   ['z', 'ɮ'],
//   ['a', 'ɶ'],
//   ['e', 'ø'],
//   ['i', 'y'],
//   ['o', 'ɤ'],
//   ['u', 'ɯ'],
// ];
