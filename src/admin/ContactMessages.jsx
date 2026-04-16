import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  updateDoc 
} from 'firebase/firestore';
import { Mail, Trash2, CheckCircle, Clock, ExternalLink, MessageSquare, User, Tag } from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const msgData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "messages", id), { status: 'read' });
      fetchMessages();
    } catch (error) {
      alert("Error updating message status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this message permanently?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        fetchMessages();
      } catch (error) {
        alert("Error deleting message");
      }
    }
  };

  return (
    <div className="inbox-manager" style={{ color: '#0f172a' }}>
      <style>{`
        .message-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          transition: transform 0.2s, box-shadow 0.2s;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          position: relative;
        }
        .message-card.unread {
          border: 2px solid #1e40af;
          background: #f0f7ff;
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
        }
        .unread-indicator {
          position: absolute;
          top: -10px;
          left: 20px;
          background: #facc15;
          color: #0f172a;
          padding: 2px 12px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          border: 2px solid #1e40af;
        }
        .msg-meta {
          font-size: 0.8rem;
          color: #475569;
          margin-bottom: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
        }
        .msg-body {
          color: #1e293b;
          line-height: 1.6;
          font-size: 0.95rem;
          background: #ffffff;
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-top: 12px;
          white-space: pre-wrap;
        }
        .reply-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1e40af;
          color: white;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.8rem;
          margin-top: 15px;
          padding: 10px 20px;
          border-radius: 6px;
          text-transform: uppercase;
          transition: background 0.2s;
        }
        .reply-btn:hover {
          background: #1e3a8a;
          color: #facc15;
        }
        .action-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .circle-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
      `}</style>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', margin: 0, color: '#1e40af', fontSize: '1.5rem' }}>League Inbox</h3>
        <p style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>Manage inquiries and feedback from the community.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Loader2 className="animate-spin" style={{ margin: '0 auto', color: '#1e40af' }} />
        </div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '2px dashed #cbd5e1' }}>
          <MessageSquare size={48} color="#cbd5e1" style={{ margin: '0 auto 15px' }} />
          <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.1rem' }}>Your inbox is currently empty.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`message-card ${msg.status === 'unread' ? 'unread' : ''}`}>
            {msg.status === 'unread' && <div className="unread-indicator">New Message</div>}
            
            <div>
              <div className="msg-meta">
                <span className="meta-item" style={{ color: '#1e40af' }}><User size={14}/> {msg.name.toUpperCase()}</span>
                <span className="meta-item"><Mail size={14}/> {msg.email}</span>
                <span className="meta-item"><Clock size={14}/> {msg.createdAt ? msg.createdAt.toDate().toLocaleString() : 'Just now'}</span>
              </div>
              
              <h4 style={{ margin: '0 0 10px 0', fontFamily: 'Archivo', textTransform: 'uppercase', color: '#0f172a', fontSize: '1.1rem' }}>
                <Tag size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#facc15' }} />
                {msg.subject}
              </h4>

              <div className="msg-body">{msg.message}</div>
              
              <a 
                href={`mailto:${msg.email}?subject=Re: ${msg.subject} - St. Jerome League`} 
                className="reply-btn"
                onClick={() => msg.status === 'unread' && markAsRead(msg.id)}
              >
                Send Reply <ExternalLink size={14} />
              </a>
            </div>

            <div className="action-column">
              {msg.status === 'unread' ? (
                <button 
                  onClick={() => markAsRead(msg.id)}
                  className="circle-btn"
                  style={{ background: '#facc15', color: '#0f172a' }}
                  title="Mark as Read"
                >
                  <CheckCircle size={22} />
                </button>
              ) : (
                <div className="circle-btn" style={{ background: '#f1f5f9', color: '#94a3b8', cursor: 'default' }}>
                  <CheckCircle size={22} />
                </div>
              )}
              
              <button 
                onClick={() => handleDelete(msg.id)}
                className="circle-btn"
                style={{ background: '#fee2e2', color: '#ef4444' }}
                title="Delete Message"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContactMessages;