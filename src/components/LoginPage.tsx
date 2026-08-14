import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import authService from "../api/authService";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs");
      }

      try {
        // Try to login using the auth service (which will call the API)
        await authService.login({ email, password });
        onLoginSuccess();
      } catch (apiError) {
        console.warn(
          "API authentication failed, falling back to mock login:",
          apiError
        );

        // Fallback to mock login for development/testing
        if (email === "admin@sayallo.com" && password === "admin123") {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Get a token from the generate-token endpoint if available
          try {
            const response = await fetch(
              "${process.env.NEXT_PUBLIC_BASE_URL}/generate-token"
            );
            const data = await response.json();
            localStorage.setItem("authToken", data.token);
          } catch (tokenError) {
            console.warn(
              "Could not get token from API, using mock token:",
              tokenError
            );
            localStorage.setItem("authToken", "mock-jwt-token");
          }

          localStorage.setItem(
            "user",
            JSON.stringify({ userId: "admin123", role: "admin" })
          );
          onLoginSuccess();
        } else {
          throw new Error("Email ou mot de passe incorrect");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Removed the devTools section completely

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <img
            src="/assets/logoS.png"
            alt="Say Allo Immo Logo"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h2 className="text-3xl font-extrabold text-gray-900">
            Say Allo Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connectez-vous pour accéder au tableau de bord
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-center">
            <span className="font-medium">Erreur:</span>
            <span className="ml-2">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="admin@sayallo.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connexion Projet en cours de construction...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Se connecter
                </span>
              )}
            </button>
          </div>

          {/* Removed devTools reference here */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
