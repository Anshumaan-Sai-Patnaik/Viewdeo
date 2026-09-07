import './!main.css'
import { useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return ( 
    <div className="navBar">
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
