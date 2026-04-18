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
import { 
  Mail, Trash2, CheckCircle, Clock, ExternalLink, 
  MessageSquare, User, Tag, Loader2 
} from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const msgData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setMessages(msgData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (msg) => {
    const subject = encodeURIComponent(`Re: ${msg.subject || 'Inquiry'} - St. Jerome League`);
    const mailtoUrl = `mailto:${msg.email}?subject=${subject}`;
    window.location.href = mailtoUrl;
    if (msg.status === 'unread') markAsRead(msg.id);
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "messages", id), { status: 'read' });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this message permanently?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(prev => prev.filter(m => m.id !== id));
      } catch (error) {
        alert("Error deleting message");
      }
    }
  };

  return (
    <div className="inbox-manager" style={{ color: '#0f172a', maxWidth: '800px', margin: '0 auto', padding: '10px' }}>
      <style>{`
        .message-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          position: relative;
        }
        .message-card.unread {
          border: 2px solid #1e40af;
          background: #f8fbff;
        }
        .unread-indicator {
          position: absolute;
          top: -10px;
          left: 16px;
          background: #facc15;
          color: #1e40af;
          padding: 2px 10px;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          border: 1.5px solid #1e40af;
        }
        .msg-meta {
          font-size: 0.75rem;
          color: #64748b;
          margin-bottom: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .msg-body {
          color: #334155;
          line-height: 1.4;
          font-size: 0.85rem;
          background: #f8fafc;
          padding: 12px;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          margin-top: 8px;
          white-space: pre-wrap;
        }
        .reply-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1e40af;
          color: white;
          border: none;
          font-weight: 700;
          font-size: 0.75rem;
          margin-top: 12px;
          padding: 8px 16px;
          border-radius: 8px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .action-column {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .circle-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          border: none;
          cursor: pointer;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile Specific Optimization */
        @media (max-width: 600px) {
          .message-card {
            padding: 12px;
            grid-template-columns: 1fr;
          }
          .action-column {
            flex-direction: row;
            justify-content: flex-end;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
          }
          .msg-body {
            font-size: 0.8rem;
          }
        }
      `}</style>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto', color: '#1e40af' }} />
          <p style={{ marginTop: '10px', fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>SYNCING...</p>
        </div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
          <MessageSquare size={32} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
          <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.9rem' }}>No messages found.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`message-card ${msg.status === 'unread' ? 'unread' : ''}`}>
            {msg.status === 'unread' && <div className="unread-indicator">New</div>}
            
            <div style={{ textAlign: 'left' }}>
              <div className="msg-meta">
                <span className="meta-item" style={{ color: '#1e40af', fontWeight: 700 }}>
                  <User size={14}/> {msg.name?.toUpperCase() || 'GUEST'}
                </span>
                <span className="meta-item"><Mail size={14}/> {msg.email}</span>
                <span className="meta-item"><Clock size={14}/> 
                  {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'Recent'}
                </span>
              </div>
              
              <h4 style={{ margin: '0 0 4px 0', textTransform: 'uppercase', color: '#0f172a', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={14} style={{ color: '#facc15' }} />
                {msg.subject || 'No Subject'}
              </h4>

              <div className="msg-body">{msg.message}</div>
              
              <button 
                className="reply-btn"
                onClick={() => handleReply(msg)}
              >
                Reply <ExternalLink size={12} />
              </button>
            </div>

            <div className="action-column">
              <button 
                onClick={() => markAsRead(msg.id)}
                className="circle-btn"
                style={{ background: msg.status === 'unread' ? '#facc15' : '#f1f5f9', color: '#1e40af' }}
              >
                <CheckCircle size={18} />
              </button>
              
              <button 
                onClick={() => handleDelete(msg.id)}
                className="circle-btn"
                style={{ background: '#fee2e2', color: '#ef4444' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ContactMessages;