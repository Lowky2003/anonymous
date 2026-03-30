/* ── Hamster ── */

function drawHamsterPet(ctx, s, lp, moving, hunger, action, ap, t, pal) {
  const sleeping   = action === 'sleep' || action === 'nap';
  const bodyColor  = pal ? pal.body  : '#f5c38a';
  const cheekColor = pal ? pal.cheek : '#ffe0b2';
  const tummyColor = pal ? pal.tummy : '#fff5e6';
  const earColor   = pal ? pal.ear   : '#dda070';
  // Super round body
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.arc(0, 0, s*0.38, 0, Math.PI*2); ctx.fill();
  // White tummy
  ctx.fillStyle = tummyColor;
  ctx.beginPath(); ctx.ellipse(s*0.05, s*0.08, s*0.2, s*0.18, 0, 0, Math.PI*2); ctx.fill();
  // Head (big round)
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.arc(s*0.25, -s*0.1, s*0.3, 0, Math.PI*2); ctx.fill();
  // HUGE puffy cheeks
  ctx.fillStyle = cheekColor;
  ctx.beginPath(); ctx.ellipse(s*0.08, -s*0.01, s*0.16, s*0.14, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s*0.42, -s*0.01, s*0.16, s*0.14, 0, 0, Math.PI*2); ctx.fill();
  // Cheek blush
  ctx.fillStyle = 'rgba(255,150,150,0.25)';
  ctx.beginPath(); ctx.arc(s*0.08, s*0.02, s*0.08, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*0.42, s*0.02, s*0.08, 0, Math.PI*2); ctx.fill();
  // Tiny round ears
  ctx.fillStyle = earColor;
  ctx.beginPath(); ctx.arc(s*0.1,  -s*0.36, s*0.075, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*0.4,  -s*0.36, s*0.075, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ffb6c1';
  ctx.beginPath(); ctx.arc(s*0.1,  -s*0.36, s*0.045, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*0.4,  -s*0.36, s*0.045, 0, Math.PI*2); ctx.fill();
  // Eyes
  if (sleeping) {
    drawSleepEyes(ctx, s, s*0.18, -s*0.16, s*0.32, -s*0.16, s*0.032);
  } else {
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(s*0.18, -s*0.16, s*0.032, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.32, -s*0.16, s*0.032, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(s*0.185, -s*0.17, s*0.012, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.325, -s*0.17, s*0.012, 0, Math.PI*2); ctx.fill();
  }
  // Tiny pink nose
  ctx.fillStyle = '#e88';
  ctx.beginPath(); ctx.arc(s*0.25, -s*0.08, s*0.02, 0, Math.PI*2); ctx.fill();
  // W mouth
  ctx.strokeStyle = '#c08060'; ctx.lineWidth = s * 0.008;
  ctx.beginPath();
  ctx.moveTo(s*0.2,-s*0.05); ctx.lineTo(s*0.225,-s*0.035); ctx.lineTo(s*0.25,-s*0.055);
  ctx.lineTo(s*0.275,-s*0.035); ctx.lineTo(s*0.3,-s*0.05); ctx.stroke();
  // Seed near mouth when hungry
  if (hunger < 40) {
    ctx.fillStyle = '#8B7355';
    ctx.beginPath(); ctx.ellipse(s*0.35, -s*0.04, s*0.025, s*0.015, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#6b5335'; ctx.lineWidth = s*0.004;
    ctx.beginPath(); ctx.moveTo(s*0.34,-s*0.04); ctx.lineTo(s*0.36,-s*0.04); ctx.stroke();
  }
  // Tiny paws
  ctx.fillStyle = '#f0b67a';
  ctx.beginPath(); ctx.arc(s*0.08, s*0.12, s*0.04, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(s*0.42, s*0.12, s*0.04, 0, Math.PI*2); ctx.fill();
  if (!sleeping) drawPetLegs(ctx, s * 0.75, lp, moving, bodyColor);
}
