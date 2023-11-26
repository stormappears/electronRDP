import React, { useState, useRef, useEffect } from "react";
import { Peer } from "peerjs";
import "./App.css";

let PEERID;

const electron = window.electron;

// Peer outside generating key only once
const peer = new Peer();


function App() {

  const [peerId, setPeerId] = useState("Connecting TO Server ...");
  const [minimise, setMinimise] = useState(false);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  // const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  // const {ipcRenderer} = require("electron");





  useEffect(() => {
    const getStream = async (screenId) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: "screen:0:0",
            },
          },
        });
        console.log(stream + "hey its running i am in get stream");
        handleStream(stream);
      } catch (e) {
        console.log(e);
      }
    };

    // this function make app crash
    electron.getScreenId((event, screenId) => {
      console.log(screenId);
      // getStream(screenId);
    });

    const handleStream = (stream) => {



      // here is code we add


        peer.on("open", (id) => {
          PEERID = id
          setPeerId(PEERID)
          console.log(id)

        });

         

    peer.on("call", (call) => {
      

 
   
   
          currentUserVideoRef.current.srcObject = stream;
          currentUserVideoRef.current.play();

          call.answer(stream);
          call.on("stream", (remoteStream) => {
            // remoteVideoRef.current.srcObject = remoteStream;
            // remoteVideoRef.current.play();
          });

      
    });

    peerInstance.current = peer;



peer.on("connection", function (conn) {
  conn.on("data", function (data) {
    // Will print 'hi!'
    console.log(data);
  });
});






      //let { width, height } = stream.getVideoTracks()[0].getSettings();
      //electron.setSize({ width, height });
      currentUserVideoRef.current.srcObject = stream;
      currentUserVideoRef.current.onloadedmetadata = (e) =>
        currentUserVideoRef.current.play();


    };

     getStream();
  });

  
  electron.getUserId(peerId)


  // copy text on click

  function copyOnClick() {
    // Get the text field
    var copyText = peerId
  
     // Copy the text inside the text field
     clipboard.writeText(copyText);


  }


  //clipboard copied alert notification

 //for mouse enter
  const handleCopyHover1 = () =>{
    document.getElementById("keyarea_key").innerText = "Key Already Copied To Clipboard"
  }
  
  //for mouse leave
  const handleCopyHover12 = () =>{
    document.getElementById("keyarea_key").innerText = peerId
  }

  //handleMinimise
  const handleMinimise = () =>{
    setMinimise(true)
  }
  
useEffect(()=>{
  electron.getMinimiseAction(minimise)
},[minimise])



  return (
    <div className="mainWindow">
      <video id="video" ref={currentUserVideoRef}></video>
      <div className="logo">
        <h1 className="logo_ms">Microsoft</h1>
      </div>
      <div className="keyarea" onMouseEnter={handleCopyHover1} onMouseLeave={handleCopyHover12} onClick={copyOnClick}>
      <h2 className="keyarea_key" id="keyarea_key" >{peerId}</h2>
      <div id="minimise" onClick={handleMinimise} className="btnMinimise">
        <div  onClick={handleMinimise} className="btnMinimise_child"></div>
      </div>
      </div>

      
      {/* 
      <h1>{peerId}</h1> */}
      {/* <button onClick={()=>{ipcRenderer("hey" , "bitch")}}>Send Data</button> */}
    </div>
    

  
  );


 
}

export default App;
