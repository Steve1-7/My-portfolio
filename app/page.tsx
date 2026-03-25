'use client'
import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll, useSpring as useSpringFn } from 'framer-motion'
import { OpenAIChatBot } from './components/OpenAIChatBot'

// ── THEME ──────────────────────────────────────────────────────────────────────
const THEMES = {
  neon: { name:'Neon', a:'#00FF00', b:'#C77DFF', bg:'#050505', card:'#0A0A0A' },
  gold: { name:'Gold', a:'#F9CA24', b:'#FF6B6B', bg:'#050402', card:'#0C0A04' },
  ice:  { name:'Ice',  a:'#38BDF8', b:'#ffffff', bg:'#030508', card:'#07090F' },
}
type ThemeKey = keyof typeof THEMES
const ThemeCtx = createContext<{theme:ThemeKey;t:typeof THEMES.neon;setTheme:(k:ThemeKey)=>void}>({theme:'neon',t:THEMES.neon,setTheme:()=>{}})
const useTheme = () => useContext(ThemeCtx)

// ── TOASTS ─────────────────────────────────────────────────────────────────────
interface ToastItem { id:number; msg:string; icon:string }
const ToastCtx = createContext<(msg:string,icon?:string)=>void>(()=>{})
const useToast = () => useContext(ToastCtx)

function ToastProvider({ children }:{ children:React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)
  const add = useCallback((msg:string, icon='✦') => {
    const id = nextId.current++
    setToasts(p => [...p, {id, msg, icon}])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200)
  }, [])
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{position:'fixed',bottom:110,left:'50%',transform:'translateX(-50%)',zIndex:99000,display:'flex',flexDirection:'column',gap:8,alignItems:'center',pointerEvents:'none'}}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{opacity:0,y:20,scale:.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-12,scale:.9}}
              style={{display:'flex',alignItems:'center',gap:10,padding:'10px 20px',borderRadius:2,backdropFilter:'blur(20px)',background:'rgba(5,5,5,0.97)',border:'1px solid rgba(0,255,0,0.18)',boxShadow:'0 0 30px rgba(0,255,0,0.08)',whiteSpace:'nowrap'}}>
              <span style={{fontSize:14}}>{t.icon}</span>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,color:'#00FF00'}}>{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

// ── SCROLL PROGRESS BAR ────────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { t } = useTheme()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpringFn(scrollYProgress, { stiffness:200, damping:30 })
  return <motion.div style={{position:'fixed',top:0,left:0,right:0,height:2,transformOrigin:'0%',scaleX,zIndex:9999,background:`linear-gradient(90deg,${t.a},${t.b})`,boxShadow:`0 0 10px ${t.a}`}} />
}

// ── INFINITE MARQUEE ───────────────────────────────────────────────────────────
function Marquee({ items }:{ items:string[] }) {
  const { t } = useTheme()
  const doubled = [...items, ...items]
  return (
    <div style={{overflow:'hidden',borderTop:'1px solid rgba(255,255,255,0.04)',borderBottom:'1px solid rgba(255,255,255,0.04)',background:'rgba(255,255,255,0.01)',padding:'14px 0',position:'relative'}}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:80,background:`linear-gradient(to right,${t.bg},transparent)`,zIndex:1,pointerEvents:'none'}} />
      <div style={{position:'absolute',right:0,top:0,bottom:0,width:80,background:`linear-gradient(to left,${t.bg},transparent)`,zIndex:1,pointerEvents:'none'}} />
      <motion.div animate={{x:['0%','-50%']}} transition={{duration:30,repeat:Infinity,ease:'linear'}} style={{display:'flex',width:'max-content'}}>
        {doubled.map((item,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',flexShrink:0}}>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'rgba(255,255,255,0.28)',letterSpacing:'0.15em',padding:'0 28px',whiteSpace:'nowrap',textTransform:'uppercase'}}>{item}</span>
            <span style={{color:t.a,opacity:.4,fontSize:8,flexShrink:0}}>◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ── TYPEWRITER ─────────────────────────────────────────────────────────────────
function Typewriter({ words }:{ words:string[] }) {
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  const [blink, setBlink] = useState(true)
  const { t } = useTheme()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!del) { if (ci < words[wi].length) setCi(c=>c+1); else setTimeout(()=>setDel(true),1400) }
      else { if (ci>0) setCi(c=>c-1); else { setDel(false); setWi(w=>(w+1)%words.length) } }
    }, del?40:80)
    return () => clearTimeout(timer)
  }, [ci, del, wi, words])
  useEffect(() => { const i = setInterval(()=>setBlink(b=>!b),530); return ()=>clearInterval(i) }, [])
  return <span>{words[wi].slice(0,ci)}<span style={{opacity:blink?1:0,color:t.b,transition:'opacity .1s'}}>|</span></span>
}

// ── GLITCH HEADING ─────────────────────────────────────────────────────────────
function GlitchText({ text, style={} }:{ text:string; style?:React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref,{once:true,margin:'-60px'})
  const [on, setOn] = useState(false)
  useEffect(() => { if(!inView)return; setOn(true); const t=setTimeout(()=>setOn(false),600); return ()=>clearTimeout(t) }, [inView])
  return (
    <span ref={ref} style={{position:'relative',display:'inline-block',...style}}>
      {text}
      {on && <>
        <span aria-hidden style={{position:'absolute',top:0,left:0,color:'#ff003c',clipPath:'polygon(0 15%,100% 15%,100% 40%,0 40%)',transform:'translate(3px,0)',opacity:.8,pointerEvents:'none',width:'100%'}}>{text}</span>
        <span aria-hidden style={{position:'absolute',top:0,left:0,color:'#00FFFF',clipPath:'polygon(0 60%,100% 60%,100% 80%,0 80%)',transform:'translate(-3px,0)',opacity:.8,pointerEvents:'none',width:'100%'}}>{text}</span>
      </>}
    </span>
  )
}

// ── LIVE TIME ──────────────────────────────────────────────────────────────────
function LiveTime() {
  const [time, setTime] = useState('')
  const { t } = useTheme()
  useEffect(() => {
    const upd = ()=>setTime(new Date().toLocaleTimeString('en-ZA',{timeZone:'Africa/Johannesburg',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}))
    upd(); const i=setInterval(upd,1000); return ()=>clearInterval(i)
  }, [])
  return <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:`${t.a}50`,letterSpacing:'0.08em'}}>🕐 Steve&apos;s time: <span style={{color:t.a}}>{time}</span> SAST</span>
}

// ── KEYBOARD SHORTCUTS ─────────────────────────────────────────────────────────
function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  const { t } = useTheme()
  useEffect(() => {
    const h=(e:KeyboardEvent)=>{ if(e.key==='?'&&!e.metaKey&&!e.ctrlKey) setOpen(v=>!v); if(e.key==='Escape') setOpen(false) }
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h)
  }, [])
  const rows = [
    {keys:['⌘','K'],desc:'Command palette'},
    {keys:['?'],desc:'Keyboard shortcuts'},
    {keys:['↑↑↓↓←→BA'],desc:'Easter egg 🎮'},
    {keys:['ESC'],desc:'Close any overlay'},
    {keys:['←','→'],desc:'Gallery lightbox nav'},
    {keys:['G'],desc:'Jump to GitHub'},
    {keys:['S'],desc:'Share portfolio link'},
  ]
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)}
          style={{position:'fixed',inset:0,zIndex:9200,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.85)',backdropFilter:'blur(16px)'}}>
          <motion.div initial={{scale:.92,opacity:0,y:-20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:.92,opacity:0}} onClick={e=>e.stopPropagation()}
            style={{width:'100%',maxWidth:460,borderRadius:2,background:'#080808',border:`1px solid ${t.a}18`,boxShadow:`0 0 80px ${t.a}08`,overflow:'hidden'}}>
            <div style={{height:1,background:`linear-gradient(90deg,transparent,${t.a},${t.b},transparent)`}} />
            <div style={{padding:'24px 28px 28px'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
                <div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:17,color:'#fff'}}>Keyboard Shortcuts</div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.2)',marginTop:4}}>Press ? to toggle</div>
                </div>
                <button onClick={()=>setOpen(false)} data-hover="true" style={{width:32,height:32,borderRadius:2,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'#666',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {rows.map((r,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderRadius:2,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.04)'}}>
                    <span style={{fontFamily:'DM Sans,sans-serif',fontSize:13,color:'rgba(255,255,255,0.5)'}}>{r.desc}</span>
                    <div style={{display:'flex',gap:4}}>
                      {r.keys.map((k,j)=><kbd key={j} style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,padding:'3px 7px',borderRadius:2,background:`${t.a}10`,border:`1px solid ${t.a}25`,color:t.a}}>{k}</kbd>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── THEME SWITCHER ─────────────────────────────────────────────────────────────
function ThemeSwitcher() {
  const { theme, setTheme, t } = useTheme()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  return (
    <div style={{position:'relative'}}>
      <button onClick={()=>setOpen(v=>!v)} data-hover="true"
        style={{padding:'7px 12px',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:10,background:`${t.a}0C`,border:`1px solid ${t.a}25`,color:t.a,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:8,height:8,borderRadius:1,background:`linear-gradient(135deg,${t.a},${t.b})`}} />
        {THEMES[theme].name}<span style={{opacity:.5,fontSize:8}}>▼</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,scale:.92,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.92,y:-8}}
            style={{position:'absolute',top:'110%',right:0,width:148,borderRadius:2,background:'#080808',border:'1px solid rgba(255,255,255,0.08)',boxShadow:'0 20px 60px rgba(0,0,0,0.9)',overflow:'hidden',zIndex:999}}>
            {(Object.keys(THEMES) as ThemeKey[]).map(k=>(
              <button key={k} onClick={()=>{setTheme(k);setOpen(false);toast(`Theme: ${THEMES[k].name}`,'◈')}} data-hover="true"
                style={{width:'100%',padding:'10px 14px',display:'flex',alignItems:'center',gap:10,background:theme===k?`${THEMES[k].a}08`:'transparent',border:'none',borderLeft:`2px solid ${theme===k?THEMES[k].a:'transparent'}`,cursor:'pointer',transition:'all .2s'}}>
                <span style={{width:10,height:10,borderRadius:1,background:`linear-gradient(135deg,${THEMES[k].a},${THEMES[k].b})`,flexShrink:0}} />
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:theme===k?THEMES[k].a:'rgba(255,255,255,0.35)'}}>{THEMES[k].name}</span>
                {theme===k&&<span style={{marginLeft:'auto',color:THEMES[k].a,fontSize:10}}>✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── CURSOR LABEL FOLLOWER ──────────────────────────────────────────────────────
function CursorFollower() {
  const [label, setLabel] = useState('')
  const [pos, setPos] = useState({x:-200,y:-200})
  const { t } = useTheme()
  useEffect(() => {
    const mv=(e:MouseEvent)=>setPos({x:e.clientX,y:e.clientY})
    const ov=(e:MouseEvent)=>{ const el=e.target as HTMLElement; const c=el.closest('[data-label]') as HTMLElement|null; setLabel(c?c.dataset.label||'':'') }
    window.addEventListener('mousemove',mv); window.addEventListener('mouseover',ov)
    return ()=>{ window.removeEventListener('mousemove',mv); window.removeEventListener('mouseover',ov) }
  }, [])
  return (
    <AnimatePresence>
      {label&&<motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.8}}
        style={{position:'fixed',left:pos.x+20,top:pos.y-14,zIndex:9998,pointerEvents:'none',fontFamily:'JetBrains Mono,monospace',fontSize:11,padding:'4px 10px',borderRadius:2,background:'rgba(5,5,5,0.95)',border:`1px solid ${t.a}30`,color:t.a,backdropFilter:'blur(10px)',whiteSpace:'nowrap'}}>
        {label}
      </motion.div>}
    </AnimatePresence>
  )
}

// ── MOUSE TRAIL ────────────────────────────────────────────────────────────────
function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useTheme()
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    canvas.width = window.innerWidth; canvas.height = window.innerHeight
    const trail: {x:number;y:number;life:number;sz:number;c:string}[] = []
    const mv = (e:MouseEvent) => {
      for(let j=0;j<3;j++) trail.push({x:e.clientX+(Math.random()-.5)*8,y:e.clientY+(Math.random()-.5)*8,life:1,sz:Math.random()*2.5+1,c:Math.random()>.5?t.a:t.b})
    }
    window.addEventListener('mousemove',mv)
    let raf: number
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      for(let i=trail.length-1;i>=0;i--) {
        const p=trail[i]; p.life -= 0.042
        if(p.life<=0){trail.splice(i,1);continue}
        const hex = Math.floor(p.life*50).toString(16).padStart(2,'0')
        ctx.beginPath(); ctx.arc(p.x,p.y,p.sz*p.life,0,Math.PI*2)
        ctx.fillStyle=`${p.c}${hex}`; ctx.fill()
      }
      raf=requestAnimationFrame(draw)
    }
    draw()
    const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight}
    window.addEventListener('resize',resize)
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('mousemove',mv);window.removeEventListener('resize',resize)}
  },[t.a,t.b])
  return <canvas ref={canvasRef} style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9996}} />
}

// ── CUSTOM CURSOR ──────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const [particles, setParticles] = useState<{id:number;x:number;y:number;vx:number;vy:number;life:number;color:string}[]>([])
  const pos = useRef({x:-100,y:-100})
  const ringPos = useRef({x:-100,y:-100})
  const raf = useRef(0)
  const pid = useRef(0)
  const { t } = useTheme()
  useEffect(()=>{
    const mv=(e:MouseEvent)=>{ pos.current={x:e.clientX,y:e.clientY}; if(dotRef.current) dotRef.current.style.transform=`translate(${e.clientX-6}px,${e.clientY-6}px)` }
    const ov=(e:MouseEvent)=>{ const el=e.target as HTMLElement; setHover(!!el.closest('a,button,[data-hover]')) }
    const cl=(e:MouseEvent)=>{ const cols=[t.a,t.b,'#fff']; setParticles(p=>[...p.slice(-20),...Array.from({length:12},(_,i)=>({id:pid.current++,x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*14,vy:(Math.random()-.5)*14,life:1,color:cols[Math.floor(Math.random()*cols.length)]}))]) }
    const anim=()=>{ ringPos.current.x+=(pos.current.x-ringPos.current.x)*.1; ringPos.current.y+=(pos.current.y-ringPos.current.y)*.1; if(ringRef.current) ringRef.current.style.transform=`translate(${ringPos.current.x-20}px,${ringPos.current.y-20}px)`; raf.current=requestAnimationFrame(anim) }
    raf.current=requestAnimationFrame(anim)
    window.addEventListener('mousemove',mv); window.addEventListener('mouseover',ov); window.addEventListener('click',cl)
    return ()=>{ cancelAnimationFrame(raf.current); window.removeEventListener('mousemove',mv); window.removeEventListener('mouseover',ov); window.removeEventListener('click',cl) }
  },[t.a,t.b])
  useEffect(()=>{
    if(!particles.length)return
    const timer=setInterval(()=>setParticles(p=>p.map(q=>({...q,x:q.x+q.vx,y:q.y+q.vy,vy:q.vy+.5,life:q.life-.07})).filter(q=>q.life>0)),16)
    return ()=>clearInterval(timer)
  },[particles.length])
  return (
    <>
      <div ref={dotRef} style={{position:'fixed',top:0,left:0,width:hover?16:12,height:hover?16:12,borderRadius:2,background:hover?t.b:t.a,pointerEvents:'none',zIndex:9999,boxShadow:`0 0 15px ${hover?t.b:t.a},0 0 30px ${hover?t.b:t.a}40`,transition:'width .15s,height .15s,background .15s',mixBlendMode:'screen'}} />
      <div ref={ringRef} style={{position:'fixed',top:0,left:0,width:40,height:40,borderRadius:2,border:`1px solid ${hover?t.b:t.a}60`,pointerEvents:'none',zIndex:9998}} />
      {particles.map(p=><div key={p.id} style={{position:'fixed',top:0,left:0,width:5,height:5,borderRadius:'50%',background:p.color,opacity:p.life,pointerEvents:'none',zIndex:9997,transform:`translate(${p.x-2.5}px,${p.y-2.5}px)`,boxShadow:`0 0 6px ${p.color}`}} />)}
    </>
  )
}

