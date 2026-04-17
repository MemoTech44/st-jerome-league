import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Mail, Phone, MapPin, Send, Clock, 
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

        .c-page { 
          background-color: #f8fafc; 
          min-height: 100vh; 
          padding: 140px 5% 100px; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          color: #0f172a;
        }
        .c-container { 
          max-width: 1200px; 
          margin: 0 auto; 
          display: grid; 
          grid-template-columns: 0.9fr 1.1fr; 
          gap: 80px; 
          align-items: center; 
        }
        
        .c-title { 
          font-family: 'Inter', sans-serif; 
          font-size: clamp(3rem, 6vw, 4.5rem); 
          font-weight: 900; 
          letter-spacing: -4px; 
          line-height: 0.9; 
          margin-bottom: 30px; 
        }
        .accent-blue { color: #1e40af; }
        
        .c-lead { 
          color: #64748b; 
          font-size: 1.2rem; 
          font-weight: 500; 
          line-height: 1.8; 
          margin-bottom: 50px; 
          max-width: 500px;
        }

        .info-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .info-card { 
          background: white; 
          padding: 24px; 
          border-radius: 24px; 
          display: flex; 
          align-items: center; 
          gap: 20px;
          border: 1px solid #e2e8f0; 
          transition: all 0.3s ease; 
        }
        .info-card:hover { transform: translateX(10px); border-color: #1e40af; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
        
        .icon-box { 
          width: 56px; 
          height: 56px; 
          background: #eff6ff; 
          border-radius: 16px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #1e40af; 
        }

        .form-box { 
          background: white; 
          padding: 60px; 
          border-radius: 40px; 
          border: 1px solid #e2e8f0; 
          box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.08); 
        }
        
        .input-group { margin-bottom: 25px; }
        .input-group label { 
          display: block; 
          font-size: 0.85rem; 
          font-weight: 800; 
          color: #1e40af; 
          margin-bottom: 10px; 
          text-transform: uppercase; 
          letter-spacing: 1px;
        }
        
        .c-input { 
          width: 100%; 
          background: #f8fafc; 
          border: 2px solid #f1f5f9; 
          padding: 18px; 
          border-radius: 18px; 
          font-family: inherit; 
          font-weight: 600; 
          outline: none; 
          transition: 0.3s; 
          color: #0f172a;
        }
        .c-input:focus { 
          border-color: #1e40af; 
          background: white; 
          box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1); 
        }

        .c-btn { 
          width: 100%; 
          padding: 20px; 
          background: #1e40af; 
          border: none; 
          border-radius: 20px; 
          color: white; 
          font-weight: 800; 
          font-size: 1rem;
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 12px; 
          transition: 0.4s; 
          box-shadow: 0 10px 20px rgba(30, 64, 175, 0.2);
        }
        .c-btn:hover { background: #1e3a8a; transform: translateY(-3px); }
        .c-btn:disabled { background: #94a3b8; transform: none; }

        .trust-badge {
          margin-top: 30px;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 600;
        }

        @media (max-width: 1000px) {
          .c-container { grid-template-columns: 1fr; gap: 50px; }
          .form-box { padding: 40px 25px; }
          .c-title { font-size: 3.5rem; }
        }
      `}</style>

      <div className="c-page">
        <div className="c-container">
          
          <div className="c-info-side">
            <h1 className="c-title">Get in <br/><span className="accent-blue">The Arena.</span></h1>
            <p className="c-lead">
              Official communication channel for the St. Jerome League. Reach out for registration, fixtures, or alumni partnership inquiries.
            </p>

            <div className="info-grid">
              <div className="info-card">
                <div className="icon-box"><Mail size={24}/></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Email Support</h4>
                  <p style={{ margin: '4px 0 0', fontWeight: 800 }}>info@stjeromeleague.com</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="icon-box"><Phone size={24}/></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>Direct Line</h4>
                  <p style={{ margin: '4px 0 0', fontWeight: 800 }}>+256 700 123 456</p>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-box"><MapPin size={24}/></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>League Office</h4>
                  <p style={{ margin: '4px 0 0', fontWeight: 800 }}>Kampala, Uganda</p>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '40px', padding: '20px', background: '#f1f5f9', borderRadius: '20px', display: 'flex', gap: '15px' }}>
               <MessageSquare className="text-blue-800" />
               <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                 Looking for match results or standings? Visit the <strong>Match Centre</strong> on the home page.
               </p>
            </div>
          </div>

          <div className="form-box">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '80px', height: '80px', background: '#ecfdf5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                  <CheckCircle size={40} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>Message Sent!</h2>
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}>
                  Thank you for reaching out. The committee will get back to you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="c-btn" 
                  style={{ marginTop: '40px', background: '#f1f5f9', color: '#1e40af', boxShadow: 'none' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="c-input" 
                      placeholder="Enter name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      className="c-input" 
                      placeholder="Enter email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Inquiry Type</label>
                  <select 
                    className="c-input" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>General Inquiry</option>
                    <option>Player Registration</option>
                    <option>Team Sponsorship</option>
                    <option>Media & Press</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Message</label>
                  <textarea 
                    className="c-input" 
                    style={{ height: '140px', resize: 'none' }} 
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button className="c-btn" disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>SEND MESSAGE <Send size={20} /></>
                  )}
                </button>
                
                <div className="trust-badge">
                   <ShieldCheck size={18} />
                   <span>Secure official communication channel</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;