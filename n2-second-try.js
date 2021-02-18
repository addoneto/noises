// FROM https://en.wikipedia.org/wiki/Perlin_noise
// TODO: Fix all this mess

class Perlin {

    static interpolate(a, b, t){
        return Perlin.cosineInterpolation(a, b, t);
    }

    static lerp(a, b, t){
        return (b - a) * t + a;
    }

    static cosineInterpolation(a, b, t){
        let ft = t * Math.PI;
        let f = (1 - Math.cos(ft)) * .5;
        return a*(1-f) + b*f;
    }

    static cubicInterpolation(v0, v1, v2, v3, x){
        return v1 + 0.5 * x*(v2 - v0 + x*(2.0*v0- 5.0*v1 + 4.0*v2 - v3 + x*(3.0*(v1 - v2) + v3 - v0)));
    }

    // TODO: bicubic
    // Thanks https://www.paulinternet.nl/?page=bicubic
    // public class BicubicInterpolator extends CubicInterpolator
    // {
    //     private double[] arr = new double[4];

    //     public double getValue (double[][] p, double x, double y) {
    //         arr[0] = getValue(p[0], y);
    //         arr[1] = getValue(p[1], y);
    //         arr[2] = getValue(p[2], y);
    //         arr[3] = getValue(p[3], y);
    //         return getValue(arr, x);
    //     }
    // }
        
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
        // I realized that this is used kind like a seed, cause this values return always the same image / values
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

    // Offset increment define the frequency of the noise
    // Higher increment mean lower frequency

    let yoffset = 0;
    for(let y = 0; y < canvas.height; y++){
        let xoffset = 0;
        for(let x = 0; x < canvas.width; x++){
            let i = (x + y * canvas.width) * 4;

            let value = Perlin.noise(xoffset, yoffset);
            let color = map(value, -1, 1, 0, 255);
            // let color = value * 255;

            pixels[i] = color;
            pixels[i+1] = color;
            pixels[i+2] = color;
            pixels[i+3] = 255;

            xoffset += 0.009;
        }
        yoffset += 0.009;
    }

    ctx.putImageData(canvasImg, 0, 0);
}

// TODO: simplify converting -1 - 1 to 0 - 255
function map(value, start1, stop1, start2, stop2) {
    return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}