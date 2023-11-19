import React, { useState, useRef, useEffect } from "react";
import { Peer } from "peerjs";
import "./App.css";

let PEERID;

const electron = window.electron;



  const peer = new Peer();







function App() {

  const peer = new Peer();
  const [peerId, setPeerId] = useState("not updated");
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


  return (
    <>
      <video id="video" ref={currentUserVideoRef}></video>
      <h1>{peerId}</h1>
      {/* <button onClick={()=>{ipcRenderer("hey" , "bitch")}}>Send Data</button> */}

    </>
  );


 
}

export default App;
