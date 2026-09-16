import './App.css'
import { useEffect, useState } from "react";

import api from "./services/api";
import Hero from './Hero/!main'
import NavBar from './NavBar/!main'

function App() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.get("/user/me")
      .then(() => {
        window.location.href = import.meta.env.VITE_PROTECTED_URL;
      })
      .catch(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    return ;
  }

  return (
    <div className="app-shell">
      <NavBar />
      <main className="app-main">
        <Hero />
      </main>
    </div>
  )
}

export default App
