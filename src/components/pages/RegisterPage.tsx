import React, { useState } from "react";
import { useNavigate } from "react-router";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [backendErrors, setBackendErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const  navigate = useNavigate();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (backendErrors.length > 0) {
            setBackendErrors([]);
        }
    };

    // Ορισμός τύπου για το submit event
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setBackendErrors([]);

        // Password validation
        const passwordErrors = [];

        if (formData.password.length < 12) {
            passwordErrors.push("Password must be at least 12 characters long");
        }
        if (!/(?=.*[a-z])/.test(formData.password)) {
            passwordErrors.push("Password must contain at least one lowercase letter");
        }
        if (!/(?=.*[A-Z])/.test(formData.password)) {
            passwordErrors.push("Password must contain at least one uppercase letter");
        }
        if (!/(?=.*\d)/.test(formData.password)) {
            passwordErrors.push("Password must contain at least one number");
        }
        if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.password)) {
            passwordErrors.push("Password must contain at least one special character");
        }

        if (passwordErrors.length > 0) {
            setBackendErrors(passwordErrors);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setBackendErrors(['Passwords do not match']);
            return;
        }


        setIsLoading(true);
        setBackendErrors([]);

        try {
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {

                const errorMessage = await response.text();
                setBackendErrors([errorMessage]);
                return;
            }
                const result = await response.json();
                console.log('Response data:', result);


                alert('Registration successful! Please login.');
               navigate("/login");

        } catch (error) {
            console.error('Fetch error:', error);
            setBackendErrors(['Network error - please check if server is running']);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header Image */}
            <div className="h-48 relative overflow-hidden shadow-lg flex-shrink-0">
                <img
                    src="/image/pexels-rednguyen-10819256.jpg"
                    alt="Bookshelf Header"
                    className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10"></div>
            </div>

            {/* Main Content */}
            <div className="flex-grow bg-amber-50 py-6">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto bg-white p-8 border-2 border-amber-800 rounded-xl shadow-lg space-y-6"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-amber-800 drop-shadow-sm">Sign Up</h1>
                        <div className="w-16 h-1  mx-auto mt-2 rounded-full"></div>
                        <p className="text-amber-700 mt-2">Create your account</p>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label htmlFor="username" className="block font-bold text-lg text-amber-800">
                            Username
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-800 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-400"
                            name="username"
                            type="text"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username (3-20 characters)"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block font-bold text-lg text-amber-800">
                            Email
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-800 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-400"
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block font-bold text-lg text-amber-800">
                            Password
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-800 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-400"
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block font-bold text-lg text-amber-800">
                            Confirm Password
                        </label>
                        <input
                            className="w-full p-3 border-2 border-amber-800 rounded-lg focus:border-amber-800 focus:ring-2 focus:ring-amber-700 transition-colors text-amber-900 placeholder-amber-400"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {/* Backend Errors */}
                    {backendErrors.length > 0 && (
                        <div className="backend-errors bg-green-50 border border-amber-800 rounded-lg p-4">
                            <h4 className="text-red-800 font-bold mb-2">Password Requirements:</h4>
                            {backendErrors.map((error, index) => (
                                <div key={index} className="error-item text-red-800 flex items-center mt-1">
                                    <span className="mr-2">📝</span>
                                    {error}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-lg shadow-lg "
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : ' Create Account'}
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                        <p className="text-amber-600">
                            Already have an account?{" "}
                            <a href="/login" className="text-amber-700 hover:text-amber-800 font-bold underline">
                                Sign In
                            </a>
                        </p>
                    </div>
                </form>
            </div>

            {/* Footer*/}
            <footer className="bg-emerald-950 text-amber-100 flex-shrink-0">
                <div className="container mx-auto py-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-amber-500">📖</span>
                        <p className="text-sm font-semibold">
                            © {new Date().getFullYear()} BookShelf - All Rights Reserved
                        </p>
                        <span className="text-amber-500">📖</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default RegisterPage;