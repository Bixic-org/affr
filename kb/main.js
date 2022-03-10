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
        _txt += aposSplit[_].match(/^[A-ZА-ЯƢ]/) ? 'Fh' : 'fh';
        _txt += aposSplit[_].slice(0, 1).toLowerCase() + aposSplit[_].slice(1);
    }
    txt = _txt;

    const charsList = [
        ['ƣ', 'ff'],
        ['б', 'md'],
        ['г', 'mz'],
        ['д', 'ft'],
        ['ж', 'jz'],
        ['м', 'mn'],
        ['п', 'mt'],
        ['ф', 'ms'],
        ['ч', 'fs'],
        ['ш', 'js'],
        ['ъ', 'fk'],
        ['ā', 'fa'],
        ['ē', 'fe'],
        ['ī', 'fi'],
        ['ō', 'fo'],
        ['ū', 'fu'],
    ];
    for (_ = 0; _ < charsList.length; _ ++) {
        txt = txt.replaceAll(charsList[_][0], charsList[_][1]);
        txt = txt.replaceAll(charsList[_][0].toUpperCase(),
                charsList[_][1].slice(0, 1).toUpperCase() + charsList[_][1].slice(1));
    }

    txt = txt.replace(/a[Aa]/g, 'fa');
    txt = txt.replace(/e[Ee]/g, 'fe');
    txt = txt.replace(/i[Ii]/g, 'fi');
    txt = txt.replace(/o[Oo]/g, 'fo');
    txt = txt.replace(/u[Uu]/g, 'fu');
    txt = txt.replace(/A[Aa]/g, 'Fa');
    txt = txt.replace(/E[Ee]/g, 'Fe');
    txt = txt.replace(/I[Ii]/g, 'Fi');
    txt = txt.replace(/O[Oo]/g, 'Fo');
    txt = txt.replace(/U[Uu]/g, 'Fu');

    return txt;
}

function __ltnR2so(txt) { // Second Orthography
    aposSplit = txt.split(/F[Hh]/);
    _txt = aposSplit[0];
    for (_ = 1; _ < aposSplit.length; _ ++) {
        _txt += "'" + aposSplit[_].slice(0, 1).toUpperCase() + aposSplit[_].slice(1);
    }
    txt = _txt;

    const charsList = [
        ['ƣ', 'ff'],
        ['б', 'md'],
        ['г', 'mz'],
        ['д', 'ft'],
        ['ж', 'jz'],
        ['м', 'mn'],
        ['п', 'mt'],
        ['ф', 'ms'],
        ['ч', 'fs'],
        ['ш', 'js'],
        ['ъ', 'fk'],
        ['ā', 'fa'],
        ['ē', 'fe'],
        ['ī', 'fi'],
        ['ō', 'fo'],
        ['ū', 'fu'],
        ["'", 'fh'],
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
    const charsList = {
        'ff': 'ʕ',
        'md': 'd̼',
        'mz': 'ð̼',
        'ft': 'tʼ',
        'jz': 'ʐ',
        'mn': 'n̼',
        'mt': 't̼',
        'ms': 'θ̼',
        'fs': 't͡ɬʼ',
        'js': 'ʂ',
        'fk': 'qʼ',
        'fh': 'ʔ',
        'fa': 'ɶː',
        'fe': 'øː',
        'fi': 'yː',
        'fo': 'ɤː',
        'fu': 'ɯː',
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

    txt = txt.toLowerCase();
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
    // ↓ここもっと簡略化できないものか
    _txt = null;
    while (txt != _txt) {
        _txt = txt;
        txt = txt.replace(/([ɖɳʈʐ](ʂ|ɬ|ɮ|t͡ɬʼ|ɭ̊˔|ɭ˔|ʈ͡ɭ̊˔ʼ)*)t͡ɬʼ/g, '$1ʈ͡ɭ̊˔ʼ');
        txt = txt.replace(/t͡ɬʼ((ʂ|ɬ|ɮ|t͡ɬʼ|ɭ̊˔|ɭ˔|ʈ͡ɭ̊˔ʼ)*[ɖɳʈʐ])/g, 'ʈ͡ɭ̊˔ʼ$1');
        txt = txt.replace(/([ɖɳʈʐ](ʂ|ɬ|ɮ|t͡ɬʼ|ɭ̊˔|ɭ˔|ʈ͡ɭ̊˔ʼ)*)ɬ/g, '$1ɭ̊˔');
        txt = txt.replace(/ɬ((ʂ|ɬ|ɮ|t͡ɬʼ|ɭ̊˔|ɭ˔|ʈ͡ɭ̊˔ʼ)*[ɖɳʈʐ])/g, 'ɭ̊˔$1');
        txt = txt.replace(/([ɖɳʈʐ](ʂ|ɬ|ɮ|t͡ɬʼ|ɭ̊˔|ɭ˔|ʈ͡ɭ̊˔ʼ)*)ɮ/g, '$1ɭ˔');
        txt = txt.replace(/ɮ((ʂ|ɬ|ɮ|t͡ɬʼ|ɭ̊˔|ɭ˔|ʈ͡ɭ̊˔ʼ)*[ɖɳʈʐ])/g, 'ɭ˔$1');
    }

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
    txt = txt.replaceAll('fa', 'aa');
    txt = txt.replaceAll('fe', 'ee');
    txt = txt.replaceAll('fi', 'ii');
    txt = txt.replaceAll('fo', 'oo');
    txt = txt.replaceAll('fu', 'uu');
    txt = txt.replaceAll('Fa', 'Aa');
    txt = txt.replaceAll('Fe', 'Ee');
    txt = txt.replaceAll('Fi', 'Ii');
    txt = txt.replaceAll('Fo', 'Oo');
    txt = txt.replaceAll('Fu', 'Uu');
    return txt;
}

// const charsList = [
//   ['ƣ', 'ʕ',   'ff'],
//   ['б', 'd̼',   'md'],
//   ['г', 'ð̼',   'mz'],
//   ['д', 'tʼ',  'ft'],
//   ['ж', 'ʐ',   'jz'],
//   ['м', 'n̼',   'mn'],
//   ['п', 't̼',   'mt'],
//   ['ф', 'θ̼',   'ms'],
//   ['ч', 't͡ɬʼ', 'fs'],
//   ['ш', 'ʂ',   'js'],
//   ['ъ', 'qʼ',  'fk'],
//   ["'", 'ʔ',   'fh'],
//   ['p', 'ʙ̥'],
//   ['ā', 'ɶː',  'fa'],
//   ['ē', 'øː',  'fe'],
//   ['ī', 'yː',  'fi'],
//   ['ō', 'ɤː',  'fo'],
//   ['ū', 'ɯː',  'fu'],
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
