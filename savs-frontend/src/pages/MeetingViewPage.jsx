// ✅ FILE: src/pages/MeetingViewPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import MeetingView from "../components/sessions/MeetingView";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlYTI4NTc2ZC1mN2Y3LTQ5ZjgtOWZkZi1hMjViYjhkMmNhOGUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0NTQ2MDA0NSwiZXhwIjoxNzQ4MDUyMDQ1fQ.niF2MgL9gbectGWVSYWEpeb2VLl4ymYmArnueSVAbcE"; // Replace with your actual VideoSDK token

const MeetingViewPage = () => {
  const { meetingId } = useParams();

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "Admin"
      }}
      token={token}
    >
      <MeetingView />
    </MeetingProvider>
  );
};

export default MeetingViewPage;
