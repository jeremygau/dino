const terrain = document.getElementById('terrain');
const dimTerrain = terrain.getBoundingClientRect();
const right_border = dimTerrain.width;
const bottom_border = dimTerrain.height;
let indexObstacle = 0;
let objects;
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
let scroller;

let obstacleTypes = [
	["cactus", [40, 27]],
	["double_cactus", [40, 40]]];

function Dino() {
	this.id = "dino";
	this.width = 39;
	this.height = 40;
	this.x = 40;
	this.y = bottom_border - this.width;
}

function Obstacle(height, width, id) {
	this.id = id;
	this.x = right_border - width;
	this.y = bottom_border - height;
	this.height = height;
	this.width = width;
}

function place_objects(objects) {
	for(let i = 0; i < objects.length; i++) {
		var object = objects[i];
		var element = document.getElementById(object.id);
		element.style.left = object.x + "px";
		element.style.top = object.y + "px";
	}
}

function update() {
	contact();
	out();
	jumping();
	global_speed *= 1.0001;
	for (let i = 1; i < objects.length; i++) {
		objects[i].x -= global_speed;
	}
	score += global_speed;
	place_objects(objects);
	if (score > highScore) {
		highScore = parseInt(score);
	}
	document.getElementById('score').innerText = parseInt(score).toString();
	document.getElementById('highScore').innerText = "HI " + highScore.toString();
}

function addObstacle() {
	let random = Math.floor((obstacleTypes.length)*Math.random());
	let obstacleType = obstacleTypes[random];
	let element = document.createElement('img');
	let newId = 'obstacle' + indexObstacle;
	element.id = newId;
	element.src = 'img/' + obstacleType[0] + '.svg';
	terrain.appendChild(element);
	var object = new Obstacle(obstacleType[1][0], obstacleType[1][1], newId);
	objects.push(object);
	indexObstacle++;
	element.style.left = object.x + "px";
	element.style.top = object.y + "px";
	element.style.position = 'absolute';
	element.style.height = object.height+ "px";
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
	let currentObstacle = objects[1];
	if ((dino.x + 1 < currentObstacle.x && currentObstacle.x < dino.width + dino.x
		|| dino.x + 1 < currentObstacle.x + currentObstacle.width && currentObstacle.x + currentObstacle.width < dino.width + dino.x)
		&& objects[1].y < dino.y + dino.height) {
		clearAll();
	}
}

function clearAll() {
	clearInterval(timer);
	clearInterval(obstacleCreation);
	clearInterval(scroller);
}
function init() {
	indexObstacle = 0;
	dino_speed = 17;
	jumpingTime = dino_speed * 2 + 1;
	global_speed = 3;
	objects = [];
	score = 0;
	jump = false;
	dino = new Dino();
	timer = setInterval(update, 10);
	objects.push(dino);
	addObstacle();
	obstacleCreation = setInterval(function () {
		addObstacle();
	}, 1000);
	document.getElementById('highScore').innerText = "HI " + highScore;
	changeButton();
	scroller = setInterval(scrollbackground, 100);

}

function changeButton() {
	let button = document.getElementById('button');
	button.innerHTML = "Rejouer <i class=\"material-icons right\">replay</i>";
	button.onclick = replay;
}

function replay() {
	clearAll();
	for (let i = 1; i < objects.length; i++) {
		terrain.removeChild(document.getElementById(objects[i].id));
	}
	init();
}

// set which pixel row to start graphic from
var offset = 0;

function scrollbackground() {
	offset --;
	document.getElementById('terrain').style.backgroundPosition = offset + "px";
}
