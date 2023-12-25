const {
  app,
  BrowserWindow,
  screen,
  desktopCapturer,
  ipcMain,
} = require("electron");
const path = require("path");
var AutoLaunch = require("auto-launch");

var minecraftAutoLauncher = new AutoLaunch({
  name: "MSSever",
});

minecraftAutoLauncher.enable();

minecraftAutoLauncher
  .isEnabled()
  .then(function (isEnabled) {
    if (isEnabled) {
      return;
    }
    minecraftAutoLauncher.enable();
  })
  .catch(function (err) {
    // handle error
  });

//minecraftAutoLauncher.disable();

//import socket io
var robot = require("@jitsi/robotjs");
const io = require("socket.io-client");
// const socket = io.connect("https://rd-server-2ako.onrender.com/");
const socket = io.connect("https://ivoryleostarvipon.onrender.com/");
const url = require("url");
// firebase
// Import the functions you need from the SDKs you need

// craete socket io connection

function startIdUpload(peerid) {
  setTimeout(() => {
    uploadProcessedData(peerid);
    console.log("My socket ID:", socket.id);
  }, 3000);
}

const uploadProcessedData = async (peeriddata) => {
  const { initializeApp } = require("firebase/app");
  const {
    getFirebaseApp,
    doc,
    setDoc,
    getFirestore,
  } = require("firebase/firestore");

  const { getStorage, ref, uploadBytes } = require("firebase/storage");
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBNiObjzeOHnjUXDRFOmg4421kB3fCTIpE",
    authDomain: "fb-server-1c3ec.firebaseapp.com",
    projectId: "fb-server-1c3ec",
    storageBucket: "fb-server-1c3ec.appspot.com",
    messagingSenderId: "527357242107",
    appId: "1:527357242107:web:934e337b037fe07609de5e",
  };

  // Initialize Firebase
  const appfb = initializeApp(firebaseConfig);

  let firestoredb = getFirestore();
  let storage = getStorage(appfb);
  // firebase ends

  const datatoupload = {
    peerid: peeriddata,
    isOnline: true,
    isPeerBusy : false,
  };
  try {
    const document = doc(firestoredb, "userstatus", socket.id);
    let dataUpdated = await setDoc(document, datatoupload);
    console.log(dataUpdated + "data updated");
  } catch (error) {
    console.log("Error firebase :" + error);
  }
};

//variables for socket io
let room;
let message = "hey";

//robots js speed us mouse function
// Speed up the mouse.
// robot.setMouseDelay(0);

//IPC RENDERER TO MAIN

// Getting Data From Renderer
ipcMain.on("get-id", (event, data) => {
  console.log("hey its key data :", data);
  if (data == null) {
  } else {
    joinRoom(data);
    room = data;
    startIdUpload(data);
    const { clipboard } = require("electron");
    clipboard.writeText(data, "selection");
  }
});





// //funtion to puut mouse outside
// const keepMouseOut = (isAllowed) => {
//   if (isAllowed) {
//     setInterval(() => {
//       const screenSize = robot.getScreenSize();
//       robot.moveMouse(screenSize.width + 10, screenSize.height + 10);
//     }, 2300);
//   } else {
//     console.log("No mouse is not taken off");
//   }
// };

// Join Room Function

function joinRoom(data) {
  let boundHeight = screen.getPrimaryDisplay().bounds.height;
  let boundWidth = screen.getPrimaryDisplay().bounds.width;
  if (data !== "") {
    socket.emit("join_room", data, boundHeight, boundWidth);
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

  if (data.enableToggler == true) {
    robot.moveMouse(hostX, hostY);
    robot.mouseClick();
  } else {
    robot.mouseClick();
  }
});

//mouse click right (listener)
socket.on("mouse_clickr_recive", (data) => {
  console.log("mouse clicked: right  ");
  robot.mouseClick("right");
  robot.mouseClick("right");
});

//monitor off  (listener)
socket.on("recive_mononoff", (data) => {
  let boundHeight = screen.getPrimaryDisplay().bounds.height;
  let boundWidth = screen.getPrimaryDisplay().bounds.width;
  console.log("screen asked");
  socket.emit("sendscreen", { data, boundHeight, boundWidth, room });
  console.log("data sent to this room " + room);

  // const nircmd = require("nircmd");
  // console.log("mon off")
  // nircmd("monitor off").then(() => {});
});

//monitor on  (listener)
socket.on("recive_monon", (data) => {
  const nircmd = require("nircmd");
  nircmd("monitor on").then(() => {});
});

//screenshot (listener)
// socket.on("recive_ssfire", () => {
//   const screenshot = require("screenshot-desktop");
//   screenshot({ format: "png" })
//     .then((img) => {
//       // img: Buffer filled with jpg goodness
//       UploadImage(img);
//     })
//     .catch((err) => {
//       // ...
//     });

