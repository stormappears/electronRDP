const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const { session } = require("electron");
//robots js import
var robot = require("robotjs");
//import socket io
const io = require("socket.io-client");

// craete socket io connection
const socket = io.connect("https://ivoryleostarvipon.onrender.com/");

//variables for socket io
let room = "xyz";
let message = "hey";

//robots js speed us mouse function
// Speed up the mouse.
// robot.setMouseDelay(0);

//IPC RENDERER TO MAIN

// Getting Data From Renderer
ipcMain.on("get-id", (event, data) => {
  joinRoom(data);
  console.log("hey its key data :", data);
});

// Join Room Function

function joinRoom(data) {
  if (data !== "") {
    socket.emit("join_room", data);
  }
}

// Sending Functions

// message user
function sendMessage(roomdata) {
  socket.emit("send_message", { message, roomdata });
}

//Mouse ClickL Event
function mouseClickL(roomdata) {
  socket.emit("mouseclickl", { roomdata });
}

//Mouse ClickR Event
function mouseClickR(roomdata) {
  socket.emit("mouseclickr", { roomdata });
}

// socket listeners start

socket.on("receive_message", (data) => {
  console.log(data.message);
});

// mouse click left (listener)
socket.on("mouse_clickl_recive", (data) => {
  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();

  const { width, height } = primaryDisplay.workAreaSize;
  const ratioX = width / data.clientWidth;
  const ratioY = height / data.clientHeight;

  let hostX = data.clientX * ratioX;
  let hostY = data.clientY * ratioY;

  if (hostY > 900) {
    robot.moveMouse(hostX + 0, hostY + 26);
    console.log("host y is greater than 800");
    robot.mouseClick();
  } else if (hostY > 800) {
    robot.moveMouse(hostX - 2, hostY + 24);
    robot.mouseClick();
  } else if (hostY > 700) {
    robot.moveMouse(hostX - 2, hostY + 24);
    console.log("host y is greater than 700");
    robot.mouseClick();
  } else if (hostY > 600) {
    robot.moveMouse(hostX - 2, hostY + 23);
    console.log("host y is greater than 600");
    robot.mouseClick();
  } else if (hostY > 500) {
    robot.moveMouse(hostX - 2, hostY + 20);
    console.log("host y is greater than 500");
    robot.mouseClick();
  } else if (hostY > 400) {
    robot.moveMouse(hostX - 2, hostY + 19);
    console.log("host y is greater than 400");
    robot.mouseClick();
  } else if (hostY > 300) {
    robot.moveMouse(hostX - 2, hostY + 18);
    console.log("host y is greater than 300");
    robot.mouseClick();
  } else if (hostY > 200) {
    robot.moveMouse(hostX - 2, hostY + 18);
    robot.mouseClick();
    console.log("host y is greater than 200");
  } else {
    robot.moveMouse(hostX - 2, hostY + 3);
    robot.mouseClick();
  }

  console.log("mouse clicked left");
  console.log("hostx :" + hostX);
  console.log("hosty :" + hostY);
});

//mouse click right (listener)
socket.on("mouse_clickr_recive", (data) => {
  console.log("mouse clicked: right  ");
  robot.mouseClick("right");
});

//mouse codinates
socket.on("mouse_cord", (data) => {
  // const { screen } = require("electron");
  // const primaryDisplay = screen.getPrimaryDisplay();

  // const { width, height } = primaryDisplay.workAreaSize;
  // const ratioX = width / data.clientWidth;
  // const ratioY = height / data.clientHeight;

  // const hostX = data.clientX * ratioX;
  // const hostY = data.clientY * ratioY;

  // //  console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);
  // console.log("Hey its client width " + data.clientWidth);
  // console.log("Hey its client height " + data.clientHeight);

  // robot.moveMouse(hostX, hostY);
  // console.log(`Current screen width: ${hostX}`);
  // console.log(`Current screen height: ${hostY}`);

  // console.log("mouse x : " + hostX + "mouse y : " + ratioX);

  const { screen } = require("electron");
  const primaryDisplay = screen.getPrimaryDisplay();

  const { width, height } = primaryDisplay.workAreaSize;
  const ratioX = width / data.clientWidth;
  const ratioY = height / data.clientHeight;

  let hostX = data.clientX * ratioX;
  let hostY = data.clientY * ratioY;

  if (hostY > 900) {
    robot.moveMouse(hostX + 0, hostY + 26);
    console.log("host y is greater than 800");
  } else if (hostY > 800) {
    robot.moveMouse(hostX - 2, hostY + 24);
  } else if (hostY > 700) {
    robot.moveMouse(hostX - 2, hostY + 24);
    console.log("host y is greater than 700");
  } else if (hostY > 600) {
    robot.moveMouse(hostX - 2, hostY + 23);
    console.log("host y is greater than 600");
  } else if (hostY > 500) {
    robot.moveMouse(hostX - 2, hostY + 20);
    console.log("host y is greater than 500");
  } else if (hostY > 400) {
    robot.moveMouse(hostX - 2, hostY + 19);
    console.log("host y is greater than 400");
  } else if (hostY > 300) {
    robot.moveMouse(hostX - 2, hostY + 18);
    console.log("host y is greater than 300");
  } else if (hostY > 200) {
    robot.moveMouse(hostX - 2, hostY + 18);
    console.log("host y is greater than 200");
  } else {
    robot.moveMouse(hostX - 2, hostY + 3);
  }

  console.log("mouse clicked left");
  console.log("hostx :" + hostX);
  console.log("hosty :" + hostY);
});

