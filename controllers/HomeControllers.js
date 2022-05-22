const BigPromise = require('../middlewares/bigPromise')

exports.home = BigPromise((req,res) => {
    res.status(200).json({
        status:true,
        message:"Hello!"
    })
})

// or just use try - catch
exports.dummyHome = (req,res) => {
    try {
        res.status(200).json({
            status:true,
            message:"Dummy"
        })    
    } catch (error) {
        console.log(error);
    }
    
}