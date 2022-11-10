const { contextBridge, ipcRenderer} = require("electron");
contextBridge.exposeInMainWorld("electron", {
    alertModal: function () {
        ipcRenderer.on('electron-osx-prompt-settings', (event, options) => {
            document.getElementById('label').innerHTML = options.label;
            document.getElementById('input').placeholder = options.placeholder;
            document.getElementById('input').type = options.masked ? 'password' : 'text';
            document.getElementById('prompt-img').src = options.icon;
            document.getElementById('input').value=options.urlValue;
        });
      /*   ipcRenderer.removeAllListeners("electron-osx-prompt-settings") */
        document.addEventListener("DOMContentLoaded", function (event) {
            document.getElementById('input').focus();
        });
        
        function enter (e) {
            if (e.charCode == '13') {
                Ok();
            }
        }


        function Ok () {
             document.getElementById('min-button-ok').addEventListener("click", event => {
             let returnValue = document.getElementById('input').value.toString();
            ipcRenderer.sendSync('electron-osx-prompt-return-value', returnValue);
            ipcRenderer.removeAllListeners("electron-osx-prompt-return-value")
        })
        }
        function Cancel () {
               document.getElementById('min-button-cancel').addEventListener("click", event => {
                       ipcRenderer.sendSync('electron-osx-prompt-return-value', null);
                        ipcRenderer.removeAllListeners("electron-osx-prompt-return-value")
                 })
        }
      Ok()
     Cancel()
    }

})
