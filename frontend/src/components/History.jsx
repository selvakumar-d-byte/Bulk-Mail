
import { useEffect, useState } from "react";
import axios from "axios";

function History({ refreshKey }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function getHistory() {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get("https://bulk-mail-mwfn.onrender.com/history");

                if (active) {
                    setHistory(response.data);
                }
            } catch (err) {
                if (active) {
                    setError("Unable to load email history.");
                    console.error(err);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        getHistory();

        return () => {
            active = false;
        };
    }, [refreshKey]);

    return (
        <div className="w-full min-w-0 rounded-lg bg-white p-3 sm:p-5">
            <div className="mb-5 flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-200 sm:h-16 sm:w-16">
                    <i className="fa-regular fa-clock flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-xl text-white sm:h-10 sm:w-10"></i>
                </div>

                <div className="min-w-0">
                    <h1 className="text-lg font-semibold sm:text-xl">Email History</h1>
                    <p className="text-sm text-gray-500">History of your emails</p>
                </div>
            </div>

            {loading && (
                <p className="text-sm text-gray-500">Loading email history...</p>
            )}

            {error && (
                <p className="break-words text-sm text-red-600">{error}</p>
            )}

            {!loading && !error && history.length === 0 && (
                <p className="text-sm text-gray-500">No email history found. Send your first email!</p>
            )}

            <div className="flex min-w-0 flex-col gap-4">
                {history.map((item) => (
                    <div
                        key={item._id}
                        className="w-full min-w-0 overflow-hidden rounded-xl border border-gray-200 p-3 sm:p-5"
                    >
                        <div className="mb-4 flex min-w-0 flex-col gap-3">
                            <div className="min-w-0">
                                <h2 className="mb-2 text-base font-semibold sm:text-lg">Subject</h2>
                                <p className="break-words rounded-lg bg-gray-50 p-3 text-sm text-gray-600 sm:text-base">{item.subject}</p>
                            </div>

                            <p className="flex min-w-0 items-start gap-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                <i className="fa-regular fa-calendar mt-1 shrink-0"></i>
                                <span className="break-words">
                                    {new Date(item.createdAt).toLocaleString()}
                                </span>
                            </p>
                        </div>

                        <div className="mb-5 min-w-0">
                            <h3 className="mb-2 font-medium text-gray-700">Message</h3>

                            <div className="whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-600 sm:text-base">
                                {item.message}
                            </div>
                        </div>

                        <div className="min-w-0">
                            <h3 className="mb-3 font-medium text-gray-700">Recipients</h3>

                            <div className="flex min-w-0 flex-col gap-3">
                                {item.recipients?.map((recipient, index) => (
                                    <div
                                        key={`${recipient.email}-${index}`}
                                        className="flex min-w-0 flex-col gap-2 rounded-lg border border-gray-100 p-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            <i className="fa-regular fa-envelope mt-1 shrink-0 text-gray-400"></i>

                                            <p className="min-w-0 break-all text-sm leading-5 text-gray-700">
                                                {recipient.email}
                                            </p>
                                        </div>

                                        <span
                                            className={`self-start whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium sm:self-center ${
                                                recipient.status === "Sent"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {recipient.status}
                                        </span>

                                        {recipient.error && (
                                            <p className="break-words text-xs leading-5 text-red-500 sm:max-w--xs">
                                                {recipient.error}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;