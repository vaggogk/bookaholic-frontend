import '../styles/loginPage.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUser,faLock,faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const loginData = {
            username: formData.get('username') as string,
            password: formData.get('password') as string
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const userData = await response.json();
                console.log('Login successful:', userData);

                // 🎯 ΚΡΙΤΙΚΟ: ΑΠΟΘΗΚΕΥΣΗ TOKEN & USER DATA
                localStorage.setItem('authToken', userData.token);
                localStorage.setItem('userId', userData.id);
                localStorage.setItem('username', userData.username);

                navigate("/home_page");
            } else {
                // Handle login error
                console.error('Login failed:', response.status);
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-amber-50">
            {/* Header Image */}
            <div className="h-48 relative overflow-hidden shadow-lg flex-shrink-0">
                <img
                    src="/image/pexels-rednguyen-10819256.jpg"
                    alt="Bookshelf Header"
                    className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10"></div>
            </div>


            <div className="flex-grow">
                <div className="login-container">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <div className="form-group-icon">
                                <FontAwesomeIcon className="icon" icon={faCircleUser} size="10x" style={{color: "#7E4C27"}} />
                            </div>
                            <label htmlFor="username">
                                <FontAwesomeIcon icon={faUser} style={{color: "#7E4C27"}}/>|Username
                            </label>
                            <input type="text" id="username" name="username" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">
                                <FontAwesomeIcon icon={faLock} style={{color: "#7E4C27"}} />|Password
                            </label>
                            <input type="password" id="password" name="password" required />
                        </div>

                        <button type="submit" className="login-btn font-bold text-lg shadow-lg">
                            Σύνδεση
                        </button>

                        <Link to="/register_page">
                            <div className="form-group ">
                                <p className= "mt-7 ">
                                    Don't have an account?
                                    <a href="/register_page" className="p-1 text-amber-600 hover:text-amber-800 font-bold underline">
                                        Sign up</a>
                                    </p>
                            </div>
                        </Link>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-emerald-950 text-amber-100 flex-shrink-0 mt-auto">
                <div className="container mx-auto py-6 text-center">
                    <div className="flex items-center justify-center space-x-3">
                        <span className="text-amber-500">📖</span>
                        <p className="text-sm font-semibold">
                            © {new Date().getFullYear()} BookShelf - All Rights Reserved
                        </p>
                        <span className="text-amber-500">📖</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LoginPage;