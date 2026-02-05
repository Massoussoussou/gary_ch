// src/utils/video.js

export function pickVideoSrc(desktopWebm, desktopMp4, mobileWebm, mobileMp4) {
  // Conditions d'économie data / motion
  const conn =
    navigator.connection ||
    navigator.webkitConnection ||
    navigator.mozConnection;
  const saveData = !!conn?.saveData;
  const slow = /^(slow-)?2g$/.test(conn?.effectiveType || "");
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    ?.matches;

  if (saveData || slow || reduced) return null; // pas de vidéo

  const isDesktop = window.matchMedia?.("(min-width: 1024px)")?.matches;
  // WebM d'abord si supporté, sinon MP4
  const canWebM = document.createElement("video").canPlayType("video/webm");

  if (isDesktop) {
    return canWebM
      ? desktopWebm || "/media/buy/hero24.webm"
      : desktopMp4 || "/media/buy/hero24.mp4";
  } else {
    return canWebM
      ? mobileWebm || desktopWebm || "/media/buy/hero24.webm"
      : mobileMp4 || desktopMp4 || "/media/buy/hero24.mp4";
  }
}

export function pickVideoSrcSimple() {
  const conn =
    navigator.connection ||
    navigator.webkitConnection ||
    navigator.mozConnection;
  const saveData = !!conn?.saveData;
  const slow = /^(slow-)?2g$/.test(conn?.effectiveType || "");
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    ?.matches;

  if (saveData || slow || reduced) return null;

  const canWebM = document.createElement("video").canPlayType("video/webm");
  return canWebM ? "/media/buy/hero24.webm" : "/media/buy/hero24.mp4";
}
