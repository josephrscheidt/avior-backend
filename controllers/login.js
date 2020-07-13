var cognito = require('amazon-cognito-identity-js');
var lowerCase = require('lower-case');
var config = require('../config/awsconfig.js');
const User = require('../models').tbl_user;
const Treatment = require('../models').tbl_treatment;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const TreatmentPhasesPoints = require('../models').tbl_treatment_phases_points;
const TreatmentPhases = require('../models').tbl_treatment_phases;
const TreatmentExercise = require('../models').tbl_treatment_exercise;
const TreatmentPhasesProgressCriteria = require('../models').tbl_treatment_phases_progress_criteria;
const TreatmentQuestion = require('../models').tbl_treatment_question;
const PatientSurvey = require('../models').tbl_patient_survey;
const PatientPain = require('../models').tbl_patient_pain;
const PatientHEP = require('../models').tbl_patient_hep;
const PatientGoals = require('../models').tbl_patient_goals;


const poolData = {
    UserPoolId: config.userPoolId, // Your user pool id here
    ClientId: config.cognitoClientId // Your client id here
};

const userPool = new cognito.CognitoUserPool(poolData);

//Portal Login

exports.login = (req, res) => {
    if (req.body.email) {
        User.find({
            where: {
                // email: req.body.email,
                email: 'joseph.scheidt+demo_therapist@gmail.com',
                role_id: {
                    [Op.or]: [1, 2]
                }
            }
        })
        .then(user => {
            if (user) {
                const authData = {
                    // Username: lowerCase(req.body.email),
                    Username: lowerCase('joseph.scheidt+demo_therapist@gmail.com'),
                    // Password: req.body.password
                    Password: 'Test123Test'
                };
                const authDetails = new cognito.AuthenticationDetails(authData);

                const userData = {
                    // Username: lowerCase(req.body.email),
                    Username: lowerCase('joseph.scheidt+demo_therapist@gmail.com'),
                    Pool: userPool
                };
                const cognitoUser = new cognito.CognitoUser(userData);

                cognitoUser.authenticateUser(authDetails, {
                    onSuccess(result) {            
                        var authResult = {};
                        authResult.idToken = result.idToken.jwtToken;
                        authResult.payload = result.idToken.payload;
                        authResult.userdata = user.dataValues;
                        authResult.refreshToken = result.refreshToken.token;
                        authResult.accessToken = result.accessToken.jwtToken;
                        res.status(200).send(authResult);
                    },
                    onFailure(err) {
                        res.status(500).send({
                            "message": err.message || "login error"
                        });
                    }
                });
            }else {
                res.status(400).send({"status" : 500, "message": "Email is not registered with us."});

            }
        }).catch(error => res.status(400).send({"status" : 500, "message": "Email is not registered with us."}));
    }
    else{
        res.status(500).send({
            "message": "Please Provided Valid Email"
        });
    }
}

//Logout 
exports.logout = (req, res, next) => {
    if (req.body == null) {
        return next(
            new errors.InvalidContentError("Expects 'application/json'")
            );
    }
    let data = req.body || {};
    if (!req.body.email) { }
        const authData = {
            Username: lowerCase(req.body.email)
        };
        const authDetails = new cognito.AuthenticationDetails(authData);
        const userData = {
            Username: lowerCase(req.body.email),
            Pool: userPool
        };
        const cognitoUser = new cognito.CognitoUser(userData);
    //sign out will invalidate any and all tokens etc
    cognitoUser.signOut();
    res.send(200, { "message": "logout complete" });
}


//Demo Patient Login
exports.demoPatientLogin = (req, res) => {
    User.hasOne(Treatment, { foreignKey: 'patient_id' });
    Treatment.belongsTo(User, { foreignKey: 'patient_id' });
    User.find({
        where: {
            email: 'ryan.wosick+at@gmail.com',
            role_id: '3'
        },
        include:[Treatment]

    })
    .then(user => {
        if (user){
            const authData = {
                Username: lowerCase('ryan.wosick+at@gmail.com'),
                Password: 'Ramblers1'
            };

            const authDetails = new cognito.AuthenticationDetails(authData);

            const userData = {
                Username: lowerCase('ryan.wosick+at@gmail.com'),
                Pool: userPool
            };

            const cognitoUser = new cognito.CognitoUser(userData);

            cognitoUser.authenticateUser(authDetails, {
                onSuccess(result) {
                    console.warn("Success: ", result);            
                    if (user) {
                        var authResult = {};
                        authResult.idToken = result.idToken.jwtToken;
                        authResult.payload = result.idToken.payload;
                        authResult.userdata = user.dataValues;
                        authResult.refreshToken = result.refreshToken.token;
                        authResult.accessToken = result.accessToken.jwtToken;
                        res.status(200).send(authResult);
                    }
                    else {
                        res.status(500).send({ "success": '0', "message": "Username or Password is Incorrect" });
                    }
                },
                onFailure(err) {
                    console.warn("FAILURE: ", err);
                    res.status(500).send({
                        "message": err.message || "login error"
                    });
                }
            });
        }
        else{
            res.status(400).send({"status" : 500, "message": "Email is not registered with us."});
        }
    }).catch(error => res.status(400).send({"status" : 500, "message": "Email is not registered with us."}));
}


