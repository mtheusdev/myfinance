const jwt = require('jsonwebtoken')
const { JsonWebTokenError } = require("jsonwebtoken")

function getUserId(context){

  //Authorization: 'Bearer TOKEN'
  const Authorization = context.request.get('Authorization')

  if(Authorization){
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return userId
  }

  throw new Error('Not authenticated!')
}

module.exports = {
  getUserId
}