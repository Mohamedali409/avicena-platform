import Report from "./report.model.js";

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

export {
  findReportByUserId,
  getReportCountDocumentsByUserId,
  getReportCountDocuments,
  getReports,
  removeReport,
  getReportById,
  updateReport,
};
