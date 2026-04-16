import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, Loader2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .c-page { background-color: #f1f5f9; min-height: 100vh; padding: 160px 5% 100px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .c-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: start; }
        .c-title { font-family: 'Inter', sans-serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; letter-spacing: -3px; line-height: 1; margin-bottom: 25px; color: #0f172a; }
        .accent-blue { color: #1e40af; }
        .c-lead { color: #64748b; font-size: 1.15rem; font-weight: 600; line-height: 1.7; margin-bottom: 40px; }

        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .info-card { background: white; padding: 24px; border-radius: 24px; border: 1px solid rgba(226, 232, 240, 0.5); transition: 0.3s; }
        .icon-box { width: 44px; height: 44px; background: rgba(30, 64, 175, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #1e40af; margin-bottom: 15px; }
        .info-content h4 { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 5px; font-weight: 800; }
        .info-content p { font-size: 0.95rem; font-weight: 800; margin: 0; color: #0f172a; }

        .form-box { background: white; padding: 50px; border-radius: 40px; border: 1px solid rgba(226, 232, 240, 0.8); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05); }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #475569; margin-bottom: 8px; text-transform: uppercase; }
        
        .c-input { width: 100%; background: #f8fafc; border: 2px solid #f1f5f9; padding: 16px; border-radius: 16px; font-family: inherit; font-weight: 600; outline: none; transition: 0.3s; }
        .c-input:focus { border-color: #1e40af; background: white; }

        .c-btn { width: 100%; padding: 18px; background: #1e40af; border: none; border-radius: 18px; color: white; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; }
        .c-btn:disabled { background: #94a3b8; cursor: not-allowed; }

        .success-msg { text-align: center; padding: 40px 20px; }

        @media (max-width: 950px) {
          .c-container { grid-template-columns: 1fr; }
          .info-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="c-page">
        <div className="c-container">
          <div className="c-info-side">
            <h1 className="c-title">Get in <br/><span className="accent-blue">Touch.</span></h1>
            <p className="c-lead">
              Have questions about the league? Reach out to our team in Kampala.
            </p>

            <div className="info-grid">
              <div className="info-card">
                <div className="icon-box"><Mail size={20}/></div>
                <div className="info-content">
                  <h4>Email Support</h4>
                  <p>hello@stjerome.com</p>
                </div>
              </div>
              <div className="info-card">
                <div className="icon-box"><Phone size={20}/></div>
                <div className="info-content">
                  <h4>Official Line</h4>
                  <p>+256 700 000 000</p>
                </div>
              </div>
              <div className="info-card">
                <div className="icon-box"><MapPin size={20}/></div>
                <div className="info-content">
                  <h4>HQ Location</h4>
                  <p>Kampala, UG</p>
                </div>
              </div>
              <div className="info-card">
                <div className="icon-box"><Clock size={20}/></div>
                <div className="info-content">
                  <h4>Hours</h4>
                  <p>9AM - 6PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-box">
            {submitted ? (
              <div className="success-msg">
                <CheckCircle size={60} color="#059669" style={{ marginBottom: '20px' }} />
                <h2 style={{ fontWeight: 800 }}>Message Sent!</h2>
                <p style={{ color: '#64748b', fontWeight: 600 }}>We'll get back to you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="c-btn" 
                  style={{ marginTop: '30px', background: '#f1f5f9', color: '#1e40af' }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    className="c-input" 
                    placeholder="John Doe" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="input-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className="c-input" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>

                <div className="input-group">
                  <label>Subject</label>
                  <select 
                    className="c-input" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>General Inquiry</option>
                    <option>Club Registration</option>
                    <option>Sponsorships</option>
                    <option>Report Issue</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Your Message</label>
                  <textarea 
                    className="c-input" 
                    style={{ height: '120px', resize: 'none' }} 
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button className="c-btn" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <>SEND MESSAGE <Send size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;