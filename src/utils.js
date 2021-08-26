export const isAudioPlaying = (audio) =>
  !audio.paused && !audio.ended && audio.readyState;

export const formatNumber = (num) => {
  return ("0" + num).slice(-2);
};
