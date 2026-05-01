import { LEVELS, CANVAS_W, CANVAS_H } from './constants.js';
import { spawnEnemy } from './enemy.js';
import { randomChoice } from './utils.js';

export class LevelManager {
  constructor() {
    this.currentLevel = 0;
    this.currentWave  = 0;
    this.spawnTimer   = 0;
    this.spawnedCount = 0;
    this.levelComplete = false;
    this.gameWon = false;
    this._waveStartDelay = 1.5;
    this._waveDelayTimer = this._waveStartDelay;
    this._waveActive = false;
  }

  reset() {
    this.currentLevel = 0;
    this.currentWave  = 0;
    this.spawnTimer   = 0;
    this.spawnedCount = 0;
    this.levelComplete = false;
    this.gameWon = false;
    this._waveDelayTimer = this._waveStartDelay;
    this._waveActive = false;
  }

  advanceLevel() {
    this.currentLevel++;
    this.currentWave  = 0;
    this.spawnedCount = 0;
    this.spawnTimer   = 0;
    this.levelComplete = false;
    this._waveDelayTimer = this._waveStartDelay;
    this._waveActive = false;
  }

  getLevelConfig()  { return LEVELS[this.currentLevel]; }
  getWaveConfig()   { return LEVELS[this.currentLevel].waves[this.currentWave]; }
  getLevelNumber()  { return this.currentLevel + 1; }
  getWaveNumber()   { return this.currentWave + 1; }
  getTotalWaves()   { return LEVELS[this.currentLevel].waves.length; }

  update(dt, enemies) {
    if (this.levelComplete) return;

    const wave = this.getWaveConfig();
    const aliveCount = enemies.filter(e => !e.dead).length;

    // Wave intro delay
    if (!this._waveActive) {
      this._waveDelayTimer -= dt;
      if (this._waveDelayTimer <= 0) {
        this._waveActive = true;
        this.spawnTimer = 0;
      }
      return;
    }

    // Spawn enemies
    if (this.spawnedCount < wave.count) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        const type = randomChoice(wave.enemyTypes);
        enemies.push(spawnEnemy(type, CANVAS_W, CANVAS_H, wave.speedMultiplier));
        this.spawnedCount++;
        this.spawnTimer = wave.spawnInterval;
      }
    }

    // Wave complete when all spawned and all dead
    if (this.spawnedCount >= wave.count && aliveCount === 0) {
      const nextWave = this.currentWave + 1;
      if (nextWave < LEVELS[this.currentLevel].waves.length) {
        this.currentWave  = nextWave;
        this.spawnedCount = 0;
        this.spawnTimer   = 0;
        this._waveDelayTimer = this._waveStartDelay;
        this._waveActive = false;
      } else {
        // Level complete
        this.levelComplete = true;
        if (this.currentLevel >= LEVELS.length - 1) {
          this.gameWon = true;
        }
      }
    }
  }
}
