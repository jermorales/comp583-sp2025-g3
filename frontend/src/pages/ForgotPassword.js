import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement forgot password logic (API call)
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10vh' }}>
      <h2>Forgot Password</h2>
      {submitted ? (
        <p>If an account with that email exists, a password reset link has been sent.</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>Send Reset Link</button>
        </form>
      )}
      <div style={{ marginTop: '1rem' }}>
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;