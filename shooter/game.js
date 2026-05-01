import {
  CANVAS_W, CANVAS_H,
  STATE_MENU, STATE_PLAYING, STATE_LEVEL_COMPLETE, STATE_GAME_OVER, STATE_PAUSED,
  BULLET_DAMAGE, ENEMY_CONTACT_DAMAGE,
} from './constants.js';
import { InputHandler } from './input.js';
import { Player } from './player.js';
import { LevelManager } from './level.js';
import { ParticleSystem } from './particle.js';
import { UI } from './ui.js';
import { circleCircle } from './collision.js';

const LEVEL_COMPLETE_DELAY = 3.5;
const GRID_SIZE = 40;

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.input = new InputHandler(canvas);
    this.player = new Player();
    this.levelManager = new LevelManager();
    this.particles = new ParticleSystem();
    this.ui = new UI(this.ctx);

    this.bullets = [];
    this.enemies = [];
    this.state = STATE_MENU;
    this.stateTimer = 0;
    this.won = false;
    this.lastTimestamp = 0;

    // Wave announcement overlay
    this._waveAnnounceTimer = 0;
    this._prevWave = 0;
  }

  start() {
    this.lastTimestamp = performance.now();
    requestAnimationFrame(ts => this._loop(ts));
  }

  setState(newState) {
    this.state = newState;
    this.stateTimer = 0;
  }

  _loop(timestamp) {
    const rawDt = (timestamp - this.lastTimestamp) / 1000;
    const dt = Math.min(rawDt, 0.1);
    this.lastTimestamp = timestamp;

    switch (this.state) {
      case STATE_MENU:          this._tickMenu(dt);          break;
      case STATE_PLAYING:       this._tickPlaying(dt);       break;
      case STATE_LEVEL_COMPLETE:this._tickLevelComplete(dt); break;
      case STATE_GAME_OVER:     this._tickGameOver(dt);      break;
      case STATE_PAUSED:        this._tickPaused(dt);        break;
    }

    this.input.endFrame();
    requestAnimationFrame(ts => this._loop(ts));
  }

  // ─── State: MENU ────────────────────────────────────────────
  _tickMenu(dt) {
    this._drawBackground('#090912', true);
    this.ui.drawMenu(this.ctx);
    if (this.input.isJustPressed('Enter')) {
      this._startGame();
    }
  }

  _startGame() {
    this.player.reset();
    this.levelManager.reset();
    this.bullets = [];
    this.enemies = [];
    this.particles = new ParticleSystem();
    this.won = false;
    this._waveAnnounceTimer = 0;
    this._prevWave = 0;
    this.setState(STATE_PLAYING);
  }

  // ─── State: PLAYING ─────────────────────────────────────────
  _tickPlaying(dt) {
    this.stateTimer += dt;

    if (this.input.isJustPressed('Escape')) {
      this.setState(STATE_PAUSED);
      return;
    }

    // Update
    this.player.update(dt, this.input, this.bullets, this.particles);
    for (const b of this.bullets) b.update(dt, CANVAS_W, CANVAS_H);
    for (const e of this.enemies) e.update(dt, this.player);
    this.particles.update(dt);
    this._checkCollisions();

    this.bullets = this.bullets.filter(b => !b.dead);
    this.enemies = this.enemies.filter(e => !e.dead);

    this.levelManager.update(dt, this.enemies);

    // Wave announcement
    const curWave = this.levelManager.getWaveNumber();
    if (curWave !== this._prevWave) {
      this._waveAnnounceTimer = 1.5;
      this._prevWave = curWave;
    }
    this._waveAnnounceTimer = Math.max(0, this._waveAnnounceTimer - dt);

    // Transitions
    if (this.player.dead) {
      this.won = false;
      this.setState(STATE_GAME_OVER);
      return;
    }
    if (this.levelManager.levelComplete) {
      this.won = this.levelManager.gameWon;
      if (this.won) {
        this.setState(STATE_GAME_OVER);
      } else {
        this.setState(STATE_LEVEL_COMPLETE);
      }
      return;
    }

    // Draw
    this._drawBackground(this.levelManager.getLevelConfig().background, false);
    this.particles.drawUnder(this.ctx);
    for (const b of this.bullets) b.draw(this.ctx);
    for (const e of this.enemies) e.draw(this.ctx);
    this.player.draw(this.ctx);
    this.particles.drawOver(this.ctx);
    this.ui.drawHUD(this.player, this.levelManager);
    if (this._waveAnnounceTimer > 0) {
      this.ui.drawWaveAnnouncement(
        this.ctx,
        this.levelManager.getWaveNumber(),
        this.levelManager.getTotalWaves(),
        this._waveAnnounceTimer,
      );
    }
  }

  // ─── State: LEVEL_COMPLETE ───────────────────────────────────
  _tickLevelComplete(dt) {
    this.stateTimer += dt;
    // Draw frozen world
    this._drawBackground(this.levelManager.getLevelConfig().background, false);
    this.particles.drawUnder(this.ctx);
    this.player.draw(this.ctx);
    this.particles.drawOver(this.ctx);
    this.ui.drawHUD(this.player, this.levelManager);
    this.ui.drawLevelComplete(this.ctx, this.levelManager, this.stateTimer, LEVEL_COMPLETE_DELAY);

    if (this.stateTimer >= LEVEL_COMPLETE_DELAY || this.input.isJustPressed('Enter')) {
      this.levelManager.advanceLevel();
      this.enemies = [];
      this.bullets = [];
      this._prevWave = 0;
      this.setState(STATE_PLAYING);
    }
  }

  // ─── State: GAME_OVER ────────────────────────────────────────
  _tickGameOver(dt) {
    this.stateTimer += dt;
    this._drawBackground('#090912', true);
    this.ui.drawGameOver(this.ctx, this.player.score, this.won);
    if (this.stateTimer > 1.0 && this.input.isJustPressed('Enter')) {
      this.setState(STATE_MENU);
    }
  }

  // ─── State: PAUSED ───────────────────────────────────────────
  _tickPaused(dt) {
    // Redraw frozen world
    this._drawBackground(this.levelManager.getLevelConfig().background, false);
    for (const e of this.enemies) e.draw(this.ctx);
    this.player.draw(this.ctx);
    this.ui.drawHUD(this.player, this.levelManager);
    this.ui.drawPause(this.ctx);

    if (this.input.isJustPressed('Escape')) {
      this.setState(STATE_PLAYING);
    }
    if (this.input.isJustPressed('KeyM')) {
      this.setState(STATE_MENU);
    }
  }

  // ─── Collision ───────────────────────────────────────────────
  _checkCollisions() {
    for (const bullet of this.bullets) {
      if (bullet.dead) continue;
      for (const enemy of this.enemies) {
        if (enemy.dead) continue;
        if (circleCircle(bullet.x, bullet.y, bullet.radius, enemy.x, enemy.y, enemy.radius)) {
          bullet.dead = true;
          enemy.takeDamage(BULLET_DAMAGE, this.particles);
          if (enemy.dead) this.player.score += enemy.scoreValue;
          break;
        }
      }
    }

    if (this.player.invincibleTimer <= 0) {
      for (const enemy of this.enemies) {
        if (enemy.dead) continue;
        if (circleCircle(this.player.x, this.player.y, this.player.radius, enemy.x, enemy.y, enemy.radius)) {
          this.player.takeDamage(ENEMY_CONTACT_DAMAGE, this.particles);
          break;
        }
      }
    }
  }

  // ─── Background ──────────────────────────────────────────────
  _drawBackground(color, animated) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    const offset = animated ? (Date.now() / 20) % GRID_SIZE : 0;
    for (let x = -GRID_SIZE + (offset % GRID_SIZE); x < CANVAS_W + GRID_SIZE; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_H + GRID_SIZE; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }
  }
}
