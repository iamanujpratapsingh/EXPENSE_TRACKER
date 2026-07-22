import { useState } from 'react';
import axios from 'axios';
import { Send, CheckCircle } from 'lucide-react';

// const API_URL = "http://localhost:4000/api";
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

const ISSUE_TYPES = [
    "Select Issue Type",
    "Bug Report",
    "Login / Account Issue",
    "Feature Request",
    "Data / Sync Issue",
    "Other",
];

const Support = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        countryCode: "+91",
        phone: "",
        email: "",
        location: "",
        issueType: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.firstName || !formData.email || !formData.message) {
            setError("Please fill in your name, email, and message.");
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_URL}/support/contact`, formData);
            setSuccess(true);
            setFormData({
                firstName: "",
                lastName: "",
                countryCode: "+91",
                phone: "",
                email: "",
                location: "",
                issueType: "",
                message: "",
            });
        } catch (err) {
            console.error("Support submit error:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-2xl bg-[#0f1729]/80 border border-blue-900/40 rounded-2xl shadow-2xl p-6 sm:p-10 backdrop-blur-sm">
                <h1 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-8">
                    Contact Support
                </h1>

                {success ? (
                    <div className="flex flex-col items-center text-center py-10">
                        <CheckCircle className="w-14 h-14 text-green-400 mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Message Sent!</h2>
                        <p className="text-gray-400 mb-6">
                            Thanks for reaching out — we'll get back to you as soon as possible.
                        </p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                                className="w-full bg-[#0d1526] border border-blue-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full bg-[#0d1526] border border-blue-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div className="flex gap-3">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                className="bg-[#0d1526] border border-blue-900/50 rounded-lg px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                <option value="+91">IN +91</option>
                                <option value="+1">US +1</option>
                                <option value="+44">UK +44</option>
                            </select>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="flex-1 bg-[#0d1526] border border-blue-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                            className="w-full bg-[#0d1526] border border-blue-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Your Location (optional)"
                            className="w-full bg-[#0d1526] border border-blue-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />

                        <select
                            name="issueType"
                            value={formData.issueType}
                            onChange={handleChange}
                            className="w-full bg-[#0d1526] border border-blue-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            {ISSUE_TYPES.map((type, i) => (
                                <option key={type} value={i === 0 ? "" : type}>
                                    {type}
                                </option>
                            ))}
                        </select>

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Describe the problem you're facing..."
                            required
                            rows={5}
                            className="w-full bg-[#0d1526] border border-blue-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-opacity disabled:opacity-50"
                        >
                            <Send size={18} />
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Support;
