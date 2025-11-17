function JsToAdvpl(codeType, content){

    if (codeType == 'loadZBCLibCore') {
        localStorage.setItem('loadZBCLibCore',content);
    }
    if (codeType == 'salvarCredito') {
        localStorage.setItem('salvarCredito',content);
    }
}