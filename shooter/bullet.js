import { BULLET_SPEED } from './constants.js';

export class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * BULLET_SPEED;
    this.vy = Math.sin(angle) * BULLET_SPEED;
    this.radius = 4;
    this.dead = false;
    this.lifetime = 0;
    this.maxLifetime = 1.8;
    this.angle = angle;
  }

  update(dt, canvasW, canvasH) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.lifetime += dt;
    if (
      this.lifetime > this.maxLifetime ||
      this.x < -20 || this.x > canvasW + 20 ||
      this.y < -20 || this.y > canvasH + 20
    ) {
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    const age = Math.min(this.lifetime * 12, 1);
    ctx.globalAlpha = age;

    // Trail
    ctx.fillStyle = '#cc8800';
    ctx.fillRect(-14, -1, 14, 2);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(-10, -1.5, 8, 3);

    // Head
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffff88';
    ctx.beginPath();
    ctx.arc(0, 0, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
