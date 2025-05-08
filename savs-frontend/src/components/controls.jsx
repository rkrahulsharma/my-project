// src/components/session/Controls.jsx
import React from "react";
import { useMeeting } from "@videosdk.live/react-sdk";

const Controls = () => {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={toggleMic}>Toggle Mic</button>
      <button onClick={toggleWebcam}>Toggle Webcam</button>
      <button onClick={leave}>Leave</button>
    </div>
  );
};

export default Controls;
