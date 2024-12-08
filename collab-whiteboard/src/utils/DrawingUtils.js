// utils/DrawingUtils.js
// Draw a line from point x0y0 to x1y1
export const draw = (context, x0, y0, x1, y1, color, lineWidth) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.stroke();
  context.closePath();
};

export const drawPolyline = (e, canvasRef, isDrawing, color, lineWidth,sendMessage, lastPos, setLastPos) => {
  if (!isDrawing) return;

  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';

  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  context.moveTo(x, y);

  // Only draw if there is a previous position
  if (lastPos) {
    draw(context, lastPos.x, lastPos.y, x, y, color, lineWidth);

    // Emit the drawing data with the previous position
    // sendMessage('drawing', {
    //   type: 'poly??Segment',
    //   x0: lastPos.x,
    //   y0: lastPos.y,
    //   x1: x,
    //   y1: y,
    //   color: color,
    //   lineWidth: lineWidth
    // });
  }

  // Update the last position to the current position
  // setLastPos({ x, y });
};
// DrawingUtils.js

export const drawLine = (context, x0, y0, x1, y1, color, lineWidth) => {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.closePath();
};

export const drawRectangle = (context, x0, y0, x1, y1, color, lineWidth) => {
  const width = x1 - x0;
  const height = y1 - y0;
  context.beginPath();
  context.rect(x0, y0, width, height);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.closePath();
};

export const drawCircle = (context, x0, y0, x1, y1, color, lineWidth) => {
  const radius = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  context.beginPath();
  context.arc(x0, y0, radius, 0, 2 * Math.PI);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.closePath();
};
