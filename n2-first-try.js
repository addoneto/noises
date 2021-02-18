let canvas, ctx;
const tileSize = 80; // Contronlls the frequency
let xTiles, yTiles; 
let gradientVectorArray = [];

window.onload = () => {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    xTiles = Math.floor(canvas.width / tileSize) + 1;
    yTiles = Math.floor(canvas.height / tileSize) + 1;

    generateGradientVectors();

    iteratePixels();

    // drawGrid();
}

function generateGradientVectors(){
    for(let i = 0; i < xTiles * yTiles; i++){
        gradientVectorArray.push(Vector2.randomUnit());
    }
}

function iteratePixels(){
    let canvasImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = canvasImg.data;

    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){
            
            let xIndex = Math.floor(x / tileSize); // first vertex
            let yIndex = Math.floor(y / tileSize);

            // 1D Array Index -> Gradient Vector Array

            let v0 = xIndex + yIndex * yTiles,
                v1 = v0 + 1,
                v2 = v0 + yTiles,
                v3 = v2 + 1;

            // Offset Vectors
            // Should normalize ??
            let v0disatance = new Vector2(x - xIndex * tileSize      , y - yIndex * tileSize);
            let v1disatance = new Vector2(x - (xIndex + 1) * tileSize, y - yIndex * tileSize);
            let v2disatance = new Vector2(x - xIndex * tileSize      , y - (yIndex + 1) * tileSize);
            let v3disatance = new Vector2(x - (xIndex + 1) * tileSize, y - (yIndex + 1) * tileSize);

            v0disatance.normalize();
            v1disatance.normalize();
            v2disatance.normalize();
            v3disatance.normalize();

            // Gradient Vectors
            let v0gradient = gradientVectorArray[v0];
            let v1gradient = gradientVectorArray[v1];
            let v2gradient = gradientVectorArray[v2];
            let v3gradient = gradientVectorArray[v3];

            // Dot/Scalae product
            let v0toDistanceScalar = Vector2.dot(v0gradient, v0disatance);
            let v1toDistanceScalar = Vector2.dot(v1gradient, v1disatance);
            let v2toDistanceScalar = Vector2.dot(v2gradient, v2disatance);
            let v3toDistanceScalar = Vector2.dot(v3gradient, v3disatance);

            // X to unit square Position & Y to unit square Position
            // - transform local x and y position on grid cell to a map value from 0 to 1
            // - sx = 0 when x is on the begin of the cell on x, for example
            // - we'll use these values on the interpolation function
            // let sx = v0disatance.x / tileSize;
            // let sy = v0disatance.y / tileSize;
            let sx = (x - xIndex * tileSize) / tileSize;
            let sy = (y - yIndex * tileSize) / tileSize;

            // Interlopation (Cosine) -> TODO: Bicubic interpolation
            // - a = v0, v1, sx
            // - b = v2, v2, sx
            // - v = a, b, sy
            let a = interpolate(v0toDistanceScalar, v1toDistanceScalar, sx);
            let b = interpolate(v2toDistanceScalar, v3toDistanceScalar, sx);
            let v = interpolate(a, b, sy); // should be a value between -1 and 1
            //because dot product return a value in this range

            // map color value
            // let gColor = map(v, -1, 1, 0, 255);
            let gColor = (v + 1) / 2 * 255;

            // let gColor = (xIndex + yIndex)  % 2 == 0 ? 50 : 30;

            let i = (x + y * canvas.width) * 4;
            pixels[i    ] = gColor;
            pixels[i + 1] = gColor;
            pixels[i + 2] = gColor;
            pixels[i + 3] = 255;

        }
    }

    ctx.putImageData(canvasImg, 0, 0);
}

function drawGrid(){
    ctx.strokeStyle = '#0b0e18';

    for(let x = 0; x < xTiles; x++){
        line(x * tileSize, 0, x * tileSize, canvas.height);
    }

    for(let y = 0; y < yTiles; y++){
        line(0, y * tileSize, canvas.width, y * tileSize);
    }

    drawVectors();
}

function map(value, start1, stop1, start2, stop2) {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

function interpolate(a, b, t){
    let ft = t * Math.PI;
    let f = (1 - Math.cos(ft)) * .5;
    return a*(1-f) + b*f;
}

function drawVectors() {
    ctx.strokeStyle = '#a4a6af';
    ctx.lineWidth = 1;
    
    // Thanks https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
    for(let i = 0; i < gradientVectorArray.length; i++){
        let x = i % xTiles,
            y = Math.round(i / yTiles);

        let xPos = x * tileSize,
            yPos = y * tileSize;

        let v = gradientVectorArray[i];

        // set mag to tileSize / 2
        line(xPos, yPos, xPos + v.x * tileSize / 2, yPos + v.y * tileSize / 2);
    }
}

function line(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

class Vector2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    static randomUnit(){
        let angle = Math.random() * Math.PI * 2;
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    static dot(v1, v2){
        return v1.x * v2.x + v1.y * v2.y;
    }

    mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalize(){
        let m = this.mag();
        this.x / m;
        this.y / m;
    }
}