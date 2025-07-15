
const jwt = require('jsonwebtoken')
require('dotenv').config()

export const authendicateToken=(req,res,next)=>{
    let getHeader=req.headers["authorization"]
    const token=getHeader&&getHeader.split(' ')[1]
    if(!token){
        res.sendStatus(401)
    } else {
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
            if(err){
                res.sendStatus(403)
            } else{
                req.user=user
                next()
            }
        })
    }
}


