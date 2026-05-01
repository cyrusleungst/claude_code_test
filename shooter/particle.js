import { randomRange, randomChoice } from './utils.js';

class Particle {
  constructor(x, y, vx, vy, color, radius, lifetime) {
    this.x = x; this.y = y;
    this.vx = vx; this.vy = vy;
    this.color = color;
    this.radius = radius;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.dead = false;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.88;
    this.vy *= 0.88;
    this.lifetime -= dt;
    if (this.lifetime <= 0) this.dead = true;
  }

  draw(ctx) {
    const alpha = Math.pow(Math.max(0, this.lifetime / this.maxLifetime), 0.6);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    const s = Math.ceil(this.radius);
    ctx.fillRect(Math.round(this.x) - s, Math.round(this.y) - s, s * 2, s * 2);
    ctx.globalAlpha = 1;
  }
}

export class ParticleSystem {
  constructor() {
    this.underlayParticles = [];
    this.overlayParticles  = [];
  }

  emit(type, x, y, angle = 0) {
    switch (type) {
      case 'muzzleFlash': {
        for (let i = 0; i < 8; i++) {
          const spread = (Math.random() - 0.5) * 0.8;
          const a = angle + spread;
          const spd = randomRange(60, 180);
          const color = randomChoice(['#ffff44', '#ffcc00', '#ff8800', '#ffffff']);
          const p = new Particle(x, y, Math.cos(a) * spd, Math.sin(a) * spd, color, randomRange(2, 4), randomRange(0.04, 0.09));
          this.overlayParticles.push(p);
        }
        break;
      }
      case 'hitSpark': {
        for (let i = 0; i < 6; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = randomRange(40, 140);
          const color = randomChoice(['#ffffff', '#ffff88', '#ffdd00']);
          const p = new Particle(x, y, Math.cos(a) * spd, Math.sin(a) * spd, color, randomRange(2, 3), randomRange(0.1, 0.2));
          this.underlayParticles.push(p);
        }
        break;
      }
      case 'explosion': {
        for (let i = 0; i < 22; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = randomRange(30, 200);
          const color = randomChoice(['#ff4400', '#ff8800', '#ffcc00', '#ffffff', '#ff2200']);
          const p = new Particle(x, y, Math.cos(a) * spd, Math.sin(a) * spd, color, randomRange(3, 7), randomRange(0.35, 0.85));
          this.underlayParticles.push(p);
        }
        break;
      }
      case 'blood': {
        for (let i = 0; i < 14; i++) {
          const a = Math.random() * Math.PI * 2;
          const spd = randomRange(25, 110);
          const color = randomChoice(['#cc0000', '#990000', '#ff2222', '#660000']);
          const p = new Particle(x, y, Math.cos(a) * spd, Math.sin(a) * spd, color, randomRange(2, 4), randomRange(0.2, 0.45));
          this.underlayParticles.push(p);
        }
        break;
      }
    }
  }

  update(dt) {
    for (const p of this.underlayParticles) p.update(dt);
    for (const p of this.overlayParticles)  p.update(dt);
    this.underlayParticles = this.underlayParticles.filter(p => !p.dead);
    this.overlayParticles  = this.overlayParticles.filter(p => !p.dead);
  }

  drawUnder(ctx) {
    for (const p of this.underlayParticles) p.draw(ctx);
  }

  drawOver(ctx) {
    for (const p of this.overlayParticles) p.draw(ctx);
  }
}
