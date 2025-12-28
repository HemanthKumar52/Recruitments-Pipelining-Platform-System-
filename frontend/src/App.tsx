import React, { useEffect, useState } from 'react';
import { getCandidates, getStages, updateCandidateStage, type Candidate, type Stage } from './api';
import { Users, Layout, Settings, Bell, Search, Plus } from 'lucide-react';

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cData, sData] = await Promise.all([getCandidates(), getStages()]);
      setCandidates(cData);
      setStages(sData);
    } catch (e) {
      console.error(e);
      // Fallback mock data if API fails (for demo purposes)
      setStages([
        { id: 1, stageName: 'Applied', stageOrder: 1 },
        { id: 2, stageName: 'Screening', stageOrder: 2 },
        { id: 3, stageName: 'Interview', stageOrder: 3 },
        { id: 4, stageName: 'Offer', stageOrder: 4 },
        { id: 5, stageName: 'Hired', stageOrder: 5 },
      ]);
      setCandidates([
         { id: 1, name: 'John Doe', email: 'john@example.com', positionApplied: 'Frontend Dev', currentStage: 'Applied', source: 'LinkedIn', updatedAt: new Date().toISOString() },
         { id: 2, name: 'Jane Smith', email: 'jane@example.com', positionApplied: 'Product Manager', currentStage: 'Screening', source: 'Referral', updatedAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData('candidateId', id.toString());
  };

  const handleDrop = async (e: React.DragEvent, stageName: string) => {
    const idStr = e.dataTransfer.getData('candidateId');
    if (!idStr) return;
    const id = Number(idStr);
    
    // Optimistic update
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, currentStage: stageName, updatedAt: new Date().toISOString() } : c));
    
    try {
      await updateCandidateStage(id, stageName);
    } catch (err) {
      console.error("Failed to update stage", err);
      // In a real app, revert state or show toast
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>Loading Recruitment Pipeline...</div>
    </div>
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="glass-panel" style={{ margin: '1rem 2rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', padding: '0.6rem', borderRadius: '10px', boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)' }}>
            <Layout color="white" size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>TalentFlow</h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AI-Powered Recruitment</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.4)' }}>
            <Search size={16} color="var(--text-secondary)" />
            <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '150px' }} />
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> <span>Add Candidate</span>
          </button>
          <div style={{ position: 'relative' }}>
            <Bell color="var(--text-secondary)" size={20} style={{ cursor: 'pointer' }} />
            <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--accent-red)', borderRadius: '50%' }}></span>
          </div>
          <Settings color="var(--text-secondary)" size={20} style={{ cursor: 'pointer' }} />
        </div>
      </header>

      {/* Board */}
      <div className="board-container">
        {stages.map(stage => (
          <div 
            key={stage.id} 
            className="stage-column"
            onDrop={(e) => handleDrop(e, stage.stageName)}
            onDragOver={handleDragOver}
          >
            <div className="stage-header" style={{ borderBottom: `2px solid ${['#38bdf8', '#818cf8', '#34d399', '#f87171'][stage.id % 4] || '#94a3b8'}` }}>
              {stage.stageName}
              <span className="tag">
                {candidates.filter(c => c.currentStage === stage.stageName).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingBottom: '2rem' }}>
              {candidates
                .filter(c => c.currentStage === stage.stageName)
                .map(candidate => (
                  <div 
                    key={candidate.id} 
                    className="glass-panel candidate-card animate-fade-in"
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{candidate.name}</h3>
                        <Users size={16} color="var(--text-secondary)" />
                    </div>
                    <p style={{ margin: '0 0 0.8rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {candidate.positionApplied}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span className="tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '0.7rem' }}>
                            {candidate.source}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                {candidate.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
