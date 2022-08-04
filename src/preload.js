const { contextBridge, ipcRenderer, shell } = require("electron");
const http2 = require("http2");
ipcRenderer.on("principal", (event, message) => {
    function isConnected() {
      return new Promise((resolve) => {
        const client = http2.connect("https://www.google.com");
        client.on("connect", () => {
          resolve(true);
          client.destroy();
        });
        client.on("error", () => {
          resolve(false);
          client.destroy();
          ipcRenderer.send("sinData", "offline");
        });
      });
    }
    isConnected();
});
