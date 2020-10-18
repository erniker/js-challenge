function Count(input) {
  if (input < 0) throw new RangeError();
  // Convert to binary
  binary = input.toString(2);
  // Reverse binary
  reverseBinary = binary.split("").reverse().join("");
  //Convert to array
  BinaryArray = reverseBinary.split("");
  // Init positive count and list of results of the algorithm
  oneBitCount = 0;
  results = [];
  for (i = 0; i <= BinaryArray.length - 1; i++) {
    if (BinaryArray[i] == 1) {
      oneBitCount++;
      results.push(i);
    }
  }
  // Insert oneBitsCount on the first postions in the results list
  results.unshift(oneBitCount);

  return results;
}

module.exports = { Count };
