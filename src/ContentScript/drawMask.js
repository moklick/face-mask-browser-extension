function randomInt(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColors(colorized = true) {
  const blackOrWhiteRandom = Math.random();

  if (blackOrWhiteRandom < 0.3 || !colorized) {
    return ['#fff', '#ddd'];
  } else if (blackOrWhiteRandom < 0.4) {
    return ['#333', '#111'];
  }

  const hue = Math.random() * 360;
  const saturation = randomInt(40, 60);
  const light = randomInt(20, 80);

  return [`hsl(${hue},${saturation}%,${light}%)`, `hsl(${hue},${saturation}%,${light - 10}%)`];
}

export default function drawMask({ jawOutline, nose }, ctx) {
  const jaw = jawOutline.slice(1, jawOutline.length - 1);
  const noseTop = {
    x: (nose[0].x + nose[1].x) / 2,
    y: (nose[0].y + nose[1].y) / 2
  };
  const jawMaxY = Math.max(...jaw.map(p => p.y));
  const xy = [...jaw, noseTop];
  const gradient = ctx.createLinearGradient(
    noseTop.x,
    noseTop.y,
    noseTop.x,
    jawMaxY
  );

  const [colorTop, colorBottom] = getRandomColors();

  gradient.addColorStop(0, colorTop);
  gradient.addColorStop(1, colorBottom);

  ctx.fillStyle = gradient;
  ctx.strokeStyle = colorBottom;
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
