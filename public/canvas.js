let bg;
let players = [];
let imgs;
let showingConditions = false;
let pos = [0, 0];
let vel = 5, dir = [0, 0];
let setted = false;
let isDragging = false;
let start = [0, 0];
let fr = 30;
let sensibility = 3;

function preload(){
    imgs = loadJSON('/images');
}

function setup(){
    createCanvas(500, 500);
    let { dm, pc } = imgs;
    bg = loadImage(`/file/${dm[1]}/all`)
    for(let i=0; i < 2; i++){
        players.push(new Player(width / 2, height / 2, `/file/${pc[1]}/all`))
    }
    players[1].setImg(`/file/${pc[3]}/all`)

    addPlayers();
}

function draw(){
    frameRate(fr);
    background(bg);
    for(const player of players) player.show();
    if(showingConditions) showConditions();
    for(let i in players){
        if(players[i].dragging){
            players[i].x = constrain(mouseX - players[i].radius/2, 0, width - players[i].radius);
            players[i].y = constrain(mouseY - players[i].radius/2, 0, height - players[i].radius);
        }
    }

    pos[0] += dir[0] * vel
    pos[1] += dir[1] * vel

    if(isDragging){
        pos[0] += sensibility * (mouseX - start[0]) / fr;
        pos[1] += sensibility * (mouseY - start[1]) / fr;
    }
}

function mousePressed(){
    for(let i=players.length-1; i >= 0; i--)
    if(collisionPointCircle(mouseX, mouseY, players[i].x,
        players[i].y, players[i].radius)){
            players[i].dragging = true;
            break;
    }
    start = [mouseX, mouseY]
    isDragging = true;
}

function mouseReleased(){
    for(let i in players)
        players[i].dragging = false;
    
    isDragging = false;
}

function collisionPointCircle(px, py, cx, cy, r){
    let distX = px - cx;
    let distY = py - cy;
    let distance = Math.sqrt((distX*distX) + (distY*distY));
    return distance < r
}

function showConditions(){
    let conditions = Object.keys(Player.conditions)
    for(let i in conditions){
        const condition = conditions[i];
        let x = Math.floor(i / 8) * (width / 3) + 20;
        let y = (i % 8) * 33 + 20;
        push();
        fill(Player.conditions[condition]);
        ellipse(x, y, 30);
        stroke(0);
        text(condition, x, y);
        pop();
    }
}

function keyPressed({ key }){
    let directions = {
        'ArrowUp': [dir[0], -1],
        'ArrowDown': [dir[0], 1],
        'ArrowLeft': [-1, dir[1]],
        'ArrowRight': [1, dir[1]]
    }

    if(directions[key]){
        dir = directions[key];
    }

    if(key == 'Enter') setted = true;
}

function keyReleased({ key }){
    let xDir = ['ArrowLeft','ArrowRight']
    let yDir = ['ArrowUp', 'ArrowDown'];
        
    if(xDir.includes(key)) dir[0] = 0;
    if(yDir.includes(key)) dir[1] = 0;
}

