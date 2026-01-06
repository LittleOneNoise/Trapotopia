export const parseIso = (isoString: string): Date | null => {
  if (!isoString) return null;

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    console.error(`Date invalide fournie : ${isoString}`);
    return null;
  }

  return date;
};

export const getYearFromIso = (isoString: string): number | null => {
  const date = parseIso(isoString);

  // getUTCFullYear() utilise le temps universel (ce qui est souvent mieux pour les formats 'Z').
  return date ? date.getUTCFullYear() : null;
};
