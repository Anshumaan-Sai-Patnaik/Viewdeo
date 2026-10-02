import './App.css'

import { useState } from 'react';
import Button from '@mui/material/Button';

import { useAuth } from './context/authContext'
import { useFlash } from './context/FlashContext.jsx';
import httpAPI from './services/http'
import StartModal from './components/StartModal/!main.jsx';
import JoinModal from './components/JoinModal/!main.jsx';
import MeetModal from './components/MeetModal/!main.jsx';

function App() {
  const { user } = useAuth();
  const { showFlash } = useFlash();

  const [meetingCode, setMeetingCode] = useState(null);

  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showMeetModal, setShowMeetModal] = useState(false);

  const [hasMeeting, setHasMeeting] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);

  async function handleCreateMeeting() {
    try {
      const result = await httpAPI.post("/meeting/create");

      if(!result.data.success) {
        showFlash(result.data.message, 'error');
        return;
      }
      setHasMeeting(true);
      setMeetingCode(result.data.meeting.meetingCode);
      setTimeout(() => {
        setShowStartModal(true);
      }, 500);
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred while Creating Meeting.";
      showFlash(message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <p className="text-2xl font-medium">Hello, {user.username}</p>
      <Button variant="contained" onClick={handleCreateMeeting} disabled={hasMeeting || inMeeting}>Create Meeting</Button>
      {meetingCode && (
        <Button variant="contained" onClick={() => setShowStartModal(true)} disabled={inMeeting}>Start Meeting</Button>
      )}
      <Button variant="contained" onClick={() => setShowJoinModal(true)} disabled={inMeeting}>Join Meeting</Button>

      {showStartModal && (
        <StartModal onClose={() => setShowStartModal(false)} meetingCode={meetingCode} inMeeting={inMeeting} setInMeeting={setInMeeting} setShowMeetModal={setShowMeetModal} />
      )}
      {showJoinModal && (
        <JoinModal onClose={() => setShowJoinModal(false)} inMeeting={inMeeting} setInMeeting={setInMeeting} />
      )}

      {showMeetModal && (
        <MeetModal onClose={() => setShowMeetModal(false)} meetingCode={meetingCode} />
      )}
    </div>
  )
}

export default App
