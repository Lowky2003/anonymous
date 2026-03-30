/* ── Cat (Grey Tabby Style) ── */

// Sleeping closed-curve eyes
function drawCatSleepEyes(ctx, s, x1, y1, x2, y2) {
  ctx.save();
  ctx.strokeStyle = '#444'; ctx.lineWidth = s*0.016; ctx.lineCap = 'round';
  [x1, x2].forEach(ex => {
    ctx.beginPath();
    ctx.moveTo(ex - s*0.032, y1 + s*0.004);
    ctx.quadraticCurveTo(ex, y1 - s*0.028, ex + s*0.032, y1 + s*0.004);
    ctx.stroke();
  });
  ctx.font = `${s*0.065}px "Segoe UI Emoji"`;
  ctx.shadowBlur = 0;
  ctx.fillText("\uD83D\uDCA4", x2 + s*0.03, y1 - s*0.055);
  ctx.restore();
}

// Round green eye with dark pupil
function drawCatExpressiveEye(ctx, s, cx, cy, hungerVal) {
  // White sclera
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(cx, cy, s*0.042, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#555'; ctx.lineWidth = s*0.007; ctx.stroke();
  // Iris - green (or hunger-shifted amber)
  const irisColor = hungerVal < 25 ? '#c0a020' : '#4CAF50';
  ctx.fillStyle = irisColor;
  ctx.beginPath(); ctx.arc(cx, cy, s*0.03, 0, Math.PI*2); ctx.fill();
  // Pupil
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.arc(cx, cy, s*0.016, 0, Math.PI*2); ctx.fill();
  // Glint
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.arc(cx - s*0.012, cy - s*0.012, s*0.008, 0, Math.PI*2); ctx.fill();
}

// Tail with white tip and ring stripes
function drawCatFluffyTail(ctx, s, bodyColor, stripeColor) {
  ctx.save();
  ctx.strokeStyle = bodyColor; ctx.lineWidth = s*0.09; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s*0.4, s*0.05);
  ctx.quadraticCurveTo(-s*0.68, -s*0.1, -s*0.55, -s*0.46);
  ctx.stroke();
  // White tail tip
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.ellipse(-s*0.57, -s*0.49, s*0.068, s*0.08, -0.25, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#cccccc'; ctx.lineWidth = s*0.007; ctx.stroke();
  // Ring stripes
  ctx.strokeStyle = stripeColor; ctx.lineWidth = s*0.02;
  ctx.beginPath(); ctx.moveTo(-s*0.5,  -s*0.2);  ctx.lineTo(-s*0.62, -s*0.17); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-s*0.55, -s*0.34); ctx.lineTo(-s*0.64, -s*0.35); ctx.stroke();
  ctx.restore();
}

