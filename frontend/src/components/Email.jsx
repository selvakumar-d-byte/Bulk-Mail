import { useState } from "react"
import axios from 'axios';

function Email({file, setSent, setFailed}) {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(false)

    function sendMail() {
        if (!file) { 
            alert("Please select an Excel file first!")
            return; 
        }

        if (subject.trim() === '' || message.trim() === '') {
            alert('Please enter the message of the Email')
            setStatus(false)
            return;
        }

        setStatus(true)

        axios.post('http://localhost:5000/sendemail', { subject: subject, message: message })
            .then((data) => {
                alert('Email sent successfully')
                setSent(data.data.sent)
                setFailed(data.data.failed)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(()=>{
                setStatus(false)
            })
    }

    return (
        <div className="bg-white rounded-lg p-5">
            <div className="flex gap-2 items-center ">
                <div className="w-16 h-16 rounded-full bg-violet-200 flex items-center justify-center">
                    <i className="fa-regular fa-envelope text-2xl bg-violet-600 text-white w-10 h-10 rounded-full flex items-center justify-center"></i>
                </div>
                <div>
                    <h1 className="text-lg font-semibold md:text-xl">Email</h1>
                    <p className="text-gray-500 text-sm">Enter subject and message</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <label className="font-semibold">Subject:</label>
                <div className="border border-gray-400 p-1 flex gap-1 items-center rounded-md text-gray-400">
                    <i className="fa-regular fa-envelope"></i>
                    <input value={subject} onChange={(event) => { setSubject(event.target.value) }} type="text" required className="outline-none text-black w-full" placeholder='Enter email subject...' />
                </div>


                <label className="font-semibold">Message:</label>
                <div className="border border-gray-400 p-1 flex gap-1 items-baseline rounded-md text-gray-400">
                    <i className="fa-regular fa-message"></i>
                    <textarea value={message} onChange={(event) => { setMessage(event.target.value) }} type="text" required className="outline-none text-black w-full min-h-32" placeholder='Enter email message...' />
                </div>

                <button onClick={sendMail} className="bg-blue-600 text-white p-2 rounded-lg font-semibold"><i className="fa-solid fa-paper-plane"></i> {status ? 'Mail Sending...' : 'Send Mail'}</button>
            </div>
        </div>
    )
}

export default Email