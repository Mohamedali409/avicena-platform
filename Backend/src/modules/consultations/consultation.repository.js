import Consultation from "./consultation.model.js";

const findAllConsultationsByUserId = (userId) => {
  return Consultation.find({ userId }).sort({
    createdAt: -1,
  });
};

const getConsultation = (appointmentId, docId, userId) => {
  return Consultation.findOne({ appointmentId, docId, userId });
};

const findById = (consultationId) => {
  return Consultation.findById(consultationId);
};

const getConsultationConflict = (
  docId,
  consultDay,
  consultTime,
  consultationId,
) => {
  return Consultation.findOne({
    docId,
    consultDay,
    consultTime,
    _id: { $ne: consultationId },
  });

  /// TODO
};

const findConsultationAndUpdate = (consultationId, data) => {
  return Consultation.findByIdAndUpdate(
    consultationId,
    { data },
    { new: true },
  );
};

const getConsultationCountDocumentsByUserId = (userId) => {
  return Consultation.countDocuments({ userId });
};

const getConsultationCountDocuments = () => {
  return Consultation.countDocuments();
};

const lastConsultation = () => {
  return Consultation.find().sort({ createdAt: -1 }).limit(5);
};

const getConsultations = () => {
  return Consultation.find().sort({ createdAt: -1 });
};

const cancelConsultation = (consultationId) => {
  return Consultation.findByIdAndUpdate(consultationId, { cancelled: true });
};

const completeConsultation = (consultationId) => {
  return Consultation.findByIdAndUpdate(consultationId, { isCompleted: true });
};

export {
  findAllConsultationsByUserId,
  getConsultation,
  findById,
  getConsultationConflict,
  findConsultationAndUpdate,
  getConsultationCountDocumentsByUserId,
  getConsultationCountDocuments,
  lastConsultation,
  getConsultations,
  cancelConsultation,
  completeConsultation,
};
