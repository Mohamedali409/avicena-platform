const appointmentConfirmationTemplate = (name, appointment, docData) => {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>Appointment Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="650" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:16px;overflow:hidden;
box-shadow:0 8px 25px rgba(0,0,0,.08);">

<tr>
<td style="background:linear-gradient(135deg,#0d6efd,#2bb3ff);
padding:35px;text-align:center;color:#fff;">

<h1 style="margin:0;font-size:30px;">
🏥 Salamatak
</h1>

<p style="margin-top:12px;font-size:18px;">
تأكيد حجز موعدك الطبي
</p>

</td>
</tr>

<tr>
<td style="padding:35px;">

<h2 style="margin-top:0;color:#222;">
مرحباً ${name} 👋
</h2>

<p style="font-size:16px;color:#555;line-height:1.8;">
تم تأكيد موعدك الطبي بنجاح، وفيما يلي تفاصيل الحجز.
</p>

<table width="100%" cellpadding="12"
style="margin-top:25px;background:#f8fbff;
border:1px solid #dce8f8;border-radius:12px;">

<tr>
<td><strong>👨‍⚕️ الطبيب</strong></td>
<td>${docData.doctorName}</td>
</tr>

<tr>
<td><strong>🩺 التخصص</strong></td>
<td>${docData.Specialization}</td>
</tr>

<tr>
<td><strong>📅 التاريخ</strong></td>
<td>${appointment.slotDate}</td>
</tr>

<tr>
<td><strong>⏰ الموعد</strong></td>
<td>${appointment.slotTime}</td>
</tr>

<tr>
<td><strong>📍 العنوان</strong></td>
<td>${docData.address?.line1 ?? "غير متوفر"}</td>
</tr>

</table>

<div
style="
margin-top:25px;
background:#fff8e6;
border-right:5px solid #ffc107;
padding:15px;
border-radius:8px;
color:#8a6d3b;
line-height:1.8;
">

يرجى الحضور قبل الموعد بـ <strong>15 دقيقة</strong>.

</div>

</td>
</tr>

<tr>
<td
style="
padding:25px;
background:#f8f9fa;
text-align:center;
color:#777;
font-size:14px;
">

شكراً لاختيارك <strong style="color:#0d6efd;">Salamatak</strong>

<br><br>

نتمنى لك دوام الصحة والعافية ❤️

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};

module.exports = appointmentConfirmationTemplate;
