// auth.service.js
const modelMap = {
  patient: UserModel,
  admin: UserModel,
  doctor: DoctorModel,
  lab: LabModel,
};

async function login(email, password, role) {
  const Model = modelMap[role];
  const user = await Model.findOne({ email });
  // باقي الـ logic...
}
