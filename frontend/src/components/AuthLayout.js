import React from 'react';

function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
