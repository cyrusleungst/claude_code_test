import {
  PLAYER_SPEED, PLAYER_SHOOT_RATE, PLAYER_INVINCIBLE_TIME,
  PLAYER_MAX_HP, PLAYER_LIVES, PLAYER_RADIUS,
  CANVAS_W, CANVAS_H,
} from './constants.js';
import { Bullet } from './bullet.js';
import { clamp } from './utils.js';

export class Player {
  constructor() {
    this.x = CANVAS_W / 2;
    this.y = CANVAS_H / 2;
    this.radius = PLAYER_RADIUS;
    this.speed = PLAYER_SPEED;
    this.aimAngle = 0;
    this.hp = PLAYER_MAX_HP;
    this.maxHp = PLAYER_MAX_HP;
    this.lives = PLAYER_LIVES;
    this.shootCooldown = 0;
    this.invincibleTimer = 0;
    this.muzzleFlashTimer = 0;
    this.score = 0;
    this.dead = false;
  }

  reset() {
    this.x = CANVAS_W / 2;
    this.y = CANVAS_H / 2;
    this.hp = PLAYER_MAX_HP;
    this.lives = PLAYER_LIVES;
    this.shootCooldown = 0;
    this.invincibleTimer = 0;
    this.muzzleFlashTimer = 0;
    this.score = 0;
    this.dead = false;
  }

  update(dt, input, bullets, particles) {
    const mv = input.getMovementVector();
    this.x = clamp(this.x + mv.x * this.speed * dt, this.radius, CANVAS_W - this.radius);
    this.y = clamp(this.y + mv.y * this.speed * dt, this.radius, CANVAS_H - this.radius);

    this.aimAngle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);

    this.shootCooldown   = Math.max(0, this.shootCooldown - dt);
    this.invincibleTimer = Math.max(0, this.invincibleTimer - dt);
    this.muzzleFlashTimer = Math.max(0, this.muzzleFlashTimer - dt);

    if ((input.mouse.leftDown || input.isDown('Space')) && this.shootCooldown <= 0) {
      this._shoot(bullets, particles);
    }
  }

  _shoot(bullets, particles) {
    this.shootCooldown = PLAYER_SHOOT_RATE;
    this.muzzleFlashTimer = 0.08;
    const tipX = this.x + Math.cos(this.aimAngle) * 22;
    const tipY = this.y + Math.sin(this.aimAngle) * 22;
    bullets.push(new Bullet(tipX, tipY, this.aimAngle));
    particles.emit('muzzleFlash', tipX, tipY, this.aimAngle);
  }

  takeDamage(amount, particles) {
    if (this.invincibleTimer > 0) return;
    this.hp -= amount;
    this.invincibleTimer = PLAYER_INVINCIBLE_TIME;
    particles.emit('blood', this.x, this.y);
    if (this.hp <= 0) {
      this.lives--;
      this.hp = this.maxHp;
      this.x = CANVAS_W / 2;
      this.y = CANVAS_H / 2;
      if (this.lives <= 0) this.dead = true;
    }
  }

  draw(ctx) {
    // Invincibility flicker
    if (this.invincibleTimer > 0 && Math.floor(Date.now() / 75) % 2 === 0) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(3, 5, 13, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body — teal square with highlights
    ctx.fillStyle = '#1a8a6e';
    ctx.fillRect(-11, -11, 22, 22);
    ctx.fillStyle = '#22b890';
    ctx.fillRect(-9, -9, 9, 9);
    ctx.fillStyle = '#0e5c4a';
    ctx.fillRect(0, 0, 9, 9);
    // Pixel detail
    ctx.fillStyle = '#0e5c4a';
    ctx.fillRect(-2, -2, 4, 4);

    // Gun arm rotates with aim
    ctx.rotate(this.aimAngle);
    ctx.fillStyle = '#444455';
    ctx.fillRect(2, -4, 12, 8);   // gun body
    ctx.fillStyle = '#2a2a38';
    ctx.fillRect(8, -3, 14, 6);   // barrel
    ctx.fillStyle = '#666677';
    ctx.fillRect(3, -2, 6, 4);    // grip highlight

    // Muzzle flash
    if (this.muzzleFlashTimer > 0) {
      const alpha = this.muzzleFlashTimer / 0.08;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffff44';
      ctx.beginPath();
      ctx.arc(23, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(23, -9); ctx.lineTo(27, 0); ctx.lineTo(23, 9);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }
}