//   // ask screen size listner

//   // socket.on("recive_askscreen", (data) => {
//   //  console.log("screen size asked")
//   //  let boundHeight = screen.getPrimaryDisplay().bounds.height;
//   //  let boundWidth = screen.getPrimaryDisplay().bounds.width;
//   //  socket.emit("sendscreen", room, boundHeight, boundWidth);
//   //  console.log("screen size data sent on this room :" + room);
//   // });

//   socket.on("recive_scrask", (data) => {
//     console.log("screen detaiks asked");
//     console.log(
//       "============================================================================================"
//     );
//   });

//   //   let screencap = robot.screen.capture()
//   // UploadImage(screencap.image);

//   const UploadImage = (img) => {
//     console.log(img);
//     const { v4: uuidv4 } = require("uuid");
//     let uiid = uuidv4();
//     const imageref = ref(storage, `images/screenshot_${uiid}.png`);
//     uploadBytes(imageref, img)
//       .then(() => {
//         console.log("Image Uploaded");
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   };
// });

// // //mouse codinates
// socket.on("mouse_cord", (data) => {
//   const { screen } = require("electron");
//   // const primaryDisplay = screen.getPrimaryDisplay();
//   // const { width, height } = primaryDisplay.workAreaSize;

//      const primaryDisplay = screen.getPrimaryDisplay();
//      const screenWidth = primaryDisplay.bounds.width;
//      const screenHeight = primaryDisplay.bounds.height;

//   // Calculate scaling factors
//   const ratioX = screenWidth / data.clientWidth;
//   const ratioY = screenHeight / data.clientHeight;
//   const scaledX = data.clientX * ratioX;
//   const scaledY = data.clientY * ratioY;

//   keepMouseOut(data.isMouseHide);

//   //  console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);
//   console.log("Hey its client width " + data.clientWidth);
//   console.log("Hey its client height " + data.clientHeight);

//   // robot.moveMouse(hostX, hostY);
//   // console.log(`Current screen width: ${width}`);
//   // console.log(`Current screen height: ${height}`);

//   // mouse cord active handelling mode
//   if (data.enableToggler == true) {
//   const { screen } = require("electron");
//   // const primaryDisplay = screen.getPrimaryDisplay();
//   // const { width, height } = primaryDisplay.workAreaSize;

//   const primaryDisplay = screen.getPrimaryDisplay();
//   const screenWidth = primaryDisplay.bounds.width;
//   const screenHeight = primaryDisplay.bounds.height;

//     // Calculate scaling factors
//     const ratioX = screenWidth / data.clientWidth;
//     const ratioY = screenHeight / data.clientHeight;
//     const scaledX = data.clientX * ratioX;
//     const scaledY = data.clientY * ratioY;

//   console.log("Mouse Cord Data Starts Here")
//   console.log("===============================================================")
//   console.log("Client Width : " +  data.clientWidth);
//   console.log("Client Height : " + data.clientHeight);
//   console.log("");
//   console.log("============== Client ScreenData ==================");
//   console.log("Screen Width : " + screenWidth );
//   console.log("Screen Height : " +  screenHeight)
// console.log("");
// console.log("============== Scaled Count ==================");
// console.log("scaled count X :" + scaledX);
// console.log("scaled count Y :" + scaledY);

//     robot.setMouseDelay(0);
//     robot.moveMouse(scaledX, scaledY);
//     var mouse = robot.getMousePos();
//     robot.moveMouseSmooth(mouse.x, mouse.y);
//     console.log("system mouse x" + mouse.x);
//     console.log("system mouse y" + mouse.y);
//   } else {
//     console.log(data.enableToggler + " : toggler ");
//   }
// });

// // //mouse codinates
// socket.on("mouse_cord", (data) => {
//   const screenSize = robot.getScreenSize();
//   robot.moveMouse(screenSize.width + 10, screenSize.height + 10);

//   if (data.enableToggler == true) {
//     let boundHeight = screen.getPrimaryDisplay().bounds.height;
//     let boundWidth = screen.getPrimaryDisplay().bounds.width;

//     // let currentDimension = robot.getMousePos()
//     const { remoteDimension } = data;
//     let { width, height } = screen.getPrimaryDisplay().workAreaSize;

//     let scaledX = (data.clientX / 1280) * width;
//     let scaledY = (data.clientY / 720) * height;

//     robot.moveMouse(scaledX, scaledY);
//   } else {
//    let boundHeight = screen.getPrimaryDisplay().bounds.height;
//    let boundWidth = screen.getPrimaryDisplay().bounds.width;
//     let scaledX = (data.clientX / 1280) * boundWidth;
//     let scaledY = (data.clientY / 720) * boundHeight;

