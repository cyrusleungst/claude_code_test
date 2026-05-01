import { CANVAS_W, CANVAS_H } from './constants.js';

export class UI {
  constructor(ctx) {
    this.ctx = ctx;
  }

  drawHUD(player, levelManager) {
    const ctx = this.ctx;

    // Score — top left
    this._text(ctx, `SCORE: ${player.score}`, 16, 22, 16, '#88ffcc', 'left');

    // Level / Wave — top center
    const lm = levelManager;
    this._text(ctx, `LEVEL ${lm.getLevelNumber()}  WAVE ${lm.getWaveNumber()}/${lm.getTotalWaves()}`, CANVAS_W / 2, 22, 16, '#aaddff', 'center');

    // HP bar — top right
    const barW = 120, barH = 14;
    const bx = CANVAS_W - 16 - barW, by = 10;
    ctx.fillStyle = '#111';
    ctx.fillRect(bx, by, barW, barH);
    const ratio = player.hp / player.maxHp;
    const hpColor = ratio > 0.5 ? '#33ff77' : ratio > 0.25 ? '#ffaa00' : '#ff3333';
    ctx.fillStyle = hpColor;
    ctx.fillRect(bx, by, barW * ratio, barH);
    ctx.strokeStyle = '#446644';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, barW, barH);
    this._text(ctx, 'HP', bx - 28, by + 11, 12, '#aaaaaa', 'left');

    // Lives — top right below bar
    for (let i = 0; i < player.lives; i++) {
      ctx.fillStyle = '#33ff77';
      ctx.fillRect(bx + i * 16, by + 20, 12, 12);
      ctx.fillStyle = '#22aa55';
      ctx.fillRect(bx + i * 16 + 2, by + 20 + 2, 6, 6);
    }
  }

  drawMenu(ctx) {
    this._overlay(ctx, 'rgba(0,0,0,0.78)');

    // Animated title shimmer effect via time
    const t = Date.now() / 1000;
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#00ffaa';
    this._text(ctx, 'VOID ASSAULT', CANVAS_W / 2, CANVAS_H / 2 - 80, 56, '#ffffff', 'center');
    ctx.restore();

    this._text(ctx, '>> TOP-DOWN SHOOTER <<', CANVAS_W / 2, CANVAS_H / 2 - 28, 14, '#66aacc', 'center');

    this._text(ctx, 'MOVE: WASD / ARROW KEYS', CANVAS_W / 2, CANVAS_H / 2 + 30, 13, '#888888', 'center');
    this._text(ctx, 'AIM: MOUSE   SHOOT: LEFT CLICK', CANVAS_W / 2, CANVAS_H / 2 + 52, 13, '#888888', 'center');

    const blink = Math.floor(t * 2) % 2 === 0;
    if (blink) {
      this._text(ctx, 'PRESS ENTER TO START', CANVAS_W / 2, CANVAS_H / 2 + 100, 18, '#00ffaa', 'center');
    }

    this._text(ctx, '5 LEVELS  ·  3 ENEMY TYPES  ·  SURVIVE', CANVAS_W / 2, CANVAS_H - 30, 12, '#444', 'center');
  }

  drawLevelComplete(ctx, levelManager, stateTimer, autoDelay) {
    this._overlay(ctx, 'rgba(0,0,0,0.7)');

    const ln = levelManager.getLevelNumber();
    const remaining = Math.ceil(autoDelay - stateTimer);

    ctx.save();
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffaa';
    this._text(ctx, `LEVEL ${ln} COMPLETE`, CANVAS_W / 2, CANVAS_H / 2 - 50, 40, '#00ffaa', 'center');
    ctx.restore();

    this._text(ctx, `Next level in ${remaining}...`, CANVAS_W / 2, CANVAS_H / 2 + 20, 18, '#aaaaff', 'center');
    this._text(ctx, 'or press ENTER to continue', CANVAS_W / 2, CANVAS_H / 2 + 48, 14, '#666', 'center');
  }

  drawGameOver(ctx, score, won) {
    this._overlay(ctx, 'rgba(0,0,0,0.82)');

    if (won) {
      ctx.save();
      ctx.shadowBlur = 28;
      ctx.shadowColor = '#ffdd00';
      this._text(ctx, 'YOU WIN!', CANVAS_W / 2, CANVAS_H / 2 - 70, 56, '#ffdd00', 'center');
      ctx.restore();
      this._text(ctx, 'SECTOR CLEARED', CANVAS_W / 2, CANVAS_H / 2 - 18, 20, '#88eecc', 'center');
    } else {
      ctx.save();
      ctx.shadowBlur = 28;
      ctx.shadowColor = '#ff3333';
      this._text(ctx, 'GAME OVER', CANVAS_W / 2, CANVAS_H / 2 - 70, 56, '#ff4444', 'center');
      ctx.restore();
      this._text(ctx, 'YOU HAVE FALLEN', CANVAS_W / 2, CANVAS_H / 2 - 18, 18, '#888', 'center');
    }

    this._text(ctx, `FINAL SCORE: ${score}`, CANVAS_W / 2, CANVAS_H / 2 + 30, 22, '#ffffff', 'center');
    this._text(ctx, 'PRESS ENTER TO RETURN TO MENU', CANVAS_W / 2, CANVAS_H / 2 + 80, 14, '#666', 'center');
  }

  drawPause(ctx) {
    this._overlay(ctx, 'rgba(0,0,0,0.55)');
    this._text(ctx, 'PAUSED', CANVAS_W / 2, CANVAS_H / 2 - 20, 44, '#ffffff', 'center');
    this._text(ctx, 'ESC to resume  ·  M for menu', CANVAS_W / 2, CANVAS_H / 2 + 30, 14, '#888', 'center');
  }

  drawWaveAnnouncement(ctx, waveNumber, totalWaves, timer) {
    const alpha = Math.min(timer * 4, 1) * Math.min((1.5 - timer) * 4, 1);
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    this._text(ctx, `WAVE ${waveNumber} / ${totalWaves}`, CANVAS_W / 2, CANVAS_H / 2, 36, '#ffaa00', 'center');
    ctx.restore();
  }

  _overlay(ctx, color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  _text(ctx, str, x, y, size, color, align) {
    ctx.font = `bold ${size}px 'Courier New', monospace`;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(str, x, y);
  }
}
