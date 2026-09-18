import './App.css'
import { useEffect, useState } from "react";

import api from "./services/api";
import Hero from './Hero/!main'
import NavBar from './NavBar/!main'
import AuthModal from './components/AuthModal/!main'
import { useFlash } from "./context/FlashContext.jsx";

function App() {
  const [checking, setChecking] = useState(true);
  const [authMode, setAuthMode] = useState(null);
  const { showFlash } = useFlash();

  useEffect(() => {
    // Check for Google OAuth error in URL
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam) {
      showFlash(decodeURIComponent(errorParam), "error");
      // Clean up URL, pressing the browser Back button won't take you back to: ?error
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    api.get("/auth/me")
      .then(() => {
        window.location.href = import.meta.env.VITE_PROTECTED_URL || "http://localhost:5174";
      })
      .catch(() => {
        setChecking(false);
      });
  }, [showFlash]);

  if (checking) {
    return ;
  }

  return (
    <div className="app-shell">
      <NavBar setAuthMode={setAuthMode} />
      <main className="app-main">
        <Hero setAuthMode={setAuthMode} />
      </main>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitchMode={setAuthMode} />
      )}
    </div>
  )
}

export default App