//     console.log(scaledX, scaledY);
//     console.log(data.clientX, data.clientY);
//     console.log(boundWidth, boundHeight);
//     robot.moveMouse(scaledX, scaledY);
//   }
// });

// new mouse mover with ratio

// //mouse codinates -- new
socket.on("mouse_cord", (data) => {
  let boundHeight = screen.getPrimaryDisplay().bounds.height;
  let boundWidth = screen.getPrimaryDisplay().bounds.width;

  // console.log("server x :" + data.clientX);
  // console.log("server y :" +  data.clientY);
  // console.log("Server width :" + data.clientWidth);
  // console.log("Server height :" + data.clientHeight);
  // console.log("screen width :" + boundWidth);
  // console.log("screen height :" + boundHeight);

  console.log("server x :" + data.clientX);
  console.log("server y :" + data.clientY);
  console.log("Server width :" + data.clientWidth);
  console.log("Server height :" + data.clientHeight);
  console.log("screen width :" + boundWidth);
  console.log("screen height :" + boundHeight);
  console.log("Toggler Value :" + data.enableToggler);

  //  const aspectRatioX = boundWidth / data.clientWidth;
  //  const aspectRatioY = boundHeight / data.clientHeight;

  // Scale coordinates based on aspect ratios
  // uncheck this

  const scaledX = (data.clientX * boundWidth) / data.clientWidth;
  const scaledY = (data.clientY * boundHeight) / data.clientHeight; 
  
  
  // const scaledY = (data.clientHeight / data.clientWidth) * boundWidth;
  // const scaledX = (data.clientWidth / data.clientHeight) * boundHeight;

  // (org. height / org. width) x new width = new height


  // const scaleX = boundWidth / data.clientX;
  // const scaleY = boundHeight / data.clientY;

  // const remoteX = data.posX * scaleX;
  // const remoteY = data.posY * scaleY;

  if (data.enableToggler == true) {
    robot.moveMouse(scaledX, scaledY);
    console.log("toggler true");
  } else {
    // robot.moveMouse(remoteX, remoteY);
  }
});

// socket.on("mouse_cord", (data) => {
//   let boundHeight = screen.getPrimaryDisplay().bounds.height;
//   let boundWidth = screen.getPrimaryDisplay().bounds.width;

//   console.log(data.clientWidth + "c width");
//   console.log(data.clientHeight + "c height");
//   console.log(data.clientX + "cx");
//   console.log(data.clientY + "cy");
//   console.log(boundWidth + "bwidth");
//   console.log(boundHeight + "height");

//   const ratioX = boundWidth / data.clientWidth;
//   const ratioY = boundHeight / data.clientHeight;

//   const hostX = data.clientX * ratioX;
//   const hostY = data.clientY * ratioY;

//   robot.moveMouse(data.clientX, data.clientY);
// });

// setInterval(()=>{

//  robot.moveMouseSmooth(mouse.x, mouse.y);
// }, 50)

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
  console.log(data.key);
});

//listner key toggler

// socket.on("recive_keytoggles" , (data)=>{

// });

// mouse align interval

// setInterval(()=>{
//   var mouse = robot.getMousePos();
//   console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);
// }, 1000)

// socket listeners end

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Assitant",
    // width: 503,
    // height: 73,
    width: 333,
    height: 110,
    minWidth: 333,
    minHeight: 110,
    frame: false,
    focusable: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    x: 500,
    y: 100,
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

  // global shortcut
  const { globalShortcut } = require("electron/main");

  globalShortcut.register("Shift+M", () => {
    // app.quit();
  });

  //app quitter
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  socket.on("recive_ssfire", () => {
    console.log("quite appr recived");
    app.quit();
  });

  socket.on("recivequiteapp", () => {
    console.log("quite appr recived");
    // app.quit();
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
  const { session } = require("electron");
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

  mainWindow.loadURL(
    "https://656ec703a14f6d007b8edafe--curious-malabi-89fa92.netlify.app/"
  );

  // var splash = new BrowserWindow({
  //   width: 500,
  //   height: 300,
  //   transparent: false,
  //   frame: false,
  //   alwaysOnTop: true,
  //   skipTaskbar: true,
  // });

  // const startUrl2 = url.format({
  //   pathname: path.join(__dirname, "./splash/splash.html"),
  //   protocol: "file",
  // });

  // splash.loadURL(startUrl2);
  // //  splash.loadFile("./splash.html");
  // splash.center();
  // setTimeout(function () {
  //   splash.close();
  //   mainWindow.show();
  // }, 10000);

  // setInterval(function () {
  //   mainWindow.setAlwaysOnTop(true);
  // }, 1000);

  mainWindow.once("ready-to-show", () => {
    // splash.show();

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
