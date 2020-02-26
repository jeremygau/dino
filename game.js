const terrain = document.getElementById('terrain');
const dimTerrain = terrain.getBoundingClientRect();
const right_border = dimTerrain.width;
const bottom_border = dimTerrain.height;
let indexObstacle = 0;
let objects = [];
let dino;
let global_speed;
let jump;
let jumpTime;
let dino_speed;
let jumpingTime;
let score;
let highScore = 0;
let timer;
let obstacleCreation;
let gameOn = false;

function Dino() {
	this.id = "dino";
	this.width = 40;
	this.height = 40;
	this.x = 0;
	this.y = bottom_border - this.width;
	this.vy = 0;
}

function Obstacle(height, width, id) {
	this.id = id;
	this.x = right_border - height;
	this.y = bottom_border - width;
	this.height = height;
	this.width = width;
}

function addObstacle(height, width) {
	let element = document.createElement('img');
	let newId = 'obstacle' + indexObstacle;
	element.id = newId;
	element.src = 'cactus.svg';
	terrain.appendChild(element);
	var object = new Obstacle(height, width, newId);
	objects.push(object);
	indexObstacle++;
	element.style.left = object.x + "px";
	element.style.top = object.y + "px";
	element.style.position = 'absolute';
	element.style.height = object.height+ "px";
}

function update() {
	out();
	jumping();
	document.getElementById('score').innerText = parseInt(score).toString();
	global_speed *= 1.0001;
	for (let i = 1; i < objects.length; i++) {
		objects[i].x -= global_speed;
	}
	score += global_speed;
	place_objects(objects);
	contact();
}

function place_objects(objects) {
	for(let i = 0; i < objects.length; i++) {
		var object = objects[i];
		var element = document.getElementById(object.id);
		element.style.left = object.x + "px";
		element.style.top = object.y + "px";
	}
}

function jumping() {
	if (jump === true) {
		jumpTime ++;
		dino.y -= dino.vy;
		dino.vy = vitesse(jumpTime);
		if (jumpTime === jumpingTime) {
			jump = false;
		}
	}
}

window.addEventListener("keypress", event_handler);

function event_handler(event) {
	if (event.key === " " && jump === false) {
		jump = true;
		jumpTime = 0;
		dino.vy = dino_speed;
	}
	if (event.key === " " && !gameOn) {
		gameOn = true;
		clearGame();
		init();
	}
}

function vitesse(t) {
	return dino_speed - t;
}

function out() {
	if (objects[1].x < 0) {
		terrain.removeChild(document.getElementById(objects[1].id));
		objects.splice(1,1);
	}
}

function contact() {
	if (objects[1].x < dino.width
		&& objects[1].y < dino.y + dino.height) {
		clearInterval(timer);
		clearInterval(obstacleCreation);
		gameOn = false;
		if (score > highScore) {
			highScore = parseInt(score);
		}
	}
}

function clearGame() {
	for (let i = 1; i < objects.length; i++)  {
		terrain.removeChild(document.getElementById(objects[i].id));
	}
	document.getElementById('highScore').innerText = highScore;
}

function init() {
	indexObstacle = 0;
	dino_speed = 15;
	jumpingTime = dino_speed * 2 + 1;
	global_speed = 5;
	score = 0;
	jump = false;
	dino = new Dino();
	timer = setInterval(update, 10);
	objects.push(dino);
	addObstacle(40,40);
	obstacleCreation = setInterval(function () {
		addObstacle(40, 40);
	}, 1000);
	document.getElementById('highScore').innerText = highScore;
}
