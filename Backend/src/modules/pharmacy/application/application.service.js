import ApiError from "../../../shared/utils/ApiError.js";
import { APPLICATION_STATUS } from "./application.constants.js";
import * as pharmacyApplicationRepository from "./application.repository.js";
import validator from "validator";
import * as pharmacyRepository from "../pharmacy/pharmacy.repository.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendPharmacyCredentialsEmail } from "../../../infrastructure/mail/mail.service.js";

const generatePassword = () => {
  return crypto.randomBytes(6).toString("hex");
};

const submitApplication = async (data) => {
  const {
    pharmacyName,
    ownerName,
    email,
    phone,
    address,
    licenseNumber,
    description,
    documents,
  } = data;

  // Required fields
  if (
    !pharmacyName ||
    !ownerName ||
    !email ||
    !phone ||
    !address ||
    !licenseNumber
  ) {
    throw new ApiError("All required fields must be provided", 400);
  }

  // Email validation
  if (!validator.isEmail(email)) {
    throw new ApiError("Invalid email address", 400);
  }

  const existingEmail =
    await pharmacyApplicationRepository.findApplicationByEmail(email);

  if (existingEmail) {
    throw new ApiError("An application with this email already exists", 409);
  }

  // Check license
  const existingLicense =
    await pharmacyApplicationRepository.findApplicationByLicense(licenseNumber);

  if (existingLicense) {
    throw new ApiError("This license number has already been used", 409);
  }

  // Create application
  const application = await pharmacyApplicationRepository.createApplication({
    pharmacyName,
    ownerName,
    email,
    phone,
    address,
    licenseNumber,
    description,
    documents,
  });

  return application;
};

// Get all application
const getAllApplication = async () => {
  return pharmacyApplicationRepository.getAllApplications();
};

// Get application by id
const getApplicationById = async (id) => {
  const application =
    await pharmacyApplicationRepository.findApplicationById(id);

  if (!application) throw new ApiError("Application not found.", 404);

  return application;
};

// Approve application
const approveApplication = async (applicationId, adminId) => {
  const application =
    await pharmacyApplicationRepository.findApplicationById(applicationId);

  if (!application) {
    throw new ApiError("Application not found", 404);
  }

  if (application.status !== "pending") {
    throw new ApiError(`Application already ${application.status}`, 400);
  }

  // Generate password
  const generatedPassword = generatePassword();

  // Hash password
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  // Create Pharmacy Account

  const pharmacy = await pharmacyRepository.createPharmacy({
    pharmacyName: application.pharmacyName,

    ownerName: application.ownerName,

    email: application.email,

    password: hashedPassword,

    phone: application.phone,

    address: application.address,

    licenseNumber: application.licenseNumber,

    description: application.description,
  });

  // Update Application

  application.status = "approved";
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();

  await application.save();

  pharmacy.password = undefined;
  await sendPharmacyCredentialsEmail(
    pharmacy.email,
    pharmacy.ownerName,
    generatedPassword,
  );
  return {
    application,
    pharmacy: {
      _id: pharmacy._id,
      pharmacyName: pharmacy.pharmacyName,
      email: pharmacy.email,
      phone: pharmacy.phone,
    },
  };
};

// Reject application
const rejectApplication = async (id, adminId, rejectReason) => {
  const application =
    await pharmacyApplicationRepository.findApplicationById(id);

  if (!application) {
    throw new ApiError("Application not found", 404);
  }

  if (application.status !== APPLICATION_STATUS.PENDING) {
    throw new ApiError("Application has already been reviewed", 400);
  }

  return pharmacyApplicationRepository.updateApplication(id, {
    status: APPLICATION_STATUS.REJECTED,
    reviewedBy: adminId,
    reviewedAt: new Date(),
    rejectReason,
  });
};

// Delete application
const deleteApplication = async (id) => {
  const application =
    await pharmacyApplicationRepository.findApplicationById(id);

  if (!application) {
    throw new ApiError("Application not found", 404);
  }

  await pharmacyApplicationRepository.deleteApplication(id);

  return {
    message: "Application deleted successfully",
  };
};

// Dashboard statistics
const getApplicationStatistics = async () => {
  const total = await pharmacyApplicationRepository.countApplications();

  const pending = (
    await pharmacyApplicationRepository.getApplicationByStatus(
      APPLICATION_STATUS.PENDING,
    )
  ).length;

  const approved = (
    await pharmacyApplicationRepository.getApplicationByStatus(
      APPLICATION_STATUS.APPROVED,
    )
  ).length;

  const rejected = (
    await pharmacyApplicationRepository.getApplicationByStatus(
      APPLICATION_STATUS.REJECTED,
    )
  ).length;

  return {
    total,
    pending,
    approved,
    rejected,
  };
};
export {
  submitApplication,
  getAllApplication,
  getApplicationById,
  approveApplication,
  rejectApplication,
  deleteApplication,
  getApplicationStatistics,
};
