import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "./modules/User/user.model.js";
import Doctor from "./modules/doctors/doctor.model.js";
import Lab from "./modules/labs/labs.model.js";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME || "avicena",
  });
  console.log("✅ MongoDB Connected");
};

const hash = (plain) => bcrypt.hash(plain, 10);

const AVATAR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAA60lEQVR4nO3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAMBuAABHgAAAABJRU5ErkJggg==";

// ── Users ──────────────────────────────────────────────────
const USERS = [
  {
    name: "Super Admin",
    email: "admin@avicena.com",
    password: "Admin@1234",
    role: "admin",
    phone: "01000000001",
    gender: "Not selected",
    address: { line1: "Nasr City", line2: "Cairo" },
  },
  {
    name: "Mohamed Ali",
    email: "mohamed@test.com",
    password: "Patient@1234",
    role: "patient",
    phone: "01012345678",
    gender: "Not selected",
    dob: "1995-06-15",
    address: { line1: "Heliopolis", line2: "Cairo" },
  },
  {
    name: "Sara Ali",
    email: "sara@test.com",
    password: "Patient@1234",
    role: "patient",
    phone: "01087654321",
    gender: "Not selected",
    dob: "1998-03-22",
    address: { line1: "Maadi", line2: "Cairo" },
  },
  {
    name: "Omar Hassan",
    email: "omar@test.com",
    password: "Patient@1234",
    role: "patient",
    phone: "01156789012",
    gender: "Not selected",
    dob: "1990-11-05",
    address: { line1: "Dokki", line2: "Giza" },
  },
];

// ── Doctors ─────────────────────────────────────────────────
// استخدام نفس الـ field names الموجودة في doctor.model.js
const DOCTORS = [
  {
    doctorName: "Dr. Khaled Ibrahim",
    email: "khaled.doc@avicena.com",
    password: "Doctor@1234",
    image: AVATAR,
    phone: "01198765432",
    Specialization: "Cardiology",
    degree: "MBBS, MD Cardiology",
    expertise: "10",
    about:
      "Specialist in cardiovascular diseases with over 10 years of experience.",
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
    image: AVATAR,
    phone: "01234567890",
    Specialization: "Dermatology",
    degree: "MBBS, Diploma Dermatology",
    expertise: "7",
    about:
      "Experienced dermatologist specializing in skin care and cosmetic procedures.",
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
    image: AVATAR,
    phone: "01567890123",
    Specialization: "Orthopedics",
    degree: "MBBS, MS Orthopedics",
    expertise: "15",
    about:
      "Senior orthopedic surgeon with expertise in joint replacement and sports injuries.",
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
    image: AVATAR,
    phone: "01698765432",
    Specialization: "Pediatrics",
    degree: "MBBS, MD Pediatrics",
    expertise: "8",
    about: "Dedicated pediatrician providing comprehensive care for children.",
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
    image: AVATAR,
    phone: "01745678901",
    Specialization: "Neurology",
    degree: "MBBS, MD Neurology, Fellowship",
    expertise: "12",
    about:
      "Neurologist specializing in headaches, epilepsy, and stroke management.",
    available: true,
    fees: 350,
    consultation_fees: 250,
    address: { line1: "Dokki", line2: "Giza" },
    date: Date.now(),
    slots_booked: {},
    start_booked: { from: 9, to: 14, booking_period: 45 },
  },
];

// ── Labs ─────────────────────────────────────────────────────
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
        name: "Kidney Function Tests",
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

// ══════════════════════════════════════════════════════════════
//  RUNNER
// ══════════════════════════════════════════════════════════════
const seed = async () => {
  try {
    await connectDB();

    console.log("\n🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Lab.deleteMany({}),
    ]);
    console.log("   Cleared: Users, Doctors, Labs");

    // ── Users ──────────────────────────────────────────────────
    console.log("\n👤 Seeding Users...");
    for (const u of USERS) {
      await User.create({ ...u, password: await hash(u.password) });
      const icon = u.role === "admin" ? "🛡️" : "🙍";
      console.log(
        `   ${icon}  ${u.role.toUpperCase().padEnd(8)} — ${u.name} (${u.email})`,
      );
    }

    // ── Doctors ────────────────────────────────────────────────
    console.log("\n👨‍⚕️ Seeding Doctors...");
    for (const d of DOCTORS) {
      await Doctor.create({ ...d, password: await hash(d.password) });
      console.log(
        `   🩺 ${d.doctorName.padEnd(22)} — ${d.Specialization} (${d.email})`,
      );
    }

    // ── Labs ───────────────────────────────────────────────────
    console.log("\n🏥 Seeding Labs...");
    for (const l of LABS) {
      await Lab.create({ ...l, password: await hash(l.password) });
      console.log(`   🔬 ${l.name.padEnd(25)} (${l.email})`);
    }

    // ── Summary ────────────────────────────────────────────────
    console.log("\n════════════════════════════════════════════");
    console.log("✅ Seed completed!\n");
    console.log("📋 Login Credentials:");
    console.log("────────────────────────────────────────────");

    console.log("🛡️  ADMIN");
    console.log("   Email    : admin@avicena.com");
    console.log("   Password : Admin@1234");

    console.log("\n🙍 PATIENTS  (password: Patient@1234)");
    console.log("   mohamed@test.com");
    console.log("   sara@test.com");
    console.log("   omar@test.com");

    console.log("\n🩺 DOCTORS  (password: Doctor@1234)");
    DOCTORS.forEach((d) =>
      console.log(`   ${d.email.padEnd(32)} — ${d.Specialization}`),
    );

    console.log("\n🔬 LABS  (password: Lab@1234)");
    LABS.forEach((l) => console.log(`   ${l.email}`));

    console.log("════════════════════════════════════════════\n");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    if (err.errors) {
      Object.entries(err.errors).forEach(([field, e]) =>
        console.error(`   Field "${field}": ${e.message}`),
      );
    }
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
    process.exit(0);
  }
};

seed();
