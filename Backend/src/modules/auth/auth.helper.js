import { modelMap } from "./auth.map.js";
import * as authRepository from "./auth.repository.js";
import * as doctorRepository from "../doctors/doctor.repository.js";
import * as labRepository from "../labs/labs.repository.js";
import * as pharmacyRepository from "../pharmacy/pharmacy/pharmacy.repository.js";

export const findAccountByEmail = async (email) => {
  // Users (Patient/Admin)
  const user = await authRepository.findUserByEmail(email);

  if (user) {
    const role = user.role || "patient";

    return {
      role,
      repo: modelMap[role],
      user,
    };
  }

  // Doctor
  const doctor = await doctorRepository.findDoctorByEmail(email);
  if (doctor) {
    return {
      role: "doctor",
      repo: modelMap.doctor,
      user: doctor,
    };
  }

  // Lab
  const lab = await labRepository.findLabByEmail(email);
  if (lab) {
    return {
      role: "lab",
      repo: modelMap.lab,
      user: lab,
    };
  }

  // Pharmacy
  const pharmacy = await pharmacyRepository.findPharmacyByEmail(email);
  if (pharmacy) {
    return {
      role: "pharmacy",
      repo: modelMap.pharmacy,
      user: pharmacy,
    };
  }

  return null;
};
