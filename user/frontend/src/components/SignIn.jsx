import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/signin.css'; // Ensure to import your CSS file
import { AuthContext } from '../contexts/AuthContext';
import Loader from './Loader'; // Import the Loader component

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loader state
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Show loader during sign-in process
        setMsg(''); // Clear any previous messages

        try {
            const response = await fetch('/api/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMsg(data.msg);
                console.log(data);

                // 🔄 **Updated: Call login with token and username**
                login(data.access_token, data.user); 
                
                navigate('/dashboard'); // Redirect to dashboard on successful sign-in
            } else {
                setMsg(data.msg || 'Sign-in failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMsg('An error occurred. Please try again.');
        } finally {
            setIsLoading(false); // Hide loader after completion
        }
    };

    if (isLoading) {
        return <Loader />; // Display loader while signing in
    }

    return (
        <div className="container">
            <div className="register_right">
                <div className="content">
                    <img className="register_image" src="http://localhost:5000/static/assets/SignIn.png" alt="Sign In Illustration" />
                    <div className="card">
                        <form onSubmit={handleSignIn} className="register_form">
                            <div className="signn">Sign In</div>
                            <input
                                className="input_field"
                                type="text"
                                id="Username"
                                name="Username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            /><br />
                            <div className="signin-password-container">
                                <input
                                    className="input_field"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="psw"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span onClick={toggleShowPassword} className="signin-eye-icon">
                                    {showPassword ? '🙈' : '👁️'} {/* Eye icon */}
                                </span>
                            </div>
                            <input
                                className="submit_button"
                                type="submit"
                                value="Login"
                            />
                            <h5 style={{ color: "black" }}>{msg}</h5>
                            <div className="register_link">
                                Don't have an account? <Link to="/register" className="sign_up_instead">Register</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
