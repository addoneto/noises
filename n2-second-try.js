// FROM https://en.wikipedia.org/wiki/Perlin_noise
// TODO: Fix

class Perlin {

    // lerp TODO: -> bicubic
    static interpolate(a, b, t){ return (b - a) * t + a; }
    
    static gridScalarProduct(ix, iy, x, y) {
        let gradient = Vector2.randomUnit(ix, iy);

        // Distance / Offset Vectors
        let dx = x - ix;
        let dy = y - iy;

        // Dot product
        return dx * gradient.x + dy * gradient.y;
    }

    static noise(x, y){
        // Determine grid cell coordinates
        let x0 = Math.floor(x);
        let x1 = x0 + 1;
        let y0 = Math.floor(y);
        let y1 = y0 + 1;

        // Determine interpolation weights
        let sx = x - x0;
        let sy = y - y0;

        // Interpolate between grid point gradients
        let n0, n1, ix0, ix1, value;

        n0 = Perlin.gridScalarProduct(x0, y0, x, y);
        n1 = Perlin.gridScalarProduct(x1, y0, x, y);
        ix0 = Perlin.interpolate(n0, n1, sx);

        n0 = Perlin.gridScalarProduct(x0, y1, x, y);
        n1 = Perlin.gridScalarProduct(x1, y1, x, y);
        ix1 = Perlin.interpolate(n0, n1, sx);

        value = Perlin.interpolate(ix0, ix1, sy);
        return value;
    }

}

class Vector2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    // used to generate the gradient vectors
    static randomUnit(ix, iy){
        // let angle = Math.random() * Math.PI * 2;
        // let x = Math.cos(angle);
        // let y = Math.sin(angle);
        // return new Vector2(x, y);

        // TODO: why ???????????????????????
        // Random float. No precomputed gradients mean this works for any number of grid coordinates
        let angle = 2920 * Math.sin(ix * 21942 + iy * 171324 + 8912) * Math.cos(ix * 23157 * iy * 217832 + 9758);
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }
}


let canvas, ctx;

window.onload = () => {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    let canvasImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = canvasImg.data;

    for(let y = 0; y < canvas.height; y++){
        for(let x = 0; x < canvas.width; x++){
            let i = (x + y * canvas.width) * 4;

            let value = Perlin.noise(x, y);
            let color = map(value, -1, 1, 0, 255);

            pixels[i] = color;
            pixels[i+1] = color;
            pixels[i+2] = color;
            pixels[i+3] = 255;
        }
    }

    ctx.putImageData(canvasImg, 0, 0);
}

// TODO: simplify converting -1 - 1 to 0 - 255
function map(value, start1, stop1, start2, stop2) {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}