"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, MotionConfig, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowCounterClockwise, Heart, Flower, Sparkle, X, Pause, Play, ArrowsOut, HandTap } from "@phosphor-icons/react";
import { photos, photoSrc, wishes, questions, letters } from "@/lib/story";
import { FlowerCanvas, type FlowerHandle } from "./flower-canvas";
import { MusicButton } from "./music-button";
import DreamSpace from "./dream-space";
import { HugMoment } from "./hug-moment";

const scenes=["Một bó hoa","Ảnh của tụi mình","Hẹn bé một hôm","Mấy lời gửi bé","Một cái ôm"];
const ease=[.22,1,.36,1] as const;
export default function LoveStory(){
  const [scene,setScene]=useState(0),[visited,setVisited]=useState(0),[direction,setDirection]=useState(1);
  const [wish,setWish]=useState(-1),[bouquet,setBouquet]=useState(0);
  const [photo,setPhoto]=useState(0),[autoPhotos,setAutoPhotos]=useState(true);
  const [question,setQuestion]=useState(0),[reaction,setReaction]=useState<number|null>(null),[quizDone,setQuizDone]=useState(false);
  const [answers,setAnswers]=useState<number[]>([]);
  const [letterBeat,setLetterBeat]=useState(0),[hugs,setHugs]=useState(0);
  const [calm,setCalm]=useState(false),[lightbox,setLightbox]=useState(false);
  const flowers=useRef<FlowerHandle>(null),lastSwitch=useRef(0),sceneHeading=useRef<HTMLHeadingElement>(null);
  const systemReduce=useReducedMotion(),reduce=!!systemReduce||calm;
  const pointerX=useMotionValue(0),pointerY=useMotionValue(0);
  const x=useSpring(pointerX,{stiffness:35,damping:18}),y=useSpring(pointerY,{stiffness:35,damping:18});
  const go=useCallback((next:number)=>{
    if(next<0||next>4||next===scene||Date.now()-lastSwitch.current<850)return;
    lastSwitch.current=Date.now();setDirection(next>scene?1:-1);setVisited(v=>Math.max(v,next));setScene(next);
    if(!reduce)flowers.current?.burst(innerWidth*.5,innerHeight*.75,next===4);
  },[scene,reduce]);
  const changePhoto=useCallback((delta:number)=>setPhoto(p=>(p+delta+photos.length)%photos.length),[]);
  useEffect(()=>{
    if(scene!==1||!autoPhotos||lightbox||reduce)return;
    const timer=setInterval(()=>{if(!document.hidden)changePhoto(1);},4800);
    return()=>clearInterval(timer);
  },[scene,autoPhotos,lightbox,reduce,changePhoto]);
  function receiveFlowers(){setWish(w=>(w+1)%wishes.length);flowers.current?.burst(innerWidth*.5,innerHeight*.58,true);}
  function next(){
    if(scene===0){if(wish<0){receiveFlowers();return;}go(1);}
    else if(scene===1)go(2);
    else if(scene===2){
      if(quizDone)go(3);
      else if(reaction!==null){if(question===questions.length-1){setQuizDone(true);flowers.current?.burst(undefined,undefined,true);}else{setQuestion(q=>q+1);setReaction(null);}}
    }else if(scene===3){if(letterBeat<letters.length-1)setLetterBeat(v=>v+1);else go(4);}
    else flowers.current?.burst(undefined,undefined,true);
  }
  const nextRef=useRef(next);nextRef.current=next;
  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{
      const target=event.target as HTMLElement;
      if(lightbox||target.closest("button,a,input"))return;
      if(event.key==="ArrowRight"){event.preventDefault();nextRef.current();}
      if(event.key==="ArrowLeft"){event.preventDefault();if(scene===3&&letterBeat>0)setLetterBeat(v=>v-1);else go(scene-1);}
    };
    window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);
  },[scene,letterBeat,go,lightbox]);
  function answer(index:number){setReaction(index);setAnswers(a=>{const next=[...a];next[question]=index;return next;});if(questions[question].answers[index].reaction==="sweet")flowers.current?.burst();}
  function replay(){setWish(-1);setQuestion(0);setReaction(null);setQuizDone(false);setAnswers([]);setLetterBeat(0);setHugs(0);setPhoto(0);setAutoPhotos(true);go(0);}
  const nextLabel=scene===0?(wish<0?"Cho hoa nở nào":"Đi cùng anh"):scene===1?"Hẹn bé một hôm nha":scene===2?(quizDone?"Anh còn mấy lời này":reaction!==null?(question===questions.length-1?"Mở cái hẹn của tụi mình":"Còn một câu nữa thôi"):"Bé chọn điều mình thích nha"):scene===3?(letterBeat<letters.length-1?"Đọc tiếp nè":"Lại đây anh ôm"):"Thêm hoa cho bé";
  const picked=reaction===null?null:questions[question].answers[reaction];
  const current=photos[photo];
  return <MotionConfig reducedMotion={reduce?"always":"never"}>
    <main className={`love-film scene-is-${scene} ${reduce?"is-calm":""}`}
      onPointerMove={event=>{if(!reduce&&event.pointerType==="mouse"){pointerX.set((event.clientX/innerWidth-.5)*-22);pointerY.set((event.clientY/innerHeight-.5)*-15);}}}
      onPointerLeave={()=>{pointerX.set(0);pointerY.set(0);}}>
      <DreamSpace scene={scene} x={x} y={y}/><FlowerCanvas ref={flowers} disabled={reduce}/>
      <header className="film-header">
        <button className="film-signature" onClick={replay} aria-label="Anh gửi bé · Kể lại từ đầu"><Heart weight="fill" size={15}/><span>anh gửi bé</span></button>
        <span className="film-dedication">MỘT NGÀY DÀNH RIÊNG CHO NGƯỜI ANH THƯƠNG</span>
        <div className="film-tools"><button className="round-control motion-control" onClick={()=>setCalm(v=>!v)} aria-label={calm?"Bật chuyển động":"Dừng chuyển động"} aria-pressed={calm}>{calm?<Play size={15}/>:<Pause size={15}/>}</button><MusicButton/></div>
      </header>
      <div className="film-stage">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.section key={scene} className={`film-scene film-scene-${scene}`} aria-label={scenes[scene]}
            initial={reduce?{opacity:1}:{opacity:0,scale:1.07,y:direction*30,filter:"blur(10px)"}}
            animate={{opacity:1,scale:1,y:0,filter:"blur(0px)"}}
            exit={reduce?{opacity:0}:{opacity:0,scale:.92,y:direction*-30,filter:"blur(12px)"}}
            transition={{duration:reduce?.15:.65,ease}}
            onAnimationComplete={()=>{sceneHeading.current?.focus({preventScroll:true});}}>
            {scene===0&&<>
              <div className="occasion-watermark" aria-hidden="true">20<span>·</span>10</div>
              <div className={`opening-copy ${wish>=0?"has-wish":""}`} aria-live="polite">
                <span className="scene-eyebrow"><span/>CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM<span/></span>
                <AnimatePresence mode="wait"><motion.div key={wish} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.35}}>
                  <h1 ref={sceneHeading} tabIndex={-1}>{wish<0?<>Hôm nay, mọi dịu dàng<br/>đều <em>dành cho bé.</em></>:<em>{wishes[wish].title}</em>}</h1>
                  <p>{wish<0?"Anh có hoa, có cả mấy lời muốn nói. Bé chạm thử nha.":wishes[wish].text}</p>
                </motion.div></AnimatePresence>
              </div>
              <div className="flower-portal"><div className="portal-orbit orbit-a"/><div className="portal-orbit orbit-b"/><div className="portal-glow"/>
                <motion.button className="hero-bouquet" aria-label="Chạm bó hoa để nhận lời chúc" onClick={receiveFlowers} whileHover={reduce?{}:{scale:1.045,rotate:3}} whileTap={{scale:.93}}>
                  <AnimatePresence mode="wait"><motion.div key={bouquet} initial={{opacity:0,rotate:-6,scale:.9}} animate={{opacity:1,rotate:0,scale:1}} exit={{opacity:0,scale:.9}} transition={{duration:.45}}><Image src={bouquet===0?"/images/bouquet.webp":"/images/bouquet-pastel.webp"} alt="Bó hoa dành riêng cho bé ngày 20/10" width={490} height={600} priority/></motion.div></AnimatePresence>
                </motion.button><span className="flower-shadow"/>
                <span className="floating-note note-left">hoa dành cho bé,<br/>còn anh cũng vậy.</span><span className="floating-note note-right">chỉ cần bé cười,<br/>là ngày đẹp trời.</span>
                <Sparkle className="portal-sparkle sparkle-a" size={23} weight="duotone"/><Sparkle className="portal-sparkle sparkle-b" size={17} weight="fill"/>
              </div>
              <div className="flower-invitation"><button className="touch-flower" onClick={receiveFlowers}><HandTap size={17}/>{wish<0?"Chạm vào hoa, anh có lời chúc nè":"Chạm thêm cái nữa, anh còn lời chúc"}</button><div className="flower-options"><button className={bouquet===0?"selected":""} aria-label="Chọn bó hoa hồng" aria-pressed={bouquet===0} onClick={()=>setBouquet(0)}><span/></button><button className={bouquet===1?"selected":""} aria-label="Chọn bó hoa pastel" aria-pressed={bouquet===1} onClick={()=>setBouquet(1)}><span/></button><span>{wish<0?"hai bó hoa, một người nhận":`lời thương ${wish+1} / ${wishes.length}`}</span></div></div>
            </>}
            {scene===1&&<>
              <div className="scene-heading memory-heading"><span className="scene-eyebrow">MỞ ALBUM RA LÀ THẤY NHỚ BÉ</span><h2 ref={sceneHeading} tabIndex={-1}>Mấy tấm hình thôi,<br/>mà anh <em>xem hoài.</em></h2></div>
              <div className="memory-universe" aria-label="Album 15 khoảnh khắc" onPointerDown={()=>setAutoPhotos(false)}>
                {[-2,-1,0,1,2].map(offset=>{
                  const index=(photo+offset+photos.length)%photos.length,item=photos[index];
                  return <motion.button key={item.id} className={`memory-window ${offset===0?"in-focus":""}`} aria-label={offset===0?`Mở ảnh: ${item.caption}`:offset<0?"Xem ảnh phía trước":"Xem ảnh tiếp theo"}
                    initial={false} animate={{x:`${offset*88}%`,y:Math.abs(offset)*17,scale:offset===0?1:1-Math.abs(offset)*.14,rotateY:offset*-22,rotateZ:offset*5,opacity:Math.abs(offset)===2?.25:offset===0?1:.65,zIndex:10-Math.abs(offset)*2}}
                    transition={{type:"spring",stiffness:90,damping:21}}
                    onClick={()=>{setAutoPhotos(false);if(offset===0)setLightbox(true);else changePhoto(offset);}}
                    drag={offset===0?"x":false} dragConstraints={{left:0,right:0}} dragElastic={.15}
                    onDragEnd={(_,info)=>{if(Math.abs(info.offset.x)>45){changePhoto(info.offset.x<0?1:-1);setAutoPhotos(false);}}}>
                    <Image src={photoSrc(item.id)} alt={item.caption} width={450} height={600} draggable={false}/>{offset===0&&<span className="memory-expand"><ArrowsOut size={17}/></span>}
                  </motion.button>;
                })}
              </div>
              <div className="memory-caption"><AnimatePresence mode="wait"><motion.p key={photo} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}>{current.caption}</motion.p></AnimatePresence><div className="memory-controls"><button className="round-control" aria-label="Ảnh trước" onClick={()=>{setAutoPhotos(false);changePhoto(-1);}}><ArrowLeft size={17}/></button><span>{String(photo+1).padStart(2,"0")} <i/> 15</span><button className="round-control" aria-label="Ảnh tiếp" onClick={()=>{setAutoPhotos(false);changePhoto(1);}}><ArrowRight size={17}/></button><button className="autoplay-control" aria-label={autoPhotos?"Dừng ảnh tự chuyển":"Cho ảnh tự chuyển"} aria-pressed={autoPhotos} onClick={()=>setAutoPhotos(v=>!v)}>{autoPhotos?<Pause size={13}/>:<Play size={13}/>}</button></div><small>Kéo sang hai bên để xem. Chạm ảnh giữa để ngắm kỹ hơn.</small></div>
            </>}
            {scene===2&&<div className={`teasing-scene ${quizDone?"has-invitation":""}`}>
              <span className="scene-eyebrow">{quizDone?"HOÁ RA ANH ĐANG RỦ BÉ ĐI CHƠI":`HAI CÂU THÔI, ANH HỨA · ${question+1}/${questions.length}`}</span>
              <AnimatePresence mode="wait"><motion.div key={quizDone?"done":question} className="teasing-content" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-24}} transition={{duration:.4}}>
                <h2 ref={sceneHeading} tabIndex={-1}>{quizDone?<>Vậy là mình có<br/><em>một cái hẹn.</em></>:questions[question].title}</h2>
                {!quizDone&&reaction===null&&<><p className="question-whisper">{questions[question].note}</p><div className="question-heart"><Heart weight="duotone" size={80}/><span>{question===0?"đi với bé là anh thích rồi":"anh nghe nè…"}</span></div><div className="story-answers">{questions[question].answers.map((option,i)=><motion.button key={option.text} onClick={()=>answer(i)} whileHover={reduce?{}:{y:-4}} whileTap={{scale:.97}}><span>{i===0?"a.":"b."}</span>{option.text}</motion.button>)}</div></>}
                {picked&&!quizDone&&<motion.div className={`reaction-scene ${picked.reaction}`} initial={reduce?false:{scale:.4,rotate:-12,opacity:0,y:90}} animate={{scale:1,rotate:0,opacity:1,y:0}} transition={{type:"spring",stiffness:180,damping:15}}>
                  <div className="reaction-portrait"><Image src={`/images/reaction-${picked.reaction==="sweet"?"01":"02"}.webp`} alt={picked.reaction==="sweet"?"Anh cười tít mắt":"Anh giả vờ phụng phịu"} width={280} height={350}/><span className="reaction-sticker">{picked.sticker}</span></div>
                  <p aria-live="polite">{picked.reply}</p>
                </motion.div>}
                {quizDone&&<motion.div className="date-keepsake" initial={reduce?false:{rotateX:-35,rotateZ:-5,y:45,opacity:0}} animate={{rotateX:0,rotateZ:-2,y:0,opacity:1}} transition={{type:"spring",stiffness:85,damping:16}}>
                  <div className="date-photo"><Image src={photoSrc(8)} alt="Một tấm ảnh của hai đứa mình" width={280} height={350}/><span>anh & bé</span></div>
                  <div className="date-plan"><Heart size={24} weight="duotone" aria-hidden="true"/><span className="date-title">Dành một buổi cho nhau</span><p>{questions[0].answers[answers[0]??0].keepsake}</p><p>{questions[1].answers[answers[1]??0].keepsake}</p><span className="date-postscript">Bé chọn ngày, anh dành thời gian.</span></div>
                </motion.div>}
                {quizDone&&<p className="keepsake-hint">Chụp lại gửi anh, rồi mình chốt hẹn nha.</p>}
              </motion.div></AnimatePresence>
            </div>}
            {scene===3&&<div className="whisper-scene">
              <span className="scene-eyebrow">CÒN MẤY LỜI NÀY, ANH NÓI THẬT</span><span className="letter-quote" aria-hidden="true">“</span>
              <AnimatePresence mode="wait"><motion.div key={letterBeat} className="letter-beat" initial={{opacity:0,y:22,filter:reduce?"none":"blur(5px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} exit={{opacity:0,y:-15}} transition={{duration:.65,ease}}>
                <h2 ref={sceneHeading} tabIndex={-1}>{letters[letterBeat].title}<br/><em>{letters[letterBeat].emphasis}</em></h2><p>{letters[letterBeat].text}</p><motion.span className="letter-last-line" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:reduce?0:.5,duration:.8}}>{letters[letterBeat].last}</motion.span>
              </motion.div></AnimatePresence>
              <div className="letter-beat-nav" aria-label="Các đoạn thư">{letters.map((_,i)=><button key={i} aria-label={`Đọc đoạn thư ${i+1}`} aria-pressed={letterBeat===i} onClick={()=>setLetterBeat(i)}><span className={letterBeat===i?"active":""}/></button>)}</div><span className="letter-signoff">Thương bé, <em>Anh.</em><Heart size={17}/></span>
            </div>}
            {scene===4&&<div className={`ending-scene ${hugs>0?"is-hugged":""}`}>
              <div className="heart-constellation" aria-hidden="true">{photos.map((p,i)=>{
                const t=i/photos.length*Math.PI*2,hx=16*Math.pow(Math.sin(t),3),hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
                return <motion.div className="heart-memory" key={p.id} style={{left:`${50+hx*2.65}%`,top:`${49+hy*2.45}%`,"--tilt":`${(i%3-1)*11}deg`} as CSSProperties} initial={reduce?false:{opacity:0,scale:0,y:60}} animate={{opacity:hugs>0?.9:.66,scale:hugs>0?1.1:1,y:0}} transition={{delay:reduce?0:i*.04,duration:.8}}><Image src={photoSrc(p.id)} alt="" width={100} height={130}/></motion.div>;
              })}</div>
              <div className="ending-copy"><span className="scene-eyebrow">20 THÁNG 10 · THƯƠNG BÉ THÊM MỘT CHÚT</span><AnimatePresence mode="wait"><motion.div key={hugs>0?"hug":"greeting"} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.5}}><h2 ref={sceneHeading} tabIndex={-1}>{hugs>0?<>Ôm bé một cái,<br/><em>thật lâu.</em></>:<>Chúc mừng 20/10,<br/><em>bé yêu của anh.</em></>}</h2><p className="final-message">{hugs>0?<>Hôm nào gặp nhau, anh ôm bù.<br/>Còn giờ, 20/10 vui thật vui nha bé.</>:<>Chúc bé hôm nay vui hơn một chút,<br/>và ngày nào cũng thấy mình được thương.</>}</p></motion.div></AnimatePresence></div>
              <HugMoment count={hugs} reduced={reduce} onHug={()=>{setHugs(v=>v+1);flowers.current?.burst(innerWidth*.5,innerHeight*.65,true);}}/>
            </div>}
          </motion.section>
        </AnimatePresence>
        <AnimatePresence>{!reduce&&<motion.div key={scene} className="scene-light-sweep" initial={{x:"-160%",opacity:0}} animate={{x:"160%",opacity:[0,.65,0]}} transition={{duration:1.2,ease}} aria-hidden="true"/>}</AnimatePresence>
      </div>
      <footer className="film-footer">
        <div className="scene-counter"><span>0{scene+1}</span><i/>05 <em>{scenes[scene]}</em></div>
        <nav className="film-chapters" aria-label="Các cảnh trong câu chuyện">{scenes.map((name,i)=><button key={name} aria-label={`Cảnh ${String(i+1).padStart(2,"0")}: ${name}`} aria-current={scene===i?"step":undefined} className={`${scene===i?"current":""} ${i<=visited?"visited":""}`} onClick={()=>go(i)}><span/><small>{String(i+1).padStart(2,"0")}</small></button>)}</nav>
        <div className="scene-navigation">{scene>0&&<button className="round-control back-scene" aria-label="Cảnh trước" onClick={()=>go(scene-1)}><ArrowLeft size={17}/></button>}{scene===4&&<button className="round-control replay-story" aria-label="Xem lại câu chuyện" onClick={replay}><ArrowCounterClockwise size={18}/></button>}<button className="continue-story" onClick={next} disabled={scene===2&&reaction===null&&!quizDone}><span>{nextLabel}</span>{scene===4?<Flower size={20}/>:<ArrowRight size={19}/>}</button></div>
      </footer>
      <span className="film-edge-label" aria-hidden="true">FOR MY FAVORITE GIRL, ALWAYS.</span>
      <Dialog.Root open={lightbox} onOpenChange={setLightbox}><Dialog.Portal><Dialog.Overlay className="cinema-overlay"/><Dialog.Content className="cinema-lightbox"><Dialog.Title className="sr-only">Bé trong mắt anh</Dialog.Title><Dialog.Close className="round-control close-lightbox" aria-label="Đóng ảnh"><X size={21}/></Dialog.Close><Image src={photoSrc(current.id,true)} alt={current.caption} width={900} height={1200}/><Dialog.Description>{current.caption}</Dialog.Description><div className="lightbox-nav"><button className="round-control" aria-label="Ảnh trước trong ảnh lớn" onClick={()=>changePhoto(-1)}><ArrowLeft size={20}/></button><span>{photo+1} / 15</span><button className="round-control" aria-label="Ảnh tiếp trong ảnh lớn" onClick={()=>changePhoto(1)}><ArrowRight size={20}/></button></div></Dialog.Content></Dialog.Portal></Dialog.Root>
    </main>
  </MotionConfig>;
}
