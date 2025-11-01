import { useState } from "react";
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

    // Ορισμός τύπου για το change event
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

        // Προσθήκη client-side validation για confirm password
        if (formData.password !== formData.confirmPassword) {
            setBackendErrors(['Passwords do not match']);
            return;
        }

        setIsLoading(true);
        setBackendErrors([]);

        try {
            const response = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response data:', result);

            if (!response.ok) {
                setBackendErrors(result.errors || ['Registration failed - please try again']);
            } else {
                alert('Registration successful! Please login.');
               navigate("/login");
            }
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
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {/* Backend Errors */}
                    {backendErrors.length > 0 && (
                        <div className="backend-errors bg-red-50 border border-red-300 rounded-lg p-4">
                            <h4 className="text-red-800 font-bold mb-2">Please fix the following errors:</h4>
                            {backendErrors.map((error, index) => (
                                <div key={index} className="error-item text-red-600 flex items-center mt-1">
                                    <span className="mr-2">✗</span>
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

                    {/* Password Requirements */}
                    <div className="password-requirements bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-bold text-amber-800 mb-2">Password Requirements:</h4>
                        <ul className="list-disc list-inside text-amber-700 space-y-1">
                            <li>At least 8 characters long</li>
                            <li>One uppercase letter (A-Z)</li>
                            <li>One lowercase letter (a-z)</li>
                            <li>One number (0-9)</li>
                        </ul>
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