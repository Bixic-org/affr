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
  /*
    2nd-ortho             第二正書法
    ipa                   IPA (音素)
    ipa-phonetic          IPA (音声)
    ltn-trans             羅字転写
    ltn-trans-reversible  羅字転写 (長母音f型=逆変換一意)
    gulja                 㐎字転写 (未制定)
  */
  txt = __toLtnR(txt);
  
  if (outputType == '2nd-ortho') {
    txt = __ltnR2so(txt);
  } else if (outputType == 'ipa') {
    txt = __ltnR2ipa(txt);
  } else if (outputType == 'ipa-phonetic') {
    txt = __ltnR2ipa(txt);
    txt = __ipa2ipaPhonetic(txt);
  } else if (outputType == 'ltn-trans') {
    txt = __ltnR2ltn(txt);
  // } else if (outputType == 'gulja') {
  //   txt = __ltnR2gj(txt);
  } else { // outputType == 'ltn-trans-reversible'
    ;
  }
  
  return txt;
}

function __toLtnR(txt) { // LaTiN Reversible
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
  ];
  for (_ = 0; _ < charsList.length; _ ++) {
    txt = txt.replaceAll(charsList[_][0], charsList[_][1]);
    txt = txt.replaceAll(charsList[_][0].toUpperCase(), charsList[_][1].toUpperCase());
  }

  txt = txt.replace(/(A|a)[Aa]/g, '$1f');
  txt = txt.replace(/(E|e)[Ee]/g, '$1f');
  txt = txt.replace(/(I|i)[Ii]/g, '$1f');
  txt = txt.replace(/(O|o)[Oo]/g, '$1f');
  txt = txt.replace(/(U|u)[Uu]/g, '$1f');

  return txt;
}

function __ltnR2so(txt) { // Second Orthography
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

function __ltnR2ipa(txt) {
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

function __ipa2ipaPhonetic(txt) {
  txt = txt.replace(/([ɖɳʈʐʂ])ɬ/g, '$1ɭ̊˔');
  txt = txt.replace(/([ɖɳʈʐʂ])ɮ/g, '$1ɭ˔');
  txt = txt.replace(/ɬ([ɖɳʈʐʂ])/g, 'ɭ̊˔$1');
  txt = txt.replace(/ɮ([ɖɳʈʐʂ])/g, 'ɭ˔$1');

  const affricatesList = [
    ['t̼', 'θ̼'],
    ['d̼', 'ð̼'],
    ['ʈ', 'ʂ'],
    ['ɖ', 'ʐ'],
    ['ʈ', 'ɭ̊˔'],
    ['ɖ', 'ɭ˔'],
    ['ɢ', 'ʁ'],
  ];
  for (_ = 0; _ < affricatesList.length; _ ++) {
    txt = txt.replaceAll(
      affricatesList[_][0] + affricatesList[_][1],
      affricatesList[_][0] + '͡' + affricatesList[_][1]
    );
  }

  return txt;
}

function __ltnR2ltn(txt) {
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
