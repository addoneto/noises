// Javascript transpiled version
// Enable better debugging

int tileSize = 80;
int xTiles, yTiles; 
ArrayList<PVector> gradientVectors = new ArrayList<PVector>();

void setup(){
    size(800, 800);
    xTiles = floor(width / tileSize) + 1;
    yTiles = floor(height / tileSize) + 1;
    generateGradientVectors();
    iteratePixels();
    drawGrid();
}

void generateGradientVectors(){
    for(int i = 0; i < xTiles * yTiles; i++){
        gradientVectors.add(PVector.random2D());
    }
}

void iteratePixels(){
    loadPixels();

    for(int y = 0; y < height; y++){
        for(int x = 0; x < width; x++){
            
            int xIndex = floor(x / tileSize);
            int yIndex = floor(y / tileSize);

            int v0 = xIndex + yIndex * yTiles,
                v1 = v0 + 1,
                v2 = v0 + yTiles,
                v3 = v2 + 1;

            PVector v0disatance = new PVector(x - xIndex * tileSize      , y - yIndex * tileSize);
            PVector v1disatance = new PVector(x - (xIndex + 1) * tileSize, y - yIndex * tileSize);
            PVector v2disatance = new PVector(x - xIndex * tileSize      , y - (yIndex + 1) * tileSize);
            PVector v3disatance = new PVector(x - (xIndex + 1) * tileSize, y - (yIndex + 1) * tileSize);

            v0disatance.normalize();
            v1disatance.normalize();
            v2disatance.normalize();
            v3disatance.normalize();

            PVector v0gradient = gradientVectors.get(v0);
            PVector v1gradient = gradientVectors.get(v1);
            PVector v2gradient = gradientVectors.get(v2);
            PVector v3gradient = gradientVectors.get(v3);

            float v0toDistanceScalar = PVector.dot(v0gradient, v0disatance);
            float v1toDistanceScalar = PVector.dot(v1gradient, v1disatance);
            float v2toDistanceScalar = PVector.dot(v2gradient, v2disatance);
            float v3toDistanceScalar = PVector.dot(v3gradient, v3disatance);

            float sx = (x - xIndex * tileSize) / tileSize;
            float sy = (y - yIndex * tileSize) / tileSize;

            float a = interpolate(v0toDistanceScalar, v1toDistanceScalar, sx);
            float b = interpolate(v2toDistanceScalar, v3toDistanceScalar, sx);
            float v = interpolate(a, b, sy);

            //int gColor = (int)((v + 1) / 2 * 255);
            //print(v + "\n");
            
            int gColor = (int)map(v, -1 , 1, 0, 255);

            int i = x + y * width;
            pixels[i] = color(gColor, gColor, gColor);

        }
    }

    updatePixels();
}

void drawGrid(){
    stroke(#0b0e18);

    for(int x = 0; x < xTiles; x++){
        line(x * tileSize, 0, x * tileSize, height);
    }

    for(int y = 0; y < yTiles; y++){
        line(0, y * tileSize, width, y * tileSize);
    }

    drawVectors();
}

float interpolate(float a, float b, float t){
    float ft = t * PI;
    float f = (1 - cos(ft)) * .5;
    return a*(1-f) + b*f;
}

void drawVectors() {
    stroke(#a4a6af);
    for(int i = 0; i < gradientVectors.size(); i++){
        int x = i % xTiles,
            y = Math.round(i / yTiles);

        int xPos = x * tileSize,
            yPos = y * tileSize;

        PVector v = gradientVectors.get(i);

        line(xPos, yPos, xPos + v.x * tileSize / 2, yPos + v.y * tileSize / 2);
    }
}
