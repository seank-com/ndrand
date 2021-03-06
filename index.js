//
// Author: Sean Kelly
// Copyright (c) 2016 by Sean Kelly. All right reserved.
// Licensed under the MIT license.
// See LiCENSE file in the project root for full license information.
//

//
// NDRandom is initialized with an array of x,y pairs discribing the shape
// of the distribution.
//
function NDRandom(ndc) {
  'use strict';

  var totalArea = 0;

  if (ndc.length < 2) {
    this.err = new Error("Distribution must contain at least 2 pairs");
  } else {
    this.ndc = ndc;
    this.ndc[0].cumArea = 0;

    // calculate total area and cumulative area for each pair
    for(let n = 1; n < this.ndc.length; n += 1) {
      if (this.ndc[n].x <= this.ndc[n - 1].x) {
        this.err = new Error("Distribution pairs must be increasing");
      }
      if (this.ndc[n].x !== 0 || this.ndc[n - 1].x !== 0) {
        // accumulate the area of the current trapezoid if non-zero
        totalArea += (this.ndc[n].x - this.ndc[n - 1].x) * ((this.ndc[n].y + this.ndc[n - 1].y)/2);
      }
      // save the area so far of all the trapezoids that have come before
      this.ndc[n].cumArea = totalArea;
    }

    for (let n = 0; n < this.ndc.length; n += 1) {
      // now calculate the distribution percentage of this
      // trapezoid as a percentage of the cumulative area
      // over the entire area
      this.ndc[n].cumDist = this.ndc[n].cumArea / totalArea;
    }
  }
};

NDRandom.prototype.getValue = function (udr) {
  'use strict';

  if (this.err) {
    return this.err;
  } else {
    for(let n = 1; n < this.ndc.length; n += 1) {
      // if the uniform distribution value is
      // less than the distribution value of
      // the current trapezoid then we have
      // found the trapezoid where our value
      // belongs
      if (udr <= this.ndc[n].cumDist) {
        let xn1 = this.ndc[n - 1].x, // the x on the left side of the trapezoid
          yn1 = this.ndc[n - 1].y, // the y on the left side of the trapezoid
          xn = this.ndc[n].x, // the x on the right side of the trapezoid
          yn = this.ndc[n].y, // the y on the right side of the trapezoid
          an1 = this.ndc[n - 1].cumArea, // the cumulative area to the left
          apa = (udr * this.ndc[this.ndc.length - 1].cumArea) - an1; // the target partial volume of the trapezoid

        // do we have a trapizoid?
        if ((yn - yn1) !== 0) {
          let m = (yn - yn1)/(xn - xn1), // the slope of the top of the trapezoid
            a = m/2, // first coefficient of the quadratic equation
            b = yn1-(xn1 * m), // second coefficient of the quadratic equation
            c = ((xn1 * xn1 * m/2) - (xn1 * yn1) - apa), // constant value of the quadratic equation
            aos = (-1 * b) / (2 * a), // axis of symmetry
            distance = Math.sqrt((b * b) - (4 * a * c)) / (2 * a), // distance from aos
            xpa = aos - distance; // the partial x we are solving for
  
          // one of these will be in the target range
          // the other will not
          if (xpa < xn1 || xpa > xn) {
            xpa = aos + distance;
          }
          return xpa;
        } else {
          // calculate the rectangle
          let xpa = (apa / yn1) + xn1;

          if (yn1 !== yn) {
            return new Error("Segment is not a rectangle")
          }

          return xpa;          
        }
      }
    }
  }
};

NDRandom.prototype.random = function () {
  let result=this.getValue(Math.random());
  return result;
}

module.exports=NDRandom;

var ndr = null;
exports.initialize = function(ndc) { // legacy
 ndr = new NDRandom(ndc);
}

exports.getValue = function(udr) { // legacy
  if (ndr) {
    return ndr.getValue(udr);
  }
  return new Error("You must call initialize first");
}

exports.random = function () { // legacy
  if (ndr) {
    return ndr.random();
  }
  return new Error("You must call initialize first");
}
