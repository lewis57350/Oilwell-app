import React, { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) await register(email, pass);
      else await login(email, pass);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">
          {isRegister ? "Create account" : "Login"} – WellBuddyApp
        </h1>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded-lg bg-gray-50 border border-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
            className="p-3 rounded-lg bg-gray-50 border border-gray-300"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-lime-400 hover:from-cyan-600 hover:to-lime-500 text-white p-3 rounded-lg font-bold shadow"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <button
          className="mt-4 text-sm text-cyan-700"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Need an account? Register"}
        </button>
      </div>
    </div>
  );
}
