const util = require('../utils/util');
const auth = require('../utils/auth');
function verify(requestBody) {
    if (!requestBody.user || !requestBody.user.username || !requestBody.token) {
        return util.buildResponse(400, 'Bad Request');{
            verified: false;
            message: 'Bad Request'

        }
    }
const user = requestBody.user;
const token = requestBody.token;
const verification = auth.verifyToken(token, user.username);
if (!verification.verified) {
    return util.buildResponse(401, 'verification');
}
return util.buildResponse(200, {
    verified: true,
    message: 'verification successful'
     
});  
    
}

module.exports.verify = verify;