import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './FlickerLoader.css';

const FlickerLoader = ({ onComplete }) => {
  const containerRef = useRef();
  const dotsRef = useRef([]);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out entire loader
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: onComplete
        });
      }
    });

    // Initial scale/opacity staggers
    tl.fromTo(dotsRef.current, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, stagger: 0.1, ease: 'back.out(1.7)' }
    );

    // Flicker / Glitch effect
    dotsRef.current.forEach((dot, i) => {
      gsap.to(dot, {
        opacity: 0.3,
        duration: 0.05,
        repeat: 12,
        yoyo: true,
        delay: 1 + (i * 0.1),
        ease: 'none'
      });
      
      gsap.to(dot, {
        scale: 1.5,
        filter: 'blur(8px)',
        duration: 0.4,
        repeat: 3,
        yoyo: true,
        delay: 1.5 + (i * 0.15),
        ease: 'sine.inOut'
      });
    });

    // Final burst before completion
    tl.to(dotsRef.current, {
      scale: 3,
      opacity: 0,
      filter: 'blur(20px)',
      duration: 1,
      stagger: 0.05,
      ease: 'power4.in'
    }, "+=1.5");

    return () => tl.kill();
  }, [onComplete]);

  const colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

  return (
    <div className="flicker-loader-overlay" ref={containerRef}>
      <div className="loader-content">
        <div className="dots-container">
          {colors.map((color, i) => (
            <div 
              key={i}
              className="loader-dot" 
              ref={el => dotsRef.current[i] = el}
              style={{ 
                backgroundColor: color,
                boxShadow: `0 0 20px ${color}, 0 0 40px ${color}33` 
              }}
            />
          ))}
        </div>
        <div className="loader-text">
          <span className="char">L</span>
          <span className="char">O</span>
          <span className="char">A</span>
          <span className="char">D</span>
          <span className="char">I</span>
          <span className="char">N</span>
          <span className="char">G</span>
        </div>
      </div>
    </div>
  );
};

export default FlickerLoader;
