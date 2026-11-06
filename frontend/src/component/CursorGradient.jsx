import { useEffect, useRef } from "react";

function CursorGradient() {
  const blob1 = useRef(null);
  const blob2 = useRef(null);
  const blob3 = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      if (blob1.current) {
        blob1.current.style.transform = `translate(${x - 250}px, ${y - 250}px)`;
      }
      if (blob2.current) {
        blob2.current.style.transform = `translate(${x - 175}px, ${y - 175}px)`;
      }
      if (blob3.current) {
        blob3.current.style.transform = `translate(${x - 125}px, ${y - 125}px)`;
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div id="cursor-gradient">
      <div id="cursor-blob-1" ref={blob1} />
      <div id="cursor-blob-2" ref={blob2} />
      <div id="cursor-blob-3" ref={blob3} />
    </div>
  );
}

export default CursorGradient;
