export const ease = [0.22, 1, 0.36, 1];

export function fadeUp(reduce) {
  if (reduce) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    };
  }

  return {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease },
    },
  };
}
