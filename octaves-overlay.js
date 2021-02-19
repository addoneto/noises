let canvas, ctx;
const wlToPixels = 150; // constant to convert waveLength to pixels

class gridPoints {
    constructor(frequency, amplitude, width, height) {
        this.pointDistance = 1 / frequency * wlToPixels; //wave length with corrected to pixels

        this.points = Math.floor(width / this.pointDistance) + 2;
        // + 2 to prevent the wave not going till width when pointDistance is not divisible by width
        
        this.values = new Array(this.points);
        this.heightTransposeValues = new Array(this.points);
        this.interpolatedValues = new Array(width);

        this.generate(amplitude, height);
        this.calculateInterpolationPoints();

        this.amplitude = amplitude;
    }

    generate(amplitude, height){
        for(let i = 0; i < this.points; i++){
            const gradientVector = Math.random();
            this.values[i] = gradientVector * amplitude;

            this.heightTransposeValues[i] = this.values[i] * height;
        }
    }

    showPoints(minHeight) {
        for(let i = 0; i < this.points; i++) {
            circle(i * this.pointDistance,
                minHeight - this.heightTransposeValues[i], 5);
        }
    }

    calculateInterpolationPoints(){
        for(let i = 0; i < this.interpolatedValues.length; i++){
            let pointAIndex = Math.trunc(i / this.pointDistance);

            let a = this.values[pointAIndex];
            let b = this.values[pointAIndex + 1];

            let v0 = this.values[pointAIndex - 1] === undefined ? a : this.values[pointAIndex - 1];
            let v3 = this.values[pointAIndex + 2] === undefined ? b : this.values[pointAIndex + 2];

            let aXPos = pointAIndex * this.pointDistance;
            let bXPos = (pointAIndex + 1) * this.pointDistance;
            let t = transposeRange(aXPos, bXPos, i);
                
            // let pointInterpolatedValue = cosineInterpolation(a, b, t);
            let pointInterpolatedValue = cubicInterpolation(v0, a, b, v3, t);

            this.interpolatedValues[i] = pointInterpolatedValue;
        }
    }

    showPath(minAbsouleteHeight, viewHeight) {
        // let m = this.interpolatedValues.length - (this.interpolatedValues.length % 2);
        let previousPointY = 0;
        for(let i = 0; i < this.interpolatedValues.length; i++){
            let yFinalPos = minAbsouleteHeight - this.interpolatedValues[i] * viewHeight; //* this.amplitude

            line(i - 1, previousPointY, i, yFinalPos);
            previousPointY = yFinalPos;
        }   
    }
}

window.onload = () => {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    
    canvas.width = 1280;
    canvas.height = 1200;

    ctx.fillStyle = '#2b2d39';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#0b0e18';
    ctx.lineWidth = 2;
    line(0, 300, canvas.width, 300);
    line(0, 600, canvas.width, 600);
    line(0, 600, canvas.width, 600);

    ctx.lineWidth = 3;

    line(0, 900, canvas.width, 900);

    const firstOctaveGrid = new gridPoints(1, 1, canvas.width, 300);
    const secondOctaveGrid = new gridPoints(2, 1/4, canvas.width, 300);
    const thirdOctaveGrid = new gridPoints(8, 1/16, canvas.width, 300);

    ctx.fillStyle = 'rgba(164, 166, 175, 0.5)';

    firstOctaveGrid.showPoints(300);
    secondOctaveGrid.showPoints(600);
    thirdOctaveGrid.showPoints(900);

    ctx.strokeStyle = '#a4a6af';
    ctx.lineWidth = 1;

    firstOctaveGrid.showPath(300, 300);
    secondOctaveGrid.showPath(600, 300);
    thirdOctaveGrid.showPath(900, 300);

    // SUM OCTAVES

    let previousY = 0;
    for(let i = 0; i < canvas.width; i++){
        let f1v = firstOctaveGrid.interpolatedValues[i];
        let f2v = secondOctaveGrid.interpolatedValues[i];
        let f3v = thirdOctaveGrid.interpolatedValues[i];

        let finalV = f1v + f2v + f3v;

        let heightCorrectedV = finalV * 250; // 300 = max height
        // suming the octaves can end up with values higher then 1
        // so multiplaing by 300 can overflow the max height

        let y = 1200 - heightCorrectedV;

        line(i - 1, previousY, i, y);
        previousY = y;
    }
}

function line(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function circle(x, y, r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function cosineInterpolation(a, b, t){
    let f = (1 - Math.cos(t * Math.PI)) * .5;
    return a * (1-f) + b*f;
}

function cubicInterpolation(v0, v1, v2, v3, t){
    let t2 = t * t;
    let a0 = v3 - v2 - v0 + v1;
    let a1 = v0 - v1 - a0;
    let a2 = v2 - v0;
    let a3 = v1;

    return (a0 * t * t2 + a1 * t2 + a2 * t + a3);
}

function transposeRange(mm, mx, v){
    return (v - mm) / (mx - mm);
}