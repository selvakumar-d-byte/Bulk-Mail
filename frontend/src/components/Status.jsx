function Status({count, sent, failed}) {
    return (
        <div className="bg-white rounded-lg p-5">
            <div className="flex gap-2 items-center">
                <div className="w-14 h-14 bg-green-200 rounded-full flex items-center justify-center md:w-16 md:h-16">
                    <i className="fa-solid fa-circle-info text-xl text-white w-9 h-9 bg-green-600 flex justify-center items-center rounded-full md:w-10 md:h-10 md:text-2xl"></i>
                </div>
                <div>
                    <h1 className="text-lg font-semibold md:text-xl">Email Status</h1>
                    <p className="text-gray-500 text-sm"> Status of Emails</p>
                </div>

            </div>

            <div className="flex flex-col gap-3 mt-3">
                <div className="flex items-center justify-between gap-3 bg-blue-50 rounded-xl px-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <i className="fa-solid fa-user text-blue-600 text-lg"></i>
                        <p className="text-sm sm:text-base text-gray-700 font-medium"> Total Receivers </p>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-blue-700 tabular-nums"> {count} </span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-green-50 rounded-xl px-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <i className="fa-solid fa-circle-check text-green-600 text-lg"></i>
                        <p className="text-sm sm:text-base text-gray-700 font-medium"> Successfully Sent </p>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-green-700 tabular-nums"> {sent} </span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-red-50 rounded-xl px-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <i className="fa-solid fa-circle-xmark text-red-600 text-lg"></i>
                        <p className="text-sm sm:text-base text-gray-700 font-medium"> Failed </p>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-red-700 tabular-nums"> {failed} </span>
                </div>
            </div>
        </div>
    )
}

export default Status