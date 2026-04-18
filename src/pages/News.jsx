import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { 
  Clock, 
  Loader2, 
  AlertCircle,
  Calendar,
  ChevronRight,
  X,
  Zap
} from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Body scroll lock logic
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedArticle]);

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

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      setSelectedArticle(null);
    }
  };

  const getImageUrl = (url) => {
    if (!url || url.includes('via.placeholder')) {
      return `https://placehold.co/600x400/1e3a8a/facc15?text=News+Update`;
    }
    return url;
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <Loader2 className="animate-spin" size={48} color="#1e3a8a" />
        <p style={{ marginTop: '20px', fontWeight: 800, color: '#1e3a8a', letterSpacing: '1px', fontFamily: 'Plus Jakarta Sans' }}>REFRESHING FEED...</p>
      </div>
    );
  }

  const featured = articles[0];
  const regular = articles.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        .news-page { background-color: #f8fafc; padding: 140px 5% 100px; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .container { max-width: 1100px; margin: 0 auto; }
        
        /* Header Styling */
        .header-box { text-align: center; margin-bottom: 60px; }
        .header-box h1 { font-size: clamp(2.5rem, 6vw, 3.5rem); color: #1e3a8a; font-weight: 800; letter-spacing: -1.5px; margin: 0; }
        .header-underline { width: 60px; height: 5px; background: #facc15; margin: 20px auto; border-radius: 10px; }
        .header-description { 
            max-width: 750px; 
            margin: 0 auto; 
            color: #64748b; 
            line-height: 1.8; 
            font-size: 1.1rem; 
            font-weight: 500;
        }

        /* Hero Card */
        .featured-hero { 
          display: grid; grid-template-columns: 1.2fr 0.8fr; background: white; 
          border-radius: 32px; overflow: hidden; margin-bottom: 50px; 
          border: 1px solid #e2e8f0; cursor: pointer; transition: 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          box-shadow: 0 15px 40px -15px rgba(0,0,0,0.08);
        }
        .featured-hero:hover { transform: translateY(-5px); border-color: #1e3a8a; }
        .featured-img { height: 450px; background: #1e293b; overflow: hidden; }
        .featured-img img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s ease; }
        
        .trending-badge { background: #1e3a8a; color: #facc15; padding: 6px 14px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 6px; width: fit-content; margin-bottom: 20px; }

        /* Grid Cards */
        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .news-card { background: white; border-radius: 28px; overflow: hidden; border: 1px solid #e2e8f0; transition: 0.3s ease; cursor: pointer; display: flex; flex-direction: column; }
        .news-card:hover { transform: translateY(-10px); border-color: #1e3a8a; box-shadow: 0 20px 40px -20px rgba(30, 58, 138, 0.15); }
        .card-img { height: 220px; background: #f1f5f9; overflow: hidden; }
        .card-img img { width: 100%; height: 100%; object-fit: cover; }
        .card-body { padding: 30px; flex-grow: 1; }

        /* Modal & Scrollbar Removal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-container { background: white; width: 100%; max-width: 700px; max-height: 85vh; border-radius: 32px; overflow: hidden; position: relative; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        
        .modal-scroll { 
            overflow-y: auto; 
            padding-bottom: 40px;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
        }
        .modal-scroll::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
        }

        @media (max-width: 900px) {
          .featured-hero { grid-template-columns: 1fr; }
          .featured-img { height: 260px; }
        }
      `}</style>

      <div className="news-page">
        <div className="container">
          <header className="header-box">
            <h1>League Press</h1>
            <div className="header-underline"></div>
            <p className="header-description">
                Welcome to the official news hub of the St. Jerome Alumni League. Here, we bring you the latest 
                match reports, exclusive player interviews, and critical board announcements as they happen. 
                Whether you're looking for tactical breakdowns of the weekend's biggest fixtures or updates 
                on upcoming community events and transfer news, stay connected with our live feed to never 
                miss a beat in the championship race.
            </p>
          </header>

          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
              <AlertCircle size={48} color="#cbd5e1" style={{ marginBottom: '20px' }} />
              <p style={{ color: '#1e3a8a', fontWeight: 800 }}>No news published yet.</p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="featured-hero" onClick={() => setSelectedArticle(featured)}>
                  <div className="featured-img">
                    <img src={getImageUrl(featured.image || featured.imageUrl)} alt="" />
                  </div>
                  <div className="featured-content" style={{ padding: '40px' }}>
                    <div className="trending-badge"><Zap size={14} fill="#facc15"/> FEATURED</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '15px' }}>{featured.title}</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '25px' }}>
                      {featured.excerpt || featured.content?.substring(0, 140) + "..."}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3a8a', fontWeight: 800 }}>
                      <Calendar size={16} color="#facc15"/> {featured.date}
                    </div>
                  </div>
                </div>
              )}

              <div className="news-grid">
                {regular.map((article) => (
                  <div key={article.id} className="news-card" onClick={() => setSelectedArticle(article)}>
                    <div className="card-img">
                      <img src={getImageUrl(article.image || article.imageUrl)} alt="" />
                    </div>
                    <div className="card-body">
                      <span style={{ color: '#1e3a8a', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>{article.category || "General"}</span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: '12px 0 20px' }}>{article.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a', fontWeight: 800, fontSize: '0.85rem' }}>
                        READ MORE <ChevronRight size={16} color="#facc15" strokeWidth={3}/>
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
          <div className="modal-container">
            <button 
              onClick={() => setSelectedArticle(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', zIndex: 10, cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} color="#1e3a8a" />
            </button>
            
            <div className="modal-scroll">
              <img 
                src={getImageUrl(selectedArticle.image || selectedArticle.imageUrl)} 
                style={{ width: '100%', height: '320px', objectFit: 'cover' }} 
                alt="" 
              />
              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
                    <span style={{ background: '#eff6ff', color: '#1e3a8a', padding: '4px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>{selectedArticle.category}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} /> {selectedArticle.date}
                    </span>
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e3a8a', marginBottom: '25px', lineHeight: 1.1 }}>
                  {selectedArticle.title}
                </h2>
                <div style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {selectedArticle.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;