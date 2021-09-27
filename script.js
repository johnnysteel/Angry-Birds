/* global createCanvas Matter width height key background push translate rotate fill rectMode CENTER 
circle rect pop noStroke stroke strokeWeight line */
const { Engine, World, Bodies, Mouse, MouseConstraint, Constraint } = Matter;

let ground;
const boxes = [];
let bird;
let world, engine;
let mConstraint;
let slingshot;
let blueBird;
let slingshotBlue;
let blue,red,yellow,white
let resetBox
let addBox
let numberOfBox
let groundColor
let bkgImg
let addBoxes = [];
let boxImg
let birdColor
let music


function preload() {
  bkgImg = 
  loadImage('https://cdn.glitch.com/4cda20bb-eab9-43c6-84e1-0907d763a089%2Fsky.png?v=1595964901591')
  boxImg = loadImage('https://cdn.glitch.com/4cda20bb-eab9-43c6-84e1-0907d763a089%2Fpig.jpg?v=1596050709172')
  music = loadSound('https://cdn.glitch.com/78090953-f9e8-423b-a416-657eddcaf6e9%2FBad%20Piggies%20Theme.mp3?v=1596102635329')
  
}
        
function setup() {
  // const means never change
  const canvas = createCanvas(1350,640);
  

  //from the matter.js
  //to add the physical engine
  engine = Engine.create();
  world = engine.world;
  colorMode(HSB,360,100,100)
  groundColor = color(120,100,100)
  birdColor = color('green')
  day = false;
  night = false;
  blue = false;
  red = false;
  yellow = false;
  white = false;
  resetBox = false;
  addBox = false;
  numberOfBox = 3
  //make ground soild 
  ground = new Ground(width/2,height -10, width,20);
  leftWall = new Ground(width,300,40,height)
  rightWall = new Ground(0,height-300 ,40,height)
  
  //use for loop to add box into the array
 for (let i = 0; i < 5 ; i++) {
    boxes[i] = new Box(1000, 5 - i * 75, 85, 100);
  }
  
  bird = new Bird(150, 300, 25);
  slingshot = new SlingShot(300, 500, bird.body);


  //mouse event
  const mouse = Mouse.create(canvas.elt);
  const options = {
    mouse: mouse
  }

  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);
}


//check mode
function mode(){
   noStroke()
  fill(220,100,100)
  circle(700,20,20);
  fill(270,90,90)
  circle(800,20,20);
  fill("white")
  textSize(12)

  text("DAY MODE",670,40);
  text("NIGHT MODE",760,40);
 
}

function musicButtons(){
  noStroke()
  fill('white')
  circle(900,20,20)
  fill('white')
  circle(1000,20,20)
  textSize(12)

  text("MUSIC ON",870,40);
  text("MUSIC OFF",970,40);
  
}


//dayMode and Nightmode for additional features

function dayMode() {
 bkgImg = 
loadImage('https://cdn.glitch.com/4cda20bb-eab9-43c6-84e1-0907d763a089%2Fsky.png?v=1595964901591')
 groundColor = color(120,100,100)
}

function nightMode() {
 bkgImg = 
 loadImage('https://cdn.glitch.com/1d59d4b6-59e6-4e9f-84c5-085081a9ae1b%2Fnight.jpg?v=1596012349840')
 groundColor = (0)
}

//to reset the position of the bird
function keyPressed() {
  if (key == ' ') {
    World.remove(world, bird.body);
    bird = new Bird(150, 300, 25);
    slingshot.attach(bird.body);
  }

}

// create a space where to limit the player can only
//shot birds in this space because mouseRelased() is a global funtion
function overBird(x, y,x2,y2) {
  if (mouseX <= x && mouseX >= x2 && 
      mouseY >= y && mouseY <= y2) {
    return true;
  } else {
    return false;
  }
}



//let the bird fly 
function mouseReleased() {
if(overBird(300,300,0,800)){
  setTimeout(() => {
    slingshot.fly();
  }, 100);
  
}

}

