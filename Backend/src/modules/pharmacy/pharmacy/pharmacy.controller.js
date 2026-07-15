import { successResponse } from "../../../shared/utils/ApiResponse.js";
import catchAsync from "../../../shared/utils/catchAsync.js";
import * as pharmacyService from "./pharmacy.service.js";

const getAllPharmacies = catchAsync(async (req, res) => {
  const pharmacies = await pharmacyService.getAllPharmacies();
  successResponse(res, "The Pharmacies list.", { pharmacies });
});

const getPharmacyById = catchAsync(async (req, res) => {
  const pharmacy = await pharmacyService.getPharmacyById(req.params.id);
  successResponse(res, "The Pharmacy Data", { pharmacy });
});

const getProfile = catchAsync(async (req, res) => {
  const pharmacy = await pharmacyService.getProfile(req.pharmacyId);
  successResponse(res, "The pharmacy profile.", { pharmacy });
});

const updateProfile = catchAsync(async (req, res) => {
  const pharmacy = await pharmacyService.updatePharmacyProfile(
    req.pharmacyId,
    req.body,
    req.file,
  );
  successResponse(res, "The profile update successfully.", { pharmacy });
});

export { getAllPharmacies, getPharmacyById, getProfile, updateProfile };
