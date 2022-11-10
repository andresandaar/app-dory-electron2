const electron = require('electron');
const BrowserView= electron.BrowserView
const ipcMain = electron.ipcMain
const path = require('path');
function viewCheckInternet (ventanaPrincipal=BrowserView){
   try {
     const view = new BrowserView({
       frame:true,
       webPreferences: {
         preload: path.join(__dirname, "./check-internet.preload.js")
       },
     });
     ventanaPrincipal.setBrowserView(view);
     let tamaños = ventanaPrincipal.getContentSize();
     view.setAutoResize({ width: true, height: true ,horizontal:true,vertical:true});
     view.setBounds({ x: 0, y: 0, width: tamaños[0]+14, height: tamaños[1]+18 });
     view.webContents.loadFile(
       path.join(__dirname, "./check-internet.component.html")
     );
    /*  view.webContents.openDevTools() */
     ipcMain.on("destruirVentanaView", function () {
        let destruirVentanaView=true
       ventanaPrincipal.webContents.reload();
       ventanaPrincipal.webContents.on("did-finish-load",()=>{
         if (destruirVentanaView) {
             destruirVentanaView=false
             setTimeout(() => {
               view.webContents.destroy()
               ventanaPrincipal.setBrowserView(null);
             }, 5000);
         }
       })
     });
    
  } catch (error) {
    
  }

}
module.exports = viewCheckInternet 