// Leg with white paw
function drawCatLeg(ctx, s, bx, by, anim, bodyColor) {
  // Upper limb
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(bx, by + s*0.07 + anim*0.5, s*0.065, s*0.1, 0.08, 0, Math.PI*2);
  ctx.fill();
  // Lower limb
  ctx.beginPath();
  ctx.ellipse(bx + s*0.012, by + s*0.2 + anim*0.3, s*0.05, s*0.085, 0.05, 0, Math.PI*2);
  ctx.fill();
  // White paw
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(bx + s*0.022, by + s*0.3 + anim*0.15, s*0.064, s*0.038, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = '#bbbbbb'; ctx.lineWidth = s*0.007; ctx.stroke();
  // Toe lines
  ctx.strokeStyle = '#888'; ctx.lineWidth = s*0.005; ctx.lineCap = 'round';
  for (let ti = -1; ti <= 1; ti++) {
    ctx.beginPath();
    ctx.moveTo(bx + s*0.022 + ti*s*0.018, by + s*0.274 + anim*0.15);
    ctx.lineTo(bx + s*0.022 + ti*s*0.022, by + s*0.34  + anim*0.15);
    ctx.stroke();
  }
}

// White wavy ruff / collar
function drawCatRuff(ctx, s, cx, cy) {
  ctx.save();
  ctx.fillStyle  = '#FFFFFF';
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth  = s * 0.01;
  ctx.shadowBlur = 0;
  const bw = s * 0.046;
  const startX = cx - bw * 5;
  ctx.beginPath();
  ctx.moveTo(startX, cy);
  for (let i = 0; i < 10; i++) {
    ctx.quadraticCurveTo(startX + i*bw + bw*0.5, cy + s*0.038, startX + (i+1)*bw, cy);
  }
  for (let i = 9; i >= 0; i--) {
    ctx.quadraticCurveTo(startX + i*bw + bw*0.5, cy - s*0.038, startX + i*bw, cy);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawCatPet(ctx, s, lp, moving, hunger, action, ap, t, pal) {
  const sleeping     = action === 'sleep' || action === 'nap';
  const bodyColor    = pal ? pal.body         : '#9E9E9E';
  const stripeColor  = pal ? pal.stripe       : '#616161';
  const innerEarColor= pal ? pal.inner        : '#F8BBD0';
  const bellyLight   = pal ? (pal.bellyLight  || '#E0E0E0') : '#E0E0E0';
  const noseColor    = pal ? (pal.nose        || '#FF80AB') : '#FF80AB';
  const tongueColor  = pal ? (pal.tongue      || '#FAA0A0') : '#FAA0A0';

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = s*0.02; ctx.shadowOffsetY = s*0.01;

  // ① TAIL – behind everything
  drawCatFluffyTail(ctx, s, bodyColor, stripeColor);

  // ② BACK LEGS
  const bl1 = moving ? Math.sin(lp*4 + 2.5) * s*0.04 : 0;
  const bl2 = moving ? Math.sin(lp*4 + 3.2) * s*0.04 : 0;
  drawCatLeg(ctx, s, -s*0.2,  s*0.18, bl1, bodyColor);
  drawCatLeg(ctx, s, -s*0.06, s*0.18, bl2, bodyColor);

  // ③ BODY
  const grad = ctx.createLinearGradient(-s*0.35, -s*0.1, s*0.3, s*0.32);
  grad.addColorStop(0, bodyColor); grad.addColorStop(1, bellyLight);
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(0, s*0.05, s*0.42, s*0.26, 0, 0, Math.PI*2); ctx.fill();
  // White belly
  ctx.fillStyle = bellyLight;
  ctx.beginPath(); ctx.ellipse(s*0.04, s*0.1, s*0.18, s*0.1, 0, 0, Math.PI*2); ctx.fill();
  // Tabby stripes
  ctx.strokeStyle = stripeColor; ctx.lineWidth = s*0.015;
  for (let i = 0; i < 3; i++) {
    const xo = -s*0.22 + i*s*0.2;
    ctx.beginPath();
    ctx.moveTo(xo, -s*0.12);
    ctx.quadraticCurveTo(xo + s*0.03, s*0.02, xo, s*0.2);
    ctx.stroke();
  }

  // ④ WHITE RUFF
  drawCatRuff(ctx, s, s*0.2, s*0.0);

  // ⑤ FRONT LEGS
  const fl1 = moving ? Math.sin(lp*4)       * s*0.04 : 0;
  const fl2 = moving ? Math.sin(lp*4 + 1.2) * s*0.04 : 0;
  drawCatLeg(ctx, s, s*0.16, s*0.18, fl1, bodyColor);
  drawCatLeg(ctx, s, s*0.3,  s*0.18, fl2, bodyColor);

  // ⑥ HEAD
  const hx = s*0.34, hy = -s*0.24;
  ctx.fillStyle = bodyColor; ctx.shadowBlur = s*0.015;
  // Head shape (matching reference – quadratic sides)
  ctx.beginPath();
  ctx.moveTo(hx - s*0.24, hy + s*0.06);
  ctx.quadraticCurveTo(hx - s*0.28, hy - s*0.14, hx - s*0.18, hy - s*0.28);
  ctx.lineTo(hx - s*0.08, hy - s*0.24);
  ctx.lineTo(hx,           hy - s*0.38);
  ctx.lineTo(hx + s*0.08, hy - s*0.24);
  ctx.lineTo(hx + s*0.18, hy - s*0.28);
  ctx.quadraticCurveTo(hx + s*0.28, hy - s*0.14, hx + s*0.24, hy + s*0.06);
  ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0;

  // ⑦ EARS with pink inner
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.moveTo(hx - s*0.14, hy - s*0.13);
  ctx.lineTo(hx - s*0.07, hy - s*0.44);
  ctx.lineTo(hx + s*0.03, hy - s*0.14);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx + s*0.04, hy - s*0.15);
  ctx.lineTo(hx + s*0.18, hy - s*0.45);
  ctx.lineTo(hx + s*0.25, hy - s*0.13);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = innerEarColor;
  ctx.beginPath();
  ctx.moveTo(hx - s*0.1,  hy - s*0.16);
  ctx.lineTo(hx - s*0.06, hy - s*0.37);
  ctx.lineTo(hx + s*0.01, hy - s*0.17);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx + s*0.07, hy - s*0.16);
  ctx.lineTo(hx + s*0.17, hy - s*0.38);
  ctx.lineTo(hx + s*0.21, hy - s*0.14);
  ctx.closePath(); ctx.fill();

  // Tabby stripe on head top
  ctx.fillStyle = stripeColor;
  ctx.beginPath();
  ctx.moveTo(hx - s*0.04, hy - s*0.34);
  ctx.lineTo(hx,           hy - s*0.26);
  ctx.lineTo(hx + s*0.04, hy - s*0.34);
  ctx.fill();
  // Cheek tabby marks
  ctx.beginPath();
  ctx.moveTo(hx - s*0.2, hy - s*0.04); ctx.lineTo(hx - s*0.12, hy - s*0.04); ctx.lineTo(hx - s*0.16, hy - s*0.01); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx + s*0.28, hy - s*0.04); ctx.lineTo(hx + s*0.2, hy - s*0.04); ctx.lineTo(hx + s*0.24, hy - s*0.01); ctx.fill();

  // ⑧ EYES
  const eyeLx = hx - s*0.08, eyeRx = hx + s*0.1, eyeY = hy - s*0.05;
  if (sleeping) {
    drawCatSleepEyes(ctx, s, eyeLx, eyeY, eyeRx, eyeY);
  } else {
    drawCatExpressiveEye(ctx, s, eyeLx, eyeY, hunger);
    drawCatExpressiveEye(ctx, s, eyeRx, eyeY, hunger);
  }

  // ⑨ MUZZLE – white circle
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(hx + s*0.04, hy + s*0.07, s*0.1, 0, Math.PI*2); ctx.fill();

  // Nose (round pink)
  const noseX = hx + s*0.04, noseY = hy + s*0.04;
  ctx.fillStyle = noseColor;
  ctx.beginPath(); ctx.arc(noseX, noseY, s*0.018, 0, Math.PI*2); ctx.fill();

  // Mouth (two arcs = W shape)
  ctx.strokeStyle = noseColor; ctx.lineWidth = s*0.009; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(noseX - s*0.02, noseY + s*0.017, s*0.018, 0, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(noseX + s*0.02, noseY + s*0.017, s*0.018, 0, Math.PI); ctx.stroke();

  // Whiskers – 3 per side
  ctx.strokeStyle = 'rgba(200,200,200,0.9)'; ctx.lineWidth = s*0.007; ctx.lineCap = 'round';
  const wby = noseY + s*0.01;
  ctx.beginPath(); ctx.moveTo(noseX - s*0.05, wby - s*0.02); ctx.lineTo(noseX - s*0.3,  wby - s*0.055); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(noseX - s*0.05, wby);          ctx.lineTo(noseX - s*0.3,  wby);           ctx.stroke();
  ctx.beginPath(); ctx.moveTo(noseX - s*0.05, wby + s*0.02); ctx.lineTo(noseX - s*0.3,  wby + s*0.042); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(noseX + s*0.08, wby - s*0.02); ctx.lineTo(noseX + s*0.33, wby - s*0.055); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(noseX + s*0.08, wby);          ctx.lineTo(noseX + s*0.33, wby);           ctx.stroke();
  ctx.beginPath(); ctx.moveTo(noseX + s*0.08, wby + s*0.02); ctx.lineTo(noseX + s*0.33, wby + s*0.042); ctx.stroke();

  // Tongue when hungry
  if (hunger < 30 && !sleeping) {
    ctx.fillStyle = tongueColor;
    ctx.beginPath(); ctx.ellipse(noseX, noseY + s*0.055, s*0.018, s*0.028, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#e07070'; ctx.lineWidth = s*0.006;
    ctx.beginPath(); ctx.moveTo(noseX, noseY + s*0.035); ctx.lineTo(noseX, noseY + s*0.074); ctx.stroke();
  }

  ctx.restore();

  // Sparkle when eating
  if (action === 'eat' && !sleeping) {
    ctx.fillStyle = '#ffffaa';
    ctx.beginPath(); ctx.arc(s*0.55, -s*0.42, s*0.018, 0, Math.PI*2); ctx.fill();
  }
}
