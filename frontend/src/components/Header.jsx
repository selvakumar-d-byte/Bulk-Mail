function Header() {
    return (
        <header className=" bg-white flex items-center px-5 py-3 gap-3">
            <div>
                <i className="fa-solid fa-paper-plane text-blue-600 text-2xl md:text-3xl"></i>
            </div>

            <div>
                <h1 className="font-bold text-xl md:text-2xl">Bulk Mail</h1>
                <p className="font-medium text-sm md:text-base">Send bulk mails</p>
            </div>
        </header>
    )
}

export default Header