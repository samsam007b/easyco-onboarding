'use client';

import { useEffect, useState } from 'react';

export default function LoadingLogo() {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Animation dure environ 2 secondes avant de se répéter
    const timer = setTimeout(() => setIsAnimating(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Lettres du logo avec leurs couleurs respectives
  const letters = [
    { char: 'E', color: '#7B5FB8', delay: 0 },      // Owner - Mauve
    { char: 'a', color: '#A67BB8', delay: 0.1 },    // Owner gradient
    { char: 's', color: '#C98B9E', delay: 0.2 },    // Owner gradient rose
    { char: 'y', color: '#E8865D', delay: 0.3 },    // Resident - Orange/Coral
    { char: 'C', color: '#FF8C4B', delay: 0.4 },    // Resident gradient
    { char: 'o', color: '#FFD080', delay: 0.5 },    // Searcher - Jaune doré
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Effet de fond animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-100/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-100/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Logo avec lettres qui sautent */}
      <div className="relative flex items-center gap-1 md:gap-2">
        {letters.map((letter, index) => (
          <div
            key={index}
            className="letter-bounce"
            style={{
              animationDelay: `${letter.delay}s`,
              color: letter.color,
              fontSize: '4rem',
              fontWeight: '800',
              textShadow: '0 4px 12px rgba(0,0,0,0.1)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
          >
            {letter.char}
          </div>
        ))}
      </div>

      {/* Icône de maison en bas qui saute */}
      <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 house-bounce">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Toit de la maison */}
          <path
            d="M50 10 L90 45 L80 45 L80 90 L20 90 L20 45 L10 45 Z"
            className="roof-color"
          />

          {/* Corps de la maison */}
          <rect
            x="25"
            y="50"
            width="50"
            height="40"
            className="house-body-color"
          />

          {/* Porte */}
          <rect
            x="42"
            y="65"
            width="16"
            height="25"
            className="door-color"
          />

          {/* Fenêtre gauche */}
          <rect
            x="30"
            y="55"
            width="10"
            height="10"
            className="window-color"
          />

          {/* Fenêtre droite */}
          <rect
            x="60"
            y="55"
            width="10"
            height="10"
            className="window-color"
          />

          {/* Cheminée */}
          <rect
            x="65"
            y="25"
            width="8"
            height="20"
            className="chimney-color"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes letterBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-30px) scale(1.1);
          }
          50% {
            transform: translateY(-15px) scale(1.05);
          }
          75% {
            transform: translateY(-5px) scale(1.02);
          }
        }

        @keyframes houseBounce {
          0%, 100% {
            transform: translate(-50%, 0) scale(1);
          }
          30% {
            transform: translate(-50%, -40px) scale(1.15);
          }
          60% {
            transform: translate(-50%, -20px) scale(1.08);
          }
          80% {
            transform: translate(-50%, -5px) scale(1.02);
          }
        }

        @keyframes colorShift {
          0%, 100% {
            fill: #7B5FB8;
          }
          33% {
            fill: #E8865D;
          }
          66% {
            fill: #FFD080;
          }
        }

        @keyframes colorShift2 {
          0%, 100% {
            fill: #A67BB8;
          }
          33% {
            fill: #FF8C4B;
          }
          66% {
            fill: #FFB85C;
          }
        }

        @keyframes colorShift3 {
          0%, 100% {
            fill: #C98B9E;
          }
          33% {
            fill: #FFA040;
          }
          66% {
            fill: #FFD249;
          }
        }

        .letter-bounce {
          animation: letterBounce 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          display: inline-block;
        }

        .house-bounce {
          animation: houseBounce 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 0.8s;
        }

        .roof-color {
          animation: colorShift 3s ease-in-out infinite;
        }

        .house-body-color {
          animation: colorShift2 3s ease-in-out infinite;
          animation-delay: 0.3s;
        }

        .door-color {
          animation: colorShift3 3s ease-in-out infinite;
          animation-delay: 0.6s;
        }

        .window-color {
          animation: colorShift 3s ease-in-out infinite;
          animation-delay: 0.9s;
        }

        .chimney-color {
          animation: colorShift2 3s ease-in-out infinite;
          animation-delay: 1.2s;
        }

        @media (max-width: 768px) {
          .letter-bounce {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}
