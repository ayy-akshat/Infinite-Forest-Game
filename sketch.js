var END = 0;
var IDLE = 1
var PLAY = 2;

var gameState;

var player;

var stumpImg, rockImg;
var obstacleGroup;

var coinFrontImg, coinSideImg;
var coinGroup;

var scoreSound, crashSound;

var score;

var run0, run1, run2, run3;

var showHitboxes;

var gameWidth = 600;
var gameHeight = 600;

function preload()
{
    stumpImg = loadImage('treeStump.png');
    rockImg = loadImage('rock.png');
    coinFrontImg = loadImage('coinFront.png');
    coinSideImg = loadImage('coinSide.png');

    scoreSound = loadSound('score.mp3');
    crashSound = loadSound('gameOver.mp3');

    run0 = loadImage('pixil-frame-0.png');
    run1 = loadImage('pixil-frame-1.png');
    run2 = loadImage('pixil-frame-2.png');
    run3 = loadImage('pixil-frame-3.png');


}

function setup()
{
    gameWidth = windowWidth;
    gameHeight = windowHeight;

    createCanvas(gameWidth, gameHeight);

    player = createSprite(gameWidth/2, gameHeight*0.9, gameWidth*0.1, gameHeight*0.05);

    obstacleGroup = createGroup();
    
    coinGroup = createGroup();
    
    showHitboxes = false;
    score = 0;
    gameState = IDLE;

    player.addImage('stand', run0);
    player.addAnimation('run', run0, run1, run2, run3);
    player.scale = (gameWidth+gameHeight)/6000;
    player.setCollider('rectangle', 0, gameHeight*0.015, gameWidth*0.1, gameHeight*0.25);
}

function draw()
{
    background(rgb(111, 77, 53));

    noStroke();
    fill(rgb(131, 97, 63));
    for (var i = 1; i < 5; i++) {
        rect((gameWidth/5)*i, 0, gameWidth/100, gameHeight);
    }

    if (gameState == IDLE)
    {
        fill(rgb(211, 177, 143));
        textAlign(CENTER);
        textSize((gameWidth+gameHeight)/35);
        text("You have to run from something", gameWidth/2, gameHeight*0.2);
        textSize((gameWidth+gameHeight)/50);
        text("but you don't know what.", gameWidth/2, gameHeight*0.3);
        textSize((gameWidth+gameHeight)/60);
        text("All you know is that", gameWidth/2, gameHeight*0.4);
        textSize((gameWidth+gameHeight)/65);
        text("you have to run.", gameWidth/2, gameHeight*0.5);
        textSize((gameWidth+gameHeight)/60);
        text("(Collect coins on the way!)", gameWidth/2, gameHeight*0.6);
        textSize((gameWidth+gameHeight)/40);
        text("Space to start.", gameWidth/2, gameHeight*0.8);

        if (keyWentDown("space"))
        {
            startGame();
        }
    }

    if (gameState == PLAY)
    {
        textAlign(CENTER);
        fill(rgb(211, 177, 143));
        textSize((gameWidth+gameHeight)/40);
        text("Score: " + score, gameWidth/2, gameHeight*0.1);

        if (World.frameCount % 50 == 0)
        {
            spawnObstacle();
        }

        var speed = gameHeight*0.01 + (score*0.25*gameHeight/150);
        
        obstacleGroup.setVelocityYEach(speed);
        coinGroup.setVelocityYEach(speed);
        
        if (player.isTouching(obstacleGroup))
        {
            gameOver();
        }

        if (keyWentDown("h"))
        {
            showHitboxes = !showHitboxes;
            for (var i = 0; i < obstacleGroup.length; i++) {
                obstacleGroup[i].debug = showHitboxes;
            }
            for (var i = 0; i < coinGroup.length; i++) {
                coinGroup[i].debug = showHitboxes;
            }
            player.debug = showHitboxes;
        }

        if (showHitboxes)
        {
            textSize((gameWidth+gameHeight)/60);
            text("Show hitboxes: on (h to toggle)", gameWidth/2, gameHeight*0.3);
        }

        player.x += (((keyWentDown("right") || keyWentDown("d")) && player.x < gameWidth*0.9 ? 1 : 0) - ((keyWentDown("left") || keyWentDown("a")) && player.x > gameWidth*0.1 ? 1 : 0))*gameWidth/5;

        if (player.x > gameWidth)
        {
            player.x = gameWidth*0.9;
        }
        if (player.x < 0)
        {
            player.x = gameWidth*0.1;
        }

        for (var i = 0; i < coinGroup.length; i++) {
            if (player.isTouching(coinGroup[i]))
            {
                coinGroup[i].destroy();
                score++;
                scoreSound.play();
            }
        }
    }
    
    drawSprites();
    
    if (gameState == END)
    {
        background(rgb(0, 0, 0, 0.5));

        textAlign(CENTER);
        textSize((gameWidth+gameHeight)/20);
        fill(rgb(181, 147, 113));
        text("You crashed", gameWidth/2, gameHeight*0.2)
        textSize((gameWidth+gameHeight)/50);
        text("after collecting " + score + " coins.", gameWidth/2, gameHeight*0.4);
        textSize((gameWidth+gameHeight)/30);
        text("Press R to restart.", gameWidth/2, gameHeight*0.6);

        if (keyWentDown("r"))
        {
            restartGame();
        }
    }
}

function restartGame()
{
    score = 0;
    player.x = gameWidth/2;
    obstacleGroup.destroyEach();
    coinGroup.destroyEach();
    gameState = IDLE;
}

function startGame()
{
    gameState = PLAY;
    player.changeAnimation('run');
}

function gameOver()
{
    gameState = END;
    obstacleGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityYEach(0);

    coinGroup.setLifetimeEach(-1);
    coinGroup.setVelocityYEach(0);
    crashSound.play();

    player.changeAnimation('stand');
}

function spawnObstacle() {
    var randObst = Math.round(random(1, 2));
    var randObstX = Math.round(random(1, 5));
    var randCoinX = Math.round(random(1, 5));

    randObstX = ((randObstX - 1) % 4) + 1;
    
    if (randCoinX == randObstX)
    {
        randCoinX++;
        randCoinX = ((randCoinX - 1) % 4) + 1;
    }
    
    var o = createSprite(((gameWidth/5)*randObstX)+(gameWidth/10), gameHeight*-0.16);

    switch (randObst) {
        case 1:
            o.addImage("stump", stumpImg);
            o.scale = (gameWidth+gameHeight)/2400;
            break;
        case 2:
            o.addImage("rock", rockImg);
            o.scale = (gameWidth+gameHeight)/4000;
            break;
    }

    o.setCollider('rectangle', 0, gameHeight/50, (gameWidth/5)/o.scale, gameHeight*0.10/o.scale);

    obstacleGroup.add(o);

    var c = createSprite(((gameWidth/5)*randCoinX)+(gameWidth/10), -100);
    c.scale = (gameWidth+gameHeight)/2400;
    c.addAnimation('coin', coinFrontImg, coinSideImg);
    c.setCollider('rectangle', 0, 0, gameWidth*0.1/c.scale, gameHeight*0.025/c.scale);

    o.debug = showHitboxes;
    c.debug = showHitboxes;

    coinGroup.add(c);

    player.depth = c.depth + 1;
}
