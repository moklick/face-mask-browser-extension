export default function drawMask(parts, ctx) {
  const jawOutline = parts.jawOutline.slice(1, parts.jawOutline.length - 1);
  const noseTop = {
    x: (parts.nose[0].x + parts.nose[1].x) / 2,
    y: (parts.nose[0].y + parts.nose[1].y) / 2
  };
  const jawMaxY = Math.max(...jawOutline.map(p => p.y));
  const xy = [...jawOutline, noseTop];
  const gradient = ctx.createLinearGradient(
    noseTop.x,
    noseTop.y,
    noseTop.x,
    jawMaxY
  );

  gradient.addColorStop(0, '#fff');
  gradient.addColorStop(1, '#ddd');

  ctx.fillStyle = gradient;
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();

  xy.forEach((p, i) => {
    const drawFunc = i === 0 ? 'moveTo' : 'lineTo';
    ctx[drawFunc](p.x, p.y);
  });

  ctx.closePath();
  ctx.fill();

  ctx.stroke();
}
