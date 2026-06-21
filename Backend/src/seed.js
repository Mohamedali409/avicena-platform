import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── Models ─────────────────────────────────────────────────────────────────
import User from "./modules/User/user.model.js";
import Doctor from "./modules/doctors/doctor.model.js";
import Lab from "./modules/labs/labs.model.js";

// ── DB Connect ─────────────────────────────────────────────────────────────
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME || "avicena",
  });
  console.log("✅ MongoDB Connected");
};

const hash = (plain) => bcrypt.hash(plain, 10);

// ── Placeholder image (small gray avatar base64) ───────────────────────────
const AVATAR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAA60lEQVR4nO3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAMBuAABHgAAAABJRU5ErkJggg==";

// ══════════════════════════════════════════════════════════════════════════════
//  SEED DATA
// ══════════════════════════════════════════════════════════════════════════════

const USERS = [
  // ── Admin ──────────────────────────────────────────────────────────────────
  {
    name: "Super Admin",
    email: "admin@avicena.com",
    password: "Admin@1234",
    role: "admin",
    phone: "01000000001",
    gender: "Male",
    address: { line1: "Nasr City", line2: "Cairo" },
  },

  // ── Patients ───────────────────────────────────────────────────────────────
  {
    name: "Mohamed ALi",
    email: "mohamed@test.com",
    password: "Patient@1234",
    role: "patient",
    phone: "01012345678",
    gender: "Male",
    dob: "1995-06-15",
    address: { line1: "Heliopolis", line2: "Cairo" },
  },
  {
    name: "Sara Ali",
    email: "sara@test.com",
    password: "Patient@1234",
    role: "patient",
    phone: "01087654321",
    gender: "Female",
    dob: "1998-03-22",
    address: { line1: "Maadi", line2: "Cairo" },
  },
  {
    name: "Omar Hassan",
    email: "omar@test.com",
    password: "Patient@1234",
    role: "patient",
    phone: "01156789012",
    gender: "Male",
    dob: "1990-11-05",
    address: { line1: "Dokki", line2: "Giza" },
  },
];

const DOCTORS = [
  {
    doctorName: "Dr. Khaled Ibrahim",
    email: "khaled.doc@avicena.com",
    password: "Doctor@1234",
    confirmPassword: "Doctor@1234",
    image: AVATAR,
    phone: "01198765432",
    Specialization: "Cardiology",
    degree: "MBBS, MD Cardiology",
    expertise: "10",
    about:
      "Specialist in cardiovascular diseases with over 10 years of experience in diagnosing and treating heart conditions.",
    available: true,
    fees: 250,
    consultation_fees: 180,
    address: { line1: "Nasr City", line2: "Cairo" },
    date: Date.now(),
    slots_booked: {},
    start_booked: { from: 9, to: 17, booking_period: 30 },
  },
  {
    doctorName: "Dr. Mona Youssef",
    email: "mona.doc@avicena.com",
    password: "Doctor@1234",
    confirmPassword: "Doctor@1234",
    image: AVATAR,
    phone: "01234567890",
    Specialization: "Dermatology",
    degree: "MBBS, Diploma Dermatology",
    expertise: "7",
    about:
      "Experienced dermatologist specializing in skin care, acne treatment, and cosmetic procedures.",
    available: true,
    fees: 200,
    consultation_fees: 150,
    address: { line1: "Zamalek", line2: "Cairo" },
    date: Date.now(),
    slots_booked: {},
    start_booked: { from: 10, to: 16, booking_period: 20 },
  },
  {
    doctorName: "Dr. Tarek Saad",
    email: "tarek.doc@avicena.com",
    password: "Doctor@1234",
    confirmPassword: "Doctor@1234",
    image: AVATAR,
    phone: "01567890123",
    Specialization: "Orthopedics",
    degree: "MBBS, MS Orthopedics",
    expertise: "15",
    about:
      "Senior orthopedic surgeon with expertise in joint replacement, sports injuries, and spinal surgery.",
    available: true,
    fees: 300,
    consultation_fees: 220,
    address: { line1: "Heliopolis", line2: "Cairo" },
    date: Date.now(),
    slots_booked: {},
    start_booked: { from: 9, to: 15, booking_period: 30 },
  },
  {
    doctorName: "Dr. Dina Farouk",
    email: "dina.doc@avicena.com",
    password: "Doctor@1234",
    confirmPassword: "Doctor@1234",
    image: AVATAR,
    phone: "01698765432",
    Specialization: "Pediatrics",
    degree: "MBBS, MD Pediatrics",
    expertise: "8",
    about:
      "Dedicated pediatrician providing comprehensive care for children from newborns to teenagers.",
    available: false,
    fees: 180,
    consultation_fees: 130,
    address: { line1: "Maadi", line2: "Cairo" },
    date: Date.now(),
    slots_booked: {},
    start_booked: { from: 11, to: 18, booking_period: 15 },
  },
  {
    doctorName: "Dr. Amr Mostafa",
    email: "amr.doc@avicena.com",
    password: "Doctor@1234",
    confirmPassword: "Doctor@1234",
    image: AVATAR,
    phone: "01745678901",
    Specialization: "Neurology",
    degree: "MBBS, MD Neurology, Fellowship",
    expertise: "12",
    about:
      "Neurologist specializing in headaches, epilepsy, stroke management, and neurodegenerative disorders.",
    available: true,
    fees: 350,
    consultation_fees: 250,
    address: { line1: "Dokki", line2: "Giza" },
    date: Date.now(),
    slots_booked: {},
    start_booked: { from: 9, to: 14, booking_period: 45 },
  },
];

