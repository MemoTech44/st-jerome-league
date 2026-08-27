import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { 
  Mail, Phone, MapPin, Send, 
  CheckCircle, Loader2, ShieldCheck, MessageSquare, ChevronDown
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    customSubject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Custom dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const subjectOptions = [
    'General Inquiry',
    'Team Registration',
    'Sponsorship',
    'Other'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-fill subject if passed via URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramSubject = params.get('subject');
    if (paramSubject) {
      if (subjectOptions.includes(paramSubject)) {
        setFormData((prev) => ({ ...prev, subject: paramSubject }));
      } else {
        setFormData((prev) => ({ 
          ...prev, 
          subject: 'Other', 
          customSubject: paramSubject 
        }));
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalSubject = formData.subject === 'Other' 
      ? (formData.customSubject.trim() || 'General Inquiry')
      : formData.subject;

    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        subject: finalSubject,
        message: formData.message,
        createdAt: serverTimestamp(),
        status: 'unread'
      });
      setSubmitted(true);
      setFormData({ 
        name: '', 
        email: '', 
        subject: 'General Inquiry', 
        customSubject: '', 
        message: '' 
      });
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .c-page { 
          background-color: #04060d; 
          min-height: 100vh; 
          padding: 120px 5% 80px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #f8fafc;
          box-sizing: border-box;
        }
        .container { max-width: 1100px; margin: 0 auto; }
        .gold-text { color: #facc15; }
        
        .header-box { text-align: center; margin-bottom: 50px; }

        .header-tag {
          font-family: 'Cinzel', serif;
          color: #facc15;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .header-box h1 { 
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3rem, 7vw, 4.8rem); 
          color: #ffffff; 
          letter-spacing: 2px; 
          margin: 0 0 10px 0; 
          line-height: 1;
        }

        .header-description {
          max-width: 650px;
          margin: 0 auto;
          font-size: 0.95rem;
          line-height: 1.6;
          color: #94a3b8;
          font-weight: 500;
        }

        .contact-grid { 
          display: grid; 
          grid-template-columns: 0.85fr 1.15fr; 
          gap: 30px; 
        }

        .info-stack { display: flex; flex-direction: column; gap: 16px; }
        
        .info-card { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          padding: 24px; 
          border-radius: 20px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          display: flex; 
          align-items: center; 
          gap: 18px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .info-card:hover { 
          transform: translateY(-4px); 
          border-color: rgba(250, 204, 21, 0.4); 
          background: rgba(15, 23, 42, 0.85);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .icon-box { 
          width: 48px; 
          height: 48px; 
          background: rgba(250, 204, 21, 0.1); 
          border-radius: 14px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #facc15; 
          border: 1px solid rgba(250, 204, 21, 0.2);
          flex-shrink: 0;
        }

        .info-label {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 2px 0;
          font-weight: 700;
        }

        .info-value {
          margin: 0;
          font-weight: 700;
          color: #ffffff;
          font-size: 1.05rem;
        }

        .notice-card {
          padding: 20px; 
          background: rgba(250, 204, 21, 0.05); 
          border-radius: 18px; 
          display: flex; 
          gap: 14px; 
          align-items: center;
          border: 1px solid rgba(250, 204, 21, 0.15);
        }

        .form-card { 
          background: rgba(15, 23, 42, 0.6); 
          backdrop-filter: blur(12px);
          padding: 40px; 
          border-radius: 24px; 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .input-group { margin-bottom: 22px; position: relative; }
        .input-group label { 
          display: block; 
          font-family: 'Cinzel', serif;
          font-size: 0.7rem; 
          font-weight: 700; 
          color: #facc15; 
          margin-bottom: 8px; 
          text-transform: uppercase; 
          letter-spacing: 1px;
        }
        
        .c-input { 
          width: 100%; 
          background: rgba(4, 6, 13, 0.6); 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          padding: 14px 16px; 
          border-radius: 12px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          font-weight: 600; 
          outline: none; 
          transition: all 0.3s ease; 
          color: #ffffff;
          box-sizing: border-box;
          font-size: 0.95rem;
        }

        .c-input:focus { 
          border-color: #facc15; 
          background: rgba(4, 6, 13, 0.9);
          box-shadow: 0 0 15px rgba(250, 204, 21, 0.15);
        }

        /* Custom Dropdown Styling */
        .custom-select-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          user-select: none;
        }

        .custom-options-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #090d16;
          border: 1px solid rgba(250, 204, 21, 0.3);
          border-radius: 12px;
          overflow: hidden;
          z-index: 50;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
        }

        .custom-option {
          padding: 12px 16px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .custom-option:hover {
          background: rgba(250, 204, 21, 0.15);
          color: #facc15;
        }

        .custom-option.selected {
          background: rgba(250, 204, 21, 0.2);
          color: #ffffff;
        }

        .c-btn { 
          width: 100%; 
          padding: 16px; 
          background: #facc15; 
          border: none; 
          border-radius: 12px; 
          color: #04060d; 
          font-weight: 800; 
          font-size: 0.85rem;
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 10px; 
          transition: all 0.3s ease; 
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .c-btn:hover:not(:disabled) { 
          background: #ffe066; 
          transform: translateY(-2px); 
          box-shadow: 0 6px 20px rgba(250, 204, 21, 0.25);
        }

        .c-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-box {
          text-align: center; 
          padding: 40px 20px;
        }

        .success-box h2 {
          font-family: 'Bebas Neue', cursive;
          font-size: 2.5rem;
          letter-spacing: 1px;
          margin: 10px 0 5px;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .c-page { padding-top: 100px; }
          .contact-grid { grid-template-columns: 1fr; }
          .form-card { padding: 30px 20px; }
        }
      `}</style>

      <div className="c-page">
        <div className="container">
          <header className="header-box">
            <span className="header-tag">Direct Communication</span>
            <h1>GET IN <span className="gold-text">TOUCH</span></h1>
            <p className="header-description">
              Have questions about team registration, match fixtures, or partnership opportunities? 
              Reach out directly to the St. Jerome Alumni League committee.
            </p>
          </header>

          <div className="contact-grid">
            <div className="info-stack">
              <div className="info-card">
                <div className="icon-box"><Mail size={22}/></div>
                <div>
                  <h4 className="info-label">Email Us</h4>
                  <p className="info-value">stjeromeleague@gmail.com</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="icon-box"><Phone size={22}/></div>
                <div>
                  <h4 className="info-label">Call Us</h4>
                  <p className="info-value">+256 773 720625</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-box"><MapPin size={22}/></div>
                <div>
                  <h4 className="info-label">Location</h4>
                  <p className="info-value">Kampala, Uganda</p>
                </div>
              </div>

              <div className="notice-card">
                <MessageSquare size={22} color="#facc15" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                  Typical response time: <span style={{ color: '#ffffff' }}>Within 24 hours.</span>
                </p>
              </div>
            </div>

            <div className="form-card">
              {submitted ? (
                <div className="success-box">
                  <CheckCircle size={56} color="#10b981" style={{ margin: '0 auto 15px' }} />
                  <h2>MESSAGE SENT!</h2>
                  <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.95rem' }}>
                    We've received your inquiry and will respond shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="c-btn" 
                    style={{ marginTop: '25px', background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="c-input" 
                      placeholder="e.g. John Doe"
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
                      placeholder="name@example.com"
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      required 
                    />
                  </div>

                  {/* Custom Dropdown Container */}
                  <div className="input-group" ref={dropdownRef}>
                    <label>Subject</label>
                    <div 
                      className="c-input custom-select-trigger"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span>
                        {formData.subject === 'Other' ? 'Other / Custom Subject' : formData.subject}
                      </span>
                      <ChevronDown 
                        size={18} 
                        color="#facc15" 
                        style={{ 
                          transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }} 
                      />
                    </div>

                    {dropdownOpen && (
                      <div className="custom-options-menu">
                        {subjectOptions.map((opt) => (
                          <div 
                            key={opt}
                            className={`custom-option ${formData.subject === opt ? 'selected' : ''}`}
                            onClick={() => {
                              setFormData({ ...formData, subject: opt });
                              setDropdownOpen(false);
                            }}
                          >
                            {opt === 'Other' ? 'Other / Custom Subject' : opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {formData.subject === 'Other' && (
                    <div className="input-group">
                      <label>Custom Subject Title</label>
                      <input 
                        type="text" 
                        className="c-input" 
                        placeholder="Please specify your subject"
                        value={formData.customSubject} 
                        onChange={(e) => setFormData({...formData, customSubject: e.target.value})} 
                        required 
                      />
                    </div>
                  )}

                  <div className="input-group">
                    <label>Your Message</label>
                    <textarea 
                      className="c-input" 
                      style={{ height: '120px', resize: 'none' }} 
                      placeholder="How can we help you?"
                      value={formData.message} 
                      onChange={(e) => setFormData({...formData, message: e.target.value})} 
                      required
                    ></textarea>
                  </div>

                  <button className="c-btn" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Send Message <Send size={16} /></>}
                  </button>
                  
                  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                     <ShieldCheck size={14} color="#facc15" /> Official League Communication
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