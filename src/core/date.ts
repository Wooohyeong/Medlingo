export const todayStr = () => new Date().toLocaleDateString('sv-SE');
export const addDays = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('sv-SE');
};