// ── PAGE LOADER ────────────────────────────────────────────────────────────────
function PageLoader({ onDone }:{ onDone:()=>void }) {
  const [lines, setLines] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [exiting, setExiting] = useState(false)
  const BOOT=['INITIALIZING STEVE"S OS v4.0...','LOADING CREATIVE MODULES............[OK]','MOUNTING DESIGN SYSTEMS..............[OK]','INJECTING NEON PROTOCOLS.............[OK]','SYNCING LIVE DEPLOYMENTS.............[OK]','CALIBRATING VISUAL ENGINE............[OK]','ESTABLISHING NEURAL LINK.............[OK]','▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%','✦ WELCOME — STEVE RONALD PORTFOLIO']
  useEffect(()=>{
    BOOT.forEach((_,i)=>{ setTimeout(()=>{ setLines(p=>[...p,i]); setProgress(Math.round(((i+1)/BOOT.length)*100)) },i*180+300) })
    setTimeout(()=>{ setExiting(true); setTimeout(onDone,700) },BOOT.length*180+900)
  },[])
  return (
    <AnimatePresence>
      {!exiting&&(
        <motion.div exit={{opacity:0,scale:1.04}} transition={{duration:.7}}
          style={{position:'fixed',inset:0,zIndex:99999,background:'#050505',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'2rem'}}>
          <div style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,.015) 2px,rgba(0,255,0,.015) 4px)'}} />
          <div style={{width:'100%',maxWidth:560,position:'relative',zIndex:1}}>
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} style={{textAlign:'center',marginBottom:'2.5rem'}}>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2rem,6vw,3.5rem)',letterSpacing:'-0.03em',lineHeight:1}}>
                <span style={{color:'#00FF00',textShadow:'0 0 40px #00FF00,0 0 80px #00FF0040'}}>STE</span>
                <span style={{color:'#C77DFF',textShadow:'0 0 40px #C77DFF,0 0 80px #C77DFF40'}}>VE</span>
              </div>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,letterSpacing:'0.35em',color:'rgba(255,255,255,0.25)',marginTop:8,textTransform:'uppercase'}}>Full Stack Developer</div>
            </motion.div>
            <div style={{background:'rgba(0,255,0,0.02)',border:'1px solid rgba(0,255,0,0.1)',borderRadius:2,padding:'1.5rem',marginBottom:'1.5rem',minHeight:220}}>
              <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:'1rem',paddingBottom:'0.75rem',borderBottom:'1px solid rgba(0,255,0,0.08)'}}>
                {['#FF5F57','#FFBD2E','#28CA41'].map(c=><div key={c} style={{width:10,height:10,borderRadius:'50%',background:c}} />)}
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(0,255,0,0.3)',marginLeft:8}}>omnicreava@studio:~$</span>
              </div>
              {BOOT.map((line,i)=>lines.includes(i)&&(
                <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                  style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,lineHeight:'1.8',color:i===BOOT.length-1?'#00FF00':line.includes('[OK]')?'rgba(0,255,0,0.65)':'rgba(0,255,0,0.35)',fontWeight:i===BOOT.length-1?700:400}}>
                  {i<BOOT.length-1&&<span style={{color:'rgba(0,255,0,0.2)'}}>$ </span>}{line}
                  {lines[lines.length-1]===i&&<span style={{display:'inline-block',width:8,height:12,background:'#00FF00',marginLeft:4,verticalAlign:'middle',animation:'blink 1s step-end infinite'}} />}
                </motion.div>
              ))}
            </div>
            <div style={{height:1,background:'rgba(0,255,0,0.08)',overflow:'hidden'}}>
              <motion.div initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:.3}} style={{height:'100%',background:'linear-gradient(90deg,#00FF00,#C77DFF)',boxShadow:'0 0 10px #00FF00'}} />
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:6,fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(0,255,0,0.3)'}}>
              <span>BOOT SEQUENCE</span><span>{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── COMMAND PALETTE ────────────────────────────────────────────────────────────
function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const [isMobile,setIsMobile]=useState(typeof window!=='undefined'?window.innerWidth<768:false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTheme()
  const toast = useToast()
  useEffect(()=>{
    const resize=()=>setIsMobile(window.innerWidth<768)
    window.addEventListener('resize',resize); return ()=>window.removeEventListener('resize',resize)
  },[])
  const go = (id:string)=>{ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setOpen(false) }
  const cmds = [
    {id:'home',label:'Home',desc:'Back to top',icon:'⌂',cat:'Navigate',action:()=>go('hero')},
    {id:'about',label:'About Me',desc:'Background & timeline',icon:'◉',cat:'Navigate',action:()=>go('about')},
    {id:'skills',label:'Skills',desc:'Core strengths',icon:'⚡',cat:'Navigate',action:()=>go('skills')},
    {id:'projects',label:'Projects',desc:'Live platforms',icon:'⊞',cat:'Navigate',action:()=>go('projects')},
    {id:'services',label:'Services',desc:'Pricing & packages',icon:'💎',cat:'Navigate',action:()=>go('services')},
    {id:'testimonials',label:'Testimonials',desc:'Client reviews',icon:'★',cat:'Navigate',action:()=>go('testimonials')},
    {id:'gallery',label:'Gallery',desc:'Logos & 3D work',icon:'◈',cat:'Navigate',action:()=>go('gallery')},
    {id:'contact',label:'Contact',desc:'Hire Steve',icon:'✉',cat:'Navigate',action:()=>go('contact')},
    {id:'email',label:'Copy Email',desc:'stevezuluu@gmail.com',icon:'@',cat:'Actions',action:()=>{ navigator.clipboard.writeText('stevezuluu@gmail.com'); toast('Email copied!','✓'); setOpen(false) }},
    {id:'share',label:'Share Portfolio',desc:'Copy link',icon:'↗',cat:'Actions',action:()=>{ navigator.clipboard.writeText(window.location.href); toast('Link copied!','🔗'); setOpen(false) }},
    {id:'gh',label:'GitHub',desc:'Steve1-7',icon:'⌥',cat:'Social',action:()=>{ window.open('https://github.com/Steve1-7','_blank'); setOpen(false) }},
    {id:'li',label:'LinkedIn',desc:'steve-ronald1710s',icon:'in',cat:'Social',action:()=>{ window.open('https://www.linkedin.com/in/steve-ronald1710s/','_blank'); setOpen(false) }},
  ]
  const filtered = q?cmds.filter(c=>c.label.toLowerCase().includes(q.toLowerCase())||c.desc.toLowerCase().includes(q.toLowerCase())):cmds
  const cats = [...new Set(filtered.map(c=>c.cat))]
  useEffect(()=>{ const h=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();setOpen(v=>!v);setQ('');setSel(0)} if(e.key==='Escape')setOpen(false) }; window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h) },[])
  useEffect(()=>{ if(open) setTimeout(()=>inputRef.current?.focus(),50) },[open])
  const handleKey=(e:React.KeyboardEvent)=>{ if(e.key==='ArrowDown'){e.preventDefault();setSel(s=>Math.min(s+1,filtered.length-1))} if(e.key==='ArrowUp'){e.preventDefault();setSel(s=>Math.max(s-1,0))} if(e.key==='Enter')filtered[sel]?.action() }
  return (
    <>
      <button onClick={()=>setOpen(true)} data-hover="true" style={{position:'fixed',bottom:32,right:32,zIndex:1000,display:'flex',alignItems:'center',gap:'clamp(4px,1vw,8px)',padding:'clamp(8px,1.5vw,10px) clamp(12px,2vw,16px)',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(9px,1.5vw,11px)',background:'rgba(5,5,5,0.9)',border:`1px solid ${t.a}18`,color:`${t.a}55`,backdropFilter:'blur(20px)',flexWrap:'wrap',justifyContent:'center',maxWidth:'clamp(44px,80vw,200px)',whiteSpace:typeof window!=='undefined'&&window.innerWidth<640?'nowrap':'normal'}}>
        <span style={{color:'rgba(255,255,255,0.2)'}}>⌘K</span><span style={{display:typeof window!=='undefined'&&window.innerWidth<640?'none':'inline'}}>Command</span>
      </button>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)}
            style={{position:'fixed',inset:0,zIndex:9000,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:isMobile?'50vh':' 15vh',background:'rgba(0,0,0,0.8)',backdropFilter:'blur(20px)'}}>
            <motion.div initial={{opacity:0,scale:.95,y:-20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95}} transition={{duration:.2}}
              onClick={e=>e.stopPropagation()} onKeyDown={handleKey}
              style={{width:isMobile?'90%':'90%',maxWidth:isMobile?'100%':'560px',borderRadius:2,background:'#080808',border:`1px solid ${t.a}12`,boxShadow:`0 0 80px ${t.a}06`,overflow:'hidden'}}>
              <div style={{height:1,background:`linear-gradient(90deg,transparent,${t.a},${t.b},transparent)`}} />
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'clamp(10px,2vw,14px) clamp(12px,2vw,16px)',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <span style={{color:`${t.a}50`,fontSize:'clamp(12px,2vw,16px)'}}></span>
                <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search commands..." style={{flex:1,background:'transparent',border:'none',outline:'none',fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(11px,2vw,13px)',color:'#fff'}} />
                <kbd style={{fontSize:'clamp(8px,1.5vw,10px)',padding:'3px 7px',borderRadius:2,background:'rgba(255,255,255,0.05)',color:'#555',border:'1px solid rgba(255,255,255,0.06)',fontFamily:'JetBrains Mono,monospace'}}>ESC</kbd>
              </div>
              <div style={{maxHeight:isMobile?'calc(100vh - 200px)':'320px',overflowY:'auto',padding:'6px 0'}}>
                {cats.map(cat=>(
                  <div key={cat}>
                    <div style={{padding:'6px 16px 4px',fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(8px,1.2vw,10px)',color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{cat}</div>
                    {filtered.filter(c=>c.cat===cat).map(cmd=>{
                      const gi=filtered.indexOf(cmd)
                      return <button key={cmd.id} onClick={cmd.action} onMouseEnter={()=>setSel(gi)}
                        style={{width:'100%',display:'flex',alignItems:'center',gap:'clamp(8px,1.5vw,12px)',padding:'clamp(8px,1.5vw,10px) clamp(12px,2vw,16px)',background:sel===gi?`${t.a}07`:'transparent',borderLeft:`2px solid ${sel===gi?t.a:'transparent'}`,cursor:'pointer',textAlign:'left',border:'none'}}>
                        <span style={{width:'clamp(24px,5vw,32px)',height:'clamp(24px,5vw,32px)',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:2,background:sel===gi?`${t.a}12`:'rgba(255,255,255,0.03)',color:sel===gi?t.a:'#555',fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(11px,1.5vw,13px)',flexShrink:0}}>{cmd.icon}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:'Syne,sans-serif',fontWeight:600,fontSize:'clamp(11px,1.5vw,13px)',color:sel===gi?'#fff':'#777'}}>{cmd.label}</div>
                          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(8px,1.2vw,10px)',color:'#444',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cmd.desc}</div>
                        </div>
                      </button>
                    })}
                  </div>
                ))}
              </div>
              <div style={{padding:'10px 16px',borderTop:'1px solid rgba(255,255,255,0.03)',display:'flex',justifyContent:'space-between',fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(8px,1.2vw,10px)',color:'#333'}}>
                <span>↑↓ navigate · ↵ select</span>
                <span style={{color:`${t.a}30`}}>{filtered.length} commands</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── AI CHATBOT ─────────────────────────────────────────────────────────────────
function AIChatBot() {
  return <OpenAIChatBot />
}

// ── CONTEXT MENU ───────────────────────────────────────────────────────────────
function ContextMenu() {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState({x:0,y:0})
  const menuRef = useRef<HTMLDivElement>(null)
  const { t } = useTheme()
  const toast = useToast()
  const items = [
    {label:'Copy URL',icon:'⎘',action:()=>{ navigator.clipboard.writeText(window.location.href); toast('URL copied!','⎘'); setVisible(false) }},
    {label:'Share Portfolio',icon:'↗',action:()=>{ navigator.clipboard.writeText('Check out this incredible portfolio: '+window.location.href); toast('Share link copied!','🔗'); setVisible(false) }},
    {label:'Contact Steve',icon:'✉',action:()=>{ document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); setVisible(false) }},
    {label:'GitHub',icon:'⌥',action:()=>{ window.open('https://github.com/Steve1-7','_blank'); setVisible(false) }},
    {label:'⌘K Commands',icon:'⌘',action:()=>{ setVisible(false); setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'k',metaKey:true,bubbles:true})),100) }},
    {label:'? Shortcuts',icon:'?',action:()=>{ setVisible(false); setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'?',bubbles:true})),100) }},
  ]
  useEffect(()=>{
    const ctx=(e:MouseEvent)=>{ e.preventDefault(); setPos({x:Math.min(e.clientX,window.innerWidth-210),y:Math.min(e.clientY,window.innerHeight-300)}); setVisible(true) }
    const close=(e:MouseEvent)=>{ if(menuRef.current&&!menuRef.current.contains(e.target as Node))setVisible(false) }
    const key=(e:KeyboardEvent)=>{ if(e.key==='Escape')setVisible(false) }
    window.addEventListener('contextmenu',ctx); window.addEventListener('click',close); window.addEventListener('keydown',key)
    return ()=>{ window.removeEventListener('contextmenu',ctx); window.removeEventListener('click',close); window.removeEventListener('keydown',key) }
  },[])
  return (
    <AnimatePresence>
      {visible&&(
        <motion.div ref={menuRef} initial={{opacity:0,scale:.92,y:-8}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.92,y:-8}} transition={{duration:.15}}
          style={{position:'fixed',zIndex:9500,width:200,borderRadius:2,left:pos.x,top:pos.y,background:'rgba(6,6,6,0.98)',border:`1px solid ${t.a}12`,boxShadow:'0 20px 60px rgba(0,0,0,0.9)',backdropFilter:'blur(20px)',overflow:'hidden'}}>
          <div style={{height:1,background:`linear-gradient(90deg,${t.a},${t.b},transparent)`}} />
          <div style={{padding:'6px 12px 4px',fontFamily:'JetBrains Mono,monospace',fontSize:9,color:`${t.a}40`,textTransform:'uppercase',letterSpacing:'0.15em'}}>OmniCreava Studio</div>
          <div style={{height:1,margin:'0 10px 4px',background:'rgba(255,255,255,0.04)'}} />
          {items.map((item,i)=>(
            <button key={i} onClick={item.action} data-hover="true" style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left',transition:'background .15s'}}
              onMouseEnter={e=>(e.currentTarget.style.background=`${t.a}06`)} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <span style={{width:22,height:22,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:2,background:'rgba(255,255,255,0.03)',color:'#555',fontSize:11,fontFamily:'JetBrains Mono,monospace',flexShrink:0}}>{item.icon}</span>
              <span style={{fontFamily:'DM Sans,sans-serif',fontSize:12,color:'#666'}}>{item.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── NOISE + COUNT UP + SCRAMBLE + TILT + SKILLBAR + PARTICLES ─────────────────
function NoiseOverlay() {
  return <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:9990,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,backgroundSize:'200px 200px',opacity:.025,mixBlendMode:'overlay'}} />
}

function CountUp({end,suffix='',decimals=0,duration=2000,style={}}:{end:number;suffix?:string;decimals?:number;duration?:number;style?:React.CSSProperties}) {
  const ref=useRef<HTMLSpanElement>(null)
  const inView=useInView(ref,{once:true,margin:'-40px'})
  const [val,setVal]=useState(0)
  const started=useRef(false)
  useEffect(()=>{
    if(!inView||started.current)return
    started.current=true
    const start=performance.now()
    const step=(now:number)=>{ const p=Math.min((now-start)/duration,1); const e=p===1?1:1-Math.pow(2,-10*p); setVal(parseFloat((e*end).toFixed(decimals))); if(p<1)requestAnimationFrame(step) }
    requestAnimationFrame(step)
  },[inView,end,duration,decimals])
  return <span ref={ref} style={style}>{val.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals})}{suffix}</span>
}

const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
function ScrambleText({text,trigger=true,style={}}:{text:string;trigger?:boolean;style?:React.CSSProperties}) {
  const [display,setDisplay]=useState(text)
  const frame=useRef<ReturnType<typeof setInterval>|null>(null)
  const scramble=useCallback(()=>{
    let it=0; if(frame.current)clearInterval(frame.current)
    frame.current=setInterval(()=>{ setDisplay(text.split('').map((c,i)=>{ if(c===' ')return ' '; if(i<it)return text[i]; return CHARS[Math.floor(Math.random()*CHARS.length)] }).join('')); if(it>=text.length){if(frame.current)clearInterval(frame.current)} it+=0.4 },28)
  },[text])
  useEffect(()=>{ if(trigger)scramble(); return ()=>{ if(frame.current)clearInterval(frame.current) } },[trigger,scramble])
  return <span style={style} onMouseEnter={scramble}>{display}</span>
}

function TiltCard({children,style={},className=''}:{children:React.ReactNode;style?:React.CSSProperties;className?:string}) {
  const ref=useRef<HTMLDivElement>(null)
  const x=useMotionValue(0); const y=useMotionValue(0)
  const rx=useSpring(useTransform(y,[-.5,.5],[7,-7]),{stiffness:280,damping:28})
  const ry=useSpring(useTransform(x,[-.5,.5],[-7,7]),{stiffness:280,damping:28})
  const mv=(e:React.MouseEvent)=>{ if(!ref.current)return; const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left)/r.width-.5); y.set((e.clientY-r.top)/r.height-.5) }
  const ml=()=>{ x.set(0); y.set(0) }
  return <motion.div ref={ref} onMouseMove={mv} onMouseLeave={ml} style={{rotateX:rx,rotateY:ry,transformStyle:'preserve-3d',perspective:900,...style}} className={className}>{children}</motion.div>
}

