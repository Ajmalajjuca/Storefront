"use client";

import { useGSAP } from "@gsap/react";
import { ProductDetailPanel } from "components/product-detail-panel";
import { RotatingFigure } from "components/rotating-figure";
import { TextShuffle } from "components/text-shuffle";
import gsap from "gsap";
import type { Product } from "lib/shopify/types";
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

gsap.registerPlugin(useGSAP);

type Props = {
  products: Product[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onModelClick?: () => void;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export const ScrollStage = React.memo(function ScrollStage({
  products,
  selectedIndex,
  onSelect,
  onModelClick,
}: Props) {
  const total = products.length;

  if (total === 0) return null;

  const isDetail = selectedIndex !== null;

  const stageRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const navCooldown = useRef(false);

  // Refs for GSAP-animated elements
  const titleOverlayRef = useRef<HTMLDivElement>(null);
  const detailViewRef = useRef<HTMLDivElement>(null);
  const detailSlidesRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstDetailRenderRef = useRef(true);

  const [transformOrigin, setTransformOrigin] = useState("50% 80%");
  const [detailMounted, setDetailMounted] = useState(isDetail);
  const [titleMounted, setTitleMounted] = useState(!isDetail);

  const selectedProduct =
    selectedIndex !== null ? products[selectedIndex]! : null;
  const prevProduct =
    selectedIndex !== null && selectedIndex > 0
      ? products[selectedIndex - 1]!
      : null;
  const nextProduct =
    selectedIndex !== null && selectedIndex < total - 1
      ? products[selectedIndex + 1]!
      : null;

  const [mobileGridIndex, setMobileGridIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex !== null) {
      setMobileGridIndex(selectedIndex);
    }
  }, [selectedIndex]);

  // — Mobile Grid Layout (Linear / V-shape)
  useGSAP(
    () => {
      const updateLayout = () => {
        const isMobile = window.innerWidth <= 768;

        if (!isMobile) {
          // Desktop: clear all mobile-specific GSAP transforms so flex layout takes over
          slotRefs.current.forEach((slot) => {
            if (!slot) return;
            if (!isDetail) {
              gsap.set(slot, {
                clearProps: "x,y,xPercent,yPercent,scale,zIndex,autoAlpha",
              });
            } else {
              // In detail mode keep x/y/scale for flying-thumbnail; clear mobile centering only
              gsap.set(slot, { xPercent: 0, yPercent: 0 });
            }
          });
          return;
        }

        // Mobile: CSS sets position:absolute; left:50%; top:45%.
        // GSAP offsets each slot from that anchor using x/y transforms only — no layout props.
        const slots = slotRefs.current.filter(Boolean) as HTMLDivElement[];
        slots.forEach((slot, i) => {
          const offset = i - mobileGridIndex;
          const xOffset = offset * (window.innerWidth * 0.35);
          const yOffset = -Math.abs(offset) * 15;
          const scale = Math.max(1 - Math.abs(offset) * 0.15, 0.4);
          const opacity = Math.max(1 - Math.abs(offset) * 0.3, 0);

          if (!isDetail) {
            gsap.to(slot, {
              xPercent: -50,
              yPercent: -50,
              x: xOffset,
              y: yOffset,
              scale,
              autoAlpha: opacity,
              zIndex: 10 - Math.abs(offset),
              duration: 0.5,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            // In detail mode: only update stacking/centering without animation
            gsap.set(slot, {
              xPercent: -50,
              yPercent: -50,
              x: xOffset,
              y: yOffset,
              zIndex: 10 - Math.abs(offset),
            });
          }
        });
      };

      updateLayout();
      window.addEventListener("resize", updateLayout);
      return () => window.removeEventListener("resize", updateLayout);
    },
    { scope: stageRef, dependencies: [total, isDetail, mobileGridIndex] },
  );

  // — Escape to deselect
  useEffect(() => {
    if (!isDetail) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isDetail, onSelect]);

  // — Wheel to navigate in detail mode
  useEffect(() => {
    if (!isDetail || selectedIndex === null) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (navCooldown.current) return;
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 30) return;
      const dir = delta > 0 ? 1 : -1;
      const nextIndex = selectedIndex + dir;
      if (nextIndex >= 0 && nextIndex < total) {
        navCooldown.current = true;
        setTransformOrigin(dir > 0 ? "88% 50%" : "12% 50%");
        onSelect(nextIndex);
        setTimeout(() => {
          navCooldown.current = false;
        }, 600);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isDetail, selectedIndex, total, onSelect]);

  // — Touch swipe for mobile
  useEffect(() => {
    if (total <= 1) return;
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0]!.clientX;
      touchStartY = e.touches[0]!.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (navCooldown.current) return;
      const deltaX = touchStartX - e.changedTouches[0]!.clientX;
      const deltaY = touchStartY - e.changedTouches[0]!.clientY;

      if (Math.abs(deltaX) < 60 && Math.abs(deltaY) < 60) return;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const dir = deltaX > 0 ? 1 : -1;
        if (isDetail && selectedIndex !== null) {
          const nextIndex = selectedIndex + dir;
          if (nextIndex >= 0 && nextIndex < total) {
            navCooldown.current = true;
            setTransformOrigin(dir > 0 ? "88% 50%" : "12% 50%");
            onSelect(nextIndex);
            setTimeout(() => {
              navCooldown.current = false;
            }, 600);
          }
        } else if (!isDetail && window.innerWidth <= 768) {
          const nextIndex = mobileGridIndex + dir;
          if (nextIndex >= 0 && nextIndex < total) {
            navCooldown.current = true;
            setMobileGridIndex(nextIndex);
            setTimeout(() => {
              navCooldown.current = false;
            }, 400);
          }
        }
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDetail, selectedIndex, total, onSelect, mobileGridIndex]);

  // — Figures row opacity and Flying Thumbnail
  const prevDetailRef = useRef(isDetail);
  const prevSelectedIndexRef = useRef(selectedIndex);
  useGSAP(
    () => {
      if (!rowRef.current) return;

      const justEntered = isDetail && !prevDetailRef.current;
      const justExited = !isDetail && prevDetailRef.current;
      const lastIndex = justExited
        ? prevSelectedIndexRef.current
        : selectedIndex;

      prevDetailRef.current = isDetail;
      if (selectedIndex !== null) {
        prevSelectedIndexRef.current = selectedIndex;
      }

      if (justEntered) {
        slotRefs.current.forEach((slot, i) => {
          if (!slot) return;
          if (i === lastIndex) {
            const isMobile = window.innerWidth <= 768;
            const drWidth = isMobile
              ? window.innerWidth * 0.9
              : window.innerWidth * 0.4;
            const drHeight = window.innerHeight * 0.7;
            const drCX = window.innerWidth * 0.5;
            const drCY = isMobile
              ? window.innerHeight * 0.4
              : window.innerHeight * 0.45;

            const rect = slot.getBoundingClientRect();
            const srCX = rect.left + rect.width / 2;
            const srCY = rect.top + rect.height / 2;

            // Use current GSAP x/y as base so the delta is correct regardless of
            // whether the slot was already offset by mobile-grid transforms.
            const currentX = (gsap.getProperty(slot, "x") as number) || 0;
            const currentY = (gsap.getProperty(slot, "y") as number) || 0;
            const targetX = currentX + (drCX - srCX);
            const targetY = currentY + (drCY - srCY);
            const targetScale = Math.min(
              drWidth / slot.offsetWidth,
              drHeight / slot.offsetHeight,
            );

            gsap.to(slot, {
              x: targetX,
              y: targetY,
              scale: targetScale,
              duration: 0.8,
              ease: "expo.out",
              zIndex: 50,
              overwrite: "auto",
            });
            gsap.to(slot, {
              autoAlpha: 0,
              duration: 0.2,
              delay: 0.6,
              ease: "none",
            });
          } else {
            gsap.to(slot, {
              autoAlpha: 0,
              scale: 0.95,
              duration: 0.2,
              ease: "power2.inOut",
              overwrite: "auto",
            });
          }
        });
        rowRef.current.style.pointerEvents = "none";
      } else if (justExited) {
        slotRefs.current.forEach((slot, i) => {
          if (!slot) return;
          const isMobile = window.innerWidth <= 768;
          const offset = i - mobileGridIndex;

          if (i === lastIndex) {
            // Animate selected slot back from flying-thumbnail position to its grid slot
            const gridX = isMobile ? offset * (window.innerWidth * 0.35) : 0;
            const gridY = isMobile ? -Math.abs(offset) * 15 : 0;
            gsap.set(slot, { autoAlpha: 1 });
            gsap.to(slot, {
              x: gridX,
              y: gridY,
              xPercent: isMobile ? -50 : 0,
              yPercent: isMobile ? -50 : 0,
              scale: 1,
              duration: 0.6,
              ease: "power3.inOut",
              zIndex: 1,
              overwrite: "auto",
              onComplete: () => {
                if (!isMobile)
                  gsap.set(slot, {
                    clearProps: "x,y,xPercent,yPercent,scale,zIndex",
                  });
              },
            });
          } else {
            const targetScale = isMobile
              ? Math.max(1 - Math.abs(offset) * 0.15, 0.4)
              : 1;
            const targetOpacity = isMobile
              ? Math.max(1 - Math.abs(offset) * 0.3, 0)
              : 1;
            const gridX = isMobile ? offset * (window.innerWidth * 0.35) : 0;
            const gridY = isMobile ? -Math.abs(offset) * 15 : 0;
            gsap.to(slot, {
              x: gridX,
              y: gridY,
              xPercent: isMobile ? -50 : 0,
              yPercent: isMobile ? -50 : 0,
              autoAlpha: targetOpacity,
              scale: targetScale,
              duration: 0.6,
              ease: "power3.inOut",
              overwrite: "auto",
              onComplete: () => {
                if (!isMobile)
                  gsap.set(slot, {
                    clearProps: "x,y,xPercent,yPercent,scale,zIndex",
                  });
              },
            });
          }
        });
        rowRef.current.style.pointerEvents = "auto";
      } else if (isDetail && firstDetailRenderRef.current) {
        // Direct deep-link visit: hide all slots immediately
        slotRefs.current.forEach((slot) => {
          if (slot) gsap.set(slot, { autoAlpha: 0, scale: 0.95 });
        });
        rowRef.current.style.pointerEvents = "none";
      }
    },
    { scope: stageRef, dependencies: [isDetail, mobileGridIndex] },
  );

  // — Title overlay fade
  useGSAP(
    () => {
      if (!titleOverlayRef.current) return;
      if (!isDetail) {
        setTitleMounted(true);
        gsap.fromTo(
          titleOverlayRef.current,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        );
      } else {
        gsap.to(titleOverlayRef.current, {
          autoAlpha: 0,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setTitleMounted(false),
        });
      }
    },
    { scope: stageRef, dependencies: [isDetail] },
  );

  // — Detail view animation (extremely smooth)
  useGSAP(
    () => {
      if (isDetail && !detailMounted) {
        setDetailMounted(true);
        return;
      }

      if (!detailViewRef.current) return;

      if (!isDetail) {
        gsap.to(detailViewRef.current, {
          autoAlpha: 0,
          duration: 0.15,
          ease: "power2.out",
          onComplete: () => {
            setDetailMounted(false);
            firstDetailRenderRef.current = true;
          },
        });
        return;
      }

      const mm = gsap.matchMedia(stageRef);

      mm.add(
        {
          isDesktop: "(min-width: 769px)",
          isMobile: "(max-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions as {
            isMobile: boolean;
            isDesktop: boolean;
          };

          products.forEach((_, i) => {
            const slide = detailSlidesRefs.current[i];
            if (!slide) return;

            const isActive = i === selectedIndex;
            const isPrev = i === selectedIndex! - 1;
            const isNext = i === selectedIndex! + 1;
            const isFarPrev = i === selectedIndex! - 2;
            const isFarNext = i === selectedIndex! + 2;
            const isOutPrev = i < selectedIndex! - 2;

            let targetX = "0vw";
            let targetOpacity = 0;
            let targetScale = 0.8;

            if (isActive) {
              targetX = "0vw";
              targetOpacity = 1;
              targetScale = 1;
            } else if (isPrev) {
              targetX = isMobile ? "-45vw" : "-28vw";
              targetOpacity = isMobile ? 0.1 : 0.25;
              targetScale = 0.8;
            } else if (isNext) {
              targetX = isMobile ? "45vw" : "28vw";
              targetOpacity = isMobile ? 0.1 : 0.25;
              targetScale = 0.8;
            } else if (isFarPrev) {
              targetX = isMobile ? "-80vw" : "-48vw";
              targetOpacity = isMobile ? 0 : 0.08;
              targetScale = 0.6;
            } else if (isFarNext) {
              targetX = isMobile ? "80vw" : "48vw";
              targetOpacity = isMobile ? 0 : 0.08;
              targetScale = 0.6;
            } else if (isOutPrev) {
              targetX = isMobile ? "-100vw" : "-80vw";
              targetOpacity = 0;
              targetScale = 0.5;
            } else {
              targetX = isMobile ? "100vw" : "80vw";
              targetOpacity = 0;
              targetScale = 0.5;
            }

            if (firstDetailRenderRef.current) {
              if (isActive) {
                // Flying thumbnail covers the slot; wait for it to fade, then crossfade in
                gsap.set(slide, {
                  scale: targetScale,
                  x: targetX,
                  y: 0,
                  autoAlpha: 0,
                });
                gsap.to(slide, {
                  autoAlpha: targetOpacity,
                  duration: 0.2,
                  delay: 0.6,
                  ease: "none",
                });
              } else if (isPrev || isNext || isFarPrev || isFarNext) {
                gsap.set(slide, {
                  autoAlpha: 0,
                  x: targetX,
                  scale: targetScale,
                });
                gsap.to(slide, {
                  autoAlpha: targetOpacity,
                  duration: 0.8,
                  ease: "power2.out",
                  delay: 0.4,
                });
              } else {
                gsap.set(slide, {
                  autoAlpha: 0,
                  x: targetX,
                  scale: targetScale,
                });
              }
            } else {
              gsap.to(slide, {
                x: targetX,
                autoAlpha: targetOpacity,
                scale: targetScale,
                duration: 0.8,
                ease: "power3.inOut",
                overwrite: "auto",
              });
            }
          });

          firstDetailRenderRef.current = false;
        },
      );

      return () => mm.revert();
    },
    {
      scope: stageRef,
      dependencies: [isDetail, selectedIndex, transformOrigin, detailMounted],
    },
  );

  function handleRowSelect(i: number) {
    if (i === selectedIndex) return;
    onSelect(i);
  }
console.log("scroll-stage rendering......");
  return (
    <div
      ref={stageRef}
      className={styles.stage}
      onClick={() => isDetail && onSelect(null)}
    >
      {/* Title overlay */}
      {titleMounted && (
        <div ref={titleOverlayRef} className={styles.titleOverlay}>
          <span className={styles.breadcrumb}>
            COLLECTION {pad(1)} / {pad(1)}
          </span>
          <h1 className={styles.collectionTitle}>
            <TextShuffle text="COLLECTION" triggerOnHover />
          </h1>
          <div className={styles.productsMeta}>
            <span className={styles.productsLabel}>PRODUCTS</span>
            <span className={styles.productsCount}>{total}</span>
          </div>
        </div>
      )}

      {/* Left info panel */}
      {isDetail && selectedProduct && (
        <ProductDetailPanel
          key={selectedIndex}
          product={selectedProduct}
          lookIndex={selectedIndex!}
          totalLooks={total}
        />
      )}

      {/* Full-screen detail view */}
      {detailMounted && selectedProduct && (
        <div ref={detailViewRef} className={styles.detailView}>
          {/* Top Right Quick Jump bar */}
          <div className={styles.quickJump}>
            <span className={styles.quickJumpCounter}>
              LOOK {pad(selectedIndex! + 1)} / {pad(total)}
            </span>
            <div className={styles.quickJumpThumbs}>
              {prevProduct && (
                <div className={styles.jumpThumb}>
                  <RotatingFigure
                    product={prevProduct}
                    onClick={() => {
                      setTransformOrigin("12% 50%");
                      onSelect(selectedIndex! - 1);
                    }}
                  />
                </div>
              )}
              <div className={`${styles.jumpThumb} ${styles.jumpThumbActive}`}>
                <RotatingFigure
                  product={selectedProduct}
                  listenToGlobalFrame={true}
                />
              </div>
              {nextProduct && (
                <div className={styles.jumpThumb}>
                  <RotatingFigure
                    product={nextProduct}
                    onClick={() => {
                      setTransformOrigin("88% 50%");
                      onSelect(selectedIndex! + 1);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Main Stage Track */}
          {products.map((p, i) => {
            const isActive = i === selectedIndex;
            const isPrev = i === selectedIndex! - 1;
            const isNext = i === selectedIndex! + 1;
            const isFarPrev = i === selectedIndex! - 2;
            const isFarNext = i === selectedIndex! + 2;
            const isVisible =
              isActive || isPrev || isNext || isFarPrev || isFarNext;

            return (
              <div
                key={p.id}
                ref={(el) => {
                  detailSlidesRefs.current[i] = el;
                }}
                className={`${styles.detailSlide} ${isActive ? styles.detailSlideActive : isVisible ? styles.detailSlideAdjacent : ""}`}
              >
                {isVisible && (
                  <RotatingFigure
                    product={p}
                    listenToGlobalFrame={isActive}
                    priority={isActive}
                    onClick={() => {
                      if (isFarPrev) {
                        onSelect(selectedIndex! - 2);
                      } else if (isPrev) {
                        onSelect(selectedIndex! - 1);
                      } else if (isNext) {
                        onSelect(selectedIndex! + 1);
                      } else if (isFarNext) {
                        onSelect(selectedIndex! + 2);
                      } else if (isActive) {
                        onModelClick?.();
                      }
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Figures row */}
      <div ref={rowRef} className={styles.figuresRow}>
        {products.map((product, i) => (
          <div
            key={product.id}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
            className={styles.figureSlot}
          >
            <RotatingFigure
              product={product}
              priority={i < 4}
              onClick={() => handleRowSelect(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
