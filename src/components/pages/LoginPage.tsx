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
                navigate("/");
            }
        } catch (error) {
            console.error('Login failed:', error);
        }

    }


    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="form-group-icon">
                    <FontAwesomeIcon className="icon" icon={faCircleUser} size="10x" style={{color: "#7E4C27",}} />
                    </div>
                    <label htmlFor="username"><FontAwesomeIcon icon={faUser} style={{color: "#7E4C27",}}/>|Username</label>
                    <input type="text" id="username" name="username"
                           required/>
                </div>
                <div className="form-group" >

                    <label htmlFor="password" ><FontAwesomeIcon icon={faLock} style={{color: "#7E4C27",}} />|Password</label>
                    <input type="password" id="password" name="password"
                           required />
                </div>

                <button type="submit" className="login-btn">
                    Σύνδεση
                </button>

                <Link to="/Resign-page">
                <div className="form-group form-group-p1 p-2">
                <p >
                    Don’t have an account?
                    Sign up
                </p>
                </div>
                </Link>
            </form>
        </div>
    )
}

export default LoginPage;