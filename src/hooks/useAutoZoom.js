import { useEffect } from 'react';

const BASE_WIDTH = 1920;

const useAutoZoom = () => {
  useEffect(() => {
    const applyZoom = () => {
      const zoom = window.innerWidth / BASE_WIDTH;
      document.documentElement.style.zoom = zoom;
    };

    applyZoom();
    window.addEventListener('resize', applyZoom);
    return () => window.removeEventListener('resize', applyZoom);
  }, []);
};

export default useAutoZoom;
