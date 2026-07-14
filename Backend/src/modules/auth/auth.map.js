import * as authRepository from "./auth.repository.js";
import * as doctorRepository from "../doctors/doctor.repository.js";
import * as labRepository from "../labs/labs.repository.js";
import * as pharmacyRepository from "../pharmacy/pharmacy/pharmacy.repository.js";

export const modelMap = {
  patient: {
    findByEmail: authRepository.findUserByEmail,
    findById: authRepository.findUserById,
    update: authRepository.updateUser,
    nameField: "name",
    role: "patient",
  },

  admin: {
    findByEmail: authRepository.findUserByEmail,
    findById: authRepository.findUserById,
    update: authRepository.updateUser,
    nameField: "name",
    role: "admin",
  },

  doctor: {
    findByEmail: doctorRepository.findDoctorByEmail,
    findById: doctorRepository.findDoctorById,
    update: doctorRepository.updateDoctor,
    nameField: "doctorName",
    role: "doctor",
  },

  lab: {
    findByEmail: labRepository.findLabByEmail,
    findById: labRepository.findLabById,
    update: labRepository.updateLab,
    nameField: "name",
    role: "lab",
  },

  pharmacy: {
    findByEmail: pharmacyRepository.findPharmacyByEmail,
    findById: pharmacyRepository.findPharmacyById,
    update: pharmacyRepository.updatePharmacy,
    nameField: "pharmacyName",
    role: "pharmacy",
  },
};

const findAccountByEmail = async (email) => {
  const repos = [
    { role: "patient", ...modelMap.patient },
    { role: "doctor", ...modelMap.doctor },
    { role: "lab", ...modelMap.lab },
    { role: "pharmacy", ...modelMap.pharmacy },
  ];

  for (const repo of repos) {
    const user = await repo.findByEmail(email);

    if (user) {
      return {
        role: repo.role,
        repo,
        user,
      };
    }
  }

  return null;
};
