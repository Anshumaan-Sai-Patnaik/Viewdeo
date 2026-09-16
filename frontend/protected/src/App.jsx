import './App.css'

import { useAuth } from './context/authContext'

function App() {
  const { user } = useAuth();

  return (
    <p>Hello {user.username}</p>
  )
}

export default App
