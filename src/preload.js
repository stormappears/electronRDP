const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const os = require("os");

contextBridge.exposeInMainWorld("electron", {
  arch: () => os.arch(),

  getScreenId: (callback) => ipcRenderer.on("SET_SOURCE_ID", callback),

  setSize: (size) => ipcRenderer.on("set-size", size),

  getUserId: (id) => ipcRenderer.send("get-id", id),

  getMinimiseAction: (id) => ipcRenderer.send("get-minimise", id),
});