function SkillBar({name,level,color}:{name:string;level:number;color:string}) {
  const ref=useRef<HTMLDivElement>(null)
  const inView=useInView(ref,{once:true,margin:'-20px'})
  return (
    <div ref={ref}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <span style={{fontFamily:'DM Sans,sans-serif',fontSize:13,color:'rgba(255,255,255,0.65)'}}>{name}</span>
        <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'rgba(255,255,255,0.2)'}}>{level}%</span>
      </div>
      <div style={{height:3,borderRadius:2,background:'rgba(255,255,255,0.04)',overflow:'hidden'}}>
        <motion.div initial={{width:0}} animate={inView?{width:`${level}%`}:{}} transition={{duration:1.2,ease:[0.22,1,0.36,1],delay:.1}}
          style={{height:'100%',borderRadius:2,background:`linear-gradient(90deg,${color},${color}70)`,boxShadow:`0 0 8px ${color}60`}} />
      </div>
    </div>
  )
}

function ParticleField() {
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const { t } = useTheme()
  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas)return
    const ctx=canvas.getContext('2d'); if(!ctx)return
    canvas.width=window.innerWidth; canvas.height=window.innerHeight
    const pts=Array.from({length:70},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.4+.4,c:Math.random()>.6?t.a:t.b}))
    let mouse={x:-999,y:-999}
    const mv=(e:MouseEvent)=>{ mouse={x:e.clientX,y:e.clientY} }
    window.addEventListener('mousemove',mv)
    let raf:number
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height)
      pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>canvas.width)p.vx*=-1; if(p.y<0||p.y>canvas.height)p.vy*=-1
        const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy); if(d<100){p.x+=dx*.025;p.y+=dy*.025}
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.c+'70'; ctx.fill()
      })
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy)
        if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`${t.a}${Math.floor(.07*(1-d/90)*255).toString(16).padStart(2,'0')}`; ctx.lineWidth=.5; ctx.stroke() }
      }
      raf=requestAnimationFrame(draw)
    }
    draw()
    const resize=()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight }
    window.addEventListener('resize',resize)
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('mousemove',mv); window.removeEventListener('resize',resize) }
  },[t.a,t.b])
  return <canvas ref={canvasRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0}} />
}

