
export default function drawPrivacy(parts, ctx) {
  console.log(parts);
  const leftBounds = parts.leftEye.reduce(
    (res, item) => {
      if (item.x < res.minX) {
        res.minX = item.x;
      }
      if (item.y < res.minY) {
        res.minY = item.y;
      }
      if (item.y > res.maxY) {
        res.maxY = item.y;
      }

      return res;
    },
    { minX: Number.MAX_VALUE, minY: Number.MAX_VALUE, maxY: 0 }
  );
  const rightBounds = parts.rightEye.reduce(
    (res, item) => {
      if (item.x > res.maxX) {
        res.maxX = item.x;
      }
      if (item.y < res.minY) {
        res.minY = item.y;
      }
      if (item.y > res.maxY) {
        res.maxY = item.y;
      }

      return res;
    },
    { maxX: 0, minY: Number.MAX_VALUE, maxY: 0 }
  );

  ctx.fillStyle = '#000';

  ctx.beginPath();

  const diffY = (rightBounds.maxY - leftBounds.minY) * 1;
  const diffX = (rightBounds.maxX - leftBounds.minX) * 0.2;

  const xy = [
    { x: leftBounds.minX - diffX, y: leftBounds.minY - diffY },
    { x: leftBounds.minX - diffX, y: leftBounds.maxY + diffY },
    { x: rightBounds.maxX + diffX, y: rightBounds.maxY + diffY },
    { x: rightBounds.maxX + diffX, y: rightBounds.minY - diffY }
  ];

  xy.forEach((p, i) => {
    const drawFunc = i === 0 ? 'moveTo' : 'lineTo';
    ctx[drawFunc](p.x, p.y);
  });

  ctx.closePath();
  ctx.fill();
}
