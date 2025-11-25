import { useState, useEffect, useRef } from 'react';

const useResizeObserver = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length > 0 && entries[0].contentRect) {
        setWidth(entries[0].contentRect.width);
      }
    });

    resizeObserver.observe(element);

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, []);

  return { ref, width };
};

export default useResizeObserver;
