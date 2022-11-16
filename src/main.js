const {
  app,
  BrowserWindow,
  BrowserView,
} = require("electron");

const path = require("path");
const controlTitleBar = require('./main-process/control-titleBar/control-titleBar.ipc');
const controlError = require('./main-process/control-error-main/control-errores');
const modalAlertInput = require('./main-process/modal-alert/alert-dialog-input.ipc');
const openUrlControl = require('./main-process/control-open-url/open-url');
const copyPasteControl = require('./main-process/control-copy-paste/copy-paste');

function crearVentanaPrincipal() {
  let ventanaPrincipal = new BrowserWindow({
    icon: path.join(__dirname, "./assets/icons/win/icon.ico"),
    title: "Dory",
    width: 800,
    height: 768,
    minWidth: 750,
    minHeight: 320,
    show: false,
    frame:false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      spellcheck: true
    },
  });
  ventanaPrincipal.maximize();
  ventanaPrincipal.setMenu(null);
modalAlertInput()
openUrlControl(ventanaPrincipal)
copyPasteControl()
const controlTitleBarx = new controlTitleBar();
controlTitleBarx.controlMinMaxClo()
controlTitleBarx.controlAvansRetro(ventanaPrincipal)
const controlErrorx = new controlError()
controlErrorx.controlError(ventanaPrincipal)
  /* ventanaPrincipal.webContents.openDevTools()  */
   ventanaPrincipal.loadURL("https://dory-web-app-pruebas.herokuapp.com");
 /*   ventanaPrincipal.loadURL("http://localhost:4200/"); */
}
//Evento que muestra la IU
app.whenReady().then(() => {
  crearVentanaPrincipal();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      crearVentanaPrincipal();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
