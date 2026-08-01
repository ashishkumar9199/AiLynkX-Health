import React from 'react';

interface MedicalBotAvatarProps {
  className?: string;
  size?: number | string;
  showBackground?: boolean;
}

export const MedicalBotAvatar: React.FC<MedicalBotAvatarProps> = ({
  className = '',
  size = '100%',
  showBackground = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
    >
      {/* 1. Optional Solid Red Background Circle */}
      {showBackground && (
        <circle cx="256" cy="256" r="256" fill="#EF4444" />
      )}

      {/* 2. Floating Drop Shadow underneath the robot */}
      <ellipse cx="256" cy="445" rx="105" ry="14" fill={showBackground ? '#991B1B' : '#E2E8F0'} opacity={showBackground ? "0.4" : "0.7"} />

      {/* 3. Siren on top of head */}
      {/* Alert Glow / Beams */}
      <path d="M 230 40 L 190 10" stroke="#FEE2E2" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M 256 30 L 256 0" stroke="#FEE2E2" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <path d="M 282 40 L 322 10" stroke="#FEE2E2" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      
      {/* Siren Base */}
      <rect x="220" y="115" width="72" height="14" rx="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
      {/* Red dome of siren */}
      <path d="M 232 115 C 232 80 280 80 280 115 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
      <rect x="247" y="94" width="18" height="21" rx="4" fill="#FCA5A5" />

      {/* 4. Side Antennae */}
      {/* Left Antenna */}
      <line x1="148" y1="210" x2="148" y2="135" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="148" cy="125" r="11" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
      {/* Right Antenna */}
      <line x1="364" y1="210" x2="364" y2="135" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
      <circle cx="364" cy="125" r="11" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />

      {/* 5. Left & Right Ears / Side Connectors */}
      <rect x="124" y="180" width="14" height="45" rx="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
      <rect x="374" y="180" width="14" height="45" rx="7" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />

      {/* 6. Arms & First Aid Kit (Rendered behind or besides torso) */}
      {/* Left Arm */}
      <path d="M 180 300 C 145 315 130 355 152 380" fill="none" stroke="#1E293B" strokeWidth="18" strokeLinecap="round" />
      {/* Left Hand Claw */}
      <path d="M 148 372 C 144 378 150 388 158 384 C 164 380 162 372 156 370" fill="none" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />

      {/* Right Arm holding Briefcase */}
      <path d="M 332 300 C 365 315 380 345 365 372" fill="none" stroke="#1E293B" strokeWidth="18" strokeLinecap="round" />
      {/* First Aid Kit */}
      <g>
        {/* Shadow of Kit */}
        <rect x="306" y="372" width="102" height="74" rx="16" fill="#7F1D1D" opacity="0.3" />
        {/* Kit Body */}
        <rect x="302" y="366" width="102" height="74" rx="16" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
        {/* Kit Handle */}
        <path d="M 334 366 C 334 344 372 344 372 366" fill="none" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" />
        {/* White Cross on Kit */}
        <rect x="347" y="388" width="12" height="30" rx="3" fill="#FFFFFF" />
        <rect x="338" y="397" width="30" height="12" rx="3" fill="#FFFFFF" />
      </g>
      {/* Right Hand Claw securing handle */}
      <path d="M 364 366 C 358 370 354 358 360 354" fill="none" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />

      {/* 7. Head (Large rounded rectangle) */}
      <rect x="138" y="125" width="236" height="175" rx="72" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />
      {/* Inner Screen */}
      <rect x="164" y="148" width="184" height="128" rx="46" fill="#1E293B" />
      
      {/* Screen Eyes (Cyan glowing ovals) */}
      <ellipse cx="212" cy="202" rx="16" ry="24" fill="#38BDF8" />
      <ellipse cx="300" cy="202" rx="16" ry="24" fill="#38BDF8" />
      {/* Eye Highlights */}
      <circle cx="216" cy="194" r="5" fill="#FFFFFF" />
      <circle cx="304" cy="194" r="5" fill="#FFFFFF" />
      
      {/* Screen Smile */}
      <path d="M 234 228 C 234 246 278 246 278 228" fill="#38BDF8" />

      {/* 8. Torso / Body Connection neck */}
      <rect x="232" y="292" width="48" height="18" rx="4" fill="#94A3B8" />

      {/* 9. Torso / Main Body (White capsule) */}
      <path d="M 184 310 C 184 270 328 270 328 310 C 328 385 184 385 184 310 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="4" />
      {/* Medical Symbol Circle */}
      <circle cx="256" cy="336" r="28" fill="#EF4444" />
      {/* White Cross on Torso */}
      <rect x="251" y="321" width="10" height="30" rx="2" fill="#FFFFFF" />
      <rect x="241" y="331" width="30" height="10" rx="2" fill="#FFFFFF" />
    </svg>
  );
};
