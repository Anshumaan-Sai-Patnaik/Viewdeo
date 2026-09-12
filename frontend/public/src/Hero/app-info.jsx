import Button from '@mui/material/Button';

function AppInfo() {
  return ( 
    <div className="app-info">
      <p className="app-eyebrow">Connecting Conversations, Anywhere</p>
      <h1 className="app-heading">VI<span>ew</span>DEO</h1>
      <p className="app-description">
        Now meet often. Join a room in one click, no <span style={{ whiteSpace: "nowrap" }}>sign-in</span> required, or sign in to start your own meeting &mdash;
        simple, reliable video calls for teams, classes, and catch-ups.
      </p>
      <div className="app-cta">
        <Button variant="contained" size="large">Start a meeting</Button>
        <Button variant="outlined" size="large">Join with a code</Button>
      </div>
    </div>
   );
}

export default AppInfo;
