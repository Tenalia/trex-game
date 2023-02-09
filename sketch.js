var PLAY = 1;
var END = 0;
var EstadoDeJogo = PLAY;
var trex, trex_running, trexColide;
var ground, groundImage, invisibleGround;
var nuvemImagem;
var obstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var pontos;
var gameOverImg, resetImg;
var jump, checkpoint, die;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage ("ground2.png");
  nuvem = loadImage ("cloud.png");
  obstaculo1 = loadImage ("obstacle1.png");
  obstaculo2 = loadImage ("obstacle2.png");
  obstaculo3 = loadImage ("obstacle3.png");
  obstaculo4 = loadImage ("obstacle4.png");
  obstaculo5 = loadImage ("obstacle5.png");
  obstaculo6 = loadImage ("obstacle6.png");
  trexColide = loadAnimation ("trex_collided.png");
  gameOverImg = loadImage ("gameOver.png");
  resetImg = loadImage ("restart.png");
  jump = loadSound ("jump.mp3");
  checkpoint = loadSound ("checkPoint.mp3");
  die = loadSound ("die.mp3");
}

function setup() {
createCanvas(windowWidth, windowHeight);

//criar um sprite trex
trex = createSprite(50,height-70,20,50);
trex.addAnimation("running", trex_running);
trex.scale = 0.5;
  trex.addAnimation ("trexColide", trexColide);
//criar um sprite ground (chão)
ground = createSprite(width/2, height-70, width, 2);
ground.addImage("ground",groundImage);
  ground.x = ground.width/2;

  invisibleGround = createSprite (width/2, height-10, width, 125);
  invisibleGround.visible = false;

  gameOver = createSprite (width/2, height/2-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  reset = createSprite (width/2, height/2);
  reset.addImage(resetImg);
  reset.scale = 0.5;

  grupoCactos = new Group();
  
  grupoNuvem = new Group();

pontos = 0;
}

function draw() {
background(180);
text ("pontos: " + pontos, 30, 50);
trex.setCollider("rectangle", 0,0,200,trex.height);
trex.debug = true;
if (EstadoDeJogo === PLAY){
  pontos = pontos + Math.round(getFrameRate() / 60);
  if (pontos>0 && pontos % 100 === 0) {
  checkpoint.play();
  }
  ground.velocityX = -(5 + 3* pontos/100);
  gameOver.visible = false;
  reset.visible = false;
  if (ground.x <0){
  ground.x = ground.width/2;

  }

  //pular quando a barra de espaço for pressionada
  if (touches.length>0 || keyDown("space") && trex.y >= height-120) {
    jump.play();
    trex.velocityY = -8; 
    touches = [];
    }

  
  trex.velocityY = trex.velocityY + 0.8
  
  nuvens ();
  criarObstaculos();
  if (grupoCactos.isTouching(trex)){
    jump.play();
    trex.velocityY = -8; 
  EstadoDeJogo = END;
  die.play();
  }
}
else if (EstadoDeJogo === END){
  ground.velocityX = 0;
  gameOver.visible = true;
  reset.visible = true;
  grupoCactos.setVelocityXEach(0);
  grupoNuvem.setVelocityXEach(0);
  trex.velocityY = 0;
  grupoCactos.setLifetimeEach(-1);
  grupoNuvem.setLifetimeEach(-1);
  trex.changeAnimation("collide",trexColide);
  if(mousePressedOver(reset)){
    restart();
  }
}
trex.collide(invisibleGround);
drawSprites();
}

function nuvens () {
  if (frameCount % 60 === 0) {
  nuvemImagem = createSprite (width+20, height-300, 40, 10);
  nuvemImagem.addImage (nuvem);
  nuvemImagem.y = Math.round (random(100, 220));
  nuvemImagem.velocityX = -3;
  nuvem.scale = 0.4;

 nuvem.lifetime = 200;

  nuvem.depth = trex.depth;
  trex.depth = trex.depth + 1;
  grupoNuvem.add(nuvemImagem);
  }
}
function criarObstaculos () {
  if (frameCount % 60 === 0) {
  obstaculo = createSprite (600, height-85, 10, 40);
  obstaculo.velocityX = -(5 + 3* pontos/100);

  var aleatorio = Math.round(random(1,6));
  switch(aleatorio) {
    case 1: obstaculo.addImage(obstaculo1);
    break;
    case 2: obstaculo.addImage(obstaculo2);
    break;
    case 3: obstaculo.addImage(obstaculo3);
    break;
    case 4: obstaculo.addImage(obstaculo4);
    break;
    case 5: obstaculo.addImage(obstaculo5);
    break;
    case 6: obstaculo.addImage(obstaculo6);
    break;
    default: break;
  }
  obstaculo.scale = 0.4;
  obstaculo.lifetime = 300;
  grupoCactos.add(obstaculo);
  obstaculo.depth = reset.depth;
  reset.depth = reset.depth + 1;
  }
}
function restart () {
  EstadoDeJogo = PLAY;
  gameOver.visible = false;
  reset.visible = false;
  grupoCactos.destroyEach();
  grupoNuvem.destroyEach();
  trex.changeAnimation("running", trex_running);
  pontos = 0;
}