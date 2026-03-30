/* ── Dog ── */

function drawDogPet(ctx, s, lp, moving, hunger, action, ap, t, pal) {
  const sleeping = action === 'sleep' || action === 'nap';
  const bodyColor  = pal ? pal.body   : '#b87333';
  const lightColor = pal ? pal.light  : '#d4a574';
  const earColor   = pal ? pal.ear    : '#8B5E3C';
  const collarColor= pal ? pal.collar : '#d22';
  // Tail (wagging, behind body)
  ctx.strokeStyle = bodyColor; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round';
  const wag = moving ? Math.sin(lp * 3) * 0.4 : 0;
  ctx.beginPath(); ctx.moveTo(-s*0.45, -s*0.1);
  ctx.quadraticCurveTo(-s*0.6, -s*0.48 + wag*20, -s*0.42, -s*0.55); ctx.stroke();
  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.ellipse(0, 0, s*0.5, s*0.35, 0, 0, Math.PI*2); ctx.fill();
  // Belly
  ctx.fillStyle = lightColor;
  ctx.beginPath(); ctx.ellipse(0, s*0.08, s*0.35, s*0.2, 0, 0, Math.PI*2); ctx.fill();
  // Head
  ctx.fillStyle = bodyColor;
  ctx.beginPath(); ctx.arc(s*0.35, -s*0.14, s*0.28, 0, Math.PI*2); ctx.fill();
  // Floppy ears
  ctx.fillStyle = earColor;
  ctx.beginPath(); ctx.ellipse(s*0.16, -s*0.06, s*0.09, s*0.22, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(s*0.52, -s*0.06, s*0.09, s*0.22,  0.3, 0, Math.PI*2); ctx.fill();
  // Snout
  ctx.fillStyle = lightColor;
  ctx.beginPath(); ctx.ellipse(s*0.54, -s*0.06, s*0.13, s*0.11, 0, 0, Math.PI*2); ctx.fill();
  // Eyebrows
  ctx.strokeStyle = '#6b4226'; ctx.lineWidth = s * 0.02;
  ctx.beginPath(); ctx.moveTo(s*0.22,-s*0.26); ctx.lineTo(s*0.32,-s*0.28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s*0.38,-s*0.28); ctx.lineTo(s*0.48,-s*0.26); ctx.stroke();
  // Eyes
  if (sleeping) {
    drawSleepEyes(ctx, s, s*0.28, -s*0.18, s*0.42, -s*0.18, s*0.038);
  } else {
    ctx.fillStyle = hunger > 20 ? '#442' : '#c44';
    ctx.beginPath(); ctx.arc(s*0.28, -s*0.18, s*0.038, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.42, -s*0.18, s*0.038, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(s*0.29, -s*0.19, s*0.014, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.43, -s*0.19, s*0.014, 0, Math.PI*2); ctx.fill();
  }
  // Big black nose
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.ellipse(s*0.58, -s*0.06, s*0.035, s*0.028, 0, 0, Math.PI*2); ctx.fill();
  // Nose shine
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.arc(s*0.575, -s*0.07, s*0.01, 0, Math.PI*2); ctx.fill();
  // Mouth line
  ctx.strokeStyle = '#6b4226'; ctx.lineWidth = s * 0.01;
  ctx.beginPath(); ctx.moveTo(s*0.58,-s*0.035); ctx.lineTo(s*0.58, s*0.0); ctx.stroke();
  // Tongue if happy
  if (hunger > 50 && !sleeping) {
    ctx.fillStyle = '#ff7b9c';
    ctx.beginPath(); ctx.ellipse(s*0.58, s*0.04, s*0.03, s*0.055, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#e06080'; ctx.lineWidth = s*0.006;
    ctx.beginPath(); ctx.moveTo(s*0.58, s*0.01); ctx.lineTo(s*0.58, s*0.07); ctx.stroke();
  }
  // Collar
  ctx.strokeStyle = collarColor; ctx.lineWidth = s * 0.035;
  ctx.beginPath(); ctx.arc(s*0.35, -s*0.02, s*0.2, 0.3, Math.PI - 0.3); ctx.stroke();
  // Collar tag
  ctx.fillStyle = '#ffd700';
  ctx.beginPath(); ctx.arc(s*0.35, s*0.16, s*0.025, 0, Math.PI*2); ctx.fill();
  if (!sleeping) drawPetLegs(ctx, s, lp, moving, bodyColor);
}
