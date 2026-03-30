/* ── Cat ── */

function drawCatPet(ctx, s, lp, moving, hunger, action, ap, t, pal) {
  const sleeping = action === 'sleep' || action === 'nap';
  const bodyColor = pal ? pal.body : '#f5a623';
  const darkColor = pal ? pal.dark : '#d4871a';
  const stripe = pal ? pal.stripe : '#c97a15';
  const innerEar = pal ? pal.inner : '#ffb6c1';
  const muzzleColor = pal ? pal.muzzle : '#ffe0b2';
  // Tail behind body
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = s * 0.07;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 0.45, -s * 0.05);
  ctx.bezierCurveTo(-s * 0.65, -s * 0.15, -s * 0.72, -s * 0.45, -s * 0.48, -s * 0.52);
  ctx.stroke();
  // Tail stripes
  ctx.strokeStyle = stripe; ctx.lineWidth = s * 0.022;
  for (let i = 0; i < 3; i++) {
    const t = 0.3 + i * 0.25, tx = -s * (0.48 + t * 0.15), ty = -s * (0.05 + t * 0.35);
    ctx.beginPath(); ctx.moveTo(tx - s*0.035, ty - s*0.025); ctx.lineTo(tx + s*0.035, ty + s*0.025); ctx.stroke();
  }
  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.35, 0, 0, Math.PI * 2); ctx.fill();
  // Body stripes
  ctx.strokeStyle = stripe; ctx.lineWidth = s * 0.018;
  for (let i = 0; i < 3; i++) {
    const sx = -s * 0.15 + i * s * 0.15;
    ctx.beginPath(); ctx.moveTo(sx, -s * 0.28); ctx.quadraticCurveTo(sx + s*0.02, -s*0.14, sx, 0); ctx.stroke();
  }
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.arc(s * 0.35, -s * 0.18, s * 0.28, 0, Math.PI * 2); ctx.fill();
  // Ears
  ctx.fillStyle = darkColor;
  ctx.beginPath(); ctx.moveTo(s*0.18,-s*0.4); ctx.lineTo(s*0.27,-s*0.66); ctx.lineTo(s*0.42,-s*0.4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(s*0.34,-s*0.42); ctx.lineTo(s*0.47,-s*0.64); ctx.lineTo(s*0.56,-s*0.36); ctx.fill();
  // Inner ears
  ctx.fillStyle = innerEar;
  ctx.beginPath(); ctx.moveTo(s*0.22,-s*0.4); ctx.lineTo(s*0.29,-s*0.58); ctx.lineTo(s*0.38,-s*0.4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(s*0.38,-s*0.42); ctx.lineTo(s*0.46,-s*0.56); ctx.lineTo(s*0.52,-s*0.37); ctx.fill();
  // Muzzle
  ctx.fillStyle = muzzleColor;
  ctx.beginPath(); ctx.ellipse(s*0.38, -s*0.08, s*0.1, s*0.06, 0, 0, Math.PI*2); ctx.fill();
  // Eyes
  const eyeY = -s * 0.22;
  if (sleeping) {
    drawSleepEyes(ctx, s, s*0.26, eyeY, s*0.44, eyeY, s*0.035);
  } else {
    ctx.fillStyle = hunger > 20 ? '#5a5' : '#c44';
    ctx.beginPath(); ctx.ellipse(s*0.26, eyeY, s*0.035, s*0.045, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.44, eyeY, s*0.035, s*0.045, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.ellipse(s*0.26, eyeY, s*0.011, s*0.035, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s*0.44, eyeY, s*0.011, s*0.035, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(s*0.27, eyeY - s*0.015, s*0.012, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.45, eyeY - s*0.015, s*0.012, 0, Math.PI*2); ctx.fill();
  }
  // Triangle nose
  ctx.fillStyle = '#e88';
  ctx.beginPath(); ctx.moveTo(s*0.35,-s*0.1); ctx.lineTo(s*0.38,-s*0.06); ctx.lineTo(s*0.41,-s*0.1); ctx.fill();
  // W mouth
  ctx.strokeStyle = '#a0522d'; ctx.lineWidth = s * 0.012;
  ctx.beginPath();
  ctx.moveTo(s*0.32,-s*0.04); ctx.lineTo(s*0.35,-s*0.02); ctx.lineTo(s*0.38,-s*0.05);
  ctx.lineTo(s*0.41,-s*0.02); ctx.lineTo(s*0.44,-s*0.04); ctx.stroke();
  // Whiskers
  ctx.strokeStyle = '#bbb'; ctx.lineWidth = s * 0.008;
  ctx.beginPath(); ctx.moveTo(s*0.2,-s*0.1); ctx.lineTo(s*0.02,-s*0.14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.2,-s*0.07); ctx.lineTo(s*0.01,-s*0.07); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.2,-s*0.04); ctx.lineTo(s*0.02, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.56,-s*0.1); ctx.lineTo(s*0.72,-s*0.14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.56,-s*0.07); ctx.lineTo(s*0.74,-s*0.07); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.56,-s*0.04); ctx.lineTo(s*0.72, 0); ctx.stroke();
  if (!sleeping) drawPetLegs(ctx, s, lp, moving, bodyColor);
}
