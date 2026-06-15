import ApiError from "../../shared/utils/ApiError.js";
import * as consultationRepository from "./consultation.repository.js";

const getConsultationById = async (consultationId) => {
  const consultation = await consultationRepository.findById(consultationId);

  if (!consultation) throw new ApiError("Consultation not found", 404);

  return consultation;
};

export { getConsultationById };
