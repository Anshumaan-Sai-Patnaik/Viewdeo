import './!main.css'
import { useEffect, useRef, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeIfOutside = (event) => {
      if (!navRef.current.contains(event.target)) setMenuOpen(false);
    };

    document.addEventListener('pointerdown', closeIfOutside);
    return () => document.removeEventListener('pointerdown', closeIfOutside);
  }, [menuOpen]);

  return ( 
    <div className="navBar" ref={navRef}>
      <IconButton className="menu-icon-container" onClick={() => setMenuOpen(!menuOpen)}>
        <i className="fa-solid fa-briefcase menu-icon"></i>
      </IconButton>
      <div className={menuOpen ? "nav-auth open" : "nav-auth"}>
        <Button variant="contained">Signup</Button>
        <Button variant="outlined">Login</Button>
      </div>
    </div>
   );
}

export default NavBar;
