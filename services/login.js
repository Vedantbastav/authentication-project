const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})
const util = require('../utils/util')
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'my-users';

async function login(user){
    const username = user.username;
    const password = user.password;
    if(!user || !user.username || !user.password) {
        return util.buildResponse(400, {
            message: 'username and password are required'
        })
}
const dynamoUser = await getUser(username.toLoweCase().trim());
if(!dynamoUser|| !dynamoUser.username) {
    return util.buildResponse(404, {
        message: 'User not found'
    })
}

if (!bcrypt.compareSync(password, dynamoUser.password)) {
    return util.buildResponse(401, {
        message: 'Incorrect password'
    })

}
const userInfo = {
    username: dynamoUser.username,
    name: dynamoUser.name

}
const token = auth.generateToken(userInfo);
const response = {
    user: userInfo,
    token: token
}
return util.buildResponse(200, response)
}

async function getUser(username){
    const params ={
        Tablename: username,
        Key:{
            username: username
        }
    }
    try {
        const result = await dynamodb.get(params).promise()
        return result.Item
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports.login = login
