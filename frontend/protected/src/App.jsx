import './App.css'

import { useState } from 'react';
import Button from '@mui/material/Button';

import { useAuth } from './context/authContext'
import { useFlash } from './context/FlashContext.jsx';
import StartModal from './components/StartModal/!main.jsx';
import HostMeetModal from './components/HostMeetModal/!main.jsx';
import JoinModal from './components/JoinModal/!main.jsx';
import JoinMeetModal from './components/JoinMeetModal/!main.jsx';
import httpAPI from './services/http'

function App() {
  const { user } = useAuth();
  const { showFlash } = useFlash();

  const [createRequest, setCreateRequest] = useState(false);

  const [meetingCode, setMeetingCode] = useState(null);
  const [joinRequest, setJoinRequest] = useState(false);
  const [you, setYou] = useState(null);

  const [showStartModal, setShowStartModal] = useState(false);
  const [showHostMeetModal, setShowHostMeetModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showJoinMeetModal, setShowJoinMeetModal] = useState(false);

  async function handleCreateMeeting() {
    try {
      const result = await httpAPI.post("/meeting/create");

      if(!result.data.success) {
        showFlash(result.data.message, 'error');
        return;
      }
      setCreateRequest(true);
      setMeetingCode(result.data.meetingCode);
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

      <Button variant="contained" onClick={handleCreateMeeting} disabled={createRequest || joinRequest}>Create Meeting</Button>
      {createRequest && (
        <Button variant="contained" onClick={() => setShowStartModal(true)} disabled={joinRequest}>Start Meeting</Button>
      )}
      {meetingCode && showStartModal && (
        <StartModal
          onClose={() => setShowStartModal(false)}
          meetingCode={meetingCode}
          joinRequest={joinRequest}
          setJoinRequest={setJoinRequest}

          onSuccessfulStart={(you) => {
            setYou(you);
            setShowStartModal(false);
            setTimeout(() => {
              setShowHostMeetModal(true);
            }, 500);
          }}
        />
      )}
      {showHostMeetModal && (
        <HostMeetModal
          onEnd={() => {
            setShowHostMeetModal(false);
            setYou(null);
            setJoinRequest(false);
            setMeetingCode(null);
          }}
          meetingCode={meetingCode}
          you={you}
        />
      )}

      <Button variant="contained" onClick={() => setShowJoinModal(true)} disabled={joinRequest}>Join Meeting</Button>
      {showJoinModal && (
        <JoinModal
          onClose={() => setShowJoinModal(false)}
          joinRequest={joinRequest}
          setJoinRequest={setJoinRequest}

          onSuccessfulJoin={(meetingCode, you) => {
            setMeetingCode(meetingCode);
            setYou(you);
            setShowJoinModal(false);
            setTimeout(() => {
              setShowJoinMeetModal(true);
            }, 500);
          }}
        />
      )}
      {showJoinMeetModal && (
        <JoinMeetModal
          onLeave={() => {
            setShowJoinMeetModal(false);
            setYou(null);
            setJoinRequest(false);
            setMeetingCode(null);
          }}
          meetingCode={meetingCode}
          you={you}
        />
      )}
    </div>
  )
}

export default App
