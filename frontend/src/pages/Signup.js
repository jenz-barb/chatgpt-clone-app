import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert('Signup failed: ' + (data.detail || 'Unknown error'));
        return;
      }

      const result = await response.json();
      alert(result.message);
      window.location.href = '/login';
    } catch (error) {
      alert('Signup failed: ' + error.message);
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
