"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type HeroProps = {
  title: string;
  subtitle?: string;
  illustrationSrc?: string;
  children?: React.ReactNode;
};

export function Hero({ title, subtitle, illustrationSrc = "/bg.jpg", children }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const busImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline oluştur
      const tl = gsap.timeline();

      // Title animasyonu
      if (titleRef.current) {
        tl.fromTo(titleRef.current, 
          { y: 50, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
        );
      }

      // Subtitle animasyonu
      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        );
      }

      // Children animasyonu
      if (childrenRef.current) {
        tl.fromTo(childrenRef.current, 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );
      }

      // Otobüs görseli animasyonu
      if (busImageRef.current) {
        tl.fromTo(busImageRef.current, 
          { x: 100, opacity: 0, scale: 0.8, rotation: 5 },
          { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "power3.out" },
          "-=0.6"
        );
        
        // Floating animasyon
        gsap.to(busImageRef.current, {
          y: -10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 1.5
        });
      }
    });

    return () => ctx.revert();
  }, []);
  return (
    <section 
              className="w-full min-h-[48rem] bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${illustrationSrc})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5"></div>
      
      {/* Content */}
      <div className="container px-4 pt-32 pb-10 md:pt-40 md:pb-16 relative z-10">
        <div className="grid md:grid-cols-2 items-center gap-8 mb-8 min-h-[13.75rem]">
          <div>
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 text-shine"
              style={{ fontSize: 'clamp(2.8rem, 1.5vw, 3rem)' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p 
                ref={subtitleRef}
                className="text-lg md:text-xl bg-gradient-to-r from-black/95 via-black-800 to-black-900 bg-clip-text drop-shadow-md leading-relaxed"
              >
                {subtitle}
              </p>
            )}
          </div>
          <div className="hidden md:flex items-start justify-center pt-8">
            <div className="relative">
              <img 
                ref={busImageRef} 
                src="/bus_PNG101194.png" 
                alt="Otobüs" 
                className="w-full max-w-sm h-auto object-contain drop-shadow-2xl"
              />
              {/* Soft Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/10 to-cyan-200/3 rounded-full blur-xl scale-110 -z-10"></div>
            </div>
          </div>
        </div>
        <div ref={childrenRef}>
          {children}
        </div>
      </div>
    </section>
  );
}