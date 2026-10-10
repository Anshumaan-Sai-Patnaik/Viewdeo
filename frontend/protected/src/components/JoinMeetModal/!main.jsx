import './!main.css';

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import { useFlash } from '../../context/FlashContext.jsx';
import httpAPI from '../../services/http.js';
import socketAPI from "../../services/socket.js";

function JoinMeetModal({ onLeaveOrEnd, meetingCode, you }) {
  const { showFlash } = useFlash();

  const [hostId, setHostId] = useState(null);
  const [participants, setParticipants] = useState([
    {
      participantId: you.participantId,
      name: you.name,
      type: "you"
    }
  ]);

  const handleLeave = () => {
    socketAPI.emit("leave-meeting",
    (response) => {
      response.status && onLeaveOrEnd();
      response.message && showFlash(response.message, response.status ? "success" : "error");
    });
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
        setHostId(result.data.hostId);
        const fetchedParticipants = result.data.participants;
        setParticipants(prev => {
          const existingParticipantIds = new Set(prev.map(participant => participant.participantId?.toString()));
          const newParticipants = fetchedParticipants.filter(participant => !existingParticipantIds.has(participant.participantId?.toString()));
          return [...prev, ...newParticipants];
        });
      } catch (error) {
        const message = error.response?.data?.message || "An unexpected error occurred while joining.";
        showFlash(message, 'error');
      }
    };

    getParticipants();

    return () => controller.abort();
  }, [meetingCode]);

  useEffect(() => {
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
      showFlash(`${newParticipant.name} entered the meeting`,'info');
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

    const handleMeetingEnded = () => {
      onLeaveOrEnd();
      showFlash("Meeting has Ended", 'info');
    }

    socketAPI.on("new-participant", handleNewParticipant);
    socketAPI.on("participant-left", handleParticipantLeave);

    socketAPI.on("meeting-ended", handleMeetingEnded);

    return () => {
      socketAPI.off("new-participant", handleNewParticipant);
      socketAPI.off("participant-left", handleParticipantLeave);

      socketAPI.off("meeting-ended", handleMeetingEnded);
    };
  }, []);

  return (
    <div className="meet-overlay">
      <div className="meet-modal">
        <div className="meet-head">
          <h2 className="meet-title">Meeting Room</h2>
          <div className="meet-code-badge">
            Code: <span>{meetingCode}</span>
          </div>
        </div>

        <div className="meet-section">
          <div className="section-header">
            <h3 className="section-title">Participants</h3>
            <span className="count-badge">
              {participants.length}
            </span>
          </div>

          <div className="all-participants">
            {participants.length === 0 ? (
              <p className="no-participants">No participants in the room</p>
            ) : (
              participants.map((participant) => (
                <div className="a-participant" key={participant.participantId}>
                  <div className="participant-info">
                    <span className="participant-name">
                      {participant.name}
                    </span>
                    <span className={`role-badge ${participant.participantId === you.participantId ? 'you' : participant.participantId === hostId ? 'host' : participant.type}`}>
                      {
                        participant.participantId === you.participantId
                          ? "YOU"
                          : participant.participantId === hostId
                            ? "HOST"
                            : participant.type.toUpperCase()
                      }
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Button className="meet-submit leave-meeting" variant="contained" size="medium" onClick={handleLeave}>
          Leave Meeting
        </Button>
      </div>
    </div>
  );
}

export default JoinMeetModal;
