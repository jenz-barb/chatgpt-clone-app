import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import API from '../../../utils/API';




function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await API.post('/auth/signup', { email, password });
      alert(response.data.message || 'Signup successful!');
      navigate('/login'); // ✅ Proper redirect
    } catch (error) {
      alert('Signup failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <AuthLayout title="Signup">
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
      <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded">
        Signup
      </button>
      <Link to="/login" className="text-blue-600 underline mt-4">
        Already have an account? Login
      </Link>
    </AuthLayout>
  );
}

export default Signup;
