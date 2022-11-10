const electron = require('electron');
const BrowserView= electron.BrowserView
const shell =electron.shell
module.exports = function (ventanaPrincipal=BrowserView) { 
    try {
          /* Me permite abrir una url en mi navegador predeterminado */
  ventanaPrincipal.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes("https://accounts.google.com")) {
      let win = {
        action: "allow",
        overrideBrowserWindowOptions: {
          width: 500,
          height: 620,
          titleBarOverlay: true,
          titleBarStyle: "hidden",
        },
      };
      return win;
    } else {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
        
    } catch (error) {
        
    }
}