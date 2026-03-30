/* ── Bunny ── */

function drawBunnyPet(ctx, s, lp, moving, hunger, action, ap, t, pal) {
  const sleeping  = action === 'sleep' || action === 'nap';
  const bodyColor = pal ? pal.body      : '#f0f0f0';
  const pinkColor = pal ? pal.pink      : '#ffb6c1';
  const tailColor = pal ? pal.tail      : '#fff';
  const tailShade = pal ? pal.tailShade : '#eee';
  // Cotton-ball tail
  ctx.fillStyle = tailColor;
  ctx.beginPath(); ctx.arc(-s*0.42, 0, s*0.12, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = tailShade;
  ctx.beginPath(); ctx.arc(-s*0.44, -s*0.03, s*0.05, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(-s*0.38,  s*0.04, s*0.04, 0, Math.PI*2); ctx.fill();
  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(0, 0, s*0.42, s*0.35, 0, 0, Math.PI*2); ctx.fill();
  // Head
  ctx.beginPath(); ctx.arc(s*0.3, -s*0.16, s*0.26, 0, Math.PI*2); ctx.fill();
  // Long ears
  ctx.beginPath(); ctx.ellipse(s*0.2, -s*0.58, s*0.065, s*0.26, -0.15, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s*0.4, -s*0.55, s*0.065, s*0.24,  0.15, 0, Math.PI*2); ctx.fill();
  // Inner ears
  ctx.fillStyle = pinkColor;
  ctx.beginPath(); ctx.ellipse(s*0.2, -s*0.58, s*0.035, s*0.2,  -0.15, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s*0.4, -s*0.55, s*0.035, s*0.18,  0.15, 0, Math.PI*2); ctx.fill();
  // Eyes
  if (sleeping) {
    drawSleepEyes(ctx, s, s*0.22, -s*0.2, s*0.38, -s*0.2, s*0.04);
  } else {
    ctx.fillStyle = hunger > 20 ? '#c44' : '#833';
    ctx.beginPath(); ctx.arc(s*0.22, -s*0.2, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.38, -s*0.2, s*0.04, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(s*0.23, -s*0.21, s*0.015, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.39, -s*0.21, s*0.015, 0, Math.PI*2); ctx.fill();
  }
  // Y-shaped nose
  ctx.fillStyle = pinkColor;
  ctx.beginPath(); ctx.moveTo(s*0.28,-s*0.11); ctx.lineTo(s*0.3,-s*0.08); ctx.lineTo(s*0.32,-s*0.11); ctx.fill();
  // Mouth line
  ctx.strokeStyle = '#caa'; ctx.lineWidth = s * 0.008;
  ctx.beginPath(); ctx.moveTo(s*0.3,-s*0.08); ctx.lineTo(s*0.3,-s*0.04); ctx.stroke();
  // Buck teeth
  ctx.fillStyle = '#fff';
  ctx.fillRect(s*0.275, -s*0.04, s*0.025, s*0.035);
  ctx.fillRect(s*0.305, -s*0.04, s*0.025, s*0.035);
  ctx.strokeStyle = '#ddd'; ctx.lineWidth = s * 0.005;
  ctx.strokeRect(s*0.275, -s*0.04, s*0.025, s*0.035);
  ctx.strokeRect(s*0.305, -s*0.04, s*0.025, s*0.035);
  // Cheek blush
  ctx.fillStyle = 'rgba(255,182,193,0.35)';
  ctx.beginPath(); ctx.arc(s*0.15, -s*0.1, s*0.045, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*0.45, -s*0.1, s*0.045, 0, Math.PI*2); ctx.fill();
  // Whiskers
  ctx.strokeStyle = '#ccc'; ctx.lineWidth = s * 0.006;
  ctx.beginPath(); ctx.moveTo(s*0.17,-s*0.1);  ctx.lineTo(s*0.02,-s*0.13); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.17,-s*0.07);  ctx.lineTo(s*0.02,-s*0.05); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.43,-s*0.1);  ctx.lineTo(s*0.58,-s*0.13); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.43,-s*0.07); ctx.lineTo(s*0.58,-s*0.05); ctx.stroke();
  if (!sleeping) drawPetLegs(ctx, s * 0.9, lp, moving, bodyColor);
}
