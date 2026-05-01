# Void Assault

A retro-style top-down shooter that runs entirely in the browser. No installs, no dependencies — just open and play.

## How to Run

Serve the `shooter/` folder over HTTP (required for ES modules):

```bash
cd shooter
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## How to Play

| Control | Action |
|---|---|
| `W A S D` or Arrow Keys | Move |
| Mouse | Aim |
| Left Click | Shoot |
| `Escape` | Pause / Resume |
| `M` (while paused) | Return to menu |
| `Enter` | Start / Advance |

Survive waves of enemies across 5 levels. Kill enemies to score points. Don't let them reach you — each hit drains your HP, and losing all HP costs a life. Lose all 3 lives and it's game over.

## Enemies

| Enemy | Description |
|---|---|
| **Grunt** (red diamond) | Basic enemy. Slow, moderate HP. Spins as it charges. |
| **Speeder** (yellow arrowhead) | Fast and fragile. Hard to track. |
| **Tank** (blue hexagon) | Slow and heavily armoured. Has its own HP bar. Worth the most points. |

## Levels

| Level | Name | What to expect |
|---|---|---|
| 1 | First Contact | Grunts only. Learn the basics. |
| 2 | Reinforced | Speeders introduced. First Tanks at the end. |
| 3 | The Swarm | High enemy count, fast spawns. |
| 4 | Heavy Armor | Tank-heavy waves with speeder support. |
| 5 | Last Stand | All enemy types at peak speed. |

## Project Structure

```
shooter/
├── index.html      # Entry point
├── main.js         # Bootstrap
├── game.js         # Game loop and state machine
├── player.js       # Player movement, aiming, shooting
├── enemy.js        # Enemy types and spawn logic
├── bullet.js       # Projectile logic
├── particle.js     # Visual effects (muzzle flash, explosions)
├── level.js        # Wave scheduling and level progression
├── collision.js    # Circle collision detection
├── input.js        # Keyboard and mouse input
├── ui.js           # HUD, menus, overlays
├── constants.js    # Game settings and level configs
└── utils.js        # Math helpers
```
