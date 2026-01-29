// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await fetch("http://localhost:3000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//         }),
//       });

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({}));
//         throw new Error(err.message || "Invalid credentials");
//       }

//       const data = await response.json();

//       // store auth data
//       localStorage.setItem("accessToken", data.accessToken);
//       localStorage.setItem("practitionerType", data.practitionerType);
//       localStorage.setItem("userId", data.userId);

//       // redirect
//       navigate("/dashboard");
//     } catch (err: any) {
//       setError(err.message || "Login failed. Please try again.");
//     }
//   };

//   // const handleForgotPassword = () => {
//   //   console.log("Forgot password clicked");
//   //   // forgot password logic
//   // };

//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       <div className="w-[70%] relative flex items-center justify-center overflow-hidden">
//         <div
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: `url('/src/assets/imgDental.jpg')`,
//           }}
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-950/70 to-black/60"></div>
//         </div>

//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px] animate-[drift_20s_linear_infinite]"></div>
//         </div>
//       </div>

//       <div className="w-[30%] flex items-center justify-center bg- px-8 shadow-2xl">
//         <div className="w-full max-w-md">
//           <h2 className="text-3xl font-bold text-gray-800 mb-2">
//             Practice Login
//           </h2>
//           <p className="text-gray-600 mb-8">Please enter your details</p>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Email
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-4 focus:ring-red-100 transition-all"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-800 focus:ring-4 focus:ring-red-100 transition-all"
//               />
//             </div>
//             {error && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-800 text-sm">{error}</p>
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full py-3 bg-gradient-to-r from-red-800 to-red-950 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
//             >
//               Sign In
//             </button>

//             <div className="text-right">
//               {/* <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 className="text-sm text-red-800 hover:text-red-950 hover:underline transition-colors"
//               >
//                 Forgot Password?
//               </button> */}
//             </div>
//           </form>
//         </div>
//       </div>

//       <style>{`
//         @keyframes drift {
//           from {
//             transform: translate(0, 0);
//           }
//           to {
//             transform: translate(30px, 30px);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Mode = "login" | "forgot" | "reset";

const Login: React.FC = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const passwordsMismatch =
    mode === "reset" &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      if (data.practitionerType !== "Practice") {
        throw new Error("Access denied. Practice users only.");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("practitionerType", data.practitionerType);

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  // ---------------- FORGOT ----------------
  const handleForgot = async () => {
    setError("");
    setMessage("");

    const res = await fetch("http://localhost:3000/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    // DEV MODE: backend logs token, or return it
    if (data.token) {
      setToken(data.token);
      setMode("reset");
    } else {
      setMessage("If email exists, reset instructions were sent.");
    }
  };

  // ---------------- RESET ----------------
  const handleReset = async () => {
    if (!token) return;

    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const res = await fetch("http://localhost:3000/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setMessage("Password reset successful. Please login.");
    setMode("login");
    setPassword("");
    setConfirmPassword("");
    setToken(null);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT IMAGE */}
      <div className="w-[70%] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/src/assets/imgDental.jpg')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 to-black/70"></div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-[30%] flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">
            {mode === "login" && "Practice Login"}
            {mode === "forgot" && "Forgot Password"}
            {mode === "reset" && "Reset Password"}
          </h2>

          <p className="text-gray-600 mb-6">
            {mode === "login" && "Enter your credentials"}
            {mode === "forgot" && "Enter your email"}
            {mode === "reset"}
          </p>

          {error && <p className="text-red-700 mb-3">{error}</p>}
          {message && <p className="text-green-700 mb-3">{message}</p>}

          {/* LOGIN */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />

              <button className="w-full py-3 bg-red-800 text-white rounded-lg">
                Login
              </button>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-sm text-red-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          {/* FORGOT */}
          {mode === "forgot" && (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              />

              <button
                onClick={handleForgot}
                className="w-full py-3 bg-red-800 text-white rounded-lg"
              >
                Send Reset
              </button>

              <button
                onClick={() => setMode("login")}
                className="text-sm text-red-800 hover:underline"
              >
                <div className="flex flex-1 items-center  gap-2">
                  <ArrowLeft className="h-2 w-2" />
                  Back to login
                </div>
              </button>
            </div>
          )}
          {mode === "reset" && (
            <div className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none
        ${passwordsMismatch ? "border-red-600" : "border-gray-600"}`}
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none
        ${passwordsMismatch ? "border-red-600" : "border-gray-600"}`}
              />

              {passwordsMismatch && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}

              <button
                onClick={handleReset}
                disabled={passwordsMismatch}
                className={`w-full py-3 rounded-lg text-white
                ${passwordsMismatch ? "bg-gray-400 cursor-not-allowed" : "bg-red-800"}`}
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
