let canvas, ctx;
let gradientVectorsGrid;

// the result will be a __SQUARE IMAGE__
const tiles = 10; // reflects onto the frequency

window.onload = () => { 
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = 1600;
    canvas.height = 800;

    ctx.fillStyle = '#2b2d39';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.strokeStyle = '#0b0e18';
    // ctx.lineWidth = 2;
    // line(canvas.width / 2, 0, canvas.width / 2, canvas.height);

    ctx.strokeStyle = '#a4a6af';
    ctx.lineWidth = 1;

    let tileSize = canvas.width / 2 / tiles;
    for(let i = 0; i <= tiles; i++){
        line(i * tileSize, 0, i * tileSize, canvas.height);
        line(0, i * tileSize, canvas.width / 2, i * tileSize);
    }

    gradientVectorsGrid = new Array(tiles ** 2);

    ctx.strokeStyle = 'rgb(255, 0, 100)';
    ctx.lineWidth = 2;

    for(let y = 0; y <= tiles; y++){
        for(let x = 0; x <= tiles; x++){
            let gradientVector = createUnitVector();
            let index = x + y * tiles;
            gradientVectorsGrid[index] = gradientVector;

            let xPos = x * tileSize;
            let yPos = y * tileSize;
            line(xPos, yPos, xPos + gradientVector.x * 35, yPos + gradientVector.y * 35);
        }
    }
    
    // https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid

    let canvasImg = ctx.getImageData(canvas.width / 2, 0, canvas.width / 2, canvas.height);
    let pixels = canvasImg.data;

    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width / 2; x++){
            let i = (x + y * (canvas.width / 2)) * 4;

            // Find the cell where the pixel is located, and the gradient vectors of each vertex
            let cellX = Math.floor(x / tileSize);
            let cellY = Math.floor(y / tileSize);

            let v0 = cellX + cellY * tiles; // gradient vector array index (first vectex)
            let v1 = v0 + 1;
            let v2 = v0 + tiles;
            let v3 = v2 + 1;

            // Identify gradient vectors
            let v0grad = gradientVectorsGrid[v0];
            let v1grad = gradientVectorsGrid[v1];
            let v2grad = gradientVectorsGrid[v2];
            let v3grad = gradientVectorsGrid[v3];

            // Calculate offset vectors from each corner/vertex
            let v0Offset = {x: x - cellX * tiles      , y: y - cellY * tiles      };
            let v1Offset = {x: x - (cellX + 1) * tiles, y: y - cellY * tiles      };
            let v2Offset = {x: x - cellX * tiles      , y: y - (cellY + 1) * tiles};
            let v3Offset = {x: x - (cellX + 1) * tiles, y: y - (cellY + 1) * tiles};

            // Calculate the dot product between gradient vector and the offset vector to the pixel
            // let v0product = scalarProduct(v0grad, v0Offset);
            // let v1product = scalarProduct(v1grad, v1Offset);
            // let v2product = scalarProduct(v2grad, v2Offset);
            // let v3product = scalarProduct(v3grad, v3Offset);

            let v0product = scalarProduct(v0grad, {x: x, y: y});
            let v1product = scalarProduct(v1grad, {x: x, y: y});
            let v2product = scalarProduct(v2grad, {x: x, y: y});
            let v3product = scalarProduct(v3grad, {x: x, y: y});

            // Interpolate the dot products

            let interpolation1 = interpolate(v0product, v1product, x - Math.floor(x));
            let interpolation2 = interpolate(v2product, v3product, x - Math.floor(x));
            let value = interpolate(interpolation1, interpolation2, y - Math.floor(y));

            let finalColor = value;

            pixels[i    ] = finalColor;
            pixels[i + 1] = finalColor;
            pixels[i + 2] = finalColor;
            pixels[i + 3] = 255;
        }
    }

    ctx.putImageData(canvasImg, canvas.width / 2, 0);
}

// Dot product
function scalarProduct(vec1, vec2){
    return vec1.x * vec2.x + vec1.y * vec2.y;
}

// use bicubic | now linear
function interpolate(mm, mx, t) {
    return (mx - mm) * t + mm;
}


function createUnitVector(){
    let angle = Math.random() * Math.PI * 2;
    let x = Math.cos(angle);
    let y = Math.sin(angle);
    return {x: x, y: y};
}

function line(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}