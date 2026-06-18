"use client";

import React, { useEffect, useRef, useState } from "react";

type HeroImageSequenceProps = {
  frameCount?: number;
  framePath?: string;
  frameExtension?: "webp" | "jpg" | "png";
  fallbackImage?: string;
  mobileFrameCount?: number;
  mobileFramePath?: string;
  mobileFrameExtension?: "webp" | "jpg" | "png";
  mobileFallbackImage?: string;
  disableOnMobile?: boolean;
  mobileBreakpoint?: number;
  children?: React.ReactNode;
};

export default function HeroImageSequence({
  frameCount = 240,
  framePath = "/hero-sequence/ezgif-frame-",
  frameExtension = "webp",
  fallbackImage = "/hero-sequence/ezgif-frame-001.webp",
  mobileFrameCount,
  mobileFramePath,
  mobileFrameExtension,
  mobileFallbackImage,
  disableOnMobile = false,
  mobileBreakpoint = 768,
  children,
}: HeroImageSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isSafeFallback, setIsSafeFallback] = useState(false);

  const activeFrameCount = isMobileViewport
    ? (mobileFrameCount ?? frameCount)
    : frameCount;
  const activeFramePath = isMobileViewport
    ? (mobileFramePath ?? framePath)
    : framePath;
  const activeFrameExtension = isMobileViewport
    ? (mobileFrameExtension ?? frameExtension)
    : frameExtension;
  const activeFallbackImage = isMobileViewport
    ? (mobileFallbackImage ?? fallbackImage)
    : fallbackImage;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const checkFallback = () => {
      const isMobile = window.innerWidth < mobileBreakpoint;

      setIsMobileViewport(isMobile);
      setIsSafeFallback(mediaQuery.matches || (disableOnMobile && isMobile));
    };

    checkFallback();
    window.addEventListener("resize", checkFallback);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", checkFallback);
    }

    return () => {
      window.removeEventListener("resize", checkFallback);

      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", checkFallback);
      }
    };
  }, [disableOnMobile, mobileBreakpoint]);

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

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      if (
        canvas.width !== rect.width * dpr ||
        canvas.height !== rect.height * dpr
      ) {
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

    const onScroll = () => {
      if (!containerRef.current) return;

      const scrollY = window.scrollY;
      const offsetTop = containerRef.current.offsetTop;
      const height = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const maxScroll = height - windowHeight;
      if (maxScroll <= 0) {
        renderFrame(1);
        return;
      }

      let scrollProgress = (scrollY - offsetTop) / maxScroll;
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      const frameIndex = Math.min(
        activeFrameCount,
        Math.max(1, Math.floor(scrollProgress * activeFrameCount) + 1),
      );

      if (frameIndex !== currentFrame) {
        currentFrame = frameIndex;
        requestAnimationFrame(() => renderFrame(frameIndex));
      }
    };

    const onResize = () =>
      requestAnimationFrame(() => renderFrame(currentFrame));

    const loadImages = async () => {
      imagesRef.current = new Array(activeFrameCount + 1);

      const firstImg = new Image();
      firstImg.src = `${activeFramePath}${String(1).padStart(3, "0")}.${activeFrameExtension}`;

      await new Promise((resolve, reject) => {
        firstImg.onload = () => {
          imagesRef.current[1] = firstImg;
          resolve(true);
        };
        firstImg.onerror = reject;
      }).catch(() => {
        if (isMounted) setIsSafeFallback(true);
      });

      if (!isMounted || !imagesRef.current[1]) return;
      onScroll();

      for (let i = 2; i <= activeFrameCount; i++) {
        if (!isMounted) break;
        const img = new Image();
        img.src = `${activeFramePath}${String(i).padStart(3, "0")}.${activeFrameExtension}`;
        img.onload = () => {
          imagesRef.current[i] = img;
          if (currentFrame === i) {
            requestAnimationFrame(() => renderFrame(i));
          }
        };
      }
    };

    loadImages();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      isMounted = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [activeFrameCount, activeFramePath, activeFrameExtension, isSafeFallback]);

  return (
    <div
      ref={containerRef}
      style={{ height: "250svh", position: "relative", width: "100%" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#030303",
        }}
      >
        {isSafeFallback ? (
          <img
            src={activeFallbackImage}
            alt="Hero background fallback"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
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
              zIndex: 0,
            }}
          />
        )}

        {/* Dark gradient overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
  radial-gradient(circle at 100% 100%, rgba(0,0,0,1) 4%, rgba(0,0,0,0) 500px),
  radial-gradient(circle at 0% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 500px),
  radial-gradient(circle at center, transparent 0%, rgba(3,3,3,0.4) 100%),
  linear-gradient(to bottom, rgba(3,3,3,0.2) 0%, rgba(3,3,3,0.7) 100%)
`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Content layer */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
