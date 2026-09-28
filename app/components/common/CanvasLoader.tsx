'use client';

import { useGSAP } from "@gsap/react";
import { AdaptiveDpr, Preload, ScrollControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import gsap from "gsap";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";

import { usePortalStore, useScrollStore, useThemeStore } from "@stores";
import { WORK_TIMELINE } from "@constants";

import Preloader from "./Preloader";
import ProgressLoader from "./ProgressLoader";
import { ScrollHint } from "./ScrollHint";
import ThemeSwitcher from "./ThemeSwitcher";
// import {Perf} from "r3f-perf"

const CanvasLoader = (props: { children: React.ReactNode }) => {
  const workIsActive = usePortalStore((state) => state.activePortalId === 'work');
  const certificatePointVisible = useScrollStore((state) => state.scrollProgress >= 0.69 && state.scrollProgress <= 0.87);
  const certificateLinks = WORK_TIMELINE.find((point) => point.links)?.links;
  const [selectedCertificate, setSelectedCertificate] = useState<{ label: string, url: string, previewUrl: string } | null>(null);
  const [certificateZoomed, setCertificateZoomed] = useState(false);
  const ref= useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundColor = useThemeStore((state) => state.theme.color);
  const { progress } = useProgress();
  const [canvasStyle, setCanvasStyle] = useState<React.CSSProperties>({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    overflow: "hidden",
  });

  useEffect(() => {
    if (!isMobile) {
      const borderStyle = {
        inset: '1rem',
        width: 'calc(100% - 2rem)',
        height: 'calc(100% - 2rem)',
      };
      setCanvasStyle({ ...canvasStyle, ...borderStyle})
    }
  }, [isMobile]);

  useEffect(() => {
    if (!selectedCertificate) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setSelectedCertificate(null);
      }
    };
    document.addEventListener('keydown', closeOnEscape, true);
    return () => document.removeEventListener('keydown', closeOnEscape, true);
  }, [selectedCertificate]);

  useEffect(() => {
    if (!workIsActive) setSelectedCertificate(null);
  }, [workIsActive]);

  useGSAP(() => {
    if (progress === 100) {
      gsap.to('.base-canvas', { opacity: 1, duration: 3, delay: 1 });
    }
  }, [progress]);

  useGSAP(() => {
    gsap.to(ref.current, {
      backgroundColor: backgroundColor,
      duration: 1,
    });
    gsap.to(canvasRef.current, {
      backgroundColor: backgroundColor,
      duration: 1,
      ...noiseOverlayStyle,
    });
  }, [backgroundColor]);

  const noiseOverlayStyle = {
    backgroundBlendMode: "soft-light",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
    backgroundSize: "100px",
  };

  return (
    <div className="h-[100dvh] wrapper relative">
      <div className="h-[100dvh] relative" ref={ref}>
        <Canvas className="base-canvas"
          shadows
          style={canvasStyle}
          ref={canvasRef}
          dpr={[1, 2]}>
          {/* <Perf/> */}
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />

            <ScrollControls pages={4} damping={0.4} maxSpeed={1} distance={1} style={{ zIndex: 1 }}>
              {props.children}
              <Preloader />
            </ScrollControls>

            <Preload all />
          </Suspense>
          <AdaptiveDpr pixelated/>
        </Canvas>
        <ProgressLoader progress={progress} />
        {workIsActive && certificatePointVisible && certificateLinks && (
          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '12px',
              maxWidth: 'calc(100% - 48px)',
            }}>
            {certificateLinks.map(({ label, url, previewUrl }) => (
              <button
                key={url}
                type="button"
                onClick={() => {
                  setCertificateZoomed(false);
                  setSelectedCertificate({ label, url, previewUrl });
                }}
                style={{
                  padding: '10px 14px',
                  border: '1px solid rgba(255,255,255,0.7)',
                  background: 'rgba(20,18,22,0.9)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '14px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  maxWidth: 'calc(100vw - 48px)',
                }}>
                {label}
              </button>
            ))}
          </div>
        )}
        {selectedCertificate && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedCertificate.label}
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedCertificate(null);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              background: 'rgba(0,0,0,0.85)',
            }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: 'min(1100px, 100%)',
              height: 'calc(100dvh - 32px)',
              background: '#fff',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                background: '#171717',
                color: '#fff',
                fontFamily: 'Arial, sans-serif',
              }}>
                <span style={{ flex: 1, fontSize: '15px', overflowWrap: 'anywhere' }}>{selectedCertificate.label}</span>
                <a href={selectedCertificate.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>Открыть PDF ↗</a>
                <button
                  type="button"
                  aria-label={certificateZoomed ? 'Уместить сертификат' : 'Увеличить сертификат'}
                  onClick={() => setCertificateZoomed(!certificateZoomed)}
                  style={{ border: 0, background: 'none', color: '#fff', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>
                  {certificateZoomed ? '−' : '+'}
                </button>
                <button
                  type="button"
                  aria-label="Закрыть сертификат"
                  onClick={() => setSelectedCertificate(null)}
                  style={{ border: 0, background: 'none', color: '#fff', cursor: 'pointer', fontSize: '26px', lineHeight: 1 }}>
                  ×
                </button>
              </div>
              <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'auto', overscrollBehavior: 'contain', background: '#f5f5f5' }}>
                {certificateZoomed ? (
                  <Image
                    src={selectedCertificate.previewUrl}
                    alt={selectedCertificate.label}
                    width={1980}
                    height={1530}
                    unoptimized
                    style={{ display: 'block', width: 'max(100%, 1400px)', maxWidth: 'none', height: 'auto' }}
                  />
                ) : (
                  <Image
                    src={selectedCertificate.previewUrl}
                    alt={selectedCertificate.label}
                    fill
                    sizes="(max-width: 1100px) 100vw, 1100px"
                    unoptimized
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ThemeSwitcher />
      <ScrollHint />
    </div>
  );
};

export default CanvasLoader;
