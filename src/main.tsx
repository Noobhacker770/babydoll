import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Settings,Volume2,VolumeX,RotateCcw,ArrowLeft,Lock,Star,Heart,Sparkles,Music2,Cat,Gift,ChevronRight} from 'lucide-react';
import './styles.css';

type Theme={bg:string;accent:string;accent2:string;icon:string;tag:string};
type Activity={id:string;title:string;subtitle:string;theme:Theme;collectible:string;icon:string;unlock:number;kind:string};
type State={version:number;completed:string[];collectibles:string[];achievements:string[];garden:number;pet:number;outfit:string[];compliments:string[];music:boolean;muted:boolean;revealSeen:boolean;clicks:number};

// PERSONALIZATION: change only this object.
const CONFIG={
  HER_NAME:'Zainab', YOUR_NAME:'Me', NICKNAME:'',
  primary:'#ff7b9c', secondary:'#a78bfa', greeting:'A little world, just for you.',
  finalLines:['Okay…','I think you finally found the thing I was hiding.','All those little worlds?','They were for you.','Every silly game.','Every tiny detail.','I made them because I wanted to steal one tiny smile from you.','And because you matter to me more than I can fit into one little website.','Welcome to your little universe.'],
  customCompliments:[] as string[], relationshipDate:'', musicPath:'', soundPaths:{} as Record<string,string>, imagePaths:{} as Record<string,string>
};

const A:Activity[]=[
{id:'anger',title:'Anger Room',subtitle:'A completely safe place to bonk the responsible party.',theme:{bg:'berry',accent:'#ff5d73',accent2:'#ffb4c0',icon:'BONK',tag:'comic chaos'},collectible:'heart-fragment',icon:'bonk',unlock:0,kind:'anger'},
{id:'cafe',title:'Strawberry Cafe',subtitle:'Build something suspiciously delicious.',theme:{bg:'cafe',accent:'#ff6f91',accent2:'#ffd6a5',icon:'CAFE',tag:'warm & sweet'},collectible:'strawberry-cake',icon:'cake',unlock:0,kind:'cafe'},
{id:'garden',title:'Cherry Blossom Garden',subtitle:'Plant a tiny quiet corner of the universe.',theme:{bg:'garden',accent:'#e68bb8',accent2:'#b8e0d2',icon:'GARDEN',tag:'slow down'},collectible:'garden-flower',icon:'flower',unlock:0,kind:'garden'},
{id:'cloud',title:'Cloud Kingdom',subtitle:'Catch stars. Ignore gravity.',theme:{bg:'cloud',accent:'#8bb8ff',accent2:'#c8b6ff',icon:'CLOUD',tag:'dreamy'},collectible:'constellation',icon:'cloud',unlock:0,kind:'catch'},
{id:'cozy',title:'Cozy Room',subtitle:'Touch everything. The cat approves.',theme:{bg:'cozy',accent:'#d98b63',accent2:'#f5d9a6',icon:'COZY',tag:'quiet'},collectible:'firefly',icon:'lamp',unlock:0,kind:'objects'},
{id:'arcade',title:'Hit Me Again',subtitle:'Tap the suspiciously fast target.',theme:{bg:'arcade',accent:'#69e7ff',accent2:'#ff7de1',icon:'ARCADE',tag:'reflex'},collectible:'arcade-heart',icon:'target',unlock:1,kind:'arcade'},
{id:'dress',title:'Dress Me Up',subtitle:'Fashion has consequences. Probably.',theme:{bg:'fashion',accent:'#b88cff',accent2:'#ff9db8',icon:'WARDROBE',tag:'chaos couture'},collectible:'outfit',icon:'shirt',unlock:1,kind:'dress'},
{id:'carnival',title:'Love Carnival',subtitle:'Spin the wheel. Blame the wheel.',theme:{bg:'carnival',accent:'#ffd166',accent2:'#ff7ac8',icon:'CARNIVAL',tag:'midnight fun'},collectible:'ticket',icon:'wheel',unlock:1,kind:'wheel'},
{id:'music',title:'Magic Music Box',subtitle:'A tiny stage with entirely too much drama.',theme:{bg:'music',accent:'#c5b3ff',accent2:'#7ce7d6',icon:'MUSIC BOX',tag:'twinkle'},collectible:'music-note',icon:'note',unlock:1,kind:'music'},
{id:'chocolate',title:'Chocolate Factory',subtitle:'Quality control is going suspiciously well.',theme:{bg:'choco',accent:'#c88b65',accent2:'#ffcb77',icon:'CHOCOLATE',tag:'sweet chaos'},collectible:'chocolate',icon:'bar',unlock:2,kind:'chocolate'},
{id:'pet',title:'Pet Room',subtitle:'Someone tiny has been waiting for you.',theme:{bg:'pet',accent:'#f4a261',accent2:'#8ecae6',icon:'PET ROOM',tag:'tiny friend'},collectible:'heart-tag',icon:'pet',unlock:2,kind:'pet'},
{id:'dance',title:'Make Me Dance',subtitle:'Please direct this performance responsibly.',theme:{bg:'stage',accent:'#ff6bcb',accent2:'#7df9ff',icon:'STAGE',tag:'encore'},collectible:'spotlight',icon:'dance',unlock:2,kind:'dance'},
{id:'mystery',title:'Mystery Room',subtitle:'Five tiny puzzles. One suspicious drawer.',theme:{bg:'mystery',accent:'#9d8cff',accent2:'#5c6ac4',icon:'MYSTERY',tag:'curious'},collectible:'secret-fragment',icon:'key',unlock:3,kind:'mystery'},
{id:'compliment',title:'Compliment Machine',subtitle:'Press the button. Accept no substitutes.',theme:{bg:'lab',accent:'#ff83b5',accent2:'#ffd1e1',icon:'LAB',tag:'dangerously nice'},collectible:'saved-compliment',icon:'heart',unlock:3,kind:'compliment'},
{id:'button',title:'The Forbidden Button',subtitle:'It says do not press. So obviously…',theme:{bg:'void',accent:'#ff5d73',accent2:'#8f7cff',icon:'WARNING',tag:'suspicious'},collectible:'secret-ticket',icon:'button',unlock:3,kind:'button'},
{id:'quiz',title:'Love Quiz',subtitle:'Extremely scientific. Probably.',theme:{bg:'quiz',accent:'#ff8fab',accent2:'#9b8cff',icon:'QUIZ',tag:'highly official'},collectible:'quiz-star',icon:'quiz',unlock:4,kind:'quiz'},
{id:'castle',title:'Achievement Castle',subtitle:'Look what you accidentally built.',theme:{bg:'castle',accent:'#e7c86e',accent2:'#8da4ff',icon:'CASTLE',tag:'trophies'},collectible:'castle-star',icon:'castle',unlock:4,kind:'castle'},
{id:'moon',title:'Moonlight Room',subtitle:'One quiet place before the lights come on.',theme:{bg:'moon',accent:'#d7dcff',accent2:'#8f9dff',icon:'MOONLIGHT',tag:'almost there'},collectible:'moon-star',icon:'moon',unlock:5,kind:'moon'}
];

