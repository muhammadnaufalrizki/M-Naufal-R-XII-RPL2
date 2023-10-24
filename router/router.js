const express = require('express');
const router = express.Router();
const multer = require('multer')
const { getMarket,
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

} = require('../controllers/market.js')
const { login, register, registrasi, auth, logout} = require('../controllers/auth.js')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage })

router.get("/", getMarket);
router.get("/hapusJenis/:id", hapusJenis)
router.get("/hapusBarang/:id", hapusBarang)
router.get("/transaksi", transaksi)
router.get("/shop/:id", shop)
router.get("/register", register)
router.get("/pilih/:id", pilihBarang)
router.get("/getMarket",getMarket )
router.get("/logout",logout )
router.post("/tambahJenis", tambahJenis)
router.post("/tambahbarang", upload.single("photo"), tambahbarang)
router.post("/getTransaksi", getTransaksi)
router.post("/tambahTransaksi", tambahTransaksi)
router.post("/editJenis", editJenis)
router.post("/auth", auth)
router.post("/cancelTransaksi", cancel)
router.post("/registrasi", registrasi)
router.get("/login", login)


module.exports = router;