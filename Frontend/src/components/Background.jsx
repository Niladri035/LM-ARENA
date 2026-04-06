import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const OmmSymbol = ({ intensity }) => {
  // Dynamically change subtle color properties based on battle intensity
  const glowColor = intensity > 0.5 ? "#eff6e0" : "#aec3b0";
  
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.5}>
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.8}
        color={glowColor}
        fillOpacity={0.1}
        outlineWidth={0.01}
        outlineColor={glowColor}
        outlineOpacity={0.4}
        letterSpacing={0.1}
      >
        ॐ
      </Text>
    </Float>
  );
};

const LiquidGradientMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#01161e'), // Deep space blue/black
    uColor2: new THREE.Color('#124559'), // Navy
    uColor3: new THREE.Color('#598392'), // Teal
    uColor4: new THREE.Color('#aec3b0'), // Light sage/mint
    uColor5: new THREE.Color('#eff6e0'), // Off-white
    uResolution: new THREE.Vector2(),
    uIntensity: 0.0 // 0 = Calm, 1 = Battle Intensive
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uColor5;
    uniform float uIntensity;
    uniform vec2 uResolution;
    
    varying vec2 vUv;

    // 2D Rotation Matrix
    mat2 rot(float a) {
        float s = sin(a), c = cos(a);
        return mat2(c, -s, s, c);
    }

    // Pseudo-random hash
    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Value noise
    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }

    // Fractional Brownian Motion (fbm)
    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        for (int i = 0; i < 6; ++i) {
            v += a * noise(p);
            p = p * 2.0 * rot(0.5) + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
      // Create animated fluid patterns via Domain Warping
      vec2 uv = vUv * 2.5; // Scale
      float t = uTime * 0.15; // Speed
      
      vec2 q = vec2(0.); // First warp
      q.x = fbm(uv + vec2(0.0, 0.0) + t);
      q.y = fbm(uv + vec2(5.2, 1.3) + t);

      vec2 r = vec2(0.); // Second warp
      r.x = fbm(uv + 2.0 * q + vec2(1.7, 9.2) + 0.5 * t);
      r.y = fbm(uv + 2.0 * q + vec2(8.3, 2.8) + 0.3 * t);

      float f = fbm(uv + r);

      // Color Palette A: Calm Deep Space
      vec3 colorA = mix(uColor1, uColor2, clamp((f * f) * 1.5, 0.0, 1.0));
      colorA = mix(colorA, uColor3, clamp(length(q) * 0.4, 0.0, 1.0));
      colorA = mix(colorA, vec3(0.0, 0.05, 0.1), clamp(length(r.x) * 0.3, 0.0, 1.0)); // Dark navy contrast

      // Color Palette B: Intense Action (Deep Space Awakened)
      vec3 colorB = mix(uColor2, uColor4, clamp((f * f) * 1.5, 0.0, 1.0));
      colorB = mix(colorB, uColor5, clamp(length(q) * 0.5, 0.0, 1.0)); // Bright starlight highlight
      colorB = mix(colorB, vec3(0.0, 0.02, 0.06), clamp(length(r.y) * 0.4, 0.0, 1.0)); // Deep void contrast
      
      // Interpolate based on Battle Intensity
      vec3 finalColor = mix(colorA, colorB, uIntensity);

      // Contrast / Depth enhancement
      finalColor = finalColor * (f * 1.8 + 0.1);
      finalColor = mix(finalColor, vec3(1.0), clamp(pow(f, 4.0) * 0.4, 0.0, 1.0)); // very subtle bright glints

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ LiquidGradientMaterial });

const LiquidBackground = ({ intensity = 0.0 }) => {
  const materialRef = useRef();
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
      // Smoothly transition intensity
      const currentIntensity = materialRef.current.uIntensity;
      materialRef.current.uIntensity = THREE.MathUtils.lerp(currentIntensity, intensity, 0.02);
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <liquidGradientMaterial ref={materialRef} />
    </mesh>
  );
};

export default function Background({ intensity }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={window.devicePixelRatio}
      >
        <LiquidBackground intensity={intensity} />
        <OmmSymbol intensity={intensity} />
      </Canvas>
    </div>
  );
}