const ACH=[['Emotional Damage','Bonk the avatar 12 times'],['Heart Collector','Collect 5 world pieces'],['Garden Keeper','Grow 3 flowers'],['Dessert Designer','Build a dessert'],['Menace','Bonk 30 times'],['Button Destroyer','Press the forbidden button 10 times'],['Pet Whisperer','Pet your tiny friend'],['Dance Director','Complete a dance routine'],['Mystery Solver','Solve the mystery room'],['Carnival Champion','Spin the wheel'],['Final Explorer','Enter the hidden world'],['Luckiest Girl','Reach the final celebration']];

const defaultState=():State=>({version:1,completed:[],collectibles:[],achievements:[],garden:0,pet:0,outfit:[],compliments:[],music:false,muted:true,revealSeen:false,clicks:0});
function load():State{try{const x=JSON.parse(localStorage.getItem('tiny-universe-v1')||'null'); if(!x||x.version!==1)return defaultState(); return {...defaultState(),...x}}catch{return defaultState()}}
function save(s:State){try{localStorage.setItem('tiny-universe-v1',JSON.stringify(s))}catch{}}
function award(s:State,id:string){if(!s.collectibles.includes(id))s.collectibles.push(id)}
function Stars(){return <div className="stars" aria-hidden>{Array.from({length:22},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,top:`${(i*61)%100}%`,animationDelay:`${(i%7)*.7}s`}}/> )}</div>}
function Avatar({mood='idle'}:{mood?:string}){return <div className={`avatar ${mood}`} aria-label="cartoon character"><div className="hair"/><div className="face"><span className="eye l"/><span className="eye r"/><span className="mouth"/></div><div className="body"/><div className="shoe a"/><div className="shoe b"/></div>}
function unlockCount(s:State){return s.completed.length}
function isUnlocked(a:Activity,s:State){return a.unlock<=unlockCount(s)}

