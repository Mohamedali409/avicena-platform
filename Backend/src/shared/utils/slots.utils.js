export const addSlot = (slotsBooked, date, time) => {
  const slots = { ...slotsBooked };
  if (!slots[date]) slots[date] = [];
  slots[date].push(time);
  return slots;
};

export const removeSlot = (slotsBooked, date, time) => {
  const slots = { ...slotsBooked };
  if (slots[date]) {
    slots[date] = slots[date].filter((t) => t !== time);
    if (slots[date].length === 0) delete slots[date];
  }
  return slots;
};

export const isSlotTaken = (slotsBooked, date, time) =>
  Boolean(slotsBooked[date]?.includes(time));

// Generate every bookable time slot for a working day as "HH:MM" strings.
// `from` / `to` are hours (24h); `period` is the gap in minutes. The last slot
// is the latest start that still fits a full period before `to`.
// e.g. generateDaySlots(9, 16, 15) -> "09:00", "09:15", ... , "15:45".
export const generateDaySlots = (from = 9, to = 16, period = 15) => {
  const slots = [];
  const step = period > 0 ? period : 15;
  for (let mins = from * 60; mins + step <= to * 60; mins += step) {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
  }
  return slots;
};