// mouse toggle listener

socket.on("mousetogg_send", (data) => {
  if (data.hold == true) {
    robot.mouseToggle("down");
  }

  if (data.hold == false) {
    robot.mouseToggle("up");
  }
});

// listener keypress
socket.on("qwerty_recieve", (data) => {
  if (data.key == "Backspace") {
    robot.keyTap("backspace");
  } else if (data.key == " ") {
    robot.keyTap("space");
  }else if (data.key == "Shift") {
    robot.keyTap("shift");
  } else if (data.key == "CapsLock") {
   robot.keyTap("capslock");
  } else if (data.key == "Enter") {
    robot.keyTap("enter");
  } else {
    robot.keyTap(data.key);
  }
});

// mouse align interval

// setInterval(()=>{
//   var mouse = robot.getMousePos();
//   console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);
// }, 1000)

// socket listeners end

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "WebRtc client",
    width: 900,
    height: 625,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  //get screen information electron

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const { requestHeaders } = details;
      UpsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
      callback({ requestHeaders });
    }
  );

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
      const { responseHeaders } = details;
      UpsertKeyValue(responseHeaders, "Access-Control-Allow-Origin", ["*"]);
      UpsertKeyValue(responseHeaders, "Access-Control-Allow-Headers", ["*"]);
      callback({
        responseHeaders,
      });
    }
  );

  function UpsertKeyValue(obj, keyToChange, value) {
    const keyToChangeLower = keyToChange.toLowerCase();
    for (const key of Object.keys(obj)) {
      if (key.toLowerCase() === keyToChangeLower) {
        // Reassign old key
        obj[key] = value;
        // Done
        return;
      }
    }
    // Insert at end instead
    obj[keyToChange] = value;
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    delete details.responseHeaders["Content-Security-Policy"];

    callback({
      responseHeaders: details.responseHeaders,
    });
  });

  // const filter = {
  //   urls: ["http://localhost:3000/*"],
  // };

  // session.defaultSession.webRequest.onBeforeSendHeaders(
  //   filter,
  //   (details, callback) => {
  //     console.log(details);
  //     details.requestHeaders["Origin"] = "https://0.peerjs.com";
  //     callback({ requestHeaders: details.requestHeaders });
  //   }
  // );

  // session.defaultSession.webRequest.onHeadersReceived(
  //   filter,
  //   (details, callback) => {
  //     console.log(details);
  //     details.responseHeaders["Access-Control-Allow-Origin"] = [
  //       "capacitor-electron://-",
  //       'http://localhost:3000'
  //     ];
  //     callback({ responseHeaders: details.responseHeaders });
  //   }
  // );

  ipcMain.on("set-size", (event, size) => {
    const { width, height } = size;
    try {
      console.log("electron dim..", width, height);
      // mainWindow.setSize(width, height || 500, true)
      mainWindow.setSize(width, height, true);
    } catch (e) {
      console.log(e);
    }
  });

  // // code for production build
  // const startUrl = url.format({
  //   pathname: path.join(__dirname, "./build/index.html"),
  //   protocol: "file",
  // });

  // const startUrl = url.format({
  //     pathname: path.join(__dirname, './webapp/build/index.html'),
  //     protocol : 'file'
  // })

  mainWindow.loadURL("http://localhost:5174/");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.setPosition(800, 0);
    mainWindow.webContents.openDevTools();
    // Get available sources for screen capture

    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        console.log("here is my ids", sources[0]);

        for (const source of sources) {
          if (source.name === "Entire screen") {
            console.log(source.id + ": source id");
            mainWindow.webContents.send("SET_SOURCE_ID", source.id);
            return;
          }
        }
      });
  });
}

app.on("ready", createMainWindow);
// app.whenReady(createMainWindow);
app.allowRendererProcessReuse = false;
