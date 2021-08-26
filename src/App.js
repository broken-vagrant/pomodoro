import React from "react";
import "./App.scss";
import useTimeout from "./hooks/useTimeout";
import useTimer from "./hooks/useTimer";
import TimeSetter from "./components/TimeSetter";
import Timer from "./components/Timer";
import TimerControls from "./components/TimerControls";
import { isAudioPlaying } from "./utils";
import { appName, beepSoundUrl } from "./constants";

function App() {
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timerType, setTimerType] = React.useState("Session");

  const [
    time,
    isTimeout,
    isTimerRunning,
    { startTimer, stopTimer, resetTimer, setTimer },
  ] = useTimer(sessionLength);

  const handleBreakLengthChange = (value) => {
    setBreakLength((curr) => {
      if (value < 0) {
        return curr < 2 ? 1 : curr + value;
      } else {
        return curr > 59 ? 60 : curr + value;
      }
    });
  };
  const handleSessionLengthChange = (value) => {
    setSessionLength((curr) => {
      if (value < 0) {
        return curr < 2 ? 1 : curr + value;
      } else {
        return curr > 59 ? 60 : curr + value;
      }
    });
  };
  const handlePlayPause = () => {
    pauseBeep(); // stop any audio playing
    if (!isTimerRunning) {
      startTimer();
    } else {
      stopTimer();
    }
  };
  const audioRef = React.useRef();
  const pauseBeep = () => {
    if (audioRef.current) {
      if (isAudioPlaying(audioRef.current)) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };
  const playBeep = () => {
    if (audioRef.current) {
      if (!isAudioPlaying(audioRef.current)) {
        audioRef.current.play();
      }
    }
  };
  const handleReset = () => {
    pauseBeep();
    resetTimer();
    setTimerType("Session");
    setSessionLength(25);
    setBreakLength(5);
  };
  const startSession = () => {
    setTimerType("Session");
    setTimer(sessionLength);
    startTimer();
  };
  const startBreak = () => {
    setTimerType("Break");
    setTimer(breakLength);
    startTimer();
  };
  const handleTimeout = () => {
    if (timerType === "Session") {
      startBreak();
    } else {
      startSession();
    }
  };
  React.useEffect(() => {
    if (isTimeout) {
      playBeep();
    }
  }, [isTimeout]);

  // wait for 3 seconds after timeout (blinking time)
  useTimeout(handleTimeout, isTimeout ? 3000 : null);

  return (
    <div>
      <header>
        <h2>{appName}</h2>
      </header>
      <section className="app">
        <div className="time-setters">
          <TimeSetter
            title="Break length"
            idPrefix="break"
            value={breakLength}
            handleClick={handleBreakLengthChange}
          />
          <TimeSetter
            title="Session length"
            idPrefix="session"
            value={sessionLength}
            handleClick={handleSessionLengthChange}
          />
        </div>
        <Timer time={time} isTimeout={isTimeout} timerType={timerType} />
        <TimerControls
          handlePlayPause={handlePlayPause}
          handleReset={handleReset}
        />
        <audio
          aria-hidden="true"
          id="beep"
          preload="auto"
          src={beepSoundUrl}
          ref={audioRef}
        ></audio>
      </section>
      <footer>developed by Afroz</footer>
    </div>
  );
}

export default App;
