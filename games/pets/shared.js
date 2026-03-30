/* ── Shared pet helpers ── */

function drawSleepEyes(ctx, s, x1, y1, x2, y2, r) {
  ctx.strokeStyle = '#555'; ctx.lineWidth = s * 0.018; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x1, y1, r, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(x2, y2, r, Math.PI, 0); ctx.stroke();
}

function drawPetLegs(ctx, s, lp, moving, color) {
  ctx.fillStyle = color;
  const legW = s * 0.08;
  const legH = s * 0.18;
  const swing = moving ? Math.sin(lp) * s * 0.08 : 0;
  // front legs
  ctx.fillRect(s * 0.15 + swing, s * 0.2, legW, legH);
  ctx.fillRect(s * 0.25 - swing, s * 0.2, legW, legH);
  // back legs
  ctx.fillRect(-s * 0.25 - swing, s * 0.2, legW, legH);
  ctx.fillRect(-s * 0.15 + swing, s * 0.2, legW, legH);
}
