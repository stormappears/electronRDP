const {
  app,
  BrowserWindow,
  screen,
  desktopCapturer,
  ipcMain,
} = require("electron");
const url = require("url");
const path = require("path");
const { session } = require("electron");
const { clipboard } = require("electron");

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
  if (data == null) {
  } else {
    clipboard.writeText(data, "selection");
  }
});

//funtion to puut mouse outside
const keepMouseOut = (isAllowed) => {
  if (isAllowed) {
    setInterval(() => {
      const screenSize = robot.getScreenSize();
      robot.moveMouse(screenSize.width + 10, screenSize.height + 10);
    }, 2300);
  } else {
    console.log("No mouse is not taken off");
  }
};

// Join Room Function

function joinRoom(data) {
  if (data !== "") {
    socket.emit("join_room", data);
  }
}

// Sending Functions

// // message user
// function sendMessage(roomdata) {
//   socket.emit("send_message", { message, roomdata });
// }

// //Mouse ClickL Event
// function mouseClickL(roomdata) {
//   socket.emit("mouseclickl", { roomdata });
// }

// //Mouse ClickR Event
// function mouseClickR(roomdata) {
//   socket.emit("mouseclickr", { roomdata });
// }

// socket listeners start

socket.on("receive_message", (data) => {
  console.log(data.message);
});

//socket user mouse outside (listener)
socket.on("receive_usermouse_out", (data) => {
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

  robot.mouseClick();

  console.log("mouse clicked left");
  console.log("hostx :" + hostX);
  console.log("hosty :" + hostY);
});

//mouse click right (listener)
socket.on("mouse_clickr_recive", (data) => {
  console.log("mouse clicked: right  ");
  robot.mouseClick("right");
});

// //mouse codinates
socket.on("mouse_cord", (data) => {
  const { screen } = require("electron");
  // const primaryDisplay = screen.getPrimaryDisplay();
  // const { width, height } = primaryDisplay.workAreaSize;

     const primaryDisplay = screen.getPrimaryDisplay();
     const screenWidth = primaryDisplay.bounds.width;
     const screenHeight = primaryDisplay.bounds.height;

  // Calculate scaling factors
  const ratioX = screenWidth / data.clientWidth;
  const ratioY = screenHeight / data.clientHeight;
  const scaledX = data.clientX * ratioX;
  const scaledY = data.clientY * ratioY;

  keepMouseOut(data.isMouseHide);

  //  console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);
  console.log("Hey its client width " + data.clientWidth);
  console.log("Hey its client height " + data.clientHeight);

  // robot.moveMouse(hostX, hostY);
  // console.log(`Current screen width: ${width}`);
  // console.log(`Current screen height: ${height}`);

  // mouse cord active handelling mode
  if (data.enableToggler == true) {
  const { screen } = require("electron");
  // const primaryDisplay = screen.getPrimaryDisplay();
  // const { width, height } = primaryDisplay.workAreaSize;

  const primaryDisplay = screen.getPrimaryDisplay();
  const screenWidth = primaryDisplay.bounds.width;
  const screenHeight = primaryDisplay.bounds.height;

    // Calculate scaling factors
    const ratioX = screenWidth / data.clientWidth;
    const ratioY = screenHeight / data.clientHeight;
    const scaledX = data.clientX * ratioX;
    const scaledY = data.clientY * ratioY;

    robot.moveMouse(scaledX, scaledY);
  } else {
    console.log(data.enableToggler + " : toggler ");
  }
});

// socket.on("mousecord", (data) => {
//   const { screen } = require("electron");
//   const primaryDisplay = screen.getPrimaryDisplay();
//   const { width, height } = primaryDisplay.workAreaSize;

//   // Calculate scaling factors
//   const ratioX = width / data.clientWidth;
//   const ratioY = height / data.clientHeight;
//   const scaledX = data.clientX * ratioX;
//   const scaledY = data.clientY * ratioY;

//   // Handle mouse hide/show
//   keepMouseOut(data.isMouseHide);
// console.log(scaledX + "hey scaled x");
// console.log(scaledY + "hey scaled x");

