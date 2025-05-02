import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8888/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          password 
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed');
        return;
      }

      const data = await res.json();
      console.log(data);

      localStorage.setItem('currentUser', JSON.stringify({
        id: data.user.id,
        email: data.user.email
      }));

      navigate('/home');
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('Login error. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <img src="/images/Main_Logo.png" alt="Stardew Valley Logo" className="logo" />
      <h2>Welcome Back, Adventurer</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>Enter Community Center</button>

      <p style={{ marginTop: '20px' }}>
        No account? <button onClick={() => navigate('/register')}>click to register!</button>
      </p>
    </div>
  );
}
