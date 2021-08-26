import React from "react";

const TimerControls = ({ handlePlayPause, handleReset }) => {
  return (
    <div className="timer-controls">
      <button
        id="start_stop"
        className="button"
        onClick={handlePlayPause}
        aria-label="start or stop timer"
      >
        &#9654;||
      </button>
      <button
        id="reset"
        className="button"
        onClick={handleReset}
        aria-label="Reset timer"
      >
        &#10227;
      </button>
    </div>
  );
};

export default TimerControls;
