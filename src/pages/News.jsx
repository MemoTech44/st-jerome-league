import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { 
  Clock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Shield,
  X,
  Calendar,
  Tag
} from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsQuery = query(collection(db, "news"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(newsQuery);
        const newsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }) || "Recently Posted"
        }));
        setArticles(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const featured = articles[0];
  const regular = articles.slice(1);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      setSelectedArticle(null);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <Loader2 className="animate-spin" size={48} color="#1e40af" />
        <p style={{ marginTop: '20px', fontWeight: 700, color: '#64748b' }}>Loading Pulse...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800;900&display=swap');

        .news-page { background-color: #f1f5f9; padding: 120px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1100px; margin: 0 auto; }
        
        /* HIDE SCROLLBARS */
        .modal-content::-webkit-scrollbar { display: none; }
        .modal-content { -ms-overflow-style: none; scrollbar-width: none; }

        .news-title { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; letter-spacing: -2px; color: #0f172a; margin: 0; }

        .featured-hero { display: grid; grid-template-columns: 1.1fr 0.9fr; background: white; border-radius: 35px; overflow: hidden; margin-bottom: 50px; border: 1px solid #e2e8f0; cursor: pointer; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); }
        .featured-img-box { height: 450px; background: #0f172a; }
        .featured-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .featured-text { padding: 50px; display: flex; flex-direction: column; justify-content: center; }

        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; }
        .standard-card { background: white; border-radius: 28px; overflow: hidden; border: 1px solid #e2e8f0; transition: all 0.3s ease; display: flex; flex-direction: column; cursor: pointer; }
        .standard-card:hover { transform: translateY(-8px); border-color: #1e40af; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1); }
        .card-img-box { height: 220px; overflow: hidden; }
        .card-img-box img { width: 100%; height: 100%; object-fit: cover; }
        .card-body { padding: 30px; flex-grow: 1; }

        .tag-pill { background: #eff6ff; color: #1e40af; padding: 6px 14px; border-radius: 10px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 15px; width: fit-content; border: 1px solid #dbeafe; }

        /* MODAL CENTERING & SMOOTHING */
        .modal-backdrop {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(10px);
          z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          width: 100%; max-width: 700px;
          max-height: 85vh;
          border-radius: 32px;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.4);
          animation: popScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-close-top {
          position: absolute; top: 20px; right: 20px;
          background: rgba(255, 255, 255, 0.9); border: none; width: 40px; height: 40px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 100; border: 1px solid #e2e8f0;
        }

        .modal-image { width: 100%; height: 320px; object-fit: cover; }
        .modal-body { padding: 40px; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popScale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        @media (max-width: 850px) {
          .featured-hero { grid-template-columns: 1fr; border-radius: 28px; }
          .featured-img-box { height: 250px; }
          .featured-text { padding: 30px; }
          .modal-content { max-height: 90vh; border-radius: 24px; }
          .modal-body { padding: 25px; }
          .news-page { padding-top: 100px; }
        }
      `}</style>

      <div className="news-page">
        <div className="container">
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1e40af', marginBottom: '8px' }}>
              <Shield size={16} />
              <span style={{ fontWeight: 800, fontSize: '0.7rem', letterSpacing: '2px', textTransform: 'uppercase' }}>St. Jerome Press</span>
            </div>
            <h1 className="news-title">League <span style={{color: '#1e40af'}}>Pulse</span></h1>
          </div>

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
              <AlertCircle size={50} color="#cbd5e1" style={{ margin: '0 auto 15px' }} />
              <h3 style={{ fontWeight: 800, color: '#64748b' }}>No stories posted yet.</h3>
            </div>
          ) : (
            <>
              <div className="featured-hero" onClick={() => setSelectedArticle(featured)}>
                <div className="featured-img-box">
                  <img src={featured.image || featured.imageUrl} alt={featured.title} />
                </div>
                <div className="featured-text">
                  <div className="tag-pill">Latest Headlines</div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '0 0 15px 0', lineHeight: 1.2 }}>{featured.title}</h2>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '25px' }}>
                    {featured.excerpt || featured.content?.substring(0, 140) + "..."}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>
                    <Calendar size={14}/> {featured.date}
                  </div>
                </div>
              </div>

              <div className="news-grid">
                {regular.map((article) => (
                  <div key={article.id} className="standard-card" onClick={() => setSelectedArticle(article)}>
                    <div className="card-img-box">
                      <img src={article.image || article.imageUrl} alt={article.title} />
                    </div>
                    <div className="card-body">
                      <div className="tag-pill">{article.category || "Updates"}</div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.4 }}>{article.title}</h3>
                      <div style={{ color: '#1e40af', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Read full story <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedArticle && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <button className="modal-close-top" onClick={() => setSelectedArticle(null)}>
              <X size={20} color="#0f172a" />
            </button>
            
            <img 
              src={selectedArticle.image || selectedArticle.imageUrl} 
              className="modal-image" 
              alt={selectedArticle.title} 
            />
            
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <span className="tag-pill" style={{ margin: 0 }}>{selectedArticle.category || "News"}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> {selectedArticle.date}
                </span>
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2, marginBottom: '25px' }}>
                {selectedArticle.title}
              </h2>

              <div style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {selectedArticle.content}
              </div>
            </div>

            <div style={{ padding: '30px 40px 40px', textAlign: 'center' }}>
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{ background: '#f1f5f9', color: '#1e40af', border: 'none', padding: '14px 30px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', width: '100%' }}
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;