//patient Login 
exports.patientLogin = (req, res) => {
    User.hasOne(Treatment, { foreignKey: 'patient_id' });
    Treatment.belongsTo(User, { foreignKey: 'patient_id' });
    User.find({
        where: {
            email: req.body.email,
            role_id: '3'
        },
        include:[Treatment]

    })
    .then(user => {
        // console.warn("USER: ", user);
        if (user){
            const authData = {
                Username: lowerCase(req.body.email),
                Password: req.body.password
            };

            const authDetails = new cognito.AuthenticationDetails(authData);

            const userData = {
                Username: lowerCase(req.body.email),
                Pool: userPool
            };

            const cognitoUser = new cognito.CognitoUser(userData);

            cognitoUser.authenticateUser(authDetails, {
                onSuccess(result) {
                    console.warn("Success: ", result);            
                    if (user) {
                        var authResult = {};
                        authResult.idToken = result.idToken.jwtToken;
                        authResult.payload = result.idToken.payload;
                        authResult.userdata = user.dataValues;
                        authResult.refreshToken = result.refreshToken.token;
                        authResult.accessToken = result.accessToken.jwtToken;
                        res.status(200).send(authResult);
                    }
                    else {
                        res.status(500).send({ "success": '0', "message": "Username or Password is Incorrect" });
                    }
                },
                onFailure(err) {
                    console.warn("FAILURE: ", err);
                    res.status(500).send({
                        "message": err.message || "login error"
                    });
                }
            });
        }
        else{
            res.status(400).send({"status" : 500, "message": "Email is not registered with us."});
        }
    }).catch(error => res.status(400).send({"status" : 500, "message": "Email is not registered with us."}));
}

//Forgot Password Intiate

exports.forgotPswdInit = (req,res) => {
    if (!req.body.email) {
        res.status(500).send({ "status": 400, "message": "Please provide email address." });
    }
    User.find({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(user){

            const userData = {
                Username: lowerCase(req.body.email),
                Pool: userPool
            };

            const cognitoUser = new cognito.CognitoUser(userData);
            cognitoUser.forgotPassword({
                onSuccess: function (result) {
                    res.status(200).send({ "status": 200, "message": "forgot password success." });
                },
                onFailure: function (err) {
                    if (err) {
                        if (err.statusCode === 200) {
                            res.status(200).send({ "status": 200, "message": "forgot password success." });
                        }
                        else {
                            res.status(500).send({ "status": 500, "message": JSON.stringify(err) || "invalid data." });
                        }
                    }

                }
            });
        }else{
            res.status(400).send({"status" : 500, "message": "Email is not registered with us."});
        }

    }).catch( error => res.status(400).send({"status" : 500, "message": "Email is not registered with us."}))
}

//Confirm Password or reset password

exports.confirmPswd = (req,res) =>{
    if (!req.body.confirmationcode || !req.body.password || !req.body.email) {
        res.status(400).send({ "status": 400, "message": "invalid data." });
    }
    User.findAll({
        where: {
            email: req.body.email
            // role_id:3
        }
    })
    .then(user => {
        if (user.length) {
            const userData = {
                Username: lowerCase(req.body.email),
                Pool: userPool
            };

            const cognitoUser = new cognito.CognitoUser(userData);

            cognitoUser.confirmPassword(req.body.confirmationcode, req.body.password, {
                onFailure(err) {
                    if (!err)
                        return;
                    res.status(500).send({ "status": 500, "message": err.message || "error resetting password." });
                },
                onSuccess() {
                    res.status(200).send({ "status": 200, "message": "password reset successful." });
                },
            });
        }else {
            res.status(400).send({"status" : 500, "message": "Email is not registered with us."});

        }
    }).catch(error => res.status(400).send({"status" : 500, "message": "Email is not registered with us."}));
}

//Database maintenance
resetData = () =>{
    User.destroy({where: {id:{gt: 404}}}).then(user =>{
        Treatment.destroy({where: {id:{gt: 279}}}).then(treatment =>{
            TreatmentPhasesPoints.destroy({where: {set_id:{gt: 1441}}}).then(phasepoints=>{
                TreatmentPhases.destroy({where: {treatment_id:{gt: 279}}}).then(phases =>{
                    TreatmentExercise.destroy({where: {treatment_id:{gt: 279}}})
                    .then(exercise =>{
                        TreatmentPhasesProgressCriteria.destroy({where: {set_id:{gt: 1441}}})
                        .then(progresscriteria =>{
                            TreatmentQuestion.destroy({where: {treatment_id:{gt: 279}}})
                            .then(question =>{
                                PatientSurvey.destroy({where: {patient_id:{gt: 404}}})
                                .then(survey =>{
                                    PatientPain.destroy({where: {treatment_id:{gt: 279}}})
                                    .then(pain =>{
                                        PatientHEP.destroy({where: {treatment_id:{gt: 279} }})
                                        .then(hep =>{
                                            PatientGoals.destroy({where: {treatment_id:{gt: 279}}});
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}