function JsToAdvpl(codeType, content){

    if (codeType == 'loadZBCLibCore') {
        localStorage.setItem('loadZBCLibCore',content);
    }
    if (codeType == 'salvarCredito') {
        localStorage.setItem('salvarCredito',content);
    }
    if (codeType == 'novoColaborador') {
        localStorage.setItem('novoColaborador',content);
    }
    if (codeType == 'editarPeriodo') {
        localStorage.setItem('editarPeriodo',content);
    }
}