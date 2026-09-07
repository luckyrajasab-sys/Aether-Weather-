import React, { useEffect, useRef } from 'react';
import { getBackgroundMeta } from '../utils/weatherBackground';
import { WEATHER_THEMES } from '../utils/weatherColors';

export const WeatherBackground = ({
  location,
  weatherGroup = 'clear',
  isDay = 1,
  isDarkMode = false,
  windSpeed = 15
}) => {
  const canvasRef = useRef(null);
  const theme = WEATHER_THEMES[weatherGroup] || WEATHER_THEMES.clear;
  const bgMeta = getBackgroundMeta(location, weatherGroup, isDay);

  // Set CSS Root variables dynamically for smooth theme blending
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--glow-color', theme.glowColor);
    root.style.setProperty('--bg-gradient', theme.gradient);
    root.style.setProperty('--glass-bg', isDarkMode ? 'rgba(10, 15, 26, 0.65)' : 'rgba(15, 23, 42, 0.55)');
    root.style.setProperty('--glass-bg-hover', isDarkMode ? 'rgba(15, 23, 42, 0.78)' : 'rgba(30, 41, 59, 0.68)');
    root.style.setProperty('--glass-border', isDarkMode ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.25)');
  }, [theme, isDarkMode]);

  // Dynamic Multi-Atmosphere Particle & Canvas Shader Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleType = theme.particleType || 'sun-rays';

    // 1. Rain / Storm Drop Particles
    const rainDrops = [];
    const rainCount = particleType === 'storm' ? 150 : particleType === 'rain' ? 110 : 0;
    for (let i = 0; i < rainCount; i++) {
      rainDrops.push({
        x: Math.random() * (width + 200) - 100,
        y: Math.random() * height,
        speedX: particleType === 'storm' ? -3.5 : -1.2,
        speedY: particleType === 'storm' ? Math.random() * 16 + 18 : Math.random() * 12 + 12,
        length: particleType === 'storm' ? Math.random() * 26 + 18 : Math.random() * 18 + 12,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    // 2. Snowflakes
    const snowFlakes = [];
    const snowCount = particleType === 'snow' ? 90 : 0;
    for (let i = 0; i < snowCount; i++) {
      snowFlakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1.2,
        speedY: Math.random() * 1.6 + 0.8,
        speedX: Math.random() * 0.8 - 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    // 3. Stars & Meteors
    const stars = [];
    const starCount = !isDay || particleType === 'stars' ? 120 : 0;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.8),
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.008
      });
    }
    let shootingStar = null;

    // 4. Volumetric Fog & Mist Masses
    const fogBanks = [];
    if (particleType === 'mist' || weatherGroup === 'fog') {
      for (let i = 0; i < 7; i++) {
        fogBanks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radiusX: Math.random() * 280 + 220,
          radiusY: Math.random() * 140 + 100,
          speedX: Math.random() * 0.4 + 0.15,
          opacity: Math.random() * 0.08 + 0.04,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.005
        });
      }
    }

    // 5. Wind Gust Streamlines & Drifting Motes
    const windStreaks = [];
    const isWindy = windSpeed > 14 || weatherGroup === 'windy';
    if (isWindy || weatherGroup === 'cloudy' || weatherGroup === 'clear') {
      for (let i = 0; i < 8; i++) {
        windStreaks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 240 + 160,
          speed: Math.random() * 4 + 3.5,
          amplitude: Math.random() * 20 + 10,
          frequency: Math.random() * 0.01 + 0.005,
          opacity: Math.random() * 0.18 + 0.08,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    const windMotes = [];
    for (let i = 0; i < 35; i++) {
      windMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: Math.random() * 2.5 + 1.2,
        speedY: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    // 6. Thunderstorm Lightning Generator
    let lightningFlash = 0;
    let lightningBolt = null;

    const generateLightning = () => {
      const startX = Math.random() * (width * 0.7) + width * 0.15;
      const points = [{ x: startX, y: 0 }];
      let curX = startX;
      let curY = 0;
      const segments = Math.floor(Math.random() * 6) + 7;
      const stepY = (height * 0.75) / segments;

      for (let s = 0; s < segments; s++) {
        curY += stepY + (Math.random() - 0.5) * 20;
        curX += (Math.random() - 0.5) * 80;
        points.push({ x: curX, y: curY });
      }

      // Branching fork
      const branches = [];
      if (points.length > 4) {
        const branchStart = points[Math.floor(points.length / 2)];
        let bX = branchStart.x;
        let bY = branchStart.y;
        const bPoints = [{ x: bX, y: bY }];
        for (let b = 0; b < 4; b++) {
          bY += 35 + Math.random() * 20;
          bX += (Math.random() - 0.2) * 55;
          bPoints.push({ x: bX, y: bY });
        }
        branches.push(bPoints);
      }

      return { points, branches, life: 1 };
    };

    // Sun Rays / God Rays
    let sunAngle = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // A. SUNNY GOD RAYS & SOLAR DUST MOTES
      // ==========================================
      if (isDay && (particleType === 'sun-rays' || weatherGroup === 'clear')) {
        sunAngle += 0.003;
        const sunCenterX = width * 0.85;
        const sunCenterY = height * 0.12;

        // Rotating Sunlight Sweep Cones
        for (let r = 0; r < 5; r++) {
          const rayAngle = sunAngle + (r * Math.PI) / 2.5;
          const rayGrad = ctx.createRadialGradient(
            sunCenterX,
            sunCenterY,
            10,
            sunCenterX + Math.cos(rayAngle) * width * 0.9,
            sunCenterY + Math.sin(rayAngle) * height * 0.9,
            width * 0.7
          );
          rayGrad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
          rayGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.03)');
          rayGrad.addColorStop(1, 'transparent');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.arc(sunCenterX, sunCenterY, Math.max(width, height), rayAngle - 0.18, rayAngle + 0.18);
          ctx.lineTo(sunCenterX, sunCenterY);
          ctx.fill();
        }
      }

      // ==========================================
      // B. VOLUMETRIC FOG & MIST UNDULATION
      // ==========================================
      if (fogBanks.length > 0) {
        for (let fog of fogBanks) {
          fog.pulse += fog.pulseSpeed;
          const pulseFactor = 1 + Math.sin(fog.pulse) * 0.12;

          ctx.save();
          ctx.beginPath();
          const grad = ctx.createRadialGradient(
            fog.x,
            fog.y,
            20,
            fog.x,
            fog.y,
            fog.radiusX * pulseFactor
          );
          grad.addColorStop(0, `rgba(203, 213, 225, ${fog.opacity * 1.3})`);
          grad.addColorStop(0.6, `rgba(148, 163, 184, ${fog.opacity * 0.7})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.ellipse(fog.x, fog.y, fog.radiusX * pulseFactor, fog.radiusY * pulseFactor, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          fog.x += fog.speedX;
          if (fog.x - fog.radiusX > width) {
            fog.x = -fog.radiusX;
            fog.y = Math.random() * height;
          }
        }
      }

      // ==========================================
      // C. WIND STREAMLINES & GUST CURVES
      // ==========================================
      if (windStreaks.length > 0) {
        for (let s of windStreaks) {
          s.phase += 0.03;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);

          for (let p = 0; p < s.length; p += 20) {
            const waveY = s.y + Math.sin(s.phase + p * s.frequency) * s.amplitude;
            ctx.lineTo(s.x + p, waveY);
          }

          const streakGrad = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y);
          streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          streakGrad.addColorStop(0.5, `rgba(255, 255, 255, ${s.opacity})`);
          streakGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          s.x += s.speed;
          if (s.x > width + s.length) {
            s.x = -s.length;
            s.y = Math.random() * height;
          }
        }

        // Drifting Motes in Wind
        for (let m of windMotes) {
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
          ctx.fill();

          m.x += m.speedX;
          m.y += m.speedY;

          if (m.x > width) m.x = 0;
          if (m.y > height) m.y = 0;
          if (m.y < 0) m.y = height;
        }
      }

      // ==========================================
      // D. THUNDERSTORM & BRANCHING LIGHTNING
      // ==========================================
      if (particleType === 'storm') {
        if (Math.random() < 0.008 && !lightningBolt) {
          lightningBolt = generateLightning();
          lightningFlash = 0.65;
        }

        // Ambient Screen Lightning Flash
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(235, 220, 255, ${lightningFlash * 0.4})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash -= 0.06;
        }

        // Draw Branching Lightning Bolt
        if (lightningBolt) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 255, 255, ${lightningBolt.life})`;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 18;
          ctx.shadowColor = '#C084FC';

          // Trunk
          ctx.beginPath();
          ctx.moveTo(lightningBolt.points[0].x, lightningBolt.points[0].y);
          for (let pt of lightningBolt.points) {
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          // Forks
          for (let branch of lightningBolt.branches) {
            ctx.beginPath();
            ctx.moveTo(branch[0].x, branch[0].y);
            for (let bpt of branch) {
              ctx.lineTo(bpt.x, bpt.y);
            }
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }

          ctx.restore();
          lightningBolt.life -= 0.12;
          if (lightningBolt.life <= 0) lightningBolt = null;
        }
      }

      // ==========================================
      // E. RAIN DROPS & SPLASH RIPPLES
      // ==========================================
      if (rainDrops.length > 0) {
        for (let drop of rainDrops) {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.speedX * 2, drop.y + drop.length);
          ctx.strokeStyle = particleType === 'storm'
            ? `rgba(192, 215, 255, ${drop.opacity})`
            : `rgba(215, 240, 255, ${drop.opacity})`;
          ctx.lineWidth = particleType === 'storm' ? 1.6 : 1.3;
          ctx.stroke();

          drop.y += drop.speedY;
          drop.x += drop.speedX;

          if (drop.y > height) {
            drop.y = -drop.length;
            drop.x = Math.random() * (width + 200) - 100;
          }
        }
      }

      // ==========================================
      // F. CRYSTALLINE SNOWFLAKES
      // ==========================================
      if (snowFlakes.length > 0) {
        for (let flake of snowFlakes) {
          flake.wobble += flake.wobbleSpeed;
          flake.y += flake.speedY;
          flake.x += Math.sin(flake.wobble) * 0.9 + flake.speedX;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#FFFFFF';
          ctx.fill();

          if (flake.y > height) {
            flake.y = -6;
            flake.x = Math.random() * width;
          }
        }
      }

      // ==========================================
      // G. NIGHT STARFIELD & SHOOTING METEORS
      // ==========================================
      if (stars.length > 0) {
        for (let star of stars) {
          star.opacity += star.twinkleSpeed;
          if (star.opacity > 0.95 || star.opacity < 0.2) star.twinkleSpeed = -star.twinkleSpeed;

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.opacity)})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#C7D2FE';
          ctx.fill();
        }

        // Shooting Star
        if (!shootingStar && Math.random() < 0.005) {
          shootingStar = {
            x: Math.random() * (width * 0.7) + width * 0.2,
            y: Math.random() * (height * 0.3),
            len: Math.random() * 90 + 60,
            speed: Math.random() * 12 + 14,
            opacity: 1
          };
        }

        if (shootingStar) {
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x - shootingStar.len, shootingStar.y + shootingStar.len * 0.6);

          const meteorGrad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.len,
            shootingStar.y + shootingStar.len * 0.6
          );
          meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
          meteorGrad.addColorStop(1, 'transparent');

          ctx.strokeStyle = meteorGrad;
          ctx.lineWidth = 2.2;
          ctx.stroke();

          shootingStar.x -= shootingStar.speed;
          shootingStar.y += shootingStar.speed * 0.6;
          shootingStar.opacity -= 0.025;

          if (shootingStar.opacity <= 0 || shootingStar.x < 0 || shootingStar.y > height) {
            shootingStar = null;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme.particleType, weatherGroup, isDay, windSpeed]);

  return (
    <div className="weather-bg-container">
      {/* High-Resolution Clear Background Image */}
      <img
        src={bgMeta.heroImage}
        alt={bgMeta.title}
        className="weather-bg-image"
      />
      <div className="weather-bg-gradient" />
      <div className="weather-bg-overlay" />
      <canvas ref={canvasRef} className="weather-canvas-particles" />
    </div>
  );
};

export default WeatherBackground;
