import { useState } from "react"
import * as XLSX from 'xlsx'
import axios from 'axios'

function FileUpload({ file, setFile, setCount, count }) {

    async function handleFile(event) {
        const selectedFile = event.target.files[0]

        if (selectedFile) {
            setFile(selectedFile)
        }

        const reader = new FileReader()
        reader.onload = async function (event) {
            const data = event.target.result
            const workbook = XLSX.read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            const emails = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

            const emailList = emails.map((row) => String(row[0] || "").trim())

            await axios.post("http://localhost:5000/emaillist", { emailList: emailList })
                .then((data) => {
                    setCount(data.data.count)
                })
        }

        reader.readAsArrayBuffer(selectedFile)
    }

    return (
        <div className="bg-white rounded-lg p-5 flex flex-col gap-3">
            <div className="flex gap-2 items-center ">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center md:w-16 md:h-16">
                    <i className="fa-regular fa-file text-xl text-white w-9 h-9 bg-blue-600 flex justify-center items-center rounded-full md:w-10 md:h-10 md:text-2xl"></i>
                </div>
                <div>
                    <h1 className="text-lg font-semibold md:text-xl">Upload Excel File</h1>
                    <p className="text-gray-500 text-sm">Select your Excel file</p>
                </div>
            </div>


            <div className="flex flex-col items-center gap-3 justify-center border-dotted border-4 border-gray-300 rounded-lg p-2 bg-blue-50">
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-blue-700"></i>
                <p className="text-gray-500 text-sm md:text-base">Click here to choose your file</p>
                <label htmlFor="excelFile" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg cursor-pointer transition duration-200 shadow-sm" > <i className="fa-regular fa-folder-open mr-2"></i> Choose File </label>
                <input onChange={handleFile} id="excelFile" type="file" className="bg-blue-600 text-white hidden" accept=".xlsx,.xls" />
                <p className="text-gray-500 text-sm md:text-base">supported formets: xlsx, xls</p>

                {file && (
                    <div className="border border-gray-400 w-full rounded-lg px-3 py-4 sm:flex justify-between items-center text-center ">
                        <div className="flex items-center gap-3">
                            <i className="fa-solid fa-file-excel text-green-600 text-2xl"></i>
                            <div>
                                <p>{file.name}</p>
                                <p className="text-green-500">File selected <i className="fa-solid fa-check"></i></p>
                            </div>
                        </div>

                        <button onClick={() => {
                            setFile(null)
                            document.getElementById("excelFile").value = ""
                        }} className="bg-red-600 px-2 h-10 text-white rounded-lg"><i className="fa-solid fa-trash"></i> Delete</button>
                    </div>
                )}
            </div>
            <div className="p-3 w-full bg-blue-50 rounded-lg">
                <h1 className="text-blue-600 font-semibold flex items-center gap-1"><i className="fa-regular fa-envelope text-blue-700"></i> Total Email Addresses</h1>
                <p className="text-gray-500"><span className="text-blue-600 font-bold text-2xl sm:text-3xl">{count}</span> email IDs found</p>
            </div>
        </div>
    )
}

export default FileUpload