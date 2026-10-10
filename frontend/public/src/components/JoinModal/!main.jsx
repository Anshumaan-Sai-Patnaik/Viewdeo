import './!main.css';

import { useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useFlash } from '../../context/FlashContext.jsx';
import httpAPI from '../../services/http.js';
import socketAPI from "../../services/socket.js";

function JoinModal({ onClose, request, setRequest, onSuccessfulJoin }) {
  const { showFlash } = useFlash();

  const pendingJoinRef = useRef(null);

  const closeIfBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleJoinSubmit = async (event) => {
    event.preventDefault();
    setRequest(true);

    const formData = new FormData(event.target);
    const meetingCode = formData.get('meetingCode').trim();
    const guestName = formData.get('name').trim();

    if (!meetingCode || !guestName) {
      showFlash("Please enter both meeting code and your name.", "error");
      return;
    }

    try {
      const result = await httpAPI.post("/meeting/join", {
        meetingCode: meetingCode,
        name: guestName
      });

      if (!result.data.success) {
        setRequest(false);
        showFlash(result.data.message, 'error');
        return;
      };

      pendingJoinRef.current = { meetingCode, participant: result.data.participant };
      const participantId = result.data.participant._id;
      socketAPI.emit("request-to-join",
        { meetingCode, participantId },
        (response) => {
          setRequest(response.status);
          response.message && showFlash(response.message, response.status ? "success" : "error");
        }
      );
    } catch (error) {
      setRequest(false);
      const message = error.response?.data?.message || "An unexpected error occurred while joining.";
      showFlash(message, 'error');
    }
  };

  useEffect(() => {
    const handleAccepted = (data) => {
      showFlash("You were accepted into the meeting", 'success');
      onSuccessfulJoin(pendingJoinRef.current.meetingCode, {
        participantId: data.participantId,
        name: data.name
      });
    };
    const handleRejected = () => {
      showFlash("You were rejected from the meeting", 'error');
      setRequest(false);
    };

    socketAPI.on("participant-accepted", handleAccepted);
    socketAPI.on("participant-rejected", handleRejected);

    return () => {
      socketAPI.off("participant-accepted", handleAccepted);
      socketAPI.off("participant-rejected", handleRejected);
    };
  }, []);

  return (
    <div className="join-overlay" onPointerDown={closeIfBackdrop}>
      <div className="join-modal">
        <IconButton className="join-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </IconButton>

        <div className="join-head">
          <span className="join-mark">
            <i className="fa-solid fa-users"></i>
          </span>
          <h2 className="join-title">
            Join a Meeting
          </h2>
          <p className="join-subtitle">
            Enter the meeting code and your name to join as a guest.
          </p>
        </div>

        <form className="join-form" onSubmit={handleJoinSubmit}>
          <div className="join-field">
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

          <div className="join-field">
            <label htmlFor="join-name">Your Name</label>
            <input
              id="join-name"
              name="name"
              type="text"
              placeholder="e.g. Ada Lovelace"
              required
            />
          </div>

          <Button className="join-submit" variant="contained" size="large" type="submit" style={{ marginTop: '1rem' }} disabled={request}>
            Join Meeting
          </Button>
        </form>
      </div>
    </div>
  );
}

export default JoinModal;