function ActivityView({a,s,setS,onBack}:{a:Activity;s:State;setS:React.Dispatch<React.SetStateAction<State>>;onBack:()=>void}){
 const [local,setLocal]=useState(0); const [msg,setMsg]=useState(''); const [choice,setChoice]=useState('');
 const complete=(extra?:Partial<State>)=>setS(prev=>{const n={...prev,...extra}; if(!n.completed.includes(a.id))n.completed=[...n.completed,a.id]; award(n,a.collectible); return n});
 const reactions=['Okay.','That was personal.','I deserved approximately 12% of that.','WHY DID I BUILD THIS FEATURE?','I have learned nothing.','Okay okay, message received.','MY HAIR.','Can we negotiate?'];
 const theme=a.theme;
 return <div className={`room room-${theme.bg}`} style={{'--accent':theme.accent,'--accent2':theme.accent2} as React.CSSProperties}>
   <Stars/><header className="roomHead"><button className="iconBtn" onClick={onBack} aria-label="Back"><ArrowLeft/></button><div><small>{theme.icon} · {theme.tag}</small><h1>{a.title}</h1></div><span className="pill">{s.completed.includes(a.id)?'Completed':'Explore'}</span></header>
   <main className="playArea">
   {a.kind==='anger'&&<><div className="comicBurst">BONK</div><Avatar mood={local>0?'bonked':'idle'}/><div className="score">damage <b>{local}</b></div><p className="reaction">{msg||'The responsible party is standing right there.'}</p><div className="toolRow">{['Slap','Teddy Bonk','Newspaper','Tomato','Cake Splat','Slipper','Foam Hammer','Confetti'].map((x,i)=><button key={x} className="gameBtn" onClick={()=>{setLocal(v=>v+1);setMsg(reactions[(local+i)%reactions.length]); if(local+1===12) setMsg('Okay. I think we have established your position.'); if(local+1>=12) complete();setS(p=>({...p,clicks:p.clicks+1}));}}>{x}</button>)}</div>{local>=30&&<div className="milestone">Emergency crew has arrived. They brought a helmet. The helmet was also bonked.</div>}</>}
   {a.kind==='cafe'&&<><div className="scene cafeScene"><div className="cakePreview">{choice||'cake'}</div><Avatar mood="nervous"/></div><p>{msg||'Chef is ready. Choose your masterpiece.'}</p><div className="choiceGrid">{['strawberry cloud cake','berry shortcake','cream tart','pink cupcake','moon macaroon'].map(x=><button key={x} className="gameBtn" onClick={()=>{setChoice(x);setMsg(`Chef's approval: 100%. ${x} is yours.`);complete()}}>{x}</button>)}</div></>}
   {a.kind==='garden'&&<><div className="gardenGrid">{[0,1,2,3,4,5].map(i=><button key={i} className={`plant ${i<local?'grown':''}`} onClick={()=>{if(i===local){setLocal(v=>v+1);setMsg(i===2?'A hidden heart was tucked under the roots.':'Something tiny is growing.'); if(i===2)complete({garden:Math.max(s.garden,3)});}}}>{i<local?'✿':'+'}</button>)}</div><p>{msg||'Pick a little spot.'}</p></>}
   {a.kind==='catch'&&<><div className="skyGame">{Array.from({length:9},(_,i)=><button key={i} className="fallingStar" style={{left:`${8+(i*31)%82}%`,top:`${8+(i*47)%75}%`}} onClick={()=>{setLocal(v=>v+1); if(local+1>=6){setMsg('The stars just rearranged themselves.');complete()}}}>★</button>)}</div><p>{msg||`Stars caught: ${local}/6`}</p></>}
   {a.kind==='objects'&&<><div className="cozyObjects">{['Lamp','Window','Teddy','Pillow','Blanket','Mug','Plant','Cat','Projector'].map(x=><button key={x} className="objectBtn" onClick={()=>{setLocal(v=>v+1);setMsg(x==='Cat'?'The cat has decided you are acceptable.':`${x}: a tiny animation happened.`);if(local+1>=5)complete()}}>{x}</button>)}</div><p>{msg||'Touch something.'}</p></>}
   {a.kind==='arcade'&&<><div className="arcadeBox"><button className="target" style={{left:`${15+(local*29)%70}%`,top:`${18+(local*37)%68}%`}} onClick={()=>{setLocal(v=>v+1);setMsg('Nice. Suspiciously fast.');if(local+1>=8)complete()}}>ME</button></div><p>{msg||`Combo ${local}/8`}</p></>}
   {a.kind==='dress'&&<><Avatar mood="proud"/><div className="choiceGrid">{['pink jacket','lavender suit','giant hat','tiny glasses','sparkly shoes','ridiculous scarf'].map(x=><button key={x} className="gameBtn" onClick={()=>{setLocal(v=>v+1);setS(p=>({...p,outfit:[...p.outfit,x]}));setMsg(`Is this fashion? ${x} is now canon.`);if(local+1>=3)complete()}}>{x}</button>)}</div><button className="secondary" onClick={()=>{setChoice('random chaos');setMsg('The stylist has lost control.');complete()}}>Randomize</button></>}
   {a.kind==='wheel'&&<><div className="wheel" style={{transform:`rotate(${local*73}deg)`}}><span>COMPLIMENT</span><span>CHOCOLATE</span><span>HUG</span><span>DANCE</span><span>HEART</span><span>SECRET</span></div><button className="primary" onClick={()=>{setLocal(v=>v+1);setMsg(['Tiny compliment','Emergency hug','Bonus heart','Character dance','Secret ticket'][local%5]);complete()}}>SPIN</button><p>{msg}</p></>}
   {a.kind==='music'&&<><div className="musicBox"><Music2 size={54}/><div className="notes">♪ ♫ ♪</div></div><button className="primary" onClick={()=>{setLocal(v=>v+1);setMsg(local%2?'The tiny dancers are getting ambitious.':'The music box is awake.');setS(p=>({...p,music:!p.music}));if(local+1>=2)complete()}}>{s.music?'Pause':'Play'}</button><button className="secondary" onClick={()=>setLocal(0)}>Make them dance faster</button><p>{msg}</p></>}
   {a.kind==='chocolate'&&<><div className="factory"><div className="choc">{choice||'CHOCOLATE'}</div></div><div className="choiceGrid">{['moon','heart','star','square'].map(x=><button key={x} className="gameBtn" onClick={()=>{setChoice(x);setMsg('Quality control passed.');complete()}}>{x} shape</button>)}</div><p>{msg}</p></>}
   {a.kind==='pet'&&<><div className="pet"><Cat size={88}/><div className="petHeart">{local>2?'♥':''}</div></div><div className="choiceGrid">{['Pet','Feed','Toy','Bow'].map(x=><button key={x} className="gameBtn" onClick={()=>{setLocal(v=>v+1);setMsg(x==='Pet'?'Someone tiny has decided to stay near you.':`${x}: excellent tiny-friend care.`);if(x==='Pet')setS(p=>({...p,pet:p.pet+1}));if(local+1>=3)complete()}}>{x}</button>)}</div></>}
   {a.kind==='dance'&&<><Avatar mood="dance"/><div className="choiceGrid">{['Dance','Spin','Moonwalk','Jump','Cry','Bow','Dramatic Pose'].map(x=><button key={x} className="gameBtn" onClick={()=>{setLocal(v=>v+1);setMsg(['Polite applause','Confused applause','Standing ovation','Please stop','Encore!'][local%5]);if(local+1>=4)complete()}}>{x}</button>)}</div><p>{msg}</p></>}
   {a.kind==='mystery'&&<><div className="mysteryGrid">{['Stars in order','Arrange flowers','Clock hands','Match symbols','Find key'].map((x,i)=><button key={x} className={`puzzle ${i<local?'solved':''}`} onClick={()=>{if(i===local){setLocal(v=>v+1);setMsg(`${x}: solved.`);if(local+1>=5)complete()}}}>{i<local?'SOLVED':x}</button>)}</div><p>{msg||'Five tiny puzzles. Nothing mean.'}</p></>}
   {a.kind==='compliment'&&<><div className="machine"><Heart size={72}/><span>GENERATE COMPLIMENT</span></div><button className="primary" onClick={()=>{const pool=[...CONFIG.customCompliments,...['You somehow look adorable while being completely unimpressed.','You make ordinary moments feel less ordinary.','You have excellent taste in tiny universes.','You are dangerously good at being cute when you are pretending not to be.','Your existence has been suspiciously good for my mood.']];const c=pool[local%pool.length];setMsg(c);setLocal(v=>v+1);setS(p=>({...p,compliments:[...p.compliments,c]}));if(local+1>=2)complete()}}>GENERATE COMPLIMENT</button><p>{msg}</p></>}
   {a.kind==='button'&&<><button className="forbidden" onClick={()=>{const n=local+1;setLocal(n);setMsg(n===10?'You really are committed to this.':n%3===0?'System warning: excessive curiosity detected.':'Nothing exploded. Yet.');if(n>=10)complete()}}>DO NOT PRESS</button><p>{msg||'There is definitely no reason to press this.'}</p></>}
   {a.kind==='quiz'&&<><p className="question">Who is more dramatic?</p><div className="choiceGrid">{['Me','Her','Obviously both','This question is rigged'].map(x=><button key={x} className="gameBtn" onClick={()=>{setMsg(`Certified ${CONFIG.HER_NAME} Knowledge Level: suspiciously high.`);complete()}}>{x}</button>)}</div><p>{msg}</p></>}
   {a.kind==='castle'&&<><div className="castle"><div className="tower"/><div className="tower"/><div className="gate"/></div><div className="badges">{ACH.map(([x],i)=><div key={x} className={i<Math.min(ACH.length,s.achievements.length+1)?'badge on':'badge'}>{x}</div>)}</div><button className="primary" onClick={()=>complete()}>Explore the castle</button></>}
   {a.kind==='moon'&&<><div className="moonScene"><div className="bigMoon"/><div className="blanket"><Avatar/><Avatar mood="soft"/></div></div><p>{msg||'One more world remains.'}</p><button className="primary" onClick={()=>{setMsg('A tiny star moves where it should not.');complete()}}>Make a constellation</button></>}
   <div className="reward"><Sparkles size={16}/> {s.completed.includes(a.id)?'Piece added quietly.':'Something may be waiting for you.'}</div>
   </main>
 </div>
}

