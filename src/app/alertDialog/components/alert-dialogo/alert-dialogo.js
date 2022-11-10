const electron = require('electron');
/* https://www.electronjs.org/docs/latest/api/browser-window#new-browserwindowoptions */
/* https://github.com/peterfreeman/electron-osx-prompt */
const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;
const ipcMain = electron.ipcMain || electron.remote.ipcMain;

const url = require('url');
const path = require('path');

function InputPrompt (_label = 'Insertar la URL', _placeholder = 'https://www.google.com', _icon = '',_urlValue='', _masked =false,) {
  return new Promise((resolve, reject) => {
    if (_icon == null) {
      _icon = path.join(__dirname, "../../../assets/img/icon-dialogo-alert.png");
    }
    let promptWindow = new BrowserWindow({
      width: 450,
      height: 160,
      skipTaskbar: true,
      alwaysOnTop: false,
      backgroundColor: '#ECECEC',
      show: false,
      frame: false,
      resizable: false,
      parent: BrowserWindow.getFocusedWindow(),
      modal: true,
       webPreferences: {
        preload: path.join(__dirname, "./alert-dialogo.preload.js")
      },
    });

    promptWindow.setMenu(null);
    promptWindow.loadFile(
      path.join(__dirname, "./alert-dialogo.component.html")
    );

    let options = {
      label: _label.toString(),
      placeholder: _placeholder.toString(),
      icon: _icon.toString(),
      masked: _masked,
      urlValue:_urlValue.toString(),
    };

    promptWindow.webContents.on('did-finish-load', () => {
      promptWindow.webContents.send('electron-osx-prompt-settings', options);
    /* promptWindow.webContents.openDevTools(); */
    });

    promptWindow.once('ready-to-show', promptWindow.show);

    const returnValue = (event, value) => {
      resolve(value);
      if (promptWindow) {
        promptWindow.close();
        promptWindow = null;
      }
    };

    ipcMain.on('electron-osx-prompt-return-value', returnValue);
  });
}

module.exports = InputPrompt;