// ── NAV ────────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled,setScrolled]=useState(false)
  const [menuOpen,setMenuOpen]=useState(false)
  const [active,setActive]=useState('hero')
  const [isMobile,setIsMobile]=useState(typeof window!=='undefined'?window.innerWidth<768:false)
  const { t } = useTheme()
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>60); window.addEventListener('scroll',fn,{passive:true}); return ()=>window.removeEventListener('scroll',fn) },[])
  useEffect(()=>{
    const resize=()=>setIsMobile(window.innerWidth<768)
    window.addEventListener('resize',resize); return ()=>window.removeEventListener('resize',resize)
  },[])
  useEffect(()=>{
    const sections=['hero','about','skills','projects','services','testimonials','gallery','contact']
    const fn=()=>{
      let cur='hero'
      sections.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=120)cur=id})
      setActive(cur)
      if(cur==='hero') window.history.replaceState(null,'',window.location.pathname)
      else window.history.replaceState(null,'',`#${cur}`)
    }
    window.addEventListener('scroll',fn,{passive:true}); return ()=>window.removeEventListener('scroll',fn)
  },[])
  const go=(id:string)=>{ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setActive(id); setMenuOpen(false) }
  const links=[{id:'about',l:'About'},{id:'skills',l:'Skills'},{id:'projects',l:'Work'},{id:'services',l:'Services'},{id:'testimonials',l:'Reviews'},{id:'gallery',l:'Gallery'},{id:'contact',l:'Contact'}]
  return (
    <>
      <motion.nav initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.7,delay:.2}}
        style={{position:'fixed',top:0,width:'100%',zIndex:800,background:scrolled?'rgba(5,5,5,0.97)':'rgba(5,5,5,0.3)',borderBottom:`1px solid ${scrolled?t.a+'07':'transparent'}`,backdropFilter:'blur(24px)',transition:'all .4s ease'}}>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${t.a}35,${t.b}35,transparent)`}} />
        <div style={{maxWidth:1280,margin:'0 auto',padding:'clamp(8px,2.5vw,12px) clamp(16px,4vw,24px)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'clamp(8px,2vw,16px)'}}>
          <button onClick={()=>go('hero')} data-hover="true" style={{display:'flex',alignItems:'center',gap:'clamp(6px,1.5vw,12px)',background:'none',border:'none',cursor:'pointer',flexShrink:0}}>
            <div style={{width:'clamp(28px,6vw,34px)',height:'clamp(28px,6vw,34px)',borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(10px,2vw,12px)',background:`${t.a}10`,border:`1px solid ${t.a}25`,color:t.a}}>SR</div>
            {!isMobile&&<span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(11px,2vw,13px)',color:'#fff',letterSpacing:'0.05em'}}>STEVE<span style={{color:t.a}}>.</span></span>}
          </button>
          {!isMobile?(
            <div style={{display:'flex',gap:'clamp(16px,3vw,28px)',alignItems:'center'}}>
              {links.map(l=>(
                <button key={l.id} onClick={()=>go(l.id)} data-hover="true" style={{position:'relative',background:'none',border:'none',cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(9px,1.5vw,10px)',letterSpacing:'0.12em',textTransform:'uppercase',color:active===l.id?t.a:'rgba(255,255,255,0.32)',transition:'color .3s',padding:'4px 0',whiteSpace:'nowrap'}}>
                  {l.l}
                  <span style={{position:'absolute',bottom:-2,left:0,height:1,width:active===l.id?'100%':'0%',background:`linear-gradient(90deg,${t.a},${t.b})`,transition:'width .3s ease'}} />
                </button>
              ))}
            </div>
          ):null}
          <div style={{display:'flex',alignItems:'center',gap:'clamp(6px,1.5vw,10px)',flexShrink:0}}>
            <ThemeSwitcher />
            {!isMobile&&(
              <>
                <div style={{display:'flex',alignItems:'center',gap:6,fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(9px,1.5vw,11px)',color:`${t.a}55`}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:t.a,boxShadow:`0 0 8px ${t.a}`,animation:'pulse-neon 2s ease-in-out infinite'}} />Available
                </div>
                <button onClick={()=>go('contact')} data-hover="true" style={{padding:'clamp(6px,1.2vw,8px) clamp(12px,2vw,18px)',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(9px,1.5vw,11px)',background:`${t.a}10`,border:`1px solid ${t.a}28`,color:t.a,cursor:'pointer',letterSpacing:'0.08em',whiteSpace:'nowrap'}}>Hire Me →</button>
              </>
            )}
            {isMobile&&(
              <button onClick={()=>setMenuOpen(!menuOpen)} data-hover="true" style={{width:36,height:36,borderRadius:2,background:`rgba(255,255,255,0.05)`,border:`1px solid ${t.a}18`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:t.a,fontSize:20}}>
                {menuOpen?'✕':'☰'}
              </button>
            )}
          </div>
        </div>
        <style>{`@keyframes pulse-neon{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      </motion.nav>
      <AnimatePresence>
        {isMobile&&menuOpen&&(
          <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.2}}
            style={{position:'fixed',top:56,left:0,right:0,zIndex:799,background:'rgba(5,5,5,0.98)',borderBottom:`1px solid ${t.a}07`,backdropFilter:'blur(20px)'}}>
            <div style={{maxWidth:1280,margin:'0 auto',padding:'8px 24px 12px',display:'flex',flexDirection:'column',gap:4}}>
              {links.map(l=>(
                <button key={l.id} onClick={()=>go(l.id)} data-hover="true" style={{width:'100%',padding:'12px 14px',borderRadius:2,background:active===l.id?`${t.a}10`:'transparent',border:`1px solid ${active===l.id?t.a+'25':'transparent'}`,cursor:'pointer',fontFamily:'JetBrains Mono,monospace',fontSize:11,letterSpacing:'0.12em',textTransform:'uppercase',color:active===l.id?t.a:'rgba(255,255,255,0.32)',transition:'all .3s',textAlign:'left'}}>
                  {l.l}
                </button>
              ))}
              <div style={{height:1,background:`${t.a}07`,margin:'6px 0'}} />
              <button onClick={()=>{go('contact')}} data-hover="true" style={{width:'100%',padding:'12px 14px',borderRadius:2,background:`${t.a}10`,border:`1px solid ${t.a}28`,cursor:'pointer',fontFamily:'Syne,sans-serif',fontSize:12,fontWeight:800,color:t.a,letterSpacing:'0.08em',textAlign:'center',marginTop:4}}>
                Hire Me →
              </button>
              <div style={{display:'flex',alignItems:'center',gap:6,fontFamily:'JetBrains Mono,monospace',fontSize:10,color:`${t.a}55`,padding:'8px 14px'}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:t.a,boxShadow:`0 0 8px ${t.a}`,animation:'pulse-neon 1s ease-in-out infinite'}} />Available for work
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── HERO ───────────────────────────────────────────────────────────────────────
function Hero() {
  const [konami,setKonami]=useState<string[]>([])
  const [egg,setEgg]=useState(false)
  const { t } = useTheme()
  const toast = useToast()
  const CODE=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{ setKonami(prev=>{ const n=[...prev,e.key].slice(-CODE.length); if(n.join()===CODE.join()){setEgg(true);toast('KONAMI CODE UNLOCKED! 🎮','🎮');setTimeout(()=>setEgg(false),4000)} return n }) }
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h)
  },[])
  const stats=[{v:5,s:'+',l:'Years'},{v:30,s:'+',l:'Clients'},{v:80,s:'+',l:'Projects'},{v:100,s:'%',l:'Satisfaction'}]
  const roles=['Full-Stack Developer','Brand Designer','3D Artist','AI Builder','Creative Technologist']
  return (
    <section id="hero" style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:t.bg}}>
      <ParticleField />
      <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:.02,backgroundImage:`linear-gradient(${t.a} 1px,transparent 1px),linear-gradient(90deg,${t.a} 1px,transparent 1px)`,backgroundSize:'60px 60px'}} />
      <div style={{position:'absolute',top:'30%',left:'20%',width:400,height:400,borderRadius:'50%',pointerEvents:'none',background:`radial-gradient(circle,${t.a}05,transparent 70%)`,filter:'blur(60px)'}} />
      <div style={{position:'absolute',bottom:'30%',right:'20%',width:400,height:400,borderRadius:'50%',pointerEvents:'none',background:`radial-gradient(circle,${t.b}05,transparent 70%)`,filter:'blur(60px)'}} />
      <AnimatePresence>
        {egg&&<motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.8}}
          style={{position:'absolute',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
          <div style={{textAlign:'center',padding:'3rem',borderRadius:2,background:'rgba(0,0,0,0.97)',border:`1px solid ${t.a}40`,boxShadow:`0 0 80px ${t.a}30`}}>
            <div style={{fontSize:60,marginBottom:16}}>🎮</div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:28,color:t.a,marginBottom:8}}>KONAMI CODE UNLOCKED</div>
            <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:13,color:t.b}}>You found the secret. You&apos;re one of us 🤫</div>
          </div>
        </motion.div>}
      </AnimatePresence>
      <div style={{position:'relative',zIndex:1,maxWidth:1280,margin:'0 auto',padding:'clamp(4rem,8vw,8rem) clamp(12px,4vw,24px) clamp(2rem,4vw,4rem)',width:'100%'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>
          <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:.3}}
            style={{display:'flex',alignItems:'center',gap:10,padding:'8px 20px',borderRadius:2,marginBottom:48,background:`${t.a}07`,border:`1px solid ${t.a}18`,backdropFilter:'blur(12px)'}}>
            <span style={{width:8,height:8,borderRadius:'50%',background:t.a,boxShadow:`0 0 8px ${t.a}`,animation:'pulse-neon 2s ease-in-out infinite'}} />
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:`${t.a}85`,letterSpacing:'0.15em'}}>AVAILABLE FOR PROJECTS · {new Date().toLocaleString('default',{month:'long',year:'numeric'}).toUpperCase()}</span>
          </motion.div>
          <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{duration:.8,delay:.4,ease:[0.22,1,0.36,1]}}
            style={{position:'relative',marginBottom:'clamp(24px,6vw,48px)',width:'clamp(200px,60vw,280px)',height:'clamp(200px,60vw,280px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{position:'absolute',width:'calc(100% - 20px)',height:'calc(100% - 20px)',borderRadius:'50%',top:'50%',left:'50%',border:`1px solid ${t.a}15`,animation:'spin-slow 20s linear infinite',animationDirection:'reverse'}} />
            <div style={{position:'absolute',width:'calc(100% - 40px)',height:'calc(100% - 40px)',borderRadius:'50%',top:'50%',left:'50%',border:`1px dashed ${t.b}20`,animation:'spin-slow 13s linear infinite'}} />
            {['React','Next.js','UI/UX','3D','AI'].map((b,i)=>{ const a=(i/5)*Math.PI*2,r=Math.max(60,Math.min(130,window.innerWidth/6)); return (
              <motion.div key={b} initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.8+i*.1}}
                style={{position:'absolute',fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(8px,1.5vw,10px)',padding:'3px 8px',borderRadius:2,whiteSpace:'nowrap',top:`calc(50% + ${Math.sin(a)*r}px)`,left:`calc(50% + ${Math.cos(a)*r}px)`,transform:'translate(-50%,-50%)',background:'rgba(5,5,5,0.92)',border:`1px solid ${i%2===0?t.a:t.b}35`,color:i%2===0?t.a:t.b,backdropFilter:'blur(8px)'}}>
                {b}
              </motion.div>
            )})}
            <div style={{position:'relative',width:'clamp(120px,50vw,160px)',height:'clamp(120px,50vw,160px)',borderRadius:2,overflow:'hidden',border:`1px solid ${t.a}35`,boxShadow:`0 0 60px ${t.a}18,0 0 120px ${t.b}08`}}>
              <img src="https://i.ibb.co/5gRLQG7C/Whats-App-Image-2025-01-08-at-10-16-10-0b7c5513.jpg" alt="Steve Ronald" style={{width:'100%',height:'100%',objectFit:'cover'}} />
              <div style={{position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,0,0.025) 3px,rgba(0,255,0,0.025) 4px)',pointerEvents:'none'}} />
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.5}}>
            <h1 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2rem,8vw,8rem)',lineHeight:.9,letterSpacing:'-0.03em',marginBottom:0}}>
              <span style={{color:'#fff',display:'block'}}>STEVE</span>
              <span style={{display:'block',color:t.a,textShadow:`0 0 60px ${t.a}50,0 0 120px ${t.a}20`}}>
                <ScrambleText text="RONALD" trigger={true} />
              </span>
            </h1>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.75}}
            style={{display:'flex',alignItems:'center',gap:16,margin:'24px 0 20px'}}>
            <div style={{height:1,width:48,background:`linear-gradient(to right,transparent,${t.a})`}} />
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:13,color:t.b,letterSpacing:'0.15em',minWidth:260,textAlign:'center'}}>
              <Typewriter words={roles} />
            </span>
            <div style={{height:1,width:48,background:`linear-gradient(to left,transparent,${t.a})`}} />
          </motion.div>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.85}}
            style={{fontFamily:'DM Sans,sans-serif',fontSize:17,maxWidth:560,lineHeight:1.7,color:'rgba(255,255,255,0.38)',marginBottom:44}}>
            Crafting premium digital experiences — from immersive interfaces to AI-powered platforms. I turn vision into reality at the intersection of design, code, and creativity.
          </motion.p>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.95}}
            style={{display:'flex',gap:'clamp(8px,2vw,16px)',flexWrap:'wrap',justifyContent:'center',marginBottom:60,flexDirection:typeof window!=='undefined'&&window.innerWidth<640?'column':'row',alignItems:typeof window!=='undefined'&&window.innerWidth<640?'stretch':'center'}}>
            <button onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})} data-hover="true"
              style={{padding:'clamp(12px,2vw,16px) clamp(20px,4vw,36px)',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(11px,2vw,13px)',letterSpacing:'0.08em',background:t.a,color:'#000',border:'none',cursor:'pointer',boxShadow:`0 0 40px ${t.a}40,0 8px 30px ${t.a}20`,transition:'all .3s'}}>
              VIEW MY WORK
            </button>
            <button onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} data-hover="true"
              style={{padding:'clamp(12px,2vw,16px) clamp(20px,4vw,36px)',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(11px,2vw,13px)',letterSpacing:'0.08em',background:'transparent',color:t.b,border:`1px solid ${t.b}45`,cursor:'pointer',transition:'all .3s'}}>
              HIRE ME →
            </button>
            <button onClick={()=>{const u=window.location.origin;navigator.clipboard.writeText(u);toast('Portfolio link copied! Share it 🚀','🔗')}} data-hover="true"
              style={{padding:'clamp(12px,2vw,16px) clamp(16px,3vw,20px)',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(11px,2vw,13px)',letterSpacing:'0.08em',background:'transparent',color:'rgba(255,255,255,0.3)',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',transition:'all .3s'}} title="Share this portfolio">
              ⬡ Share
            </button>
          </motion.div>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.05}}
            style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(clamp(80px,20vw,100px),1fr))',gap:'clamp(16px,4vw,32px)'}}>
            {stats.map((s,i)=>(
              <div key={i} style={{textAlign:'center'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(20px,5vw,32px)',color:i%2===0?t.a:t.b,textShadow:`0 0 20px ${i%2===0?t.a:t.b}50`}}>
                  <CountUp end={s.v} suffix={s.s} duration={2200} />
                </div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(8px,1.5vw,10px)',color:'rgba(255,255,255,0.22)',marginTop:4,letterSpacing:'0.1em'}}>{s.l}</div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4}}
            style={{position:'absolute',bottom:32,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,letterSpacing:'0.3em',color:'rgba(255,255,255,0.15)',textTransform:'uppercase'}}>Scroll</span>
            <div style={{width:1,height:48,background:'rgba(255,255,255,0.04)',overflow:'hidden',position:'relative'}}>
              <div style={{position:'absolute',top:0,width:'100%',height:'40%',background:`linear-gradient(to bottom,transparent,${t.a},transparent)`,animation:'scroll-line 1.5s linear infinite'}} />
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes spin-slow{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes scroll-line{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}`}</style>
    </section>
  )
}

// ── ABOUT ──────────────────────────────────────────────────────────────────────
function About() {
  const ref=useRef<HTMLDivElement>(null)
  const inView=useInView(ref,{once:true,margin:'-80px'})
  const [activeT,setActiveT]=useState<number|null>(null)
  const { t } = useTheme()
  const timeline=[
    {date:'High School',title:'Early Creative Spark',icon:'💡',color:t.a,text:'Discovered creativity and passion for tech using school computers long before owning one.',skills:['Creative Thinking','Curiosity','Problem Solving']},
    {date:'2019',title:'Self-Taught Foundations',icon:'🖥️',color:'#38BDF8',text:'Mastered graphic design, digital marketing and 3D modelling through self-study.',skills:['Graphic Design','Digital Marketing','3D Modelling']},
    {date:'2019–2020',title:'Greenland Projects',icon:'💼',color:'#4ADE80',text:'Digital Marketer & Web Manager. Operations halted during COVID-19 lockdowns.',skills:['Web Management','Marketing','Client Relations']},
    {date:'2021–2023',title:'Saseka Woodworks',icon:'🪵',color:'#FB923C',text:'Part-time Graphic Designer and Web Manager building brand identity.',skills:['Brand Identity','Web Design','Content Creation']},
    {date:'2024–2025',title:'Shagary Petroleum',icon:'⚙️',color:t.b,text:'Web Developer and Graphic Designer for the energy sector.',skills:['Web Dev','UI Design','Corporate Branding']},
    {date:'Present',title:'Freelance Full-Stack',icon:'🚀',color:'#F9CA24',text:'Building full-stack, AI-driven, and premium applications.',skills:['Full-Stack','AI Integration','Product Strategy']},
  ]
  const fe=[{n:'React / Next.js',l:92,c:'#38BDF8'},{n:'TypeScript',l:83,c:'#60A5FA'},{n:'Tailwind CSS',l:94,c:'#2DD4BF'},{n:'Framer Motion',l:85,c:t.b},{n:'Figma / UI Design',l:79,c:'#F472B6'},{n:'HTML / CSS',l:96,c:'#FB923C'}]
  const be=[{n:'Node.js / Express',l:86,c:t.a},{n:'PostgreSQL',l:76,c:'#60A5FA'},{n:'MongoDB',l:79,c:'#4ADE80'},{n:'Python',l:71,c:'#FBBF24'},{n:'Docker',l:67,c:'#38BDF8'},{n:'REST APIs',l:91,c:t.b}]
  const aStats=[{v:5,s:'+',l:'Years',c:t.a},{v:80,s:'+',l:'Projects',c:t.b},{v:30,s:'+',l:'Clients',c:'#F9CA24'}]
  return (
    <section id="about" style={{position:'relative',padding:'8rem 0',overflow:'hidden',background:'#060606'}}>
      <div style={{position:'absolute',top:0,right:0,width:500,height:500,borderRadius:'50%',pointerEvents:'none',background:`radial-gradient(circle,${t.b}03,transparent 70%)`,filter:'blur(80px)'}} />
      <div ref={ref} style={{maxWidth:1280,margin:'0 auto',padding:'0 clamp(12px,4vw,24px)'}}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} style={{marginBottom:'clamp(32px,6vw,64px)'}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// 01 About</span>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2.5rem,5vw,4rem)',color:'#fff',marginTop:12,lineHeight:1.1}}>
            I Build Things<br /><GlitchText text="For The Web." style={{color:t.a,textShadow:`0 0 40px ${t.a}30`}} />
          </h2>
          <div style={{height:1,maxWidth:320,marginTop:20,background:`linear-gradient(to right,${t.a},${t.b},transparent)`}} />
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(clamp(280px,100%,340px),1fr))',gap:'clamp(32px,6vw,56px)',marginBottom:80,alignItems:'start'}}>
          <motion.div initial={{opacity:0,x:-30}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.2}}>
            <div style={{borderRadius:2,overflow:'hidden',marginBottom:24,background:t.card,border:'1px solid rgba(255,255,255,0.04)'}}>
              <div style={{height:1,background:`linear-gradient(90deg,${t.a},${t.b},transparent)`}} />
              <div style={{padding:'24px',display:'flex',gap:20,alignItems:'center'}}>
                <div style={{width:80,height:80,borderRadius:2,overflow:'hidden',flexShrink:0,border:`1px solid ${t.a}28`}}>
                  <img src="https://i.ibb.co/1GVHNhmj/hyb.jpg" alt="Steve" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
                <div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#fff',marginBottom:4}}>Steve Ronald</div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:t.b,marginBottom:10}}>Full-Stack Developer & Brand Designer</div>
                  <div style={{fontFamily:'DM Sans,sans-serif',fontSize:13,color:'rgba(255,255,255,0.38)',lineHeight:1.6}}>5+ years turning ideas into premium digital products. South Africa → Global.</div>
                </div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:24}}>
              {aStats.map((s,i)=>(
                <div key={i} style={{borderRadius:2,padding:'20px 16px',textAlign:'center',background:t.card,border:`1px solid ${s.c}12`}}>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:28,color:s.c,marginBottom:4}}><CountUp end={s.v} suffix={s.s} duration={2000} /></div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.28)'}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:10}}>
              <a href="mailto:stevezuluu@gmail.com" data-hover="true" style={{flex:1,textAlign:'center',padding:'13px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:12,background:t.a,color:'#000',boxShadow:`0 0 30px ${t.a}28`,letterSpacing:'0.07em',textDecoration:'none'}}>HIRE ME</a>
              <button onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})} data-hover="true" style={{flex:1,padding:'13px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:12,border:`1px solid ${t.b}40`,color:t.b,background:'transparent',cursor:'pointer',letterSpacing:'0.07em'}}>SEE WORK →</button>
            </div>
            <div style={{marginTop:16,padding:'14px 16px',borderRadius:2,background:`${t.a}05`,border:`1px solid ${t.a}12`,display:'flex',alignItems:'center',gap:12}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:t.a,boxShadow:`0 0 8px ${t.a}`,flexShrink:0,animation:'pulse-neon 1.5s ease-in-out infinite',display:'inline-block'}} />
              <div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#fff',marginBottom:2}}>Building: AI Portfolio Generator</div>
                <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:`${t.a}60`}}>Next.js · OpenAI · 68% complete</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:.3}}>
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {[{title:'Frontend',icon:'🖥️',color:t.a,skills:fe},{title:'Backend & Infra',icon:'⚙️',color:t.b,skills:be}].map(group=>(
                <div key={group.title} style={{borderRadius:2,padding:'24px',background:t.card,border:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                    <span style={{fontSize:20}}>{group.icon}</span>
                    <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:'#fff'}}>{group.title}</span>
                    <span style={{marginLeft:'auto',fontFamily:'JetBrains Mono,monospace',fontSize:10,padding:'2px 8px',borderRadius:2,background:`${group.color}10`,color:group.color,border:`1px solid ${group.color}20`}}>{group.skills.length} skills</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {group.skills.map(s=><SkillBar key={s.n} name={s.n} level={s.l} color={s.c} />)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div style={{height:1,marginBottom:64,background:`linear-gradient(90deg,transparent,${t.a}18,${t.b}18,transparent)`}} />
        <div>
          <div style={{marginBottom:40}}>
            <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// Career Timeline</span>
            <h3 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:32,color:'#fff',marginTop:10}}>My Journey</h3>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:14}}>
            {timeline.map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*.08}}
                onClick={()=>setActiveT(activeT===i?null:i)}
                style={{borderRadius:2,padding:'22px',cursor:'pointer',position:'relative',overflow:'hidden',transition:'all .3s',background:t.card,border:`1px solid ${activeT===i?item.color+'25':'rgba(255,255,255,0.04)'}`}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14}}>
                  <div style={{width:44,height:44,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,background:`${item.color}10`,border:`1px solid ${item.color}20`}}>{item.icon}</div>
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,padding:'4px 8px',borderRadius:2,background:`${item.color}10`,color:item.color,border:`1px solid ${item.color}20`}}>{item.date}</span>
                </div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:'#fff',marginBottom:8}}>{item.title}</div>
                <div style={{fontFamily:'DM Sans,sans-serif',fontSize:13,color:'rgba(255,255,255,0.35)',lineHeight:1.6,marginBottom:12}}>{item.text}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {item.skills.map(s=><span key={s} style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,padding:'2px 7px',borderRadius:2,background:'rgba(255,255,255,0.03)',color:'rgba(255,255,255,0.22)',border:'1px solid rgba(255,255,255,0.06)'}}>{s}</span>)}
                </div>
                <div style={{position:'absolute',bottom:0,left:0,height:1,background:`linear-gradient(90deg,${item.color},transparent)`,width:activeT===i?'100%':'0%',transition:'width .5s ease'}} />
              </motion.div>
            ))}
          </div>
        </div>
        <GitHubGraph />
      </div>
    </section>
  )
}

// ── SKILLS ─────────────────────────────────────────────────────────────────────
function Skills() {
  const ref=useRef<HTMLDivElement>(null)
  const inView=useInView(ref,{once:true,margin:'-80px'})
  const [filter,setFilter]=useState('All')
  const [active,setActive]=useState<number|null>(null)
  const [isMobile,setIsMobile]=useState(typeof window!=='undefined'?window.innerWidth<768:false)
  const { t } = useTheme()
  useEffect(()=>{
    const resize=()=>setIsMobile(window.innerWidth<768)
    window.addEventListener('resize',resize); return ()=>window.removeEventListener('resize',resize)
  },[])
  const cards=[
    {icon:'💻',title:'Web Development',cat:'Development',color:t.a,desc:'Responsive, modern websites with clean architecture and seamless UX.',features:['Responsive Design','SEO Optimized','Fast Load','Cross-browser'],tags:['Next.js','React','TypeScript','Tailwind'],stat:'20+ Sites'},
    {icon:'📱',title:'App Development',cat:'Development',color:t.b,desc:'Full-featured apps with real-time data, auth, and scalable backends.',features:['Real-time','REST APIs','Auth','Cloud Deploy'],tags:['Node.js','Express','MongoDB','PostgreSQL'],stat:'10+ Apps'},
    {icon:'🛒',title:'E-Commerce',cat:'Development',color:'#4ADE80',desc:'End-to-end online stores with payments and conversion-optimized UX.',features:['Payments','Inventory','Orders','Catalog'],tags:['Stripe','Next.js','Prisma','MySQL'],stat:'5+ Stores'},
    {icon:'⚙️',title:'Software Dev',cat:'Development',color:'#FB923C',desc:'Dashboards, automation tools, and data-driven software solutions.',features:['Dashboards','Pipelines','Automation','APIs'],tags:['TypeScript','Docker','REST','Git'],stat:'15+ Tools'},
    {icon:'🎨',title:'Graphic Design',cat:'Design',color:'#F472B6',desc:'Logos, brand kits, posters, and marketing materials that impact.',features:['Logo Design','Brand Kits','Print','Social Assets'],tags:['Photoshop','Figma','Illustrator','Canva'],stat:'50+ Designs'},
    {icon:'🖊️',title:'UI/UX Design',cat:'Design',color:'#A78BFA',desc:'Pixel-perfect, human-centered interfaces that are intuitive and beautiful.',features:['Wireframes','Prototypes','Research','Systems'],tags:['Figma','Testing','Accessibility','Motion'],stat:'30+ UIs'},
    {icon:'🧊',title:'3D Modelling',cat:'Design',color:'#38BDF8',desc:'3D assets for products, architectural renders, and creative projects.',features:['Product Renders','Assets','Scenes','Texturing'],tags:['Blender','3D Design','Rendering','VFX'],stat:'Since 2019'},
    {icon:'📣',title:'Digital Marketing',cat:'Marketing',color:'#FBBF24',desc:'Growth through strategic campaigns, content, and data decisions.',features:['Campaigns','Content','Analytics','Paid Ads'],tags:['Meta Ads','Google Ads','Analytics','Email'],stat:'Since 2019'},
    {icon:'🔍',title:'SEO',cat:'Marketing',color:'#86EFAC',desc:'Optimizing sites to rank, drive organic traffic, and increase visibility.',features:['On-page','Technical','Keywords','Links'],tags:['Google','Schema','Core Web Vitals','Analytics'],stat:'Top Rankings'},
  ]
  const filters=['All','Development','Design','Marketing']
  const filtered=filter==='All'?cards:cards.filter(c=>c.cat===filter)
  const techCloud=[{n:'React',c:'#38BDF8'},{n:'Next.js',c:t.a},{n:'TypeScript',c:'#60A5FA'},{n:'Tailwind',c:'#2DD4BF'},{n:'Node.js',c:t.a},{n:'PostgreSQL',c:'#60A5FA'},{n:'MongoDB',c:'#4ADE80'},{n:'Figma',c:'#F472B6'},{n:'Framer Motion',c:t.b},{n:'Blender',c:'#38BDF8'},{n:'Docker',c:'#60A5FA'},{n:'Stripe',c:'#A78BFA'},{n:'Three.js',c:t.a},{n:'Python',c:'#FBBF24'},{n:'SEO',c:'#86EFAC'},{n:'GraphQL',c:'#F472B6'},{n:'Prisma',c:t.b},{n:'AWS',c:'#FBBF24'},{n:'Git',c:'#FB923C'},{n:'Photoshop',c:'#4ADE80'}]
  return (
    <section id="skills" style={{position:'relative',padding:'clamp(4rem,8vw,8rem) 0',overflow:'hidden',background:t.bg}}>
      <div ref={ref} style={{maxWidth:1280,margin:'0 auto',padding:'0 clamp(12px,4vw,24px)'}}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} style={{marginBottom:'clamp(32px,6vw,52px)'}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// 02 Skills</span>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2.5rem,5vw,4rem)',color:'#fff',marginTop:12,lineHeight:1.1}}>
            Core<br /><GlitchText text="Strengths." style={{color:t.b,textShadow:`0 0 40px ${t.b}30`}} />
          </h2>
        </motion.div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:36}}>
          {filters.map(f=><button key={f} onClick={()=>{setFilter(f);setActive(null)}} data-hover="true" style={{padding:'8px 18px',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:11,cursor:'pointer',transition:'all .3s',background:filter===f?t.a:'transparent',color:filter===f?'#000':'rgba(255,255,255,0.3)',border:`1px solid ${filter===f?t.a:'rgba(255,255,255,0.06)'}`,boxShadow:filter===f?`0 0 20px ${t.a}28`:undefined}}>{f} ({f==='All'?cards.length:cards.filter(c=>c.cat===f).length})</button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fill,minmax(260px,1fr))',gap:'clamp(10px,2vw,14px)',marginBottom:40}}>
            {filtered.map((item,i)=>(
              <motion.div key={item.title} initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{delay:i*.05}}
                onClick={()=>setActive(active===i?null:i)} whileHover={{scale:1.02}}
                style={{borderRadius:2,padding:'22px',cursor:'pointer',position:'relative',overflow:'hidden',transition:'all .3s',background:t.card,border:`1px solid ${active===i?item.color+'28':'rgba(255,255,255,0.04)'}`}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
                  <div style={{width:44,height:44,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,background:`${item.color}0D`,border:`1px solid ${item.color}20`}}>{item.icon}</div>
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,padding:'3px 7px',borderRadius:2,background:`${item.color}0D`,color:item.color,border:`1px solid ${item.color}20`}}>{item.stat}</span>
                </div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,color:'#fff',marginBottom:8}}>{item.title}</div>
                <div style={{fontFamily:'DM Sans,sans-serif',fontSize:13,color:'rgba(255,255,255,0.34)',lineHeight:1.6,marginBottom:14}}>{item.desc}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4,marginBottom:14}}>
                  {item.features.map(f=><div key={f} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.3)'}}><span style={{color:item.color,fontSize:8}}>◈</span>{f}</div>)}
                </div>
                <AnimatePresence>
                  {active===i&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}><div style={{paddingTop:12,borderTop:`1px solid ${item.color}15`,display:'flex',flexWrap:'wrap',gap:6}}>{item.tags.map(tag=><span key={tag} style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,padding:'3px 7px',borderRadius:2,background:`${item.color}0D`,color:item.color,border:`1px solid ${item.color}20`}}>{tag}</span>)}</div></motion.div>}
                </AnimatePresence>
                <div style={{position:'absolute',bottom:0,left:0,height:1,background:`linear-gradient(90deg,${item.color},transparent)`,width:active===i?'100%':'0%',transition:'width .5s'}} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.5}}
          style={{borderRadius:2,padding:'32px',background:t.card,border:'1px solid rgba(255,255,255,0.04)'}}>
          <p style={{textAlign:'center',fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.2)',letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:20}}>Full Tech Stack</p>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:8}}>
            {techCloud.map((tc,i)=><motion.span key={tc.n} initial={{opacity:0,scale:.8}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.5+i*.025}} whileHover={{scale:1.1}} style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,padding:'6px 12px',borderRadius:2,cursor:'default',background:`${tc.c}08`,border:`1px solid ${tc.c}18`,color:`${tc.c}85`}}>{tc.n}</motion.span>)}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── PROJECTS ───────────────────────────────────────────────────────────────────
function Projects() {
  const ref=useRef<HTMLDivElement>(null)
  const inView=useInView(ref,{once:true,margin:'-80px'})
  const [selected,setSelected]=useState<number|null>(null)
  const [filter,setFilter]=useState('All')
  const [isMobile,setIsMobile]=useState(typeof window!=='undefined'?window.innerWidth<768:false)
  const { t } = useTheme()
  useEffect(()=>{
    const resize=()=>setIsMobile(window.innerWidth<768)
    window.addEventListener('resize',resize); return ()=>window.removeEventListener('resize',resize)
  },[])
  const allProjects=[
    {id:1,title:'Steve Portfolio',cat:'Portfolio',desc:'Personal brand showcase with immersive UI, live demos, and premium animations.',url:'https://steve-portfolio-flame.vercel.app/',color:t.a,year:'2025',tags:['React','Vercel','Brand'],stats:[{l:'Load',v:.8,s:'s'},{l:'Lighthouse',v:98,s:'/100'},{l:'Deploys',v:40,s:'+'}]},
    {id:2,title:'Saseka Holdings',cat:'Corporate',desc:'Premium corporate identity platform for an emerging investment firm.',url:'https://tory-cyan-2kxwuiasql.edgeone.app',color:t.b,year:'2024',tags:['Next.js','Finance','EdgeOne'],stats:[{l:'Uptime',v:99.9,s:'%'},{l:'Pages',v:8,s:''},{l:'CDN',v:200,s:'+'}]},
    {id:3,title:"Patient's Dashboard",cat:'Dashboard',desc:'Clinical dashboard for patient data, appointments, and health metrics.',url:'https://patient-dashboard.tiiny.site/',color:'#38BDF8',year:'2024',tags:['Dashboard','HealthTech','UI'],stats:[{l:'Modules',v:12,s:''},{l:'Charts',v:8,s:''},{l:'Patients',v:500,s:'+'}]},
    {id:4,title:'Kings Barber',cat:'E-Commerce',desc:'Sleek barbershop brand site with booking system and service showcase.',url:'http://stevemediaco.unaux.com',color:'#FFB347',year:'2024',tags:['Branding','Booking','Web'],stats:[{l:'Bookings',v:200,s:'+'},{l:'Services',v:15,s:''},{l:'Rating',v:4.9,s:'★'}]},
    {id:5,title:'Steve Media Co.',cat:'Agency',desc:'Full-service digital agency landing with portfolio integration.',url:'https://stevemediaco.zya.me',color:'#FF6B6B',year:'2024',tags:['Agency','Media','Creative'],stats:[{l:'Clients',v:30,s:'+'},{l:'Projects',v:80,s:'+'},{l:'Score',v:100,s:'%'}]},
    {id:6,title:'C4 DesignHub',cat:'Platform',desc:'Collaborative design hub for creatives — tools, assets, and community.',url:'http://c4desighub.gt.tc/',color:'#F9CA24',year:'2023',tags:['Design','Community','Platform'],stats:[{l:'Assets',v:500,s:'+'},{l:'Members',v:1200,s:'+'},{l:'Tools',v:24,s:''}]},
    {id:7,title:'Portfolio Classic',cat:'Portfolio',desc:'Original developer portfolio showcasing case studies and creative work.',url:'http://steveportfolio.ct.ws',color:'#A8FF78',year:'2023',tags:['HTML','CSS','JavaScript'],stats:[{l:'Projects',v:20,s:'+'},{l:'Skills',v:15,s:'+'},{l:'Views',v:5,s:'K+'}]},
    {
  id: 8,
  title: 'Omnicreva Interface',
  cat: 'Landing Page',
  desc: 'Modern high-converting landing page for Omnicreva, featuring immersive UI, smooth animations, and a premium digital experience.',
  url: 'https://omnicreva-interface.gt.tc/',
  color: '#00F5A0',
  year: '2026',
  tags: ['Next.js', 'Node.js', 'Three.js'],
  stats: [
    { l: 'Sections', v: 8, s: '+' },
    { l: 'Animations', v: 12, s: '+' },
    { l: 'Performance', v: 95, s: '%' }
  ]
}
  ]
  const cats=['All',...([...new Set(allProjects.map(p=>p.cat))] as string[])]
  const filtered2=filter==='All'?allProjects:allProjects.filter(p=>p.cat===filter)
  const sel=selected!==null?allProjects[selected]:null
  return (
    <section id="projects" style={{position:'relative',padding:'clamp(4rem,8vw,8rem) 0',overflow:'hidden',background:'#060606'}}>
      <div ref={ref} style={{maxWidth:1280,margin:'0 auto',padding:'0 clamp(12px,4vw,24px)'}}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} style={{marginBottom:'clamp(24px,6vw,40px)'}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// 03 Work</span>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2.5rem,5vw,4rem)',color:'#fff',marginTop:12,lineHeight:1.1}}>
            Live<br /><GlitchText text="Platforms." style={{color:t.a,textShadow:`0 0 40px ${t.a}30`}} />
          </h2>
        </motion.div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:32}}>
          {cats.map(c=><button key={c} onClick={()=>setFilter(c)} data-hover="true"
            style={{padding:'7px 16px',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:10,cursor:'pointer',transition:'all .3s',background:filter===c?t.b:'transparent',color:filter===c?'#000':'rgba(255,255,255,0.3)',border:`1px solid ${filter===c?t.b:'rgba(255,255,255,0.06)'}`,boxShadow:filter===c?`0 0 20px ${t.b}28`:undefined}}>
            {c}
          </button>)}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
            style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fill,minmax(300px,1fr))',gap:'clamp(10px,2vw,16px)'}}>
            {filtered2.map((p,i)=>(
              <motion.div key={p.id} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:i*.07}}>
                <TiltCard style={{height:'100%'}}>
                  <div onClick={()=>setSelected(allProjects.findIndex(ap=>ap.id===p.id))} data-hover="true" data-label="View Project"
                    style={{borderRadius:2,overflow:'hidden',cursor:'pointer',height:'100%',background:t.card,border:'1px solid rgba(255,255,255,0.05)',display:'flex',flexDirection:'column',transition:'border-color .3s'}}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=p.color+'30'}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.05)'}}>
                    <div style={{height:1,background:`linear-gradient(90deg,transparent,${p.color},${t.b},transparent)`}} />
                    <div style={{position:'relative',height:180,background:'#070707',overflow:'hidden',flexShrink:0}}>
                      <iframe src={p.url} title={p.title} loading="lazy" style={{position:'absolute',top:0,left:0,width:'200%',height:'200%',transform:'scale(.5)',transformOrigin:'top left',border:'none',pointerEvents:'none'}} />
                      <div style={{position:'absolute',bottom:0,left:0,right:0,height:60,background:`linear-gradient(to bottom,transparent,${t.card})`}} />
                      <div style={{position:'absolute',top:10,right:10,padding:'3px 8px',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:9,background:'rgba(0,0,0,0.7)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.4)'}}>{p.year}</div>
                    </div>
                    <div style={{padding:'18px 18px 16px',flex:1,display:'flex',flexDirection:'column'}}>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.2)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:6}}>{p.cat}</div>
                      <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:15,color:'#fff',marginBottom:8}}>{p.title}</div>
                      <div style={{fontFamily:'DM Sans,sans-serif',fontSize:13,color:'rgba(255,255,255,0.35)',lineHeight:1.6,marginBottom:14,flex:1}}>{p.desc}</div>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:12}}>
                        {p.stats.map(s=><div key={s.l} style={{textAlign:'center',padding:'8px 4px',borderRadius:2,background:`${p.color}06`,border:`1px solid ${p.color}10`}}>
                          <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:p.color}}><CountUp end={s.v} suffix={s.s} decimals={s.v%1!==0?1:0} duration={1800} /></div>
                          <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:'rgba(255,255,255,0.2)',marginTop:2}}>{s.l}</div>
                        </div>)}
                      </div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {p.tags.map(tag=><span key={tag} style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,padding:'3px 7px',borderRadius:2,background:`${p.color}08`,color:`${p.color}65`}}>{tag}</span>)}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {sel&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)}
            style={{position:'fixed',inset:0,zIndex:5000,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(0,0,0,0.92)',backdropFilter:'blur(20px)'}}>
            <motion.div initial={{opacity:0,scale:.9,y:30}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.9,y:30}} transition={{duration:.4,ease:[0.22,1,0.36,1]}}
              onClick={e=>e.stopPropagation()}
              style={{width:'100%',maxWidth:640,borderRadius:2,overflow:'hidden',background:'#070707',border:`1px solid ${sel.color}22`,boxShadow:`0 0 100px ${sel.color}10`}}>
              <div style={{height:1,background:`linear-gradient(90deg,transparent,${sel.color},${t.b},transparent)`}} />
              <div style={{position:'relative',height:280,overflow:'hidden'}}>
                <iframe src={sel.url} title={sel.title} loading="lazy" style={{position:'absolute',top:0,left:0,width:'133.33%',height:'133.33%',transform:'scale(.75)',transformOrigin:'top left',border:'none',pointerEvents:'none'}} />
                <div style={{position:'absolute',bottom:0,left:0,right:0,height:80,background:'linear-gradient(to bottom,transparent,#070707)'}} />
                <button onClick={()=>setSelected(null)} data-hover="true" style={{position:'absolute',top:12,right:12,zIndex:10,width:34,height:34,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.7)',border:'1px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.6)',fontSize:18,cursor:'pointer'}}>×</button>
              </div>
              <div style={{padding:28}}>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:22,color:'#fff',marginBottom:8}}>{sel.title}</div>
                <p style={{fontFamily:'DM Sans,sans-serif',fontSize:14,color:'rgba(255,255,255,0.4)',lineHeight:1.7,marginBottom:20}}>{sel.desc}</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:20}}>
                  {sel.stats.map(s=><div key={s.l} style={{textAlign:'center',padding:'12px',borderRadius:2,background:`${sel.color}07`,border:`1px solid ${sel.color}14`}}>
                    <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,color:sel.color}}><CountUp end={s.v} suffix={s.s} decimals={s.v%1!==0?1:0} /></div>
                    <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.25)',marginTop:4}}>{s.l}</div>
                  </div>)}
                </div>
                <a href={sel.url} target="_blank" rel="noopener noreferrer" data-hover="true" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'14px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:13,background:sel.color,color:'#000',textDecoration:'none',letterSpacing:'0.06em'}}>OPEN LIVE WEBSITE ↗</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── SERVICES & PRICING ─────────────────────────────────────────────────────────
function Services() {
  const ref=useRef<HTMLDivElement>(null)
  const inView=useInView(ref,{once:true,margin:'-80px'})
  const { t } = useTheme()
  const toast = useToast()
  const [hovered,setHovered]=useState<number|null>(null)
  const plans=[
    {name:'Starter',price:'From $500',period:'per project',icon:'⚡',color:'#38BDF8',popular:false,desc:'Perfect for individuals and small businesses launching their digital presence.',features:['Custom Landing Page','Mobile Responsive','SEO Basics','Contact Form','2 Revisions','7-Day Delivery'],cta:'Get Started'},
    {name:'Pro',price:'From $1,500',period:'per project',icon:'💎',color:t.a,popular:true,desc:'Full-featured web apps and brand identities for growing businesses.',features:['Full Website (5–10 pages)','Custom Animations','CMS Integration','Brand Identity Kit','SEO Optimized','5 Revisions','Deployment Included','14-Day Delivery'],cta:'Most Popular'},
    {name:'Enterprise',price:'Custom',period:'quote',icon:'🚀',color:t.b,popular:false,desc:'Premium end-to-end solutions for companies that need the full package.',features:['Full-Stack Application','AI Integration','Custom Design System','E-Commerce & Payments','Performance Audit','Unlimited Revisions','Priority Support','Ongoing Maintenance'],cta:'Contact Me'},
  ]
  return (
    <section id="services" style={{position:'relative',padding:'8rem 0',overflow:'hidden',background:t.bg}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:700,height:700,borderRadius:'50%',pointerEvents:'none',background:`radial-gradient(circle,${t.a}03,${t.b}02,transparent 70%)`,filter:'blur(100px)'}} />
      <div ref={ref} style={{maxWidth:1280,margin:'0 auto',padding:'0 24px'}}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} style={{marginBottom:60,textAlign:'center'}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// 04 Services</span>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2.5rem,5vw,4rem)',color:'#fff',marginTop:12,lineHeight:1.1}}>
            What I<br /><GlitchText text="Offer." style={{color:t.b,textShadow:`0 0 40px ${t.b}30`}} />
          </h2>
          <p style={{fontFamily:'DM Sans,sans-serif',fontSize:16,color:'rgba(255,255,255,0.35)',maxWidth:480,margin:'16px auto 0'}}>Transparent pricing for every budget. All projects include clean code, premium design, and dedicated support.</p>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,alignItems:'center'}}>
          {plans.map((plan,i)=>(
            <motion.div key={plan.name} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*.1}}
              onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
              style={{position:'relative',borderRadius:2,overflow:'hidden',transition:'all .4s',background:t.card,border:`1px solid ${hovered===i||plan.popular?plan.color+'30':'rgba(255,255,255,0.05)'}`,boxShadow:hovered===i||plan.popular?`0 20px 60px ${plan.color}12`:'none',transform:plan.popular?'scale(1.04)':undefined}}>
              {plan.popular&&<div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${plan.color},${t.b})`,boxShadow:`0 0 15px ${plan.color}`}} />}
              {!plan.popular&&<div style={{height:1,background:`linear-gradient(90deg,transparent,${plan.color}50,transparent)`}} />}
              {plan.popular&&<div style={{position:'absolute',top:16,right:16,padding:'4px 10px',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:10,background:plan.color,color:'#000',fontWeight:700}}>POPULAR</div>}
              <div style={{padding:'32px 28px'}}>
                <div style={{width:48,height:48,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:20,background:`${plan.color}10`,border:`1px solid ${plan.color}20`}}>{plan.icon}</div>
                <div style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:20,color:'#fff',marginBottom:6}}>{plan.name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:12}}>
                  <span style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:28,color:plan.color,textShadow:`0 0 20px ${plan.color}40`}}>{plan.price}</span>
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'rgba(255,255,255,0.3)'}}>{plan.period}</span>
                </div>
                <p style={{fontFamily:'DM Sans,sans-serif',fontSize:13,color:'rgba(255,255,255,0.38)',lineHeight:1.6,marginBottom:24,minHeight:48}}>{plan.desc}</p>
                <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
                  {plan.features.map(f=>(
                    <div key={f} style={{display:'flex',alignItems:'center',gap:10,fontSize:13,fontFamily:'DM Sans,sans-serif',color:'rgba(255,255,255,0.6)'}}>
                      <span style={{width:18,height:18,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:`${plan.color}15`,border:`1px solid ${plan.color}25`,color:plan.color,fontSize:10,flexShrink:0}}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={()=>{ document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); toast(`${plan.name} plan selected!`,plan.icon) }} data-hover="true"
                  style={{width:'100%',padding:'13px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:13,letterSpacing:'0.06em',cursor:'pointer',transition:'all .3s',background:plan.popular?plan.color:'transparent',color:plan.popular?'#000':plan.color,border:`1px solid ${plan.color}40`,boxShadow:plan.popular?`0 0 30px ${plan.color}30`:undefined}}>
                  {plan.cta} →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.5}}
          style={{marginTop:40,padding:'28px 32px',borderRadius:2,background:t.card,border:'1px solid rgba(255,255,255,0.04)',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20}}>
          <div>
            <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#fff',marginBottom:6}}>Not sure which plan fits?</div>
            <p style={{fontFamily:'DM Sans,sans-serif',fontSize:14,color:'rgba(255,255,255,0.38)'}}>Let&apos;s talk. I&apos;ll help you figure out exactly what you need — no pressure, no fluff.</p>
          </div>
          <button onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} data-hover="true"
            style={{padding:'13px 28px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:13,letterSpacing:'0.06em',background:t.a,color:'#000',border:'none',cursor:'pointer',boxShadow:`0 0 30px ${t.a}30`,whiteSpace:'nowrap'}}>
            GET A FREE QUOTE →
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// ── CURRENTLY BUILDING ─────────────────────────────────────────────────────────
function CurrentlyBuilding() {
  const { t } = useTheme()
  const [vis, setVis] = useState(false)
  useEffect(()=>{const id=setTimeout(()=>setVis(true),3200);return()=>clearTimeout(id)},[])
  const projects=[
    {name:'AI Portfolio Builder',desc:'Let anyone generate a portfolio by answering 10 questions',stack:['Next.js','OpenAI','Prisma'],pct:68,color:t.a},
    {name:'OmniCreava Studio',desc:'Premium agency site with client portal + project tracker',stack:['Next.js','Supabase','Framer'],pct:42,color:t.b},
  ]
  return (
    <AnimatePresence>
      {vis&&(
        <motion.div initial={{opacity:0,x:80}} animate={{opacity:1,x:0}} exit={{opacity:0,x:80}} transition={{type:'spring',stiffness:200,damping:28}}
          style={{position:'fixed',bottom:160,right:24,zIndex:600,width:290}}>
          <div style={{borderRadius:2,background:'rgba(5,5,5,0.98)',border:`1px solid ${t.a}18`,boxShadow:`0 20px 60px rgba(0,0,0,0.9),0 0 30px ${t.a}06`,backdropFilter:'blur(24px)',overflow:'hidden'}}>
            <div style={{height:1,background:`linear-gradient(90deg,${t.a},${t.b})`}} />
            <div style={{padding:'14px 16px 16px'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:t.a,boxShadow:`0 0 8px ${t.a}`,display:'inline-block',animation:'pulse-neon 1.5s ease-in-out infinite'}} />
                  <span style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:11,color:'#fff',letterSpacing:'0.05em'}}>CURRENTLY BUILDING</span>
                </div>
                <button onClick={()=>setVis(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.2)',fontSize:14,cursor:'pointer',lineHeight:1}}>×</button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {projects.map((p,i)=>(
                  <div key={i} style={{padding:'10px 12px',borderRadius:2,background:`${p.color}06`,border:`1px solid ${p.color}15`}}>
                    <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,color:'#fff',marginBottom:3}}>{p.name}</div>
                    <div style={{fontFamily:'DM Sans,sans-serif',fontSize:11,color:'rgba(255,255,255,0.3)',lineHeight:1.4,marginBottom:8}}>{p.desc}</div>
                    <div style={{height:2,borderRadius:2,background:'rgba(255,255,255,0.06)',marginBottom:6,overflow:'hidden'}}>
                      <motion.div initial={{width:0}} animate={{width:`${p.pct}%`}} transition={{duration:1.4,delay:.5+i*.2,ease:[0.22,1,0.36,1]}}
                        style={{height:'100%',background:`linear-gradient(90deg,${p.color},${p.color}70)`,boxShadow:`0 0 8px ${p.color}60`}} />
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                        {p.stack.map(s=><span key={s} style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,padding:'1px 5px',borderRadius:2,background:`${p.color}10`,color:`${p.color}80`}}>{s}</span>)}
                      </div>
                      <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:p.color,fontWeight:700}}>{p.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── TESTIMONIALS ───────────────────────────────────────────────────────────────
function Testimonials() {
  const ref=useRef<HTMLDivElement>(null)
  const inView=useInView(ref,{once:true,margin:'-80px'})
  const {t}=useTheme()
  const [flipped,setFlipped]=useState<number|null>(null)
  const [active,setActive]=useState(0)
  const items=[
    {name:'Chinake Brands',role:'Brand Client',avatar:'CB',color:'#F472B6',quote:"Steve transformed our brand identity completely. The logo and website changed how clients perceive us overnight.",result:'3× Client Enquiries'},
    {name:'Saseka Holdings',role:'Web Client',avatar:'SH',color:'#38BDF8',quote:"Seamless to work with. He understood the brief instantly and delivered beyond what we imagined. Highly professional.",result:'On-time & On-budget'},
    {name:'Shagary Petroleum',role:'Corporate Client',avatar:'SP',color:'#FBBF24',quote:"Fast, creative, and professional. Steve built our entire web presence from scratch and kept us informed every step.",result:'Full Corporate Rebrand'},
    {name:'Kings Barber',role:'Small Business',avatar:'KB',color:'#4ADE80',quote:"Steve really understands small businesses. Our site looks as polished as any big brand. Customers keep complimenting it.",result:'Bookings Doubled'},
    {name:'Lux Studio',role:'Design Client',avatar:'LS',color:'#A78BFA',quote:"Exceptional detail. Every design has that premium touch that makes the brand feel intentional and high-end.",result:'Premium Rebranding'},
    {name:'Patient Portal',role:'Healthcare Tech',avatar:'PP',color:'#FB923C',quote:"The dashboard is clean, intuitive, and exactly what our users needed. Steve's speed was genuinely impressive.",result:'Launched in 2 Weeks'},
  ]
  useEffect(()=>{
    if(flipped!==null)return
    const id=setInterval(()=>setActive(a=>(a+1)%items.length),3800)
    return()=>clearInterval(id)
  },[flipped,items.length])
  return (
    <section id="testimonials" style={{position:'relative',padding:'clamp(4rem,8vw,8rem) 0',overflow:'hidden',background:'#060606'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'clamp(300px,600px,600px)',height:'clamp(300px,600px,600px)',borderRadius:'50%',pointerEvents:'none',background:`radial-gradient(circle,${t.b}03,transparent 70%)`,filter:'blur(100px)'}} />
      <div ref={ref} style={{maxWidth:1280,margin:'0 auto',padding:'0 clamp(12px,4vw,24px)'}}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} style={{marginBottom:'clamp(32px,6vw,56px)',textAlign:'center'}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(10px,1.5vw,11px)',color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// Client Voices</span>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2rem,6vw,4rem)',color:'#fff',marginTop:12,lineHeight:1.1}}>
            What Clients<br /><GlitchText text="Say." style={{color:t.a,textShadow:`0 0 40px ${t.a}30`}} />
          </h2>
          <p style={{fontFamily:'DM Sans,sans-serif',fontSize:'clamp(13px,2vw,15px)',color:'rgba(255,255,255,0.28)',marginTop:14}}>Click any card to flip it and see the result.</p>
        </motion.div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(clamp(280px,100%,300px),1fr))',gap:'clamp(10px,2vw,16px)',marginBottom:36}}>
          {items.map((item,i)=>(
            <motion.div key={item.name} initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*.07}}
              style={{perspective:1100,cursor:'pointer',height:220}} onClick={()=>setFlipped(flipped===i?null:i)}>
              <motion.div animate={{rotateY:flipped===i?180:0}} transition={{duration:.6,ease:[0.22,1,0.36,1]}}
                style={{position:'relative',width:'100%',height:'100%',transformStyle:'preserve-3d'}}>
                <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',borderRadius:2,padding:'22px',background:active===i?`${item.color}08`:t.card,border:`1px solid ${active===i||flipped===i?item.color+'28':'rgba(255,255,255,0.05)'}`,transition:'all .4s',display:'flex',flexDirection:'column',justifyContent:'space-between',boxShadow:active===i?`0 0 30px ${item.color}08`:undefined}}>
                  <div style={{fontFamily:'DM Sans,sans-serif',fontSize:13,lineHeight:1.75,color:'rgba(255,255,255,0.5)',fontStyle:'italic'}}>"{item.quote}"</div>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginTop:14}}>
                    <div style={{width:42,height:42,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:12,background:`${item.color}15`,border:`1px solid ${item.color}30`,color:item.color,flexShrink:0}}>{item.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:'#fff'}}>{item.name}</div>
                      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.2)'}}>{item.role}</div>
                    </div>
                    <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:`${item.color}50`,flexShrink:0}}>flip →</span>
                  </div>
                </div>
                <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',transform:'rotateY(180deg)',borderRadius:2,background:`${item.color}06`,border:`1px solid ${item.color}28`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,textAlign:'center',gap:0}}>
                  <div style={{height:1,position:'absolute',top:0,left:0,right:0,background:`linear-gradient(90deg,transparent,${item.color},transparent)`}} />
                  <div style={{width:60,height:60,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:18,background:`${item.color}12`,border:`1px solid ${item.color}25`,color:item.color,marginBottom:16}}>{item.avatar}</div>
                  <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:16,color:'#fff',marginBottom:4}}>{item.name}</div>
                  <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.28)',marginBottom:18}}>{item.role}</div>
                  <div style={{padding:'10px 20px',borderRadius:2,background:`${item.color}15`,border:`1px solid ${item.color}30`,fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:13,color:item.color}}>✓ {item.result}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:.5}} style={{display:'flex',justifyContent:'center',alignItems:'center',gap:6}}>
          {items.map((_,i)=>(
            <button key={i} onClick={()=>{setActive(i);setFlipped(null)}} data-hover="true"
              style={{width:i===active?28:6,height:6,borderRadius:2,border:'none',cursor:'pointer',transition:'all .4s ease',background:i===active?t.a:'rgba(255,255,255,0.1)',padding:0}} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ── WHATSAPP FLOAT ─────────────────────────────────────────────────────────────
function WhatsAppFloat() {
  const toast=useToast()
  return (
    <AnimatePresence>
      {
        <motion.a initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.7}}
          href="https://wa.me/27676283210?text=Hi%20Steve%2C%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project!"
          target="_blank" rel="noopener noreferrer" data-hover="true"
          onClick={()=>toast('Opening WhatsApp...','💬')}
          style={{position:'fixed',bottom:100,left:24,zIndex:500,width:46,height:46,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:'#25D366',border:'none',boxShadow:'0 4px 20px rgba(37,211,102,0.35)',cursor:'pointer',textDecoration:'none',fontSize:20}}>
          💬
        </motion.a>
      }
    </AnimatePresence>
  )
}

// ── GALLERY ────────────────────────────────────────────────────────────────────
function Gallery() {
  const ref=useRef<HTMLElement>(null)
  const inView=useInView(ref,{once:true,margin:'-80px'})
  const [tab,setTab]=useState<'logos'|'d3'>('logos')
  const [lb,setLb]=useState<{idx:number}|null>(null)
  const { t } = useTheme()
  const data:{logos:{s:string;l:string}[];d3:{s:string;l:string}[]}={
    logos:[{s:'img/chinake.jpg',l:'Chinake'},{s:'img/saseka.jpg',l:'Saseka'},{s:'img/media.png',l:'Media Co.'},{s:'img/theo.jpg',l:'Theo'},{s:'img/steve1.jpg',l:'Steve Brand'},{s:'img/Omni.png',l:'Omni'},{s:'img/hytkk.jpg',l:'Hytk'},{s:'img/lux.png',l:'Lux'}],
    d3:[{s:'img/3d1.jpg',l:'3D Render I'},{s:'img/3d2.jpg',l:'3D Render II'},{s:'img/3d1 (1).jpg',l:'3D Render III'},{s:'img/ball2.jpg',l:'Orb'},{s:'img/2_05am.png',l:'2:05 AM'},{s:'img/ggnn.jpg',l:'Abstract I'},{s:'img/ghgn.jpg',l:'Abstract II'},{s:'img/ice1.jpg',l:'Ice'},{s:'img/gonn.jpg',l:'Gonn'},{s:'img/cube1.jpg',l:'Cube Study'},{s:'img/cookis.png',l:'Cookies'},{s:'img/cfinal.png',l:'C Final'}]
  }
  const imgs=data[tab]
  useEffect(()=>{
    if(!lb)return
    const h=(e:KeyboardEvent)=>{ if(e.key==='Escape')setLb(null); if(e.key==='ArrowLeft')setLb(p=>p?{idx:(p.idx-1+imgs.length)%imgs.length}:p); if(e.key==='ArrowRight')setLb(p=>p?{idx:(p.idx+1)%imgs.length}:p) }
    window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h)
  },[lb,imgs.length])
  return (
    <section id="gallery" ref={ref} style={{position:'relative',padding:'clamp(4rem,8vw,8rem) 0',overflow:'hidden',background:'#060606'}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'0 clamp(12px,4vw,24px)'}}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} style={{marginBottom:'clamp(32px,6vw,48px)'}}>
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:'clamp(12px,3vw,20px)'}}>
            <div>
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(10px,1.5vw,11px)',color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// 05 Gallery</span>
              <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2rem,6vw,4rem)',color:'#fff',marginTop:12,lineHeight:1.1}}>
                Visual<br /><GlitchText text="Archive." style={{color:t.a,textShadow:`0 0 40px ${t.a}30`}} />
              </h2>
            </div>
            <div style={{display:'flex',gap:4,padding:4,borderRadius:2,background:'rgba(255,255,255,0.015)',border:'1px solid rgba(255,255,255,0.06)'}}>
              {(['logos','d3'] as const).map(tk=><button key={tk} onClick={()=>setTab(tk)} data-hover="true" style={{padding:'clamp(8px,1.5vw,10px) clamp(14px,3vw,20px)',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(9px,1.5vw,11px)',cursor:'pointer',transition:'all .3s',background:tab===tk?t.b:'transparent',color:tab===tk?'#000':'rgba(255,255,255,0.35)',border:'none',boxShadow:tab===tk?`0 0 25px ${t.b}40`:undefined}}>{tk==='logos'?'Logos':'3D Works'} ({data[tk].length})</button>)}
            </div>
          </div>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}} style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(clamp(180px,100%,220px),1fr))',gap:'clamp(6px,1.5vw,10px)'}}>
            {imgs.map((img,i)=>(
              <motion.div key={img.s} initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{delay:i*.04}}
                onClick={()=>setLb({idx:i})} whileHover={{scale:1.03}} data-hover="true" data-label={img.l}
                style={{position:'relative',overflow:'hidden',borderRadius:2,cursor:'pointer',aspectRatio:tab==='d3'?'4/3':'1/1',border:'1px solid rgba(255,255,255,0.05)',background:'#080808'}}>
                <img src={img.s} alt={img.l} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',transition:'all .6s',display:'block'}} />
                <div style={{position:'absolute',inset:0,opacity:0,transition:'opacity .3s',background:'linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.2) 60%,transparent 100%)',display:'flex',alignItems:'flex-end',justifyContent:'space-between',padding:12}}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.opacity='1'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.opacity='0'}>
                  <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.7)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{img.l}</span>
                  <div style={{width:28,height:28,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:`${t.a}15`,border:'1px solid rgba(255,255,255,0.2)',color:t.a,fontSize:12}}>↗</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {lb&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLb(null)}
            style={{position:'fixed',inset:0,zIndex:6000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.96)',backdropFilter:'blur(20px)'}}>
            <div style={{position:'absolute',top:24,left:'50%',transform:'translateX(-50%)',fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'rgba(255,255,255,0.3)',zIndex:10}}>{lb.idx+1} / {imgs.length}</div>
            <button onClick={()=>setLb(null)} data-hover="true" style={{position:'absolute',top:24,right:24,width:40,height:40,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.7)',border:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.5)',fontSize:20,cursor:'pointer',zIndex:10}}>×</button>
            <button onClick={e=>{e.stopPropagation();setLb(p=>p?{idx:(p.idx-1+imgs.length)%imgs.length}:p)}} data-hover="true" style={{position:'absolute',left:24,top:'50%',transform:'translateY(-50%)',width:48,height:48,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.7)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',fontSize:18,cursor:'pointer',zIndex:10}}>←</button>
            <button onClick={e=>{e.stopPropagation();setLb(p=>p?{idx:(p.idx+1)%imgs.length}:p)}} data-hover="true" style={{position:'absolute',right:24,top:'50%',transform:'translateY(-50%)',width:48,height:48,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.7)',border:'1px solid rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.5)',fontSize:18,cursor:'pointer',zIndex:10}}>→</button>
            <motion.div key={lb.idx} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.9}} transition={{duration:.25}} onClick={e=>e.stopPropagation()} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,zIndex:10}}>
              <img src={imgs[lb.idx].s} alt={imgs[lb.idx].l} style={{maxHeight:'72vh',maxWidth:'84vw',objectFit:'contain',borderRadius:2,boxShadow:`0 40px 120px rgba(0,0,0,0.9),0 0 80px ${t.a}05`}} />
              <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:'0.2em',textTransform:'uppercase'}}>{imgs[lb.idx].l}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── CONTACT ────────────────────────────────────────────────────────────────────
