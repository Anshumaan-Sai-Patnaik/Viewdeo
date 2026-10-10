import { useState } from 'react';
import Button from '@mui/material/Button';

import { useFlash } from '../context/FlashContext.jsx';
import JoinModal from '../components/JoinModal/!main.jsx';
import JoinMeetModal from '../components/JoinMeetModal/!main.jsx';

function AppInfo({ setAuthMode }) {
  const { showFlash } = useFlash();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [meetingCode, setMeetingCode] = useState(null);
  const [request, setRequest] = useState(false);
  const [you, setYou] = useState(null);
  const [showJoinMeetModal, setShowJoinMeetModal] = useState(false);

  return ( 
    <div className="app-info">
      <p className="app-eyebrow">Connecting Conversations, Anywhere</p>
      <h1 className="app-heading">VI<span>ew</span>DEO</h1>
      <p className="app-description">
        Now meet often. Join a room in one click, no <span style={{ whiteSpace: "nowrap" }}>sign-in</span> required, or sign in to start your own meeting &mdash;
        simple, reliable video calls for teams, classes, and catch-ups.
      </p>
      <div className="app-cta">
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => {
            showFlash("You have to sign up or login first to start a meeting of your own.", "info");
            setAuthMode('signup');
          }}
        >
          Start a meeting
        </Button>
        <Button variant="outlined" size="large" onClick={() => setShowJoinModal(true)} disabled={request}>
          Join with a code
        </Button>
      </div>

      {showJoinModal && (
        <JoinModal
          onClose={() => setShowJoinModal(false)}
          request={request}
          setRequest={setRequest}

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
          onLeaveOrEnd={() => {
            setShowJoinMeetModal(false);
            setYou(null);
            setRequest(false);
            setMeetingCode(null);
          }}
          meetingCode={meetingCode}
          you={you}
        />
      )}
    </div>
   );
}

export default AppInfo;