//   if(data.enableToggler == true){
//   robot.moveMouse(scaledX, scaledY);
//   }else{
//     console.log(data.enableToggler);
//   }

//   console.log(data.enableToggler + " Data Toggler" );
//   console.log("Mouse is at x:", scaledX, "y:", scaledY);
// });

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
  try {
    if (data.key == "Backspace") {
      robot.keyTap("backspace");
    } else if (data.key == " ") {
      robot.keyTap("space");
    } else if (data.key == "Shift") {
      robot.keyTap("shift");
    } else if (data.key == "CapsLock") {
      robot.keyTap("capslock");
    } else if (data.key == "Enter") {
      robot.keyTap("enter");
    } else if (data.key == "Tab") {
      robot.keyTap("tab");
    } else if (data.key == "Escape") {
      robot.keyTap("escape");
    } else if (data.key == "ArrowUp") {
      robot.keyTap("up");
    } else if (data.key == "ArrowDown") {
      robot.keyTap("down");
    } else if (data.key == "ArrowRight") {
      robot.keyTap("right");
    } else if (data.key == "ArrowLeft") {
      robot.keyTap("left");
    } else if (data.key == "Delete") {
      robot.keyTap("delete");
    } else if (data.key == "Home") {
      robot.keyTap("home");
    } else if (data.key == "End") {
      robot.keyTap("end");
    } else if (data.key == "PageUp") {
      robot.keyTap("pageup");
    } else if (data.key == "F1") {
      robot.keyTap("f1");
    } else if (data.key == "F2") {
      robot.keyTap("f2");
    } else if (data.key == "F3") {
      robot.keyTap("f3");
    } else if (data.key == "F4") {
      robot.keyTap("f4");
    } else if (data.key == "F5") {
      robot.keyTap("f5");
    } else if (data.key == "F6") {
      robot.keyTap("f6");
    } else if (data.key == "F7") {
      robot.keyTap("f7");
    } else if (data.key == "F8") {
      robot.keyTap("f8");
    } else if (data.key == "F9") {
      robot.keyTap("f9");
    } else if (data.key == "F10") {
      robot.keyTap("f10");
    } else if (data.key == "F11") {
      robot.keyTap("f11");
    } else if (data.key == "F12") {
      robot.keyTap("f12");
    } else if (data.key == "Alt") {
      robot.keyTap("alt");
    } else if (data.key == "Printscreen") {
      robot.keyTap("printscreen");
    } else if (data.key == "Insert") {
      robot.keyTap("insert");
    } else if (data.key == "Meta") {
      robot.keyTap("command");
    } else if (data.key == "Control") {
      robot.keyTap("control");
    } else {
      robot.keyTap(data.key);
    }
  } catch (e) {
    console.log(e + " : This is error in qwerty we found");
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
    title: "Assitant",
    width: 503,
    height: 73,
    minWidth: 603,
    minHeight: 80,
    frame: false,
    focusable: false,
    transparent: true,
    x: 180,
    y: 180,
    backgroundColor: "#00FFFFFF",
    resizable: false,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      sandbox: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  //mainwindow menubar hide
  // mainWindow.setMenuBarVisibility(false);

  // Getting Minimise action from renderer
  ipcMain.on("get-minimise", (event, data) => {
    if (data == false) {
      console.log("Minimise function gets not hitted yet");
    } else {
      console.log("Minimise function gets  hitted");
      mainWindow.minimize();
      console.log(data);
    }
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

  mainWindow.loadURL("http://localhost:5173/");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    // mainWindow.setPosition(800, 0);
    //devtool
    // mainWindow.webContents.openDevTools();
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
    
// Remeber this code is so important for mouse precision without it mouse cant work as expected 
    const primaryDisplay = screen.getPrimaryDisplay();
    const screenWidth = primaryDisplay.bounds.width;
    const screenHeight = primaryDisplay.bounds.height;

    console.log("Main screen width:", screenWidth);
    console.log("Main screen height:", screenHeight);
  });
}

app.on("ready", createMainWindow);
// app.whenReady(createMainWindow);
app.allowRendererProcessReuse = false;
