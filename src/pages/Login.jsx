import React, { useState } from 'react';
import { auth } from '../firebase'; // Ensure your firebase.js is configured
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError("Invalid administrative credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@900&family=Inter:wght@400;600;800&display=swap');

        .login-page {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .login-card {
          background: white;
          width: 100%;
          max-width: 450px;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .login-header {
          background: #1e40af;
          padding: 40px;
          text-align: center;
          color: white;
        }

        .login-header h2 {
          font-family: 'Archivo', sans-serif;
          font-size: 2rem;
          text-transform: uppercase;
          margin: 10px 0 0;
          letter-spacing: -1px;
        }

        .login-body {
          padding: 40px;
        }

        .input-group {
          margin-bottom: 20px;
          position: relative;
        }

        .input-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper svg {
          position: absolute;
          left: 12px;
          color: #94a3b8;
        }

        .input-wrapper input {
          width: 100%;
          padding: 12px 12px 12px 40px;
          border: 2px solid #f1f5f9;
          border-radius: 8px;
          font-size: 1rem;
          transition: 0.3s;
          outline: none;
        }

        .input-wrapper input:focus {
          border-color: #1e40af;
          background: #f8fafc;
        }

        .error-msg {
          background: #fef2f2;
          color: #dc2626;
          padding: 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 20px;
          border-left: 4px solid #dc2626;
        }

        .login-btn {
          width: 100%;
          padding: 16px;
          background: #1e40af;
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'Archivo', sans-serif;
          font-weight: 900;
          font-size: 1rem;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.3s;
        }

        .login-btn:hover {
          background: #1e3a8a;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(30, 64, 175, 0.2);
        }

        .login-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .back-home {
          display: block;
          text-align: center;
          margin-top: 25px;
          color: #64748b;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .back-home:hover {
          color: #1e40af;
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <ShieldCheck size={48} color="#facc15" style={{ margin: '0 auto' }} />
            <h2>Admin Portal</h2>
            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>St. Jerome League Management</p>
          </div>

          <div className="login-body">
            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Admin Email</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input 
                    type="email" 
                    placeholder="name@league.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Security Key</label>
                <div className="input-wrapper">
                  <Lock size={18} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Verifying..." : "Enter Dashboard"}
                <ArrowRight size={20} />
              </button>
            </form>

            <Link to="/" className="back-home">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;