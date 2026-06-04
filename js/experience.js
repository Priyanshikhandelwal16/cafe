/**
 * L'AMBROISIE — Cafe Atmosphere Overlay v4
 * Lightweight particle system on top of real cafe photo background.
 * Renders coffee aroma particles + steam puffs + floating dust.
 * Canvas is transparent, placed OVER the hero photo.
 */

class CafeAtmosphere {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.particles = [];
    this.steamPuffs = [];
    this.beans = [];
    this.width  = window.innerWidth;
    this.height = window.innerHeight;
    this.init();
  }

  init() {
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width  = this.width;
    this.canvas.height = this.height;

    this.spawnParticles();
    this.spawnSteam();
    this.spawnBeans();
    this.tick();

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.width  = this.canvas.width  = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
      }, 150);
    });
  }

  spawnParticles() {
    for (let i = 0; i < 55; i++) {
      this.particles.push({
        x:     Math.random() * this.width,
        y:     Math.random() * this.height,
        r:     0.8 + Math.random() * 2.2,
        vx:    (Math.random() - 0.5) * 0.3,
        vy:    -(0.18 + Math.random() * 0.45),
        alpha: 0.0,
        maxAlpha: 0.35 + Math.random() * 0.45,
        life:  Math.random(),
        speed: 0.0008 + Math.random() * 0.0015,
        hue:   28 + Math.floor(Math.random() * 20),
        sat:   70 + Math.floor(Math.random() * 30),
        lit:   65 + Math.floor(Math.random() * 25),
        drift: Math.random() * Math.PI * 2,
      });
    }
  }

  spawnSteam() {
    const steamSources = [
      { x: 0.28, y: 0.75 },
      { x: 0.5,  y: 0.8  },
      { x: 0.72, y: 0.77 },
    ];
    steamSources.forEach(src => {
      for (let i = 0; i < 6; i++) {
        this.steamPuffs.push({
          srcX: src.x,
          srcY: src.y,
          x:    src.x * this.width + (Math.random() - 0.5) * 30,
          y:    src.y * this.height,
          r:    4 + Math.random() * 8,
          vy:   -(0.3 + Math.random() * 0.6),
          vx:   (Math.random() - 0.5) * 0.2,
          alpha: 0,
          life:  Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          scaleGrowth: 0.008 + Math.random() * 0.012,
          drift: Math.random() * Math.PI * 2,
        });
      }
    });
  }

  spawnBeans() {
    const beanCount = 15; // Subtle floating tumbling coffee beans
    for (let i = 0; i < beanCount; i++) {
      this.beans.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        baseW: 8 + Math.random() * 5,
        baseH: 12 + Math.random() * 6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.25 + Math.random() * 0.4),
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.016,
        angle3D: Math.random() * Math.PI * 2,
        rotSpeed3D: 0.007 + Math.random() * 0.018,
        alpha: 0,
        life: Math.random(),
        speed: 0.0006 + Math.random() * 0.0008,
      });
    }
  }

  drawCoffeeBean(ctx, b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(b.angle);

    // Simulate 3D tumble rotation by scaling the width of the bean
    const tumbleScaleX = Math.cos(b.angle3D);
    const tumbleScaleY = 0.95 + Math.sin(b.angle3D * 1.5) * 0.05;
    ctx.scale(tumbleScaleX, tumbleScaleY);

    const w = b.baseW;
    const h = b.baseH;
    const isBack = tumbleScaleX < 0;

    // Outer shade/gradient to look 3D spherical
    const grad = ctx.createRadialGradient(-w * 0.15, -h * 0.15, w * 0.1, 0, 0, h * 0.9);
    if (!isBack) {
      grad.addColorStop(0, `rgba(139, 90, 43, ${b.alpha})`);  // Light roast
      grad.addColorStop(0.5, `rgba(90, 50, 20, ${b.alpha})`); // Roasted brown
      grad.addColorStop(1, `rgba(42, 18, 5, ${b.alpha})`);    // Espresso outline
    } else {
      grad.addColorStop(0, `rgba(105, 63, 31, ${b.alpha})`);  // Back side shade
      grad.addColorStop(0.7, `rgba(70, 35, 12, ${b.alpha})`);
      grad.addColorStop(1, `rgba(30, 10, 2, ${b.alpha})`);
    }

    ctx.beginPath();
    if (ctx.ellipse) {
      ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(0, 0, w, 0, Math.PI * 2);
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle glossy reflection highlight
    const gloss = ctx.createLinearGradient(-w * 0.5, -h * 0.5, w * 0.5, h * 0.5);
    gloss.addColorStop(0, `rgba(255, 235, 210, ${b.alpha * 0.16})`);
    gloss.addColorStop(0.45, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = gloss;
    ctx.fill();

    // Draw the curved center crease line down the bean
    ctx.beginPath();
    const creaseShift = Math.sin(b.angle3D * 1.8) * (w * 0.16);
    ctx.moveTo(creaseShift, -h * 0.9);
    ctx.quadraticCurveTo(
      creaseShift - w * 0.22, 0,
      creaseShift, h * 0.9
    );
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(22, 8, 2, ${b.alpha * 0.8})`;
    ctx.stroke();

    // Crease highlight for depth
    ctx.beginPath();
    ctx.moveTo(creaseShift + 0.8, -h * 0.85);
    ctx.quadraticCurveTo(
      creaseShift - w * 0.22 + 0.8, 0,
      creaseShift + 0.8, h * 0.85
    );
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = `rgba(190, 140, 90, ${b.alpha * 0.38})`;
    ctx.stroke();

    ctx.restore();
  }

  tick() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const t = performance.now() * 0.001;

    // ── Steam puffs ──
    this.steamPuffs.forEach(p => {
      p.life += p.speed;
      if (p.life > 1) {
        p.life = 0;
        p.x = p.srcX * this.width + (Math.random() - 0.5) * 28;
        p.y = p.srcY * this.height;
        p.r = 4 + Math.random() * 8;
      }
      p.x += p.vx + Math.sin(t * 0.4 + p.drift) * 0.18;
      p.y += p.vy;
      p.r += p.scaleGrowth;

      if (p.life < 0.3) {
        p.alpha = (p.life / 0.3) * 0.18;
      } else if (p.life < 0.7) {
        p.alpha = 0.18;
      } else {
        p.alpha = ((1 - p.life) / 0.3) * 0.18;
      }

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grad.addColorStop(0, `rgba(255,252,248,${p.alpha})`);
      grad.addColorStop(1, `rgba(255,252,248,0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // ── Aroma / dust particles ──
    this.particles.forEach(p => {
      p.life += p.speed;
      if (p.life > 1) {
        p.life = 0;
        p.x = Math.random() * this.width;
        p.y = this.height + 10;
        p.drift = Math.random() * Math.PI * 2;
      }

      p.x += p.vx + Math.sin(t * 0.3 + p.drift) * 0.25;
      p.y += p.vy;

      const lc = p.life;
      if (lc < 0.15) {
        p.alpha = (lc / 0.15) * p.maxAlpha;
      } else if (lc < 0.75) {
        p.alpha = p.maxAlpha;
      } else {
        p.alpha = ((1 - lc) / 0.25) * p.maxAlpha;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.lit}%, ${p.alpha})`;
      ctx.fill();
    });

    // ── Floating 3D Coffee Beans ──
    this.beans.forEach(b => {
      b.life += b.speed;
      if (b.life > 1) {
        b.life = 0;
        b.x = Math.random() * this.width;
        b.y = this.height + 20;
        b.angle = Math.random() * Math.PI * 2;
        b.angle3D = Math.random() * Math.PI * 2;
        b.vx = (Math.random() - 0.5) * 0.35;
        b.vy = -(0.25 + Math.random() * 0.4);
      }

      b.x += b.vx + Math.sin(t * 0.2 + b.angle) * 0.18;
      b.y += b.vy;
      b.angle += b.rotSpeed;
      b.angle3D += b.rotSpeed3D;

      const lc = b.life;
      if (lc < 0.15) {
        b.alpha = (lc / 0.15) * 0.65;
      } else if (lc < 0.8) {
        b.alpha = 0.65;
      } else {
        b.alpha = ((1 - lc) / 0.2) * 0.65;
      }

      this.drawCoffeeBean(ctx, b);
    });

    requestAnimationFrame(() => this.tick());
  }
}

// Initialize after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new CafeAtmosphere('hero-canvas');
});
