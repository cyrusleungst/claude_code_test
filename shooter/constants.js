export const CANVAS_W = 800;
export const CANVAS_H = 600;

export const STATE_MENU = 'MENU';
export const STATE_PLAYING = 'PLAYING';
export const STATE_LEVEL_COMPLETE = 'LEVEL_COMPLETE';
export const STATE_GAME_OVER = 'GAME_OVER';
export const STATE_PAUSED = 'PAUSED';

export const BULLET_SPEED = 600;
export const BULLET_DAMAGE = 10;
export const ENEMY_CONTACT_DAMAGE = 25;

export const PLAYER_SPEED = 200;
export const PLAYER_SHOOT_RATE = 0.15;
export const PLAYER_INVINCIBLE_TIME = 1.5;
export const PLAYER_MAX_HP = 100;
export const PLAYER_LIVES = 3;
export const PLAYER_RADIUS = 13;

export const ENEMY_DEFS = {
  grunt: {
    radius: 14, speed: 90, hp: 30, maxHp: 30,
    scoreValue: 10, color: '#e03030', accentColor: '#901010',
  },
  tank: {
    radius: 22, speed: 45, hp: 120, maxHp: 120,
    scoreValue: 30, color: '#5050d0', accentColor: '#3030a0',
  },
  speeder: {
    radius: 10, speed: 165, hp: 15, maxHp: 15,
    scoreValue: 20, color: '#e0a000', accentColor: '#ffdd00',
  },
};

export const LEVELS = [
  {
    id: 1, name: 'FIRST CONTACT', background: '#0a0a12',
    waves: [
      { enemyTypes: ['grunt', 'grunt', 'grunt'], count: 6, spawnInterval: 2.2, speedMultiplier: 1.0 },
      { enemyTypes: ['grunt'], count: 10, spawnInterval: 1.6, speedMultiplier: 1.1 },
    ],
  },
  {
    id: 2, name: 'REINFORCED', background: '#0a0d12',
    waves: [
      { enemyTypes: ['grunt', 'grunt', 'speeder'], count: 8, spawnInterval: 1.8, speedMultiplier: 1.1 },
      { enemyTypes: ['grunt', 'speeder', 'speeder'], count: 12, spawnInterval: 1.4, speedMultiplier: 1.2 },
      { enemyTypes: ['tank'], count: 2, spawnInterval: 3.5, speedMultiplier: 1.0 },
    ],
  },
  {
    id: 3, name: 'THE SWARM', background: '#100a0a',
    waves: [
      { enemyTypes: ['speeder', 'speeder', 'speeder', 'grunt'], count: 16, spawnInterval: 0.85, speedMultiplier: 1.3 },
      { enemyTypes: ['grunt', 'tank', 'speeder'], count: 10, spawnInterval: 1.4, speedMultiplier: 1.2 },
    ],
  },
  {
    id: 4, name: 'HEAVY ARMOR', background: '#0a0a14',
    waves: [
      { enemyTypes: ['tank', 'tank', 'grunt'], count: 10, spawnInterval: 2.0, speedMultiplier: 1.15 },
      { enemyTypes: ['speeder', 'speeder', 'grunt', 'tank'], count: 18, spawnInterval: 0.95, speedMultiplier: 1.35 },
    ],
  },
  {
    id: 5, name: 'LAST STAND', background: '#120a0a',
    waves: [
      { enemyTypes: ['grunt', 'speeder', 'tank'], count: 10, spawnInterval: 1.2, speedMultiplier: 1.45 },
      { enemyTypes: ['speeder', 'speeder', 'speeder', 'grunt'], count: 16, spawnInterval: 0.65, speedMultiplier: 1.65 },
      { enemyTypes: ['tank', 'tank', 'grunt', 'speeder'], count: 14, spawnInterval: 1.3, speedMultiplier: 1.4 },
    ],
  },
];
