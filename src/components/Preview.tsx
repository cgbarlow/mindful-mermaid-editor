import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface PreviewProps {
  code: string;
  error: string | null;
}

export const Preview = ({ code, error }: PreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        const container = containerRef.current;
        container.innerHTML = "";
        const { svg } = await mermaid.render("diagram", code);
        container.innerHTML = svg;
      } catch (err) {
        console.error("Failed to render diagram:", err);
      }
    };

    mermaid.initialize({ startOnLoad: false, theme: "default" });
    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="h-full bg-white p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white p-4 overflow-auto">
      <div ref={containerRef} className="flex items-center justify-center h-full" />
    </div>
  );
};