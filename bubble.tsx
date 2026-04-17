import React, { useEffect, useRef, useState } from 'react';

/**
 * GitHub Dark Theme Constants
 */
interface ThemeColors {
    mainBg: string;
    containerBg: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
}

const COLORS: ThemeColors = {
    mainBg: '#0d1117',
    containerBg: '#161b22',
    border: '#30363d',
    textPrimary: '#c9d1d9',
    textSecondary: '#8b949e'
};

interface Particle {
    id: number;
    src: string;
    url: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
}

const ICON_SIZE = 45;
const VELOCITY_LIMIT = 0.5;
const DAMPING = 0.98;
const RADIUS = 22.5;

const ICON_SOURCES: string[] = [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-line-wordmark.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/feathersjs/feathersjs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg"
];

const ICON_LINKS: string[] = [
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    "https://react.dev",
    "https://nextjs.org",
    "https://storybook.js.org",
    "https://nodejs.org",
    "https://jestjs.io",
    "https://aws.amazon.com",
    "https://angular.io",
    "https://en.cppreference.com/w/c",
    "https://www.canva.com",
    "https://isocpp.org",
    "https://developer.mozilla.org/en-US/docs/Web/CSS",
    "https://www.docker.com",
    "https://fastapi.tiangolo.com",
    "https://feathersjs.com",
    "https://flutter.dev",
    "https://expressjs.com",
    "https://developer.mozilla.org/en-US/docs/Web/HTML",
    "https://www.java.com",
    "https://www.mongodb.com",
    "https://www.mysql.com",
    "https://developer.apple.com/swift",
    "https://tailwindcss.com",
    "https://www.tensorflow.org",
    "https://www.terraform.io",
    "https://threejs.org"
];

const App: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(null);
    const particlesRef = useRef<Particle[]>([]);
    const imageRefs = useRef<Map<number, HTMLImageElement>>(new Map());
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [renderParticles, setRenderParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });

                if (particlesRef.current.length === 0) {
                    const cols = 7;
                    const gap = 35;

                    const newParticles = ICON_SOURCES.map((src, i) => ({
                        id: i,
                        src: src,
                        url: ICON_LINKS[i],
                        x: (i % cols) * (ICON_SIZE + gap) + gap,
                        y: Math.floor(i / cols) * (ICON_SIZE + gap) + gap,
                        vx: (Math.random() - 0.5) * VELOCITY_LIMIT * 2,
                        vy: (Math.random() - 0.5) * VELOCITY_LIMIT * 2,
                        radius: RADIUS
                    }));
                    
                    particlesRef.current = newParticles;
                    setRenderParticles(newParticles);
                }
            }
        };

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    const animate = () => {
        const particles = particlesRef.current;
        const { width, height } = dimensions;

        if (width === 0 || height === 0 || particles.length === 0) {
            requestRef.current = requestAnimationFrame(animate);
            return;
        }

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            // Wall Bouncing
            if (p.x <= 0) {
                p.x = 0;
                p.vx = Math.abs(p.vx);
            } else if (p.x + ICON_SIZE >= width) {
                p.x = width - ICON_SIZE;
                p.vx = -Math.abs(p.vx);
            }

            if (p.y <= 0) {
                p.y = 0;
                p.vy = Math.abs(p.vy);
            } else if (p.y + ICON_SIZE >= height) {
                p.y = height - ICON_SIZE;
                p.vy = -Math.abs(p.vy);
            }

            // Elastic Collision logic
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];

                const dx = (p2.x + RADIUS) - (p.x + RADIUS);
                const dy = (p2.y + RADIUS) - (p.y + RADIUS);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = RADIUS * 2;

                if (distance < minDistance) {
                    const overlap = minDistance - distance;
                    const nx = dx / distance;
                    const ny = dy / distance;

                    p.x -= (nx * overlap) / 2;
                    p.y -= (ny * overlap) / 2;
                    p2.x += (nx * overlap) / 2;
                    p2.y += (ny * overlap) / 2;

                    const v1n = p.vx * nx + p.vy * ny;
                    const v2n = p2.vx * nx + p2.vy * ny;

                    const v1n_after = v2n * DAMPING;
                    const v2n_after = v1n * DAMPING;

                    p.vx += (v1n_after - v1n) * nx;
                    p.vy += (v1n_after - v1n) * ny;
                    p2.vx += (v2n_after - v2n) * nx;
                    p2.vy += (v2n_after - v2n) * ny;
                }
            }

            const imgEl = imageRefs.current.get(p.id);
            if (imgEl) {
                imgEl.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            }
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [dimensions]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: COLORS.mainBg }}>
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: COLORS.textPrimary }}>
                    Interactive Tech Stack (TSX)
                </h1>
                <p className="text-xs uppercase tracking-widest opacity-50" style={{ color: COLORS.textSecondary }}>
                    Click an icon to visit official site
                </p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full max-w-4xl h-[600px] rounded-3xl overflow-hidden shadow-2xl"
                style={{
                    backgroundColor: COLORS.containerBg,
                    border: `1px solid ${COLORS.border}`
                }}
            >
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(${COLORS.textPrimary} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.textPrimary} 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                {renderParticles.map((p) => (
                    <img
                        key={p.id}
                        ref={(el) => {
                            if (el) imageRefs.current.set(p.id, el);
                            else imageRefs.current.delete(p.id);
                        }}
                        src={p.src}
                        alt={`Tech ${p.id}`}
                        onClick={() => window.open(p.url, "_blank")}
                        className="absolute select-none transition-opacity hover:opacity-80 active:scale-95"
                        draggable="false"
                        style={{
                            width: ICON_SIZE,
                            height: ICON_SIZE,
                            objectFit: 'contain',
                            willChange: 'transform',
                            cursor: 'pointer',
                            transform: `translate3d(${p.x}px, ${p.y}px, 0)`
                        }}
                    />
                ))}
            </div>

            <div className="mt-8 flex gap-8 text-[10px] font-mono tracking-tighter" style={{ color: COLORS.textSecondary }}>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>TypeScript Core</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>Strong Interfaces</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>High Performance Loop</span>
                </div>
            </div>
        </div>
    );
};

export default App;