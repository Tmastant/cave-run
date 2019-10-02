$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
	
	//																	VARIABLES
	
	var screen = 0;	// Variable for current screen; 0 - Home, 1 - Game, 2 - Help, 3 - Leaderboards, 4 - Patch Notes, 5 - End Game Screen
	var progression = 10000;	// Hidden Important Game Variable, tracks how far into each level the player is
	
	var place = [];	// Array for the names on the leaderboards
	var pscore = [];	// Array for the scores on the Leaderboards
	var score = 0;	// Player's score
	var name = prompt("What is your name?", "");	// Prompts the user asking for their name for leaderboards, welcome, etc.
	var pregameimage = Math.floor(Math.random() * 3);	//Choses a random number for the icon in the pregame screen, (Player, Zombie, or Skeleton);
	var patchhelper = 240;	// Variable to assist with line location in the patch notes
	var win = false;	// Boolean for if the player has won the game
	
	var playerx = 800;	// Base location of the player's x coordinate, playerx moves with A and D keys
	var playery = 300;	// Base location of the player's y coordinate, playery moves with W and S keys
	var pspeed = 5;	// Sets the player's speed in pixels per update
	var playersize = 36;	//Sets the size of the player so I dont have to change it multiple times if I decide to change the player size
	var invinc = false;	// Hidden test function that sets the player to invincible where the do not accumulate score and cannot die
	
	var wolfx = 700;	// Sets the base location of the wolf's x coordinate, moves with the player
	var wolfy = 40;	// Sets the base location of the wolf's y coordinate, moves with the player
	var wspeed = 6;	// Sets the speed of the wolf in pixels per update
	var wolfagrorange = 200;	// Range in which the wolf will attack enemies
	var iswolfagro = false;	// Boolean for if the wolf is aggressive(attacking an enemy)
	var wolftetherrange = 100;	// Distance the wolf can be from the player
	var wolftimer = 0;	// Timer for the text that appears on screen when the wolf is spawned
	var wolfpet = 0;	// Determines whether the wolf is in the game
	
	var zombiex = [];	// Array for all the coordinates of the zombies' individual x coordinates
	var zombiey = [];	// Array for all the coordinates of the zombies' individual y coordinates
	var zombies = 0;	// Amount of Zombies on the screen
	var zspeed = 2;	// Speed of the zombies
	var canzspawn = 0;	// Variable to determine whether the zombie can spawn
	var canmove = true;	// Can the player move? (Used for death screen)
	
	var skelex = [];	// Array for the skeletons' x coordinates
	var skeley = [];	// Array for the skeletons' y coordinates
	var keeparrowx= [];	// Array for all the arrow's individual y coordinates to keep when the arrow is moving
	var arrowx = [];	// Array that holds the locations of all the arrow's x coordinates
	var ax = 10;	// Arrow speed
	var skeletons = 0;	// The amount of skeletons on the screen
	var sspeed = 2;	//  Sets the amount of pixels the skeleton can move after they are allowed to
	var cansspawn = 0;	// Variable to determine whether the skeleton can spawn
	var shallskelemove = 0;	// Variable to determine if the skeleton should move
	var skeleshoot = 0;	// Determines whether the skeleton can shoot
	var timer2 = 0;	// Timer for the skeletons' arrows
	
	var spiderx = [];	// Array for the spider's individual x coordinates
	var spidery = [];	// Array for the spider's individual y coordinates
	var spiders = 0;	// Amount of spiders on the screen
	var spspeed = 3;	// Speed of the spiders
	var canspspawn = 0;	// Determines whether or not the spider can spawn
	var spiderup = 0;	// Determines if the spider should spawn on the top or the bottom of the screen(random)
	
	var pitx = -200;	// Sets the x coordinate of the pitfall trap
	var pity = 0;	// Sets the y coordinate of the pitfall(randomly changes)
	var pitspeed = 2;	// Sets the speed of the pitfall, scales with progression
	var pitlive = 1;	// Determines if the pitfall should change its y coordinate
	
	var up = false;	// Variable for if the player is moving up
	var down = false;	// Variable for if the player is moving down
	var left = false;	// Variable for if the player is moving left
	var right = false;	// Variable for if the player is moving right
	
	var dir = 0;		// Variable for the direction the bullet is being shot
	var bulletspeed = 10;	// Sets the speed of the player's bullet
	var shootdir = -1;	// Sets the direction which has been shot
	var upy = w;	// Sets the base location of the bullet until it is changed by another function
	var upx = h;	// Sets the base location of the bullet until it is changed by another function
	var canshoot = true;	// Determines whether the player is able to shoot
	var timer  = 0;	// Timer for the distance the bullet can go before it despawns
	var die = false;	// Determines if the player is dead
	
	place[0] = "Thomas";	//Name of the person in 1st place
	place[1] = "Thomas";	//Name of the person in 1st place
	place[2] = "Thomas";	//Name of the person in 1st place
	place[3] = "Thomas";	//Name of the person in 1st place
	place[4] = "Thomas";	//Name of the person in 1st place
	var canscore = 1;	// Holding variable to allow only 1 spot on the leaderboard per run
	var scores = 5;	// The amount of scores

	var back_x_1= 0;	// x coordinate of the 1st back tile
	var back_x_2= 0 - w;	// x coordinate of the 2nd back tile
	var back_speed = 2;	// Base speed the back tiles move
	
	var wall1 = 0;	// x coordinate of the 1st wall tile
	var wall2 = 0 - w;	// x coordinate of the 2nd wall tile
	var wall_speed = 1;	// Base speed of the wall
	var introwords = 270;	// Location of the words "Level (level)"
	
	var level = 1;	// The variable for the current level
	
	// 																	IMAGES
	var wasd = new Image();
	var keys = new Image();
	var e = new Image();
	var m = new Image();
	var back = new Image();
	var player = new Image();
	var wall = new Image();
	var zombieimg = new Image();
	var skeletonimg = new Image();
	var pitimg = new Image();
	var spiderimg = new Image();
	var wolfimg = new Image();
	//																	END IMAGES
	
	//																	FUNCTIONS
	setInterval(function(){
	if (shootdir != -1) timer++;			// Creates a timer in which it starts when the bullet is moving in a direction that is not -1 (not moving) to create a max distance a bullet can travel
	}, 100);
	setInterval(function(){
	if (skeleshoot == 0) timer2++;		// Creates a timer that determines the distance between each of the skeleton's shots
	}, 100);
	setInterval(function(){
	if (wolfpet == 1) wolftimer++;		// Creates a timer for how long the wolf's entry text should stay on screen
	}, 100);
	
	function moveback(level){
		
		if(back_x_1 > w){					// If the 1st tile's x goes above the width, it teleports it in front of the second tile
			back_x_1 = back_x_2 - w;
		} 
		if(back_x_2 > w){
			back_x_2 = back_x_1 - w;	// If the 2nd tile's x goes above the width, it teleports it in front of the 1st tile
		}
		ctx.drawImage(back, back_x_1, 0, w, h);		// Draws the tiles
		ctx.drawImage(back, back_x_2, 0, w, h);
		ctx.font = '31pt Comic Sans MS';
		ctx.fillStyle = 'black';
		ctx.fillText("Level " + level, introwords, 190);	// Draws the intro words
		ctx.font = '30pt Comic Sans MS';
		ctx.fillStyle = 'red';
		ctx.fillText("Level " + level, introwords, 190);
		ctx.fillStyle = 'black';
		back_x_1 += back_speed;	// Adds the back speed to the coordinates
		back_x_2 += back_speed;	
		introwords += back_speed;
		if(introwords >= 1000) introwords = 1000;	//Prevents the words from going infinitely off the screen and causing performance issues
			if(0 < progression){
			back_speed = back_speed + 0.001;	// Every time the progression is still above 0, the back tiles get faster
			progression--;	// Subtracts from progression
		}
	}
	
	function Pitfall(){
		ctx.fillStyle = 'red';
		pitx += pitspeed + (rand(10) / 10);	// Pitfall will increase in speed by a random amount between 0.1 and 1.0
		ctx.drawImage(pitimg, pitx, pity, 60, 40);	// Draws the Pitfall
		ctx.fillStyle = 'black';
	}
	
	function Player(x, y){
	
		this.x = playerx;
		this.y = playery;
		
		ctx.drawImage(player, this.x, this.y, playersize, playersize);		// Draws the player
		
	}
	
	function spawnZombie(zx, zy){
		
		ctx.fillStyle = 'green';
		zombiex.push(zx);			//Pushes the zombie's x and y coordinates onto the zombie's arrays
		zombiey.push(zy);
		
		ctx.fillStyle = 'black';
	}
	
	function spawnSkeleton(sx, sy){
	
		ctx.fillStyle = 'green';
		skelex.push(sx);			//Pushes the skeleton's x, y, and arrow's coordinates onto the skeleton's arrays
		skeley.push(sy);
		arrowx.push(ax);
	
		ctx.fillStyle = 'black';
	}
	
	function spawnSpider(spx, spy){
	
		ctx.fillStyle = 'green';
		spiderx.push(spx);			//Pushes the spider's x and y coordinates onto the spider's arrays
		spidery.push(spy);
	
		ctx.fillStyle = 'black';
	}
	
	function walls(){
		
		if(wall1 > w){	// If the wall tile goes above width, it teleports it above the 2nd tile
		wall1 = wall2 - w;
		}
		if(wall2 > w){	// If the wall tile goes above width, it teleports it above the 1st tile
		wall2 = wall1 - w;
		}
		
		ctx.drawImage(wall, wall1, 0, w, 30);	// Draws the wall tiles
		ctx.drawImage(wall, wall2, 0, w, 30);
		ctx.drawImage(wall, wall1, h - 30, w, 30);
		ctx.drawImage(wall, wall2, h - 30, w, 30);
		wall1 += wall_speed;	// Adds the wall speed to the tile's x coordinates
		wall2 += wall_speed;
		if(0 < progression){	// As long as progression is above 0 (Game is still running) the wall speed will increase
			wall_speed = wall_speed + 0.001;
		}
		pitspeed = wall_speed;	// Sets the base Pitfall speed to the wall speed
	}
	
	function rand(n){
		
		return Math.floor(Math.random() * n);	// Random function to assist with randomizing
		
	}
	
	function shoot(bx){	//Shoot function that shoots when called
		shootup(bx);
	}
	
	function shootup(){
		
		upy = playery + 16;		// Add a bullet at (playerx + 16, playery + 16)
		upx = playerx + 16;
		
	}
	
	function saveData(){
		localStorage.scores = scores;
		
		var temp = "";	// Creates a string var for temp data to be stored
		for(i = 0; i < pscore.length; i++){	// Finds the length of all the scores
		//The @ character is my made up character that serves to separate the individual values (so 12 doesnt turn to 1,2)
			temp += pscore[i] + "@";	// Adds the scores with an @ in between them
		}
		localStorage.points = temp;	// Stores the data into the local storage
		
	}
	
	function loadData(){
	
		// Casts score into a number from a string that it was in the storage
		scores = Number(localStorage.scores);
		
		var temp = [];	//This temp array is the end result, it will be a nice clean array of extracted values
		for(i = 0; i < localStorage.points.length; i++){
		
			//Goes through 1 character at a time and store the casted version in a temp array
			temp.push(Number(localStorage.points[i]));
		}
		pscore[0] = Number(temp[0]) * 1000 + Number(temp[1]) * 100 + Number(temp[2]) * 10 + Number(temp[3]);	// Sets the scores according to the numbers in the stored temp (pretty inefficient)
		pscore[1] = Number(temp[5]) * 1000 + Number(temp[6]) * 100 + Number(temp[7]) * 10 + Number(temp[8]);
		pscore[2] = Number(temp[10]) * 1000 + Number(temp[11]) * 100 + Number(temp[12]) * 10 + Number(temp[13]);
		pscore[3] = Number(temp[15]) * 1000 + Number(temp[16]) * 100 + Number(temp[17]) * 10 + Number(temp[18]);
		pscore[4] = Number(temp[20]) * 1000 + Number(temp[21]) * 100 + Number(temp[22]) * 10 + Number(temp[23]);
		
		
	}
	
	function zombiespawner(am, min, max){
		for(i = 0; i < am; i++){	// For loop that runs 85 times (The amount of zombies in that level)
				if(progression < 9600 - (i * (rand(300) + 100)) && canzspawn == i){	// Sequence that spawns zombies past 9600 progression after a delay between 100 and 400 progression
					spawnZombie(10, (rand(400) + 50), 10, 10);		// Spawns the zombie, pushing it onto the array
					zombies++;		// Adds a zombie to the amount var
					canzspawn = i + 1;	// Allows the next zombie to spawn
				}
			}
	}
	
	function spiderspawner(am, min, max, base){
		for(i = 0; i < am; i++){		// For loop that runs 15 times (The amount of spiders in that level
			if(progression < base - (i * (rand(max) + min)) && canspspawn == i){	// Sequence that spawns spiders past 2500 progression after a delay between 200 and 500 progression
				spiderup = rand(2);		// Picks a random number (either 0 or 1)
				if(spiderup == 0){		// If the number is 0 spawn the spider on the bottom of the level
					spawnSpider((rand(400) + 50), 620, 10, 10);
				} else if(spiderup == 1){		// If the number is 1 spawn the spider on the top of the level 
					spawnSpider((rand(400) + 50), 10, 10, 10);
				}
				spiders++;	// Adds a spider to the amount variable
				canspspawn = i + 1;	// Allows the next spider to spawn
			}
		}
	}
	
	function skeletonspawner(am, min, max){
		for(i = 0; i < am; i++){		// For loop that runs 30 times (the amount of skeletons in the level)
			if(progression < 9000 - (i * (rand(max) + min)) && cansspawn == i){	// Sequence that spawns skeletons past 9000 progression after a delay between 300 and 700
				spawnSkeleton(10, (rand(400) + 50), 10, 10);		// Spawns the skeleton, pushing it onto the arrays
				skeletons++;		// Adds a skeleton to the amount variable
				cansspawn = i + 1;	// Alllows the next skeleton to spawn
			}
		}
	}
	
	//																	END FUNCTIONS
	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{
		wasd.src = "Images/wasd.png";	// Assigns the image folders to the image variables
		e.src = "Images/e.png";
		m.src = "Images/m.png";
		back.src = "Images/back.png";
		player.src = "Images/Player/player.png";
		keys.src = "Images/keys.jpg";
		wall.src = "Images/wall.png";
		zombieimg.src = "Images/zombie.png";
		skeletonimg.src = "Images/skeleton.png";
		pitimg.src = "Images/pitfall.png";
		spiderimg.src = "Images/spider.png";
		wolfimg.src = "Images/wolf.png";
		
	//////////
	///STATE VARIABLES
	
	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 16.7);
	}

	init();	
	
	if(pscore[0] < 1000 || pscore[0] == null){		// This code ensures the game doesn't crash on other computers
		pscore[0] = 5356;
	}
	if(pscore[1] < 1000 || pscore[1] == null){
		pscore[1] = 5133;
	}
	if(pscore[2] < 1000 || pscore[2] == null){
		pscore[2] = 4806;
	}
	if(pscore[3] < 1000 || pscore[3] == null){
		pscore[3] = 4532;
	}
	if(pscore[4] < 1000 || pscore[4] == null){
		pscore[4] = 4482;
		saveData();
	}
	
	loadData();
	
	saveData();
	
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint()
	{
	
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0, w, h);
		
		if(screen == 0){															//Pre-Game Screen
		ctx.fillStyle = '#333333';	// Most of this text is aesthetic ctx code
		ctx.fillRect(0,0, w, h);	
		ctx.font = '30pt Impact';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText("Cave Run", 240, 100);
		
		ctx.fillStyle = 'white';
		ctx.font = '24pt Impact';
		ctx.fillText("Welcome " + name, 600, 100);
		
		ctx.fillStyle = 'white';													//Play Button
		ctx.fillRect(240, 150, 150, 50);
		ctx.font = '19pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Play", 290, 185);
			if(mx >= 240 && mx <= 390 && my >= 150 && my <= 200){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 150, 150, 50);
				ctx.font = '19pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Play", 290, 185);
			}				
		
		ctx.fillStyle = 'white';													//Help Button
		ctx.fillRect(240, 250, 150, 50);
		ctx.font = '19pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Help", 290, 285);
			if(mx >= 240 && mx <= 390 && my >= 250 && my <= 300){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 250, 150, 50);
				ctx.font = '19pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Help", 290, 285);
			}
			
		ctx.fillStyle = 'white';													//Leaderboards Button
		ctx.fillRect(240, 350, 150, 50);
		ctx.font = '19pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Leaderboards", 245, 385);
			if(mx >= 240 && mx <= 390 && my >= 350 && my <= 400){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 350, 150, 50);
				ctx.font = '19pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Leaderboards", 245, 385);
			}
			
		
		ctx.fillStyle = 'white';													//Patch Notes Button
		ctx.fillRect(240, 450, 150, 50);
		ctx.font = '19pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Patch Notes", 255, 485);
			if(mx >= 240 && mx <= 390 && my >= 450 && my <= 500){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 450, 150, 50);
				ctx.font = '19pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Patch Notes", 255, 485);
			}
			
		ctx.fillStyle = 'white';													//Change Name Button
		ctx.fillRect(650, 550, 150, 50);
		ctx.font = '19pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Change Name", 655, 585);
			if(mx >= 650 && mx <= 800 && my >= 550 && my <= 600){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(650, 550, 150, 50);
				ctx.font = '19pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Change Name", 655, 585);
			}
			
		
		
		if(pregameimage == 0) ctx.drawImage(player, 650, 220, 200, 200);		//Draws a different Image randomly for the main menu
		else if(pregameimage == 1) ctx.drawImage(zombieimg, 650, 220, 200, 200);
		else if(pregameimage == 2) ctx.drawImage(skeletonimg, 650, 220, 200, 200);
		ctx.font = '15pt Impact';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText("V 1.4", 900, 620);
			
		}
	
		if(screen == 2){															//Help Screen
		ctx.fillStyle = '#333333';		// Most of this text is aesthetic ctx code
		ctx.fillRect(0,0, w, h);	
		ctx.font = '30pt Impact';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText("Cave Run", 250, 50);
		ctx.fillText("Help!", 280, 100);
		ctx.font = '20pt Impact';
		ctx.fillText("Use WASD to move", 220, 150);
		ctx.fillText("Use Arrow Keys to shoot", 220, 190);
		
		ctx.drawImage(wasd, 140, 250, 150, 100);
		ctx.drawImage(keys, 390, 220, 150, 150);
		
		ctx.fillStyle = 'white';													//Back Button
		ctx.fillRect(240, 400, 150, 50);
		ctx.font = '20pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Back", 290, 435);
			if(mx >= 240 && mx <= 390 && my >= 400 && my <= 450){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 400, 150, 50);
				ctx.font = '20pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Back", 290, 435);
			}
			
		ctx.fillStyle = 'lightgreen';
		ctx.font = '16pt Impact';
		ctx.fillText("Zombies are enemies that track you down.", 600, 85);
		ctx.drawImage(zombieimg, 750, 100, 32, 32);
		ctx.fillStyle = 'lightgreen';
		ctx.font = '16pt Impact';
		ctx.fillText("Watch out for the Pitfall trap, it will kill you", 600, 185);
		ctx.drawImage(pitimg, 740, 200, 60, 40);
		ctx.fillStyle = 'lightgreen';
		ctx.font = '16pt Impact';
		ctx.fillText("Skeletons are enemies that shoot back at you!", 575, 285);
		ctx.drawImage(skeletonimg, 750, 300, 32, 32);
		ctx.fillText("Spiders come out of the walls and are super fast!", 555, 385);
		ctx.drawImage(spiderimg, 750, 400, 32, 32);
		
		}
		
		if(screen == 3){															//Leaderboards Screen
		ctx.fillStyle = '#333333';
		ctx.fillRect(0,0, w, h);	
		ctx.font = '30pt Impact';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText("Cave Run", 230, 50);
		ctx.fillText("Leaderboards", 200, 100);
		ctx.font = '16pt Arial';
		for(i = 0; i < 5; i++){
		ctx.fillText((i + 1) + ") " + place[i] + " with " + Math.floor(pscore[i]) + " points.", 150, 150 + 35 * i);
		}
		ctx.fillStyle = 'white';													//Back Button
		ctx.fillRect(240, 400, 150, 50);
		ctx.font = '20pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Back", 290, 435);
			if(mx >= 240 && mx <= 390 && my >= 400 && my <= 450){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 400, 150, 50);
				ctx.font = '20pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Back", 290, 435);
			}
			
		
		
		}
		
		if(screen == 1){															// Game Code
			if(invinc == true){	// If invincibility is on (to test features) prevent score from being accumulated
				score = 0;
			}
			if(level == 1){
				shallskelemove = rand(50);		// Skeleton random movement chance per level (the higher the number the less they move)
			} else if (level == 2){
				shallskelemove = rand(45);
			} else if (level == 3){
				shallskelemove = rand(30);
			} else if (level == 4){
				shallskelemove = rand(25);
			} else if (level == 5){
				shallskelemove = rand(20);
			}
			if(level == 1 && progression == 0){	// When the level ends, reset the zombies, skeletons, and spider's arrays and the wall and back speeds
				level = 2;
				progression = 10000;
				back_speed = 2;
				wall_speed = 1;
				canzspawn = 0;
				cansspawn = 0;
				canspspawn = 0;
				introwords = 270;
				skeletons = 0;
				skelex.splice(0);
				skeley.splice(0);
				spiders = 0;
				spiderx.splice(0);
				spidery.splice(0);
				zombies = 0;
				zombiex.splice(0);
				zombiey.splice(0);
				pitx = -100;
				arrowx.splice(0);
			}
			if(level == 2 && progression == 0){	// When the level ends, reset the zombies, skeletons, and spider's arrays and the wall and back speeds
				level = 3;
				progression = 10000;
				back_speed = 2;
				wall_speed = 1;
				canzspawn = 0;
				cansspawn = 0;
				canspspawn = 0;
				introwords = 270;
				skeletons = 0;
				skelex.splice(0);
				skeley.splice(0);
				spiders = 0;
				spiderx.splice(0);
				spidery.splice(0);
				zombies = 0;
				zombiex.splice(0);
				zombiey.splice(0);
				pitx = -100;
				arrowx.splice(0);
			}
			if(level == 2 && progression <= 5000){						// Wolf Spawning
				wolfpet = 1;
			}
			if(level == 3 && progression == 0){	// When the level ends, reset the zombies, skeletons, and spider's arrays and the wall and back speeds
				level = 4;
				progression = 10000;
				back_speed = 2;
				wall_speed = 1;
				canzspawn = 0;
				cansspawn = 0;
				canspspawn = 0;
				introwords = 270;
				skeletons = 0;
				skelex.splice(0);
				skeley.splice(0);
				spiders = 0;
				spiderx.splice(0);
				spidery.splice(0);
				zombies = 0;
				zombiex.splice(0);
				zombiey.splice(0);
				pitx = -100;
				arrowx.splice(0);
			}
			if(level == 4 && progression == 0){	// When the level ends, reset the zombies, skeletons, and spider's arrays and the wall and back speeds
				level = 5;
				progression = 10000;
				back_speed = 2;
				wall_speed = 1;
				canzspawn = 0;
				cansspawn = 0;
				canspspawn = 0;
				introwords = 270;
				skeletons = 0;
				skelex.splice(0);
				skeley.splice(0);
				spiders = 0;
				spiderx.splice(0);
				spidery.splice(0);
				zombies = 0;
				zombiex.splice(0);
				zombiey.splice(0);
				pitx = -100;
				arrowx.splice(0);
			}
			if(level == 5 && progression == 0 && die != true){	// When the level ends reset the game, add the score to the scoreboard, and move to the end game screen
				progression = 10000;
				level = 1;
				wolfpet = 0;
				back_speed = 2;
				wall_speed = 1;
				canzspawn = 0;
				cansspawn = 0;
				canspspawn = 0;
				introwords = 270;
				skeletons = 0;
				skelex.splice(0);
				skeley.splice(0);
				spiders = 0;
				spiderx.splice(0);
				spidery.splice(0);
				zombies = 0;
				zombiex.splice(0);
				zombiey.splice(0);
				pitx = -100;
				arrowx.splice(0);
				screen = 5;
				
				if(score > pscore[0] && canscore == 1){
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = pscore[1];
				place[2] = place[1];
				pscore[1] = pscore[0];
				place[1] = place[0];
				pscore[0] = Math.floor(score);
				place[0] = name;
				canscore = 0;
			} else if (score > pscore[1] && canscore == 1){
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = pscore[1];
				place[2] = place[1];
				pscore[1] = Math.floor(score);
				place[1] = name;
				canscore = 0;
			} else if (score > pscore[2] && canscore == 1){
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = Math.floor(score);
				place[2] = name;
				canscore = 0;
			} else if (score > pscore[3] && canscore == 1){
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = Math.floor(score);
				place[3] = name;
				canscore = 0;
			} else if (score > pscore[4] && canscore == 1){
				pscore[4] = Math.floor(score);
				place[4] = name;
				canscore = 0;
			}
				
			}
			
		if(die == false) score = score + 0.1;		// While the player is alive, add score periodically
		
		if(level == 1){		// During level 1 display score, walls, back, and player, and spawn enemies
			moveback(1);
			walls();
			Player(100, 100);
			ctx.font = '18pt Comic Sans';
			ctx.fillText("Score: " + Math.floor(score), 850, 600);
			ctx.font = '12pt Times New Roman';
			zombiespawner(85, 100, 300);	// Enemies' spawners in functions
			spiderspawner(15, 200, 300, 2500);
			skeletonspawner(30, 300, 400);
		} else if(level == 2){		// During level 2 display score, walls, back, and player, and spawn enemies
			moveback(2);
			walls();
			introwords++;
			Player(100, 100);
			ctx.font = '18pt Comic Sans';
			ctx.fillText("Score: " + Math.floor(score), 850, 600);
			ctx.font = '12pt Times New Roman';
			zombiespawner(85, 100, 300);	// Enemies' spawners in functions
			spiderspawner(45, 200, 300, 8500);
			skeletonspawner(30, 300, 300);
			
		} else if(level == 3){		// During level 3 display score, walls, back, and player, and spawn enemies
			moveback(3);
			walls();
			Player(100, 100);
			ctx.font = '18pt Comic Sans';
			ctx.fillText("Score: " + Math.floor(score), 850, 600);
			ctx.font = '12pt Times New Roman';
			zombiespawner(95, 75, 300);		// Enemies' spawners in functions
			spiderspawner(50, 150, 300, 8500);
			skeletonspawner(40, 250, 300);
			
		} else if(level == 4){		// During level 4 display score, walls, back, and player, and spawn enemies
			moveback(4);
			walls();
			introwords++;
			Player(100, 100);
			ctx.font = '18pt Comic Sans';
			ctx.fillText("Score: " + Math.floor(score), 850, 600);
			ctx.font = '12pt Times New Roman';
			zombiespawner(105, 75, 300);	// Enemies' spawners in functions
			spiderspawner(55, 150, 300, 8500);
			skeletonspawner(41, 250, 300);
			
		} else if(level == 5){		// During level 5 display score, walls, back, and player, and spawn enemies
			moveback(5);
			walls();
			Player(100, 100);
			ctx.font = '18pt Comic Sans';
			ctx.fillText("Score: " + Math.floor(score), 850, 600);
			ctx.font = '12pt Times New Roman';
			zombiespawner(115, 50, 300);	// Enemies' spawners in functions
			spiderspawner(75, 100, 300, 8500);
			skeletonspawner(60, 200, 300);
			
		}
		
		

		
																						// Movement
		if(up){	// If the variable that allows the player to move upwards, "up" is true, it checks to make sure the player is below 30 (on the screen), than subtracts player speed from player y
			if (playery > 30){
				playery -= pspeed;
			}
		} else if(down){	// If the variable that allows the player to move upwards, "down" is true, it checks to make sure the player is above 555 (on the screen), than adds player speed to player y
			if (playery <= 555){
			playery += pspeed;
			}
		}
		if(left){	// If the variable that allows the player to move upwards, "left" is true, it checks to make sure the player is above 0 (on the screen), than subtracts player speed from player x
			if(playerx > 0){
			playerx -= pspeed;
			}
		} else if(right){	// If the variable that allows the player to move upwards, "up" is true, it checks to make sure the player is below w - 64 (on the screen), than adds player speed from player x
			if(playerx < w - 64){
			playerx += pspeed;
			}
		}
		
		// Zombie Tracking
		for(i = 0; i < zombiex.length; i++){	// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			if (zombiex[i] < playerx){		// If the zombie's x is less than the player's x, increase it
				zombiex[i] = zombiex[i] + zspeed;
			}
		}
		for(i = 0; i < zombiex.length; i++){	// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			if (zombiex[i] > playerx){		// If the zombie's x is greater than the player's x, decrease it
				zombiex[i] = zombiex[i] - zspeed;
			}
		}
		for(i = 0; i < zombiey.length; i++){	// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			if (zombiey[i] < playery){		// If the zombie's y is less than the player's y, increase it
				zombiey[i] = zombiey[i] + zspeed;
			}
		}
		for(i = 0; i < zombiey.length; i++){	// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			if (zombiey[i] > playery){		// If the zombie's y is greater than the player's y, decrease it
				zombiey[i] = zombiey[i] - zspeed;
			}
		}
		
		// Spider Tracking
		for(i = 0; i < spiderx.length; i++){		// For loops that runs checking all spiders (if there are 3 spiders on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of spider)
			if (spiderx[i] < playerx){		// If the spider's x is less than the player's x, increase it
				spiderx[i] = spiderx[i] + spspeed;
			}
		}
		for(i = 0; i < spiderx.length; i++){		// For loops that runs checking all spiders (if there are 3 spiders on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of spider)
			if (spiderx[i] > playerx){		// If the spider's x is greater than the player's x, decrease it
				spiderx[i] = spiderx[i] - spspeed;
			}
		}
		for(i = 0; i < spidery.length; i++){		// For loops that runs checking all spiders (if there are 3 spiders on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of spider)
			if (spidery[i] < playery){		// If the spider's y is less than the player's y, increase it
				spidery[i] = spidery[i] + spspeed;
			}
		}
		for(i = 0; i < spidery.length; i++){		// For loops that runs checking all spiders (if there are 3 spiders on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of spider)
			if (spidery[i] > playery){		// If the spider's y is greater than the player's y, decrease it
				spidery[i] = spidery[i] - spspeed;
			}
		}
		
		// Skeleton Random Movement
		for(i = 0; i < skeley.length; i++){		// For loops that runs checking all skeletons (if there are 3 skeletons on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of skeletons)
			if(skeley[i] < playery && shallskelemove == 5){		// Moves toward the player's y if the random variable "shallskelemove" is exactly equal to 5
				skeley[i] = skeley[i] + sspeed;
			}
		}
		for(i = 0; i < skeley.length; i++){				// Skeleton Random Movement
			if(skeley[i] > playery && shallskelemove == 5){		// Moves toward the player's y if the random variable "shallskelemove" is exactly equal to 5
				skeley[i] = skeley[i] - sspeed;
			}
		}
		
		//Zombie FillRect'ing
		for(i = 0; i < zombies; i++){		// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			ctx.drawImage(zombieimg, zombiex[i], zombiey[i], 32, 32);	// Draws the zombie at its coordinates based on its array x and y values
			ctx.fillStyle = 'black';
		}
		
		if(wolfpet == 1){
			ctx.drawImage(wolfimg, wolfx, wolfy, 32, 32);		// Draws the wolf
		}
		if(wolfpet == 1){
			if(wolftimer <= 50){			// Text that appears on wolf spawn
				ctx.font = '15.2pt Comic Sans MS';
				ctx.fillStyle = 'black';
				ctx.fillText("A small companion joins you...", 600, 130);
				ctx.font = '15pt Comic Sans MS';
				ctx.fillStyle = 'red';
				ctx.fillText("A small companion joins you...", 600, 130);
				ctx.fillStyle = 'black';
			}
		}
		if(wolfpet == 1 && die != true){					// Wolf AI
			// Wolf following player	-	Basic tracking AI
			if(wolfx < playerx - wolftetherrange && iswolfagro == false){
				wolfx += wspeed;
			}
			if(wolfx > playerx + wolftetherrange && iswolfagro == false){
				wolfx -= wspeed;
			}
			if(wolfy < playery - wolftetherrange && iswolfagro == false){
				wolfy = wolfy + wspeed;
			}
			if(wolfy > playery + wolftetherrange && iswolfagro == false){
				wolfy = wolfy - wspeed;
			}
			// Wolf attacking zombie
				if(zombiex[0] > playerx - wolfagrorange && zombiex[0] < playerx + wolfagrorange && zombiey[0] > playery - wolfagrorange && zombiey[0] < playery + wolfagrorange){			// If a zombie is within range, sets the wolf's tracking AI to the same as the zombie's and spiders
					iswolfagro = true;
					if(zombiex[0] > wolfx - wolfagrorange && zombiex[0] < wolfx && iswolfagro == true){
						wolfx = wolfx - wspeed;
					}
					if(zombiex[0] < wolfx + wolfagrorange && zombiex[0] > wolfx && iswolfagro == true){
						wolfx = wolfx + wspeed;
					}
					if(zombiey[0] > wolfy - wolfagrorange && zombiey[0] < wolfy + 10 && iswolfagro == true){
						wolfy = wolfy - wspeed;
					}
					if(zombiey[0] < wolfy + wolfagrorange && zombiey[0] > wolfy - 10 && iswolfagro == true){
						wolfy = wolfy + wspeed;
					}
				} else {			// If there is no zombie in range make sure the wolf is not aggro
					iswolfagro = false;
				}
			
		}
		
		//Skeleton FillRect'ing
		for(i = 0; i < skeletons; i++){					// For loops that runs checking all skeletons (if there are 3 skeletons on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of skeletons)
			ctx.fillStyle = 'white';
			ctx.drawImage(skeletonimg, skelex[i], skeley[i], 32, 32);		// Draws the skeleton's image at its array x and y values
			ctx.fillStyle = 'black';
		}
		
		//Spider FillRect'ing
		for(i = 0; i < spiders; i++){						// For loops that runs checking all spiders (if there are 3 spiders on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of spider)
			ctx.fillStyle = 'black';
			ctx.drawImage(spiderimg, spiderx[i], spidery[i], 32, 32);		// Draws the spider's image at its array x and y values
		}
		
		
		// Player Kills Zombie
		for(i = 0; i < zombiex.length; i++){			// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			if((upx <= zombiex[i] + 32 && upx + 10 >= zombiex[i]) && (upy <= zombiey[i] + 32 && upy + 10 >= zombiey[i])){		// Checks through all the zombies to see if the player's bullet has hit them
				zombiex.splice(i, 1);		// Removes the zombie from the zombie arrays at their index value
				zombiey.splice(i, 1);
				upx = -100;		// Resets the bullet
				upy = -100;
				shootdir = -1;		// Resets the direction of the bullet
				canshoot = true;		// Allows the player to shoot
				timer = 0;		// Resets the player's bullet delay timer
				score = score + 10;	// Adds 10 score
			}
		}

		// Wolf Kills Zombie
		for(i = 0; i < zombiex.length; i++){			// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			if((wolfx <= zombiex[i] + 32 && wolfx + 32 >= zombiex[i]) && (wolfy <= zombiey[i] + 32 && wolfy + 32 >= zombiey[i])){		// Checks through all the zombies to see if the wolf has collided with them
				zombiex.splice(i, 1);	// Removes the zombie from the zombie arrays at their index value
				zombiey.splice(i, 1);
				score = score + 5;		// Adds 5 score
			}
		}
		
		// Player Kills Skeleton
		for(i = 0; i < skelex.length; i++){			// For loops that runs checking all skeletons (if there are 3 skeletons on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of skeletons)
			if((upx <= skelex[i] + 32 && upx >= skelex[i]) && (upy <= skeley[i] + 32 && upy + 10 >= skeley[i])){	// Checks through all the skeletons to see if the player's bullet has hit them
				skelex.splice(i, 1);		// Removes the skeleton from the skeleton array at their index value
				skeley.splice(i, 1);
				arrowx.splice(i, 1);
				upx = -100;		// Resets the bullet
				upy = -100;
				shootdir = -1;		// Resets the direction of the bullet
				canshoot = true;		// Allows the player to shoot
				timer = 0;		// Resets the player's bullet delay timer
				score = score + 30;	// Adds 30 score
			}
		}
		// Player Kills Spider
		for(i = 0; i < spiderx.length; i++){			// For loops that runs checking all spiders (if there are 3 spiders on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of spiders)
			if((upx <= spiderx[i] + 32 && upx + 10 >= spiderx[i]) && (upy <= spidery[i] + 32 && upy + 10 >= spidery[i])){	// Checks through all the spiders to see if the player's bullet has hit them
				spiderx.splice(i, 1);	// Removes the skeleton from the skeleton array at their index value
				spidery.splice(i, 1);
				upx = -100;		// Resets the bullet
				upy = -100;
				shootdir = -1;		// Resets the direction of the bullet
				canshoot = true;	// Allows the player to shoot
				timer = 0;		// Resets the player's bullet delay timer
				score = score + 40;	// Adds 40 score
			}
		}
		if(invinc == false){		// Make sure the player can die
		// Zombie Kills Player
		for(i = 0; i < zombiex.length; i++){			// For loops that runs checking all zombies (if there are 3 zombies on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of zombies)
			if((zombiex[i] + 32 >= playerx && zombiex[i] <= playerx + playersize) && (zombiey[i] + 32 >= playery && zombiey[i] <= playery + playersize)){		// If zombie collides with player
				die = true;			// Player dies
			}
		}		
		// Spider Kills Player
		for(i = 0; i < spiderx.length; i++){				// For loops that runs checking all spiders (if there are 3 spiders on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of spiders)
			if((spiderx[i] + 32 >= playerx && spiderx[i] <= playerx + playersize) && (spidery[i] + 32 >= playery && spidery[i] <= playery + playersize)){	// If spider collides with player
				die = true;			// Player dies
			}
		}			
		// Pitfall Kills Player
		if((pitx + 60 >= playerx && pitx <= playerx + playersize) && (pity + 40 >= playery && pity <= playery + playersize)){		// If pitfall collides with player
			die = true;			// Player dies
		}
		// Skeleton Kills Player
		for(i = 0; i < arrowx.length; i++){				// For loops that runs checking all skeletons (if there are 3 skeletons on screen, i will be 0, 1, 2; if there are 6 i will be 0, 1, 2, 3, 4, 5; this pattern continues for all amounts of skeletons)
			if(arrowx[i] + 10 >= playerx && arrowx[i] <= (playerx + playersize) && keeparrowx[i] + 10 >= playery && keeparrowx[i] <= (playery + playersize)){	// If skeleton arrow collides with player
				die = true;		// Player dies
			}
		}
		}
		if(shootdir == 0){	// If the direction the player wants to shoot (determined in the key press function) is 0, subtract from the bullet's y (upy)
			ctx.fillRect(upx, upy, 10, 10);
			upy-= bulletspeed;
		} else if(shootdir == 1){	// If the direction the player wants to shoot (determined in the key press function) is 1, add to the bullet's y (upy)
			ctx.fillRect(upx, upy, 10, 10);
			upy+= bulletspeed;
		} else if(shootdir == 2){	// If the direction the player wants to shoot (determined in the key press function) is 2, subtract from the bullet's x (upx)
			ctx.fillRect(upx, upy, 10, 10);
			upx-= bulletspeed;
		} else if(shootdir == 3){	// If the direction the player wants to shoot (determined in the key press function) is 3, add to the bullet's x (upx)
			ctx.fillRect(upx, upy, 10, 10);
			upx+= bulletspeed;
		}
		if(timer > 10){		// Timer for the distance the bullet goes before stopping (Prevents the player from being able to spam as well as setting a max distance for the bullet, about 3/4 of the screen, which forces the player to move around the map)
			canshoot = true;
			shootdir = -1;
			timer = 0;
			upx = playerx;
			upy = playery;
		}
		
		for(i = 0; i < skeley.length; i++){		// Keeps the position of the skeleton's y for the arrows
			keeparrowx[i] = skeley[i];
		}
		
		if(skeleshoot == 0){							// Skeleton Shooting Code
			for(i = 0; i < skeley.length; i++){		// Draws an arrow at the arrow's x, the skeleton's old y from where it shot and adds to the arrow's x, moving it
				ctx.fillStyle = 'white';
				ctx.fillRect(arrowx[i], keeparrowx[i] + 10, 10, 10);
				arrowx[i] = arrowx[i] + 10;
				if(arrowx[i] > 1000){		// Sets the distance the arrow goes before resetting 
					arrowx[i] = 10;		// Resets the arrow back to the skeleton
					keeparrowx[i] = skeley[i];
				}
			}
		}
		
		if(die == true){		// If the player dies...
		
			upx = -100;
			upy = -100;
			canmove = false;
			ctx.font = '41pt Comic Sans';				// Prints "You died" and the player score
			ctx.fillStyle = 'black';
			ctx.fillText("You died", (w / 2) - 100, 200);
			ctx.font = '40pt Comic Sans';
			ctx.fillStyle = 'red';
			ctx.fillText("You died", (w / 2) - 100, 200);
			ctx.font = '30.5pt Comic Sans';
			ctx.fillStyle = 'black';
			ctx.fillText("Score: " + Math.floor(score), (w / 2) - 100, 240);
			ctx.font = '30pt Comic Sans';
			ctx.fillStyle = 'red';
			ctx.fillText("Score: " + Math.floor(score), (w / 2) - 100, 240);
			
			ctx.fillStyle = 'white';													//Back Button
			ctx.fillRect((w / 2 - 100) + 20, 400, 150, 50);
			ctx.font = '20pt Impact';
			ctx.fillStyle = 'black';
			ctx.fillText("Back", (w / 2 - 100) + 70, 435);
			if(mx >= (w / 2 - 100) + 20 && mx <= (w / 2 - 100) + 170 && my >= 400 && my <= 450){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect((w / 2 - 100) + 20, 400, 150, 50);
				ctx.font = '20pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Back", (w / 2 - 100) + 70, 435);
			}
		
			
			if(score > pscore[0] && canscore == 1){							// Inputs the player's score into the leaderboard if applicable
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = pscore[1];
				place[2] = place[1];
				pscore[1] = pscore[0];
				place[1] = place[0];
				pscore[0] = Math.floor(score);
				place[0] = name;
				canscore = 0;
			} else if (score > pscore[1] && canscore == 1){
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = pscore[1];
				place[2] = place[1];
				pscore[1] = Math.floor(score);
				place[1] = name;
				canscore = 0;
			} else if (score > pscore[2] && canscore == 1){
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = Math.floor(score);
				place[2] = name;
				canscore = 0;
			} else if (score > pscore[3] && canscore == 1){
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = Math.floor(score);
				place[3] = name;
				canscore = 0;
			} else if (score > pscore[4] && canscore == 1){
				pscore[4] = Math.floor(score);
				place[4] = name;
				canscore = 0;
			}
		
		}
		
		if(pitlive == 1){				// Sets the pitfall's y to a random number on the screen
			pity = rand(550) + 30;
			pitlive = 0;
		}
		if(pitx > 1000){				// Sets the pitfall's y to a random number on the screen and teleports it back to before the screen to move through the level again
			pitx = -100;
			pity = rand(550) + 30;
		}
		Pitfall();
		if(skeleshoot > 10){		// Skeleton shoot timer
			skeleshoot = 0;
		}
		
		}
		
		if(screen == 4){															// Patch Notes
		ctx.fillStyle = '#333333';		// Most of this text is aesthetic ctx code
		ctx.fillRect(0,0, w, h);	
		ctx.font = '30pt Impact';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText("Cave Run", 240, 100);
		
		ctx.fillStyle = 'white';													//Back Button
		ctx.fillRect(240, 500, 150, 50);
		ctx.font = '20pt Impact';
		ctx.fillStyle = 'black';
		ctx.fillText("Back", 290, 535);
			if(mx >= 240 && mx <= 390 && my >= 500 && my <= 550){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 500, 150, 50);
				ctx.font = '20pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Back", 290, 535);
			}
		
		
		ctx.font = '20pt Impact';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText("Patch Notes", 50, 150);
		
		ctx.font = '15pt Arial';
		ctx.fillStyle = 'lightgreen';
		ctx.fillText("V 1.5: February 14, 2019", 50, patchhelper - 60);
		ctx.fillText("Spider movementspeed reduced by 1", 50, patchhelper - 30);
		ctx.fillText("V 1.4: January 8, 2017", 50, patchhelper);
		ctx.fillText("Added the wolf pet!", 50, patchhelper + 30);
		ctx.fillText("V 1.3: December 22, 2016", 50, patchhelper + 60);
		ctx.fillText("All 5 levels and end game screen created!", 50, patchhelper + 90);
		ctx.fillText("V 1.2: December 21, 2016", 50, patchhelper + 120);
		ctx.fillText("Spiders at the end of level 1 and 2!", 50, patchhelper + 150);
		ctx.fillText("V 1.1: December 20, 2016", 50, patchhelper + 180);
		ctx.fillText("Bugfixes, New Player and Pitfall Images", 50, patchhelper + 210);
		ctx.fillText("V 1.0: December 20, 2016", 50, patchhelper + 240);
		ctx.fillText("Game currently Includes; Zombie Spawners, Zombie Tracking, Skeletons, Skeleton Shooting, Skeleton", 50, patchhelper + 270);
		ctx.fillText("Spawners, Pitfall, Player Shooting, Player Movement, Death, Highscores, Collisions, Basic Graphics", 50, patchhelper + 300);
		
		ctx.fillText("Made by: Thomas Mastantuono", 650, 620);
		}
		
		if(screen == 5){															// End Game Screen
		ctx.fillStyle = 'blue';		// Most of this text is aesthetic ctx code
				ctx.font = '20pt Impact';
				ctx.fillText("You Win!!", 200, 300);
				ctx.fillStyle = 'white';
				ctx.font = '19pt Impact';
				ctx.fillText("You Win!!", 200, 300);
				ctx.fillText("I dont know how you actually managed to beat the game but Good Job!", 200, 330);
				ctx.fillText("Score: " + Math.floor(score), 200, 200);
				ctx.fillStyle = 'white';													//Back Button
			ctx.fillRect(240, 400, 150, 50);
			ctx.font = '20pt Impact';
			ctx.fillStyle = 'black';
			ctx.fillText("Back", 290, 435);
			if(mx >= 240 && mx <= 390 && my >= 400 && my <= 450){				// If statement to determine if mouse is over button
				ctx.fillStyle = 'gray';
				ctx.fillRect(240, 400, 150, 50);
				ctx.font = '20pt Impact';
				ctx.fillStyle = 'black';
				ctx.fillText("Back", 290, 435);
			}
		}
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	

	
	
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	





	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt){
		
		if(screen == 0){			// Back button detection
			if(mx >= 240 && mx <= 390 && my >= 150 && my <= 200){	
					screen = 1;
			}
			if(mx >= 240 && mx <= 390 && my >= 250 && my <= 300){	
					screen = 2;
			}
			if(mx >= 240 && mx <= 390 && my >= 350 && my <= 400){	
					screen = 3;
			}
			if(mx >= 240 && mx <= 390 && my >= 450 && my <= 500){
					screen = 4;
			}
			if(mx >= 240 && mx <= 800 && my >= 550 && my <= 600){
					name = prompt("What is your name?", "");
			}
		}
		if(screen == 2){			// Back button detection
			if(mx >= 240 && mx <= 390 && my >= 400 && my <= 450){	
				screen = 0;
			}
		}
		if(screen == 3){			// Back button detection
			if(mx >= 240 && mx <= 390 && my >= 400 && my <= 450){	
				screen = 0;
			}
		}
		if(screen == 4){			// Back button detection
			if(mx >= 240 && mx <= 390 && my >= 500 && my <= 550){
				screen = 0;
			}
		}
		if(screen == 5){			// Back button detection
			if(mx >= 240 && mx <= 390 && my >= 400 && my <= 450){
				screen = 0;
				die = false;
				canmove = true;
				zombiex.splice(0);						// Resets all the game functions for the next game
				zombiey.splice(0);
				zombies = 0;
				skelex.splice(0);
				skeley.splice(0);
				skeletons = 0;
				arrowx.splice(0);
				shootdir = -1;
				canzspawn = 0;
				cansspawn = 0;
				progression = 10000;
				playerx = 800;
				playery = 300;
				score = 0;
				canscore = 1;
				pitx = -200;
				introwords = 270;
				level = 1;
				wall_speed = 1;
				back_speed = 2;
				wolfpet = 0;
				saveData();
			}
		}
		if(screen == 1 && level == 5 && win == true){
			if(mx >= 240 && mx <= 390 && my >= 500 && my <= 550){
				screen = 0;
				die = false;
				canmove = true;					// Resets all the game functions for the next game
				zombiex.splice(0);
				zombiey.splice(0);
				zombies = 0;
				skelex.splice(0);
				skeley.splice(0);
				skeletons = 0;
				arrowx.splice(0);
				shootdir = -1;
				canzspawn = 0;
				cansspawn = 0;
				progression = 10000;
				playerx = 800;
				playery = 300;
				score = 0;
				canscore = 1;
				pitx = -200;
				introwords = 270;
				level = 1;
				wall_speed = 1;
				back_speed = 2;
				saveData();
				
				if(score > pscore[0] && canscore == 1){		// Places the player on the leaderboard if needed
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = pscore[1];
				place[2] = place[1];
				pscore[1] = pscore[0];
				place[1] = place[0];
				pscore[0] = Math.floor(score);
				place[0] = name;
				canscore = 0;
			} else if (score > pscore[1] && canscore == 1){		// Places the player on the leaderboard if needed
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = pscore[1];
				place[2] = place[1];
				pscore[1] = Math.floor(score);
				place[1] = name;
				canscore = 0;
			} else if (score > pscore[2] && canscore == 1){		// Places the player on the leaderboard if needed
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = pscore[2];
				place[3] = place[2];
				pscore[2] = Math.floor(score);
				place[2] = name;
				canscore = 0;
			} else if (score > pscore[3] && canscore == 1){		// Places the player on the leaderboard if needed
				pscore[4] = pscore[3];
				place[4] = place[3];
				pscore[3] = Math.floor(score);
				place[3] = name;
				canscore = 0;
			} else if (score > pscore[4] && canscore == 1){		// Places the player on the leaderboard if needed
				pscore[4] = Math.floor(score);
				place[4] = name;
				canscore = 0;
			}
			
			}
		}
		if(die == true){			// Code run on player death
			if(mx >= (w / 2 - 100) + 20 && mx <= (w / 2 - 100) + 170 && my >= 400 && my <= 450){	
				screen = 0;
				die = false;
				canmove = true;				// Resets the game functions for the next game
				zombiex.splice(0);
				zombiey.splice(0);
				zombies = 0;
				skelex.splice(0);
				skeley.splice(0);
				skeletons = 0;
				arrowx.splice(0);
				spiderx.splice(0);
				spidery.splice(0);
				spiders = 0;
				shootdir = -1;
				canzspawn = 0;
				cansspawn = 0;
				progression = 10000;
				playerx = 800;
				playery = 300;
				score = 0;
				canscore = 1;
				pitx = -200;
				introwords = 270;
				level = 1;
				wall_speed = 1;
				back_speed = 2;
				saveData();
				wolfpet = 0;
			}
		}
	      
	}, false);

	
	

	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){pause = false;}, false);

      	canvas.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

      	}, false);


	function getMousePos(canvas, evt) 
	{
	        var rect = canvas.getBoundingClientRect();
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
      	}
      

	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////


	

	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		
		if (key == 82){
		
		}
		if (key == 87 && canmove == true){		// W
			up = true;
			down = false;				// When W is pressed, set up to true
			left = false;
			right = false;
		}
		if (key == 83 && canmove == true){		// S
			down = true;
			up = false;					// When S is pressed, down to true
			left = false;
			right = false;
		}
		if (key == 65 && canmove == true){		// A
			left = true;
			right = false;				// When A is pressed, left to true
			up = false;
			down = false;
		}
		if (key == 68 && canmove == true){		// D
			right = true;
			left = false;				// When D is pressed, right to true
			up = false;
			down = false;
		}
		
		if(key == 38 && canmove == true){			// UP
			
			if(canshoot == true){
				shootdir = 0;				// When uparrow is pressed, sets the direction of shooting to up
				shoot(playerx);
				canshoot = false;
			}
		}
		if(key == 40 && canmove == true){			// DOWN
			if(canshoot == true){
				shootdir = 1;				// When downarrow is pressed, sets the direction of shooting to down
				shoot(playerx);
				canshoot = false;
			}
		}
		if(key == 37 && canmove == true){			// LEFT
			if(canshoot == true){
				shootdir = 2;				// When leftarrow is pressed, sets the direction of shooting to left
				shoot(playerx);
				canshoot = false;
			}
		}
		if(key == 39 && canmove == true){			// RIGHT
			if(canshoot == true){
				shootdir = 3;				// When rightarrow is pressed, sets the direction of shooting to right
				shoot(playerx);
				canshoot = false;
			}
		}
		
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
		
	}, false);
	
	window.addEventListener('keyup', function(evt){
		var key = evt.keyCode;
		
		if (key == 87){		// W
			up = false;
		}
		if (key == 83){		// S
			down = false;
		}
		if (key == 65){		// A
			left = false;
		}
		if (key == 68){		// D
			right = false;
		}
		if (key == 38){		// UP
			
		}
		if (key == 40){		// DOWN
			
		}
		if (key == 37){		// LEFT
			
		}
		if (key == 39){		// RIGHT
			
		}
		
		
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
		
	}, false);


})
