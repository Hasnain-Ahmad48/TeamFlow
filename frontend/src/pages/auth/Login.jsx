// import {useState} from "react";
// import {Link, useNavigate} from "react-router-dom";
// import {useAuth} from "../../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const {login} = useAuth();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = e => {
//     const {name, value} = e.target;

//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       await login(formData);
//       navigate("/dashboard");
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Unable to login. Please check your credentials.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         <div className="mb-8">
//           <h1 className="text-3xl font-semibold tracking-tight text-white">
//             TeamFlow
//           </h1>

//           <p className="mt-2 text-sm text-zinc-400">
//             Sign in to manage your projects and tasks.
//           </p>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
//         >
//           <div className="space-y-5">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="mb-2 block text-sm font-medium text-zinc-300"
//               >
//                 Email
//               </label>

//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 required
//                 className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="password"
//                 className="mb-2 block text-sm font-medium text-zinc-300"
//               >
//                 Password
//               </label>

//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 required
//                 className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
//               />
//             </div>

//             {error && (
//               <p className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-sm text-red-400">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </button>
//           </div>

//           <p className="mt-6 text-center text-sm text-zinc-500">
//             Don't have an account?
//             <Link
//               to="/register"
//               className="text-zinc-200 transition hover:text-white"
//             >
//               Create one
//             </Link>
//           </p>
//         </form>
//       </div>
//     </main>
//   );
// };

import {useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {login} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const successMessage = location.state?.message;

  const handleChange = e => {
    const {name, value} = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email adress.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/dashboard", {replace: true});
    } catch (err) {
      const message =
        err.message?.data?.message ||
        "Unable to sign in. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        {/* Brand Panel */}
        <section className="relative hidden w-1/2 overflow-hidden border-r border-zinc-800 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.12),transparent_35%)]" />
          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                  <div className="h-3 w-3 rounded-sm bg-blue-400" />
                </div>
                <span className="text-lg font-semibold tracking-tight">
                  TeamFlow
                </span>
              </div>
            </div>
            {/* Main Message */}
            <div className="max-w-md">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-blue-400">
                Welcome back
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                Keep your team <br /> moving in the <br /> right direction.
              </h1>
              <p className="mt-6 max-w-sm text-sm leading-6 text-zinc-400">
                Access your projects, tasks, and team workspace from one focused
                environment.
              </p>
            </div>
            {/* Status */}
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Your
              workspace is ready
            </div>
          </div>
        </section>
        {/* Login Form */}
        <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Brand */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                <div className="h-3 w-3 rounded-sm bg-blue-400" />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                TeamFlow
              </span>
            </div>
            {/* Heading */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-medium text-blue-400">Sign in</p>
              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Sign in to continue to your TeamFlow workspace.
              </p>
            </div>
            {/* Success Message */}
            {successMessage && !error && (
              <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                <p className="text-sm text-emerald-400">{successMessage}</p>
              </div>
            )}
            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  disabled={loading}
                  className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-12 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3">
                  <p className="text-sm text-red-400"> {error} </p>
                </div>
              )}
              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            {/* Register */}
            <p className="mt-8 text-center text-sm text-zinc-500">
              Don't have an account?
              <Link
                to="/register"
                className="font-medium text-blue-400 transition hover:text-blue-300"
              >
                Create an account
              </Link>
            </p>
            {/* Footer */}
            <p className="mt-8 text-center text-xs leading-5 text-zinc-600">
              Secure access to your TeamFlow workspace.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
