ArrayList<PVector> gradientVectors = new ArrayList<PVector>();

int tileSize =  200; 
int xTiles, yTiles;

void setup(){
  size(800, 800);
  // background(#030f1c);
  
  xTiles = floor(width / tileSize) + 1;
  yTiles = floor(height / tileSize) + 1;
  
  generateVectors();
  iteratePixels();
  drawGrid();
  
  noLoop();
}

void generateVectors() {
  for(int i = 0; i < xTiles * yTiles; i++){
    gradientVectors.add(PVector.random2D());
  }
}

void iteratePixels(){
  loadPixels();
  
   for(int x = 0; x < width; x++){
     for(int y = 0; y < height; y++){
       
       // Find the 2D grid cell index
       int xIndex = floor(x / tileSize);
       int yIndex = floor(y / tileSize);
       
       // 1D Array Index, for Gradient Vector Array
       int v0 = xIndex + yIndex * yTiles,
       v1 = v0 + 1,
       v2 = v0 + yTiles,
       v3 = v2 + 1;
       
       // Offset Vectors
       // Aparently they ned to be unit vectors
       PVector v0dist = new PVector(x - xIndex * tileSize       , y - yIndex * tileSize);
       PVector v1dist = new PVector(x - (xIndex + 1) * tileSize , y - yIndex * tileSize);
       PVector v2dist = new PVector(x - xIndex * tileSize       , y - (yIndex + 1) * tileSize);
       PVector v3dist = new PVector(x - (xIndex + 1) * tileSize , y - (yIndex + 1) * tileSize);
       
       v0dist.normalize();
       v1dist.normalize();
       v2dist.normalize();
       v3dist.normalize();
       
       // Gradient Vectors
       PVector v0grad = gradientVectors.get(v0);
       PVector v1grad = gradientVectors.get(v1);
       PVector v2grad = gradientVectors.get(v2);
       PVector v3grad = gradientVectors.get(v3);
       
       // Dot Products
       float v0dot = PVector.dot(v0grad, v0dist);
       float v1dot = PVector.dot(v1grad, v1dist);
       float v2dot = PVector.dot(v2grad, v2dist);
       float v3dot = PVector.dot(v3grad, v3dist);
       
       // To unit square | Interpolation t
       PVector localPos = v0dist;
       float sx = localPos.x / tileSize;
       float sy = localPos.y / tileSize;
       
       // Cosine Interpolation
       float a = cosineInterpolation(v0dot, v1dot, sx);
       float b = cosineInterpolation(v2dot, v3dot, sx);
       float value = cosineInterpolation(a, b, sy);
       
       // print(value + "\n");
       
       // Map color (-1, 1) to (0, 255)
       int graySclColor = (int)map(value, -1, 1, 0, 255);
       
       //int finalColor = (int)(value * 255);
       int finalColor = graySclColor;
       
       int index = x + y * width;
       pixels[index] = color(finalColor, finalColor, finalColor);
     }
   }
  
  updatePixels();
}

float cosineInterpolation(float a, float b, float t){
  //float ft = t * PI;
  //float f  = (1 - cos(ft)) * 0.5;
  //return a * ( 1 - f) + b * f;
  return (1-t)*a + t*b;
}

void drawGrid(){
  stroke(255);
  
  for(int x = 0; x < xTiles; x++){
    line(x * tileSize, 0, x * tileSize, height);
  }
  
  for(int y = 0; y < yTiles; y++){
    line(0, y * tileSize, width, y * tileSize);
  }
  
  drawVectors();
}

void drawVectors(){
  stroke(color(255, 0, 100));
  strokeWeight(2);
  
  for(int i = 0; i < gradientVectors.size(); i++){
    int x = i % xTiles,
        y = round(i / yTiles);
    
    int xPos = x * tileSize,
        yPos = y * tileSize;
        
    PVector vector = gradientVectors.get(i);
    // vector.setMag(tileSize / 2);
    
    line(xPos, yPos, xPos + vector.x * (tileSize / 2), yPos + vector.y * (tileSize / 2));
  }
}
