const otpTitles = {
  VERIFY_EMAIL: "Verify your email",
  RESET_PASSWORD: "Reset your password",
};

const otpMessages = {
  VERIFY_EMAIL:
    "Thank you for joining Avicena. Use the verification code below to activate your account.",

  RESET_PASSWORD:
    "We received a request to reset your password. Use the verification code below to continue.",
};

export const buildOtpTemplate = ({ name, otp, purpose }) => {
  const title = otpTitles[purpose] || "Verification Code";

  const message =
    otpMessages[purpose] ||
    "Use the verification code below to complete your request.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>${title}</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#f4f7fb;
    font-family:Arial,Helvetica,sans-serif;
    color:#374151;
    padding:40px 15px;
}

.wrapper{
    max-width:600px;
    margin:auto;
}

.card{
    background:#ffffff;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 10px 30px rgba(0,0,0,.08);
}

.header{
    background:#2c7be5;
    padding:35px;
    text-align:center;
}

.logo{
    color:#fff;
    font-size:32px;
    font-weight:bold;
    letter-spacing:1px;
}

.subtitle{
    color:#dbeafe;
    margin-top:8px;
    font-size:15px;
}

.content{
    padding:40px;
}

h2{
    margin-bottom:20px;
    color:#111827;
}

p{
    line-height:1.7;
    margin-bottom:18px;
    color:#4b5563;
}

.otp-box{
    margin:35px 0;
    background:#f8fbff;
    border:2px dashed #2c7be5;
    border-radius:14px;
    text-align:center;
    padding:25px;
}

.otp-title{
    font-size:14px;
    color:#6b7280;
    margin-bottom:10px;
}

.otp{
    font-size:42px;
    font-weight:bold;
    color:#2c7be5;
    letter-spacing:12px;
}

.expire{
    text-align:center;
    font-size:14px;
    color:#6b7280;
    margin-top:-10px;
    margin-bottom:30px;
}

.notice{
    background:#fff8e6;
    border-left:5px solid #f59e0b;
    padding:18px;
    border-radius:10px;
}

.notice h3{
    margin-bottom:10px;
    color:#92400e;
    font-size:16px;
}

.notice ul{
    padding-left:18px;
    color:#6b7280;
}

.notice li{
    margin:8px 0;
}

.footer{
    padding:25px;
    text-align:center;
    background:#f9fafb;
    color:#9ca3af;
    font-size:13px;
    border-top:1px solid #eee;
}

.footer strong{
    color:#2c7be5;
}
</style>
</head>

<body>

<div class="wrapper">

<div class="card">

<div class="header">

<div class="logo">
🩺 Avicena
</div>

<div class="subtitle">
Smart Healthcare Platform
</div>

</div>

<div class="content">

<h2>${title}</h2>

<p>Hello <strong>${name}</strong>,</p>

<p>${message}</p>

<div class="otp-box">

<div class="otp-title">
Your Verification Code
</div>

<div class="otp">
${otp}
</div>

</div>

<div class="expire">
This code is valid for <strong>10 minutes</strong>.
</div>

<div class="notice">

<h3>Security Tips</h3>

<ul>
<li>Never share this code with anyone.</li>
<li>Avicena will never ask for your OTP.</li>
<li>If you didn't request this email, you can safely ignore it.</li>
</ul>

</div>

<p style="margin-top:35px;">
Thank you for choosing <strong>Avicena</strong>.
</p>

</div>

<div class="footer">

<strong>Avicena</strong><br>

Smart Healthcare Platform<br><br>

© ${new Date().getFullYear()} Avicena. All rights reserved.

</div>

</div>

</div>

</body>
</html>
`;
};
