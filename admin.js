// ===============================
// ===============================
// Admin Dashboard – StudiPark
// ===============================
// ===============================

// ===============================
// Daten und Arrays
// ===============================

// Arrays für parkingData

const parkingData = {
  West: [
    { row: 1, capacity: 24, occupied: 18, status: "Online" },
    { row: 2, capacity: 24, occupied: 12, status: "Online" },
    { row: 3, capacity: 24, occupied: 20, status: "Online" },
    { row: 4, capacity: 24, occupied: 10, status: "Online" },
    { row: 5, capacity: 24, occupied: 22, status: "Online" }
  ],
  Ost: [
    { row: 1, capacity: 36, occupied: 30, status: "Online" },
    { row: 2, capacity: 36, occupied: 18, status: "Online" },
    { row: 3, capacity: 36, occupied: 25, status: "Online" },
    { row: 4, capacity: 36, occupied: 28, status: "Online" }
  ]
};

// Daten für damageReports

const damageReports = [
  {
    email: "benutzer1@example.com",
    datetime: "2025-10-12 08:15",
    description: "Beschädigte Schranke am Westparkplatz. Metall ist verbogen, Schranke öffnet nur halb. Bitte zeitnah prüfen, da sich sonst die Einfahrt staut."
  },
  {
    email: "user2@example.com",
    datetime: "2025-10-12 10:45",
    description: "Parksensor defekt im Bereich Ost, Reihe 3. Anzeige auf dem Display bleibt dauerhaft 'belegt', obwohl der Platz frei ist."
  },
  {
    email: "kontakt@example.com",
    datetime: "2025-10-13 09:30",
    description: "Öffnungsknopf funktioniert nicht im Eingangstor. Besucher können aktuell nicht selbständig eintreten."
  }
];

// ------------------------------- ------------------------------- ------------------------------- -------------------------------v
// Dashboard: (3 Kacheln oben)
// ------------------------------- ------------------------------- ------------------------------- -------------------------------v

// prozentualen Auslastungswert eines Bereiches Berechnen (Input West oder Ost)

function getOccupancy(area) {
  const arr = parkingData[area];
  const total = arr.reduce((sum, e) => sum + e.capacity, 0);
  const occupied = arr.reduce((sum, e) => sum + e.occupied, 0);
  return total === 0 ? 0 : (occupied / total) * 100;
}

// Dashboardwerte aktualisieren und Gesamtkapazität errechnen

function updateDashboard() {
  const occWest = getOccupancy("West");
  const occOst = getOccupancy("Ost");

  const totalSpaces = ["West", "Ost"].reduce(
    (sum, area) => sum + parkingData[area].reduce((s, e) => s + e.capacity, 0),
    0
  );
  const totalOccupied = ["West", "Ost"].reduce(
    (sum, area) => sum + parkingData[area].reduce((s, e) => s + e.occupied, 0),
    0
  );
  const occTotal = totalSpaces === 0 ? 0 : (totalOccupied / totalSpaces) * 100;

  document.getElementById("totalPercent").textContent = occTotal.toFixed(1) + "%";
  document.getElementById("ostPercent").textContent = occOst.toFixed(1) + "%";
  document.getElementById("westPercent").textContent = occWest.toFixed(1) + "%";
}

// Parking table rendering

function renderParkingTable() {
  const container = document.getElementById('parkingTableContainer');
  container.innerHTML = '';

  const table = document.createElement('table');
  const header = document.createElement('tr');
  ["Bereich", "Reihe", "Kapazität", "Belegt", "Frei", "Status"].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    header.appendChild(th);
  });
  table.appendChild(header);

  for (const [area, entries] of Object.entries(parkingData)) {
    entries.forEach(entry => {
      const tr = document.createElement('tr');

      const tdArea = document.createElement('td');
      tdArea.textContent = area;
      tr.appendChild(tdArea);

      const tdRow = document.createElement('td');
      tdRow.textContent = entry.row;
      tr.appendChild(tdRow);

      const tdCap = document.createElement('td');
      const inpCap = document.createElement('input');
      inpCap.type = 'number';
      inpCap.min = 0;
      inpCap.value = entry.capacity;
      inpCap.addEventListener('change', () => {
        entry.capacity = Number(inpCap.value);
        if (entry.occupied > entry.capacity) entry.occupied = entry.capacity;
        update();
      });
      tdCap.appendChild(inpCap);
      tr.appendChild(tdCap);

      const tdOcc = document.createElement('td');
      const inpOcc = document.createElement('input');
      inpOcc.type = 'number';
      inpOcc.min = 0;
      inpOcc.max = entry.capacity;
      inpOcc.value = entry.occupied;
      inpOcc.addEventListener('change', () => {
        entry.occupied = Math.min(Number(inpOcc.value), entry.capacity);
        update();
      });
      tdOcc.appendChild(inpOcc);
      tr.appendChild(tdOcc);

      const tdFree = document.createElement('td');
      tdFree.textContent = entry.capacity - entry.occupied;
      tr.appendChild(tdFree);

      const tdStatus = document.createElement('td');
      const sel = document.createElement('select');
      ["Online", "Maintenance"].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt;
        o.text = opt;
        sel.appendChild(o);
      });
      sel.value = entry.status;
      sel.addEventListener('change', () => (entry.status = sel.value));
      tdStatus.appendChild(sel);
      tr.appendChild(tdStatus);

      table.appendChild(tr);
    });
  }

  container.appendChild(table);
}

