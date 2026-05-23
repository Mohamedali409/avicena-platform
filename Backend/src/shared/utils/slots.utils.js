/**
 * Shared slot booking/release utilities used by both appointments & consultations.
 */

/**
 * Add a time slot to doctor's booked slots.
 * @returns {Object} updated slots_booked object
 */
export const addSlot = (slotsBooked, date, time) => {
  const slots = { ...slotsBooked };
  if (!slots[date]) slots[date] = [];
  slots[date].push(time);
  return slots;
};

/**
 * Remove a time slot from doctor's booked slots.
 */
export const removeSlot = (slotsBooked, date, time) => {
  const slots = { ...slotsBooked };
  if (slots[date]) {
    slots[date] = slots[date].filter((t) => t !== time);
    if (slots[date].length === 0) delete slots[date];
  }
  return slots;
};

/**
 * Check if a slot is already taken.
 */
export const isSlotTaken = (slotsBooked, date, time) =>
  Boolean(slotsBooked[date]?.includes(time));
