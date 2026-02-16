import { useState, useEffect } from "react";
import C from "./curriculum.js";

const STORAGE_KEY = "logos-progress-v3";
function loadProgress() {
  try { const d = JSON.parse(localStorage.getItem(STORAGE_KEY)); return d && d.completed ? d : { completed: {}, scores: {}, bestPct: {} }; }
  catch { return { completed: {}, scores: {}, bestPct: {} }; }
}
function saveProgress(p) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {} }

const MASTERY_THRESHOLD = 80;

const THEMES = {
  explorer:    { bg:"#FFF8F0",accent:"#E8722A",sec:"#F4A261",text:"#3D2C1E",card:"#FFF3E8",badge:"🌱",label:"Seeds",font:"'Baloo 2',cursive" },
  adventurer:  { bg:"#F0F5FF",accent:"#2563EB",sec:"#60A5FA",text:"#1E293B",card:"#E8F0FE",badge:"🌿",label:"Sprouts",font:"'Baloo 2',cursive" },
  scholar:     { bg:"#FAF5FF",accent:"#7C3AED",sec:"#A78BFA",text:"#2D1B4E",card:"#F3EAFF",badge:"🌳",label:"Branches",font:"'Baloo 2',cursive" },
  philosopher: { bg:"#F0FAF4",accent:"#059669",sec:"#34D399",text:"#134E30",card:"#E6F7ED",badge:"🌲",label:"Deep Roots",font:"'Baloo 2',cursive" },
  master:      { bg:"#FFF5F7",accent:"#BE185D",sec:"#F472B6",text:"#4A1230",card:"#FFE8EF",badge:"🌟",label:"Canopy",font:"'Baloo 2',cursive" },
};
const REALM_ORDER = ["explorer","adventurer","scholar","philosopher","master"];
const REALM_LABELS = { explorer:"The Basics",adventurer:"Building Blocks",scholar:"Putting It Together",philosopher:"The Big Questions",master:"Mind-Bending Ideas" };

function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

function isUnlocked(unitId, prog) {
  if (unitId === 1) return true;
  const prevPct = prog.bestPct?.[unitId - 1] || 0;
  return prevPct >= MASTERY_THRESHOLD;
}

function badgeFor(pct) { return pct >= 100 ? "🏆" : pct >= 90 ? "🥈" : pct >= 80 ? "🥉" : null; }

// ══════════════════════════════════════════
//  LEARN VIEW
// ══════════════════════════════════════════

