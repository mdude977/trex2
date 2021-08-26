var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, sand;
var sun, sunImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadImage("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  sunImage=loadImage("unnamed.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 500);
  
  trex = createSprite(50,380,20,50);
  
  trex.addImage("running", trex_running);
  trex.addImage("collided", trex_collided);
  

  trex.scale = 0.5;
  sand = createSprite (200,500,9000,240)
  sand.shapeColor = ("yellow")
  ground = createSprite(200,380,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,300);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,340);
  restart.addImage(restartImg);
  
  if(mousePressedOver(restart)){
    reset();
  }
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,390,400,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;

  sun = createSprite(0,50)
  sun.addImage(sunImage)
  sun.scale = 0.2
  
}

function draw() {
  background("#479CDF");
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    camera.position.x=trex.x;
    camera.position.y=trex.y;

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if(keyDown("space")&& trex.y >= 300) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    spawnClouds();
  
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
      trex.changeAnimation("collided", trex_collided);
       if(mousePressedOver(restart)) {
      reset();
    }

     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  trex.collide(invisibleGround);
  

  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running", trex_running);

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,365,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,300,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(280,320))
    cloud.scale = 0.4;
    cloud.velocityX = -3;
    
    cloud.lifetime = 134;
    
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
    }
}

