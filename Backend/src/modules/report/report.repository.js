import Report from "./report.model.js";

const createReport = (data) => {
  return Report.create(data);
};

const findReportByUserId = (userId) => {
  return Report.find({ userId }).sort({ createdAt: -1 });
};

const getReportCountDocumentsByUserId = (userId) => {
  return Report.countDocuments({ userId });
};

const getReportCountDocuments = () => {
  return Report.countDocuments();
};

const getReports = () => {
  return Report.find().sort({ createdAt: -1 });
};

const removeReport = (reportId) => {
  return Report.findByIdAndDelete(reportId);
};

const getReportById = (reportId) => {
  return Report.findById(reportId);
};

const updateReport = (reportId, data) => {
  return Report.findByIdAndUpdate(reportId, data, { new: true });
};

const getReportWithDoctor = (docId) => {
  return Report.find({ docId }).sort({ createdAt: -1 });
};

const getReportWithDoctorAndUser = (docId, userId) => {
  return Report.find({ docId, userId }).sort({ createdAt: -1 });
};

const getCountDocumentsByUserId = (userId) => {
  return Report.countDocuments(userId);
};
export {
  createReport,
  findReportByUserId,
  getReportCountDocumentsByUserId,
  getReportCountDocuments,
  getReports,
  removeReport,
  getReportById,
  updateReport,
  getReportWithDoctor,
  getReportWithDoctorAndUser,
  getCountDocumentsByUserId,
};
