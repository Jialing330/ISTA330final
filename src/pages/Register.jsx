import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:8888/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ register successfully:', data);
        navigate('/login'); 
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Registration failed.');
        console.error('❌ register fail:', errorData);
      }
    } catch (err) {
      console.error('❌ server error:', err);
      setError('Server error.');
    }
  };

  return (
    <div className="form-container">
      <h2>Join the Community Center!</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleRegister}>Register</button>

      <p style={{ marginTop: '20px' }}>
        Already have an account? <button onClick={() => navigate('/login')}>Click to login!</button>
      </p>
    </div>
  );
}
