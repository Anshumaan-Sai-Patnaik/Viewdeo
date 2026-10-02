import './!main.css';

import { useState } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { useAuth } from '../../context/authContext'
import { useFlash } from '../../context/FlashContext.jsx';
import httpAPI from '../../services/http.js';
import socketAPI from "../../services/socket.js";

function JoinModal({ onClose, inMeeting, setInMeeting }) {
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
      const result = await httpAPI.post("/meeting/join", {
        meetingCode: meetingCode.trim(),
        name: user.username
      });

      if (!result.data.success) {
        showFlash(result.data.message, 'error');
        return;
      }
      console.log(result);
      const participantId = result.data.participant._id;
      socketAPI.emit("request-to-join", {
        meetingCode,
        participantId
      },
      (response) => {
        setInMeeting(response);
      });
      socketAPI.on("participant-accepted", (data) => {
        console.log("Participant accepted:", data);
      });
    } catch (error) {
      const message = error.response?.data?.message || "An unexpected error occurred while joining.";
      showFlash(message, 'error');
    }
  };

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
          <Button className="join-submit" variant="contained" size="large" type="submit" style={{ marginTop: '1rem' }} disabled={inMeeting}>
            Join Meeting
          </Button>
        </form>
      </div>
    </div>
  );
}

export default JoinModal;
