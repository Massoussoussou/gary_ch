import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "auto" }) {
  const { pathname } = useLocation();
  useEffect(() => {
    // Remonte en haut à chaque changement de route
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, behavior]);
  return null;
}
