import React from "react";
import useInterval from "./useInterval";

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

export default useTimer;
