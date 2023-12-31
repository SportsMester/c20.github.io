var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var record = 0

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
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
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height*0.7,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  trex.scale = 0.5;
  
  ground = createSprite(width*0.5,height* 0.8,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width*0.5,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width*0.5,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width*0.5,height* 0.85,width,10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,0,30);
  trex.debug = false;
}

function draw() {
  
  background(180);
  //exibindo pontuação
  textSize(20);
  text("Pontuação: "+ score, width*0.5,height*0.4);

  text("Record: "+ record, width*0.5,height*0.5);

  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if(keyDown("space")&& trex.y >= height*0.78) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
        
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //mudar a animação do trex
      trex.changeAnimation("collided", trex_collided);

     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
      
     if(record < score) {
    record = score;
  }
     
   }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
    reset();
    }


  drawSprites();
}

function reset(){
  gameState = PLAY
  gameOver.visible = false

  restart.visible = false

  obstaclesGroup.destroyEach();

  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

   score = 0; 
  
}


function spawnObstacles(){
 if (frameCount % 50 === 0){
   var obstacle = createSprite(width,height* 0.80,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //gerar obstáculos aleatórios
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
   
    //atribua dimensão e tempo de vida aos obstáculos           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(height*0.2,height*0.6));
    cloud.addImage(cloudImage);
    cloud.scale = random(0.3, 4);
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 500;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}


