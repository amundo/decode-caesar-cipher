function initializeMappingTable() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const alphabetRow = document.getElementById("alphabet-row");
  const mappingRow = document.getElementById("mapping-row");

  // Populate the alphabet row
  alphabetRow.innerHTML = "";
  for (const letter of alphabet) {
    const cell = document.createElement("th");
    cell.textContent = letter.toUpperCase();
    alphabetRow.appendChild(cell);
  }

  // Populate the mapping row (initially empty)
  mappingRow.innerHTML = "";
  for (let i = 0; i < alphabet.length; i++) {
    const cell = document.createElement("td");
    cell.textContent = "-"; // Placeholder until mappings are updated
    mappingRow.appendChild(cell);
  }
}

function updateMappingRow(mapping) {
  const mappingRow = document.getElementById("mapping-row");
  const cells = mappingRow.querySelectorAll("td");

  Object.keys(mapping).forEach((letter, index) => {
    cells[index].textContent = mapping[letter]?.toUpperCase() || "-";
  });
}


export {
  initializeMappingTable,
  updateMappingRow
}