import './!main.css';

import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import socketAPI from "../../services/socket.js";

function MeetModal({ onClose, meetingCode }) {
  const [participants, setParticipants] = useState([]);
  const [handledParticipants, setHandledParticipants] = useState([]);

  const closeIfBackdrop = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  useEffect(() => {
    const handleInWait = (data) => {
      setParticipants((prev) => {
        // Prevent any duplicate participant entries
        if (prev.some((p) => p.participantId === data.participantId)) {
          return prev;
        }
        return [...prev, data];
      });
    };

    socketAPI.on("set-in-wait", handleInWait);

    // Returned function runs when the component unmounts(removed from the UI):
    return () => {
      socketAPI.off("set-in-wait", handleInWait);
    };
  }, []);

  const handleAccept = (participantId) => {
    console.log("Accepting participant:", participantId);
    socketAPI.emit("accept-a-participant", {
      meetingCode,
      participantId
    });

    setHandledParticipants((prev) => [...prev, participantId]);
  };

  const handleReject = (participantId) => {
    console.log("Rejecting participant:", participantId);
    socketAPI.emit("reject-a-participant", {
      meetingCode,
      participantId
    });

    setHandledParticipants((prev) => [...prev, participantId]);
  };

  return (
    <div className="meet-overlay" onPointerDown={closeIfBackdrop}>
      <div className="meet-modal">
        <IconButton className="meet-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </IconButton>

        <div className="meet-head">
          <div className="meet-title">
            {participants.length === 0 ? (
              <h2>No Participants Waiting</h2>
            ) : (
              <h2>Waiting Participants</h2>
            )}
          </div>
        </div>

        <div className="waiting-participants">
          {participants.length === 0 ? (
            <> </>
          ) : (
            participants.map((participant) => (
              <div className="waiting-participant" key={participant.participantId}>
                <div className="participant-info">
                  <span className="participant-name">
                    {participant.name}
                  </span>
                  <span className="participant-type">
                    {participant.type}
                  </span>
                </div>

                <Button className="meet-submit" variant="contained" size="small" onClick={() => handleAccept(participant.participantId) } disabled={handledParticipants.includes(participant.participantId)}>
                  Accept
                </Button>
                <Button className="meet-submit" variant="contained" size="small" onClick={() => handleReject(participant.participantId) } disabled={handledParticipants.includes(participant.participantId)}>
                  Reject
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetModal;
