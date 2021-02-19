# Learning Perlin & Value Procedural and Coherent Noise 

## Value Noise

In value noise we difine a grid of values, closer a pixel is to the respective grid vertex, closer its value is. In higher frequency this can results in pretty blocky images, however with more reasonable frequencys the result is interesting.

Perlin noise, in the other hand uses gradient vectors that kinda push values in certain directions.

![Value Noise Preview](https://user-images.githubusercontent.com/25326579/108519255-3d183180-72a8-11eb-9963-a272657c489d.png)

## Perlin Noise

### References
[Wikipedia Article](https://en.wikipedia.org/wiki/Perlin_noise)<br>
[Concept Explanation](https://web.archive.org/web/20080724063449/http://freespace.virgin.net/hugo.elias/models/m_perlin.htm) <br>
[Visual Explanation](https://www.youtube.com/watch?v=MJ3bvCkHJtE)

#### Implemantations

[Javascript Article 2](https://joeiddon.github.io/projects/javascript/perlin) <br>
[Javascript Article 1](http://asserttrue.blogspot.com/2011/12/perlin-noise-in-javascript_31.html) <br>
[Ken Perlin implementation](https://mrl.cs.nyu.edu/~perlin/noise/)

### Overall Steps

1. Given an n-dimentional space, difine a grid (points distributed at regular steps). The distance between each point of the grid will define the frequency of the noise wave, more space means a lower frequency.
2. For each of these grid nodes assign a random unit vector (length/magnitude = 1) of n-dimentional [number of dimentions define the vector matrix]
3. Given an n-dimentional argument for the noise function calculate its value based on the vectors on the tile the point is in. This usually involves interpolate between values.

In 2 dimentional perlin noise, for example, we ussualy do the dot product of the vectors and a `distance vector` (vector from the point in the start of a tile/node) and than smoothly transition the values using bicubic interpolation.

### 1 Dimentional Perlin Noise

Approaching the problem in just 1 dimentional first is quite easy. We define the grid defining points in regular interval, than for each point of the grid we need to define the gradient vector, since we are in 1D a vector is just a normal value (unit vector so between 0 - 1). In this point just transitioning the value of the points with cubit interpolation or cosine interpolation should give a fairly decent perlin noiseish result.

In more dimentionals, though, vector multiplication takes place to calculate a offset vector value that is then interpolated.

\* [Cubic Interpolation](https://www.paulinternet.nl/?page=bicubic)
 [Cubic Interpolation 2](http://paulbourke.net/miscellaneous/interpolation/#:~:text=Often%20a%20smoother%20interpolating%20function,smooth%20transition%20between%20adjacent%20segments.&text=Cubic%20interpolation%20is%20the%20simplest,true%20continuity%20between%20the%20segments.)

![1D Octaves Noise Overlay Preview](https://user-images.githubusercontent.com/25326579/108261448-6a4acf80-7142-11eb-93ec-d0ac8e8f77f1.png)
\* I'm using cosine interpolation in this example

### 2 Dimentional Perlin Noise

- [ ] Generate gradient vectors in each vertex of the gris
- [ ] Find the grid the current pixel is in
- [ ] Define Distance Vectors from each corner of the cell to the pixel
- [ ] Calculate the Scalar Product of the distance vectors to the gradient vectors
- [ ] Interpolate the results and map the value to a 0 - 255 value

### Further experiments

- [x] Octave Layering
    As in 1d perlin noise you can overlay noise values of degressing amplitudes and increasing frequency to get more interesting noise results
- [ ] Bicubic interpolation
- [ ] Three.js Procedural Terrain Mesh with Perlin Noise

![2d Preview](https://user-images.githubusercontent.com/25326579/108288033-99753700-716a-11eb-8ab6-db76980dcc9b.png)
\* Using seeds to generate random unit vectors. This means that non vector need to be pregenerated

#### Failed Tries

![Error 2d 1](https://user-images.githubusercontent.com/25326579/108421066-66d34900-7213-11eb-9cc4-104ee3cf59ab.png)
![Error 2d 2](https://user-images.githubusercontent.com/25326579/108421071-676bdf80-7213-11eb-8afa-e8938d60ab33.png)


### Permutation 

Permutations combined with seeds are used for defining the gradient vectors and can define the look of the noise and also can be used to repete noise values, stores on the seed. The implemantation changes a bit while using permutation matrix and seeds and can get overcomplicated to the scope I desire to this project.