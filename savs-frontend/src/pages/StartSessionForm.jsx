// ✅ FILE: src/pages/StartSessionForm.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StartSessionForm = () => {
  const [title, setTitle] = useState("");
  const [adminName, setAdminName] = useState("");
  const [intervals, setIntervals] = useState(["", "", ""]);
  const [message, setMessage] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Ask for camera and mic permission
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        alert("Please allow camera and microphone access.");
      }
    };
    getMedia();
  }, []);

  const handleIntervalChange = (value, index) => {
    const newIntervals = [...intervals];
    newIntervals[index] = value;
    setIntervals(newIntervals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !adminName || intervals.some((i) => !i)) {
      setMessage("Please fill all fields including 3 intervals.");
      return;
    }

    try {
      // Step 1: generate meeting ID using VideoSDK API
      const { data: meetingData } = await axios.post(
        "https://api.videosdk.live/v2/rooms",
        {},
        {
          headers: {
            Authorization: "YOUR_VIDEOSDK_AUTH_TOKEN", // Replace with your actual token
          },
        }
      );

      const generatedCode = meetingData.roomId;
      setGeneratedCode(generatedCode);

      // Step 2: Save session info to backend
      await axios.post("http://localhost:5000/api/session/start", {
        title,
        code: generatedCode,
        adminName,
        intervals,
      });

      // Step 3: Redirect to session view
      navigate(`/session/${generatedCode}`);
    } catch (error) {
      console.error("Error starting session:", error);
      setMessage("Failed to start session.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Host New Session</h2>

      <div className="mb-3">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "320px", borderRadius: "10px", backgroundColor: "#000" }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Session Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Admin Name</label>
          <input
            className="form-control"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Set 3 Snapshot Intervals (in seconds)</label>
          {intervals.map((value, index) => (
            <input
              key={index}
              className="form-control mb-2"
              type="number"
              placeholder={`Interval ${index + 1}`}
              value={value}
              onChange={(e) => handleIntervalChange(e.target.value, index)}
              required
            />
          ))}
        </div>

        <button type="submit" className="btn btn-primary">
          Start Session
        </button>
      </form>

      {generatedCode && (
        <div className="alert alert-success mt-3">
          Session Code: <strong>{generatedCode}</strong>
        </div>
      )}

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default StartSessionForm;