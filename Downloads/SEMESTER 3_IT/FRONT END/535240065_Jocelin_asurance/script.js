const app = document.getElementById("view");

function renderNav() {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("nav-links").innerHTML = user
    ? `
      <a href="#" onclick="renderProduk()">Produk</a>
      <a href="#" onclick="renderProfile()">Profile</a>
      <a href="#" onclick="renderHistory()">History</a>
      <a href="#" onclick="logout()">Logout</a>
    `
    : `
      <a href="#" onclick="renderLogin()">Login</a>
      <a href="#" onclick="renderSignup()">Sign Up</a>
    `;
}

function renderLogin() {
  app.innerHTML = `
    <div class="card">
      <h2>Login</h2>
      <form id="formLogin">
        <label>Email <input type="email" name="email" required></label>
        <label>Password <input type="password" name="password" required></label>
        <button type="submit" class="btn">Login</button>
      </form>
      <div id="loginMsg"></div>
    </div>
  `;

  document.getElementById("formLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const found = users.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      renderNav();
      renderProduk();
    } else {
      document.getElementById(
        "loginMsg"
      ).innerHTML = `<div class="error">Email atau password salah!</div>`;
    }
  });
}

function renderSignup() {
  app.innerHTML = `
    <div class="card">
      <h2>Sign Up</h2>
      <form id="formSignup">
        <label>Nama Lengkap <input type="text" name="nama" required></label>
        <label>Email <input type="email" name="email" required></label>
        <label>No HP <input type="text" name="hp" required></label>
        <label>Password <input type="password" name="password" required></label>
        <label>Konfirmasi Password <input type="password" name="password2" required></label>
        <button type="submit" class="btn">Daftar</button>
      </form>
      <div id="signupMsg"></div>
    </div>
  `;

  document.getElementById("formSignup").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));

    if (d.password !== d.password2) {
      document.getElementById(
        "signupMsg"
      ).innerHTML = `<div class="error">Password tidak sama!</div>`;
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === d.email)) {
      document.getElementById(
        "signupMsg"
      ).innerHTML = `<div class="error">Email sudah terdaftar!</div>`;
      return;
    }

    const newUser = {
      nama: d.nama,
      email: d.email,
      hp: d.hp,
      password: d.password,
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById(
      "signupMsg"
    ).innerHTML = `<div class="success">Pendaftaran berhasil, silakan login.</div>`;
  });
}

const PRODUK = [
  { id: "p1", nama: "Asuransi Kesehatan", jenis: "kesehatan" },
  { id: "p2", nama: "Asuransi Mobil", jenis: "mobil" },
  { id: "p3", nama: "Asuransi Jiwa", jenis: "jiwa" },
];

function renderProduk() {
  if (!localStorage.getItem("user")) {
    renderLogin();
    return;
  }

  let html = `<h2>Pilih Produk Asuransi</h2><div class="products">`;
  PRODUK.forEach((p) => {
    html += `
      <div class="prod">
        <span class="tag">${p.jenis}</span>
        <h4>${p.nama}</h4>
        ${
          p.jenis === "kesehatan"
            ? `<button class="btn" onclick="goToKesehatanForm()">Isi Data</button>`
            : p.jenis === "mobil"
            ? `<button class="btn" onclick="goToMobilForm()">Isi Data</button>`
            : `<button class="btn" onclick="goToJiwaForm()">Isi Data</button>`
        }
      </div>
    `;
  });
  html += `</div>`;
  app.innerHTML = html;
}

function goToKesehatanForm() {
  app.innerHTML = `
    <h2>Form Asuransi Kesehatan</h2>
    <form id="formKesehatan">
      <label>Nama Lengkap <input type="text" name="nama" required></label>
      <label>Tanggal Lahir <input type="date" name="tglLahir" required></label>
      <label>Pekerjaan <input type="text" name="pekerjaan" required></label>
      <label>Merokok?
        <select name="merokok" required>
          <option value="">-- pilih --</option>
          <option value="1">Ya</option>
          <option value="0">Tidak</option>
        </select>
      </label>
      <label>Hipertensi?
        <select name="hipertensi" required>
          <option value="">-- pilih --</option>
          <option value="1">Ya</option>
          <option value="0">Tidak</option>
        </select>
      </label>
      <label>Diabetes?
        <select name="diabetes" required>
          <option value="">-- pilih --</option>
          <option value="1">Ya</option>
          <option value="0">Tidak</option>
        </select>
      </label>
      <button type="submit" class="btn">Hitung Premi</button>
    </form>
    <div id="premiResult"></div>
  `;

  document.getElementById("formKesehatan").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    const birth = new Date(data.tglLahir);
    const today = new Date();
    let umur = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      umur--;
    }

    let faktor = 0;
    if (umur <= 20) faktor = 0.1;
    else if (umur <= 35) faktor = 0.2;
    else if (umur <= 50) faktor = 0.25;
    else faktor = 0.4;

    const P = 2000000;
    const k1 = Number(data.merokok);
    const k2 = Number(data.hipertensi);
    const k3 = Number(data.diabetes);

    const premi = P + faktor * P + k1 * 0.5 * P + k2 * 0.4 * P + k3 * 0.5 * P;

    document.getElementById("premiResult").innerHTML = `
      <div class="card success">
        <h3>Total Premi</h3>
        <p>Rp ${premi.toLocaleString()}</p>
        <button class="btn" onclick="goToCheckout('Asuransi Kesehatan', ${premi})">Checkout</button>
      </div>
    `;
  });
}

