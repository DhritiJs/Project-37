//Create variables here
var dog,foodS,foodStock;
var dogImg,happyDogImg;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var gameState = "Hungry",readState;
var bedroom,garden,washroom,sadDog;
function preload(){
  //load images here
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happyDog.png");
  bedroom = loadImage("images/bedroom.png");
  washroom = loadImage("images/washroom.png");
  garden = loadImage("images/garden.png");
}

function setup() {
  createCanvas(800,700);
  dog = createSprite(700,350,10,10);
  dog.addImage(dogImg);
  dog.scale=0.3;

  database = firebase.database();
  foodStock = database.ref('food');
  foodStock.on("value",readStock,showError);

  readState  = database.ref('gameState');
  readState.on("value",function(data){
     gameState = data.val();
  })
 
 feed = createButton("Feed the Dog");
  feed.position(600,95);
  feed.mousePressed(feedDog);
  
  addFood =createButton("Add Food");
  addFood.position(700,95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();


}


function draw() {  
background(46, 139, 87);
currentTime=hour();
if(currentTime ==(lastFed+1)){
update("Playing");
foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime<(lastFed+4)){
  update("Bathing");
  foodObj.washroom();
}else{
  update("Hungry");
  foodObj.display();
}

foodObj.display();
  drawSprites();
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })


fill(0); 
textSize(15); 
if(lastFed>=12){ text("Last Feed : "+ lastFed%12 + " PM", 50,30); }
   else if(lastFed==0){ text("Last Feed : 12 AM",50,30); }
        else{ text("Last Feed : "+ lastFed + " AM", 50,30); }

if(gameState!="Hungry"){
feed.hide();
addFood.hide();
dog.remove();
}


}

function readStock(data){
  foodS=data.val();
  foodObj.updateStock(foodS);
}
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref('/').set({
    food:x
  }
  )
}
function showError(){
  console.log("Error");
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS=foodS+1;
  database.ref('/').update({
    food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  })
}
