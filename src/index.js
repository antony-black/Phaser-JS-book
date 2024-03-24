import Phaser from 'phaser'
import Game from './scenes/Game'
import GameOver from './scenes/GameOver'

const config = {
	type: Phaser.AUTO,
  backgroundColor: '#123456',
	width: 680,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
      debug: true
		}
	},
	scene: [Game, GameOver]
}

export default new Phaser.Game(config)
