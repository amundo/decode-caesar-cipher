import {englishLetterFrequencies} from "./english-letter-frequencies.js";

let caesarCipherDecode = (text, shift) => {
    return text.split("").map(char => {
        if (/[a-z]/i.test(char)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
        }
        return char; // Non-alphabetic characters remain unchanged
    }).join("");
}

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

let calculateChiSquared = (observed, expected) => Object.keys(expected)
  .reduce((sum, character) => {
        const observedFreq = observed[character] || 0
        const expectedFreq = expected[character]

        return sum + ((observedFreq - expectedFreq) ** 2) / expectedFreq
    }, 0)

function statisticalCaesarCipherDecode(cipherText) {
    let bestShift = 0;
    let lowestChiSquared = Infinity;

    for (let shift = 0; shift < 26; shift++) {
        const decryptedText = caesarCipherDecode(cipherText, shift);
        const observedFrequencies = analyzeFrequency(decryptedText);
        const chiSquared = calculateChiSquared(observedFrequencies, englishLetterFrequencies);

        if (chiSquared < lowestChiSquared) {
            lowestChiSquared = chiSquared;
            bestShift = shift;
        }
    }

    return {
        decodedText: caesarCipherDecode(cipherText, bestShift),
        shift: bestShift
    };
}

function caesarCipherEncode(text, shift) {
    return text.split("").map(char => {
        if (/[a-z]/i.test(char)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        }
        return char; // Non-alphabetic characters remain unchanged
    }).join("");
}

if(import.meta.main){

  // Example Usage
  const plainText = "this is a test of the emergency broadcast system.";
  const shiftKey = 3;
  
  const cipherText = caesarCipherEncode(plainText, shiftKey);
  const decodedText = 
  console.log("Cipher Text:", cipherText);
  console.log(statisticalCaesarCipherDecode(cipherText))
}

export {
  caesarCipherDecode,
  statisticalCaesarCipherDecode,
  caesarCipherEncode
}