import './!main.css';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useFlash } from '../../context/FlashContext.jsx';
import httpAPI from '../../services/http.js';
import socketAPI from "../../services/socket.js";

function StartModal({ onClose, meetingCode, inMeeting, setInMeeting, setShowMeetModal }) {
  const { showFlash } = useFlash();

  const closeIfBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleStartSubmit = async () => {
    try {
      const result = await httpAPI.post("/meeting/start", {
        meetingCode: meetingCode
      });

      if (!result.data.success) {
        showFlash(result.data.message, 'error');
        return;
      };
      console.log(result);
      socketAPI.emit("start-the-meeting", {
        meetingCode
      });
      setInMeeting(true);
      setShowMeetModal(true);
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred while Starting Meeting.";
      showFlash(message, 'error');
    }
  };

  return (
    <div className="start-overlay" onPointerDown={closeIfBackdrop}>
      <div className="start-modal">
        <IconButton className="start-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </IconButton>

        <div className="start-head">
          <div className="start-title">
            <h2>Meeting Code</h2>
          </div>
          <h2 className="start-title">
            {meetingCode}
          </h2>
        </div>

        <Button className="start-submit" variant="contained" size="large" onClick={handleStartSubmit} style={{ marginTop: '1rem' }} disabled={inMeeting}>
          Start Meeting
        </Button>
      </div>
    </div>
  );
}

export default StartModal;
