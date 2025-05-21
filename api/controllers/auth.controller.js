import Employee from '../models/employee.model.js';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import { createTeamsMeeting } from "../utils/teamsMeeting.js";  // ✅ Import the function
import sendEmailNotification from "../utils/sendEmailNotification.js";
import Session from "../models/Session.model.js";

//new comment
dotenv.config();

// Configure Nodemailer with SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Signup Route (Send OTP via Email)
export const signup = async (req, res) => {
  try {
    console.log("Received Signup Request:", req.body);

    const { username, email, phoneNumber, role, employeeId, department } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const emailDomain = email.substring(email.lastIndexOf("@") + 1);
    const allowedDomains = process.env.ALLOWED_COMPANY_DOMAINS?.split(",") || [];
    if (!allowedDomains.includes(emailDomain)) {
      return res.status(400).json({ message: "Only company emails are allowed!" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists!" });
    }

    // Email configuration check
    if (!process.env.COMPANY_EMAIL || !process.env.COMPANY_EMAIL_PASSWORD) {
      console.error("Missing email configuration");
      return res.status(500).json({ message: "Server email configuration error" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newEmployee = new Employee({
      username,
      email,
      phoneNumber,
      role: role || "employee",
      employeeId,
      department,
      otp,
      otpExpires,
      verified: false,
    });

    await newEmployee.save();

    try {
      const mailOptions = {
        from: `"EKAANT TEAM" <${process.env.COMPANY_EMAIL}>`,
        to: email,
        subject: "Welcome to EKAANT - Verify Your Email",
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: linear-gradient(to bottom right, #ffffff, #f5f7ff);">
            <div style="text-align: center; margin-bottom: 20px;">
            </div>
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #2b3481; margin-bottom: 20px; text-align: center;">Welcome to EKAANT!</h1>
              <p style="color: #444; font-size: 16px;">Hi ${username},</p>
              <p style="color: #444; font-size: 16px;">Thank you for signing up with EKAANT – we're excited to have you onboard! 🎉</p>
             
              <div style="background: #f8faff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="color: #2b3481; font-size: 18px; margin-bottom: 15px;">Your One-Time Password (OTP):</p>
                <div style="font-size: 32px; font-weight: bold; color: #2b3481; letter-spacing: 5px; margin: 10px 0;">
                  ${otp}
                </div>
                <p style="color: #666; font-size: 14px; margin-top: 15px;">Valid for 10 minutes only</p>
              </div>
              <div style="border-left: 4px solid #ffd700; padding-left: 15px; margin: 20px 0;">
                <p style="color: #666; font-size: 14px; margin: 5px 0;">🔒 For security reasons, please do not share this OTP with anyone.</p>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">⏰ This code will expire in 10 minutes.</p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #444; font-size: 16px;">Need assistance? We're here to help!</p>
                <a href="mailto:support@ekaant.co" style="color: #2b3481; text-decoration: none; font-weight: bold;">himanshu@ekaant.co</a>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666;">
              <p style="margin: 5px 0;">Let's build a healthier, more engaged workplace – together. 💙</p>
              <div style="margin-top: 15px;">
                <a href="http://www.ekaant.co" style="color: #2b3481; text-decoration: none; font-weight: bold;">www.ekaant.co</a>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ OTP Email Sent Successfully to:", email);
      res.status(200).json({ message: "OTP sent to your email. Please verify." });
    } catch (emailError) {
      console.error("❌ Email Sending Error:", emailError);
      // Delete the employee if email fails
      await Employee.findOneAndDelete({ email });
      return res.status(500).json({ 
        message: "Failed to send OTP email. Please try again.",
        error: emailError.message 
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// ✅ Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "Employee not found!" });
    if (employee.verified) return res.status(400).json({ message: "Email already verified!" });
    if (employee.otpExpires < new Date()) return res.status(400).json({ message: "OTP expired!" });

    if (employee.otp !== otp) return res.status(400).json({ message: "Invalid OTP!" });

    employee.verified = true;
    employee.otp = null;
    employee.otpExpires = null;
    await employee.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

// ✅ Set Password After OTP Verification
export const setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee || !employee.verified) {
      return res.status(400).json({ message: "Employee not found or not verified!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    employee.password = hashedPassword;
    await employee.save();

    // Send welcome email
    const welcomeMailOptions = {
      from: `"EKAANT TEAM" <${process.env.COMPANY_EMAIL}>`,
      to: email,
      subject: "A Warm Welcome from Ekaant 💙",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background: linear-gradient(to bottom right, #ffffff, #f5f7ff);">
          <div style="text-align: center; margin-bottom: 20px;">
          </div>
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #2b3481; margin-bottom: 20px; text-align: center;">Welcome to Your Journey!</h1>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">Dear ${employee.username},</p>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">I'm Himanshu, the founder at EKAANT, and I wanted to personally thank you for taking this first step toward your mental well-being. 🌟</p>
            <div style="background: #f8faff; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #444; font-size: 16px; line-height: 1.6;">Life gets busy. Stress builds up. And sometimes, it's hard to even find the right space to pause and reflect. That's why we created Ekaant — a place where you can talk freely, feel supported, and take care of your mental and emotional health on your terms.</p>
            </div>
            <div style="margin: 30px 0;">
              <h2 style="color: #2b3481; font-size: 20px; margin-bottom: 15px;">Your EKAANT Journey Includes:</h2>
              <div style="background: white; border-left: 4px solid #2b3481; padding: 15px; margin: 10px 0;">
                <p style="color: #444; font-size: 16px; margin: 10px 0;">🧠 <strong>Confidential Therapy & Coaching</strong></p>
                <p style="color: #666; font-size: 14px;">Professional support tailored to your needs</p>
              </div>
              <div style="background: white; border-left: 4px solid #4CAF50; padding: 15px; margin: 10px 0;">
                <p style="color: #444; font-size: 16px; margin: 10px 0;">🌿 <strong>Personalized Well-being Journeys</strong></p>
                <p style="color: #666; font-size: 14px;">Customized paths for your growth</p>
              </div>
              <div style="background: white; border-left: 4px solid #FFA726; padding: 15px; margin: 10px 0;">
                <p style="color: #444; font-size: 16px; margin: 10px 0;">🎙️ <strong>Expert-led Live Sessions</strong></p>
                <p style="color: #666; font-size: 14px;">Interactive tools that actually help</p>
              </div>
            </div>
            <div style="background: #f8faff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="color: #444; font-size: 16px; line-height: 1.6;">Everything here is designed to be simple, private, and stigma-free. No judgment, no labels — just a safe space for you to focus on you.</p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #444; font-size: 16px;">Have questions or feedback?</p>
              <p style="color: #444; font-size: 16px;">Write to me directly at <a href="mailto:himanshu@ekaant.co" style="color: #2b3481; text-decoration: none; font-weight: bold;">himanshu@ekaant.co</a></p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666;">
            <p style="margin: 5px 0;">Take care, and welcome to Ekaant.</p>
            <p style="margin: 15px 0; color: #2b3481; font-weight: bold;">Himanshu Sharma</p>
            <p style="margin: 5px 0; color: #666;">Founder & CEO - EKAANT</p>
            <div style="margin-top: 15px;">
              <a href="http://www.ekaant.co" style="color: #2b3481; text-decoration: none; font-weight: bold;">www.ekaant.co</a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(welcomeMailOptions);

    // Generate token after password is set
    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'https://ekaant.onrender.com');

    res.status(200).json({ success: true, message: "Password set successfully!", token, employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// ✅ Employee Sign-In (Login)
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(400).json({ message: "Employee not found!" });
    if (!employee.verified) return res.status(400).json({ message: "Please verify your email first!" });

    const isMatch = await bcryptjs.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // ✅ Store the token in frontend after login
    // Set secure cookie and CORS headers
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', 'https://ekaant.onrender.com');

    res.status(200).json({ success: true, token, employee });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};


// ✅ Fetch Profile (protected route using token)
export const fetchProfile = async (req, res) => {
  try {
    const employeeId = req.employee.id; // From verifyToken middleware
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found!" });

    res.status(200).json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};



export const bookSession = async (req, res) => {
  console.log("📥 Received Booking Request:", req.body);

  const { employeeId, expertEmail, expertName, sessionDate, specialization, startDateTime, endDateTime } = req.body;

  // ✅ Check for Missing Required Fields
  if (!employeeId || !expertEmail || !expertName || !sessionDate || !specialization || !startDateTime || !endDateTime) {
    console.log("❌ Missing fields:", { employeeId, expertEmail, expertName, sessionDate, specialization, startDateTime, endDateTime });
    return res.status(400).json({ success: false, message: "❌ Missing required fields!" });
  }

  try {
    console.log("⏳ Fetching Employee Details...");
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      console.log("❌ Employee Not Found");
      return res.status(404).json({ success: false, message: "❌ Employee not found." });
    }

    const employeeEmail = employee.email;
    console.log("✅ Employee Email:", employeeEmail);
    console.log("⏳ Generating Teams Meeting...");

    const meetingStart = new Date(startDateTime).toISOString();
    const meetingEnd = new Date(endDateTime).toISOString();
    console.log("✅ Start Time:", meetingStart);
    console.log("✅ End Time:", meetingEnd);

    let meetingLink;
    try {
      meetingLink = await createTeamsMeeting(employeeEmail, expertEmail, expertName, meetingStart, meetingEnd);
      console.log("✅ Teams Meeting Created:", meetingLink);
    } catch (meetingError) {
      console.error("❌ Teams Meeting Error:", meetingError.message);
      return res.status(500).json({ success: false, message: "❌ Failed to create Teams meeting." });
    }

    // ✅ Ensure Meeting Link is Valid
    if (!meetingLink) {
      console.error("❌ Meeting link is undefined.");
      return res.status(500).json({ success: false, message: "❌ Failed to retrieve Teams meeting link." });
    }

    // ✅ Send email notification to employee and expert
    const employeeSubject = "📅 Your Mental Health Session is Confirmed!";
    const employeeMessage = `
      Hello,

      Your session with Dr. ${expertName} on ${sessionDate} is confirmed.
      Start Time: ${meetingStart}
      End Time: ${meetingEnd}

      Join the meeting using this link: ${meetingLink}

      Regards,
      Ekaant Team
    `;

    const expertSubject = "📅 New Session Scheduled with Employee";
    const expertMessage = `
      Hello Dr. ${expertName},

      A new session has been booked with ${employeeEmail} on ${sessionDate}.
      Start Time: ${meetingStart}
      End Time: ${meetingEnd}

      Join the meeting using this link: ${meetingLink}

      Regards,
      Ekaant Team
    `;

    // ✅ Send Emails and Validate Sending
    try {
      await sendEmailNotification(employeeEmail, employeeSubject, employeeMessage);
      await sendEmailNotification(expertEmail, expertSubject, expertMessage);
      console.log("✅ Emails Sent Successfully!");
    } catch (emailError) {
      console.error("❌ Error Sending Email Notifications:", emailError.message);
      return res.status(500).json({ success: false, message: "❌ Failed to send email notifications." });
    }

    // ✅ Send Successful Response
    res.json({ success: true, message: "Session booked successfully! Email notifications sent.", meetingLink });

  } catch (error) {
    console.error("❌ Error Booking Session:", error.message);
    res.status(500).json({ success: false, message: "❌ Failed to book session." });
  }
};



export const bookLive = async (req, res) => {
  console.log("📥 Received Live Session Booking Request:", req.body);

  const { employeeEmail, expertEmail, expertName, sessionDate, specialization, startTime, endTime } = req.body;

  if (!employeeEmail || !employeeEmail.includes("@")) {
    console.error("❌ Invalid Employee Email:", employeeEmail);
    return res.status(400).json({ success: false, message: "❌ Invalid Employee Email!" });
  }

  if (!expertEmail || !expertEmail.includes("@")) {
    console.error("❌ Invalid Expert Email:", expertEmail);
    return res.status(400).json({ success: false, message: "❌ Invalid Expert Email!" });
  }

  try {
    // Convert times to ISO format for Teams meeting
    // Convert 12-hour format to 24-hour format for ISO datetime
    const convertTo24Hour = (time12h) => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);

      if (modifier === 'PM' && hours < 12) hours = hours + 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    const startTime24 = convertTo24Hour(startTime);
    const endTime24 = convertTo24Hour(endTime);

    const startDateTime = `${sessionDate}T${startTime24}:00.000Z`;
    const endDateTime = `${sessionDate}T${endTime24}:00.000Z`;

    let session = await Session.findOne({ 
      expertEmail, 
      sessionDate, 
      startTime, 
      endTime 
    });

    if (!session) {
      console.log("⏳ Creating new session with Teams meeting...");
      let meetingLink;
      try {
        // Create Teams meeting using admin account for group session
        meetingLink = await createTeamsMeeting(
          process.env.MICROSOFT_TEAMS_USER_ID,
          expertEmail,
          expertName,
          startDateTime,
          endDateTime
        );
        console.log("✅ Teams Meeting Created:", meetingLink);
      } catch (meetingError) {
        console.error("❌ Failed to create Teams meeting:", meetingError);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to create meeting link" 
        });
      }

      session = new Session({
        sessionDate,
        expertEmail,
        expertName,
        specialization,
        startTime,
        endTime,
        meetingLink,
        attendees: [employeeEmail]
      });
    } else {
      // Check if session is full
      if (session.attendees.length >= session.maxAttendees) {
        return res.status(400).json({
          success: false,
          message: "Session is full. Please choose another session."
        });
      }

      // Add employee to session
      session.attendees.push(employeeEmail);
    }

    await session.save();

    // Send confirmation email to the new attendee
    const attendeeSubject = "📅 Live Group Session Confirmation";
    const attendeeMessage = `
      <h2>✅ Live Group Session Confirmed</h2>
      <p>Dear Participant,</p>
      <p>You have successfully joined the group session with <b>${expertName}</b>.</p>
      <p><b>Specialization:</b> ${specialization}</p>
      <p><b>Date:</b> ${sessionDate}</p>
      <p><b>Time:</b> ${startTime} - ${endTime}</p>
      <p><b>Join Link:</b> <a href="${session.meetingLink}">${session.meetingLink}</a></p>
      <p>Current Participants: ${session.attendees.length}</p>
      <p>Thank you for joining!</p>
    `;

    await sendEmailNotification(employeeEmail, attendeeSubject, null, attendeeMessage);

    // Notify expert about the new participant
    const expertSubject = "👥 New Participant Joined Your Live Session";
    const expertMessage = `
      <h2>New Participant Joined</h2>
      <p>Hello ${expertName},</p>
      <p>A new participant (${employeeEmail}) has joined your group session.</p>
      <p><b>Current Participant Count:</b> ${session.attendees.length}</p>
      <p><b>Session Details:</b></p>
      <p>Date: ${sessionDate}</p>
      <p>Time: ${startTime} - ${endTime}</p>
      <p><b>Join Link:</b> <a href="${session.meetingLink}">${session.meetingLink}</a></p>
    `;

    await sendEmailNotification(expertEmail, expertSubject, null, expertMessage);

    res.json({ 
      success: true, 
      message: "Successfully joined the live session! Check your email for details.",
      meetingLink: session.meetingLink,
      currentAttendees: session.attendees.length
    });

  } catch (error) {
    console.error("❌ Error Booking Live Session:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to complete booking process." 
    });
  }
};
export const sendOtpForReset = async (req, res) => {
  try {
    console.log("🔹 Received Forgot Password request:", req.body);

    // ✅ Check if email is provided
    if (!req.body.email) {
      console.log("❌ Missing email in request!");
      return res.status(400).json({ message: "Email is required!" });
    }

    const { email } = req.body;
    console.log("🔹 Looking up employee with email:", email);

    // ✅ Check if employee exists in DB
    const employee = await Employee.findOne({ email });
    if (!employee) {
      console.log("❌ Employee not found for email:", email);
      return res.status(400).json({ message: "Employee not found!" });
    }

    // ✅ Generate OTP and store in DB
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("✅ Generated OTP:", otp);

    employee.otp = otp;
    employee.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    await employee.save();
    console.log("✅ OTP saved in DB for:", email);

    // ✅ Ensure Email Credentials Exist
    if (!process.env.COMPANY_EMAIL || !process.env.COMPANY_EMAIL_PASSWORD) {
      console.error("❌ Missing COMPANY_EMAIL or COMPANY_EMAIL_PASSWORD in .env!");
      return res.status(500).json({ message: "Email service is not configured properly!" });
    }

    // ✅ Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Email Content
    const mailOptions = {
      from: `"EKAANT TEAM" <${process.env.COMPANY_EMAIL}>`,
      to: email,
      subject: "Reset Your Password - OTP Code",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };

    // ✅ Send OTP Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email Sending Error:", error);
        return res.status(500).json({ message: "Failed to send OTP email.", error: error.message });
      }
      console.log("✅ OTP Email Sent Successfully!", info.response);
      res.status(200).json({ message: "OTP sent to your email." });
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("🔹 Verifying OTP for:", email);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required!" });
    }

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(400).json({ message: "Employee not found!" });
    }

    if (!employee.otp || employee.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    if (employee.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    console.log("✅ OTP Verified Successfully");
    res.status(200).json({ message: "OTP Verified! You can now reset your password." });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    console.log("🔹 Received Password Reset Request for:", req.body.email);

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required!" });
    }

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(400).json({ message: "Employee not found!" });
    }

    // ✅ Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // ✅ Save new password and clear OTP fields
    employee.password = hashedPassword;
    employee.otp = null;
    employee.otpExpires = null;
    await employee.save();

    console.log("✅ Password reset successful for:", email);
    res.status(200).json({ message: "Password reset successfully! Please log in with your new password." });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
export const fetchEmployeeProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id)
      .select("-password -otp -otpExpires"); // Exclude sensitive data

    if (!employee) {
      return res.status(404).json({ message: "Employee not found!" });
    }

    res.status(200).json({ employee });
  } catch (error) {
    console.error("❌ Profile Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCredits = async (req, res) => {
  try {
    const employee = req.employee;
    const { credits, operation = 'set' } = req.body;

    if (typeof credits !== 'number') {
      return res.status(400).json({ success: false, message: "Invalid credits value" });
    }

    // Use findOne first to get current state
    const currentEmployee = await Employee.findById(employee._id);
    if (!currentEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    let newCreditsValue;
    if (operation === 'add') {
      newCreditsValue = currentEmployee.credits + credits;
    } else if (operation === 'subtract') {
      newCreditsValue = currentEmployee.credits - credits;
      if (newCreditsValue < 0) {
        return res.status(400).json({ success: false, message: "Insufficient credits" });
      }
    } else {
      newCreditsValue = credits;
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { 
        _id: employee._id,
        credits: currentEmployee.credits // Optimistic locking
      },
      { $set: { credits: newCreditsValue }},
      { 
        new: true,
        runValidators: true 
      }    );

    if (!updatedEmployee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    if (updatedEmployee.credits < 0) {
      // Rollback if credits would go negative
      await Employee.findOneAndUpdate(
        { _id: employee._id },
        { $set: { credits: employee.credits }}
      );
      return res.status(400).json({ 
        success: false, 
        message: "Insufficient credits"
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Credits updated successfully",
      credits: updatedEmployee.credits
    });
  } catch (error) {
    console.error("Error updating credits:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update credits",
      error: error.message 
    });
  }
};