import './!main.css'

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import AuthForm from './auth-form';

function AuthModal({ mode, onClose, onSwitchMode }) {
  const isSignup = mode === 'signup';
  const label = mode === 'signup' ? 'Sign up with Google' : 'Log in with Google';


  const closeIfBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return ( 
    <div className="auth-overlay" onPointerDown={closeIfBackdrop}>
      <div className="auth-modal">
        <IconButton className="auth-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </IconButton>

        <div className="auth-head">
          <span className="auth-mark">
            <i className="fa-solid fa-video"></i>
          </span>
          <h2 className="auth-title">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="auth-subtitle">
            {isSignup
              ? 'Save meeting history, create meetings, and unlock more.'
              : 'Log in to jump back into your rooms.'}
          </p>
        </div>


        <Button
          className="auth-google" variant="outlined" size="large"
          startIcon={<i className="fa-brands fa-google" aria-hidden="true"></i>}
        >
          {label}
        </Button>

        <div className="auth-divider"><span>or</span></div>

        <AuthForm mode={mode} />

        <p className="auth-switch">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button type="button" onClick={() => onSwitchMode(isSignup ? 'login' : 'signup')}>
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
   );
}

export default AuthModal;
