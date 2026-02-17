import { useEffect } from 'react'
import ThreeHeroTiles from '../components/ThreeHeroTiles.jsx'

export default function Home(){
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    if (window.__lenis) window.__lenis.stop();
    return () => {
      document.documentElement.style.overflow = '';
      if (window.__lenis) window.__lenis.start();
    };
  }, []);

  return (
      <ThreeHeroTiles />
  )
}
