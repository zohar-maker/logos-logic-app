import React, { useState, useEffect } from 'react';
import { GRAMMAR } from './grammarData';
import { LOGIC } from './logicData';
import { RHETORIC } from './rhetoricData';
import { BRANCHES, TIERS, TIER_INFO, STORAGE_KEY } from './config';

// ——— Normalize data format (Logic/Rhetoric use long names, Grammar uses short) ———
function normalizeUnits(units) {
  return units.map(u => ({
    ...u,
    sub: u.sub || u.subtitle,
    anchor: u.anchor || u.anchorTexts,
    ws: u.ws || (u.workshop ? {
      seed: u.workshop.seed?.prompt || u.workshop.seed,
      growth: u.workshop.growth?.prompt || u.workshop.growth,
      canopy: u.workshop.canopy?.prompt || u.workshop.canopy,
    } : {}),
    enc: u.enc || (u.encounter ? {
      text: u.encounter.text,
      attr: u.encounter.attr || u.encounter.attribution,
      qs: (u.encounter.qs || u.encounter.questions || []).map(q => ({
        ...q, t: q.t || q.tier, q: q.q
      })),
    } : {}),
    quiz: {
      seed: (u.quiz.seed || []).map(q => ({q:q.q, o:q.o||q.opts, a:q.a!=null?q.a:q.ans})),
      growth: (u.quiz.growth || []).map(q => ({q:q.q, o:q.o||q.opts, a:q.a!=null?q.a:q.ans})),
      canopy: (u.quiz.canopy || []).map(q => ({q:q.q, o:q.o||q.opts, a:q.a!=null?q.a:q.ans})),
    },
  }));
}

const CURRICULUM_DATA = { grammar: GRAMMAR, logic: normalizeUnits(LOGIC), rhetoric: normalizeUnits(RHETORIC) };

// ——— Utility ———
const loadProgress = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
const saveProgress = (p) => localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
const RESPONSE_KEY = 'trivium_responses_v1';
const loadResponses = () => { try { return JSON.parse(localStorage.getItem(RESPONSE_KEY)) || {}; } catch { return {}; } };
const saveResponses = (r) => localStorage.setItem(RESPONSE_KEY, JSON.stringify(r));

// ——— Color utils ———
const branchColor = (id) => BRANCHES.find(b=>b.id===id)?.color||'#7c6420';
const branchBg = (id) => BRANCHES.find(b=>b.id===id)?.bg||'#faf8f3';

// ——— Light-mode Styles ———
const S = {
  app: { minHeight:'100vh', fontFamily:"'Source Sans 3',sans-serif", background:'#faf8f4', color:'#2a2520' },
  heading: { fontFamily:"'Cormorant Garamond',serif" },
  mono: { fontFamily:"'JetBrains Mono',monospace" },
  btn: (c,filled) => ({
    padding:'12px 24px', borderRadius:8, border:filled?'none':`1.5px solid ${c}44`,
    background:filled?c:'transparent', color:filled?'#fff':c,
    fontSize:15, fontWeight:600, cursor:'pointer', transition:'all 0.2s',
    fontFamily:"'Source Sans 3',sans-serif",
  }),
  card: (c) => ({
    background:'#ffffff', border:`1px solid ${c}25`, borderRadius:12, padding:24,
    cursor:'pointer', transition:'all 0.25s', boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
  }),
};

