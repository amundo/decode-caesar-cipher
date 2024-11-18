import { englishLetterFrequencies } from "./english-letter-frequencies.js"
// Generate a random substitution cipher key
function generateSubstitutionKey() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const shuffled = alphabet.split("").sort(() => Math.random() - 0.5).join("");
  return shuffled;
}

// Encode using a substitution cipher
function substitutionCipherEncode(plaintext, key) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return plaintext.split("").map(char => {
      const isUpperCase = char === char.toUpperCase();
      const lowerChar = char.toLowerCase();

      if (alphabet.includes(lowerChar)) {
          const index = alphabet.indexOf(lowerChar);
          const encodedChar = key[index];
          return isUpperCase ? encodedChar.toUpperCase() : encodedChar;
      }
      return char; // Non-alphabetic characters remain unchanged
  }).join("");
}

// Decode using a substitution cipher key
function substitutionCipherDecode(ciphertext, key) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return ciphertext.split("").map(char => {
      const isUpperCase = char === char.toUpperCase();
      const lowerChar = char.toLowerCase();

      if (key.includes(lowerChar)) {
          const index = key.indexOf(lowerChar);
          const decodedChar = alphabet[index];
          return isUpperCase ? decodedChar.toUpperCase() : decodedChar;
      }
      return char; // Non-alphabetic characters remain unchanged
  }).join("");
}

// Analyze letter frequencies
function analyzeFrequency(text) {
  const frequencies = {};
  const totalLetters = text.match(/[a-z]/gi)?.length || 0;

  text.toLowerCase().replace(/[^a-z]/g, "").split("").forEach(char => {
      frequencies[char] = (frequencies[char] || 0) + 1;
  });

  for (let char in frequencies) {
      frequencies[char] = (frequencies[char] / totalLetters) * 100;
  }

  return frequencies;
}

// Calculate chi-squared statistic
function calculateChiSquared(observed, expected) {
  return Object.keys(expected).reduce((sum, char) => {
      const observedFreq = observed[char] || 0;
      const expectedFreq = expected[char];
      return sum + ((observedFreq - expectedFreq) ** 2) / expectedFreq;
  }, 0);
}

// Statistically decode a substitution cipher with refinement
function substitutionCipherStatisticalDecode(ciphertext, englishFrequencies) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const observedFrequencies = analyzeFrequency(ciphertext);

  // Step 1: Generate initial mapping based on frequencies
  const cipherLetters = Object.keys(observedFrequencies)
      .sort((a, b) => observedFrequencies[b] - observedFrequencies[a]);
  const englishLetters = Object.keys(englishFrequencies)
      .sort((a, b) => englishFrequencies[b] - englishFrequencies[a]);

  let key = {};
  cipherLetters.forEach((char, index) => {
      key[char] = englishLetters[index];
  });

  // Step 2: Decode using initial key
  let decodedText = decodeWithKey(ciphertext, key);

  // Step 3: Iterative refinement using bigram analysis
  const bigramFrequencies = getBigramFrequencies(decodedText);

  for (let i = 0; i < 100; i++) { // Run up to 100 iterations
      let improved = false;

      // Try swapping two letters in the key
      for (let a = 0; a < alphabet.length; a++) {
          for (let b = a + 1; b < alphabet.length; b++) {
              const swappedKey = swapKey(key, alphabet[a], alphabet[b]);
              const swappedDecoded = decodeWithKey(ciphertext, swappedKey);
              const newBigramFrequencies = getBigramFrequencies(swappedDecoded);

              if (evaluateBigramFrequencies(newBigramFrequencies) > evaluateBigramFrequencies(bigramFrequencies)) {
                  key = swappedKey;
                  decodedText = swappedDecoded;
                  improved = true;
              }
          }
      }

      if (!improved) break; // Stop if no improvement
  }

  return decodedText;
}

// Decode text using a substitution key
function decodeWithKey(ciphertext, key) {
  return ciphertext.split("").map(char => {
      const isUpperCase = char === char.toUpperCase();
      const lowerChar = char.toLowerCase();
      const decodedChar = key[lowerChar] || lowerChar;
      return isUpperCase ? decodedChar.toUpperCase() : decodedChar;
  }).join("");
}

// Swap two letters in a substitution key
function swapKey(key, a, b) {
  const swappedKey = { ...key };
  const temp = swappedKey[a];
  swappedKey[a] = swappedKey[b];
  swappedKey[b] = temp;
  return swappedKey;
}

// Get bigram frequencies
function getBigramFrequencies(text) {
  const bigrams = {};
  const totalBigrams = text.length - 1;

  for (let i = 0; i < text.length - 1; i++) {
      const bigram = text.slice(i, i + 2);
      bigrams[bigram] = (bigrams[bigram] || 0) + 1;
  }

  for (let bigram in bigrams) {
      bigrams[bigram] = bigrams[bigram] / totalBigrams;
  }

  return bigrams;
}

// Evaluate bigram frequencies (the closer to known English, the better)
function evaluateBigramFrequencies(frequencies) {
  const commonBigrams = ["th", "he", "in", "er", "an"];
  return commonBigrams.reduce((score, bigram) => {
      return score + (frequencies[bigram] || 0);
  }, 0);
}

export {
  generateSubstitutionKey,
  substitutionCipherEncode,
  substitutionCipherDecode,
  substitutionCipherStatisticalDecode,
  analyzeFrequency
};
