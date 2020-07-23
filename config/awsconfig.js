module.exports = new config();

function config() {
    
    this.S3BUCKETNAME = 'avior';
    this.accessKeyId = 'AKIAITPBWVGWCRN2O6PA';
    this.secretAccessKey = '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';
    this.S3BASEURL = 'https://s3.amazonaws.com/avior/';
    this.cognitoClientId = '2jbd9o57cefusqfbh1i3idfa2';
    this.region = 'us-east-1';
    this.userPoolId =  'us-east-1_aGBWAn8G9';
    this.cognitoPublicKeyURL = 'https://cognito-idp.' + 'us-east-1' + '.amazonaws.com/' + 'us-east-1_aGBWAn8G9' + '/.well-known/jwks.json';
    
}