function LearnView({unit}) {
  const t = THEMES[unit.realm];
  return (
    <div style={{animation:"fadeIn 0.3s ease-out"}}>
      <div style={{background:`linear-gradient(135deg,${t.card},${t.bg})`,borderRadius:20,padding:"28px 24px",marginBottom:24,borderLeft:`5px solid ${t.accent}`,position:"relative"}}>
        <div style={{position:"absolute",top:-13,left:18,background:t.accent,color:"#fff",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase"}}>Story</div>
        <p style={{fontFamily:t.font,fontSize:17,lineHeight:1.85,color:t.text,margin:0,whiteSpace:"pre-line"}}>{unit.story}</p>
      </div>
      {unit.learn.map((item,i) => (
        <div key={i} style={{background:"#fff",borderRadius:16,padding:"22px",marginBottom:14,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",borderLeft:`4px solid ${item.type==="example"?t.sec:t.accent}`,animation:`slideUp 0.4s ease-out ${i*0.08}s both`}}>
          <div style={{fontSize:10,fontWeight:700,color:item.type==="example"?t.sec:t.accent,textTransform:"uppercase",letterSpacing:1.2,marginBottom:5}}>{item.type==="example"?"✏️ Example":"💡 Concept"}</div>
          <h4 style={{margin:"0 0 10px",fontSize:18,color:t.text,fontFamily:t.font,fontWeight:700}}>{item.title}</h4>
          <pre style={{fontFamily:"'Baloo 2',cursive",fontSize:16,lineHeight:1.8,color:t.text,margin:0,whiteSpace:"pre-wrap",background:"transparent"}}>{item.body}</pre>
        </div>
      ))}
      <div style={{background:t.card,borderRadius:20,padding:"28px 24px",marginTop:8,borderLeft:`5px solid ${t.sec}`,position:"relative"}}>
        <div style={{position:"absolute",top:-13,left:18,background:t.sec,color:"#fff",borderRadius:20,padding:"4px 14px",fontSize:11,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase"}}>Why This Matters</div>
        <p style={{fontFamily:t.font,fontSize:16,lineHeight:1.75,color:t.text,margin:0}}>{unit.realWorld}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  QUIZ VIEW (with mastery feedback)
// ══════════════════════════════════════════

function QuizView({unit, onComplete, bestPct}) {
  const [cur, setCur] = useState(0);
  const [sel, setSel] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [qs] = useState(() => shuffle(unit.quiz));
  const t = THEMES[unit.realm];

  const pick = (i) => { if (sel !== null) return; setSel(i); if (i === qs[cur].answer) setScore(s => s + 1); };
  const next = () => { if (cur + 1 >= qs.length) { setDone(true); onComplete && onComplete(score); return; } setCur(c => c + 1); setSel(null); };
  const retry = () => { setCur(0); setSel(null); setScore(0); setDone(false); };

  if (done) {
    const pct = Math.round(score / qs.length * 100);
    const passed = pct >= MASTERY_THRESHOLD;
    return (
      <div style={{textAlign:"center",padding:48,animation:"bounceIn 0.5s ease-out"}}>
        <div style={{fontSize:72,marginBottom:16}}>{pct >= 100 ? "🏆" : pct >= 90 ? "🥈" : pct >= 80 ? "🥉" : "💪"}</div>
        <h3 style={{fontFamily:t.font,fontSize:26,color:t.text}}>{score}/{qs.length} ({pct}%)</h3>
        <p style={{color:t.text,opacity:0.7,fontSize:16,marginTop:8,fontWeight:600}}>
          {pct >= 100 ? "Gold Mastery! Perfect!" : pct >= 90 ? "Silver! Almost perfect!" : pct >= 80 ? "Bronze — Passed!" : "Keep practicing!"}
        </p>
        {passed ? (
          <div style={{marginTop:16,padding:"12px 20px",background:"#e8f5e9",borderRadius:12,display:"inline-block"}}>
            <span style={{fontSize:15,color:"#2e7d32",fontWeight:700}}>✅ Unit mastered! Next unit unlocked!</span>
          </div>
        ) : (
          <div style={{marginTop:16,padding:"12px 20px",background:"#fff3e0",borderRadius:12,display:"inline-block"}}>
            <span style={{fontSize:15,color:"#e65100",fontWeight:700}}>Need {MASTERY_THRESHOLD}% to unlock the next unit. You got this!</span>
          </div>
        )}
        {bestPct > 0 && bestPct > pct && <p style={{fontSize:13,color:t.text,opacity:0.4,marginTop:8}}>Your best: {bestPct}%</p>}
        <div style={{marginTop:24}}>
          <button onClick={retry} style={{padding:"14px 36px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:17,fontWeight:700,cursor:"pointer"}}>
            {passed ? "Try for Gold!" : "Try Again!"}
          </button>
        </div>
      </div>
    );
  }

  const q = qs[cur];
  return (
    <div style={{animation:"fadeIn 0.3s ease-out"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:14,color:t.text,opacity:0.5}}>
        <span>Q {cur + 1}/{qs.length}</span><span>Score: {score}</span>
      </div>
      <div style={{height:4,background:t.card,borderRadius:2,marginBottom:20}}>
        <div style={{height:"100%",background:t.accent,borderRadius:2,width:`${(cur / qs.length) * 100}%`,transition:"width 0.3s"}} />
      </div>
      <h3 style={{fontFamily:t.font,fontSize:20,color:t.text,marginBottom:20,lineHeight:1.5}}>{q.q}</h3>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {q.opts.map((opt, i) => {
          let bg = "#fff", bd = `2px solid ${t.card}`;
          if (sel !== null) { if (i === q.answer) { bg = "#e8f5e9"; bd = "2px solid #4caf50"; } else if (sel === i) { bg = "#ffebee"; bd = "2px solid #ef5350"; } }
          return (
            <button key={i} onClick={() => pick(i)} style={{padding:"16px 20px",background:bg,border:bd,borderRadius:14,textAlign:"left",cursor:sel !== null ? "default" : "pointer",fontSize:16,color:t.text,fontFamily:t.font,transition:"all 0.2s",minHeight:52,animation:sel === i && i !== q.answer ? "shake 0.3s ease-out" : "none"}}>
              <span style={{fontWeight:700,marginRight:10,color:t.accent}}>{String.fromCharCode(65 + i)}.</span>{opt}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div style={{marginTop:20,animation:"slideUp 0.3s ease-out"}}>
          <div style={{background:sel === q.answer ? "#e8f5e9" : "#ffebee",borderRadius:12,padding:"16px 20px",marginBottom:16,lineHeight:1.6}}>
            <span style={{fontWeight:700,marginRight:8}}>{sel === q.answer ? "✅ Correct!" : "❌ Not quite."}</span>
            <span style={{fontSize:15,color:t.text}}>{q.explain}</span>
          </div>
          <button onClick={next} style={{padding:"14px 32px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer"}}>
            {cur + 1 >= qs.length ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
//  MATCH VIEW
// ══════════════════════════════════════════

function MatchView({unit}) {
  const [pairs] = useState(() => {
    const m = unit.match;
    return { left: shuffle(m.map((p, i) => ({id: i, text: p.left}))), right: shuffle(m.map((p, i) => ({id: i, text: p.right}))) };
  });
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState(new Set);
  const t = THEMES[unit.realm];

  const tap = (side, item) => {
    if (matched.has(item.id)) return;
    if (!sel) { setSel({side, item}); return; }
    if (sel.side === side) { setSel({side, item}); return; }
    if (sel.item.id === item.id) { setMatched(s => { const n = new Set(s); n.add(item.id); return n; }); setSel(null); }
    else { setSel({side, item}); }
  };

  const btn = (side, item) => {
    const m = matched.has(item.id), s = sel && sel.side === side && sel.item.id === item.id;
    return (
      <button key={`${side}-${item.id}`} onClick={() => tap(side, item)} style={{padding:"14px 16px",background:m?t.card:s?t.accent:"#fff",color:m?t.text+"88":s?"#fff":t.text,border:`2px solid ${m?t.card:s?t.accent:t.card}`,borderRadius:14,fontSize:14,fontFamily:t.font,cursor:m?"default":"pointer",transition:"all 0.2s",textAlign:"left",minHeight:48,opacity:m?0.5:1}}>
        {item.text}
      </button>
    );
  };

  return (
    <div style={{animation:"fadeIn 0.3s ease-out"}}>
      <p style={{fontSize:15,color:t.text,opacity:0.5,marginBottom:16}}>Tap one item, then its match. {matched.size}/{pairs.left.length} found.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>{pairs.left.map(p => btn("left", p))}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>{pairs.right.map(p => btn("right", p))}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  SORT VIEW
// ══════════════════════════════════════════

function SortView({unit}) {
  const s = unit.sort;
  const [items] = useState(() => shuffle(s.items.map((it, i) => ({...it, id: i}))));
  const [answers, setAnswers] = useState({});
  const [show, setShow] = useState(false);
  const t = THEMES[unit.realm];
  const assign = (id, ci) => { if (!show) setAnswers(a => ({...a, [id]: ci})); };
  const allDone = Object.keys(answers).length === items.length;
  const correct = items.filter(it => answers[it.id] === it.cat).length;

  return (
    <div style={{animation:"fadeIn 0.3s ease-out"}}>
      <p style={{fontSize:17,fontWeight:600,color:t.text,marginBottom:6,fontFamily:t.font}}>{s.prompt}</p>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {s.categories.map((c, i) => (
          <span key={i} style={{background:t.card,padding:"8px 16px",borderRadius:20,fontSize:14,fontWeight:700,color:t.accent}}>{i + 1}. {c}</span>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {items.map(it => {
          const a = answers[it.id] !== undefined, ok = show && a && answers[it.id] === it.cat, bad = show && a && answers[it.id] !== it.cat;
          return (
            <div key={it.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:14,background:ok?"#e8f5e9":bad?"#ffebee":"#fff",border:`2px solid ${ok?"#4caf50":bad?"#ef5350":t.card}`,transition:"all 0.2s",flexWrap:"wrap",animation:bad?"shake 0.3s ease-out":"none"}}>
              <span style={{flex:1,fontSize:15,color:t.text,fontFamily:t.font,minWidth:100}}>{it.text}</span>
              <div style={{display:"flex",gap:8,flexShrink:0}}>
                {s.categories.map((_, ci) => (
                  <button key={ci} onClick={() => assign(it.id, ci)} style={{width:44,height:44,borderRadius:12,fontSize:17,fontWeight:700,cursor:show?"default":"pointer",transition:"all 0.15s",background:answers[it.id]===ci?t.accent:"transparent",color:answers[it.id]===ci?"#fff":t.text,border:`2px solid ${answers[it.id]===ci?t.accent:t.card}`}}>{ci + 1}</button>
                ))}
              </div>
              {bad && <span style={{fontSize:12,color:"#ef5350",fontWeight:700}}>→{it.cat + 1}</span>}
            </div>
          );
        })}
      </div>
      <div style={{marginTop:20,display:"flex",gap:12,flexWrap:"wrap"}}>
        {allDone && !show && (
          <button onClick={() => setShow(true)} style={{padding:"14px 32px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer"}}>Check Answers</button>
        )}
        {show && (
          <>
            <div style={{padding:"12px 20px",background:correct===items.length?"#e8f5e9":"#fff8e1",borderRadius:12,fontWeight:700,color:t.text,fontFamily:t.font}}>{correct}/{items.length}{correct===items.length?" 🎉":""}</div>
            <button onClick={() => {setAnswers({});setShow(false);}} style={{padding:"14px 32px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:700,cursor:"pointer"}}>Try Again</button>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════

const TABS = [{key:"learn",label:"📖 Learn"},{key:"quiz",label:"❓ Quiz"},{key:"match",label:"🎯 Match"},{key:"sort",label:"🗂️ Sort"}];

export default function LogosApp() {
  const [unit, setUnit] = useState(null);
  const [tab, setTab] = useState("learn");
  const [prog, setProg] = useState(loadProgress);
  useEffect(() => { saveProgress(prog); }, [prog]);

  const mark = (id, sc) => {
    const pct = Math.round((sc / C.find(u => u.id === id).quiz.length) * 100);
    setProg(p => ({
      ...p,
      completed: {...p.completed, [id]: true},
      scores: {...p.scores, [id]: Math.max(sc || 0, p.scores?.[id] || 0)},
      bestPct: {...p.bestPct, [id]: Math.max(pct, p.bestPct?.[id] || 0)},
    }));
  };

  const back = () => { setUnit(null); setTab("learn"); };
  const cc = Object.keys(prog.completed).length;
  const total = C.length;
  const mastered = Object.values(prog.bestPct || {}).filter(p => p >= MASTERY_THRESHOLD).length;

  if (unit !== null) {
    const u = C.find(x => x.id === unit);
    const t = THEMES[u.realm];
    const bp = prog.bestPct?.[u.id] || 0;
    return (
      <div style={{minHeight:"100vh",background:t.bg,fontFamily:t.font}}>
        <div style={{padding:"18px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:`1px solid ${t.card}`,position:"sticky",top:0,background:t.bg,zIndex:10}}>
          <button onClick={back} style={{background:t.card,border:"none",borderRadius:10,width:44,height:44,fontSize:18,cursor:"pointer",color:t.text,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
          <div style={{flex:1}}>
            <span style={{fontSize:11,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:1.2}}>{t.badge} Unit {u.id}</span>
            <h2 style={{margin:0,fontSize:20,color:t.text,fontFamily:"'Outfit',sans-serif",fontWeight:800}}>{u.title}</h2>
          </div>
          {badgeFor(bp) && <span style={{fontSize:20}} title={`Best: ${bp}%`}>{badgeFor(bp)}</span>}
        </div>
        <div style={{display:"flex",gap:6,padding:"12px 20px",borderBottom:`1px solid ${t.card}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)} style={{padding:"10px 18px",borderRadius:20,fontSize:14,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",background:tab===tb.key?t.accent:"transparent",color:tab===tb.key?"#fff":t.text,border:`2px solid ${tab===tb.key?t.accent:"transparent"}`}}>
              {tb.label}
            </button>
          ))}
        </div>
        <div style={{padding:"24px 20px",maxWidth:720,margin:"0 auto"}}>
          {tab === "learn" && (
            <div>
              <LearnView unit={u} />
              <div style={{textAlign:"center",marginTop:28}}>
                <button onClick={() => setTab("quiz")} style={{padding:"14px 36px",background:t.accent,color:"#fff",border:"none",borderRadius:12,fontSize:17,fontWeight:700,cursor:"pointer"}}>
                  Ready to Practice! →
                </button>
              </div>
            </div>
          )}
          {tab === "quiz" && <QuizView key={`q-${u.id}-${Date.now()}`} unit={u} onComplete={sc => mark(u.id, sc)} bestPct={bp} />}
          {tab === "match" && <MatchView key={`m-${u.id}-${Date.now()}`} unit={u} />}
          {tab === "sort" && <SortView key={`s-${u.id}-${Date.now()}`} unit={u} />}
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",background:"#FDFAF5",fontFamily:"'Outfit',sans-serif"}}>
      <div style={{padding:"44px 24px 28px",textAlign:"center",background:"linear-gradient(180deg,#FFF8F0,#FDFAF5)"}}>
        <div style={{fontSize:44,marginBottom:4}}>🏛️</div>
        <h1 style={{margin:0,fontSize:40,fontWeight:900,color:"#3D2C1E",letterSpacing:-1}}>LOGOS</h1>
        <p style={{margin:"6px 0 0",fontSize:16,color:"#8B7355",fontFamily:"'Literata',serif",fontStyle:"italic"}}>The Adventure of Clear Thinking</p>
        <div style={{maxWidth:300,margin:"16px auto 0"}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#B8A88A",marginBottom:4}}>
            <span>{mastered}/{total} mastered</span>
            <span>{Math.round(mastered/total*100)}%</span>
          </div>
          <div style={{height:6,background:"#EDE5D8",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",background:"linear-gradient(90deg,#E8722A,#F4A261)",borderRadius:3,width:`${mastered/total*100}%`,transition:"width 0.5s"}} />
          </div>
          <p style={{fontSize:11,color:"#B8A88A",marginTop:6}}>Score 80%+ on the quiz to master each unit and unlock the next</p>
        </div>
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"8px 20px 60px"}}>
        {REALM_ORDER.map(realm => {
          const t = THEMES[realm];
          const units = C.filter(u => u.realm === realm);
          const rc = units.filter(u => (prog.bestPct?.[u.id] || 0) >= MASTERY_THRESHOLD).length;
          return (
            <div key={realm} style={{marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <span style={{fontSize:24}}>{t.badge}</span>
                <div style={{flex:1}}>
                  <h2 style={{margin:0,fontSize:20,fontWeight:800,color:t.text}}>{t.label}</h2>
                  <span style={{fontSize:12,color:t.accent,fontWeight:600}}>{REALM_LABELS[realm]}</span>
                </div>
                {rc > 0 && <span style={{fontSize:12,color:t.sec,fontWeight:700,background:t.card,padding:"4px 10px",borderRadius:12}}>{rc}/{units.length}</span>}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {units.map(u => {
                  const locked = !isUnlocked(u.id, prog);
                  const bp = prog.bestPct?.[u.id] || 0;
                  const b = badgeFor(bp);
                  return (
                    <button key={u.id} onClick={() => !locked && setUnit(u.id)} style={{
                      display:"flex",alignItems:"center",gap:16,padding:"16px 20px",
                      background: locked ? "#f5f5f5" : "#fff",
                      border:`2px solid ${locked ? "#e0e0e0" : t.card}`,borderRadius:14,
                      cursor: locked ? "not-allowed" : "pointer",textAlign:"left",transition:"all 0.2s",
                      boxShadow: locked ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
                      opacity: locked ? 0.6 : 1,
                    }}
                      onMouseEnter={e => { if (!locked) { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-1px)"; }}}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = locked ? "#e0e0e0" : t.card; e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                      <div style={{width:40,height:40,borderRadius:10,background: locked ? "#e0e0e0" : t.card,display:"flex",alignItems:"center",justifyContent:"center",fontSize: locked ? 18 : 16,fontWeight:900,color: locked ? "#999" : t.accent,flexShrink:0,fontFamily:"'JetBrains Mono',monospace"}}>
                        {locked ? "🔒" : u.id}
                      </div>
                      <div style={{flex:1}}>
                        <h3 style={{margin:0,fontSize:15,fontWeight:700,color: locked ? "#999" : t.text}}>{u.title}</h3>
                        <p style={{margin:"2px 0 0",fontSize:12,color:t.text,opacity: locked ? 0.3 : 0.5}}>
                          {locked ? "Master the previous unit to unlock" : u.subtitle}
                        </p>
                      </div>
                      {b ? <span style={{fontSize:16}}>{b}</span> :
                       bp > 0 ? <span style={{fontSize:12,color:"#e65100",fontWeight:700}}>{bp}%</span> :
                       !locked ? <span style={{fontSize:18,color:t.accent}}>→</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {cc > 0 && (
          <div style={{textAlign:"center",marginTop:16}}>
            <button onClick={() => { if (confirm("Reset all progress?")) { localStorage.removeItem(STORAGE_KEY); setProg({completed:{},scores:{},bestPct:{}}); }}} style={{background:"none",border:"none",fontSize:13,color:"#ccc",cursor:"pointer",padding:"8px 16px"}}>
              Reset Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
