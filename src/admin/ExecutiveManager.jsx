import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, UserPlus, Loader2, Camera, UserCircle } from 'lucide-react';

const ExecutiveManager = () => {
  const [members, setMembers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Note: Changed to "members" to match your About page query
      const q = query(collection(db, "members"), orderBy("name", "asc"));
      const querySnapshot = await getDocs(q);
      const memberData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(memberData);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `executives/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "members"), {
        name,
        position,
        imageUrl,
        createdAt: new Date()
      });

      setName('');
      setPosition('');
      setImage(null);
      setIsAdding(false);
      fetchMembers();
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add executive member.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this person from the Executive Board?")) {
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
        .exec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 25px;
          margin-top: 20px;
        }
        .exec-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          text-align: center;
          transition: 0.3s;
          color: #0f172a;
        }
        .exec-card:hover { border-color: #1e40af; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .exec-photo {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 15px;
          border: 4px solid #f8fafc;
        }
        .exec-form {
          background: white;
          padding: 30px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
          display: grid;
          gap: 15px;
          color: #0f172a;
        }
        .input-field {
          padding: 12px;
          border: 2px solid #f1f5f9;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          color: #0f172a;
        }
        .file-label {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          cursor: pointer;
          color: #64748b;
          font-size: 0.9rem;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', margin: 0, color: '#0f172a' }}>Executive Board</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ 
            background: isAdding ? '#ef4444' : '#1e40af', 
            color: 'white', // Fixed: Added quotes
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer' 
          }}
        >
          {isAdding ? "Cancel" : <><UserPlus size={18} /> Add Member</>}
        </button>
      </div>

      {isAdding && (
        <form className="exec-form" onSubmit={handleAddMember}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input 
              className="input-field"
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <input 
              className="input-field"
              type="text" 
              placeholder="Position (e.g. Chairman)" 
              value={position} 
              onChange={(e) => setPosition(e.target.value)} 
              required 
            />
          </div>
          
          <label className="file-label">
            <Camera size={20} />
            {image ? image.name : "Upload Profile Photo"}
            <input 
              type="file" 
              hidden 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files[0])} 
            />
          </label>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#1e40af', 
              color: 'white', 
              padding: '15px', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '900', 
              fontFamily: 'Archivo', 
              cursor: 'pointer', 
              textTransform: 'uppercase' 
            }}
          >
            {loading ? <Loader2 className="animate-spin" style={{margin: '0 auto'}} /> : "Save Board Member"}
          </button>
        </form>
      )}

      <div className="exec-grid">
        {members.map((member) => (
          <div key={member.id} className="exec-card">
            {member.imageUrl ? (
              <img src={member.imageUrl} alt={member.name} className="exec-photo" />
            ) : (
              <div className="exec-photo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                <UserCircle size={60} color="#cbd5e1" />
              </div>
            )}
            <h4 style={{ fontFamily: 'Archivo', textTransform: 'uppercase', margin: '0 0 5px 0', fontSize: '1.1rem', color: '#0f172a' }}>{member.name}</h4>
            <p style={{ color: '#1e40af', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', margin: 0 }}>{member.position}</p>
            
            <button 
              onClick={() => handleDelete(member.id)}
              style={{ marginTop: '15px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', transition: '0.2s' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {members.length === 0 && !loading && (
          <p style={{ color: '#64748b', textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>No board members added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExecutiveManager;