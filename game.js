function Dino() {
	this.id = "dino";
	this.width = 40;
	this.height = 40;
	this.x = 0;
	this.y = bord_inf - this.width;
	this.vy = 0;
}

function Obstacle(x, y, height, width) {
	this.id = 'obstacle';
	this.x = x - height;
	this.y = y - width;
	this.height = height;
	this.width = width;
	this.vx = 5;
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
	out();
	contact();
	jumping();
	obstacle.vx *= 1.00001;
	obstacle.x -= obstacle.vx;
	score += obstacle.vx;
	place_objects([dino, obstacle]);
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

function out() {
	if (obstacle.x < 0) {
		obstacle.x = bord_droit - obstacle.width;
	}

}

function contact() {
	if (obstacle.x < dino.width
	&& obstacle.y < dino.y + dino.height) {
		obstacle.vx = 0;
		clearInterval(timer);
	}
}

window.addEventListener("keypress", event_handler);

function event_handler(event) {
	if (event.key === " " && jump === false) {
		jump = true;
		jumpTime = 0;
		dino.vy = vitesse(jumpTime);
	}
}

function vitesse(t) {
 return vitesse_init - t;
}

var dino;
var obstacle;

var jump;
var jumpTime;
var jumpingTime = 31;
var vitesse_init = 15;

var dimTerrain = document.getElementById('terrain').getBoundingClientRect();
var bord_droit = dimTerrain.width;
var bord_inf = dimTerrain.height;
var score;

var timer;

function init() {
	dino = new Dino();
	obstacle = new Obstacle(bord_droit, bord_inf, 40, 40);
	score = 0;
	jump = false;
	timer = setInterval(update, 10);
}

init();