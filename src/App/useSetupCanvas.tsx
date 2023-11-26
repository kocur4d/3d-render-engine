import { useCallback, useEffect, useState } from "react";

export const useSetupCanvas = (width?: number, height?: number) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const ref = useCallback((node: HTMLCanvasElement) => {
    if (node) {
      const ctx = node.getContext("2d");
      if (ctx) {
        setCtx(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (ctx) {
      const canvas = ctx.canvas;
      canvas.width = width ?? window.innerWidth;
      canvas.height = height ?? window.innerHeight;
    }
  }, [ctx, height, width]);

  return { ref, ctx };
};
