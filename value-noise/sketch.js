// Based on https://www.youtube.com/watch?v=wRxYafz3Hb8

let canvas, ctx, xTiles, yTiles, valueGrid = new Array();
const gridCellSize = 160;

window.onload = () => {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    xTiles = Math.floor(canvas.width / gridCellSize)  + 1;
    yTiles = Math.floor(canvas.height / gridCellSize) + 1;

    generateGridValues();

    iteratePixels();

    // drawGrid();
    // drawValues();
}

function generateGridValues(){
    for(let i = 0; i < xTiles * yTiles; i++){
        valueGrid.push(Math.random());
    }
}

function iteratePixels(){
    let canvasImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = canvasImg.data;

    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){

            let xIndex = Math.floor(x / gridCellSize);
            let yIndex = Math.floor(y / gridCellSize);

            // 1D Array Index -> Value Vector Array
            let v0 = xIndex + yIndex * yTiles,
            v1 = v0 + 1, v2 = v0 + yTiles, v3 = v2 + 1;

            // Vertex Values
            let v0Value = valueGrid[v0],
                v1Value = valueGrid[v1],
                v2Value = valueGrid[v2],
                v3Value = valueGrid[v3];

            // X to unit square Position & Y to unit square Position
            // - transform local x and y position on grid cell to a map value from 0 to 1
            // - we'll use these values on the interpolation function
            let sx = (x - xIndex * gridCellSize) / gridCellSize;
            let sy = (y - yIndex * gridCellSize) / gridCellSize;

            // Bilinear(actually quadratic) interpolation:
            // interpolate between the first 2 vertex
            // then the other 2 and interpolate these values together

            // let top = quadraticInterpolation(v0Value, v1Value, sx);
            // let bottom = quadraticInterpolation(v2Value, v3Value, sx);
            // let final = quadraticInterpolation(top, bottom, sy);

            let top = cosineInterpolation(v0Value, v1Value, sx);
            let bottom = cosineInterpolation(v2Value, v3Value, sx);
            let final = cosineInterpolation(top, bottom, sy);

            // map value
            let color = (final + 1) / 2 * 255;

            let index = (x + y * canvas.width) * 4;

            pixels[index    ] = color;
            pixels[index + 1] = color;
            pixels[index + 2] = color;
            pixels[index + 3] = 255;
        }
    }

    ctx.putImageData(canvasImg, 0, 0);
}

function drawGrid(){
    ctx.strokeStyle = '#0b0e18';


    for(let x = 0; x < xTiles; x++){
        line(x * gridCellSize, 0, x * gridCellSize, canvas.height);
    }

    for(let y = 0; y < yTiles; y++){
        line(0, y * gridCellSize, canvas.width, y * gridCellSize);
    }
}

function drawValues(){
    ctx.font = "20px Arial";

    // const leftOffset = gridCellSize / 4;
    // const upOffset = gridCellSize / 8;
    
    for(let x = 0; x < xTiles; x++){
        for(let y = 0; y < yTiles; y++){

            let oneDIndex = x + y * xTiles;
            let v = valueGrid[oneDIndex];

            ctx.fillText(v.toFixed(2), x * gridCellSize - 0, y * gridCellSize + 0);
        }
    }
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function quadraticInterpolation(a, b, t){
    let fadeT = 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
    return (1 - fadeT) * a + fadeT * b; // lerp with faded value
}

function cosineInterpolation(a, b, t){
    let ft = (1 - Math.cos(t * Math.PI) ) / 2;
    return(a * (1 - ft) + b * ft);
 }