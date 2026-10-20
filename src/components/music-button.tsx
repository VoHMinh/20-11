"use client";
import { useEffect, useRef, useState } from "react";
import { MusicNotes, SpeakerSlash } from "@phosphor-icons/react";

// An original, gently arpeggiated music-box loop, synthesized locally.
export function MusicButton() {
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tick = useRef(0);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); void audio.current?.close(); }, []);
  async function toggle() {
    if (playing) {
      if (timer.current) clearInterval(timer.current);
      await audio.current?.suspend(); setPlaying(false); return;
    }
    try {
      audio.current ??= new AudioContext();
      await audio.current.resume();
      const chords = [[261.63,329.63,392,523.25],[220,261.63,329.63,440],[174.61,220,261.63,349.23],[196,246.94,293.66,392]];
      const play = () => {
        const ac = audio.current!; const n = tick.current++;
        const freq = chords[Math.floor(n / 8) % 4][[0,2,1,3,2,1,3,2][n % 8]];
        const gain = ac.createGain(); gain.gain.setValueAtTime(0,ac.currentTime);
        gain.gain.linearRampToValueAtTime(.055,ac.currentTime+.018);
        gain.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+1.7); gain.connect(ac.destination);
        const osc = ac.createOscillator(); osc.type="sine"; osc.frequency.value=freq*2;
        osc.connect(gain); osc.start(); osc.stop(ac.currentTime+1.8);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      };
      play(); timer.current = setInterval(play, 430); setPlaying(true); setUnavailable(false);
    } catch { setUnavailable(true); }
  }
  return <button className={`music-button ${playing ? "playing" : ""}`} onClick={toggle} aria-pressed={playing} aria-label={unavailable ? "Thử lại nhạc" : playing ? "Tắt nhạc" : "Bật nhạc"}>
    {playing ? <MusicNotes size={18} /> : <SpeakerSlash size={18} />}
    <span>{unavailable ? "Thử lại nhạc" : playing ? "Tắt nhạc" : "Bật nhạc"}</span>
    <i className="sound-bars" aria-hidden="true"><b/><b/><b/></i>
  </button>;
}
