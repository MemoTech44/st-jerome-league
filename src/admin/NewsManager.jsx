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
import { Trash2, Image as ImageIcon, Loader2, Plus, X, Newspaper, Edit3, Eye, EyeOff } from 'lucide-react';

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

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const newsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNews(newsData);
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

      // Upload new image if selected
      if (image) {
        const imageRef = ref(storage, `news/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (editingId) {
        // UPDATE EXISTING
        await updateDoc(doc(db, "news", editingId), {
          title,
          content,
          imageUrl,
          updatedAt: serverTimestamp(),
        });
        alert("Article updated!");
      } else {
        // CREATE NEW
        await addDoc(collection(db, "news"), {
          title,
          content,
          imageUrl,
          createdAt: serverTimestamp(),
        });
        alert("Article published!");
      }

      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Failed to save article.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news post?")) {
      try {
        await deleteDoc(doc(db, "news", id));
        fetchNews();
      } catch (error) {
        alert("Error deleting news.");
      }
    }
  };

  return (
    <div className="news-manager" style={{ color: '#0f172a' }}>
      <style>{`
        .news-form { background: #ffffff; padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #1e40af; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .news-form label { font-size: 0.75rem; font-weight: 800; color: #1e40af; text-transform: uppercase; margin-bottom: 5px; display: block; }
        .news-form input, .news-form textarea { padding: 14px; border: 2px solid #f1f5f9; border-radius: 8px; font-family: 'Inter', sans-serif; background: #f8fafc; color: #0f172a; outline: none; width: 100%; margin-bottom: 15px; }
        .news-form input:focus { border-color: #facc15; }
        .file-upload-zone { border: 2px dashed #cbd5e1; padding: 20px; border-radius: 8px; text-align: center; background: #f8fafc; cursor: pointer; color: #64748b; margin-bottom: 15px; }
        .news-item { background: white; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 15px; overflow: hidden; }
        .news-item-header { display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; }
        .action-btn { background: #f1f5f9; border: none; padding: 8px; borderRadius: 6px; cursor: pointer; color: #64748b; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .action-btn:hover { background: #e2e8f0; color: #0f172a; }
        .btn-publish { background: #1e40af; color: white; padding: 15px; border: none; border-radius: 8px; font-weight: 900; cursor: pointer; text-transform: uppercase; width: 100%; }
        .view-content { padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', margin: 0 }}>Newsroom Manager</h3>
        <button 
          onClick={() => isAdding ? resetForm() : setIsAdding(true)}
          style={{ background: isAdding ? '#ef4444' : '#facc15', color: isAdding ? 'white' : '#0f172a', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isAdding ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Article</>}
        </button>
      </div>

      {isAdding && (
        <form className="news-form" onSubmit={handlePostNews}>
          <h4 style={{ margin: '0 0 20px 0', color: '#1e40af' }}>{editingId ? 'Edit Article' : 'Create New Article'}</h4>
          
          <label>Headline</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          
          <label>Content</label>
          <textarea rows="8" value={content} onChange={(e) => setContent(e.target.value)} required />
          
          <label>Article Image</label>
          <div className="file-upload-zone" onClick={() => document.getElementById('newsImg').click()}>
             <ImageIcon size={20} />
             <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem' }}>
               {image ? `New: ${image.name}` : existingImageUrl ? "Change current image" : "Click to upload image"}
             </p>
             <input id="newsImg" type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <button className="btn-publish" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : editingId ? "Update Article" : "Publish Article"}
          </button>
        </form>
      )}

      <div className="news-list">
        {news.map((item) => (
          <div key={item.id} className="news-item">
            <div className="news-item-header">
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontFamily: 'Archivo' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>
                    {item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'Drafting...'}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="action-btn" onClick={() => setViewingId(viewingId === item.id ? null : item.id)}>
                  {viewingId === item.id ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button className="action-btn" onClick={() => handleEditClick(item)} style={{ color: '#1e40af' }}>
                  <Edit3 size={18} />
                </button>
                <button className="action-btn" onClick={() => handleDelete(item.id)} style={{ color: '#ef4444' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {viewingId === item.id && (
              <div className="view-content">
                <div style={{ fontWeight: 800, color: '#1e40af', marginBottom: '10px', fontSize: '0.7rem', textTransform: 'uppercase' }}>Previewing Content:</div>
                {item.content}
                {item.imageUrl && (
                    <img src={item.imageUrl} alt="preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', marginTop: '15px', borderRadius: '8px' }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsManager;