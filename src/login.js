import React, { useState } from 'react';
import './login.css'; // Import the CSS file for the Login component

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Hardcoded username and password for demonstration
        const hardcodedUsername = 'admin';
        const hardcodedPassword = 'admin';

        if (username === hardcodedUsername && password === hardcodedPassword) {
            onLogin();
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="input-container">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="login-button" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};

export default Login;