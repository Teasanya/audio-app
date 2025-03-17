const convertMinToSec = (duration: number): string => {
  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);
  const minutes: number | string = formatTime(Math.floor(duration / 60));
  const seconds: number | string = formatTime(
    Math.floor(duration - +minutes * 60)
  );
  return `${minutes}:${seconds}`;
};

export default convertMinToSec;
