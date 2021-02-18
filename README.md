# Learning Perlin Noise 

## References
[Wikipedia Article](https://en.wikipedia.org/wiki/Perlin_noise)
[Concept Explanation](https://web.archive.org/web/20080724063449/http://freespace.virgin.net/hugo.elias/models/m_perlin.htm)

### Implemantations

[Javascript Article 2](https://joeiddon.github.io/projects/javascript/perlin)
[Javascript Article 1](http://asserttrue.blogspot.com/2011/12/perlin-noise-in-javascript_31.html)

## Overall Steps

1. Given an n-dimentional space, difine a grid (points distributed at regular steps). The distance between each point of the grid will define the frequency of the noise wave, more space means a lower frequency.
2. For each of these grid nodes assign a random unit vector (length/magnitude = 1) of n-dimentional [number of dimentions define the vector matrix]
3. Given an n-dimentional argument for the noise function calculate its value based on the vectors on the tile the point is in. This usually involves interpolate between values.

In 2 dimentional perlin noise, for example, we ussualy do the dot product of the vectors and a `distance vector` (vector from the point in the start of a tile/node) and than smoothly transition the values using bicubic interpolation.

## 1 Dimentional Perlin Noise

Approaching the problem in just 1 dimentional first is quite easy. We define the grid defining points in regular interval, than for each point of the grid we need to define the gradient vector, since we are in 1D a vector is just a normal value (unit vector so between 0 - 1). In this point just transitioning the value of the points with cubit interpolation or cosine interpolation should give a fairly decent perlin noiseish result.

In more dimentionals, though, vector multiplication takes place to calculate a offset vector value that is then interpolated.

\* [Cubic Interpolation](https://www.paulinternet.nl/?page=bicubic)

![1D Octaves Noise Overlay Preview](https://user-images.githubusercontent.com/25326579/108261448-6a4acf80-7142-11eb-93ec-d0ac8e8f77f1.png)

## 2 Dimentional Perlin Noise

- [ ] Add Explanation
- [ ] Bicubic interpolation
- [ ] Octave Layering

![2d Preview](https://user-images.githubusercontent.com/25326579/108288033-99753700-716a-11eb-8ab6-db76980dcc9b.png)


## Permutation 

- [ ] Concept