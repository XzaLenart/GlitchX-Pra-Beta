import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import ikon mata

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle visibility password
  const [error, setError] = useState("");
  const [emailHistory, setEmailHistory] = useState([]); // State untuk menyimpan history email
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false); // State untuk menampilkan dropdown rekomendasi
  const navigate = useNavigate();

  // Ambil history email dari localStorage saat komponen dimount
  useEffect(() => {
    const storedEmails = JSON.parse(localStorage.getItem("emailHistory")) || [];
    setEmailHistory(storedEmails);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Simpan email ke localStorage jika belum ada
      if (!emailHistory.includes(email)) {
        const updatedEmails = [...emailHistory, email];
        localStorage.setItem("emailHistory", JSON.stringify(updatedEmails));
        setEmailHistory(updatedEmails);
      }
      navigate("/home"); // Redirect ke halaman home setelah login berhasil
    } catch (error) {
      setError(error.message);
    }
  };

  // Filter email berdasarkan input user
  const filteredEmails = emailHistory.filter((storedEmail) =>
    storedEmail.toLowerCase().includes(email.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setShowEmailSuggestions(true); // Tampilkan dropdown saat user mengetik
                }}
                onFocus={() => setShowEmailSuggestions(true)} // Tampilkan dropdown saat input difokuskan
                onBlur={() => setTimeout(() => setShowEmailSuggestions(false), 200)} // Sembunyikan dropdown saat input kehilangan fokus
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* Dropdown rekomendasi email */}
              {showEmailSuggestions && filteredEmails.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  {filteredEmails.map((storedEmail, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => {
                        setEmail(storedEmail); // Set email saat user memilih rekomendasi
                        setShowEmailSuggestions(false); // Sembunyikan dropdown
                      }}
                    >
                      {storedEmail}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle antara text dan password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {/* Tombol toggle visibility password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;