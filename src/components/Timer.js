import React from "react";
import { formatNumber } from "../utils";

const Timer = ({ time, isTimeout, timerType }) => {
  return (
    <div className={`timer ${isTimeout ? "blink" : ""}`}>
      <h3 id="timer-label" className="timer__label">
        {timerType}
      </h3>
      <div id="time-left" className="timer__timeleft">
        {`${formatNumber(time.minutes)}:${formatNumber(time.seconds)}`}
      </div>
    </div>
  );
};

export default Timer;
