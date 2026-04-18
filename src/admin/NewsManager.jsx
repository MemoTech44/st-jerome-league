import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  updateDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  Plus, 
  X, 
  Edit3, 
  Eye, 
  EyeOff, 
  Send, 
  Clock, 
  FileText,
  Newspaper // Fixed: Added the missing import here
} from 'lucide-react';

const NewsManager = () => {
  const [news, setNews] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const COLORS = {
    blue: '#1e40af',
    yellow: '#facc15',
    slate: '#64748b',
    lightGray: '#f1f5f9',
    white: '#ffffff',
    danger: '#ef4444',
    dark: '#0f172a'
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const newsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setExistingImageUrl(item.imageUrl || '');
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImage(null);
    setExistingImageUrl('');
    setEditingId(null);
    setIsAdding(false);
  };

  const handlePostNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = existingImageUrl;
      if (image) {
        const imageRef = ref(storage, `news/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (editingId) {
        await updateDoc(doc(db, "news", editingId), {
          title, content, imageUrl, updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "news"), {
          title, content, imageUrl, createdAt: serverTimestamp(),
        });
      }
      resetForm();
      fetchNews();
    } catch (error) {
      console.error(error);
      alert("Error saving article.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this news post?")) {
      try {
        await deleteDoc(doc(db, "news", id));
        fetchNews();
      } catch (error) { alert("Error deleting."); }
    }
  };

  return (
    <div className="news-container">
      <style>{`
        .news-container { animation: fadeIn 0.5s ease; padding-bottom: 50px; }
        .editor-card { 
          background: white; border-radius: 30px; padding: 40px; 
          border: 1px solid #eef2f6; box-shadow: 0 20px 40px rgba(0,0,0,0.03);
          margin-bottom: 50px; text-align: left;
        }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .input-group label { 
          display: flex; align-items: center; gap: 8px; font-weight: 800; 
          color: ${COLORS.blue}; font-size: 0.75rem; text-transform: uppercase; 
          margin-bottom: 10px; letter-spacing: 1px;
        }
        .custom-input { 
          width: 100%; padding: 16px; border-radius: 15px; border: 2px solid ${COLORS.lightGray};
          background: #f8fafc; font-family: 'Inter'; font-size: 1rem; transition: 0.3s;
          outline: none; box-sizing: border-box;
        }
        .custom-input:focus { border-color: ${COLORS.yellow}; background: white; }
        .upload-trigger {
          border: 2px dashed ${COLORS.slate}; border-radius: 20px; padding: 30px;
          text-align: center; cursor: pointer; transition: 0.3s; background: #f8fafc;
        }
        .upload-trigger:hover { border-color: ${COLORS.blue}; background: #eff6ff; }
        .news-feed { display: flex; flex-direction: column; gap: 20px; }
        .article-card { 
          background: white; border-radius: 25px; border: 1px solid #eef2f6;
          padding: 20px; transition: 0.3s; display: flex; flex-direction: column;
        }
        .article-card:hover { border-color: ${COLORS.blue}; transform: translateX(5px); }
        .article-main { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .article-thumb { width: 80px; height: 80px; border-radius: 18px; object-fit: cover; background: #eee; }
        .action-tray { display: flex; gap: 10px; }
        .icon-btn { 
          width: 45px; height: 45px; border-radius: 12px; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.2s;
        }
        .btn-view { background: #eff6ff; color: ${COLORS.blue}; }
        .btn-edit { background: #fefce8; color: #854d0e; }
        .btn-del { background: #fef2f2; color: ${COLORS.danger}; }
        .publish-btn {
          background: ${COLORS.blue}; color: white; padding: 18px; border-radius: 16px;
          border: none; font-weight: 800; font-size: 1rem; text-transform: uppercase;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 10px 20px rgba(30,64,175,0.2);
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .article-main { flex-direction: column; align-items: flex-start; }
          .article-thumb { width: 100%; height: 150px; }
          .action-tray { width: 100%; justify-content: space-between; margin-top: 15px; }
        }
      `}</style>

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontFamily: 'Archivo', fontSize: '1.8rem', color: COLORS.blue, margin: 0 }}>League Newsroom</h3>
          <p style={{ color: COLORS.slate, fontWeight: 600, fontSize: '0.9rem' }}>{news.length} Articles Published</p>
        </div>
        <button 
          onClick={() => isAdding ? resetForm() : setIsAdding(true)}
          style={{ 
            background: isAdding ? COLORS.danger : COLORS.yellow, 
            color: isAdding ? 'white' : COLORS.dark,
            border: 'none', padding: '14px 28px', borderRadius: '15px', fontWeight: '900', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
            boxShadow: isAdding ? 'none' : '0 8px 15px rgba(250, 204, 21, 0.3)'
          }}
        >
          {isAdding ? <><X size={20} /> Close Editor</> : <><Plus size={20} /> Create Post</>}
        </button>
      </div>

      {/* Post Editor */}
      {isAdding && (
        <form className="editor-card" onSubmit={handlePostNews}>
          <div className="form-grid">
            <div className="input-group">
              <label><FileText size={16}/> Headline Title</label>
              <input 
                className="custom-input"
                placeholder="Enter a catchy headline..."
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label><Newspaper size={16}/> Article Body</label>
              <textarea 
                className="custom-input"
                rows="8" 
                placeholder="Write the full story here..."
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-group">
              <label><ImageIcon size={16}/> Featured Media</label>
              <div className="upload-trigger" onClick={() => document.getElementById('newsImg').click()}>
                 <ImageIcon size={24} color={COLORS.blue} style={{ marginBottom: '10px' }}/>
                 <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: COLORS.dark }}>
                   {image ? `Selected: ${image.name}` : existingImageUrl ? "Keep existing image" : "Drop image here or click to upload"}
                 </p>
                 <input id="newsImg" type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              </div>
            </div>

            <button className="publish-btn" disabled={loading} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : <><Send size={20}/> {editingId ? "Update Live Post" : "Publish to Public Feed"}</>}
            </button>
          </div>
        </form>
      )}

      {/* News Feed */}
      <div className="news-feed">
        {news.length === 0 ? (
          <div style={{ padding: '60px', background: '#f8fafc', borderRadius: '30px', color: COLORS.slate, fontWeight: 600 }}>
            No news articles found in the database.
          </div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="article-card">
              <div className="article-main">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
                  <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt="news" className="article-thumb" />
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontFamily: 'Archivo', color: COLORS.blue, lineHeight: 1.2 }}>{item.title}</h4>
                    <div style={{ display: 'flex', gap: '15px', color: COLORS.slate, fontSize: '0.8rem', fontWeight: 700 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {item.createdAt ? item.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Processing...'}</span>
                      <span style={{ color: COLORS.yellow }}>● League News</span>
                    </div>
                  </div>
                </div>
                
                <div className="action-tray">
                  <button className="icon-btn btn-view" title="Quick View" onClick={() => setViewingId(viewingId === item.id ? null : item.id)}>
                    {viewingId === item.id ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button className="icon-btn btn-edit" title="Edit" onClick={() => handleEditClick(item)}>
                    <Edit3 size={20} />
                  </button>
                  <button className="icon-btn btn-del" title="Delete" onClick={() => handleDelete(item.id)}>
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {viewingId === item.id && (
                <div style={{ 
                  marginTop: '20px', padding: '30px', background: '#f8fafc', 
                  borderRadius: '20px', textAlign: 'left', border: '1px solid #eef2f6',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>{item.content}</p>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="preview" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginTop: '20px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsManager;