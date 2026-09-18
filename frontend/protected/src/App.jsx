import './App.css'

import { useState } from 'react';
import Button from '@mui/material/Button';

import { useAuth } from './context/authContext'
import api from './services/api'
import JoinModal from './components/JoinModal/!main.jsx';

function App() {
  const { user } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);

  async function handleCreateMeeting() {
    try {
      await api.post("/meeting/create");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <p className="text-2xl font-medium">Hello, {user.username}</p>
      <Button variant="contained" onClick={handleCreateMeeting}>Create Meeting</Button>
      <Button variant="contained" onClick={() => setShowJoinModal(true)}>Join Meeting</Button>

      {showJoinModal && (
        <JoinModal onClose={() => setShowJoinModal(false)} />
      )}
    </div>
  )
}

export default App
