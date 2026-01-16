"use client";

import { useEffect, useState } from "react";

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleDuration: number;
    twinkleDelay: number;
}

export function Starfield() {
    const [stars, setStars] = useState<Star[]>([]);

    // Generate static stars only on client side to avoid hydration mismatch
    useEffect(() => {
        setStars(
            Array.from({ length: 150 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleDuration: Math.random() * 3 + 2,
                twinkleDelay: Math.random() * 5,
            }))
        );
    }, []);

    return (
        <div
            className="fixed inset-0 overflow-hidden pointer-events-none"
            style={{ zIndex: 0 }}
            aria-hidden="true"
            suppressHydrationWarning
        >
            {/* Static twinkling stars */}
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full bg-white star-twinkle"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDuration: `${star.twinkleDuration}s`,
                        animationDelay: `${star.twinkleDelay}s`,
                    }}
                />
            ))}
        </div>
    );
}
