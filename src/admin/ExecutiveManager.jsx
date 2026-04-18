import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  updateDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, UserPlus, Loader2, Camera, UserCircle, Edit3, X, Award } from 'lucide-react';

const ExecutiveManager = () => {
  const [members, setMembers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [rank, setRank] = useState(1); 
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  // Image Preview Logic
  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const fetchMembers = async () => {
    try {
      // Query without orderBy to ensure documents missing the 'rank' field still appear
      const q = query(collection(db, "members"));
      const querySnapshot = await getDocs(q);
      const memberData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Manual Sort: Rank 1 at top, missing ranks (99) at bottom
      const sortedData = memberData.sort((a, b) => {
        const rankA = a.rank !== undefined ? Number(a.rank) : 99;
        const rankB = b.rank !== undefined ? Number(b.rank) : 99;
        return rankA - rankB;
      });
      
      setMembers(sortedData);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member.id);
    setName(member.name);
    setPosition(member.position);
    setRank(member.rank || 1);
    setPreviewUrl(member.imageUrl);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = previewUrl;
      if (image) {
        const imageRef = ref(storage, `executives/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const data = { 
        name, 
        position, 
        rank: Number(rank), 
        imageUrl: imageUrl || "" 
      };

      if (editingId) {
        await updateDoc(doc(db, "members", editingId), data);
      } else {
        await addDoc(collection(db, "members"), { ...data, createdAt: new Date() });
      }

      // Reset
      setName(''); setPosition(''); setRank(1); setImage(null);
      setEditingId(null); setIsAdding(false);
      fetchMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      alert("Error saving member details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this person from the Executive Board?")) {
      try {
        await deleteDoc(doc(db, "members", id));
        fetchMembers();
      } catch (error) {
        alert("Error removing member.");
      }
    }
  };

  return (
    <div className="exec-manager">
      <style>{`
        .exec-manager {
          max-width: 1200px;
          margin: 0 auto;
          padding: 15px;
          font-family: 'Inter', sans-serif;
        }

        .section-header {
          background: #1e40af;
          color: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(30, 64, 175, 0.2);
        }

        .exec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .exec-card {
          background: white;
          padding: 30px 20px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .exec-card:hover {
          transform: translateY(-5px);
          border-color: #1e40af;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .rank-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: #eff6ff;
          color: #1e40af;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .exec-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 20px;
          border: 4px solid #1e40af;
          background: #f8fafc;
        }

        .exec-form {
          background: #f8fafc;
          padding: 25px;
          border-radius: 20px;
          border: 2px solid #1e40af;
          margin-bottom: 35px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .input-field {
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 1rem;
          background: white;
        }

        .preview-box {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin: 0 auto 10px;
          border: 3px dashed #cbd5e1;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Responsive Breakpoints */
        @media (max-width: 640px) {
          .section-header { flex-direction: column; gap: 15px; text-align: center; }
          .exec-grid { grid-template-columns: 1fr; }
          .input-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header Section */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Award size={32} />
          <h2 style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
            League Excom
          </h2>
        </div>
        <button 
          onClick={() => { if(isAdding) setEditingId(null); setIsAdding(!isAdding); }}
          style={{ 
            background: 'white', color: '#1e40af', border: 'none', 
            padding: '12px 24px', borderRadius: '10px', fontWeight: 'bold', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
          }}
        >
          {isAdding ? <><X size={18} /> Cancel</> : <><UserPlus size={18} /> Add Member</>}
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <form className="exec-form" onSubmit={handleSaveMember}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div className="preview-box">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserCircle size={60} color="#cbd5e1" />
              )}
            </div>
            <label style={{ 
              background: '#1e40af', color: 'white', padding: '8px 16px', 
              borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 
            }}>
              <Camera size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Choose Face Photo
              <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>

          <div className="input-row">
            <input className="input-field" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input-field" type="text" placeholder="Position (e.g. Chairman)" value={position} onChange={(e) => setPosition(e.target.value)} required />
          </div>

          <div className="input-row" style={{ alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af' }}>HIERARCHY RANK (1 = Top)</label>
              <input className="input-field" type="number" value={rank} onChange={(e) => setRank(e.target.value)} min="1" />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Smaller numbers appear first in the list.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              background: '#1e40af', color: 'white', padding: '16px', 
              border: 'none', borderRadius: '12px', fontWeight: '900', 
              cursor: 'pointer', textTransform: 'uppercase' 
            }}
          >
            {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : editingId ? "Update Executive Info" : "Save Board Member"}
          </button>
        </form>
      )}

      {/* Grid Display */}
      <div className="exec-grid">
        {members.map((member) => (
          <div key={member.id} className="exec-card">
            <div className="rank-badge">
              <Award size={14} /> RANK {member.rank || '--'}
            </div>
            
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => handleEdit(member)} 
                style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#1e40af' }}
              >
                <Edit3 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(member.id)} 
                style={{ background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {member.imageUrl ? (
              <img src={member.imageUrl} alt={member.name} className="exec-photo" />
            ) : (
              <div className="exec-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCircle size={70} color="#cbd5e1" />
              </div>
            )}
            
            <h4 style={{ margin: '0 0 5px 0', color: '#0f172a', fontWeight: 800, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              {member.name}
            </h4>
            <p style={{ color: '#1e40af', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', margin: 0 }}>
              {member.position}
            </p>
          </div>
        ))}
      </div>

      {members.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <UserCircle size={48} style={{ margin: '0 auto 10px' }} />
          <p>No board members added to the database yet.</p>
        </div>
      )}
    </div>
  );
};

export default ExecutiveManager;