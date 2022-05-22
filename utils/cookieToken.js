
const cookieToken =async (user,res) =>{
    const token  =await user.getJwtToken();
     const options = {
         expires:new Date(Date.now() * 3 *24 * 60 * 60 * 1000),
         httpOnly:true
     }

     user.password = undefined;

     res.status(200).cookie(token,options).json({
         status:true,
         token,
         user 
     })
}

module.exports = cookieToken