function Contact() {
  const ref=useRef<HTMLDivElement>(null)
  const inView=useInView(ref,{once:true,margin:'-80px'})
  const [copied,setCopied]=useState(false)
  const { t } = useTheme()
  const toast = useToast()
  const copy=()=>{ navigator.clipboard.writeText('stevezuluu@gmail.com'); setCopied(true); toast('Email copied!','✓'); setTimeout(()=>setCopied(false),2500) }
  const contacts=[
    {l:'Email',v:'stevezuluu@gmail.com',href:'mailto:stevezuluu@gmail.com',icon:'✉',c:t.a},
    {l:'LinkedIn',v:'steve-ronald1710s',href:'https://www.linkedin.com/in/steve-ronald1710s/',icon:'in',c:'#38BDF8'},
    {l:'GitHub',v:'Steve1-7',href:'https://github.com/Steve1-7',icon:'⌥',c:t.b},
  ]
  return (
    <section id="contact" style={{position:'relative',padding:'clamp(4rem,8vw,8rem) 0',overflow:'hidden',background:t.bg}}>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:`linear-gradient(${t.a} 1px,transparent 1px),linear-gradient(90deg,${t.a} 1px,transparent 1px)`,backgroundSize:'60px 60px',opacity:.015}} />
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'clamp(300px,600px,600px)',height:'clamp(300px,600px,600px)',borderRadius:'50%',pointerEvents:'none',background:`radial-gradient(circle,${t.a}04,${t.b}03,transparent 70%)`,filter:'blur(100px)'}} />
      <div ref={ref} style={{maxWidth:900,margin:'0 auto',padding:'0 clamp(12px,4vw,24px)',textAlign:'center'}}>
        <motion.div initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(10px,1.5vw,11px)',color:t.a,letterSpacing:'0.2em',textTransform:'uppercase'}}>// 06 Contact</span>
          <h2 style={{fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(2rem,7vw,5.5rem)',color:'#fff',marginTop:12,lineHeight:.95}}>
            Let&apos;s Build<br />
            <span style={{color:t.a,textShadow:`0 0 60px ${t.a}40`}}>Something</span>{' '}
            <span style={{color:t.b,textShadow:`0 0 60px ${t.b}40`}}>Epic.</span>
          </h2>
          <div style={{height:1,maxWidth:240,margin:'clamp(16px,3vw,24px) auto',background:`linear-gradient(90deg,transparent,${t.a},${t.b},transparent)`}} />
          <p style={{fontFamily:'DM Sans,sans-serif',fontSize:'clamp(14px,2vw,17px)',maxWidth:500,margin:'0 auto clamp(32px,6vw,48px)',lineHeight:1.7,color:'rgba(255,255,255,0.35)'}}>Have a vision? Whether it&apos;s a premium product or a passion project — I&apos;d love to hear it.</p>
        </motion.div>
        <motion.div initial={{opacity:0,scale:.9}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:.3}}
          style={{display:'flex',gap:'clamp(8px,2vw,14px)',justifyContent:'center',flexWrap:'wrap',marginBottom:'clamp(32px,6vw,56px)'}}>
          <a href="mailto:stevezuluu@gmail.com" data-hover="true" style={{padding:'clamp(12px,2vw,16px) clamp(20px,4vw,36px)',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(11px,1.5vw,13px)',letterSpacing:'0.08em',background:t.a,color:'#000',boxShadow:`0 0 50px ${t.a}38`,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,whiteSpace:'nowrap'}}>SEND A MESSAGE ✉</a>
          <button onClick={copy} data-hover="true" style={{padding:'clamp(12px,2vw,16px) clamp(16px,3vw,28px)',borderRadius:2,fontFamily:'JetBrains Mono,monospace',fontWeight:600,fontSize:'clamp(10px,1.5vw,12px)',letterSpacing:'0.08em',border:`1px solid ${t.b}40`,color:copied?t.a:t.b,background:copied?`${t.a}08`:'transparent',cursor:'pointer',transition:'all .3s',display:'inline-flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>{copied?'✓ COPIED!':'⎘ COPY EMAIL'}</button>
          <DownloadCV />
          <AvailabilityCalendar />
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:.4}}
          style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(clamp(160px,100%,200px),1fr))',gap:'clamp(8px,2vw,12px)',marginBottom:'clamp(32px,6vw,48px)'}}>
          {contacts.map(c=>(
            <a key={c.l} href={c.href} target="_blank" rel="noopener noreferrer" data-hover="true" data-label={`Open ${c.l}`}
              style={{display:'block',borderRadius:2,padding:'24px 20px',transition:'all .3s',background:t.card,border:'1px solid rgba(255,255,255,0.04)',textDecoration:'none'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=c.c+'35';(e.currentTarget as HTMLElement).style.transform='translateY(-4px)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.transform='translateY(0)'}}>
              <div style={{width:38,height:38,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,marginBottom:14,background:`${c.c}10`,border:`1px solid ${c.c}22`,color:c.c}}>{c.icon}</div>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:14,color:'#fff',marginBottom:6}}>{c.l}</div>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:c.c}}>{c.v}</div>
            </a>
          ))}
        </motion.div>
        <p style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.12)',letterSpacing:'0.1em'}}>Responds within 24h · South Africa · Available globally</p>
      </div>
    </section>
  )
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTheme()
  const [isMobile,setIsMobile]=useState(typeof window!=='undefined'?window.innerWidth<768:false)
  useEffect(()=>{
    const resize=()=>setIsMobile(window.innerWidth<768)
    window.addEventListener('resize',resize); return ()=>window.removeEventListener('resize',resize)
  },[])
  return (
    <footer style={{padding:'clamp(16px,3vw,32px) clamp(12px,4vw,24px)',background:'#030303',borderTop:`1px solid ${t.a}06`}}>
      <div style={{height:1,marginBottom:'clamp(16px,3vw,28px)',background:`linear-gradient(90deg,transparent,${t.a}18,${t.b}18,transparent)`}} />
      <div style={{maxWidth:1280,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'clamp(8px,2vw,16px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'clamp(6px,1.5vw,12px)'}}>
          <div style={{width:'clamp(20px,5vw,28px)',height:'clamp(20px,5vw,28px)',borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne,sans-serif',fontWeight:900,fontSize:'clamp(8px,1.5vw,11px)',background:`${t.a}0D`,border:`1px solid ${t.a}22`,color:t.a}}>SR</div>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(9px,1.5vw,11px)',color:'rgba(255,255,255,0.18)'}}>© {new Date().getFullYear()} Steve Ronald. All rights reserved.</span>
        </div>
        {!isMobile&&(
          <div style={{display:'flex',alignItems:'center',gap:'clamp(12px,2vw,20px)',flexWrap:'wrap'}}>
            <LiveTime />
            <div style={{display:'flex',gap:'clamp(8px,1.5vw,16px)',fontFamily:'JetBrains Mono,monospace',fontSize:'clamp(9px,1.5vw,11px)',color:'rgba(255,255,255,0.18)'}}>
              <span>Next.js 15</span>
              <span style={{color:`${t.a}30`}}>·</span>
              <span>Framer Motion</span>
              <span style={{color:`${t.a}30`}}>·</span>
              <span style={{color:t.a}}>OmniCreava Studio</span>
            </div>
          </div>
        )}
      </div>
      {!isMobile&&(
        <div style={{maxWidth:1280,margin:'12px auto 0',textAlign:'center',fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.1)'}}>
          Press <kbd style={{background:`${t.a}10`,border:`1px solid ${t.a}20`,color:t.a,padding:'1px 6px',borderRadius:2}}>?</kbd> for shortcuts · <kbd style={{background:`${t.a}10`,border:`1px solid ${t.a}20`,color:t.a,padding:'1px 6px',borderRadius:2}}>⌘K</kbd> for commands · Right-click for menu
        </div>
      )}
    </footer>
  )
}

// ── SCROLL TOP ─────────────────────────────────────────────────────────────────
function ScrollTop() {
  const [vis,setVis]=useState(false)
  const { t } = useTheme()
  useEffect(()=>{ const fn=()=>setVis(window.scrollY>500); window.addEventListener('scroll',fn,{passive:true}); return ()=>window.removeEventListener('scroll',fn) },[])
  return (
    <AnimatePresence>
      {vis&&<motion.button initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:16}} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} data-hover="true"
        style={{position:'fixed',bottom:100,right:32,zIndex:500,width:40,height:40,borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(5,5,5,0.92)',border:`1px solid ${t.a}22`,color:t.a,fontSize:16,boxShadow:`0 0 20px ${t.a}08`,backdropFilter:'blur(20px)',cursor:'pointer'}}>↑</motion.button>}
    </AnimatePresence>
  )
}

// ── GITHUB GRAPH ───────────────────────────────────────────────────────────────
function GitHubGraph() {
  const { t } = useTheme()
  const WEEKS = 52
  const [grid, setGrid] = useState<number[][]>([])
  const [total, setTotal] = useState(0)
  const [streak, setStreak] = useState(0)
  useEffect(()=>{
    const data: number[][] = []
    let tot = 0
    for (let w=0;w<WEEKS;w++){
      const row:number[]=[]
      const rec = w/WEEKS
      for(let d=0;d<7;d++){
        const v=Math.random()<(0.18+rec*0.52)?Math.floor(Math.random()*7)+1:0
        row.push(v); tot+=v
      }
      data.push(row)
    }
    // Try to patch with real events
    fetch('https://api.github.com/users/Steve1-7/events?per_page=100')
      .then(r=>r.json()).then((ev:Array<{created_at:string}>)=>{
        if(!Array.isArray(ev))return
        const now=Date.now()
        ev.forEach(e=>{
          const age=Math.floor((now-new Date(e.created_at).getTime())/(86400000))
          if(age<364){const wi=WEEKS-1-Math.floor(age/7);const di=age%7;if(wi>=0&&wi<WEEKS)data[wi][di]=Math.min(8,(data[wi][di]||0)+1)}
        })
        setGrid([...data])
      }).catch(()=>{})
    setGrid(data); setTotal(tot)
    let s=0;const flat=data.flat().reverse();for(const v of flat){if(v>0)s++;else break}
    setStreak(s)
  },[])
  const col=(v:number)=>{
    if(!v)return 'rgba(255,255,255,0.04)'
    const i=Math.min(v/8,1)
    if(i<0.25)return `${t.a}28`;if(i<0.5)return `${t.a}55`;if(i<0.75)return `${t.a}88`;return t.a
  }
  return (
    <div style={{marginTop:48,borderRadius:2,padding:'24px',background:'rgba(255,255,255,0.015)',border:'1px solid rgba(255,255,255,0.04)'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:12}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'rgba(255,255,255,0.28)'}}>GitHub Activity — past year</span>
          <a href="https://github.com/Steve1-7" target="_blank" rel="noopener noreferrer" data-hover="true" style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:t.a,textDecoration:'none',padding:'2px 8px',borderRadius:2,border:`1px solid ${t.a}22`,background:`${t.a}07`}}>@Steve1-7 ↗</a>
        </div>
        <div style={{display:'flex',gap:24}}>
          {[{v:total,l:'contributions',c:t.a},{v:streak,l:'day streak',c:t.b}].map(s=>(
            <div key={s.l} style={{textAlign:'center'}}>
              <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:20,color:s.c}}>{s.v}</div>
              <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:'rgba(255,255,255,0.2)'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{overflowX:'auto',paddingBottom:4}}>
        <div style={{display:'flex',gap:3,minWidth:'max-content'}}>
          {grid.map((week,wi)=>(
            <div key={wi} style={{display:'flex',flexDirection:'column',gap:3}}>
              {week.map((val,di)=>(
                <div key={di} title={`${val} contributions`}
                  style={{width:11,height:11,borderRadius:2,background:col(val),transition:'transform .15s,background .2s',cursor:'default'}}
                  onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.35)')}
                  onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:5,marginTop:10,justifyContent:'flex-end'}}>
        <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:'rgba(255,255,255,0.18)'}}>Less</span>
        {[0,2,4,6,8].map(v=><div key={v} style={{width:11,height:11,borderRadius:2,background:col(v)}} />)}
        <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:'rgba(255,255,255,0.18)'}}>More</span>
      </div>
    </div>
  )
}

