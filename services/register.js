const AWS = require('aws-sdk');
AWS.config.update({
    region:'us-east-1'
})
const util = require('../utils/util')
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'my-users';

async function register(userInfo) {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;
    if(!username || !name || !email || !password){
        return util.buildResponse(401,{
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(username);
    if (dynamoUser && dynamoUser.username){
        return util.buildResponse(401,{
            message: 'Username already exist in our database. please choose a different username'
        })

    }

    const encryptedPW = bcrypt.hashSync(password.trim(),  10);
    const user = {
        name: name,
        email: email,
        username: username.toLoweCase().trim(),
        password: encryptedPW

    }
    const saveUserResponse = await saveUser(user);
    if(!saveUserResponse) {
        return util.buildResponse(503,{
            message: 'Server error. Please try again later.'
        })
        return util.buildResponse(200, { username: username});

        
    }

    
}
async function getUser(username){
    const params ={
        Tablename: userTable,
        Key:{
            username: username
        }
    }
    
    return await dynamodb.get(params).promise().then((response) => {
        return response.Item
    }).catch((error) => {
        console.error('There was an error getting user: ', error);
        return null
    })
}
async function saveUser(user) {
    const params ={
        Tablename: userTable,
        Item: user
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }).catch((error) => {
        console.error('There was an error: ', error);
                return null
    })
}
module.exports.register = register;
