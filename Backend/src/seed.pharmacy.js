import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Pharmacy from "./modules/pharmacy/pharmacy/pharmacy.model.js";
import Product from "./modules/pharmacy/products/product.model.js";
import Inventory from "./modules/pharmacy/inventory/inventory.model.js";
import Coupon from "./modules/pharmacy/coupon/coupon.model.js";
import Order from "./modules/pharmacy/order/order.model.js";
import User from "./modules/User/user.model.js";

// Pharmacy-domain seed. Does NOT touch users / doctors / labs — it only clears
// and reseeds pharmacy collections, and builds a sample order on top of an
// EXISTING patient (mohamed@test.com) from the main seed if present.
//   run:  node src/seed.pharmacy.js

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME || "avicena",
  });
  console.log("✅ MongoDB Connected");
};

const hash = (plain) => bcrypt.hash(plain, 10);

// ── Pharmacy account ───────────────────────────────────────
const PHARMACY = {
  pharmacyName: "صيدلية النور",
  ownerName: "أحمد النور",
  email: "noor.pharmacy@avicena.com",
  password: "Pharmacy@1234",
  phone: "01099887766",
  address: { line1: "شارع التحرير", line2: "الدقي", city: "الجيزة" },
  licenseNumber: "PH-NOOR-0001",
  description: "صيدلية النور — خدمة 24 ساعة وتوصيل سريع.",
  isVerified: true,
  isActive: true,
  location: { type: "Point", coordinates: [31.212, 30.038] },
  workingHours: { from: "09:00", to: "23:59" },
  delivery: { available: true, fee: 15, radiusKm: 12, minOrder: 50, etaMinutes: 45 },
  pickup: { available: true },
};

// ── Global product catalog ─────────────────────────────────
// stocked=true → also added to the pharmacy inventory with a price/stock.
const PRODUCTS = [
  { barcode: "6221001000017", name: "بانادول إكسترا", activeIngredient: "باراسيتامول", category: "مسكنات", strength: "500مج", manufacturer: "GSK", price: 25, stock: 120, stocked: true },
  { barcode: "6221001000024", name: "بروفين", activeIngredient: "إيبوبروفين", category: "مسكنات", strength: "400مج", manufacturer: "Abbott", price: 30, stock: 80, stocked: true },
  { barcode: "6221001000031", name: "أوميز", activeIngredient: "أوميبرازول", category: "جهاز هضمي", strength: "20مج", manufacturer: "Dr. Reddy's", price: 45, stock: 60, stocked: true },
  { barcode: "6221001000048", name: "زيرتك", activeIngredient: "سيتيريزين", category: "حساسية", strength: "10مج", manufacturer: "UCB", price: 35, stock: 90, stocked: true },
  { barcode: "6221001000055", name: "فيتامين سي 1000", activeIngredient: "حمض الأسكوربيك", category: "فيتامينات", strength: "1000مج", manufacturer: "Eva Pharma", price: 40, stock: 150, stocked: true },
  { barcode: "6221001000062", name: "أموكسيل", activeIngredient: "أموكسيسيلين", category: "مضادات حيوية", strength: "500مج", manufacturer: "GSK", price: 55, stock: 40, requiresPrescription: true, stocked: true },
  // NOT stocked at this pharmacy (for testing "غير متوفر / بديل"):
  { barcode: "6221001000079", name: "زيثروماكس", activeIngredient: "أزيثرومايسين", category: "مضادات حيوية", strength: "500مج", manufacturer: "Pfizer", price: 90, requiresPrescription: true, stocked: false },
  { barcode: "6221001000086", name: "جلوكوفاج", activeIngredient: "ميتفورمين", category: "السكر", strength: "850مج", manufacturer: "Merck", price: 30, requiresPrescription: true, stocked: false },
];

const seed = async () => {
  try {
    await connectDB();

    console.log("\n🗑️  Clearing pharmacy collections (users untouched)...");
    await Promise.all([
      Pharmacy.deleteMany({}),
      Product.deleteMany({}),
      Inventory.deleteMany({}),
      Coupon.deleteMany({}),
      Order.deleteMany({}),
    ]);

    // ── Pharmacy ───────────────────────────────────────────
    const pharmacy = await Pharmacy.create({
      ...PHARMACY,
      password: await hash(PHARMACY.password),
    });
    console.log(`\n💊 Pharmacy: ${pharmacy.pharmacyName} (${pharmacy.email})`);

    // ── Products + inventory ───────────────────────────────
    let stockedCount = 0;
    const stockedItems = [];
    for (const p of PRODUCTS) {
      const product = await Product.create({
        barcode: p.barcode,
        name: p.name,
        activeIngredient: p.activeIngredient,
        category: p.category,
        strength: p.strength,
        manufacturer: p.manufacturer,
        referencePrice: p.price,
        requiresPrescription: !!p.requiresPrescription,
        isActive: true,
      });
      if (p.stocked) {
        const inv = await Inventory.create({
          pharmacyId: pharmacy._id,
          productId: product._id,
          price: p.price,
          stock: p.stock,
          isAvailable: true,
        });
        stockedItems.push({ product, inv, price: p.price });
        stockedCount++;
      }
    }
    console.log(
      `   ${PRODUCTS.length} products created · ${stockedCount} in inventory`,
    );

    // ── Coupon ─────────────────────────────────────────────
    const validTo = new Date();
    validTo.setMonth(validTo.getMonth() + 3);
    await Coupon.create({
      pharmacyId: pharmacy._id,
      code: "NOOR10",
      type: "percentage",
      value: 10,
      scope: "all",
      minOrder: 50,
      maxDiscount: 50,
      validTo,
      maxUses: 100,
      maxUsesPerUser: 3,
      isActive: true,
    });
    console.log("   Coupon: NOOR10 (10% off, min 50)");

    // ── Sample order (depends on an existing seeded patient) ─
    const patient = await User.findOne({
      email: "mohamed@test.com",
      role: "patient",
    });
    if (patient && stockedItems.length >= 2) {
      const items = stockedItems.slice(0, 2).map(({ product, price }) => ({
        productId: product._id,
        name: product.name,
        price,
        qty: 2,
        lineTotal: price * 2,
      }));
      const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
      const deliveryFee = PHARMACY.delivery.fee;
      await Order.create({
        userId: patient._id,
        pharmacyId: pharmacy._id,
        items,
        subtotal,
        discount: 0,
        deliveryFee,
        total: subtotal + deliveryFee,
        fulfillment: {
          method: "delivery",
          address: { line1: "مصر الجديدة", city: "القاهرة", phone: "01012345678" },
        },
        payment: { method: "cod", status: "pending" },
        status: "pending",
        statusHistory: [{ status: "pending", at: new Date() }],
      });
      console.log(`   Sample order created for ${patient.email}`);
    } else {
      console.log(
        "   (skipped sample order — run the main seed first for mohamed@test.com)",
      );
    }

    console.log("\n════════════════════════════════════════════");
    console.log("✅ Pharmacy seed completed!\n");
    console.log("💊 PHARMACY LOGIN");
    console.log("   Email    : noor.pharmacy@avicena.com");
    console.log("   Password : Pharmacy@1234");
    console.log("   → يسجّل دخول من /login العادي (unified) ويروح /pharmacy/dashboard");
    console.log("════════════════════════════════════════════\n");
  } catch (err) {
    console.error("❌ Pharmacy seed failed:", err.message);
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
