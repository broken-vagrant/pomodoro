import React from "react";
import "./App.scss";

let beepSoundUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

const appName = "25+5 Clock";

// Shamelessly Copied from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
function useTimeout(callback, delay) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}

const Button = ({ children, ...buttonProps }) => {
  return (
    <button {...buttonProps} className="button">
      {children}
    </button>
  );
};
const TimeSetter = ({ title, value, idPrefix, handleClick }) => {
  return (
    <div className="time-setter">
      <h4 id={`${idPrefix}-label`}>{title}</h4>
      <div className="time-setter__controls">
        <Button
          id={`${idPrefix}-decrement`}
          onClick={() => {
            handleClick(-1);
          }}
          aria-label={`decrease ${title} by 1`}
        >
          &dArr;
        </Button>
        <span id={`${idPrefix}-length`} aria-label={title}>
          {value}
        </span>
        <Button
          id={`${idPrefix}-increment`}
          onClick={() => {
            handleClick(1);
          }}
          aria-label={`increase ${title} by 1`}
        >
          &uArr;
        </Button>
      </div>
    </div>
  );
};
const formatNumber = (num) => {
  return ("0" + num).slice(-2);
};
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
const TimerControls = ({ handlePlayPause, handleReset }) => {
  return (
    <div className="timer-controls">
      <Button id="start_stop" onClick={handlePlayPause} aria-label="start or stop timer">
        &#9654;||
      </Button>
      <Button id="reset" onClick={handleReset} aria-label="Reset timer">
        &#10227;
      </Button>
    </div>
  );
};

const useTimer = (minutes) => {
  const [time, setTime] = React.useState({
    minutes: minutes,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = React.useState(false);
  const [isTimeout, setIsTimeout] = React.useState(false);

  React.useEffect(() => {
    setTime({ minutes, seconds: 0 });
  }, [minutes]);

  const startTimer = () => {
    setIsRunning(true);
    setIsTimeout(false);
  };
  const tick = () => {
    setTime((currTime) => {
      if (currTime.seconds < 1) {
        if (currTime.minutes === 0) {
          setIsTimeout(true);
          return {
            minutes: 0,
            seconds: 0,
          };
        }
        return {
          minutes: currTime.minutes - 1,
          seconds: 59,
        };
      }
      return {
        minutes: currTime.minutes,
        seconds: currTime.seconds - 1,
      };
    });
  };

  useInterval(tick, isRunning ? 1000 : null);

  const stopTimer = () => {
    setIsRunning(false);
  };
  const resetTimer = () => {
    stopTimer();
    setTime(() => {
      return {
        minutes: minutes,
        seconds: 0,
      };
    });
  };
  const setTimer = (minutes) => {
    setTime(() => {
      return { minutes, seconds: 0 };
    });
  };
  return [
    time,
    isTimeout,
    isRunning,
    { startTimer, stopTimer, resetTimer, setTimer },
  ];
};

const isAudioPlaying = (audio) =>
  !audio.paused && !audio.ended && audio.readyState;

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
      <footer>Not so great Design by Afroz</footer>
    </div>
  );
}

export default App;
