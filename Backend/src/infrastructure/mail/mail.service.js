import nodemailer from "nodemailer";
import { generateReportPDF } from "../pdf/pdf.service.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const FROM = `Avicena <${process.env.EMAIL_USER}>`;

const sendWelcomeEmail = async (toEmail, name) => {
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: "مرحباً بك في  Avicena 🎉",
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#333">
        <h2 style="color:#2c7be5">أهلاً ${name} 👋</h2>
        <p>شكراً لانضمامك إلى منصة سلامتك. نحن هنا لنوفر لك أفضل الخدمات الطبية.</p>
        <p>نتمنى لك تجربة رائعة وصحة دائمة 🌿</p>
      </div>`,
  });
};

const sendAppointmentEmail = async (toEmail, name, appointment, docData) => {
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: "تفاصيل حجزك الطبي ✔️",
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto;background:#fff;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,.1)">
        <h2 style="color:#2c7be5;text-align:center">مرحباً ${name} 👋</h2>
        <p style="text-align:center">تم حجز موعدك الطبي بنجاح ✅</p>
        <hr/>
        <p><strong>الطبيب:</strong> ${docData.doctorName}</p>
        <p><strong>التخصص:</strong> ${docData.Specialization}</p>
        <p><strong>اليوم:</strong> ${appointment.slotDate}</p>
        <p><strong>الساعة:</strong> ${appointment.slotTime}</p>
        <p><strong>العنوان:</strong> ${docData.address?.line1}</p>
        <hr/>
        <p style="text-align:center;color:#555">فريق سلامتك الطبي 🏥</p>
      </div>`,
  });
};

const sendConsultationEmail = async (
  toEmail,
  name,
  docData,
  consultDay,
  consultTime,
  notes,
) => {
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: "تفاصيل موعد استشارتك ✔️",
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto;background:#fff;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,.1)">
        <h2 style="color:#2c7be5;text-align:center">مرحباً ${name} 👋</h2>
        <p style="text-align:center">تم تحديد موعد استشارتك الطبية بنجاح ✅</p>
        <hr/>
        <p><strong>الطبيب:</strong> ${docData.name}</p>
        <p><strong>يوم الاستشارة:</strong> ${consultDay}</p>
        <p><strong>الساعة:</strong> ${consultTime || "سيتم التحديد لاحقاً"}</p>
        ${notes ? `<p><strong>ملاحظات الطبيب:</strong> ${notes}</p>` : ""}
        <hr/>
        <p style="text-align:center;color:#555">فريق سلامتك الطبي 🏥</p>
      </div>`,
  });
};

const sendReportEmail = async (toEmail, report) => {
  const pdfBuffer = await generateReportPDF(report);
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: "تقريرك الطبي - سلامتك 📋",
    text: "مرفق تقريرك الطبي بصيغة PDF.",
    attachments: [
      {
        filename: "medical-report.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};

const sendOtpEmail = async (toEmail, name, otp, purpose) => {
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: `${purpose} - OTP Code`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;margin:auto;background:#fff;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,.1)">
        <h2 style="color:#2c7be5">مرحباً ${name} 👋</h2>

        <p>لقد طلبت <strong>${purpose}</strong>.</p>

        <p>استخدم رمز التحقق التالي:</p>

        <div
          style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            text-align:center;
            margin:30px 0;
            color:#2c7be5;
          "
        >
          ${otp}
        </div>

        <p>صلاحية هذا الرمز <strong>10 دقائق</strong>.</p>

        <p>إذا لم تقم بهذا الطلب، يمكنك تجاهل هذه الرسالة.</p>

        <hr/>

        <p style="text-align:center;color:#777">
          Avicena Team
        </p>
      </div>
    `,
  });
};

const sendPharmacyCredentialsEmail = async (toEmail, ownerName, password) => {
  await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject: "Your Pharmacy Account Has Been Approved",

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">

        <h2>
          Welcome to Avicena Platform
        </h2>

        <p>
          Hello ${ownerName},
        </p>

        <p>
          Your pharmacy application has been approved successfully.
          Your pharmacy account has been created.
        </p>

        <h3>
          Login Credentials:
        </h3>

        <p>
          <strong>Email:</strong> ${toEmail}
        </p>

        <p>
          <strong>Password:</strong> ${password}
        </p>

        <p>
          You can login to your pharmacy dashboard and start managing
          your products.
        </p>

        <p>
          For security reasons, please change your password after your first login.
        </p>

        <br/>

        <p>
          Regards,<br/>
          Avicena Team
        </p>

      </div>
    `,
  });
};

export {
  sendWelcomeEmail,
  sendAppointmentEmail,
  sendConsultationEmail,
  sendReportEmail,
  sendOtpEmail,
  sendPharmacyCredentialsEmail,
};