// ── DOWNLOAD CV ────────────────────────────────────────────────────────────────
function DownloadCV() {
  const { t } = useTheme()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const download = () => {
    setLoading(true); toast('Generating CV…','📄')
    const skills = ['React / Next.js','TypeScript','Tailwind CSS','Framer Motion','Node.js / Express','PostgreSQL','MongoDB','Docker','Figma','Photoshop','Illustrator','Blender 3D','Three.js','Python','REST APIs','GraphQL','Stripe','AWS','SEO','Digital Marketing']
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Steve Ronald — CV</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#050505;color:#fff;padding:52px;max-width:860px;margin:0 auto}@media print{body{background:#050505;-webkit-print-color-adjust:exact;print-color-adjust:exact}}.name{font-size:46px;font-weight:900;letter-spacing:-0.02em}.name span{color:#00FF00}.role{color:#C77DFF;font-size:13px;letter-spacing:.18em;text-transform:uppercase;margin-top:8px;font-family:monospace}.contact{display:flex;flex-wrap:wrap;gap:20px;margin-top:16px;font-size:11px;color:rgba(255,255,255,.4);font-family:monospace;padding-top:20px;border-top:1px solid rgba(0,255,0,.12)}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin:32px 0}.stat{text-align:center;padding:18px;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05)}.stat-val{font-size:30px;font-weight:900;color:#00FF00}.stat-lbl{font-size:10px;color:rgba(255,255,255,.3);font-family:monospace;margin-top:4px}.st{font-size:10px;letter-spacing:.2em;color:#00FF00;text-transform:uppercase;font-family:monospace;margin:32px 0 14px}.exp{margin-bottom:16px;padding:18px;background:rgba(255,255,255,.02);border-left:2px solid rgba(0,255,0,.2)}.exp-t{font-size:15px;font-weight:700}.exp-m{font-size:11px;color:#C77DFF;font-family:monospace;margin:5px 0 8px}.exp-d{font-size:13px;color:rgba(255,255,255,.45);line-height:1.65}.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.stag{padding:6px 10px;background:rgba(0,255,0,.04);border:1px solid rgba(0,255,0,.1);font-size:11px;color:rgba(0,255,0,.65);font-family:monospace;text-align:center}.foot{font-size:10px;color:rgba(255,255,255,.12);text-align:center;margin-top:44px;font-family:monospace;letter-spacing:.1em}</style></head><body><div class="name">STEVE <span>RONALD</span></div><div class="role">Full‑Stack Developer · Brand Designer · 3D Artist · AI Builder</div><div class="contact"><span>✉ stevezuluu@gmail.com</span><span>⌥ github.com/Steve1-7</span><span>in linkedin.com/in/steve-ronald1710s</span><span>📍 South Africa</span></div><div class="stats"><div class="stat"><div class="stat-val">5+</div><div class="stat-lbl">Years</div></div><div class="stat"><div class="stat-val">80+</div><div class="stat-lbl">Projects</div></div><div class="stat"><div class="stat-val">30+</div><div class="stat-lbl">Clients</div></div><div class="stat"><div class="stat-val">100%</div><div class="stat-lbl">Satisfaction</div></div></div><div class="st">// About</div><p style="font-size:14px;color:rgba(255,255,255,.48);line-height:1.8">Full‑Stack Developer and Brand Designer with 5+ years of experience turning ideas into premium digital products. Specialising in React/Next.js, Node.js, Figma, Blender 3D, and AI-powered web applications. Based in South Africa, available globally.</p><div class="st">// Experience</div><div class="exp"><div class="exp-t">Freelance Full-Stack Developer &amp; Designer</div><div class="exp-m">2024 – Present · OmniCreava Studio</div><div class="exp-d">Building full-stack, AI-driven, and premium web applications for global clients. Brand strategy, UI/UX design, and development from concept to launch.</div></div><div class="exp"><div class="exp-t">Web Developer &amp; Graphic Designer</div><div class="exp-m">2024–2025 · Shagary Petroleum</div><div class="exp-d">Led web development and corporate branding for the energy sector. Responsive websites, marketing collateral, and visual identity.</div></div><div class="exp"><div class="exp-t">Graphic Designer &amp; Web Manager</div><div class="exp-m">2021–2023 · Saseka Woodworks</div><div class="exp-d">Part-time brand identity and web management. Created visual assets and managed all digital presence.</div></div><div class="exp"><div class="exp-t">Digital Marketer &amp; Web Manager</div><div class="exp-m">2019–2020 · Greenland Projects</div><div class="exp-d">Managed web properties and digital marketing campaigns. Operations paused during COVID-19 lockdowns.</div></div><div class="st">// Skills</div><div class="sg">${skills.map(s=>`<div class="stag">${s}</div>`).join('')}</div><div class="foot">OmniCreava Studio · ${new Date().getFullYear()} · Built with passion from South Africa</div></body></html>`
    const blob = new Blob([html],{type:'text/html'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url; a.download='Steve_Ronald_CV.html'; a.click()
    URL.revokeObjectURL(url); setLoading(false); toast('CV downloaded!','✓')
  }
  return (
    <button onClick={download} disabled={loading} data-hover="true"
      style={{display:'inline-flex',alignItems:'center',gap:8,padding:'16px 28px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:13,letterSpacing:'0.06em',background:'transparent',color:t.a,border:`1px solid ${t.a}35`,cursor:'pointer',transition:'all .3s',opacity:loading?.6:1}}>
      {loading?'⏳':'↓'} {loading?'GENERATING…':'DOWNLOAD CV'}
    </button>
  )
}

// ── AVAILABILITY CALENDAR ──────────────────────────────────────────────────────
function AvailabilityCalendar() {
  const [open, setOpen] = useState(false)
  const { t } = useTheme()
  const now = new Date()
  const yr = now.getFullYear(); const mo = now.getMonth()
  const days = new Date(yr,mo+1,0).getDate()
  const first = new Date(yr,mo,1).getDay()
  const mName = now.toLocaleString('default',{month:'long'})
  const booked = new Set([5,12,14,19,21,26,28])
  return (
    <>
      <button onClick={()=>setOpen(true)} data-hover="true"
        style={{display:'inline-flex',alignItems:'center',gap:8,padding:'16px 28px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:13,letterSpacing:'0.06em',background:'transparent',color:t.b,border:`1px solid ${t.b}35`,cursor:'pointer',transition:'all .3s'}}>
        📅 AVAILABILITY
      </button>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)}
            style={{position:'fixed',inset:0,zIndex:9300,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)'}}>
            <motion.div initial={{scale:.9,y:-20}} animate={{scale:1,y:0}} exit={{scale:.9}} onClick={e=>e.stopPropagation()}
              style={{width:'100%',maxWidth:380,borderRadius:2,background:'#080808',border:`1px solid ${t.a}18`,overflow:'hidden'}}>
              <div style={{height:1,background:`linear-gradient(90deg,${t.a},${t.b})`}} />
              <div style={{padding:'24px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
                  <div>
                    <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:18,color:'#fff'}}>{mName} {yr}</div>
                    <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.2)',marginTop:4}}>Steve&apos;s availability</div>
                  </div>
                  <button onClick={()=>setOpen(false)} data-hover="true" style={{width:32,height:32,borderRadius:2,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',color:'#666',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6,marginBottom:8}}>
                  {['S','M','T','W','T','F','S'].map((d,i)=>(
                    <div key={i} style={{textAlign:'center',fontFamily:'JetBrains Mono,monospace',fontSize:9,color:'rgba(255,255,255,0.2)',paddingBottom:6}}>{d}</div>
                  ))}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6}}>
                  {Array.from({length:first}).map((_,i)=><div key={`e${i}`} />)}
                  {Array.from({length:days}).map((_,i)=>{
                    const d=i+1; const busy=booked.has(d); const isToday=d===now.getDate()
                    return (
                      <div key={d} style={{aspectRatio:'1',borderRadius:2,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'JetBrains Mono,monospace',fontSize:11,background:busy?'rgba(255,255,255,0.03)':`${t.a}10`,border:isToday?`1px solid ${t.a}80`:busy?'1px solid rgba(255,255,255,0.05)':`1px solid ${t.a}18`,color:busy?'rgba(255,255,255,0.2)':t.a,boxShadow:isToday?`0 0 10px ${t.a}20`:undefined}}>
                        {d}
                      </div>
                    )
                  })}
                </div>
                <div style={{display:'flex',gap:16,marginTop:16,justifyContent:'center'}}>
                  {[[t.a,'Available'],['rgba(255,255,255,0.2)','Busy']].map(([c,l])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{width:11,height:11,borderRadius:2,background:c}} />
                      <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'rgba(255,255,255,0.3)'}}>{l}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>{setOpen(false);document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}} data-hover="true"
                  style={{width:'100%',marginTop:20,padding:'13px',borderRadius:2,fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:13,letterSpacing:'0.06em',background:t.a,color:'#000',border:'none',cursor:'pointer',boxShadow:`0 0 24px ${t.a}28`}}>
                  BOOK A SLOT →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── DEEP LINKS ─────────────────────────────────────────────────────────────────
function DeepLinks() {
  useEffect(()=>{
    const ids=['hero','about','skills','projects','services','testimonials','gallery','contact']
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting&&e.intersectionRatio>=0.25){
          const id=e.target.id
          history.replaceState(null,'',id==='hero'?window.location.pathname:`#${id}`)
        }
      })
    },{threshold:0.25})
    ids.forEach(id=>{ const el=document.getElementById(id); if(el)obs.observe(el) })
    return ()=>obs.disconnect()
  },[])
  return null
}

