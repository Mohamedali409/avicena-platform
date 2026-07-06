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
