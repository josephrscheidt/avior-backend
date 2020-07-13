module.exports = new config();

function config() {
    
    this.S3BUCKETNAME = 'avior';
    this.accessKeyId = '******************';
    this.secretAccessKey = '*******************************';
    this.S3BASEURL = '*************************';
    this.cognitoClientId = '***********************';
    this.region = 'us-east-1';
    this.userPoolId =  'us-east-************';
    this.cognitoPublicKeyURL = 'https://cognito-idp.' + 'us-east-1' + '.amazonaws.com/' + 'us-east-*********' + '/.well-known/jwks.json';
    
}