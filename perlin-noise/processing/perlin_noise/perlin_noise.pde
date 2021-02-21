int xGridCells, yGridCells, gridCellSize = 50;
ArrayList<PVector> gradientVectors = new ArrayList<PVector>();

void setup(){
  size(1000, 1000); 
  
  xGridCells = floor(width / gridCellSize) + 1;
  yGridCells = floor(height / gridCellSize) + 1;
  
  generateGradientVectors();
  
  iteratePixels();
  
  // drawGrid();
  // drawVectors();
  
  noLoop();
}

void generateGradientVectors(){
  for(int i = 0; i < xGridCells * yGridCells; i++){
    gradientVectors.add(PVector.random2D());
  }
}

void drawGrid(){
  stroke(color(255, 150, 150));
  
  for(int x = 0; x < xGridCells; x++){
    line(x * gridCellSize, 0, x * gridCellSize, height);
  }

  for(int y = 0; y < yGridCells; y++){
    line(0, y * gridCellSize, width, y * gridCellSize);
  }
}

void drawVectors(){
  stroke(color(150, 150, 255));
  
  for(int i = 0; i < gradientVectors.size(); i++){
    int x = i % xGridCells,
        y = round(i / yGridCells);
        
    int xPos = x * gridCellSize,
        yPos = y * gridCellSize; 
        
    PVector v = gradientVectors.get(i);
    
    line(xPos, yPos, xPos + v.x * gridCellSize / 2, yPos + v.y * gridCellSize / 2);
  }
}

void iteratePixels(){
  loadPixels();
  
  for(int y = 0; y < height; y++){
    for(int x = 0; x < width; x++){
      int xIndex = floor(x / gridCellSize),
          yIndex = floor(y / gridCellSize);
          
      PVector g0 = gradientVectors.get(xIndex + yIndex * xGridCells),
              g1 = gradientVectors.get(xIndex + yIndex * xGridCells + 1),
              g2 = gradientVectors.get(xIndex + yIndex * xGridCells + xGridCells),
              g3 = gradientVectors.get(xIndex + yIndex * xGridCells + xGridCells + 1);
              
      PVector d0 = new PVector(x - xIndex     * gridCellSize, y - yIndex     * gridCellSize).normalize(),
              d1 = new PVector(x - (xIndex+1) * gridCellSize, y - yIndex     * gridCellSize).normalize(),
              d2 = new PVector(x - xIndex     * gridCellSize, y - (yIndex+1) * gridCellSize).normalize(),
              d3 = new PVector(x - (xIndex+1) * gridCellSize, y - (yIndex+1) * gridCellSize).normalize();
      
      float s0 = PVector.dot(g0, d0), s1 = PVector.dot(g1, d1), s2 = PVector.dot(g2, d2),
            s3 = PVector.dot(g3, d3);
            
      //  float sx = (x - xIndex * gridCellSize) / gridCellSize,
      //        sy = (y - yIndex * gridCellSize) / gridCellSize;
     
      float xGridRelativePos = x - xIndex * gridCellSize,
            yGridRelativePos = y - yIndex * gridCellSize;
            
      float sx = map(xGridRelativePos, 0, gridCellSize, 0, 1),
            sy = map(yGridRelativePos, 0, gridCellSize, 0, 1);
            
      float f0 = cosineInterp(s0, s1, sx),
            f1 = cosineInterp(s2, s3, sx),
            v  = cosineInterp(f0, f1, sy);
            
      int finalC = (int)((v + 1) / 2 * 255);
      
      int pixelIndex = x + y * width;
      pixels[pixelIndex] = color(finalC, finalC, finalC);
    }
  }
  
  updatePixels();
}

float cosineInterp(float a, float b, float t){
  float t2 = ( 1 - cos(t * PI)) / 2;
  return (a * (1 - t2) + b * t2);
}
