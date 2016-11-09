var ndr = require('./index.js');

function main(args) {
  'use strict';

  ndr.initialize([
    {x:0, y:0},
    {x:5, y:5},
    {x:10, y:0},
    {x:15, y:5},
    {x:20, y:0}
  ]);

  console.log("--- Ditribution 1 ---");
  console.log("0.0 = " , ndr.getValue(0));
  console.log("0.1 = " , ndr.getValue(0.1));
  console.log("0.2 = " , ndr.getValue(0.2));
  console.log("0.3 = " , ndr.getValue(0.3));
  console.log("0.4 = " , ndr.getValue(0.4));
  console.log("0.5 = " , ndr.getValue(0.5));
  console.log("0.6 = " , ndr.getValue(0.6));
  console.log("0.7 = " , ndr.getValue(0.7));
  console.log("0.8 = " , ndr.getValue(0.8));
  console.log("0.9 = " , ndr.getValue(0.9));
  console.log("1 = " , ndr.getValue(1));


  ndr.initialize([
    {x:0,y:0},
    {x:5,y:5},
    {x:10,y:0},
  ]);

  console.log("--- Ditribution 2 ---");

  var table = [];

  for(var i = 0; i <= 1000000; i += 1) {
    var slot = Math.floor(ndr.random());
    table[slot] = table[slot] || 0;
    table[slot] += 1;
  }

  for(var i = 0; i <= table.length; i += 1)
  console.log(i + " = " + (table[i]/10000));
};

main(process.argv);
