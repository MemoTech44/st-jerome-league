import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, Phone, MapPin, Send, 
  CheckCircle, Loader2, ShieldCheck, MessageSquare
} from 'lucide-react';

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
      <Helmet>
        <title>Contact Us | St. Jerome League</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');

        .c-page { 
          background-color: #f8fafc; 
          min-height: 100vh; 
          padding: 140px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #1e293b; 
        }
        .container { max-width: 1100px; margin: 0 auto; }
        
        .header-box { text-align: center; margin-bottom: 60px; }
        .header-box h1 { 
          font-size: clamp(2.2rem, 5vw, 3.2rem); 
          letter-spacing: -1px; 
          color: #1e3a8a; 
          margin: 0;
          font-weight: 800;
        }
        .header-underline {
          width: 60px;
          height: 5px;
          background: #facc15; 
          margin: 15px auto 25px;
          border-radius: 10px;
        }
        .header-description {
          max-width: 750px;
          margin: 0 auto;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #64748b;
          font-weight: 600;
        }

        .contact-grid { 
          display: grid; 
          grid-template-columns: 0.8fr 1.2fr; 
          gap: 40px; 
        }

        /* Sidebar Info Cards */
        .info-stack { display: flex; flex-direction: column; gap: 20px; }
        .info-card { 
          background: white; 
          padding: 30px; 
          border-radius: 24px; 
          border: 1px solid #e2e8f0; 
          display: flex; 
          align-items: center; 
          gap: 20px;
          transition: all 0.3s ease;
        }
        .info-card:hover { transform: translateY(-5px); border-color: #1e3a8a; }
        
        .icon-box { 
          width: 50px; height: 50px; 
          background: #eff6ff; 
          border-radius: 14px; 
          display: flex; align-items: center; justify-content: center; 
          color: #1e3a8a; 
        }

        /* Form Styling */
        .form-card { 
          background: white; 
          padding: 50px; 
          border-radius: 24px; 
          border: 1px solid #e2e8f0; 
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }

        .input-group { margin-bottom: 20px; }
        .input-group label { 
          display: block; 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: #1e3a8a; 
          margin-bottom: 8px; 
          text-transform: uppercase; 
          letter-spacing: 0.5px;
        }
        
        .c-input { 
          width: 100%; 
          background: #f8fafc; 
          border: 1px solid #e2e8f0; 
          padding: 16px; 
          border-radius: 12px; 
          font-family: inherit; 
          font-weight: 600; 
          outline: none; 
          transition: 0.3s; 
          color: #0f172a;
          box-sizing: border-box;
        }
        .c-input:focus { border-color: #1e3a8a; background: white; }

        .c-btn { 
          width: 100%; 
          padding: 18px; 
          background: #1e3a8a; 
          border: none; 
          border-radius: 12px; 
          color: white; 
          font-weight: 800; 
          font-size: 0.9rem;
          cursor: pointer; 
          display: flex; align-items: center; justify-content: center; 
          gap: 10px; 
          transition: 0.3s; 
          text-transform: uppercase;
        }
        .c-btn:hover { background: #1e40af; transform: translateY(-2px); }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
          .form-card { padding: 30px 20px; }
        }
      `}</style>

      <div className="c-page">
        <div className="container">
          <header className="header-box">
            <h1>Get In Touch</h1>
            <div className="header-underline"></div>
            <p className="header-description">
              Have questions about registration, fixtures, or partnerships? 
              Reach out to the St. Jerome Alumni League committee using the form below.
            </p>
          </header>

          <div className="contact-grid">
            <div className="info-stack">
              <div className="info-card">
                <div className="icon-box"><Mail size={24}/></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Email Us</h4>
                  <p style={{ margin: '2px 0 0', fontWeight: 800 }}>info@stjeromeleague.com</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="icon-box"><Phone size={24}/></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Call Us</h4>
                  <p style={{ margin: '2px 0 0', fontWeight: 800 }}>+256 700 123 456</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-box"><MapPin size={24}/></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Location</h4>
                  <p style={{ margin: '2px 0 0', fontWeight: 800 }}>Kampala, Uganda</p>
                </div>
              </div>

              <div style={{ padding: '20px', background: '#eff6ff', borderRadius: '16px', display: 'flex', gap: '12px', border: '1px solid #dbeafe' }}>
                 <MessageSquare size={20} color="#1e3a8a" />
                 <p style={{ margin: 0, fontSize: '0.85rem', color: '#1e3a8a', fontWeight: 600 }}>
                   Typical response time: Within 24 hours.
                 </p>
              </div>
            </div>

            <div className="form-card">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircle size={60} color="#10b981" style={{ marginBottom: '20px' }} />
                  <h2 style={{ fontWeight: 800, margin: '0 0 10px' }}>Message Sent!</h2>
                  <p style={{ color: '#64748b', fontWeight: 600 }}>We've received your inquiry and will be in touch soon.</p>
                  <button onClick={() => setSubmitted(false)} className="c-btn" style={{ marginTop: '30px', background: '#f1f5f9', color: '#1e3a8a' }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input 
                      type="text" className="c-input" placeholder="e.g. John Doe"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required 
                    />
                  </div>

                  <div className="input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" className="c-input" placeholder="name@example.com"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required 
                    />
                  </div>

                  <div className="input-group">
                    <label>Subject</label>
                    <select 
                      className="c-input" value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <option>General Inquiry</option>
                      <option>Team Registration</option>
                      <option>Sponsorship</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Your Message</label>
                    <textarea 
                      className="c-input" style={{ height: '120px', resize: 'none' }} 
                      placeholder="How can we help you?"
                      value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required
                    ></textarea>
                  </div>

                  <button className="c-btn" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Message <Send size={18} /></>}
                  </button>
                  
                  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                     <ShieldCheck size={14} /> Official League Communication
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;