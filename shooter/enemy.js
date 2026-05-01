import { ENEMY_DEFS, CANVAS_W, CANVAS_H } from './constants.js';
import { randomRange, randomChoice } from './utils.js';

export class Enemy {
  constructor(x, y, type, speedMultiplier = 1) {
    const def = ENEMY_DEFS[type];
    this.x = x; this.y = y;
    this.type = type;
    this.radius = def.radius;
    this.speed = def.speed * speedMultiplier;
    this.hp = def.hp;
    this.maxHp = def.maxHp;
    this.scoreValue = def.scoreValue;
    this.color = def.color;
    this.accentColor = def.accentColor;
    this.hitFlashTimer = 0;
    this.dead = false;
    this.moveAngle = 0;
    this._spinAngle = Math.random() * Math.PI * 2;
  }

  update(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    this.moveAngle = Math.atan2(dy, dx);
    this.x += Math.cos(this.moveAngle) * this.speed * dt;
    this.y += Math.sin(this.moveAngle) * this.speed * dt;
    this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
    if (this.type === 'grunt') this._spinAngle += dt * 2.2;
  }

  takeDamage(amount, particles) {
    this.hp -= amount;
    this.hitFlashTimer = 0.1;
    if (this.hp <= 0) {
      this.dead = true;
      particles.emit('explosion', this.x, this.y);
    } else {
      particles.emit('hitSpark', this.x, this.y);
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const flash = this.hitFlashTimer > 0;

    if (this.type === 'grunt') {
      this._drawGrunt(ctx, flash);
    } else if (this.type === 'tank') {
      this._drawTank(ctx, flash);
    } else if (this.type === 'speeder') {
      this._drawSpeeder(ctx, flash);
    }

    ctx.restore();
  }

  _drawGrunt(ctx, flash) {
    ctx.rotate(this._spinAngle);
    ctx.fillStyle = flash ? '#ffffff' : this.color;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(14, 0);
    ctx.lineTo(0, 14);  ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = flash ? '#ffaaaa' : this.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(7, 0);
    ctx.lineTo(0, 7);  ctx.lineTo(-7, 0);
    ctx.closePath();
    ctx.fill();
    // Eye dot
    ctx.fillStyle = '#ff8888';
    ctx.fillRect(-2, -2, 4, 4);
  }

  _drawTank(ctx, flash) {
    ctx.fillStyle = flash ? '#ffffff' : this.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const r = 22;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else         ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = flash ? '#aaaaff' : this.accentColor;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const r = 12;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else         ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Center dot
    ctx.fillStyle = flash ? '#ffffff' : '#8888ff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // HP bar above
    const barW = 44, barH = 5;
    ctx.fillStyle = '#111';
    ctx.fillRect(-barW / 2, -32, barW, barH);
    const ratio = this.hp / this.maxHp;
    ctx.fillStyle = ratio > 0.5 ? '#44ff44' : ratio > 0.25 ? '#ffaa00' : '#ff3333';
    ctx.fillRect(-barW / 2, -32, barW * ratio, barH);
  }

  _drawSpeeder(ctx, flash) {
    ctx.rotate(this.moveAngle);
    ctx.fillStyle = flash ? '#ffffff' : this.color;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -9);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-8, 9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = flash ? '#ffffaa' : this.accentColor;
    ctx.fillRect(-5, -2, 11, 4);
    // Engine glow
    ctx.fillStyle = flash ? '#ffffff' : '#ff6600';
    ctx.beginPath();
    ctx.arc(-8, 0, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function spawnEnemy(type, canvasW, canvasH, speedMultiplier) {
  const edge = Math.floor(Math.random() * 4);
  let x, y;
  const pad = 30;
  if (edge === 0) { x = Math.random() * canvasW; y = -pad; }
  else if (edge === 1) { x = canvasW + pad; y = Math.random() * canvasH; }
  else if (edge === 2) { x = Math.random() * canvasW; y = canvasH + pad; }
  else                 { x = -pad; y = Math.random() * canvasH; }
  return new Enemy(x, y, type, speedMultiplier);
}
