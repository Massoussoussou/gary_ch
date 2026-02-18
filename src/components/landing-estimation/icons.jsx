import React from "react";

export const GaryLogoWhite = () => (
  <svg viewBox="0 0 1372 309" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FFFFFF">
      <path d="M12,156.2C12,72.9,73.2,9.4,162.1,9.4c58.5,0,102.7,25.5,127,62l-42.8,27.8c-15.7-26.5-44.7-44.1-84.2-44.1c-57.8,0-96.3,43.4-96.3,101.1c0,58.1,38.6,101.9,96.3,101.9c47.2,0,81-26.3,89.6-68.5h-92.5v-43.9h151c0,93.3-57.2,157.4-148.1,157.4C73.2,303,12,239.5,12,156.2z"/>
      <path d="M505.7,15.2h57l114.6,282.1h-53.5L594.4,223H474l-29.4,74.3h-53.3L505.7,15.2z M577.9,178.5L534.3,67.7l-43.8,110.7H577.9z"/>
      <path d="M787.6,15.2h100.4c69.1,0,101.1,32.2,101.1,80.2c0,40.1-26.1,71-76,77.3l110.3,124.5h-63.1L854.7,175.8h-16.5v121.5h-50.7V15.2z M883.7,134.1c34.7,0,51.4-13.2,51.4-38.2c0-24.9-16.7-38.2-51.4-38.2h-45.5v76.4H883.7z"/>
      <path d="M1192.1,177.1l-112.3-162h56.6l81.2,119.5l81.2-119.5h56.4l-112.4,162v120.1h-50.7V177.1z"/>
    </g>
  </svg>
);

export const GaryLogoRed = () => (
  <svg viewBox="0 0 1372 309" xmlns="http://www.w3.org/2000/svg">
    <g fill="#FA4838">
      <path d="M12,156.2C12,72.9,73.2,9.4,162.1,9.4c58.5,0,102.7,25.5,127,62l-42.8,27.8c-15.7-26.5-44.7-44.1-84.2-44.1c-57.8,0-96.3,43.4-96.3,101.1c0,58.1,38.6,101.9,96.3,101.9c47.2,0,81-26.3,89.6-68.5h-92.5v-43.9h151c0,93.3-57.2,157.4-148.1,157.4C73.2,303,12,239.5,12,156.2z"/>
      <path d="M505.7,15.2h57l114.6,282.1h-53.5L594.4,223H474l-29.4,74.3h-53.3L505.7,15.2z M577.9,178.5L534.3,67.7l-43.8,110.7H577.9z"/>
      <path d="M787.6,15.2h100.4c69.1,0,101.1,32.2,101.1,80.2c0,40.1-26.1,71-76,77.3l110.3,124.5h-63.1L854.7,175.8h-16.5v121.5h-50.7V15.2z M883.7,134.1c34.7,0,51.4-13.2,51.4-38.2c0-24.9-16.7-38.2-51.4-38.2h-45.5v76.4H883.7z"/>
      <path d="M1192.1,177.1l-112.3-162h56.6l81.2,119.5l81.2-119.5h56.4l-112.4,162v120.1h-50.7V177.1z"/>
    </g>
  </svg>
);

export const IconCheck = ({ size = 14, color = "currentColor", strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconLock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export const IconCalendar = ({ size = 24, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const IconPhone = ({ size = 18, color = "#FF4A3E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

export const IconChart = ({ size = 18, color = "#FF4A3E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

export const IconHome = ({ size = 18, color = "#FF4A3E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconTarget = ({ size = 18, color = "#FF4A3E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const IconBook = ({ size = 18, color = "#FF4A3E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);

export const IconCheckGold = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
