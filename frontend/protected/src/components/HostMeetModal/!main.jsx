import './!main.css';

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import { useFlash } from '../../context/FlashContext.jsx';
import httpAPI from '../../services/http.js';
import socketAPI from "../../services/socket.js";

function HostMeetModal({ onEnd, meetingCode, you }) {
  const { showFlash } = useFlash();

  const [waitingParticipants, setWaitingParticipants] = useState([]);
  const [participants, setParticipants] = useState([
    {
      participantId: you.participantId,
      name: you.name,
      type: "user",
      isHost: true
    }
  ]);

  const handleEnd = () => {
    // yet to build
    socketAPI.emit("end-meeting",
    (response) => {
      response.status && onEnd();
      response.message && showFlash(response.message, response.status ? "success" : "error");
    });
  };

  const handleAccept = (participantId) => {
    console.log("Accepting, ", participantId);
    socketAPI.emit("accept-a-participant", {
      meetingCode,
      participantId
    });
    setWaitingParticipants((prev) =>
      prev.filter((p) => p.participantId !== participantId)
    );
  };
  const handleReject = (participantId) => {
    console.log("Rejecting, ", participantId);
    socketAPI.emit("reject-a-participant", {
      meetingCode,
      participantId
    });
    setWaitingParticipants((prev) =>
      prev.filter((p) => p.participantId !== participantId)
    );
  };

  useEffect(() => {
    const controller = new AbortController();

    const getParticipants = async () => {
      try {
        const result = await httpAPI.get(
          `/meeting/${meetingCode}/participants`,
          {
            params: {
              participantId: you.participantId
            },
            signal: controller.signal
          }
        );

        if (!result.data.success) {
          showFlash(result.data.message, 'error');
          return;
        }
        const fetchedParticipants = result.data.participants;
        setParticipants(prev => {
          const existingParticipantIds = new Set(prev.map(participant => participant.participantId?.toString()));
          const newParticipants = fetchedParticipants.filter(participant => !existingParticipantIds.has(participant.participantId?.toString()));
          return [...prev, ...newParticipants];
        });
      } catch (error) {
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') return;
        const message = error.response?.data?.message || "An unexpected error occurred while joining.";
        showFlash(message, 'error');
      }
    };

    getParticipants();

    return () => controller.abort();
  }, [meetingCode]);

  useEffect(() => {
    const handleInWait = (data) => {
      setWaitingParticipants((prev) => {
        // Prevent any duplicate participant entries
        if (prev.some((p) => p.participantId === data.participantId)) {
          return prev;
        }
        return [...prev, data];
      });
    };

    const handleNewParticipant = (data) => {
      const newParticipant = {
        participantId: data.participantId,
        name: data.name,
        type: data.type
      };
      setParticipants(prev => {
        const alreadyExists = prev.some(
          participant => participant.participantId === newParticipant.participantId
        );
        if (alreadyExists) {
          return prev;
        }

        return [...prev, newParticipant]});
    };
    const handleParticipantLeave = (data) => {
      const participantLeaving = {
        participantId: data.participantId,
        name: data.name
      };
      setParticipants(prev => 
        prev.filter(
          participant => participant.participantId !== participantLeaving.participantId
        )
      );
      showFlash(`${participantLeaving.name} left the meeting`,'info');
    };

    socketAPI.on("set-in-wait", handleInWait);

    socketAPI.on("new-participant", handleNewParticipant);
    socketAPI.on("participant-left", handleParticipantLeave);

    return () => {
      socketAPI.off("set-in-wait", handleInWait);

      socketAPI.off("new-participant", handleNewParticipant);
      socketAPI.off("participant-left", handleParticipantLeave);
    };
  }, []);

  return (
    <div className="meet-overlay">
      <div className="meet-modal">
        <div className="meet-head">
          <h2 className="meet-title">Host Controls</h2>
          <div className="meet-code-badge">
            Code: <span>{meetingCode}</span>
          </div>
        </div>

        {/* Waiting Room Section */}
        <div className="meet-section">
          <div className="section-header">
            <h3 className="section-title">Waiting Room</h3>
            <span className={`count-badge ${waitingParticipants.length > 0 ? 'active' : ''}`}>
              {waitingParticipants.length}
            </span>
          </div>

          <div className="waiting-participants">
            {waitingParticipants.length === 0 ? (
              <p className="no-participants">No participants waiting to join</p>
            ) : (
              waitingParticipants.map((waitingParticipant) => (
                <div className="waiting-participant" key={waitingParticipant.participantId}>
                  <div className="participant-info">
                    <span className="participant-name">
                      {waitingParticipant.name}
                    </span>
                    <span className="role-badge guest">
                      {waitingParticipant.type}
                    </span>
                  </div>

                  <div className="participant-actions">
                    <Button className="btn-accept" variant="contained" size="small" onClick={() => handleAccept(waitingParticipant.participantId)}>
                      Accept
                    </Button>
                    <Button className="btn-reject" variant="outlined" size="small" onClick={() => handleReject(waitingParticipant.participantId)}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <hr className="meet-divider" />

        {/* Active Participants Section */}
        <div className="meet-section">
          <div className="section-header">
            <h3 className="section-title">Active Participants</h3>
            <span className="count-badge">
              {participants.length}
            </span>
          </div>

          <div className="all-participants">
            {participants.map((participant) => (
              <div className="a-participant" key={participant.participantId}>
                <div className="participant-info">
                  <span className="participant-name">
                    {participant.name}
                  </span>
                  <span className={`role-badge ${participant.isHost ? 'host' : participant.type}`}>
                    {participant.isHost ? "HOST" : participant.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button className="meet-submit end-meeting" variant="contained" size="medium" onClick={handleEnd}>
          End Meeting
        </Button>
      </div>
    </div>
  );
}

export default HostMeetModal;

