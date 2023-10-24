let saldo = 1000000

const formatSaldo = (rupiah) => {
  if(rupiah){
    return rupiah.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFrantionDigits: 0
    })
  }
}

const bayar = (harga) => {
  if (confirm("apakah anda yakin ingin membayar") == true) {
    if (saldo > harga) {
      saldo = saldo - harga;
      document.getElementById("saldo").innerHTML = formatSaldo(saldo);
    } else {
      alert("Saldo Anda Kurang");
    }
  }
};

document.getElementById('saldo').innerHTML = formatSaldo(saldo)

function barang(idBarang, hargaBarang, stock) {
  const inputBarangId = document.getElementById("barang_id");
  inputBarangId.value = idBarang;
  const inputHargabarang = document.getElementById("hargaBarang");
  inputHargabarang.value = hargaBarang;
  const inputStock = (document.getElementById("Stock").value = stock);
}

function Totalbarang() {
  const harga = document.getElementById("hargaBarang").value;
  let jumlahInput = document.getElementById("jumlah");
  const stock = document.getElementById("Stock").value;
  let jumlah = jumlahInput.value;

  // const total = document.getElementById('total').value = harga * jumlah
  // console.log(jumlah, harga);
  // let stockBaru = document.getElementById('new_Stock').value = stock -jumlah

  if (jumlah > stock) {
    alert("stock kurang");
    jumlahInput.value = stock;
    document.getElementById("new_Stock").value = stock - jumlahInput.value;
    document.getElementById("total").value = harga * jumlahInput.value;
  } else {
    document.getElementById("new_Stock").value = stock - jumlahInput.value;
    document.getElementById("total").value = harga * jumlahInput.value;
  }
}
const validasi_modal1 = () => {
  const harga = document.getElementById("harga").value;
  const save = document.getElementById("Save");
  const NamaBarang = document.getElementById("nama_barang");

  if (NamaBarang.value.length <= 2) {
    alert("mohon diiisi nama barang");
    save.style.display = "none";
  } else {
    save.style.display = "block";
  }

  if (harga % 500 === 0) {
    save.style.display = "block";
    alert("cukup");
  } else {
    alert("kurang cukup");
    save.style.display = "none";
  }
};

const cancel = (newStock, jumlah, idBarang, idtransaksi) => {
  console.log(newStock, idBarang, jumlah, idtransaksi);
  document.getElementById("barang_id2").value = idBarang;
  document.getElementById("id_transaksi").value = idtransaksi;
  document.getElementById("stockBaru").value =
    parseInt(newStock) + parseInt(jumlah);
};
