    /* ═══════════════════════════════
       8. WEATHER / SEASON EFFECTS
       ═══════════════════════════════ */
    let weatherParticles = [];
    let currentWeather = 'clear';

    function getWeatherForDate() {
      const now = new Date();
      const month = now.getMonth(); // 0-11
      const day = now.getDate();
      // Season-based weather
      if (month === 11 || month === 0 || month === 1) {
        // Winter: snow
        return (day % 3 === 0) ? 'snow' : 'snow'; // always snow in winter
      } else if (month >= 2 && month <= 4) {
        // Spring: rain or cherry blossoms
        return (day % 2 === 0) ? 'rain' : 'petals';
      } else if (month >= 5 && month <= 7) {
        // Summer: clear with fireflies at night, or sunny sparkles
        const hr = now.getHours();
        return (hr >= 19 || hr < 6) ? 'fireflies' : 'sunny';
      } else {
        // Autumn: falling leaves
        return 'leaves';
      }
    }

    function initWeatherParticles(weather, count) {
      weatherParticles = [];
      for (let i = 0; i < count; i++) {
        weatherParticles.push({
          x: Math.random(), y: Math.random(),
          speed: 0.0005 + Math.random() * 0.002,
          size: 2 + Math.random() * 4,
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI * 2,
          type: weather
        });
      }
    }

    function drawWeatherEffects(ctx, rw, rh, winX, winY, winW, winH, t) {
      if (!weatherParticles.length) return;
      ctx.save();
      // Clip to window area
      ctx.beginPath();
      ctx.rect(winX, winY, winW, winH);
      ctx.clip();

      weatherParticles.forEach(p => {
        const weather = p.type;
        const px = winX + p.x * winW;
        let py = winY + p.y * winH;

        if (weather === 'snow') {
          p.y += p.speed;
          p.x += Math.sin(t / 2000 + p.phase) * 0.0003;
          if (p.y > 1) { p.y = -0.05; p.x = Math.random(); }
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI*2); ctx.fill();
        } else if (weather === 'rain') {
          p.y += p.speed * 3;
          if (p.y > 1) { p.y = -0.05; p.x = Math.random(); }
          ctx.strokeStyle = 'rgba(180,200,255,0.5)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 1, py + p.size * 3); ctx.stroke();
        } else if (weather === 'petals') {
          p.y += p.speed * 0.8;
          p.x += Math.sin(t / 1500 + p.phase) * 0.0005;
          p.rot += 0.02;
          if (p.y > 1) { p.y = -0.05; p.x = Math.random(); }
          ctx.save(); ctx.translate(px, py); ctx.rotate(p.rot);
          ctx.fillStyle = 'rgba(255,183,197,0.7)';
          ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        } else if (weather === 'leaves') {
          p.y += p.speed * 0.7;
          p.x += Math.sin(t / 1800 + p.phase) * 0.0008;
          p.rot += 0.015;
          if (p.y > 1) { p.y = -0.05; p.x = Math.random(); }
          const colors = ['#d4762c','#c0392b','#e67e22','#f39c12','#8e5828'];
          ctx.save(); ctx.translate(px, py); ctx.rotate(p.rot);
          ctx.fillStyle = colors[Math.floor(p.phase * 10) % colors.length];
          ctx.beginPath();
          ctx.moveTo(0, -p.size); ctx.quadraticCurveTo(p.size, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size, 0, 0, -p.size); ctx.fill();
          ctx.restore();
        } else if (weather === 'fireflies') {
          const glow = 0.4 + Math.sin(t / 500 + p.phase) * 0.4;
          p.x += Math.sin(t / 3000 + p.phase) * 0.0003;
          p.y += Math.cos(t / 2500 + p.phase * 2) * 0.0002;
          if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
          ctx.fillStyle = 'rgba(255,255,100,' + glow + ')';
          ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,100,' + glow * 0.3 + ')';
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI*2); ctx.fill();
        } else if (weather === 'sunny') {
          const sparkle = Math.sin(t / 300 + p.phase * 10);
          if (sparkle > 0.7) {
            ctx.fillStyle = 'rgba(255,255,200,' + (sparkle - 0.7) * 2 + ')';
            ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI*2); ctx.fill();
          }
        }
      });
      ctx.restore();
    }

