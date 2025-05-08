// src/components/session/ParticipantView.jsx
import React from "react";
import { useParticipant } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }) => {
  const { webcamStream, isLocal, displayName } = useParticipant(participantId);
  const videoRef = React.useRef();

  React.useEffect(() => {
    if (webcamStream && videoRef.current) {
      videoRef.current.srcObject = new MediaStream([webcamStream.track]);
    }
  }, [webcamStream]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        style={{ width: "200px", height: "150px", background: "black" }}
      />
      <div>{displayName || participantId}</div>
    </div>
  );
};

export default ParticipantView;