// -------------------------------
// Add new parking row
// -------------------------------
function addParkingRow() {
  const area = prompt("Welcher Bereich? West oder Ost?");
  if (area !== "West" && area !== "Ost") {
    alert("Ungültiger Bereich. Bitte 'West' oder 'Ost' eingeben.");
    return;
  }

  const newRowNumber = parkingData[area].length + 1;
  const defaultCapacity = area === "West" ? 24 : 36;

  parkingData[area].push({
    row: newRowNumber,
    capacity: defaultCapacity,
    occupied: 0,
    status: "Maintenance"
  });

  update();
}
// ------------------------------- ------------------------------- ------------------------------- -------------------------------^

// -------------------------------
// Damage reports rendering
// -------------------------------

function renderDamageReports() {
  const tbody = document.querySelector("#damageReportsTable tbody");
  tbody.innerHTML = "";

  damageReports.forEach((report, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${report.email}</td>
      <td>${report.datetime}</td>
      <td>${report.description.length > 40 ? report.description.substring(0, 40) + "..." : report.description}</td>
    `;
    tr.addEventListener("click", () => openDamageModal(report));
    tr.style.cursor = "pointer";
    tr.title = "Details anzeigen";
    tbody.appendChild(tr);
  });
}

// -------------------------------
// Modal window for detailed view
// -------------------------------

function openDamageModal(report) {
  // Falls Modal schon existiert, löschen
  const existing = document.getElementById("damageModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "damageModal";
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <h3>Schadensmeldung</h3>
      <p><strong>E-Mail:</strong> ${report.email}</p>
      <p><strong>Datum & Uhrzeit:</strong> ${report.datetime}</p>
      <p><strong>Beschreibung:</strong></p>
      <p class="modal-description">${report.description}</p>
      <button id="closeModalBtn">Schließen</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("closeModalBtn").addEventListener("click", () => modal.remove());
  modal.querySelector(".modal-backdrop").addEventListener("click", () => modal.remove());
}


// -------------------------------
// Export functions
// -------------------------------
function exportCSV() {
  const rows = [["Bereich", "Reihe", "Kapazität", "Belegt", "Frei", "Status"]];
  for (const [area, entries] of Object.entries(parkingData)) {
    entries.forEach(e =>
      rows.push([area, e.row, e.capacity, e.occupied, e.capacity - e.occupied, e.status])
    );
  }
  const csv = rows.map(r => r.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "parking_data.csv";
  link.click();
}

function exportExcel() {
  let table = "<table border='1'><tr><th>Bereich</th><th>Reihe</th><th>Kapazität</th><th>Belegt</th><th>Frei</th><th>Status</th></tr>";
  for (const [area, entries] of Object.entries(parkingData)) {
    entries.forEach(e => {
      table += `<tr><td>${area}</td><td>${e.row}</td><td>${e.capacity}</td><td>${e.occupied}</td><td>${e.capacity - e.occupied}</td><td>${e.status}</td></tr>`;
    });
  }
  table += "</table>";
  const blob = new Blob(["\ufeff" + table], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "parking_data.xls";
  link.click();
}

// -------------------------------
// Master update + Init
// -------------------------------
function update() {
  renderParkingTable();
  updateDashboard();
  renderDamageReports();
}

document.addEventListener("DOMContentLoaded", () => {
  update();
  document.getElementById('addRowBtn').addEventListener('click', addParkingRow);
  document.getElementById('exportCSV').addEventListener('click', exportCSV);
  document.getElementById('exportExcel').addEventListener('click', exportExcel);
});