// depends on what color birds that player clicked
// change to that color bird 
function changeBird(){
  
 fill("Green")
  noStroke();
  circle(1150,20,20)
 
  fill("Blue")
 noStroke();
 circle(1200,20,20)
  
 fill("Red")
  noStroke();
  circle(1250,20,20);
  
fill("Yellow")
noStroke();
circle(1300,20,20);


}

// check what circle the player clicked
function mouseClicked(){
  
 if(overCircle(1150,20,20)){
   birdColor = color('Green')
 }
  
 if(overCircle(1200,20,20)){
   birdColor = color(220,100,100)
 } 
  if(overCircle(1250,20,20)){
   birdColor = color(0,100,100)
 }
  if(overCircle(1300,20,20)){
   birdColor = color(60,100,100)
 }

 
 if(overCircle(700,20,20)){
    dayMode();
  }
  
 if(overCircle(800,20,20)){
    nightMode();
  } 

 if(overCircle(900,20,20)){
   music.play();
 }
  if(overCircle(1000,20,20)){
    music.pause();
  }
  
}

// get the distance between mouse and object
function overCircle(x, y, radius) {
  
  const disX = x - mouseX;
  const disY = y - mouseY;
  if(sqrt(sq(disX) + sq(disY)) < radius/2 ) {
    return true;
  } else {
    return false;
  }
  
}

function draw() {
  
  background(bkgImg);
  Matter.Engine.update(engine);
  mode();
  musicButtons();
  
  textStyle(BOLD)
  textSize(20)
  noStroke()
  fill(120,100,100);
  
  text("HIT THE BOXES WITH THE BIRD",20,30)
  text("PRESS SPACE TO RESET THE BIRD",20,60)
  
  ground.show();
  changeBird();

  for(let i = 0; i< 5; i++) {
    boxes[i].show();
  }
  
  slingshot.show();
  bird.show();

  
}


class Box {
  constructor(x, y, w, h) {
    const options = {
      restitution: 0.5
    };

    this.body = Matter.Bodies.rectangle(x, y, w, h, options);
    Matter.World.add(world, this.body);
    this.w = w;
    this.h = h;
  }
  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    fill(255);
    imageMode(CENTER);
    image(boxImg, 0, 0, this.w, this.h);
    pop();
  }
}

class Bird {
  constructor(x, y, r) {
    const options = {
      restitution: 0.7
    };
    this.body = Matter.Bodies.circle(x, y, r, options);
    Matter.Body.setMass(this.body, this.body.mass * 4);
    Matter.World.add(world, this.body);
    this.r = r;
  }
  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    fill(birdColor);
    noStroke();
    circle(0,0, this.r * 2);
    pop();
  }
  
    
}


// "Extends" is an inheritance
// for example there has an Animal class{} where has a function called move(){}
// and we create a bird class, since the bird is a kind of animal,
// so bird class should has a move function
// as well, which can extends from the Animal class(father class). 
// If you familar with java, c or c++, it's something.
class Ground extends Box {
  constructor(x, y, w, h) {
    // super means to call the father class's constructor
    // if you want to use constructor from the father class you can call super method. 
    super(x, y, w, h);
    
    // static means to load first in the application.
    // so this Ground class will be load before the Box class
    this.body.isStatic = true;
  }

  show() {
    const pos = this.body.position;
    const angle = this.body.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    noStroke();
    fill(groundColor);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();
  }
  
 
}



class SlingShot {
  constructor(x, y, body) {
    const options = {
      pointA: {
        x: x,
        y: y
      },
      bodyB: body,
      stiffness: 0.03    ,
      length: 40
    };
    this.sling = Constraint.create(options);
    World.add(world, this.sling);
  }

  fly() {
    this.sling.bodyB = null;
   
  }

  show() {
      
    if (this.sling.bodyB) {
      stroke(255);
      strokeWeight(1);
      const posA = this.sling.pointA;
      const posB = this.sling.bodyB.position;
      line(posA.x, posA.y, posB.x, posB.y);
      line(posA.x, posA.y, posA.x, height);  
    }
   
  }

  attach(body) {
    this.sling.bodyB = body;
  }
}