// ── MARQUEE DATA ───────────────────────────────────────────────────────────────
const TECH_ITEMS=['React','Next.js','TypeScript','Node.js','Figma','Blender','Framer Motion','Tailwind CSS','PostgreSQL','MongoDB','Stripe','Docker','Three.js','Python','AWS','GraphQL']
const VALUE_ITEMS=['Available for Work','Full-Stack Development','Brand Identity','3D Modelling','AI Integration','Premium Design','Clean Code','Fast Delivery','Global Clients','South Africa Based']

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function Page() {
  const [loaded,setLoaded]=useState(false)
  const [theme,setTheme]=useState<ThemeKey>('neon')
  return (
    <ThemeCtx.Provider value={{theme,t:THEMES[theme],setTheme}}>
      <ToastProvider>
        <div style={{background:THEMES[theme].bg,color:'#fff',minHeight:'100vh'}}>
          <PageLoader onDone={()=>setLoaded(true)} />
          {loaded&&(
            <>
              <CustomCursor />
              <MouseTrail />
              <CursorFollower />
              <NoiseOverlay />
              <ScrollProgressBar />
              <Nav />
              <Hero />
              <Marquee items={TECH_ITEMS} />
              <About />
              <Marquee items={VALUE_ITEMS} />
              <Skills />
              <Projects />
              <Services />
              <Testimonials />
              <Gallery />
              <Contact />
              <Footer />
              <ScrollTop />
              <CommandPalette />
              <AIChatBot />
              <ContextMenu />
              <KeyboardShortcuts />
              <CurrentlyBuilding />
              <WhatsAppFloat />
              <DeepLinks />
            </>
          )}
        </div>
        <style>{`
          @keyframes pulse-neon{0%,100%{opacity:1}50%{opacity:.3}}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
          @keyframes scroll-line{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}
          @keyframes spin-slow{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}
          *{cursor:none!important}
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-track{background:#050505}
          ::-webkit-scrollbar-thumb{background:linear-gradient(to bottom,#00FF00,#C77DFF);border-radius:2px}
        `}</style>
      </ToastProvider>
    </ThemeCtx.Provider>
  )
}
