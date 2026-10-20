"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { Heart } from "@phosphor-icons/react";

/** Hold is an optional tactile shortcut; click and keyboard work equally well. */
export function HugMoment({ count, reduced, onHug }: { count: number; reduced: boolean; onHug: () => void }) {
  const progress = useMotionValue(0);
  const ring = useTransform(progress, p => `conic-gradient(#b86089 ${p * 360}deg, #e7c8d8 0deg)`);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const completed = useRef(false);

  useEffect(() => () => { animation.current?.stop(); }, []);

  function start() {
    animation.current?.stop();
    completed.current = false;
    progress.set(0);
    animation.current = animate(progress, 1, {
      duration: reduced ? .15 : 1.2,
      ease: "linear",
      onComplete: () => { completed.current = true; onHug(); },
    });
  }

  function release() {
    animation.current?.stop();
    animation.current = animate(progress, 0, { duration: .25 });
  }

  return <div className="hug-moment">
    <div className="hug-ripples" aria-hidden="true" key={count}>
      {count > 0 && !reduced && [0, 1, 2].map(i => <motion.span key={i}
        initial={{ opacity: .5, scale: .35 }}
        animate={{ opacity: 0, scale: 5 + i }}
        transition={{ duration: 2.8, delay: i * .3, ease: "easeOut" }} />)}
    </div>
    <motion.button className="hug-button" aria-label={count ? "Ôm thêm cái nữa" : "Nhận một cái ôm"}
      style={{ background: ring }}
      whileHover={reduced ? {} : { scale: 1.06 }}
      whileTap={{ scale: .94 }}
      onPointerDown={event => {
        if(event.button!==0)return;
        event.currentTarget.setPointerCapture(event.pointerId);
        start();
      }}
      onPointerUp={release}
      onPointerCancel={()=>{completed.current=false;release();}}
      onLostPointerCapture={release}
      onBlur={release}
      onClick={event => {
        // detail=0 includes keyboard and assistive technology activation.
        if (!completed.current || event.detail === 0) onHug();
        completed.current = false;
      }}>
      <span><Heart size={37} weight="fill" /></span>
    </motion.button>
    <p className="hug-caption" aria-live="polite">{count ? "Rồi, giữ bé thêm chút nữa." : "Anh còn để dành một cái ôm."}</p>
    <span className="hug-instruction">{count ? "Chạm trái tim để ôm thêm cái nữa." : "Chạm hoặc giữ trái tim để nhận nha."}</span>
  </div>;
}