function FinalReveal({s,setS,onBack}:{s:State;setS:React.Dispatch<React.SetStateAction<State>>;onBack:()=>void}){const [step,setStep]=useState(0);const [skip,setSkip]=useState(false);useEffect(()=>{if(skip)return; if(step<CONFIG.finalLines.length){const t=setTimeout(()=>setStep(v=>v+1),step===0?1000:2300);return()=>clearTimeout(t)}},[step,skip]);useEffect(()=>setS(p=>({...p,revealSeen:true})),[]);return <div className="finalWorld"><Stars/><div className="finalLights">{Array.from({length:28},(_,i)=><span key={i} style={{left:`${(i*19)%100}%`,top:`${(i*43)%100}%`}}/> )}</div><div className="finalObjects"><div className="gardenGlow">✿</div><div className="ticketGlow">TICKET</div><div className="noteGlow">♪</div><div className="petGlow">♥</div><div className="constellation">★ · ★ · ★</div></div><div className="finalChars"><Avatar mood="soft"/><Avatar mood="soft"/></div><div className="finalText">{CONFIG.finalLines.slice(0,skip?CONFIG.finalLines.length:step).map((x,i)=><p key={i} className={i===CONFIG.finalLines.length-1?'bigLine':''}>{x.replace('[HER_NAME]',CONFIG.HER_NAME)}</p>)}</div><div className="finalActions">{step<CONFIG.finalLines.length&&!skip&&<button className="secondary" onClick={()=>setSkip(true)}>Skip reveal</button>}{(step>=CONFIG.finalLines.length||skip)&&<><div className="achievementFinal">Achievement unlocked<br/><b>Luckiest Girl in This Tiny Universe</b></div><button className="primary" onClick={onBack}>Stay a little longer</button></>}</div></div>}

