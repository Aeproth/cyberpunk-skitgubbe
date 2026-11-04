import React from 'react';
import { Card } from '../game/rules';
import { SUIT_INFO } from '../game/characters';

interface CyberAvatarProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg' | 'zoom';
  interactive?: boolean;
}

export const CyberAvatar: React.FC<CyberAvatarProps> = ({
  card,
  size = 'md',
}) => {
  const suit = SUIT_INFO[card.suit];
  const { hairColor, neonColor, visorType } = card.avatarStyle;

  // Custom high-res art for Queens (Drottningarna)
  if (card.customImage) {
    const imgSizeClasses = {
      sm: 'h-16 w-full object-cover object-top',
      md: 'h-28 w-full object-cover object-top',
      lg: 'h-48 w-full object-cover object-top',
      zoom: 'h-96 w-full object-cover object-center',
    }[size];

    return (
      <div className="relative w-full h-full overflow-hidden rounded bg-black/60 group">
        <img
          src={card.customImage}
          alt={card.codename}
          className={`${imgSizeClasses} transition-transform duration-300 group-hover:scale-105`}
          loading="eager"
        />
        {/* Holographic scanlines and neon vignette */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-25 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black_100%)]"
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${neonColor}33 2px, ${neonColor}33 4px)`,
          }}
        />
        {/* Neon suit tag in corner */}
        <div
          className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase font-bold backdrop-blur-sm border"
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: neonColor,
            borderColor: `${neonColor}88`,
            textShadow: `0 0 8px ${neonColor}`,
          }}
        >
          QUEEN · {card.suit.toUpperCase()}
        </div>
      </div>
    );
  }

  // Procedural SVG Cyberpunk Operative Avatar for all other cards
  // Tailored facial profiles, cybernetic eyes, visor gear, neon circuit markings
  return (
    <div
      className="relative w-full h-full overflow-hidden rounded flex items-center justify-center"
      style={{
        background: card.avatarStyle.bgGradient,
      }}
    >
      <svg
        viewBox="0 0 160 190"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-skin-${card.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3c2a6" />
            <stop offset="60%" stopColor="#d99b7b" />
            <stop offset="100%" stopColor="#9e664e" />
          </linearGradient>

          <linearGradient id={`grad-hair-${card.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={hairColor} />
            <stop offset="80%" stopColor="#1a0026" />
            <stop offset="100%" stopColor={neonColor} />
          </linearGradient>

          <filter id={`neon-glow-${card.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background tech grid */}
        <line x1="20" y1="0" x2="20" y2="190" stroke={neonColor} strokeOpacity="0.1" strokeDasharray="3 3" />
        <line x1="140" y1="0" x2="140" y2="190" stroke={neonColor} strokeOpacity="0.1" strokeDasharray="3 3" />
        <line x1="0" y1="95" x2="160" y2="95" stroke={neonColor} strokeOpacity="0.1" strokeDasharray="3 3" />

        {/* Tactical collar / high-neck cyber-armor silhouette */}
        <path
          d="M 40 180 Q 80 145 120 180 L 135 190 L 25 190 Z"
          fill="#11131a"
          stroke={neonColor}
          strokeWidth="1.5"
          strokeOpacity="0.8"
        />
        {/* Collar power conduit */}
        <path
          d="M 65 165 L 80 178 L 95 165"
          fill="none"
          stroke={neonColor}
          strokeWidth="2"
          filter={`url(#neon-glow-${card.id})`}
        />

        {/* Neck */}
        <path d="M 68 120 L 68 160 L 92 160 L 92 120 Z" fill={`url(#grad-skin-${card.id})`} />
        {/* Neck cybernetic circuit lines */}
        <path
          d="M 72 130 L 72 152 M 88 132 L 88 150"
          stroke={neonColor}
          strokeWidth="1.2"
          strokeDasharray="2 2"
          strokeOpacity="0.8"
        />

        {/* Hair - Back Layer */}
        <path
          d="M 42 75 Q 80 20 118 75 Q 130 140 115 160 Q 95 145 80 145 Q 65 145 45 160 Q 30 140 42 75 Z"
          fill={`url(#grad-hair-${card.id})`}
        />

        {/* Face Silhouette */}
        <path
          d="M 52 75 Q 50 115 80 135 Q 110 115 108 75 Q 106 50 80 48 Q 54 50 52 75 Z"
          fill={`url(#grad-skin-${card.id})`}
          stroke="#000"
          strokeWidth="0.5"
        />

        {/* Cheekbone & Temple Cybernetic Seams */}
        <path
          d="M 54 85 Q 65 100 70 120"
          fill="none"
          stroke={neonColor}
          strokeWidth="1.2"
          strokeOpacity="0.8"
          filter={`url(#neon-glow-${card.id})`}
        />
        <circle cx="54" cy="85" r="1.5" fill={neonColor} />
        <circle cx="70" cy="120" r="1.5" fill={neonColor} />

        {/* Eyes / Visor according to card spec */}
        {visorType === 'tactical-hud' && (
          <g filter={`url(#neon-glow-${card.id})`}>
            {/* Holographic Tactical HUD Bar */}
            <path
              d="M 48 78 L 112 78 L 106 92 L 54 92 Z"
              fill={neonColor}
              fillOpacity="0.35"
              stroke={neonColor}
              strokeWidth="1.5"
            />
            <circle cx="68" cy="85" r="3" fill="#ffffff" />
            <circle cx="92" cy="85" r="3" fill="#ffffff" />
            <line x1="50" y1="85" x2="62" y2="85" stroke="#ffffff" strokeWidth="1" />
            <line x1="98" y1="85" x2="110" y2="85" stroke="#ffffff" strokeWidth="1" />
          </g>
        )}

        {visorType === 'monocle' && (
          <g>
            {/* Natural Left Eye */}
            <ellipse cx="68" cy="85" rx="5" ry="3" fill="#ffffff" />
            <circle cx="68" cy="85" r="2" fill="#2d1537" />
            {/* Cybernetic Golden/Neon Monocle on Right Eye */}
            <circle
              cx="92"
              cy="85"
              r="7"
              fill="none"
              stroke={neonColor}
              strokeWidth="1.8"
              filter={`url(#neon-glow-${card.id})`}
            />
            <circle cx="92" cy="85" r="3" fill={neonColor} />
            <line x1="99" y1="85" x2="108" y2="88" stroke={neonColor} strokeWidth="1.2" />
          </g>
        )}

        {visorType === 'twin-lens' && (
          <g filter={`url(#neon-glow-${card.id})`}>
            {/* Glowing Ocular Lenses */}
            <ellipse cx="68" cy="85" rx="7" ry="5" fill="#120524" stroke={neonColor} strokeWidth="1.5" />
            <circle cx="68" cy="85" r="3" fill="#ffffff" />
            <ellipse cx="92" cy="85" rx="7" ry="5" fill="#120524" stroke={neonColor} strokeWidth="1.5" />
            <circle cx="92" cy="85" r="3" fill="#ffffff" />
            <line x1="75" y1="85" x2="85" y2="85" stroke={neonColor} strokeWidth="1.5" />
          </g>
        )}

        {visorType === 'neural-strip' && (
          <g>
            <ellipse cx="68" cy="85" rx="5" ry="3" fill="#ffffff" />
            <circle cx="68" cy="85" r="2" fill={neonColor} />
            <ellipse cx="92" cy="85" rx="5" ry="3" fill="#ffffff" />
            <circle cx="92" cy="85" r="2" fill={neonColor} />
            {/* Neural forehead strip */}
            <path
              d="M 60 68 L 100 68 L 96 72 L 64 72 Z"
              fill={neonColor}
              filter={`url(#neon-glow-${card.id})`}
            />
          </g>
        )}

        {visorType === 'optic-cross' && (
          <g filter={`url(#neon-glow-${card.id})`}>
            <ellipse cx="68" cy="85" rx="6" ry="4" fill="#ffffff" />
            <circle cx="68" cy="85" r="2.5" fill={neonColor} />
            <ellipse cx="92" cy="85" rx="6" ry="4" fill="#ffffff" />
            {/* Targeting Reticle over Right Eye */}
            <circle cx="92" cy="85" r="6" fill="none" stroke={neonColor} strokeWidth="1.2" />
            <line x1="86" y1="85" x2="98" y2="85" stroke={neonColor} strokeWidth="1.2" />
            <line x1="92" y1="79" x2="92" y2="91" stroke={neonColor} strokeWidth="1.2" />
          </g>
        )}

        {visorType === 'full-visor' && (
          <g filter={`url(#neon-glow-${card.id})`}>
            {/* Sleek Chrome Full Visor Shield */}
            <path
              d="M 46 76 Q 80 72 114 76 L 108 96 Q 80 102 52 96 Z"
              fill="#0b0f19"
              stroke={neonColor}
              strokeWidth="2"
            />
            <path
              d="M 56 86 Q 80 90 104 86"
              fill="none"
              stroke={neonColor}
              strokeWidth="2.5"
            />
          </g>
        )}

        {/* Nose & Lips */}
        <path d="M 80 95 L 78 106 L 82 106" stroke="#aa6f55" strokeWidth="1.2" fill="none" />
        <path d="M 73 118 Q 80 124 87 118" fill="none" stroke="#b04060" strokeWidth="2.5" strokeLinecap="round" />

        {/* Front Stylish Bangs / Hair Strands */}
        <path
          d="M 50 56 Q 70 42 110 56 Q 85 75 75 90 Q 60 70 50 56 Z"
          fill={`url(#grad-hair-${card.id})`}
        />
        {/* Neon hair highlight strand */}
        <path
          d="M 54 58 Q 72 48 95 62"
          fill="none"
          stroke={neonColor}
          strokeWidth="2"
          strokeOpacity="0.8"
          filter={`url(#neon-glow-${card.id})`}
        />

        {/* Faction Suit Crest in top corner */}
        <text
          x="145"
          y="24"
          fill={neonColor}
          fontSize="14"
          fontWeight="bold"
          textAnchor="end"
          filter={`url(#neon-glow-${card.id})`}
          opacity="0.9"
        >
          {suit.symbol}
        </text>
      </svg>

      {/* Cyberpunk Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${neonColor}22 3px, ${neonColor}22 6px)`,
        }}
      />
    </div>
  );
};