const LABS = [
  {
    name: "Cairo Central Lab",
    email: "cairo.lab@avicena.com",
    password: "Lab@1234",
    image: AVATAR,
    phone: "0225012345",
    address: { line1: "Nasr City", line2: "Cairo", city: "Cairo" },
    certifications: ["ISO 15189", "CAP Accredited"],
    tests: [
      {
        name: "Complete Blood Count (CBC)",
        price: 80,
        duration: "2 hours",
        description: "Full blood panel analysis",
      },
      {
        name: "Blood Sugar (Fasting)",
        price: 40,
        duration: "1 hour",
        description: "Fasting glucose test",
      },
      {
        name: "Lipid Profile",
        price: 120,
        duration: "3 hours",
        description: "Cholesterol and triglycerides",
      },
      {
        name: "Thyroid Function (TSH)",
        price: 150,
        duration: "4 hours",
        description: "TSH, T3, T4 levels",
      },
      {
        name: "HbA1c",
        price: 100,
        duration: "2 hours",
        description: "3-month blood sugar average",
      },
    ],
    workingHours: { from: "07:00", to: "22:00" },
    isVerified: true,
    isActive: true,
  },
  {
    name: "Nile Diagnostics Center",
    email: "nile.lab@avicena.com",
    password: "Lab@1234",
    image: AVATAR,
    phone: "0223456789",
    address: { line1: "Zamalek", line2: "Cairo", city: "Cairo" },
    certifications: ["ISO 15189"],
    tests: [
      {
        name: "COVID-19 PCR",
        price: 200,
        duration: "24 hours",
        description: "RT-PCR for SARS-CoV-2",
      },
      {
        name: "Urine Analysis",
        price: 50,
        duration: "1 hour",
        description: "Complete urinalysis",
      },
      {
        name: "Liver Function Tests (LFT)",
        price: 130,
        duration: "3 hours",
        description: "ALT, AST, bilirubin panel",
      },
      {
        name: "Kidney Function Tests (KFT)",
        price: 130,
        duration: "3 hours",
        description: "Creatinine, urea, uric acid",
      },
      {
        name: "Vitamin D",
        price: 180,
        duration: "6 hours",
        description: "25-OH Vitamin D levels",
      },
    ],
    workingHours: { from: "08:00", to: "20:00" },
    isVerified: true,
    isActive: true,
  },
  {
    name: "Giza Medical Lab",
    email: "giza.lab@avicena.com",
    password: "Lab@1234",
    image: AVATAR,
    phone: "0238765432",
    address: { line1: "Mohandessin", line2: "Giza", city: "Giza" },
    certifications: ["EGAC Accredited"],
    tests: [
      {
        name: "Iron Profile",
        price: 90,
        duration: "2 hours",
        description: "Serum iron, ferritin, TIBC",
      },
      {
        name: "Culture & Sensitivity",
        price: 160,
        duration: "48 hours",
        description: "Bacterial culture with antibiogram",
      },
      {
        name: "Hormones Panel",
        price: 250,
        duration: "6 hours",
        description: "FSH, LH, estradiol, testosterone",
      },
      {
        name: "Stool Analysis",
        price: 40,
        duration: "1 hour",
        description: "Complete stool examination",
      },
    ],
    workingHours: { from: "08:00", to: "21:00" },
    isVerified: false,
    isActive: true,
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SEED RUNNER
// ══════════════════════════════════════════════════════════════════════════════

const seed = async () => {
  try {
    await connectDB();

    // ── Wipe existing data ──────────────────────────────────────────────────
    console.log("\n🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Lab.deleteMany({}),
    ]);
    console.log("   Users, Doctors, Labs cleared");

    // ── Seed Users (Admin + Patients) ───────────────────────────────────────
    console.log("\n👤 Seeding Users...");
    for (const userData of USERS) {
      const hashed = await hash(userData.password);
      await User.create({ ...userData, password: hashed });
      const icon = userData.role === "admin" ? "🛡️ " : "🙍 ";
      console.log(
        `   ${icon} ${userData.role.toUpperCase()} — ${userData.name} (${userData.email})`,
      );
    }

    // ── Seed Doctors ────────────────────────────────────────────────────────
    console.log("\n👨‍⚕️ Seeding Doctors...");
    for (const docData of DOCTORS) {
      const hashed = await hash(docData.password);
      await Doctor.create({
        ...docData,
        password: hashed,
        confirmPassword: hashed, // bypass pre-save validator
      });
      console.log(
        `   🩺 ${docData.doctorName} — ${docData.Specialization} (${docData.email})`,
      );
    }

    // ── Seed Labs ────────────────────────────────────────────────────────────
    console.log("\n🏥 Seeding Labs...");
    for (const labData of LABS) {
      const hashed = await hash(labData.password);
      await Lab.create({ ...labData, password: hashed });
      console.log(`   🔬 ${labData.name} (${labData.email})`);
    }

    // ── Summary ──────────────────────────────────────────────────────────────
    console.log("\n════════════════════════════════════════");
    console.log("✅ Seed completed successfully!\n");

    console.log("📋 Login Credentials:");
    console.log("────────────────────────────────────────");
    console.log("🛡️  ADMIN");
    console.log("   Email    : admin@avicena.com");
    console.log("   Password : Admin@1234");

    console.log("\n🙍 PATIENTS");
    console.log("   Email    : ahmed@test.com  | Password: Patient@1234");
    console.log("   Email    : sara@test.com   | Password: Patient@1234");
    console.log("   Email    : omar@test.com   | Password: Patient@1234");

    console.log("\n🩺 DOCTORS  (all password: Doctor@1234)");
    DOCTORS.forEach((d) =>
      console.log(`   ${d.email.padEnd(30)} — ${d.Specialization}`),
    );

    console.log("\n🔬 LABS  (all password: Lab@1234)");
    LABS.forEach((l) => console.log(`   ${l.email}`));

    console.log("════════════════════════════════════════\n");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
    process.exit(0);
  }
};

seed();
