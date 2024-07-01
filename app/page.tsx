"use client";
import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".swipeflix-text",
      { x: '-100%', opacity: 0 },
      { x: '0%', opacity: 1, duration: 1.5, ease: "power3.out" }
    );

    tl.fromTo(
      ".left-half",
      { x: '-100%', opacity: 0 },
      { x: '0%', opacity: 1, duration: 1, ease: "power3.out" },
      "-=1"
    );

    tl.fromTo(
      ".right-half",
      { x: '100%', opacity: 0 },
      { x: '0%', opacity: 1, duration: 1, ease: "power3.out" },
      "-=1"
    );
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-sky-500 via-emerald-500">
      <div className="text-center">
        <h1 className="swipeflix-text text-6xl md:text-8xl font-bold text-white drop-shadow-lg">
          Swipeflix
        </h1>
        <div className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
          <p className="left-half inline-block">Discover movies.&nbsp;</p>
          <p className="right-half inline-block">Just for You.</p>
        </div>
      </div>
    </div>
  );
}


