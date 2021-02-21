let canvas, ctx, xGridCells, yGridCells, gradientVectorArray = [];
const gridCellSize = 160;

window.onload = () => {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    xGridCells = Math.floor(canvas.width / gridCellSize) + 1;
    yGridCells = Math.floor(canvas.height / gridCellSize) + 1;

    generateGradientVectors();
    iteratePixels();
    // drawGrid();
    // drawVectors();
}

function iteratePixels(){
    let canvasImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = canvasImg.data;

    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){

            // 2D Array Transpose Index (v0)
            let xIndex = Math.floor(x / gridCellSize), 
                yIndex = Math.floor(y / gridCellSize);

            // 1D Array Vertices Indexes
            let v0 = xIndex + yIndex * xGridCells,
                v1 = v0 + 1,
                v2 = v0 + xGridCells,
                v3 = v2 + 1;

            // Gradient Vectors
            let g0 = gradientVectorArray[v0],
                g1 = gradientVectorArray[v1],
                g2 = gradientVectorArray[v2],
                g3 = gradientVectorArray[v3];
            
            // * Distance Vectors
            let d0 = new Vector2(x - xIndex       * gridCellSize, y - yIndex       * gridCellSize),
                d1 = new Vector2(x - (xIndex + 1) * gridCellSize, y - yIndex       * gridCellSize),
                d2 = new Vector2(x - xIndex       * gridCellSize, y - (yIndex + 1) * gridCellSize),
                d3 = new Vector2(x - (xIndex + 1) * gridCellSize, y - (yIndex + 1) * gridCellSize);

            // Normalize Distance Vectors
            d0.normalize();
            d1.normalize();
            d2.normalize();
            d3.normalize();

            // Dot products
            let s0 = Vector2.dotProduct(g0, d0),
                s1 = Vector2.dotProduct(g1, d1),
                s2 = Vector2.dotProduct(g2, d2),
                s3 = Vector2.dotProduct(g3, d3);

            // Cell Relative Position (Range 0-1)
            let sx = (x - xIndex * gridCellSize) / gridCellSize,
                sy = (y - yIndex * gridCellSize) / gridCellSize;

            // Interpolate Values // "Bi-cosine Interpolation"
            let f0 = fade   Lerp(s0, s1, sx),
                f1 = fadeLerp(s2, s3, sx),
                v  = cosineInterpolation(f0, f1, sy);
                
            // Map value range to color
            let finalColor = (v + 1) / 2 * 255;

            let i = (x + y * canvas.width) * 4;
            pixels[i  ] = finalColor;
            pixels[i+1] = finalColor;
            pixels[i+2] = finalColor;
            pixels[i+3] = 255;
        }
    }

    ctx.putImageData(canvasImg, 0, 0);
}

function generateGradientVectors(){
    for(let i = 0; i < xGridCells * yGridCells; i++){
        gradientVectorArray.push(Vector2.randomUnit());
    }
}

// Thanks http://paulbourke.net/miscellaneous/interpolation/
function cosineInterpolation(a, b, t){
    let t2 = ( 1 - Math.cos(t * Math.PI) ) / 2;
    return(a * (1 - t2) + b * t2);
}

function fadeLerp(a, b, t){
    const fadeT = 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
    return (1-fadeT) * a + fadeT * b;
}

// ************************************************************************** //
// ************************************************************************** //
// ************************************************************************** //

function drawGrid() {
    ctx.strokeStyle = 'rgb(255, 150, 150)';

    for(let x = 0; x < xGridCells; x++){
        line(x * gridCellSize, 0, x * gridCellSize, canvas.height);
    }

    for(let y = 0; y < yGridCells; y++){
        line(0, y * gridCellSize, canvas.width, y * gridCellSize);
    }
}

function drawVectors(){
    ctx.strokeStyle = 'rgb(150, 150, 255)';
    
    // Thanks https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
    for(let i = 0; i < gradientVectorArray.length; i++){
        let x = i % xGridCells,
            y = Math.round(i / yGridCells);

        let xPos = x * gridCellSize,
            yPos = y * gridCellSize;

        let v = gradientVectorArray[i];

        line(xPos, yPos, xPos + v.x * gridCellSize / 2, yPos + v.y * gridCellSize / 2);
    }
}

// ************************************************************************** //
// ************************************************************************** //
// ************************************************************************** //

function line(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}