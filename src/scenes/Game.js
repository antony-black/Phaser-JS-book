import Phaser from "phaser";
import Carrot from "../game/Carrot";

export default class Game extends Phaser.Scene {
  carrotsCollectedText
  carrotsCollected = 0
  carrots
  cursors
  platforms
  player
  constructor() {
    super('game');
  }
  init() {
    this.carrotsCollected = 0;
  }
  preload() {
    this.load.setPath('assets');
    this.load.image('background', 'Background/bg_layer1.png');
    this.load.image('platform', 'Environment/ground_grass.png');
    // this.load.spritesheet('bunny', 'Spritesheets,spritesheet_jumper.png', {
    //   frameWidth: 32,
    //   frameHeight: 32
    // });
    this.load.image('bunny-stand', 'Players/bunny1_stand.png');
    this.load.image('bunny-jump', 'Players/bunny1_jump.png');
    this.load.image('carrot', 'Items/carrot.png');

    this.load.audio('jump', 'sfx/phaseJump1.ogg');

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(240, 320, 'background')
			.setScrollFactor(1, 0)

		this.platforms = this.physics.add.staticGroup()

		for (let i = 0; i < 5; ++i)
		{
			const x = Phaser.Math.Between(80, 400)
			const y = 150 * i
	
			const platform = this.platforms.create(x, y, 'platform')
			platform.scale = 0.5
	
			const body = platform.body
			body.updateFromGameObject()
		}

		this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
			.setScale(0.5)
		
		this.player.body.checkCollision.up = false
		this.player.body.checkCollision.left = false
		this.player.body.checkCollision.right = false

		this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.carrots = this.physics.add.group({
      classType: Carrot
    });

    this.carrots.get(240, 320, 'carrot');

    this.physics.add.collider(this.platforms, this.player);
    this.physics.add.collider(this.platforms, this.carrots);
    this.physics.add.overlap(
      this.player, 
      this.carrots, 
      this.handleCollectCarrot, 
      undefined, 
      this
      );

      const style = { 
        color: '#000',
        fontSize: 24
     }
     this.carrotsCollectedText = this.add.text(80, 16, 'CARROTS: 0', style)
             .setScrollFactor(0)
             .setOrigin(0.5, 0);
  }

  update() {
    this.platforms.children.iterate(child => {
      const platform = child

      const scrollY = this.cameras.main.scrollY
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();

        this.addCarrotAbove(platform);
      }
    })

    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocity(-300);

      this.player.setTexture('bunny-jump');

      this.sound.play('jump');
    }

    const vy = this.player.body.velocity.y;
    if (vy > 0 && this.player.texture.key !== 'bunny-stand') {
      this.player.setTexture('bunny-stand');
    }

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    }
    else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    }
    else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();
     if (this.player.y > bottomPlatform.y + 200) {
      this.scene.run('game-over');
     } 
  }

  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    }
    else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    const carrot = this.carrots.get(sprite.x, y, 'carrot');
    carrot.setActive(true);
    carrot.setVisible(true);
    this.add.existing(carrot);

    carrot.body.setSize(carrot.width, carrot.height);

    this.physics.world.enable(carrot);

    return carrot;
  }

  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot);

    this.physics.world.disableBody(carrot.body);

    this.carrotsCollected ++;

    this.carrotsCollectedText.setText(`CARROTS: ${this.carrotsCollected}`);
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; i++) {
      const platform = platforms[i];

      if (platform.y < bottomPlatform.y) {
        continue
      }
      bottomPlatform = platform;
    }
    return bottomPlatform;
  }
}