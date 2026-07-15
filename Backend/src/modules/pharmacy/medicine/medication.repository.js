import MedicationSchedule from "./medication-schedule.model.js";

const create = (data) => MedicationSchedule.create(data);

const findByUser = (userId) =>
  MedicationSchedule.find({ userId }).sort({ createdAt: -1 });

const findById = (id) => MedicationSchedule.findById(id);

const findActiveById = (id) =>
  MedicationSchedule.findOne({ _id: id, active: true });

const setActive = (id, userId, active) =>
  MedicationSchedule.findOneAndUpdate(
    { _id: id, userId },
    { active },
    { new: true },
  );

export { create, findByUser, findById, findActiveById, setActive };
