const CTOP = 38;

const drawGizmos = (
  ctx: CanvasRenderingContext2D,
  screenWidth: number,
  screenHeight: number
) => {
  ctx.beginPath();
  ctx.moveTo(0, CTOP);
  ctx.lineTo(screenWidth, CTOP);
  ctx.moveTo(0, screenHeight - CTOP);
  ctx.lineTo(screenWidth, screenHeight - CTOP);
  ctx.stroke();
};

export default drawGizmos;
