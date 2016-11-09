# ndrand
A class used to generate a nonuniform distribution of random numbers.

## Usage

```
var ndr = require('ndrand');

ndr.initialize([
  {x:0,y:0},
  {x:5,y:5},
  {x:10,y:0},
]);

console.log(ndr.random());
```

## Algorithm Initialization

The user initializes the class with an array of x,y pairs describing the desired distribution. Two consecutive pairs ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_%7Bn-1%7D%2Cy_%7Bn-1%7D%5Cright%5C%7D) and ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_n%2Cy_n%5Cright%5C%7D) form a trapezoid like so.

![trapezoid](docs/trapezoid.png)

Where the height of two sides are ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20y_%7Bn-1%7D) and ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20y_n) respectively and the width is ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20x_n-x_%7Bn-1%7D)

The area of the trapeziod is the average of the two heights multiplied by the width and can be written like so.

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20A%3D%5Cleft%28%5Cfrac%7By_%7Bn-1%7D&plus;y_n%7D%7B2%7D%5Cright%29%5Cleft%28x_n-x_%7Bn-1%7D%5Cright%29)

During initialization, we calculate the area of each trapezoid to obtain the total area of the distribution. Along the way we record the cumulative area (```cumArea```) at each pair. This represents the area of all trapezoids to the left of the current pair. As such, the cumulative area of the first pair is 0 and the cumulative area of the last pair is the total area of the distribution.

We then go back and using the cumulative area of each pair and total area previously computed, calculate the cumulative distribution (```cumDist```) of each pair. The distribution represents the percentage of numbers in the distribution to the left of the current pair. Consequently, the cumulative distribution of the first pair is 0 and the cumulative distribution of the last pair is 1.0

## Generation Algorithm

Given a uniform distributed random (```udr```) number from 0-1 we treat this as a percentage of the overall area of the nonuniform distribution curve (```ndc```) and try to find the value ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20x_%7Bpa%7D) where the ratio of the area of the ```ndc``` to left to the total area exactly matches the ```udr```.

We do this by first determining which trapezoid that contains the area we are looking for. This will be the trapezoid formed by the consecutive pairs ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_%7Bn-1%7D%2Cy_%7Bn-1%7D%5Cright%5C%7D) and ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_n%2Cy_n%5Cright%5C%7D) where the ```cumDist``` of ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_%7Bn-1%7D%2Cy_%7Bn-1%7D%5Cright%5C%7D) is less than ```udr``` and the ```cumDist``` of ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_n%2Cy_n%5Cright%5C%7D) is greater than ```udr```. From there we calculate the target volume by multiplying the ```udr``` by the ```cumArea``` of the last pair in the ```ndc``` and then subtract the ```cumArea``` of the ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_%7Bn-1%7D%2Cy_%7Bn-1%7D%5Cright%5C%7D) pair to obtain the ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20A_%7Bpa%7D). This is the area of the trapezoid formed by the pairs ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_%7Bn-1%7D%2Cy_%7Bn-1%7D%5Cright%5C%7D) and ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cleft%5C%7Bx_%7Bpa%7D%2Cy_%7Bpa%7D%5Cright%5C%7D) in the figure below.

![partial trapezoid](docs/partial_trapezoid.png)

Given ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20A_%7Bpa%7D) we can calculate ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20x_%7Bpv%7D) using the the previous equation for the area of a trapezoid like so.

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20A_%7Bpa%7D%3D%5Cleft%28%5Cfrac%7By_%7Bn-1%7D&plus;y_%7Bpa%7D%7D%7B2%7D%5Cright%29%5Cleft%28x_%7Bpa%7D-x_%7Bn-1%7D%5Cright%29) where ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20y_%7Bpa%7D%3D%5Cleft%28%5Cfrac%7By_n-y_%7Bn-1%7D%7D%7Bx_n-x_%7Bn-1%7D%7D%5Cright%29%5Cleft%28x_%7Bpa%7D-x_%7Bn-1%7D%5Cright%29&plus;y_%7Bn-1%7D)

substituting  ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20m%3D%5Cleft%28%5Cfrac%7By_n-y_%7Bn-1%7D%7D%7Bx_n-x_%7Bn-1%7D%7D%5Cright%29) we can simplify  this as

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20A_%7Bpa%7D%3D%5Cleft%28%5Cfrac%7By_%7Bn-1%7D&plus;%5Cleft%28m%5Cleft%28x_%7Bpa%7D-x_%7Bn-1%7D%5Cright%29&plus;y_%7Bn-1%7D%5Cright%29%7D%7B2%7D%5Cright%29%5Cleft%28x_%7Bpa%7D-x_%7Bn-1%7D%5Cright%29)

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20A_%7Bpa%7D%3D%5Cleft%28%5Cfrac%7Bm%7D%7B2%7Dx_%7Bpa%7D-%5Cfrac%7Bm%7D%7B2%7Dx_%7Bn-1%7D&plus;y_%7Bn-1%7D%5Cright%29%5Cleft%28x_%7Bpa%7D-x_%7Bn-1%7D%5Cright%29)

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20A_%7Bpa%7D%3D%5Cfrac%7Bm%7D%7B2%7Dx_%7Bpa%7D%5E2-mx_%7Bn-1%7Dx_%7Bpa%7D&plus;y_%7Bn-1%7Dx_%7Bpa%7D&plus;%5Cfrac%7Bm%7D%7B2%7Dx_%7Bn-1%7D%5E2-y_%7Bn-1%7Dx_%7Bn-1%7D)

![math](https://latex.codecogs.com/svg.latex?%5Clarge%200%3D%5Cfrac%7Bm%7D%7B2%7Dx_%7Bpa%7D%5E2&plus;%5Cleft%28y_%7Bn-1%7D-mx_%7Bn-1%7D%5Cright%29x_%7Bpa%7D&plus;%5Cleft%28%5Cfrac%7Bm%7D%7B2%7Dx_%7Bn-1%7D%5E2-y_%7Bn-1%7Dx_%7Bn-1%7D-A_%7Bpa%7D%5Cright%29)

which is a quadratic equation of the form

![math](https://latex.codecogs.com/svg.latex?%5Clarge%200%3Dax%5E2&plus;bx&plus;c)

where

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20a%3D%5Cfrac%7Bm%7D%7B2%7D)

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20b%3Dy_%7Bn-1%7D-mx_%7Bn-1%7D)

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20c%3D%5Cfrac%7Bm%7D%7B2%7Dx_%7Bn-1%7D%5E2-y_%7Bn-1%7Dx_%7Bn-1%7D-A_%7Bpa%7D)

thus we can solve for ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20x_%7Bpa%7D) using the quadratic equation

![math](https://latex.codecogs.com/svg.latex?%5Clarge%20x_%7Bpa%7D%3D%5Cfrac%7B-b%5Cpm%5Csqrt%7Bb%5E2-4ac%7D%7D%7B2a%7D)

The term ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cfrac%7B-b%7D%7B2a%7D) is called the axis of symetry (```aos```) whereas ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20%5Cfrac%7B%5Csqrt%7Bb%5E2-4ac%7D%7D%7B2a%7D) represents the distance (```distance```) from the ```aos```

The algorithm will add or subtract the ```distance``` form the ```aos``` to find the value that falls between ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20x_%7Bn-1%7D) and ![math](https://latex.codecogs.com/svg.latex?%5Clarge%20x_n)
