import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Newspaper, Trophy, Users, UserCircle,
  MessageSquare, LogOut, Calendar, ClipboardCheck, 
  Menu, X, ChevronRight, Clock
} from 'lucide-react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

// Sub-components
import NewsManager from './NewsManager';
import FixturesManager from './FixturesManager';
import ResultsManager from './ResultsManager';
import TeamManager from './TeamManager';
import ExecutiveManager from './ExecutiveManager';
import ContactMessages from './ContactMessages';
import PlayerManager from './PlayerManager';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ clubs: 0, news: 0, messages: 0, players: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const COLORS = {
    blue: '#1e40af',
    yellow: '#facc15',
    slate: '#64748b',
    dark: '#0f172a',
    bg: '#f8fafc'
  };

  const pageInfo = {
    overview: { 
      title: "St. Jerome League Admin", 
      desc: "The central gateway for managing league operations. From here, you can coordinate match schedules, oversee player registrations, and keep fans updated with the latest news. Every action taken here synchronizes instantly with the live public portal." 
    },
    news: { title: "News Manager", desc: "Compose, edit, and publish breaking news, official press releases, and blog updates directly to the league's front page." },
    fixtures: { title: "Match Fixtures", desc: "Organize the season by setting up upcoming match dates, kick-off times, and stadium venues for all participating clubs." },
    results: { title: "Match Results", desc: "Finalize game days by recording official scores and individual scorers to update the league table in real-time." },
    clubs: { title: "Club Database", desc: "View and manage registered league teams, update their official information, and verify club status." },
    players: { title: "Player Registry", desc: "Maintain a comprehensive list of all registered players, including their stats, registration numbers, and club affiliations." },
    exec: { title: "Executive Board", desc: "Manage the official profiles and hierarchy of the league's leadership and technical committee." },
    inbox: { title: "Message Inbox", desc: "Review and respond to inquiries, feedback, and collaboration requests received through the official contact forms." }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (activeTab !== 'overview') return;
      setLoadingStats(true);
      try {
        const collections = ["clubs", "news", "messages", "players"];
        const results = await Promise.all(collections.map(col => getDocs(collection(db, col))));
        setStats({ clubs: results[0].size, news: results[1].size, messages: results[2].size, players: results[3].size });
      } catch (error) { console.error(error); } finally { setLoadingStats(false); }
    };
    fetchStats();
  }, [activeTab]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning, Admin";
    if (hour < 18) return "Good Afternoon, Admin";
    return "Good Evening, Admin";
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'fixtures', label: 'Fixtures', icon: Calendar },
    { id: 'results', label: 'Results', icon: ClipboardCheck },
    { id: 'clubs', label: 'Clubs', icon: Trophy },
    { id: 'players', label: 'Players', icon: UserCircle },
    { id: 'exec', label: 'Execs', icon: Users },
    { id: 'inbox', label: 'Inbox', icon: MessageSquare },
  ];

  return (
    <div className="admin-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Inter:wght@400;500;700&display=swap');
        
        .admin-root { 
          min-height: 100vh; 
          background: ${COLORS.bg}; 
          font-family: 'Inter', sans-serif; 
          padding-top: 120px; 
          display: flex; 
          flex-direction: column; 
        }
        
        .navbar { 
          position: fixed; top: 0; width: 100%; height: 80px; background: white; 
          border-bottom: 2px solid #eef2f6; display: flex; align-items: center; 
          justify-content: center; padding: 0 5%; z-index: 1000; 
        }

        .desktop-links { display: flex; gap: 4px; }
        .link-btn { 
          display: flex; align-items: center; gap: 8px; padding: 10px 14px; 
          border: none; background: transparent; color: ${COLORS.slate}; 
          font-weight: 700; font-size: 0.75rem; border-radius: 12px; cursor: pointer; 
          transition: 0.2s; text-transform: uppercase; 
        }
        .link-btn.active { background: ${COLORS.blue}; color: white; }
        .link-btn:hover:not(.active) { background: #f1f5f9; color: ${COLORS.blue}; }

        .popout-card { 
          position: fixed; top: 90px; right: 20px; width: 260px; background: white; 
          border-radius: 24px; padding: 15px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.2); 
          z-index: 2000; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 4px; 
        }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.1); backdrop-filter: blur(4px); z-index: 1500; }

        .content-area { max-width: 1200px; margin: 0 auto; width: 92%; flex-grow: 1; text-align: center; }
        
        /* ADJUSTED HEADINGS: Blue, Moderate Size, Capitalized */
        .page-header h2 { 
          font-family: 'Archivo'; 
          color: ${COLORS.blue}; 
          font-size: clamp(2.5rem, 8vw, 3.8rem); 
          text-transform: capitalize; 
          margin: 0; 
          line-height: 1.1;
          letter-spacing: -1.5px;
          font-weight: 900;
        }
        
        .title-divider { height: 8px; width: 100px; background: ${COLORS.yellow}; margin: 25px auto; border-radius: 10px; }
        .description-text { color: ${COLORS.slate}; font-size: 1.15rem; max-width: 850px; margin: 0 auto; font-weight: 500; line-height: 1.7; }

        .footer { background: white; border-top: 2px solid #eef2f6; padding: 50px 0; margin-top: 100px; text-align: center; }

        .mobile-btn { position: absolute; left: 20px; background: #f1f5f9; border:none; padding:12px; border-radius:14px; cursor: pointer; display: none; }

        @media (max-width: 1100px) {
          .desktop-links { display: none; }
          .mobile-btn { display: block; }
          .page-header h2 { font-size: 2.2rem; letter-spacing: -1px; }
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <nav className="navbar">
        <button className="mobile-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} color={COLORS.blue}/> : <Menu size={24} color={COLORS.blue}/>}
        </button>

        <div className="desktop-links">
          {navItems.map(item => (
            <button key={item.id} className={`link-btn ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              <item.icon size={16} /> {item.label}
            </button>
          ))}
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="link-btn" style={{color: '#ef4444'}}><LogOut size={16} /></button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div className="overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="popout-card">
            {navItems.map(item => (
              <button key={item.id} className={`link-btn ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} style={{justifyContent: 'flex-start', padding: '14px', width: '100%'}}>
                <item.icon size={18} /> {item.label}
              </button>
            ))}
            <hr style={{border: '0', borderTop: '1px solid #f1f5f9', margin: '10px 0'}} />
            <button onClick={() => signOut(auth).then(() => navigate('/login'))} className="link-btn" style={{color: '#ef4444', justifyContent: 'flex-start'}}><LogOut size={18} /> Logout</button>
          </div>
        </>
      )}

      <main className="content-area">
        <header className="page-header" style={{ marginBottom: '60px' }}>
          <h2>{pageInfo[activeTab].title}</h2>
          <div className="title-divider"></div>
          <p className="description-text">{pageInfo[activeTab].desc}</p>
          
          {activeTab === 'overview' && (
            <div style={{ marginTop: '40px', animation: 'fadeIn 1s ease' }}>
              <h4 style={{ color: COLORS.blue, textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 900, marginBottom: '10px', fontSize: '1rem' }}>{getGreeting()}</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', color: COLORS.slate, fontSize: '1rem', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={20} color={COLORS.blue} /> {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}</span>
                <span style={{opacity: 0.3, fontSize: '1.2rem'}}>|</span>
                <span>{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          )}
        </header>

        <section style={{ animation: 'fadeIn 0.6s ease-out' }}>
          {activeTab === 'overview' ? <Overview stats={stats} loading={loadingStats} setTab={setActiveTab} /> : 
           activeTab === 'news' ? <NewsManager /> :
           activeTab === 'fixtures' ? <FixturesManager /> :
           activeTab === 'results' ? <ResultsManager /> :
           activeTab === 'clubs' ? <TeamManager /> :
           activeTab === 'players' ? <PlayerManager /> :
           activeTab === 'exec' ? <ExecutiveManager /> : <ContactMessages />}
        </section>
      </main>

      <footer className="footer">
        <div style={{ fontFamily: 'Archivo', color: COLORS.blue, fontSize: '1.4rem', marginBottom: '8px', fontWeight: 900, textTransform: 'capitalize' }}>St. Jerome League</div>
        <p style={{ color: COLORS.slate, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>ADMINISTRATOR PORTAL • SECURE SESSION ACTIVE</p>
      </footer>
    </div>
  );
};

const Overview = ({ stats, loading, setTab }) => (
  <div style={{ paddingBottom: '100px' }}>
    <style>{`
      .action-banner { background: #1e40af; border-radius: 40px; padding: 60px 30px; margin-bottom: 60px; color: white; box-shadow: 0 30px 60px -15px rgba(30,64,175,0.3); }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 30px; }
      .interactive-card { 
        background: white; padding: 50px 25px; border-radius: 35px; border: 1px solid #eef2f6; 
        text-align: center; cursor: pointer; transition: all 0.4s ease;
      }
      .interactive-card:hover { transform: translateY(-12px); border-color: #1e40af; box-shadow: 0 25px 50px rgba(0,0,0,0.08); }
      .interactive-card h4 { color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 12px; font-weight: 800; letter-spacing: 1.5px; }
      .interactive-card h2 { font-family: 'Archivo'; font-size: 3.5rem; color: #1e40af; margin: 0; line-height: 1; }
    `}</style>
    
    <div className="action-banner">
      <h3 style={{fontFamily: 'Archivo', fontSize: '2.2rem', margin: '0 0 20px 0', textTransform: 'capitalize', letterSpacing: '-1px'}}>Administrative Hub</h3>
      <p style={{opacity: 0.9, fontSize: '1.15rem', maxWidth: '750px', margin: '0 auto 40px', lineHeight: '1.6', fontWeight: 500}}>
        Direct access to the league database. All changes made to fixtures, news, or player records will be synchronized with the public website immediately.
      </p>
      <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
        <button onClick={() => setTab('results')} style={{padding: '18px 40px', borderRadius: '18px', border: 'none', background: '#facc15', color: '#1e40af', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem'}}>Record Results <ChevronRight size={20}/></button>
        <button onClick={() => setTab('fixtures')} style={{padding: '18px 40px', borderRadius: '18px', border: '2px solid rgba(255,255,255,0.5)', background: 'transparent', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1.1rem'}}>Schedule Fixtures</button>
      </div>
    </div>

    <div className="stat-grid">
      <div className="interactive-card" onClick={() => setTab('clubs')}>
        <h4>Registered Clubs</h4>
        <h2>{loading ? '..' : stats.clubs}</h2>
      </div>
      <div className="interactive-card" onClick={() => setTab('players')}>
        <h4>Active Players</h4>
        <h2>{loading ? '..' : stats.players}</h2>
      </div>
      <div className="interactive-card" onClick={() => setTab('news')}>
        <h4>League News</h4>
        <h2>{loading ? '..' : stats.news}</h2>
      </div>
      <div className="interactive-card" style={{borderBottom: '8px solid #facc15'}} onClick={() => setTab('inbox')}>
        <h4>Fan Inbox</h4>
        <h2>{loading ? '..' : stats.messages}</h2>
      </div>
    </div>
  </div>
);

export default Dashboard;