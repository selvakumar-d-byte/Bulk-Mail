
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const nodemailer = require("nodemailer")
require('dotenv').config()

const dns = require("node:dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

const app = express()

app.use(cors())
app.use(express.json())

// Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.user,
        pass: process.env.pass,
    },
})

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
            await transporter.sendMail({
                from: process.env.user,
                to: email,
                subject: subject.trim(),
                text: message
            })

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

if (!MONGODB_URI) {
    console.error("MongoDB_URL is missing in .env file")
    process.exit(1)
}

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
})
.then(() => {
    console.log("MongoDB connected successfully")

    app.listen(5000, function () {
        console.log("Server started on port 5000")
    })
})
.catch((error) => {
    console.error("MongoDB connection failed:", error.message)
})