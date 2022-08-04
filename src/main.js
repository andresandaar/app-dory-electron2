const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  net,
  BrowserView,
} = require("electron");
const path = require("path");
var destruirVentanaView =false
function crearVentanaPrincipal() {
  let ventanaPrincipal = new BrowserWindow({
    icon: path.join(__dirname, "./assets/icons/win/icon.ico"),
    title: "Dory",
    width: 800,
    height: 768,
    minWidth: 600,
    minHeight: 320,
   /*  maxWidth: 2048,
    maxHeight: 1024, */
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });
  // La venta se entra en modo maximize (amplia)
  ventanaPrincipal.maximize();
  ipcMain.on("activateButtonAngular", (event) => {
    event.reply("activateButtonElectron", "BotonActivado");
  });
  // ventanaPrincipal.setSimpleFullScreen(true);
  //-------------------------------------------

function ViewCheckInternet() { 
const view = new BrowserView({
      webPreferences: {
        preload: path.join(__dirname, "./checkInternet/preload.js")
      },
    });
    ventanaPrincipal.setBrowserView(view);
    let tamaños = ventanaPrincipal.getContentSize();
    view.setAutoResize({ width: true, height: true });
    view.setBounds({ x: 0, y: 0, width: tamaños[0], height: tamaños[1] });
    view.webContents.loadFile(
      path.join(__dirname, "./checkInternet/checkInternet.html")
    );
   /*  view.webContents.openDevTools() */
    ipcMain.on("destruirVentanaView", function () {
      destruirVentanaView=true
      ventanaPrincipal.webContents.reload();
      ventanaPrincipal.webContents.on("did-finish-load",()=>{
        if (destruirVentanaView) {
            destruirVentanaView=false
            view.webContents.destroy();
        }
      })
    /*   ventanaPrincipal.webContents.reload();
      ventanaPrincipal.webContents.on("did-finish-load",()=>{
      view.webContents.destroy();
      }) */
    });
}
  ventanaPrincipal.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (
        errorDescription === "ERR_NAME_NOT_RESOLVED" ||
        errorDescription === "ERR_INTERNET_DISCONNECTED" ||
        errorDescription === "ERR_TIMED_OUT" ||
        errorDescription === "ERR_CONNECTION_TIMED_OUT"
      ) {
        ViewCheckInternet() 
      }
    }
  );

  if (net.online) {
    ViewCheckInternet() 
  }
  ventanaPrincipal.setMenu(null);
 /*  ventanaPrincipal.webContents.openDevTools(); */
  ventanaPrincipal.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes("https://accounts.google.com")) {
      console.log(url);
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
      console.log(url);
    }
    return { action: "deny" };
  });
   ventanaPrincipal.webContents.on(
    "did-navigate-in-page",
    (event, url, isMainFrame, frameProcessId, frameRoutingId) => {
    /*       ventanaPrincipal.webContents.send(
        "principal",
        "intentando de nuevo la conexion"
      ); */
  
    })

   ventanaPrincipal.loadURL("https://dory-web-app-tests.herokuapp.com");
  // ventanaPrincipal.loadFile(path.join(__dirname, "./index.html"));
  /* ventanaPrincipal.loadURL("https://andresandaar.github.io/prueba-internet/"); */
/*   ventanaPrincipal.loadURL("http://localhost:4200/"); */
  /* ventanaPrincipal.loadURL("https://andresandaar.github.io/prueba-ipcmain-angular-electron/"); */
  
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
