const { json } = require('body-parser');
var db = require('../Connect.js')
// untuk menampilkan semua data pada tabel jenis barang
const getMarket = (req, res) => {
    const sql = "SELECT * FROM jenisbarang";
    db.query(sql, (err, result) => {
        const jenis = JSON.parse(JSON.stringify(result))
        console.log(jenis);
        if (req.session.user) {
            const sql = `SELECT * FROM user WHERE username = ${req.session.user.username}`;
            db.query(sql, (error, result)=>{
                const user = result[0];
                res.render('jenisBarang', { jenis: jenis, user:user })
            })
        } else {
            res.render('jenisBarang', { jenis: jenis, user: "" })
        }
    })
}
//INSERT INTO tabel (kolom) VALUES (name dari form input)
const tambahJenis = (req, res) => {
    const sql = `INSERT INTO jenisbarang (JenisBarang) VALUES ('${req.body.JenisBarang}')`;
    db.query(sql, (error, result) => {
        if (error) throw error;
        res.redirect("/")
    })
}

const hapusJenis = (req, res) => {
    const sql = `DELETE FROM jenisbarang WHERE id_jenisBarang = '${req.params.id}'`
    db.query(sql, (err, result) => {
        if (err) throw err
        res.redirect("back")
    })
}
const hapusBarang = (req, res) => {
    const sql = `DELETE FROM barang WHERE id_barang='${req.params.id}'`
    db.query(sql, (err, result) => {
        if (err) throw err
        res.redirect("back")
    })
}

const pilihBarang = (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM barang WHERE  id_jenisBarang = '${id}'`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const jenis2 = JSON.parse(JSON.stringify(result));
        const sql2 = `SELECT * FROM transaksi INNER JOIN barang ON transaksi.id_barang = barang.id_barang`;
        // pilih semua data pada transaksi lalu gabungkan dengan tabel transaksi dan tabel barang
        db.query (sql2, (err, result) => {
            if(err) throw err;
            const transaksi = JSON.parse(JSON.stringify(result))
            const uang = (rupiah) => {
                if(rupiah) {
                    return rupiah.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0
                    });
                }
            };
            const user = (user) =>{
                if (req.session.user) {
                    const sql = `SELECT * FROM user WHERE username = ${req.session.user.username}`;
                    db.query(sql, (error, result)=>{
                        const user = result[0];
                        res.render('barang', { 
                          jenis2: jenis2, 
                          id: id, data2: 
                          transaksi,
                          uang,
                          user: user, });
                    })
                } 
            };
            res.render('barang', { 
                jenis2: jenis2, 
                id: id, data2: 
                transaksi,
                uang, 
                user: user});
        
        })
    })
}

const tambahbarang = (req, res) => {
    const image = req.file ? req.file.filename: null;
    const sql = `INSERT INTO barang (nama_barang, harga, stock, id_jenisBarang, image) VALUES ('${req.body.nama_barang} ', '${req.body.harga}', '${req.body.stock}','${req.body.id_jenisBarang}','${image}')`;
    db.query(sql, (error, result) => {
        if (error) throw error;
        res.redirect("back")
    })
}


const getTransaksi = (req, res) => {
    const id = req.params.id_barang
    const sql = "SELECT * FROM jenisbarang";
    db.query(sql, (err, result) => {
        const jenis = JSON.parse(JSON.stringify(result))
        console.log(jenis);
        res.render('jenisBarang', { jenis: jenis })
    })
}

const tambahTransaksi = (req, res) => {
    if(req.session.user){
    const jumlah = req.body.jumlah;
    const total = req.body.total;
    const sql = `INSERT INTO transaksi (id_barang, jumlah, total_harga, status, id_user) VALUES ('${req.body.barang_id}', '${jumlah}', '${total}','0', ${req.session.user.id})`;

    db.query(sql, (error, result) => {
        if (error) throw error;
        const sql2 = `UPDATE barang SET new_stock = ${req.body.new_Stock} WHERE barang.id_barang = ${req.body.barang_id}`;
        db.query(sql2, (error, result) => {
            if (error) throw error;
            res.redirect("back");
        })
    })
    } else {
        res.render('login', {pesan: 'anda harus login' , clas:'danger'})
    }
}

const editJenis = (req, res) => {
    //Ubah tabel di jenis barang, dengan kolom Jenis Barang dengan isi yang ada di formulir edit
    const sql1 = `UPDATE jenisBarang SET jenisBarang = '${req.body.Jenis}' WHERE id_jenisBarang = ${req.body.id_jenis} `;
    db.query(sql1, (error, result) => {
        if (error) throw error;
        res.redirect("back");
    })
}

const cancel = (req, res) => {
    const sql = `UPDATE barang SET new_stock = ${req.body.stockBaru} WHERE id_barang = ${req.body.barang_id2}`
    db.query(sql, (error, result) => {
        if(error) throw error
        const sql2 = `DELETE FROM transaksi WHERE id_transaksi = ${req.body.id_transaksi}`
        db.query(sql2, (error, result) => {
            if(error) throw error
            res.redirect('back')
        })
    })
}

const transaksi = (req, res) => {
    if (req.session.user) {
    const id = req.params.id
    const sql2 = `SELECT * FROM transaksi JOIN barang ON transaksi.id_barang = barang.id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`;
        db.query(sql2, (error, result) => {
            const transaksi = JSON.parse(JSON.stringify(result))
            //querynya berfungsi untuk menjumlahkan seluruh isi dari kolom total harga, yang dipanggil sebagai total
            if (error) throw error
            const sql3 = `SELECT SUM (total_harga) AS total FROM transaksi JOIN barang ON transaksi.id_barang = barang.Id_barang WHERE status = 0 AND id_user = ${req.session.user.id}`;
            db.query(sql3, (err, result) => {
                const total = JSON.parse(JSON.stringify(result));
                const uang = (rupiah) => {
                    return rupiah.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0
                    });
                };
                res.render('transaksi', {  data2: transaksi, id: id, total, uang, });
            })  
        })
    } else {
        res.redirect("back")
    }       
}

const shop = (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM barang WHERE  id_jenisBarang = '${id}'`
    db.query(sql, (err, result) => {
        if (err) throw err;
        const jenis2 = JSON.parse(JSON.stringify(result));
        const sql2 = `SELECT * FROM transaksi INNER JOIN barang ON transaksi.id_barang = barang.id_barang`;
        // pilih semua data pada transaksi lalu gabungkan dengan tabel transaksi dan tabel barang
        db.query (sql2, (err, result) => {
            if(err) throw err;
            const transaksi = JSON.parse(JSON.stringify(result))
            const uang = (rupiah) => {
                if(rupiah) {
                    return rupiah.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0
                    });
                }
            };
        
            res.render('shop', { jenis2: jenis2, id: id, data2: transaksi, uang });
        })
    })
}


module.exports = {
    getMarket,
    tambahJenis,
    hapusJenis,
    pilihBarang,
    tambahbarang,
    hapusBarang,
    getTransaksi,
    tambahTransaksi,
    editJenis,
    cancel,
    transaksi,
    shop,
}
