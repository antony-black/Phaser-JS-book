import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  create() {
    const x = this.scale.width * 0.5;
    const y = this.scale.height * 0.5;

    this.add.text(x, y, 'Press SPACE to continue the game', {
      fontSize: 32,
      backgroundColor: 'red'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.stop('game-over');

      this.scene.stop('game');
      this.scene.start('game');
    })
  }
}