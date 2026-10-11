import Header from "./components/Header"
import FileUpload from "./components/FileUpload"
import Email from "./components/Email"
import Status from "./components/Status"
import History from "./components/History"
import { useActionState, useState } from "react"


function App() {
  const [file, setFile] = useState(null)
  const [count, setCount] = useState(0)
  const [sent, setSent] = useState(0)
  const [failed, setFailed] = useState(0)

  return (
    <>
    <Header />
      <div className="flex flex-col gap-4 bg-gray-200 p-5 md:p-10">
        <FileUpload file={file} setFile={setFile} setCount={setCount} count={count}/>
        <Email file={file} setSent={setSent} setFailed={setFailed}/>
        <Status count={count} sent={sent} failed={failed}/>
        <History/>
      </div>
    </>
  )
}

export default App