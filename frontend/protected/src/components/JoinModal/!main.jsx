import './!main.css';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useAuth } from '../../context/authContext'
import { useFlash } from '../../context/FlashContext.jsx';
import api from '../../services/api.js';

function JoinModal({ onClose }) {
  const { user } = useAuth();
  const { showFlash } = useFlash();

  const closeIfBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleJoinSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const meetingCode = formData.get('meetingCode');

    if (!meetingCode.trim()) {
      showFlash("Please enter the meeting code", "error");
      return;
    }

    try {
      const result = await api.post("/meeting/join", {
        meetingCode: meetingCode.trim(),
        name: user.name
      });

      if (result.data.success) {
        console.log(result);
      }
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred while joining.";
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
          <span className="auth-mark">
            <i className="fa-solid fa-users"></i>
          </span>
          <h2 className="auth-title">
            Join a Meeting
          </h2>
        </div>

        <form className="auth-form" onSubmit={handleJoinSubmit}>
          <div className="auth-field">
            <label htmlFor="join-code">Meeting Code</label>
            <input
              id="join-code"
              name="meetingCode"
              type="text"
              placeholder="e.g. L6BSQ3"
              required
              autoFocus
            />
          </div>
          <Button className="auth-submit" variant="contained" size="large" type="submit" style={{ marginTop: '1rem' }}>
            Join Meeting
          </Button>
        </form>
      </div>
    </div>
  );
}

export default JoinModal;