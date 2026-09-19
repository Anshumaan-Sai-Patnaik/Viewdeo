import './!main.css';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useFlash } from '../../context/FlashContext.jsx';
import api from '../../services/api.js';

function StartModal({ onClose, meetingCode }) {
  const { showFlash } = useFlash();

  const closeIfBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleStartSubmit = async () => {
    try {
      const result = await api.post("/meeting/start", {
        meetingCode: meetingCode
      });

      if (!result.data.success) {
        showFlash(result.data.message, 'error');
        return;
      };
      console.log(result);
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred while Starting Meeting.";
      showFlash(message, 'error');
    }
  };

  return (
    <div className="auth-overlay" onPointerDown={closeIfBackdrop}>
      <div className="auth-modal">
        <IconButton className="auth-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </IconButton>

        <div className="auth-head">
          <div className="auth-title">
            <h2>Meeting Code</h2>
          </div>
          <h2 className="auth-title">
            {meetingCode}
          </h2>
        </div>

        <Button className="auth-submit" variant="contained" size="large" onClick={handleStartSubmit} style={{ marginTop: '1rem' }}>
          Start Meeting
        </Button>
      </div>
    </div>
  );
}

export default StartModal;