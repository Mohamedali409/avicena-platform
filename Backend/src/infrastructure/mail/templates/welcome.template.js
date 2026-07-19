export const buildWelcomeTemplate = ({ name }) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width,initial-scale=1.0">

<title>Welcome to Avicena</title>

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
background:#f4f7fb;
font-family:Arial,Helvetica,sans-serif;
padding:40px 15px;
color:#374151;
}

.container{
max-width:650px;
margin:auto;
}

.card{
background:#fff;
border-radius:20px;
overflow:hidden;
box-shadow:0 10px 35px rgba(0,0,0,.08);
}

.hero{
background:linear-gradient(135deg,#2563eb,#1d4ed8);
padding:50px 40px;
text-align:center;
color:white;
}

.logo{
font-size:38px;
font-weight:bold;
margin-bottom:10px;
}

.hero h1{
font-size:30px;
margin-bottom:15px;
}

.hero p{
font-size:16px;
opacity:.95;
line-height:1.7;
}

.content{
padding:40px;
}

.content h2{
margin-bottom:20px;
color:#111827;
}

.content p{
line-height:1.8;
margin-bottom:18px;
color:#4b5563;
}

.features{
display:grid;
grid-template-columns:repeat(2,1fr);
gap:15px;
margin:35px 0;
}

.feature{
background:#f8fbff;
border:1px solid #e5e7eb;
border-radius:14px;
padding:18px;
}

.feature h3{
margin-bottom:10px;
font-size:16px;
color:#2563eb;
}

.feature p{
font-size:14px;
margin:0;
}

.button{
display:inline-block;
margin-top:25px;
padding:15px 35px;
background:#2563eb;
color:white !important;
text-decoration:none;
border-radius:12px;
font-weight:bold;
}

.footer{
padding:30px;
background:#f9fafb;
text-align:center;
font-size:13px;
color:#9ca3af;
border-top:1px solid #eee;
}

.footer strong{
color:#2563eb;
}

@media(max-width:600px){

.features{
grid-template-columns:1fr;
}

.hero{
padding:40px 25px;
}

.content{
padding:25px;
}

}

</style>

</head>

<body>

<div class="container">

<div class="card">

<div class="hero">

<div class="logo">
🩺 Avicena
</div>

<h1>
Welcome to Avicena
</h1>

<p>
Your trusted digital healthcare platform.
Healthcare made simpler, smarter, and always within reach.
</p>

</div>

<div class="content">

<h2>
Hello ${name},
</h2>

<p>
Thank you for joining <strong>Avicena</strong>.
We're excited to have you as part of our healthcare community.
</p>

<p>
Our mission is to make healthcare easier by connecting patients with doctors, laboratories, pharmacies, and intelligent medical services—all in one secure platform.
</p>

<div class="features">

<div class="feature">
<h3>👨‍⚕️ Book Doctors</h3>
<p>
Schedule appointments with qualified doctors in just a few clicks.
</p>
</div>

<div class="feature">
<h3>📄 Medical Reports</h3>
<p>
Access and manage your medical records securely anytime.
</p>
</div>

<div class="feature">
<h3>💊 Pharmacy Services</h3>
<p>
Browse medications and manage prescriptions online.
</p>
</div>

<div class="feature">
<h3>🤖 AI Medical Assistant</h3>
<p>
Receive intelligent healthcare assistance whenever you need it.
</p>
</div>

</div>

<p>
Your account is now ready to use.
We look forward to helping you manage your healthcare journey.
</p>

<a
class="button"
href="https://avicena.com"
>
Explore Avicena
</a>

</div>

<div class="footer">

<strong>Avicena</strong><br>

Smart Healthcare Platform

<br><br>

© ${new Date().getFullYear()} Avicena. All rights reserved.

</div>

</div>

</div>

</body>

</html>
`;
};
