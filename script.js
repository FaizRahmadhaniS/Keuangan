document.addEventListener('DOMContentLoaded', () => {

    // Helper Functions
    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    const loadData = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // Data Models
    let dataHarian = loadData('dataHarian');
    let dataBulanan = loadData('dataBulanan');
    let dataTahunan = loadData('dataTahunan');

    // Render Function
    const render = () => {
        // Render Tabel
        renderTable('tabel-harian', dataHarian, ['tanggal', 'keterangan', 'pemasukan', 'pengeluaran'], 'harian');
        renderTable('tabel-bulanan', dataBulanan, ['bulan', 'keterangan', 'pemasukan', 'pengeluaran'], 'bulanan');
        renderTable('tabel-tahunan', dataTahunan, ['tahun', 'keterangan', 'pemasukan', 'pengeluaran'], 'tahunan');
        // Render Dashboard
        updateDashboard();
    };

    const renderTable = (tbodyId, data, columns, type) => {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = '';
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            columns.forEach(col => {
                const cell = document.createElement('td');
                cell.textContent = (col === 'pemasukan' || col === 'pengeluaran') ? formatRupiah(item[col]) : item[col];
                row.appendChild(cell);
            });
            const actionCell = document.createElement('td');
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteItem(type, index);
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    };
    
    // Update Dashboard Function
    const updateDashboard = () => {
        const calcTotal = (data) => data.reduce((acc, item) => acc + (item.pemasukan - item.pengeluaran), 0);
        
        const totalHarian = calcTotal(dataHarian);
        const totalBulanan = calcTotal(dataBulanan);
        const totalTahunan = calcTotal(dataTahunan);

        document.getElementById('total-bersih-harian').textContent = formatRupiah(totalHarian);
        document.getElementById('total-bersih-bulanan').textContent = formatRupiah(totalBulanan);
        document.getElementById('total-bersih-tahunan').textContent = formatRupiah(totalTahunan);
        document.getElementById('grand-total-amount').textContent = formatRupiah(totalHarian + totalBulanan + totalTahunan);
    };

    // Event Handlers
    document.getElementById('form-harian').addEventListener('submit', (e) => {
        e.preventDefault();
        const newData = {
            tanggal: document.getElementById('tanggal').value,
            keterangan: document.getElementById('ket-harian').value,
            pemasukan: parseInt(document.getElementById('pemasukan-harian').value) || 0,
            pengeluaran: parseInt(document.getElementById('pengeluaran-harian').value) || 0
        };
        dataHarian.push(newData);
        saveData('dataHarian', dataHarian);
        render();
        e.target.reset();
    });

    document.getElementById('form-bulanan').addEventListener('submit', (e) => {
        e.preventDefault();
        const newData = {
            bulan: document.getElementById('bulan').value,
            keterangan: document.getElementById('ket-bulanan').value,
            pemasukan: parseInt(document.getElementById('pemasukan-bulanan').value) || 0,
            pengeluaran: parseInt(document.getElementById('pengeluaran-bulanan').value) || 0
        };
        dataBulanan.push(newData);
        saveData('dataBulanan', dataBulanan);
        render();
        e.target.reset();
    });
    
    document.getElementById('form-tahunan').addEventListener('submit', (e) => {
        e.preventDefault();
        const newData = {
            tahun: document.getElementById('tahun').value,
            keterangan: document.getElementById('ket-tahunan').value,
            pemasukan: parseInt(document.getElementById('pemasukan-tahunan').value) || 0,
            pengeluaran: parseInt(document.getElementById('pengeluaran-tahunan').value) || 0
        };
        dataTahunan.push(newData);
        saveData('dataTahunan', dataTahunan);
        render();
        e.target.reset();
    });

    // Delete Function
    window.deleteItem = (type, index) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        
        if (type === 'harian') {
            dataHarian.splice(index, 1);
            saveData('dataHarian', dataHarian);
        } else if (type === 'bulanan') {
            dataBulanan.splice(index, 1);
            saveData('dataBulanan', dataBulanan);
        } else if (type === 'tahunan') {
            dataTahunan.splice(index, 1);
            saveData('dataTahunan', dataTahunan);
        }
        render();
    };

    // Tab Logic - updated to accept button element
    window.openTab = (tabName, elmnt) => {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        elmnt.classList.add('active');
    };

    // Initial Render and set default tab
    render();
    // Ensure the first tab is active on load
    document.querySelector('.tab-button').click(); // Simulate click on the first button
});