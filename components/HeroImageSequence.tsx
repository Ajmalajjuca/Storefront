"use client";

import React, { useEffect, useRef, useState } from "react";

type HeroImageSequenceProps = {
  frameCount?: number;
  framePath?: string;
  frameExtension?: "webp" | "jpg" | "png";
  fallbackImage?: string;
  children?: React.ReactNode;
};

export default function HeroImageSequence({
  frameCount = 192,
  framePath = "/hero-sequence/ezgif-frame-",
  frameExtension = "webp",
  fallbackImage = "/hero-sequence/ezgif-frame-001.webp",
  children,
}: HeroImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isSafeFallback, setIsSafeFallback] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const checkFallback = () => {
      setIsSafeFallback(mediaQuery.matches || window.innerWidth < 768);
    };
    checkFallback();
    window.addEventListener("resize", checkFallback);
    return () => window.removeEventListener("resize", checkFallback);
  }, []);

  useEffect(() => {
    if (isSafeFallback) return;

    let isMounted = true;
    let currentFrame = 1;

    const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      
      const img = imagesRef.current[index];
      if (!img) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const imgAspect = img.width / img.height;
      const canvasAspect = canvas.width / canvas.height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgAspect > canvasAspect) {
        drawHeight = canvas.height;
        drawWidth = canvas.height * imgAspect;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgAspect;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      }
      
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    const loadImages = async () => {
      imagesRef.current = new Array(frameCount + 1);
      
      const firstImg = new Image();
      firstImg.src = `${framePath}${String(1).padStart(3, "0")}.${frameExtension}`;
      await new Promise((resolve) => {
        firstImg.onload = () => {
          imagesRef.current[1] = firstImg;
          resolve(true);
        };
      });
      
      if (!isMounted) return;
      renderFrame(1);
      
      for (let i = 2; i <= frameCount; i++) {
        if (!isMounted) break;
        const img = new Image();
        img.src = `${framePath}${String(i).padStart(3, "0")}.${frameExtension}`;
        img.onload = () => {
          imagesRef.current[i] = img;
          if (currentFrame === i) {
             requestAnimationFrame(() => renderFrame(i));
          }
        };
      }
    };

    loadImages();

    const onScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const offsetTop = containerRef.current.offsetTop;
      const height = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const maxScroll = height - windowHeight; 
      let scrollProgress = (scrollY - offsetTop) / maxScroll;
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      
      const frameIndex = Math.min(
        frameCount,
        Math.max(1, Math.floor(scrollProgress * frameCount) + 1)
      );
      
      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex;
        requestAnimationFrame(() => renderFrame(frameIndex));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => renderFrame(currentFrame));
    
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", () => renderFrame(currentFrame));
    };
  }, [frameCount, framePath, frameExtension, isSafeFallback]);

  return (
    <div ref={containerRef} style={{ height: "250vh", position: "relative", width: "100%" }}>
      <div 
        style={{ 
          position: "sticky", 
          top: 0, 
          height: "100vh", 
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#030303"
        }}
      >
        {isSafeFallback ? (
          <img
            src={fallbackImage}
            alt="Hero background fallback"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0
            }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
              zIndex: 0
            }}
          />
        )}
        
        {/* Dark gradient overlay for readability */}
        <div 
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(circle at 100% 100%, rgba(3,3,3,0.95) 0%, rgba(3,3,3,0) 250px),
              radial-gradient(circle at 0% 100%, rgba(3,3,3,0.95) 0%, rgba(3,3,3,0) 250px),
              radial-gradient(circle at center, transparent 0%, rgba(3,3,3,0.4) 100%),
              linear-gradient(to bottom, rgba(3,3,3,0.2) 0%, rgba(3,3,3,0.7) 100%)
            `,
            pointerEvents: "none",
            zIndex: 0
          }}
        />

        {/* Content layer */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
