import { useState } from 'react';
import Button from '@mui/material/Button';

import { useFlash } from '../context/FlashContext.jsx';
import JoinModal from '../components/JoinModal/!main.jsx';

function AppInfo({ setAuthMode }) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { showFlash } = useFlash();

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
        <Button variant="outlined" size="large" onClick={() => setShowJoinModal(true)}>Join with a code</Button>
      </div>

      {showJoinModal && (
        <JoinModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
   );
}

export default AppInfo;
