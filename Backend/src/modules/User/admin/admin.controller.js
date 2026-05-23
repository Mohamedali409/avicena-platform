import User from "../user.model.js";
import Doctor from "../../doctors/doctor.model.js";

const createDoctor = (doctorData) => {
  return Doctor.create(doctorData);
};

// get all appointment 

export {};
