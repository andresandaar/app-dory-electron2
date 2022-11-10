const electron = require('electron');
const BrowserView= electron.BrowserView
const net =electron.net
const viewCheckInternet = require('../../app/checkInternet/components/check-Internet/check-internet');
module.exports = function () { 
  this.controlError = (ventanaPrincipal=BrowserView) => {
    try {
          ventanaPrincipal.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (
        errorDescription === "ERR_NAME_NOT_RESOLVED" ||
        errorDescription === "ERR_INTERNET_DISCONNECTED" ||
        errorDescription === "ERR_TIMED_OUT" ||
        errorDescription === "ERR_CONNECTION_TIMED_OUT"
      ) {
        viewCheckInternet(ventanaPrincipal)
      }
    }
  );
  if (net.online) {
    viewCheckInternet(ventanaPrincipal)
  }
    } catch (error) {
        
    }
  }}