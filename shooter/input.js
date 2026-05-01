export class InputHandler {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this._justPressed = {};
    this.mouse = { x: 400, y: 300, leftDown: false, leftClicked: false };

    window.addEventListener('keydown', e => this._onKeyDown(e));
    window.addEventListener('keyup',   e => this._onKeyUp(e));
    canvas.addEventListener('mousemove', e => this._onMouseMove(e));
    canvas.addEventListener('mousedown', e => this._onMouseDown(e));
    canvas.addEventListener('mouseup',   e => this._onMouseUp(e));
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  }

  isDown(code) {
    return !!this.keys[code];
  }

  isJustPressed(code) {
    return !!this._justPressed[code];
  }

  getMovementVector() {
    let x = 0, y = 0;
    if (this.isDown('ArrowLeft')  || this.isDown('KeyA')) x -= 1;
    if (this.isDown('ArrowRight') || this.isDown('KeyD')) x += 1;
    if (this.isDown('ArrowUp')    || this.isDown('KeyW')) y -= 1;
    if (this.isDown('ArrowDown')  || this.isDown('KeyS')) y += 1;
    if (x !== 0 && y !== 0) { x *= 0.7071; y *= 0.7071; }
    return { x, y };
  }

  consumeClick() {
    const v = this.mouse.leftClicked;
    this.mouse.leftClicked = false;
    return v;
  }

  endFrame() {
    this.mouse.leftClicked = false;
    this._justPressed = {};
  }

  _onKeyDown(e) {
    if (!this.keys[e.code]) this._justPressed[e.code] = true;
    this.keys[e.code] = true;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) {
      e.preventDefault();
    }
  }

  _onKeyUp(e) {
    delete this.keys[e.code];
  }

  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    this.mouse.x = (e.clientX - rect.left) * scaleX;
    this.mouse.y = (e.clientY - rect.top)  * scaleY;
  }

  _onMouseDown(e) {
    if (e.button === 0) {
      this.mouse.leftDown = true;
      this.mouse.leftClicked = true;
    }
  }

  _onMouseUp(e) {
    if (e.button === 0) this.mouse.leftDown = false;
  }
}
