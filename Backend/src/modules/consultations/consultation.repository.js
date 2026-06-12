import Consultation from "./consultation.model.js";

const createConsultation = (data) => {
  return Consultation.create(data);
};

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

const getDoctorConsultations = (docId) => {
  return Consultation.find({ docId }).sort({ createdAt: -1 });
};

const cancelConsultation = (consultationId) => {
  return Consultation.findByIdAndUpdate(consultationId, { cancelled: true });
};

const completeConsultation = (consultationId) => {
  return Consultation.findByIdAndUpdate(consultationId, { isCompleted: true });
};

export {
  createConsultation,
  findAllConsultationsByUserId,
  getConsultation,
  findById,
  getConsultationConflict,
  findConsultationAndUpdate,
  getConsultationCountDocumentsByUserId,
  getConsultationCountDocuments,
  lastConsultation,
  getConsultations,
  getDoctorConsultations,
  cancelConsultation,
  completeConsultation,
};
