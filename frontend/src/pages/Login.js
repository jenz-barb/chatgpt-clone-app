import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import API from '../../utils/API';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('email', email);

      navigate('/chat'); // ✅ Proper redirect
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <AuthLayout title="Login">
      <input
        type="email"
        placeholder="Email"
        className="p-2 mb-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 mb-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login
      </button>
      <Link to="/signup" className="text-blue-600 underline mt-4">
        Don't have an account? Signup
      </Link>
    </AuthLayout>
  );
}

export default Login;
