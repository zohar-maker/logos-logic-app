import React, { useState, useEffect, useCallback } from 'react';
import { GRAMMAR } from './grammarData';
import { BRANCHES, TIERS, TIER_INFO, STORAGE_KEY } from './config';

// ——— Utility ———
const loadProgress = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
const saveProgress = (p) => localStorage.setItem(STORAGE_KEY, JSON.stringify(p));

// ——— Color utils ———
const branchColor = (id) => BRANCHES.find(b=>b.id===id)?.color||'#c9a84c';
const branchBg = (id) => BRANCHES.find(b=>b.id===id)?.bg||'#18150e';

// ——— Styles ———
const S = {
  app: { minHeight:'100vh', fontFamily:"'Source Sans 3',sans-serif", background:'#0a0a0f', color:'#e8e4dd' },
  heading: { fontFamily:"'Cormorant Garamond',serif" },
  mono: { fontFamily:"'JetBrains Mono',monospace" },
  btn: (c,filled) => ({
    padding:'12px 24px', borderRadius:8, border:filled?'none':`1.5px solid ${c}33`,
    background:filled?c:'transparent', color:filled?'#0a0a0f':c,
    fontSize:15, fontWeight:600, cursor:'pointer', transition:'all 0.2s',
    fontFamily:"'Source Sans 3',sans-serif",
  }),
  card: (c) => ({
    background:`${c}08`, border:`1px solid ${c}18`, borderRadius:12, padding:24,
    cursor:'pointer', transition:'all 0.25s',
  }),
};

