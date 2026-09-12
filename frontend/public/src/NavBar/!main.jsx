import './!main.css'
import { useEffect, useRef, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import AuthModal from '../AuthModal/!main';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeIfOutside = (event) => {
      if (!navRef.current.contains(event.target)) setMenuOpen(false);
    };

    document.addEventListener('pointerdown', closeIfOutside);
    return () => document.removeEventListener('pointerdown', closeIfOutside);
  }, [menuOpen]);

  const openAuth = (mode) => {
    setMenuOpen(false);
    setAuthMode(mode);
  };

  return ( 
    <>
      <header className="navBar" ref={navRef}>
        <a className="nav-brand" href="/">
          <i className="fa-solid fa-video nav-brand-icon" aria-hidden="true"></i>
          <span className="nav-brand-text">VI<span>ew</span>DEO</span>
        </a>
        <div className="nav-right">
          <IconButton className="menu-icon-container" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fa-solid fa-briefcase menu-icon"></i>
          </IconButton>
          <div className={menuOpen ? "nav-auth open" : "nav-auth"}>
            <Button variant="contained" onClick={() => openAuth('signup')}>Signup</Button>
            <Button variant="outlined" onClick={() => openAuth('login')}>Login</Button>
          </div>
        </div>
      </header>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitchMode={setAuthMode} />
      )}
    </>
   );
}

export default NavBar;
