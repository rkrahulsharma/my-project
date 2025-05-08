import React from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }) => {
  const { displayName, webcamStream, webcamOn } = useParticipant(participantId);

  return (
    <div>
      <p>{displayName}</p>
      {webcamOn && webcamStream && (
        <video
          autoPlay
          playsInline
          muted
          ref={(video) => {
            if (video) video.srcObject = new MediaStream([webcamStream.track]);
          }}
          style={{ width: "300px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
};

const MeetingView = () => {
  const { participants } = useMeeting();

  return (
    <div>
      <h3>Participants</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {[...participants.keys()].map((participantId) => (
          <ParticipantView key={participantId} participantId={participantId} />
        ))}
      </div>
    </div>
  );
};

export default MeetingView;