function App(){
 const [s,setS]=useState(load);
 const [active,setActive]=useState<string|null>(null);
 const [settings,setSettings]=useState(false);
 const progress=Math.min(100,Math.round((s.collectibles.length/18)*100));
 const current=A.find(x=>x.id===active);
 const finalUnlocked=s.collectibles.length>=12||s.completed.length>=12;
 const sorted=A;

 useEffect(()=>save(s),[s]);
 useEffect(()=>{
   setS(p=>{
     const next=[...p.achievements];
     const add=(id:string)=>{if(!next.includes(id))next.push(id)};
     if(p.clicks>=12)add('Emotional Damage');
     if(p.clicks>=30)add('Menace');
     if(p.garden>=3)add('Garden Keeper');
     if(p.pet>=1)add('Pet Whisperer');
     if(p.completed.length>=5)add('Heart Collector');
     if(p.completed.includes('cafe'))add('Dessert Designer');
     if(p.completed.includes('dance'))add('Dance Director');
     if(p.completed.includes('mystery'))add('Mystery Solver');
     if(p.completed.includes('carnival'))add('Carnival Champion');
     if(p.completed.includes('button'))add('Button Destroyer');
     if(p.completed.includes('moon') && finalUnlocked)add('Final Explorer');
     if(p.revealSeen)add('Luckiest Girl');
     return next.length===p.achievements.length?p:{...p,achievements:next};
   });
 },[s.clicks,s.garden,s.pet,s.completed.length,s.revealSeen,finalUnlocked]);

 if(active==='final')return <FinalReveal s={s} setS={setS} onBack={()=>setActive(null)}/>;
 if(current)return <ActivityView a={current} s={s} setS={setS} onBack={()=>setActive(null)}/>;
 return <div className="home"><Stars/><div className="ambientMoon"/><header className="top"><div className="brand">A LITTLE UNIVERSE</div><div className="topActions"><span className="progress"><Star size={15}/> {s.collectibles.length} collected</span><button className="iconBtn" onClick={()=>setSettings(true)} aria-label="Settings"><Settings/></button></div></header><main className="homeMain"><section className="hero"><div className="heroCopy"><span className="eyebrow">A tiny place made with an unreasonable amount of effort</span><h1>A Little World For <em>{CONFIG.HER_NAME}</em></h1><p>{CONFIG.greeting} Proceed at your own risk. There may be excessive cuteness.</p></div><div className="heroChars"><Avatar mood="soft"/><Avatar mood="proud"/><div className="glowDoor"/></div></section><section className="mapHeader"><div><small>THE WORLD MAP</small><h2>Pick somewhere to wander.</h2></div><div className="progressBar"><span style={{width:`${progress}%`}}/></div></section><section className="map">{sorted.map((a)=>{const u=isUnlocked(a,s);return <button disabled={!u} key={a.id} className={`location ${a.theme.bg} ${u?'':'locked'} ${s.completed.includes(a.id)?'done':''}`} onClick={()=>setActive(a.id)}><div className="locationIcon">{u?<span>{a.theme.icon}</span>:<Lock size={20}/>}</div><div><b>{a.title}</b><small>{u?a.subtitle:'A little further down the path'}</small></div>{s.completed.includes(a.id)&&<Heart className="doneHeart" size={16} fill="currentColor"/>}<ChevronRight size={18}/></button>})}{finalUnlocked&&<button className="secretPortal" onClick={()=>setActive('final')}><div className="portal"><Sparkles/></div><div><b>A door that wasn't there before</b><small>It looks like it knows your name.</small></div><ChevronRight/></button>}</section></main>{settings&&<div className="modalBack" onClick={()=>setSettings(false)}><div className="settings" onClick={e=>e.stopPropagation()}><div className="settingsHead"><h2>Settings</h2><button className="iconBtn" onClick={()=>setSettings(false)} aria-label="Close settings">×</button></div><label className="toggle"><span>{s.muted?'Sound off':'Sound on'}</span><button aria-label="Toggle sound" onClick={()=>setS(p=>({...p,muted:!p.muted}))}>{s.muted?<VolumeX/>:<Volume2/>}</button></label><button className="wide" onClick={()=>{if(confirm('Clear all progress?'))setS(defaultState())}}><RotateCcw/> Reset progress</button>{finalUnlocked&&<button className="wide" onClick={()=>{setSettings(false);setActive('final')}}><Gift/> Replay surprise</button>}<p className="credits">Made with an unreasonable amount of effort.</p></div></div>}</div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