// ====== APP ======
export default function App() {
  const [view, setView] = useState('home'); // home | branch | unit | quiz | workshop | encounter
  const [branch, setBranch] = useState(null);
  const [unitIdx, setUnitIdx] = useState(0);
  const [tier, setTier] = useState('seed');
  const [prog, setProg] = useState(loadProgress);

  useEffect(() => { saveProgress(prog); }, [prog]);

  const goHome = () => { setView('home'); setBranch(null); };
  const goBranch = (id) => { setBranch(id); setView('branch'); };
  const goUnit = (idx) => { setUnitIdx(idx); setView('unit'); };

  const units = branch === 'grammar' ? GRAMMAR : [];
  const unit = units[unitIdx];
  const color = branch ? branchColor(branch) : '#c9a84c';
  const bg = branch ? branchBg(branch) : '#0a0a0f';

  const getScore = (uid, t) => prog[`${uid}_${t}`];
  const setScore = (uid, t, score) => setProg(p => ({...p, [`${uid}_${t}`]:score}));
  const getBadge = (score) => score >= 100 ? '🏆' : score >= 90 ? '🥈' : score >= 80 ? '🥉' : null;
  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    const prev = units[idx-1];
    if (!prev) return true;
    return (getScore(prev.id, 'seed') || 0) >= 80;
  };

  // ——— HEADER ———
  const Header = ({title, onBack, sub}) => (
    <div style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:12,borderBottom:`1px solid ${color}15`,position:'sticky',top:0,background:bg||'#0a0a0f',zIndex:10}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:color,fontSize:22,cursor:'pointer',padding:4}}>←</button>
      <div>
        <div style={{...S.heading,fontSize:18,fontWeight:600,color}}>{title}</div>
        {sub && <div style={{fontSize:12,opacity:0.5,marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );

  // ====== HOME ======
  if (view === 'home') return (
    <div style={{...S.app,maxWidth:600,margin:'0 auto'}}>
      <div style={{padding:'48px 24px 24px',textAlign:'center',animation:'fadeIn 0.6s ease'}}>
        <div style={{fontSize:13,...S.mono,color:'#666',letterSpacing:3,marginBottom:12}}>THE</div>
        <h1 style={{...S.heading,fontSize:52,fontWeight:700,color:'#e8e4dd',margin:0,lineHeight:1.1,letterSpacing:2}}>TRIVIUM</h1>
        <p style={{...S.heading,fontSize:17,fontStyle:'italic',color:'#888',marginTop:12}}>Grammar · Logic · Rhetoric</p>
        <p style={{fontSize:14,color:'#666',marginTop:16,lineHeight:1.6,maxWidth:400,margin:'16px auto 0'}}>
          The three ancient arts of language, reasoning, and persuasion — from second grade to PhD.
        </p>
      </div>
      <div style={{padding:'12px 20px 40px',display:'flex',flexDirection:'column',gap:16}}>
        {BRANCHES.map((b,i) => {
          const available = b.id === 'grammar';
          return (
            <div key={b.id} onClick={available ? ()=>goBranch(b.id) : undefined}
              style={{...S.card(b.color), opacity:available?1:0.5, cursor:available?'pointer':'default',
                animation:`slideUp 0.5s ease ${i*0.1}s both`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <span style={{fontSize:24,marginRight:10}}>{b.icon}</span>
                  <span style={{...S.heading,fontSize:22,fontWeight:600,color:b.color}}>{b.name}</span>
                </div>
                {!available && <span style={{...S.mono,fontSize:11,color:'#555',background:'#ffffff08',padding:'4px 10px',borderRadius:20}}>Coming Soon</span>}
              </div>
              <p style={{fontSize:14,color:'#888',marginTop:10,lineHeight:1.5}}>{b.description}</p>
              <p style={{...S.heading,fontSize:13,fontStyle:'italic',color:b.color,opacity:0.6,marginTop:8}}>{b.subtitle}</p>
            </div>
          );
        })}
      </div>
      {Object.keys(prog).length > 0 && (
        <div style={{textAlign:'center',paddingBottom:32}}>
          <button onClick={()=>{if(confirm('Reset all progress?')){localStorage.removeItem(STORAGE_KEY);setProg({});}}}
            style={{background:'none',border:'none',fontSize:12,color:'#444',cursor:'pointer'}}>Reset Progress</button>
        </div>
      )}
    </div>
  );

  // ====== BRANCH (unit list) ======
  if (view === 'branch') {
    const b = BRANCHES.find(x=>x.id===branch);
    return (
      <div style={{...S.app,maxWidth:600,margin:'0 auto',background:bg}}>
        <Header title={b.name} sub={b.subtitle} onBack={goHome}/>
        <div style={{padding:'20px 20px 40px'}}>
          <p style={{fontSize:14,color:'#888',lineHeight:1.6,marginBottom:20}}>{b.description}</p>
          {/* Tier selector */}
          <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
            {TIERS.map(t => (
              <button key={t} onClick={()=>setTier(t)}
                style={{...S.btn(color, tier===t), fontSize:13, padding:'8px 16px',borderRadius:20}}>
                {TIER_INFO[t].icon} {TIER_INFO[t].name}
              </button>
            ))}
          </div>
          <div style={{fontSize:12,color:'#666',marginBottom:20}}>{TIER_INFO[tier].desc}</div>
          {units.map((u,i) => {
            const locked = !isUnlocked(i);
            const score = getScore(u.id, tier);
            const badge = getBadge(score);
            return (
              <div key={u.id} onClick={locked?undefined:()=>goUnit(i)}
                style={{...S.card(color),marginBottom:12,opacity:locked?0.35:1,cursor:locked?'default':'pointer',
                  animation:`slideUp 0.4s ease ${i*0.05}s both`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <span style={{...S.mono,fontSize:12,color,opacity:0.5}}>
                      {locked ? '🔒' : String(i+1).padStart(2,'0')}
                    </span>
                    <div>
                      <div style={{fontSize:16,fontWeight:600,color:'#e8e4dd'}}>{u.title}</div>
                      <div style={{fontSize:12,color:'#777',marginTop:2}}>{u.sub}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    {badge && <span style={{fontSize:18}}>{badge}</span>}
                    {score != null && <span style={{...S.mono,fontSize:12,color:score>=80?'#4caf50':'#ff9800'}}>{score}%</span>}
                    {!locked && !score && <span style={{color,fontSize:18}}>→</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ====== UNIT HUB ======
  if (view === 'unit' && unit) {
    return (
      <div style={{...S.app,maxWidth:600,margin:'0 auto',background:bg}}>
        <Header title={unit.title} sub={unit.sub} onBack={()=>setView('branch')}/>
        <div style={{padding:'20px 20px 40px'}}>
          <div style={{fontSize:12,...S.mono,color,opacity:0.6,marginBottom:8}}>
            {TIER_INFO[tier].icon} {TIER_INFO[tier].name} tier · {unit.anchor}
          </div>
          {/* Learn */}
          <div style={{...S.card(color),marginBottom:16}}>
            <h3 style={{...S.heading,fontSize:18,color,marginBottom:10}}>Learn</h3>
            <p style={{fontSize:15,lineHeight:1.7,color:'#ccc'}}>{unit.learn}</p>
          </div>
          {/* Mode buttons */}
          {[
            {label:'📝 Quiz',desc:'Test your understanding',mode:'quiz'},
            {label:'✍️ Workshop',desc:'Practice by writing',mode:'workshop'},
            {label:'📜 Encounter',desc:'Engage with a real text',mode:'encounter'},
          ].map(m => (
            <button key={m.mode} onClick={()=>setView(m.mode)}
              style={{...S.card(color),marginBottom:12,width:'100%',textAlign:'left',display:'block',border:`1px solid ${color}25`}}>
              <div style={{fontSize:16,fontWeight:600}}>{m.label}</div>
              <div style={{fontSize:13,color:'#777',marginTop:4}}>{m.desc}</div>
              {m.mode==='quiz' && getScore(unit.id,tier)!=null && (
                <div style={{...S.mono,fontSize:12,color:getScore(unit.id,tier)>=80?'#4caf50':'#ff9800',marginTop:6}}>
                  Best: {getScore(unit.id,tier)}% {getBadge(getScore(unit.id,tier))}
                </div>
              )}
            </button>
          ))}
          {/* Bridge */}
          {unit.bridge && (
            <div style={{marginTop:20,padding:16,background:`${color}08`,borderLeft:`3px solid ${color}30`,borderRadius:4}}>
              <div style={{fontSize:12,...S.mono,color,opacity:0.6,marginBottom:6}}>BRIDGE</div>
              <p style={{fontSize:14,lineHeight:1.6,color:'#aaa',fontStyle:'italic'}}>{unit.bridge}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ====== QUIZ ======
  if (view === 'quiz' && unit) {
    return <QuizView unit={unit} tier={tier} color={color} bg={bg}
      onBack={()=>setView('unit')} onComplete={(score)=>{
        const prev = getScore(unit.id,tier)||0;
        if(score>prev) setScore(unit.id,tier,score);
      }}/>;
  }

  // ====== WORKSHOP ======
  if (view === 'workshop' && unit) {
    const prompt = unit.ws[tier];
    return (
      <div style={{...S.app,maxWidth:600,margin:'0 auto',background:bg}}>
        <Header title="Workshop" sub={`${unit.title} · ${TIER_INFO[tier].icon} ${TIER_INFO[tier].name}`} onBack={()=>setView('unit')}/>
        <div style={{padding:'20px 20px 40px'}}>
          <div style={{...S.card(color),marginBottom:20}}>
            <h3 style={{...S.heading,fontSize:18,color,marginBottom:10}}>Your Task</h3>
            <p style={{fontSize:15,lineHeight:1.7,color:'#ccc',whiteSpace:'pre-wrap'}}>{prompt}</p>
          </div>
          <textarea placeholder="Write your response here..."
            style={{width:'100%',minHeight:200,padding:16,background:'#ffffff06',border:`1px solid ${color}20`,
              borderRadius:8,color:'#e8e4dd',fontSize:15,lineHeight:1.7,fontFamily:"'Source Sans 3',sans-serif",
              resize:'vertical',outline:'none'}}/>
          <p style={{fontSize:12,color:'#555',marginTop:12,lineHeight:1.5}}>
            Workshop responses are for your own practice. Take your time. There are no wrong answers — only undefended ones.
          </p>
        </div>
      </div>
    );
  }

  // ====== ENCOUNTER ======
  if (view === 'encounter' && unit) {
    const enc = unit.enc;
    const tierQs = enc.qs.filter(q => {
      if (tier==='seed') return q.t==='seed';
      if (tier==='growth') return q.t==='seed'||q.t==='growth';
      return true;
    });
    return (
      <div style={{...S.app,maxWidth:600,margin:'0 auto',background:bg}}>
        <Header title="Encounter" sub={`${unit.title} · ${TIER_INFO[tier].icon} ${TIER_INFO[tier].name}`} onBack={()=>setView('unit')}/>
        <div style={{padding:'20px 20px 40px'}}>
          <div style={{padding:24,background:`${color}06`,borderLeft:`3px solid ${color}30`,borderRadius:4,marginBottom:24}}>
            <p style={{...S.heading,fontSize:17,lineHeight:1.8,color:'#d4d0c8',fontStyle:'italic',whiteSpace:'pre-wrap'}}>{enc.text}</p>
            <p style={{fontSize:13,color:'#666',marginTop:12}}>{enc.attr}</p>
          </div>
          <p style={{fontSize:13,color:'#888',marginBottom:20}}>Read the passage above slowly — at least twice. Then respond to the questions below.</p>
          {tierQs.map((q,i) => (
            <div key={i} style={{marginBottom:24}}>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:14}}>{TIER_INFO[q.t].icon}</span>
                <p style={{fontSize:15,fontWeight:600,color:'#ccc'}}>{q.q}</p>
              </div>
              <textarea placeholder="Your response..."
                style={{width:'100%',minHeight:120,padding:14,background:'#ffffff06',border:`1px solid ${color}15`,
                  borderRadius:8,color:'#e8e4dd',fontSize:14,lineHeight:1.6,fontFamily:"'Source Sans 3',sans-serif",
                  resize:'vertical',outline:'none'}}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div style={S.app}><Header title="TRIVIUM" onBack={goHome}/><p style={{padding:20,color:'#666'}}>View not found.</p></div>;
}

// ====== QUIZ COMPONENT ======
function QuizView({ unit, tier, color, bg, onBack, onComplete }) {
  const questions = unit.quiz[tier] || unit.quiz.seed;
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScoreLocal] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

  const q = questions[qi];
  const total = questions.length;

  const handleSelect = (idx) => {
    if (feedback) return;
    setSelected(idx);
    const correct = idx === q.a;
    if (correct) setScoreLocal(s => s + 1);
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      if (qi + 1 >= total) {
        const pct = Math.round(((correct ? score + 1 : score) / total) * 100);
        onComplete(pct);
        setDone(true);
      } else {
        setQi(qi + 1);
        setSelected(null);
        setFeedback(null);
      }
    }, correct ? 800 : 1500);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 80;
    const badge = pct >= 100 ? '🏆' : pct >= 90 ? '🥈' : pct >= 80 ? '🥉' : null;
    return (
      <div style={{...{minHeight:'100vh',fontFamily:"'Source Sans 3',sans-serif",background:bg,color:'#e8e4dd'},maxWidth:600,margin:'0 auto'}}>
        <div style={{padding:'80px 24px',textAlign:'center',animation:'fadeIn 0.5s ease'}}>
          <div style={{fontSize:64,marginBottom:16}}>{badge || '📊'}</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:passed?color:'#ff9800',marginBottom:8}}>
            {passed ? 'Well Done' : 'Keep Practicing'}
          </h2>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:32,color:passed?'#4caf50':'#ff9800',marginBottom:8}}>{pct}%</div>
          <p style={{fontSize:14,color:'#888',marginBottom:32}}>
            {score} of {total} correct{passed ? '' : ` — need 80% to unlock the next unit`}
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button onClick={()=>{setQi(0);setScoreLocal(0);setDone(false);setSelected(null);setFeedback(null);}}
              style={{padding:'12px 24px',borderRadius:8,border:`1.5px solid ${color}33`,background:'transparent',color,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>
              Try Again
            </button>
            <button onClick={onBack}
              style={{padding:'12px 24px',borderRadius:8,border:'none',background:color,color:'#0a0a0f',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:"'Source Sans 3',sans-serif"}}>
              Back to Unit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',fontFamily:"'Source Sans 3',sans-serif",background:bg,color:'#e8e4dd',maxWidth:600,margin:'0 auto'}}>
      {/* Progress bar */}
      <div style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:12,borderBottom:`1px solid ${color}15`,position:'sticky',top:0,background:bg,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color,fontSize:22,cursor:'pointer',padding:4}}>←</button>
        <div style={{flex:1}}>
          <div style={{height:4,background:'#ffffff10',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',background:color,borderRadius:2,width:`${((qi)/total)*100}%`,transition:'width 0.3s ease'}}/>
          </div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#666',marginTop:4}}>{qi+1} / {total}</div>
        </div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'#4caf50'}}>{score} ✓</div>
      </div>
      {/* Question */}
      <div style={{padding:'24px 20px 40px',animation:'fadeIn 0.3s ease'}} key={qi}>
        <p style={{fontSize:17,fontWeight:600,lineHeight:1.6,marginBottom:24,color:'#e8e4dd'}}>{q.q}</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {q.o.map((opt, i) => {
            let optBg = `${color}08`;
            let optBorder = `${color}20`;
            let optColor = '#ccc';
            if (feedback && i === q.a) { optBg = '#4caf5025'; optBorder = '#4caf50'; optColor = '#4caf50'; }
            else if (feedback === 'wrong' && i === selected) { optBg = '#f4433625'; optBorder = '#f44336'; optColor = '#f44336'; }
            else if (selected === i) { optBg = `${color}15`; optBorder = color; }
            return (
              <button key={i} onClick={()=>handleSelect(i)}
                style={{padding:'14px 18px',borderRadius:8,border:`1.5px solid ${optBorder}`,background:optBg,
                  color:optColor,fontSize:15,textAlign:'left',cursor:feedback?'default':'pointer',
                  transition:'all 0.2s',fontFamily:"'Source Sans 3',sans-serif",lineHeight:1.4,
                  animation: feedback==='wrong'&&i===selected ? 'shake 0.4s ease' : feedback==='correct'&&i===q.a ? 'correctPop 0.3s ease' : 'none',
                }}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
