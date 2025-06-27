const convertMinToSec = (duration: number): string => {
  if (!isFinite(duration)) return '00:00';
  const formatTime = (time: number) => time.toString().padStart(2, '0');
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${formatTime(minutes)}:${formatTime(seconds)}`;
};

export default convertMinToSec;
