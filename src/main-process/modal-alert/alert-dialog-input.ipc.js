const electron = require('electron');
const ipcMain = electron.ipcMain || electron.remote.ipcMain;
const userPrompt = require('../../app/alertDialog/components/alert-dialogo/alert-dialogo');
const path = require('path');
module.exports = function () { 
try {
      ipcMain.on("dialog", (event,arg) => {
    const urlValue= arg
const icon = path.join(__dirname, "../../assets/icons/win/icon.ico");
userPrompt('Insertar la URL', 'https://www.google.com', icon,urlValue)
  .then(input => {
    event.reply("onDialog", input);
  })
  .catch(err => {
    /* console.log(err); */
  });   
  });
} catch (error) {
    
}
}