
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const { google } = require("googleapis")
require('dotenv').config()

const dns = require("node:dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

const app = express()

app.use(cors())
app.use(express.json())

// Gmail API + Google OAuth 2.0
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
)

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client
})

const GMAIL_USER = process.env.GMAIL_USER || process.env.user

// Email History Model
const EmailHistory = mongoose.model('EmailHistory', {
    subject: String,
    message: String,
    recipients: [
        {
            email: String,
            status: String,
            error: String
        }
    ],
    totalReceivers: Number,
    sent: Number,
    failed: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, 'EmailHistory')

// Store uploaded email list
let getEmailList = []

// Send email using Gmail API
async function sendGmail(to, subject, message) {
    const encodedSubject = Buffer
        .from(subject, "utf8")
        .toString("base64")

    const encodedBody = Buffer
        .from(message, "utf8")
        .toString("base64")

    const mimeMessage = [
        `From: ${GMAIL_USER}`,
        `To: ${to}`,
        `Subject: =?UTF-8?B?${encodedSubject}?=`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "Content-Transfer-Encoding: base64",
        "",
        encodedBody
    ].join("\r\n")

    const raw = Buffer
        .from(mimeMessage, "utf8")
        .toString("base64url")

    await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw }
    })
}

// Receive email list
app.post('/emaillist', function (req, res) {
    const emailList = req.body.emailList

    if (!Array.isArray(emailList)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email list"
        })
    }

    getEmailList = emailList

    res.json({
        success: true,
        count: getEmailList.length
    })
})

// Send bulk emails and save history
app.post('/sendemail', async function (req, res) {
    const subject = req.body.subject
    const message = req.body.message

    if (getEmailList.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Upload the email list first"
        })
    }

    if (
        typeof subject !== "string" ||
        !subject.trim() ||
        typeof message !== "string" ||
        !message.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter subject and message"
        })
    }

    let sent = 0
    let failed = 0
    const recipients = []

    for (const email of getEmailList) {
        try {
            await sendGmail(
                email,
                subject.trim(),
                message
            )

            sent++

            recipients.push({
                email: email,
                status: "Sent"
            })

        } catch (error) {
            failed++

            recipients.push({
                email: email,
                status: "Failed",
                error: error.message
            })

            console.error(`Email failed for ${email}:`, error.message)
        }
    }

    try {
        const savedHistory = await EmailHistory.create({
            subject: subject.trim(),
            message: message,
            recipients: recipients,
            totalReceivers: recipients.length,
            sent: sent,
            failed: failed
        })

        return res.json({
            success: failed === 0,
            message: "Email process completed",
            sent: sent,
            failed: failed,
            historyId: savedHistory._id
        })

    } catch (error) {
        console.error("History save failed:", error.message)

        return res.status(500).json({
            success: false,
            message: "Emails processed, but history could not be saved",
            sent: sent,
            failed: failed
        })
    }
})

// Get email history
app.get('/history', async function (req, res) {
    try {
        const history = await EmailHistory
            .find()
            .sort({ createdAt: -1 })
            .lean()

        res.json(history)

    } catch (error) {
        console.error("History fetch failed:", error.message)

        res.status(500).json({
            success: false,
            message: "Failed to fetch email history"
        })
    }
})

// Connect MongoDB
const MONGODB_URI = process.env.MongoDB_URL

if (
    !MONGODB_URI ||
    !process.env.GOOGLE_CLIENT_ID ||
    !process.env.GOOGLE_CLIENT_SECRET ||
    !process.env.GOOGLE_REFRESH_TOKEN ||
    !GMAIL_USER
) {
    console.error("Required environment variables are missing")
    process.exit(1)
}

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
})
.then(() => {
    console.log("MongoDB connected successfully")

    app.listen(process.env.PORT || 5000, function () {
        console.log(`Server started on port ${process.env.PORT || 5000}`)
    })
})
.catch((error) => {
    console.error("MongoDB connection failed:", error.message)
})
