import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import axios from 'axios';

const AdminVideo = ({ participantId }) => {
  const videoRef = useRef();
  const { webcamStream } = useParticipant(participantId);

  useEffect(() => {
    if (videoRef.current && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      videoRef.current.srcObject = mediaStream;
    }
  }, [webcamStream]);

  return <video ref={videoRef} autoPlay muted width="400" style={{ border: '2px solid #0d6efd' }} />;
};

const MeetingView = ({ sessionMeta }) => {
  const { join, participants } = useMeeting();
  const videoRef = useRef();
  const [snapCount, setSnapCount] = useState(0);

  // Auto join session
  useEffect(() => {
    join();
  }, [join]);

  // Snapshot capture at intervals
  useEffect(() => {
    const times = sessionMeta.intervals.map((t) => t * 1000); // Convert seconds to ms

    const timers = times.map((ms, idx) =>
      setTimeout(() => {
        captureSnapshot(idx + 1);
        setSnapCount((prev) => prev + 1);
      }, ms)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [sessionMeta]);

  const captureSnapshot = (index) => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    if (!video || video.readyState < 2) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, `snapshot_${index}.jpg`);
      formData.append('sessionId', sessionMeta.sessionId);

      try {
        await axios.post('http://localhost:5000/api/session/upload-image', formData);
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="container mt-4">
      <h4>📡 Live Session: {sessionMeta.sessionName}</h4>
      <p>Snapshots taken: {snapCount}/{sessionMeta.intervals.length}</p>

      {/* Admin's own webcam for capturing */}
      <video
        ref={videoRef}
        autoPlay
        muted
        width="500"
        onCanPlay={() => console.log('Camera ready')}
        style={{ border: '3px solid green', marginTop: '1rem' }}
      />

      {/* Participant preview */}
      <div className="mt-4">
        <h5>Participants</h5>
        {[...participants.keys()].map((pid) => (
          <AdminVideo key={pid} participantId={pid} />
        ))}
      </div>
    </div>
  );
};

const AdminSessionRoom = () => {
  const { id } = useParams(); // sessionId
  const [sessionMeta, setSessionMeta] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await axios.get(`http://localhost:5000/api/session/${id}`);
      setSessionMeta(res.data.session);
    };
    fetchSession();
  }, [id]);

  return (
    sessionMeta && (
      <MeetingProvider
        config={{
          meetingId: sessionMeta.sessionId,
          micEnabled: true,
          webcamEnabled: true,
          name: sessionMeta.adminName,
        }}
        token={sessionMeta.token}
        joinWithoutUserInteraction
      >
        <MeetingView sessionMeta={sessionMeta} />
      </MeetingProvider>
    )
  );
};

export default AdminSessionRoom;
