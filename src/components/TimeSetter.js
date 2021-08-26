import React from "react";

const TimeSetter = ({ title, value, idPrefix, handleClick }) => {
  return (
    <div className="time-setter">
      <h4 id={`${idPrefix}-label`}>{title}</h4>
      <div className="time-setter__controls">
        <button
          id={`${idPrefix}-decrement`}
          className="button"
          onClick={() => {
            handleClick(-1);
          }}
          aria-label={`decrease ${title} by 1`}
        >
          &dArr;
        </button>
        <span id={`${idPrefix}-length`} aria-label={title}>
          {value}
        </span>
        <button
          id={`${idPrefix}-increment`}
          className="button"
          onClick={() => {
            handleClick(1);
          }}
          aria-label={`increase ${title} by 1`}
        >
          &uArr;
        </button>
      </div>
    </div>
  );
};

export default TimeSetter;
