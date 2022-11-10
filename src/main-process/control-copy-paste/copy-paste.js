const contextMenu = require('electron-context-menu');
const electron = require('electron');
const shell =electron.shell

module.exports = function () { 
  contextMenu(
  {
    labels: {
        cut: 'Cortar',
        copy: 'Copiar',
        paste: 'Pegar',
    },
    showInspectElement:false,
    showCopyImage:false,
    showSearchWithGoogle:false,
    showLearnSpelling:false,
    prepend: (defaultActions, parameters, browserWindow) => [
		{
			label: 'Buscar en Google',
			visible: parameters.selectionText.trim().length > 0,
			click: () => {
				shell.openExternal(`https://google.com/search?q=${encodeURIComponent(parameters.selectionText)}`);
			}
		}
	]
})
}