/* ==========================================================================
   Scratch Art Engine & Underlying Artwork Generator
   Produces rich, vibrant, high-contrast scenes hidden under the scratch coat.
   ========================================================================== */

export const SCRATCH_THEMES = [
  {
    id: 'rainbow',
    name: 'Rainbow Magic',
    emoji: '🌈',
    blurb: 'Vibrant rainbow spectrum with glowing stars & sparkles',
  },
  {
    id: 'galaxy',
    name: 'Cosmic Galaxy',
    emoji: '🚀',
    blurb: 'Deep space nebula, planets, rockets & shooting stars',
  },
  {
    id: 'fairytale',
    name: 'Fairy Tale Castle',
    emoji: '🏰',
    blurb: 'Enchanted kingdom with rainbow bridge & magical unicorns',
  },
  {
    id: 'underwater',
    name: 'Ocean Wonders',
    emoji: '🐬',
    blurb: 'Playful dolphins, sea turtles, corals & glowing jellyfish',
  },
  {
    id: 'fireworks',
    name: 'Midnight Fireworks',
    emoji: '🎆',
    blurb: 'Explosive sparkling fireworks over a glowing wonderland',
  },
];

export function getScratchUnderlayerSVG(themeId = 'rainbow') {
  switch (themeId) {
    case 'galaxy':
      return `
        <svg viewBox="0 0 1000 760" xmlns="http://www.w3.org/2000/svg" class="scratch-svg">
          <defs>
            <radialGradient id="nebula1" cx="30%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#FF2A85" />
              <stop offset="40%" stop-color="#8B5CF6" />
              <stop offset="80%" stop-color="#3B82F6" />
              <stop offset="100%" stop-color="#0F172A" />
            </radialGradient>
            <radialGradient id="nebula2" cx="75%" cy="70%" r="50%">
              <stop offset="0%" stop-color="#00F0FF" />
              <stop offset="50%" stop-color="#6366F1" />
              <stop offset="100%" stop-color="#1E1B4B" />
            </radialGradient>
            <linearGradient id="saturnRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFD166" />
              <stop offset="50%" stop-color="#FF6B8B" />
              <stop offset="100%" stop-color="#4ECDC4" />
            </linearGradient>
            <linearGradient id="rocketBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="100%" stop-color="#CBD5E1" />
            </linearGradient>
          </defs>
          <rect width="1000" height="760" fill="url(#nebula1)" />
          <rect width="1000" height="760" fill="url(#nebula2)" opacity="0.6" style="mix-blend-mode: screen;" />

          <!-- Star clusters -->
          <g fill="#FFF" opacity="0.9">
            <circle cx="120" cy="80" r="3" /><circle cx="280" cy="140" r="4" /><circle cx="420" cy="70" r="2.5" />
            <circle cx="620" cy="110" r="5" /><circle cx="780" cy="60" r="3" /><circle cx="890" cy="140" r="4.5" />
            <circle cx="150" cy="320" r="3" /><circle cx="90" cy="500" r="4" /><circle cx="340" cy="460" r="2.5" />
            <circle cx="580" cy="400" r="4" /><circle cx="820" cy="480" r="3.5" /><circle cx="920" cy="380" r="3" />
            <circle cx="220" cy="650" r="4" /><circle cx="450" cy="620" r="3" /><circle cx="700" cy="680" r="4.5" />
            <!-- Twinkle stars -->
            <path d="M620,110 L624,124 L638,124 L627,132 L631,146 L620,137 L609,146 L613,132 L602,124 L616,124 Z" fill="#FFE600" />
            <path d="M180,220 L183,230 L193,230 L185,236 L188,246 L180,240 L172,246 L175,236 L167,230 L177,230 Z" fill="#FF5252" />
            <path d="M850,220 L853,230 L863,230 L855,236 L858,246 L850,240 L842,246 L845,236 L837,230 L847,230 Z" fill="#00E5FF" />
          </g>

          <!-- Planet Saturn with rings -->
          <g transform="translate(760, 260)">
            <!-- Back ring -->
            <ellipse cx="0" cy="0" rx="140" ry="45" fill="none" stroke="url(#saturnRing)" stroke-width="22" opacity="0.6" transform="rotate(-22)" />
            <!-- Planet body -->
            <circle cx="0" cy="0" r="75" fill="#FFAA00" />
            <circle cx="-15" cy="-10" r="65" fill="#FFD166" />
            <!-- Front ring -->
            <path d="M-130,50 A140,45 0 0,0 130,-50" fill="none" stroke="url(#saturnRing)" stroke-width="22" stroke-linecap="round" transform="rotate(-22)" />
          </g>

          <!-- Friendly Blue & Green Planet -->
          <g transform="translate(180, 520)">
            <circle cx="0" cy="0" r="95" fill="#00C9FF" />
            <circle cx="-15" cy="-15" r="80" fill="#92FE9D" opacity="0.75" />
            <ellipse cx="-20" cy="10" rx="40" ry="25" fill="#00A86B" opacity="0.8" />
            <ellipse cx="25" cy="-30" rx="30" ry="18" fill="#00A86B" opacity="0.8" />
          </g>

          <!-- Cute Flying Space Rocket -->
          <g transform="translate(480, 320) rotate(-35)">
            <!-- Exhaust fire -->
            <polygon points="-25,110 0,165 25,110" fill="#FF3B30" />
            <polygon points="-16,110 0,145 16,110" fill="#FF9500" />
            <polygon points="-8,110 0,130 8,110" fill="#FFCC00" />
            <!-- Fins -->
            <polygon points="-40,95 -65,115 -35,55" fill="#FF2D55" />
            <polygon points="40,95 65,115 35,55" fill="#FF2D55" />
            <!-- Fuselage -->
            <ellipse cx="0" cy="40" rx="36" ry="75" fill="url(#rocketBody)" />
            <!-- Nose cone -->
            <path d="M-36,5 C-30,-40 0,-70 0,-70 C0,-70 30,-40 36,5 Z" fill="#FF2D55" />
            <!-- Portal Window -->
            <circle cx="0" cy="20" r="22" fill="#38BDF8" stroke="#0284C7" stroke-width="5" />
            <circle cx="-6" cy="14" r="6" fill="#FFF" opacity="0.85" />
          </g>

          <!-- Shooting star trail -->
          <g transform="translate(250, 100) rotate(28)">
            <line x1="0" y1="0" x2="260" y2="0" stroke="url(#saturnRing)" stroke-width="8" stroke-linecap="round" />
            <circle cx="260" cy="0" r="14" fill="#FFE600" />
          </g>
        </svg>
      `;

    case 'fairytale':
      return `
        <svg viewBox="0 0 1000 760" xmlns="http://www.w3.org/2000/svg" class="scratch-svg">
          <defs>
            <linearGradient id="fairySky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FF9A9E" />
              <stop offset="30%" stop-color="#FECFEF" />
              <stop offset="70%" stop-color="#A1C4FD" />
              <stop offset="100%" stop-color="#C2E9FB" />
            </linearGradient>
            <linearGradient id="castleTurret" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FF6B8B" />
              <stop offset="100%" stop-color="#9B51E0" />
            </linearGradient>
            <linearGradient id="castleWalls" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FFF1EB" />
              <stop offset="100%" stop-color="#ACE0F9" />
            </linearGradient>
            <linearGradient id="goldRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FEE140" />
              <stop offset="100%" stop-color="#FA709A" />
            </linearGradient>
          </defs>
          <rect width="1000" height="760" fill="url(#fairySky)" />

          <!-- Rainbow Arch in background -->
          <g opacity="0.85">
            <path d="M100,550 A420,420 0 0,1 900,550" fill="none" stroke="#FF477E" stroke-width="16" />
            <path d="M116,550 A404,404 0 0,1 884,550" fill="none" stroke="#FF85A1" stroke-width="16" />
            <path d="M132,550 A388,388 0 0,1 868,550" fill="none" stroke="#FBB1BD" stroke-width="16" />
            <path d="M148,550 A372,372 0 0,1 852,550" fill="none" stroke="#70D6FF" stroke-width="16" />
            <path d="M164,550 A356,356 0 0,1 836,550" fill="none" stroke="#B8E986" stroke-width="16" />
            <path d="M180,550 A340,340 0 0,1 820,550" fill="none" stroke="#FFD166" stroke-width="16" />
          </g>

          <!-- Fluffy Clouds -->
          <g fill="#FFFFFF" opacity="0.95">
            <ellipse cx="200" cy="220" rx="90" ry="45" /><ellipse cx="260" cy="190" rx="70" ry="50" /><ellipse cx="140" cy="210" rx="60" ry="40" />
            <ellipse cx="800" cy="180" rx="100" ry="50" /><ellipse cx="870" cy="160" rx="75" ry="45" /><ellipse cx="730" cy="180" rx="65" ry="40" />
          </g>

          <!-- Fairy Tale Castle -->
          <g transform="translate(500, 480)">
            <!-- Base hill -->
            <ellipse cx="0" cy="120" rx="460" ry="120" fill="#7FD858" />
            <ellipse cx="0" cy="130" rx="430" ry="90" fill="#58B838" />

            <!-- Main Central Tower -->
            <rect x="-90" y="-180" width="180" height="200" fill="url(#castleWalls)" />
            <polygon points="-110,-180 0,-330 110,-180" fill="url(#goldRoof)" />
            <circle cx="0" cy="-330" r="14" fill="#FFD700" />
            <!-- Golden flag -->
            <path d="M0,-330 L45,-350 L0,-370 Z" fill="#FF3B30" />

            <!-- Left Tower -->
            <rect x="-210" y="-140" width="100" height="180" fill="url(#castleWalls)" />
            <polygon points="-225,-140 -160,-270 -95,-140" fill="url(#castleTurret)" />
            <circle cx="-160" cy="-270" r="10" fill="#FFD700" />

            <!-- Right Tower -->
            <rect x="110" y="-140" width="100" height="180" fill="url(#castleWalls)" />
            <polygon points="95,-140 160,-270 225,-140" fill="url(#castleTurret)" />
            <circle cx="160" cy="-270" r="10" fill="#FFD700" />

            <!-- Castle Gate -->
            <path d="M-40,20 A40,55 0 0,1 40,20 L40,60 L-40,60 Z" fill="#6B4423" />
            <!-- Gate rivets -->
            <circle cx="-25" cy="0" r="3" fill="#FFD700" /><circle cx="25" cy="0" r="3" fill="#FFD700" />
            <circle cx="-25" cy="30" r="3" fill="#FFD700" /><circle cx="25" cy="30" r="3" fill="#FFD700" />

            <!-- Turret Windows -->
            <path d="M-15,-90 A15,25 0 0,1 15,-90 L15,-40 L-15,-40 Z" fill="#FFE66D" stroke="#FF6B6B" stroke-width="4" />
            <path d="M-175,-70 A10,18 0 0,1 -145,-70 L-145,-35 L-175,-35 Z" fill="#FFE66D" />
            <path d="M145,-70 A10,18 0 0,1 175,-70 L175,-35 L145,-35 Z" fill="#FFE66D" />
          </g>

          <!-- Floating Golden Stars -->
          <g fill="#FFE600">
            <polygon points="120,380 125,395 140,395 128,405 132,420 120,410 108,420 112,405 100,395 115,395" />
            <polygon points="880,340 885,355 900,355 888,365 892,380 880,370 868,380 872,365 860,355 875,355" />
            <polygon points="490,90 495,105 510,105 498,115 502,130 490,120 478,130 482,115 470,105 485,105" />
          </g>
        </svg>
      `;

    case 'underwater':
      return `
        <svg viewBox="0 0 1000 760" xmlns="http://www.w3.org/2000/svg" class="scratch-svg">
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#00F0FF" />
              <stop offset="40%" stop-color="#0072FF" />
              <stop offset="85%" stop-color="#0A1172" />
              <stop offset="100%" stop-color="#040828" />
            </linearGradient>
            <linearGradient id="dolphinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#70E4EF" />
              <stop offset="100%" stop-color="#0052D4" />
            </linearGradient>
            <linearGradient id="coralGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#FF0844" />
              <stop offset="100%" stop-color="#FFB199" />
            </linearGradient>
            <linearGradient id="sandBed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FFE082" />
              <stop offset="50%" stop-color="#FFD166" />
              <stop offset="100%" stop-color="#F4A261" />
            </linearGradient>
          </defs>
          <rect width="1000" height="760" fill="url(#oceanGrad)" />

          <!-- Sun rays through water -->
          <polygon points="150,0 240,0 350,760 100,760" fill="#FFF" opacity="0.12" />
          <polygon points="400,0 520,0 700,760 480,760" fill="#FFF" opacity="0.1" />
          <polygon points="700,0 800,0 950,760 780,760" fill="#FFF" opacity="0.12" />

          <!-- Ocean Floor with undulating sandy hills -->
          <path d="M0,640 Q250,580 500,640 T1000,620 L1000,760 L0,760 Z" fill="url(#sandBed)" />

          <!-- Vivid Corals -->
          <g fill="url(#coralGrad)">
            <!-- Left coral branch -->
            <path d="M60,650 C60,540 10,500 50,460 C70,440 90,460 90,500 C110,470 140,480 130,520 C160,510 170,550 140,580 C150,610 130,650 110,660 Z" />
            <!-- Right purple coral -->
            <path d="M880,640 C860,550 920,520 890,480 C870,460 850,480 850,520 C830,490 800,500 810,540 C780,530 770,570 800,600 C790,630 820,650 840,650 Z" fill="#BD00FF" />
          </g>

          <!-- Friendly Sea Turtle -->
          <g transform="translate(720, 320) rotate(-15)">
            <ellipse cx="0" cy="0" rx="75" ry="55" fill="#2EC4B6" stroke="#011627" stroke-width="4" />
            <!-- Shell pattern -->
            <polygon points="-25,-25 25,-25 45,0 25,25 -25,25 -45,0" fill="#CBF3F0" stroke="#011627" stroke-width="3" />
            <circle cx="0" cy="0" r="16" fill="#2EC4B6" stroke="#011627" stroke-width="3" />
            <!-- Flippers -->
            <ellipse cx="-45" cy="-60" rx="35" ry="16" fill="#2EC4B6" transform="rotate(-30)" stroke="#011627" stroke-width="3" />
            <ellipse cx="45" cy="-60" rx="35" ry="16" fill="#2EC4B6" transform="rotate(30)" stroke="#011627" stroke-width="3" />
            <ellipse cx="-55" cy="45" rx="22" ry="12" fill="#2EC4B6" stroke="#011627" stroke-width="3" />
            <ellipse cx="55" cy="45" rx="22" ry="12" fill="#2EC4B6" stroke="#011627" stroke-width="3" />
            <!-- Head -->
            <ellipse cx="0" cy="-80" rx="22" ry="26" fill="#2EC4B6" stroke="#011627" stroke-width="3" />
            <circle cx="-8" cy="-86" r="4" fill="#011627" /><circle cx="8" cy="-86" r="4" fill="#011627" />
          </g>

          <!-- Leaping Playful Dolphin -->
          <g transform="translate(360, 260) rotate(-20)">
            <path d="M-140,40 C-80,-60 60,-80 140,-20 C180,10 200,40 220,50 C180,45 130,20 100,20 C40,20 -40,70 -100,75 C-120,75 -135,60 -140,40 Z" fill="url(#dolphinGrad)" />
            <!-- Belly -->
            <path d="M-90,65 C-40,65 30,25 90,25 C70,40 30,55 -20,68 C-60,70 -80,68 -90,65 Z" fill="#E0F7FA" />
            <!-- Dorsal fin -->
            <path d="M10,-48 C20,-90 50,-80 60,-52 Z" fill="#0072FF" />
            <!-- Pectoral flipper -->
            <path d="M20,15 C40,55 70,50 60,20 Z" fill="#0052D4" />
            <!-- Tail fluke -->
            <path d="M-135,38 L-170,10 L-155,38 L-180,65 Z" fill="#0052D4" />
            <!-- Eye & smile -->
            <circle cx="160" cy="5" r="5" fill="#011627" />
            <circle cx="162" cy="3" r="1.5" fill="#FFF" />
            <path d="M165,15 Q175,20 185,16" stroke="#011627" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>

          <!-- Glowing Jellyfish -->
          <g transform="translate(180, 200)">
            <path d="M-45,0 C-45,-40 45,-40 45,0 Q0,10 -45,0 Z" fill="#FF00E5" opacity="0.85" />
            <path d="M-30,5 Q-40,40 -25,75" stroke="#FF77F0" stroke-width="4" fill="none" stroke-linecap="round" />
            <path d="M-10,5 Q-5,45 -12,80" stroke="#FF77F0" stroke-width="4" fill="none" stroke-linecap="round" />
            <path d="M10,5 Q5,45 12,80" stroke="#FF77F0" stroke-width="4" fill="none" stroke-linecap="round" />
            <path d="M30,5 Q40,40 25,75" stroke="#FF77F0" stroke-width="4" fill="none" stroke-linecap="round" />
          </g>

          <!-- Sea Bubbles -->
          <g fill="#FFF" opacity="0.6">
            <circle cx="340" cy="180" r="10" /><circle cx="355" cy="140" r="6" /><circle cx="335" cy="110" r="14" />
            <circle cx="580" cy="220" r="8" /><circle cx="595" cy="180" r="12" /><circle cx="575" cy="150" r="5" />
            <circle cx="780" cy="480" r="7" /><circle cx="795" cy="440" r="10" />
          </g>
        </svg>
      `;

    case 'fireworks':
      return `
        <svg viewBox="0 0 1000 760" xmlns="http://www.w3.org/2000/svg" class="scratch-svg">
          <defs>
            <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0B091A" />
              <stop offset="60%" stop-color="#1B173B" />
              <stop offset="100%" stop-color="#2A1B4E" />
            </linearGradient>
            <radialGradient id="fwGlowGold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFF" />
              <stop offset="25%" stop-color="#FFDF00" />
              <stop offset="70%" stop-color="#FF4E00" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
            <radialGradient id="fwGlowMagenta" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFF" />
              <stop offset="30%" stop-color="#00F0FF" />
              <stop offset="75%" stop-color="#BD00FF" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
            <radialGradient id="fwGlowLime" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFF" />
              <stop offset="30%" stop-color="#FFE600" />
              <stop offset="70%" stop-color="#39FF14" />
              <stop offset="100%" stop-color="transparent" />
            </radialGradient>
          </defs>
          <rect width="1000" height="760" fill="url(#nightSky)" />

          <!-- Burst 1: Golden Radiance Center -->
          <circle cx="500" cy="240" r="210" fill="url(#fwGlowGold)" opacity="0.35" />
          <g stroke="#FFE600" stroke-width="5" stroke-linecap="round">
            <!-- 24 rays -->
            <line x1="500" y1="240" x2="500" y2="70" /><line x1="500" y1="240" x2="500" y2="410" />
            <line x1="500" y1="240" x2="330" y2="240" /><line x1="500" y1="240" x2="670" y2="240" />
            <line x1="500" y1="240" x2="380" y2="120" /><line x1="500" y1="240" x2="620" y2="360" />
            <line x1="500" y1="240" x2="620" y2="120" /><line x1="500" y1="240" x2="380" y2="360" />
            <line x1="500" y1="240" x2="435" y2="85" /><line x1="500" y1="240" x2="565" y2="395" />
            <line x1="500" y1="240" x2="565" y2="85" /><line x1="500" y1="240" x2="435" y2="395" />
            <line x1="500" y1="240" x2="345" y2="175" /><line x1="500" y1="240" x2="655" y2="305" />
            <line x1="500" y1="240" x2="655" y2="175" /><line x1="500" y1="240" x2="345" y2="305" />
          </g>
          <!-- Sparkle dots on rays -->
          <g fill="#FF3B30">
            <circle cx="500" cy="65" r="7" /><circle cx="500" cy="415" r="7" /><circle cx="325" cy="240" r="7" /><circle cx="675" cy="240" r="7" />
            <circle cx="375" cy="115" r="7" /><circle cx="625" cy="365" r="7" /><circle cx="625" cy="115" r="7" /><circle cx="375" cy="365" r="7" />
          </g>

          <!-- Burst 2: Neon Cyan & Magenta (Left) -->
          <circle cx="210" cy="340" r="160" fill="url(#fwGlowMagenta)" opacity="0.4" />
          <g stroke="#00F0FF" stroke-width="4.5" stroke-linecap="round">
            <line x1="210" y1="340" x2="210" y2="200" /><line x1="210" y1="340" x2="210" y2="480" />
            <line x1="210" y1="340" x2="70" y2="340" /><line x1="210" y1="340" x2="350" y2="340" />
            <line x1="210" y1="340" x2="110" y2="240" /><line x1="210" y1="340" x2="310" y2="440" />
            <line x1="210" y1="340" x2="310" y2="240" /><line x1="210" y1="340" x2="110" y2="440" />
          </g>
          <g fill="#BD00FF">
            <circle cx="210" cy="195" r="6" /><circle cx="210" cy="485" r="6" /><circle cx="65" cy="340" r="6" /><circle cx="355" cy="340" r="6" />
          </g>

          <!-- Burst 3: Electric Lime & Solar (Right) -->
          <circle cx="800" cy="290" r="170" fill="url(#fwGlowLime)" opacity="0.4" />
          <g stroke="#39FF14" stroke-width="4.5" stroke-linecap="round">
            <line x1="800" y1="290" x2="800" y2="140" /><line x1="800" y1="290" x2="800" y2="440" />
            <line x1="800" y1="290" x2="650" y2="290" /><line x1="800" y1="290" x2="950" y2="290" />
            <line x1="800" y1="290" x2="695" y2="185" /><line x1="800" y1="290" x2="905" y2="395" />
            <line x1="800" y1="290" x2="905" y2="185" /><line x1="800" y1="290" x2="695" y2="395" />
          </g>
          <g fill="#FFE600">
            <circle cx="800" cy="135" r="6" /><circle cx="800" cy="445" r="6" /><circle cx="645" cy="290" r="6" /><circle cx="955" cy="290" r="6" />
          </g>

          <!-- City Skyline Silhouette at bottom -->
          <g fill="#070510">
            <rect x="40" y="620" width="70" height="140" />
            <rect x="120" y="580" width="90" height="180" />
            <polygon points="120,580 165,530 210,580" />
            <rect x="230" y="640" width="80" height="120" />
            <rect x="330" y="590" width="100" height="170" />
            <rect x="450" y="550" width="120" height="210" />
            <polygon points="500,550 510,480 520,550" /> <!-- Spire -->
            <rect x="590" y="610" width="85" height="150" />
            <rect x="700" y="570" width="95" height="190" />
            <polygon points="700,570 747,525 795,570" />
            <rect x="815" y="630" width="80" height="130" />
            <rect x="915" y="600" width="60" height="160" />
          </g>
          <!-- Illuminated City Windows -->
          <g fill="#FFE600" opacity="0.85">
            <rect x="140" y="600" width="12" height="15" /><rect x="170" y="600" width="12" height="15" />
            <rect x="140" y="630" width="12" height="15" /><rect x="170" y="630" width="12" height="15" />
            <rect x="470" y="580" width="15" height="18" /><rect x="525" y="580" width="15" height="18" />
            <rect x="470" y="620" width="15" height="18" /><rect x="525" y="620" width="15" height="18" />
            <rect x="720" y="590" width="14" height="16" /><rect x="755" y="590" width="14" height="16" />
          </g>
        </svg>
      `;

    case 'rainbow':
    default:
      return `
        <svg viewBox="0 0 1000 760" xmlns="http://www.w3.org/2000/svg" class="scratch-svg">
          <defs>
            <linearGradient id="rainbowFlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FF0055" />
              <stop offset="14%" stop-color="#FF5500" />
              <stop offset="28%" stop-color="#FFCC00" />
              <stop offset="42%" stop-color="#33CC33" />
              <stop offset="57%" stop-color="#00CCFF" />
              <stop offset="71%" stop-color="#3344FF" />
              <stop offset="85%" stop-color="#8800FF" />
              <stop offset="100%" stop-color="#FF00CC" />
            </linearGradient>
            <radialGradient id="sunburst" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="40%" stop-color="#FFF066" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#FF8800" stop-opacity="0" />
            </radialGradient>
          </defs>

          <!-- Rich diagonal rainbow spectrum bands -->
          <rect width="1000" height="760" fill="url(#rainbowFlow)" />

          <!-- Dynamic concentric wave patterns -->
          <g fill="none" stroke="#FFFFFF" opacity="0.3" stroke-width="8">
            <circle cx="200" cy="200" r="160" />
            <circle cx="200" cy="200" r="280" />
            <circle cx="200" cy="200" r="420" />
            <circle cx="800" cy="560" r="160" />
            <circle cx="800" cy="560" r="280" />
            <circle cx="800" cy="560" r="420" />
          </g>

          <!-- Glowing Sunburst centers -->
          <circle cx="500" cy="380" r="260" fill="url(#sunburst)" />

          <!-- Multitude of Sparkles, Stars, and Hearts scattered across -->
          <g fill="#FFFFFF" opacity="0.9">
            <!-- Diamond sparkles -->
            <path d="M500,200 Q500,240 540,240 Q500,240 500,280 Q500,240 460,240 Q500,240 500,200 Z" />
            <path d="M220,120 Q220,150 250,150 Q220,150 220,180 Q220,150 190,150 Q220,150 220,120 Z" />
            <path d="M780,180 Q780,210 810,210 Q780,210 780,240 Q780,210 750,210 Q780,210 780,180 Z" />
            <path d="M160,480 Q160,510 190,510 Q160,510 160,540 Q160,510 130,510 Q160,510 160,480 Z" />
            <path d="M820,540 Q820,570 850,570 Q820,570 820,600 Q820,570 790,570 Q820,570 820,540 Z" />
            <path d="M480,560 Q480,590 510,590 Q480,590 480,620 Q480,590 450,590 Q480,590 480,560 Z" />
          </g>

          <g fill="#FFE600">
            <!-- 5-point stars -->
            <polygon points="340,140 346,158 365,158 350,169 355,187 340,176 325,187 330,169 315,158 334,158" />
            <polygon points="660,130 666,148 685,148 670,159 675,177 660,166 645,177 650,159 635,148 654,148" />
            <polygon points="360,440 366,458 385,458 370,469 375,487 360,476 345,487 350,469 335,458 354,458" />
            <polygon points="680,480 686,498 705,498 690,509 695,527 680,516 665,527 670,509 655,498 674,498" />
          </g>

          <!-- Cute Hearts -->
          <g fill="#FF2A7A" opacity="0.85">
            <path d="M260,320 C260,300 240,285 220,285 C200,285 185,300 185,320 C185,350 220,380 220,380 C220,380 255,350 255,320 Z" transform="scale(0.85) translate(80, 50)" />
            <path d="M740,340 C740,320 720,305 700,305 C680,305 665,320 665,340 C665,370 700,400 700,400 C700,400 735,370 735,340 Z" transform="scale(0.85) translate(140, 60)" />
          </g>
        </svg>
      `;
  }
}
