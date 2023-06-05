const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const cellSize = 5;
const gridWidth = Math.floor(window.innerWidth / cellSize);
const gridHeight = Math.floor(window.innerHeight / cellSize);

canvas.width = gridWidth * cellSize;
canvas.height = gridHeight * cellSize;

let grid = [];
let nextGrid = [];
for (let i = 0; i < gridWidth; i++) {
    grid[i] = [];
    nextGrid[i] = [];
    let j;
    for (j = 0; j < gridHeight; j++) {
        grid[i][j] = Math.floor(Math.random() * 2);
        nextGrid[i][j] = 0;
    }
}

let rulesGameOfLife;
rulesGameOfLife = (i, j) => {
    const neighbors = neighborCount(i, j);
    if (neighbors > 4) {
        nextGrid[i][j] = 1;
    } else if (neighbors < 3) {
        nextGrid[i][j] = 0;
    } else {
        nextGrid[i][j] = grid[i][j];
    }
};

let neighborCount;
neighborCount = (i, j) => {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) {
                continue;
            }
            const xNeighbor = i + x;
            const yNeighbor = j + y;
            if (xNeighbor < 0 || yNeighbor < 0 || xNeighbor >= gridWidth || yNeighbor >= gridHeight) {
                continue;
            }
            count += grid[xNeighbor][yNeighbor];
        }
    }
    return count;
};

let draw;
draw = () => {
    let i;
    for (i = 0; i < gridWidth; i++) {
        let j;
        for (j = 0; j < gridHeight; j++) {
            if (grid[i][j] === 0) {
                context.fillStyle = '#f7f7f7';
            } else {
                context.fillStyle = '#0074D9';
            }
            context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
};

let update;
update = () => {
    let i;
    for (i = 0; i < gridWidth; i++) {
        let j;
        for (j = 0; j < gridHeight; j++) {
            rulesGameOfLife(i, j);
        }
    }
    grid = nextGrid.map(row => [...row]);

    ship.x += ship.dx;
    ship.y += ship.dy;

    if (ship.x < 0) {
        ship.x = 0;
    } else if (ship.x > canvas.width) {
        ship.x = canvas.width;
    }
    if (ship.y < 0) {
        ship.y = 0;
    } else if (ship.y > canvas.height) {
        ship.y = canvas.height;
    }

    draw();
};

const boatImg = new Image();
boatImg.src = './ship.png';
let i = Math.floor(Math.random() * gridWidth), j = Math.floor(Math.random() * gridHeight);
while (grid[i][j] === 0) {
    i = Math.floor(Math.random() * gridWidth);
    j = Math.floor(Math.random() * gridHeight);
}

let ship;
ship = { "dx": 0, "dy": 0, "size": 40, "speed": 2, "x": i * cellSize, "y": j * cellSize, };

canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const i = Math.floor(mouseX / cellSize);
    const j = Math.floor(mouseY / cellSize);
    switch (event.button) {
        case 0:
            if (grid[i][j] === 1) {
                const angle = Math.atan2(mouseY - ship.y, mouseX - ship.x);
                ship.dx = Math.cos(angle) * ship.speed;
                ship.dy = Math.sin(angle) * ship.speed;

                let updatePosition;
                updatePosition = () => {
                    ship.x += ship.dx;
                    ship.y += ship.dy;
                    if (ship.x < 0) ship.x = canvas.width;
                    if (ship.x > canvas.width) ship.x = 0;
                    if (ship.y < 0) ship.y = canvas.height;
                    if (ship.y > canvas.height) ship.y = 0;
                };

                updatePosition();
                const intervalId = setInterval(updatePosition, 16);

                let stopUpdatingPosition;
                stopUpdatingPosition = () => {
                    clearInterval(intervalId);
                    ship.dx = 0;
                    ship.dy = 0;
                };
                canvas.addEventListener('mouseup', stopUpdatingPosition);
                canvas.addEventListener('mouseleave', stopUpdatingPosition);
            } else if (event.button === 2) {
                if (grid[i][j] === 0) {
                    location.reload();
                }
            }
            break;
        case 2:
            if (grid[i][j] === 0) {
                location.reload();
            }
            break;
    }
});

let animate;
animate = () => {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    update();

    ship.x += ship.dx / 2;
    ship.y += ship.dy / 2;

    if (ship.x < 0 || ship.x >= canvas.width || ship.y < 0 || ship.y >= canvas.height) {
        location.reload();
    }
    const i = Math.floor(ship.x / cellSize), j = Math.floor(ship.y / cellSize);
    if (grid[i][j] === 0) {
        location.reload();
    }

    context.save();
    context.translate(ship.x, ship.y);
    context.rotate(Math.atan2(ship.dy, ship.dx));
    context.drawImage(boatImg, -ship.size / 2, -ship.size / 2, ship.size, ship.size);
    context.restore();
};

animate();