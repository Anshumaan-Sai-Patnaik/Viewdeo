import './App.css'

import Button from '@mui/material/Button';

import { useAuth } from './context/authContext'
import api from './services/api'

function App() {
  const { user } = useAuth();

  async function handleCreateMeeting() {
    try {
      await api.post("/meeting/create");
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <p className="text-2xl font-medium">Hello, {user.username}</p>
      <Button variant="contained" onClick={handleCreateMeeting}>Create Meeting</Button>
    </div>
  )
}

export default App
