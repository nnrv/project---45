var PLAY = 1;
var END = 0;
var START = 2;
var gameState = START;

var trex,trex_running; 
var trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var backgroundImg;
var score=0;
var coin_num = 0;

var coinsGroup,coins,coin_mov;
var collidedSound,jumpSound,start,startImg,startButton;

var gameOver, restart;



function preload(){
  backgroundImg = loadImage("forest1.png");
  trex_running =   loadAnimation("G1.png","G2.png","G3.png","G5.png","G6.png","G7.png","G8.png");
  trex_collided = loadAnimation("G4.png");
  startImg = loadImage("start.png");

  jumpSound= loadSound("jump.mp3");
  collidedSound = loadSound("die.mp3");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("lightning1.png");
  
  obstacle1 = loadImage("flamer.png");
  obstacle2 = loadImage("blueflame.png");
  obstacle3 = loadImage("monster3.png");
  obstacle4 = loadImage("obs1.png");
  obstacle5 = loadImage("monster2.png");
  obstacle6 = loadImage("monster2.png");

  coin_mov = loadImage("coin4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(70,height-150,20,50);
  trex.setCollider('rectangle',0,0,100,100)
 // trex.debug = true;  
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.8;
  
  ground = createSprite(width/2,height -50,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.visible = false;
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);

  startButton = createSprite(width/2,height/2-50);
  startButton.addImage(startImg);
  startButton.scale = 0.3;

  coins = createSprite(width*3/4 - 20,height -555,20,20);
  coins.addImage(coin_mov);
  coins.scale = 0.15;
  coins.visible = false;
    
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.8;
  restart.scale = 0.8;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-100,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  coinsGroup = new Group();
  
  score = 0;
  coin_num = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
 // textSize(20) ;
  //text("Score: "+ score, width/4,height -550);

  if(gameState === START){
    start();
  }
  
  if(mousePressedOver(startButton)){
    gameState = PLAY;
  }
  
  if (gameState===PLAY){
    trex.visible = true;
    startButton.visible = false;
    textSize(20) ;
    fill("white");
    text("Score: "+ score, width*3/4,height -530);
    score = score + Math.round(getFrameRate()/60);

    textSize(20) ;
    fill("white");
    text("Coins: "+ coin_num, width*3/4,height -550);
    coins.visible = true;
    if(coinsGroup.isTouching(trex)){
      coin_num = coin_num+1;
      coinsGroup.setLifetimeEach(0);
    }

    ground.velocityX = -(6 + 3*score/100);
  
    if(touches.length >0 || keyDown("space") && trex.y >= height - 300) {
      trex.velocityY = -12;
      jumpSound.play();
      touches  = [];
      }
  
    trex.velocityY = trex.velocityY + 1;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnCoins();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        collidedSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    coins.visible = false;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var cloud = createSprite(width + 20,height - 200,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 600;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(600,height - 95,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 2*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle3.scale = 1;
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle       
    obstacle3.scale = 5;    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnCoins() {
  //write code here to spawn the coins
  if (frameCount % 70 === 0) {
    var coin = createSprite(600,height - 95,10,40);
    coin.x = Math.round(random(80,120));
    coin.addImage(coin_mov);
    coin.scale = 0.15;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 600;
    
    //adjust the depth
    coin.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    coinsGroup.add(coin);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  coin_num = 0;
  
}

function start(){
  gameState = START;
  trex.visible = false;
  startButton.visible = true;
  textSize(20) ;
  fill("white");
  text("Press the space button to jump ", width/2-130,height/2+20);

  
}