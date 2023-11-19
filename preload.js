const { contextBridge, ipcRenderer , ipcMain } = require("electron");
const os = require("os");

let screenId;

// ipcRenderer.on("SET_SOURCE", async (event, sourceId) => {
//   screenId = sourceId;
//   console.log(screenId);
//   console.log(sourceId);
// });

contextBridge.exposeInMainWorld("electron", {
  arch: () => os.arch(),

  getScreenId: (callback) => ipcRenderer.on("SET_SOURCE_ID", callback),

  setSize: (size) => ipcRenderer.on("set-size", size),

  getUserId: (id) => ipcRenderer.send('get-id', id)
});


