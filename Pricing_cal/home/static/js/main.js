document.addEventListener('DOMContentLoaded', () => {
  addDBPRow();
  addTMFRow();
  addWCRow();
});

function createCell(isInput = false, inputType = 'text', placeholder = '') {
  const td = document.createElement('td');
  if (isInput) {
    const input = document.createElement('input');
    input.type = inputType;
    input.placeholder = placeholder;
    td.appendChild(input);
  }
  return td;
}

function createDaySelectCell(initialDays = '') {
  const td = document.createElement('td');
  td.textContent = initialDays || 'select days';

  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  td.onclick = () => {
    if (td.querySelector('select')) return;

    const select = document.createElement('select');
    select.multiple = true;
    select.size = 3;
    select.style.width = '100px';

    days.forEach(day => {
      const option = document.createElement('option');
      option.value = day;
      option.textContent = day.charAt(0).toUpperCase() + day.slice(1);
      select.appendChild(option);
    });

    const selectedDays = initialDays.toLowerCase().split(',').map(d => d.trim());
    for (const option of select.options) {
      if (selectedDays.includes(option.value)) {
        option.selected = true;
      }
    }

    td.textContent = '';
    td.appendChild(select);
    select.focus();

    select.addEventListener('change', () => {
      const selected = Array.from(select.selectedOptions).map(opt => opt.textContent);
      td.textContent = selected.length ? selected.join(', ') : 'select days';
      select.blur();
    });

    select.onblur = () => {
      const selected = Array.from(select.selectedOptions).map(opt => opt.textContent);
      td.textContent = selected.length ? selected.join(', ') : 'select days';
    };
  };

  return td;
}

// Distance Base Price (DBP)
function addDBPRow() {
  const tbody = document.querySelector('#dbpTable tbody');
  const tr = document.createElement('tr');
  tr.appendChild(createDaySelectCell());
  tr.appendChild(createCell(true, 'number', 'e.g. 3.0'));
  tbody.appendChild(tr);
}

function addTMFRow() {
  const tbody = document.querySelector('#tmfTable tbody');
  const tr = document.createElement('tr');
  tr.appendChild(createCell(true, 'time', 'e.g. 00:00'));
  tr.appendChild(createCell(true, 'time', 'e.g. 00:00'));
  tbody.appendChild(tr);}


// Waiting Charges (WC)
function addWCRow() {
  const tbody = document.querySelector('#wcTable tbody');
  const tr = document.createElement('tr');
  tr.appendChild(createCell(true, 'number', 'e.g. 3'));
  tbody.appendChild(tr);
}


function loadHistory() {
  fetch('/api/history/')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#historyTable tbody');
      tbody.innerHTML = '';

      data.logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${log.timestamp}</td>
          <td>${log.day}</td>
          <td>${log.dbp}</td>
          <td>${log.dap}</td>
          <td>${log.totaldistance}</td>
          <td>${log.tstart}</td>
          <td>${log.tend}</td>
          <td>${log.wc_total}</td>
          <td>₹${log.total_price.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      });

      // Reveal the container holding the heading and table
      document.getElementById('historyContainer').style.display = 'block';
    })
    .catch(err => console.error('Error loading history:', err));
}

document.getElementById('showHistoryBtn').addEventListener('click', loadHistory);
