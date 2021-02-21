let canvas, ctx;

window.onload = () => {
    const POINTS = 10; // more points = higher frequency

    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d'); 

    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = '#2b2d39';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#0b0e18';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.closePath();

    // GENERATE RANDOM POINTS

    ctx.fillStyle = '#a4a6af';

    const pointsDist = Math.floor(canvas.width / POINTS);
    let gridValues = new Array();

    for(let i = 0; i <= POINTS; i++){
        const gradient1DVector = Math.random();
        gridValues.push(gradient1DVector);

        circle(i * pointsDist, (canvas.height / 2) - gradient1DVector * canvas.height / 2, 5);
        circle(i * pointsDist, canvas.height - gradient1DVector * canvas.height / 2, 5);
    }

    ctx.fillStyle = 'rgba(164, 166, 175, 0.5)'

    // for(let i = 0; i < gridValues.length; i++){
    //     circle(i * pointsDist, canvas.height - gridValues[i] * canvas.height / 2, 5);
    // }

    ctx.strokeStyle = '#a4a6af';
    ctx.lineWidth = 1;

    // INTERPOLATE

    let previousPointY = 0;
    for(let i = 0; i < canvas.width; i++){
        let aindex = Math.trunc(i / pointsDist);
        let a = gridValues[aindex];
        let b = gridValues[aindex + 1];

        let beforeA = gridValues[aindex - 1];
        let afterB  = gridValues[aindex + 2];

        let aXPos = aindex * pointsDist;
        let bXPos = (aindex + 1) * pointsDist;
        let t = transposeRange(aXPos, bXPos, i);

        // TODO: Cubic Interpolation Not working
        // let pointInterpolatedValue = cubicInterpolation(beforeA, a, b, afterB, t);
        
        let pointInterpolatedValue = cosineInterpolation(a, b, t);

        // circle(i, canvas.height - pointInterpolatedValue * canvas.height / 2, 1);
        let yFinalPos = canvas.height - pointInterpolatedValue * canvas.height / 2;

        ctx.beginPath();
        ctx.moveTo(i - 1, previousPointY);
        ctx.lineTo(i, yFinalPos);
        ctx.stroke();
        ctx.closePath();

        previousPointY = yFinalPos;
    }
}

function circle(x, y, r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function cubicInterpolation(v0, v1, v2, v3, t){
    let p = (v3 - v2) - (v0 - v1);
    let q = (v0 - v1) - p;
    let r = v2 - v0;
    let s = v1;

    return p * t * 3 + q * t * 2 + r * t + s;
}

function cosineInterpolation(a, b, t){
    let ft = t * Math.PI;
    let f = (1 - Math.cos(ft)) * .5;
    return a*(1-f) + b*f;
}

function transposeRange(mm, mx, v){
    // make the range start at 0
    let newMx = mx - mm;
    let newV = v - mm;
    
    let t = newV / newMx;
    return t;
}