// ====== APP ======
export default function App() {
  const [view, setView] = useState('home');
  const [branch, setBranch] = useState(null);
  const [unitIdx, setUnitIdx] = useState(0);
  const [tier, setTier] = useState('seed');
  const [prog, setProg] = useState(loadProgress);
  const [responses, setResponses] = useState(loadResponses);

  useEffect(() => { saveProgress(prog); }, [prog]);
  useEffect(() => { saveResponses(responses); }, [responses]);

  const goHome = () => { setView('home'); setBranch(null); };
  const goBranch = (id) => { setBranch(id); setView('branch'); };
  const goUnit = (idx) => { setUnitIdx(idx); setView('unit'); };

  const units = CURRICULUM_DATA[branch] || [];
  const unit = units[unitIdx];
  const color = branch ? branchColor(branch) : '#7c6420';
  const bg = branch ? branchBg(branch) : '#faf8f4';

  const getScore = (uid, t) => prog[`${uid}_${t}`];
  const setScore = (uid, t, score) => setProg(p => ({...p, [`${uid}_${t}`]:score}));
  const getBadge = (score) => score >= 100 ? '🏆' : score >= 90 ? '🥈' : score >= 80 ? '🥉' : null;
  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    const prev = units[idx-1];
    if (!prev) return true;
    return (getScore(prev.id, 'seed') || 0) >= 80;
  };

  // Response save/load helpers
  const getResponse = (key) => responses[key] || '';
  const setResponse = (key, val) => setResponses(r => ({...r, [key]: val}));

  // ——— HEADER ———
  const Header = ({title, onBack, sub}) => (
    <div style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:12,borderBottom:`1px solid ${color}15`,position:'sticky',top:0,background:bg||'#faf8f4',zIndex:10}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:color,fontSize:22,cursor:'pointer',padding:4}}>←</button>
      <div>
        <div style={{...S.heading,fontSize:18,fontWeight:600,color}}>{title}</div>
        {sub && <div style={{fontSize:12,color:'#999',marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );

  // ====== HOME ======
  if (view === 'home') return (
    <div style={{...S.app,maxWidth:600,margin:'0 auto'}}>
      <div style={{padding:'48px 24px 24px',textAlign:'center',animation:'fadeIn 0.6s ease'}}>
        <div style={{fontSize:13,...S.mono,color:'#999',letterSpacing:3,marginBottom:12}}>THE</div>
        <h1 style={{...S.heading,fontSize:52,fontWeight:700,color:'#2a2520',margin:0,lineHeight:1.1,letterSpacing:2}}>TRIVIUM</h1>
        <p style={{...S.heading,fontSize:17,fontStyle:'italic',color:'#888',marginTop:12}}>Grammar · Logic · Rhetoric</p>
        <p style={{fontSize:14,color:'#777',marginTop:16,lineHeight:1.6,maxWidth:400,margin:'16px auto 0'}}>
          The three ancient arts of language, reasoning, and persuasion — from second grade to PhD.
        </p>
      </div>
      <div style={{padding:'12px 20px 40px',display:'flex',flexDirection:'column',gap:16}}>
        {BRANCHES.map((b,i) => (
          <div key={b.id} onClick={()=>goBranch(b.id)}
            style={{...S.card(b.color), cursor:'pointer', animation:`slideUp 0.5s ease ${i*0.1}s both`}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <span style={{fontSize:24,marginRight:10}}>{b.icon}</span>
                <span style={{...S.heading,fontSize:22,fontWeight:600,color:b.color}}>{b.name}</span>
              </div>
            </div>
            <p style={{fontSize:14,color:'#666',marginTop:10,lineHeight:1.5}}>{b.description}</p>
            <p style={{...S.heading,fontSize:13,fontStyle:'italic',color:b.color,opacity:0.7,marginTop:8}}>{b.subtitle}</p>
          </div>
        ))}
      </div>
      {Object.keys(prog).length > 0 && (
        <div style={{textAlign:'center',paddingBottom:32}}>
          <button onClick={()=>{if(confirm('Reset all progress?')){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(RESPONSE_KEY);setProg({});setResponses({});}}}
            style={{background:'none',border:'none',fontSize:12,color:'#aaa',cursor:'pointer'}}>Reset Progress</button>
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
          <p style={{fontSize:14,color:'#777',lineHeight:1.6,marginBottom:20}}>{b.description}</p>
          <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
            {TIERS.map(t => (
              <button key={t} onClick={()=>setTier(t)}
                style={{...S.btn(color, tier===t), fontSize:13, padding:'8px 16px',borderRadius:20}}>
                {TIER_INFO[t].icon} {TIER_INFO[t].name}
              </button>
            ))}
          </div>
          <div style={{fontSize:12,color:'#999',marginBottom:20}}>{TIER_INFO[tier].desc}</div>
          {units.map((u,i) => {
            const locked = !isUnlocked(i);
            const score = getScore(u.id, tier);
            const badge = getBadge(score);
            return (
              <div key={u.id} onClick={locked?undefined:()=>goUnit(i)}
                style={{...S.card(color),marginBottom:12,opacity:locked?0.4:1,cursor:locked?'default':'pointer',
                  animation:`slideUp 0.4s ease ${i*0.05}s both`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <span style={{...S.mono,fontSize:12,color,opacity:0.5}}>
                      {locked ? '🔒' : String(i+1).padStart(2,'0')}
                    </span>
                    <div>
                      <div style={{fontSize:16,fontWeight:600,color:'#2a2520'}}>{u.title}</div>
                      <div style={{fontSize:12,color:'#999',marginTop:2}}>{u.sub}</div>
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
          <div style={{...S.card(color),marginBottom:16}}>
            <h3 style={{...S.heading,fontSize:18,color,marginBottom:10}}>Learn</h3>
            <p style={{fontSize:15,lineHeight:1.7,color:'#444'}}>{unit.learn}</p>
          </div>
          {[
            {label:'📝 Quiz',desc:'Test your understanding',mode:'quiz'},
            {label:'✍️ Workshop',desc:'Practice by writing',mode:'workshop'},
            {label:'📜 Encounter',desc:'Engage with a real text',mode:'encounter'},
          ].map(m => (
            <button key={m.mode} onClick={()=>setView(m.mode)}
              style={{...S.card(color),marginBottom:12,width:'100%',textAlign:'left',display:'block',border:`1px solid ${color}25`}}>
              <div style={{fontSize:16,fontWeight:600,color:'#2a2520'}}>{m.label}</div>
              <div style={{fontSize:13,color:'#999',marginTop:4}}>{m.desc}</div>
              {m.mode==='quiz' && getScore(unit.id,tier)!=null && (
                <div style={{...S.mono,fontSize:12,color:getScore(unit.id,tier)>=80?'#4caf50':'#ff9800',marginTop:6}}>
                  Best: {getScore(unit.id,tier)}% {getBadge(getScore(unit.id,tier))}
                </div>
              )}
            </button>
          ))}
          {unit.bridge && (
            <div style={{marginTop:20,padding:16,background:`${color}08`,borderLeft:`3px solid ${color}40`,borderRadius:4}}>
              <div style={{fontSize:12,...S.mono,color,opacity:0.6,marginBottom:6}}>BRIDGE</div>
              <p style={{fontSize:14,lineHeight:1.6,color:'#666',fontStyle:'italic'}}>{unit.bridge}</p>
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
    const rKey = `ws_${unit.id}_${tier}`;
    return (
      <div style={{...S.app,maxWidth:600,margin:'0 auto',background:bg}}>
        <Header title="Workshop" sub={`${unit.title} · ${TIER_INFO[tier].icon} ${TIER_INFO[tier].name}`} onBack={()=>setView('unit')}/>
        <div style={{padding:'20px 20px 40px'}}>
          <div style={{...S.card(color),marginBottom:20}}>
            <h3 style={{...S.heading,fontSize:18,color,marginBottom:10}}>Your Task</h3>
            <p style={{fontSize:15,lineHeight:1.7,color:'#444',whiteSpace:'pre-wrap'}}>{prompt}</p>
          </div>
          <textarea placeholder="Write your response here..."
            value={getResponse(rKey)}
            onChange={(e)=>setResponse(rKey, e.target.value)}
            style={{width:'100%',minHeight:200,padding:16,background:'#fff',border:`1px solid ${color}30`,
              borderRadius:8,color:'#2a2520',fontSize:15,lineHeight:1.7,fontFamily:"'Source Sans 3',sans-serif",
              resize:'vertical',outline:'none',boxSizing:'border-box'}}/>
          <p style={{fontSize:12,color:'#999',marginTop:12,lineHeight:1.5}}>
            ✅ Your response saves automatically. Come back anytime to edit it.
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
          <div style={{padding:24,background:`${color}08`,borderLeft:`3px solid ${color}40`,borderRadius:4,marginBottom:24}}>
            <p style={{...S.heading,fontSize:17,lineHeight:1.8,color:'#3a3530',fontStyle:'italic',whiteSpace:'pre-wrap'}}>{enc.text}</p>
            <p style={{fontSize:13,color:'#999',marginTop:12}}>{enc.attr}</p>
          </div>
          <p style={{fontSize:13,color:'#888',marginBottom:20}}>Read the passage above slowly — at least twice. Then respond to the questions below.</p>
          {tierQs.map((q,i) => {
            const rKey = `enc_${unit.id}_${tier}_${i}`;
            return (
              <div key={i} style={{marginBottom:24}}>
                <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
                  <span style={{fontSize:14}}>{TIER_INFO[q.t].icon}</span>
                  <p style={{fontSize:15,fontWeight:600,color:'#3a3530'}}>{q.q}</p>
                </div>
                <textarea placeholder="Your response..."
                  value={getResponse(rKey)}
                  onChange={(e)=>setResponse(rKey, e.target.value)}
                  style={{width:'100%',minHeight:120,padding:14,background:'#fff',border:`1px solid ${color}25`,
                    borderRadius:8,color:'#2a2520',fontSize:14,lineHeight:1.6,fontFamily:"'Source Sans 3',sans-serif",
                    resize:'vertical',outline:'none',boxSizing:'border-box'}}/>
              </div>
            );
          })}
          <p style={{fontSize:12,color:'#999',marginTop:4}}>✅ Your responses save automatically.</p>
        </div>
      </div>
    );
  }

  return <div style={S.app}><Header title="TRIVIUM" onBack={goHome}/><p style={{padding:20,color:'#999'}}>View not found.</p></div>;
}

// ====== QUIZ COMPONENT ======
function QuizView({ unit, tier, color, bg, onBack, onComplete }) {
  const questions = unit.quiz[tier] || unit.quiz.seed;
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScoreLocal] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);

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
      <div style={{...S.app,maxWidth:600,margin:'0 auto',background:bg}}>
        <div style={{padding:'80px 24px',textAlign:'center',animation:'fadeIn 0.5s ease'}}>
          <div style={{fontSize:64,marginBottom:16}}>{badge || '📊'}</div>
          <h2 style={{...S.heading,fontSize:28,color:passed?color:'#ff9800',marginBottom:8}}>
            {passed ? 'Well Done' : 'Keep Practicing'}
          </h2>
          <div style={{...S.mono,fontSize:32,color:passed?'#4caf50':'#ff9800',marginBottom:8}}>{pct}%</div>
          <p style={{fontSize:14,color:'#888',marginBottom:32}}>
            {score} of {total} correct{passed ? '' : ` — need 80% to unlock the next unit`}
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center'}}>
            <button onClick={()=>{setQi(0);setScoreLocal(0);setDone(false);setSelected(null);setFeedback(null);}}
              style={{...S.btn(color,false)}}>Try Again</button>
            <button onClick={onBack} style={{...S.btn(color,true)}}>Back to Unit</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{...S.app,maxWidth:600,margin:'0 auto',background:bg}}>
      <div style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:12,borderBottom:`1px solid ${color}15`,position:'sticky',top:0,background:bg,zIndex:10}}>
        <button onClick={onBack} style={{background:'none',border:'none',color,fontSize:22,cursor:'pointer',padding:4}}>←</button>
        <div style={{flex:1}}>
          <div style={{height:4,background:'#00000010',borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',background:color,borderRadius:2,width:`${((qi)/total)*100}%`,transition:'width 0.3s ease'}}/>
          </div>
          <div style={{...S.mono,fontSize:11,color:'#999',marginTop:4}}>{qi+1} / {total}</div>
        </div>
        <div style={{...S.mono,fontSize:13,color:'#4caf50'}}>{score} ✓</div>
      </div>
      <div style={{padding:'24px 20px 40px',animation:'fadeIn 0.3s ease'}} key={qi}>
        <p style={{fontSize:17,fontWeight:600,lineHeight:1.6,marginBottom:24,color:'#2a2520'}}>{q.q}</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {q.o.map((opt, i) => {
            let optBg = '#fff';
            let optBorder = `${color}30`;
            let optColor = '#444';
            if (feedback && i === q.a) { optBg = '#e8f5e9'; optBorder = '#4caf50'; optColor = '#2e7d32'; }
            else if (feedback === 'wrong' && i === selected) { optBg = '#ffebee'; optBorder = '#f44336'; optColor = '#c62828'; }
            else if (selected === i) { optBg = `${color}10`; optBorder = color; }
            return (
              <button key={i} onClick={()=>handleSelect(i)}
                style={{padding:'14px 18px',borderRadius:8,border:`1.5px solid ${optBorder}`,background:optBg,
                  color:optColor,fontSize:15,textAlign:'left',cursor:feedback?'default':'pointer',
                  transition:'all 0.2s',fontFamily:"'Source Sans 3',sans-serif",lineHeight:1.4}}>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
