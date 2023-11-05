const express = require('express')

const router = express.Router()

router.get('/',(req,res) => {
    res.send("Hey, It is user route")
})




module.exports = router