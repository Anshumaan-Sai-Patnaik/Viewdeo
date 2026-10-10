import './!main.css';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useAuth } from '../../context/authContext.jsx';
import { useFlash } from '../../context/FlashContext.jsx';
import httpAPI from '../../services/http.js';
import socketAPI from "../../services/socket.js";

function StartModal({ onClose, meetingCode, joinRequest, setJoinRequest, onSuccessfulStart }) {
  const { user } = useAuth();
  const { showFlash } = useFlash();

  const closeIfBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleStartSubmit = async () => {
    try {
      const startResult = await httpAPI.post("/meeting/start", {
        meetingCode: meetingCode
      });

      if (!startResult.data.success) {
        showFlash(startResult.data.message, 'error');
        return;
      };

      const joinResult = await httpAPI.post("/meeting/join", {
        meetingCode: meetingCode,
        name: user.username
      });

      if (!joinResult.data.success) {
        showFlash(joinResult.data.message, 'error');
        return;
      };

      socketAPI.emit("start-the-meeting",
        { meetingCode },
        (response) => {
          setJoinRequest(response.status);
          response.message && showFlash(response.message, response.status ? "success" : "error");
          if (response.status) {
            const hostId = joinResult.data.participant._id
            onSuccessfulStart({
              participantId: hostId,
              name: user.username
            });
          }
        }
      );
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

        <Button className="start-submit" variant="contained" size="large" onClick={handleStartSubmit} style={{ marginTop: '1rem' }} disabled={joinRequest}>
          Start Meeting
        </Button>
      </div>
    </div>
  );
}

export default StartModal;
