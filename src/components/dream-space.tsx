"use client";
import Image from "next/image";
import { motion, type MotionValue } from "motion/react";
import type { CSSProperties } from "react";
import { photoSrc } from "@/lib/story";
const fragments=[
  {id:4,x:6,y:19,w:135,r:-15,delay:-3},{id:8,x:80,y:14,w:138,r:13,delay:-11},
  {id:11,x:-3,y:65,w:150,r:12,delay:-7},{id:14,x:88,y:61,w:145,r:-12,delay:-18},
  {id:7,x:18,y:80,w:96,r:-10,delay:-15},{id:9,x:73,y:84,w:100,r:17,delay:-21},
  {id:2,x:23,y:-8,w:110,r:9,delay:-6},{id:10,x:65,y:-11,w:115,r:-8,delay:-13},
];
export default function DreamSpace({scene,x,y}:{scene:number;x:MotionValue<number>;y:MotionValue<number>}){
  return <div className={`dream-space space-${scene}`} aria-hidden="true">
    <div className="dream-sky"/><div className="light-bloom bloom-a"/><div className="light-bloom bloom-b"/>
    <motion.div className="floating-memories" style={{x,y}}>
      {fragments.map((p,i)=><div key={p.id} className={`memory-fragment fragment-${i}`} style={{left:`${p.x}%`,top:`${p.y}%`,width:p.w,"--rotation":`${p.r}deg`,"--delay":`${p.delay}s`} as CSSProperties}><Image src={photoSrc(p.id)} alt="" width={180} height={240} loading={i<2?"eager":"lazy"}/></div>)}
    </motion.div>
    <div className="center-light"/>
    <div className="ambient-petals">{Array.from({length:16},(_,i)=><span key={i} style={{"--left":`${(i*37+9)%100}%`,"--duration":`${18+i%5*5}s`,"--delay":`${-i*3.7}s`,"--size":`${12+i%4*8}px`,"--drift":`${i%2?-100:130}px`} as CSSProperties}><Image src="/images/flower.webp" alt="" width={50} height={50}/></span>)}</div>
    <div className="dream-vignette"/>
  </div>;
}