function goToMobilForm() {
  app.innerHTML = `
    <h2>Form Asuransi Mobil</h2>
    <form id="formMobil">
      <label>Merk Mobil <input type="text" name="merk" required></label>
      <label>Jenis Mobil <input type="text" name="jenis" required></label>
      <label>Tahun Pembuatan <input type="number" name="tahun" required></label>
      <label>Harga Mobil <input type="number" name="harga" required></label>
      <label>Nomor Plat <input type="text" name="plat" required></label>
      <label>Nomor Mesin <input type="text" name="mesin" required></label>
      <label>Nomor Rangka <input type="text" name="rangka" required></label>
      <label>Nama Pemilik <input type="text" name="pemilik" required></label>
      <button type="submit" class="btn">Hitung Premi</button>
    </form>
    <div id="premiMobilResult"></div>
  `;

  document.getElementById("formMobil").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));

    const tahun = parseInt(d.tahun);
    const harga = parseFloat(d.harga);
    const umur = new Date().getFullYear() - tahun;

    let premi = 0;
    if (umur <= 3) premi = 0.025 * harga;
    else if (umur <= 5 && harga < 200000000) premi = 0.04 * harga;
    else if (umur <= 5 && harga >= 200000000) premi = 0.03 * harga;
    else if (umur > 5) premi = 0.05 * harga;

    document.getElementById("premiMobilResult").innerHTML = `
      <div class="card success">
        <h3>Total Premi</h3>
        <p>Rp ${premi.toLocaleString()}</p>
        <button class="btn" onclick="goToCheckout('Asuransi Mobil', ${premi})">Checkout</button>
      </div>
    `;
  });
}

function goToJiwaForm() {
  app.innerHTML = `
    <div class="card">
      <h2>Form Asuransi Jiwa</h2>
      <form id="formJiwa">
        <label>Nama Lengkap <input type="text" name="nama" required></label>
        <label>Tanggal Lahir <input type="date" name="tgl" required></label>
        <label>Pertanggungan
          <select name="tanggungan" required>
            <option value="1000000000">Rp1.000.000.000</option>
            <option value="2000000000">Rp2.000.000.000</option>
            <option value="3500000000">Rp3.500.000.000</option>
            <option value="5000000000">Rp5.000.000.000</option>
            <option value="10000000000">Rp10.000.000.000</option>
          </select>
        </label>
        <button type="submit" class="btn">Hitung Premi</button>
      </form>
      <div id="premiJiwaResult"></div>
    </div>
  `;

  document.getElementById("formJiwa").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));

    const birth = new Date(d.tgl);
    const umur = new Date().getFullYear() - birth.getFullYear();
    const t = parseFloat(d.tanggungan);

    let m = 0;
    if (umur <= 30) m = 0.002;
    else if (umur <= 50) m = 0.004;
    else m = 0.01;

    const premi = (m * t) / 12; // per bulan

    document.getElementById("premiJiwaResult").innerHTML = `
      <div class="card success">
        <h3>Total Premi / Bulan</h3>
        <p>Rp ${premi.toLocaleString()}</p>
        <button class="btn" onclick="goToCheckout('Asuransi Jiwa', ${premi})">Checkout</button>
      </div>
    `;
  });
}

function goToCheckout(namaProduk, total) {
  app.innerHTML = `
    <div class="card">
      <h2>Checkout</h2>
      <p>Produk: ${namaProduk}</p>
      <p>Total yang harus dibayar: <strong>Rp ${total.toLocaleString()}</strong></p>
      <button class="btn" onclick="bayar('${namaProduk}', ${total})">Bayar</button>
    </div>
  `;
}

function bayar(namaProduk, total) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({
    produk: namaProduk,
    harga: total,
    tanggal: new Date().toLocaleString(),
    status: "Lunas",
  });
  localStorage.setItem("history", JSON.stringify(history));

  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  let html = `<h2>Histori Pembelian</h2>`;
  if (history.length === 0) {
    html += `<p>Belum ada transaksi.</p>`;
  } else {
    html += `<table border="1" cellpadding="8"><tr><th>Produk</th><th>Tanggal</th><th>Harga</th><th>Status</th></tr>`;
    history.forEach((h) => {
      html += `<tr>
        <td>${h.produk}</td>
        <td>${h.tanggal}</td>
        <td>Rp ${h.harga.toLocaleString()}</td>
        <td>${h.status}</td>
      </tr>`;
    });
    html += `</table>`;
  }
  app.innerHTML = html;
}

function renderProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return renderLogin();

  app.innerHTML = `
    <div class="card">
      <h2>Profile</h2>
      <p><strong>Nama:</strong> ${user.nama}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>No HP:</strong> ${user.hp}</p>
    </div>
  `;
}

function logout() {
  localStorage.removeItem("user");
  renderNav();
  renderLogin();
}

renderNav();
renderLogin();
