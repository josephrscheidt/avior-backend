const User = require('../models').tbl_user;
const Clinic = require('../models').tbl_clinic;
const Treatment = require('../models').tbl_treatment;
const Template = require('../models').tbl_template;
const Treat_Question = require('../models').tbl_treat_question;
const Question = require('../models').tbl_question;
const Patient_pain = require('../models').tbl_patient_pain;
const PatientSurvey = require('../models').tbl_patient_survey;

const TemplatePhases = require('../models').tbl_template_phases;
const TemplatePhasePoints = require('../models').tbl_phases_point;
const TemplatePhaseProgressCriteria = require('../models').tbl_phases_progress_criteria;

const TreatmentPhase = require('../models').tbl_treatment_phases;
const TreatmentPhasePoints = require('../models').tbl_treatment_phases_point;
const TreatmentPhaseProgressCriteria = require('../models').tbl_treatment_phases_progress_criteria;

const Goal = require('../models').tbl_patient_goals;
const Template_question = require('../models').tbl_template_question;
const Treatment_question = require('../models').tbl_treatment_question;
const Treatment_exercise = require('../models').tbl_treatment_exercise;
const Injury_Alias = require('../models').tbl_exercise_alias;
const Exercise = require('../models').tbl_exercise;
const Injury = require('../models').tbl_injury;

const Discharge = require('../models').tbl_discharge_reasons;

var cognito = require('amazon-cognito-identity-js');
var lowerCase = require('lower-case');
var config = require('../config/awsconfig.js');
var randomstring = require("randomstring");
require('isomorphic-fetch');
require('validate');

const poolData = {
    UserPoolId: config.userPoolId, // Your user pool id here
    ClientId: config.cognitoClientId // Your client id here
};

const userPool = new cognito.CognitoUserPool(poolData);
var discharge_id;

var getCognitoUser = function (email) {

	const userPool = new CognitoUserPool(poolData);
	const userData = {
		email: email,
		Pool: userPool
	};
	return new CognitoUser(userData);
}

var userController = {

	registerNewUser: function (req, res, next) {

		try {
			User.find({
				where:{
					email: req.body.email
				}
			}).then(user=>{
				if(!user){
					const attrList = [];
					const emailAttribute = { Name: 'email', Value: lowerCase(req.body.email) };
					attrList.push(new cognito.CognitoUserAttribute(emailAttribute));

					userPool.signUp(lowerCase(req.body.email), req.body.password, attrList, null, function (err, result) {
						if (err) {
							if (err.message == 'An account with the given email already exists.')
								return User.create({
									name: req.body.name,
									email: req.body.email,
									contact_no: req.body.contact_no,
									role_id: '1',
									is_active: '1',
									created_by: "1",
									updated_by: "1",
                  					filled_out_review: "0"
								})
							.then(user => res.status(201).send({ "status": 200, "message": "user created", "data": user }))
							.catch(error => res.status(500).send(error))
							else
								res.send(500, { "status": 500, "message": err.message || "user creation error." });
						} else {
							var cognitoUser;
							cognitoUser = result.user;
							return User.create({
								name: req.body.name,
								email: req.body.email,
								contact_no: req.body.contact_no,
								role_id: '1',
								is_active: '1',
								created_by: "1",
								updated_by: "1",
                				filled_out_review: "0"
							})
							.then(user => res.status(201).send({ "status": 200, "message": "user created", "data": user }))
							.catch(error => res.status(500).send(error));
						}

					});
				}
				else{
					res.status(500).send({ "status": 500, "message": "User Is already registered" });
				}
			})

		} catch (err) {
			res.status(500).send({ "status": 500, "message": "user creation error" });
		}
	},

	registerPatient: function(req, res, next) {
		if(!req.body)
			res.status(500).send({"status":500,"message":"Patient Details is required"})

		try {
			User.findAll({
				where:{
					email: req.body.email
				}
			})
			.then(user=>{
				if (!user.length){
					var randomPassword = randomstring.generate(15);

           User.create({
             clinic_id: req.body.clinicId,
             name: req.body.name,
             email: req.body.email,
             contact_no: req.body.contact_no,
             password: randomPassword,
             role_id: '3',
             is_active: req.body.isActive,
             filled_out_review: '0'
           })
           .then(user =>{
			 var date = new Date(req.body.start_date)
			 
             Treatment.create({
               injury_id: req.body.injury_id,
               patient_id: user.dataValues.id,
               pt_id: req.body.therapist,
               template_id: req.body.template_id,
               start_date: req.body.start_date
             })
             .then(treatment => {
               Template_question.findAll(
               {
                 where:{
                   template_id: req.body.template_id
                 }
               })
               .then(templateQuestionSets=>{
                 for (let index = 0; index < templateQuestionSets.length; index++) {
                   Treatment_question.create({
                     treatment_id: treatment.dataValues.id,
                     week: templateQuestionSets[index].dataValues.week,
                     priority: templateQuestionSets[index].dataValues.priority
                   }).then((treatment) => {
                     let set_id = templateQuestionSets[index].dataValues.id;
                     Question.findAll({
                       where: {set_id: set_id}
                     }).then((questions) => {

                       for (let index = 0; index < questions.length; index++) {
                         Treat_Question.create({
                           question : questions[index].dataValues.question,
                           set_id : treatment.dataValues.id
                         }).then((question) => {
                         }).catch((error) => {
                           res.status(400).send(error.message);
                         });
                       }
                     })
                   })
				 }
			   })
			   
			   // NEW
               TemplatePhases.findAll(
               {
                 where:{
                   template_id: req.body.template_id
                 }
               })
               .then(templatePhases=>{

                 for (let index = 0; index < templatePhases.length; index++) {
                   TreatmentPhase.create({
                     treatment_id: treatment.dataValues.id,
                     name: templatePhases[index].dataValues.name,
                     start_week: templatePhases[index].dataValues.start_week,
                     end_week: templatePhases[index].dataValues.end_week,
                     sequence: templatePhases[index].dataValues.sequence
                   }).then((treatmentPhase) => {

					 let phase_id = templatePhases[index].dataValues.id;
					 
					 // NEW

                     TemplatePhasePoints.findAll({
                       where: {phase_id: phase_id}
                     }).then((treatmentPhasePoints) => {

                       for (let index = 0; index < treatmentPhasePoints.length; index++) {
                         TreatmentPhasePoints.create({
                           point : treatmentPhasePoints[index].dataValues.point,
                           set_id : treatmentPhase.dataValues.id
                         }).then((question) => {
                         }).catch((error) => {
                           res.status(400).send(error.message);
                         });
                       }
					 })
					 .catch(error => res.status(500).send(error))
					 
					 // NEW
					 TemplatePhaseProgressCriteria.findAll({
                       where: {phase_id: phase_id}
                     }).then((treatmentPhaseProgressCriteria) => {

                       for (let index = 0; index < treatmentPhaseProgressCriteria.length; index++) {
                         TreatmentPhaseProgressCriteria.create({
                           pc_point : treatmentPhaseProgressCriteria[index].dataValues.pc_point,
                           set_id : treatmentPhase.dataValues.id
                         }).then((question) => {
                         }).catch((error) => {
                           res.status(400).send(error.message);
                         });
					   }

					 })
					 .catch(error => res.status(500).send(error))
					 
				   })
				   .catch(error => res.status(500).send(error))
				 }
				 if (req.body.isActive == '1'){

					const attrList = [];
					const emailAttribute = { Name: 'email', Value: lowerCase(req.body.email) };
					attrList.push(new cognito.CognitoUserAttribute(emailAttribute));
		
							  userPool.signUp(lowerCase(req.body.email), randomPassword, attrList, null, function (err, result) {
								  if (err) {
									  if (err.message == 'An account with the given email already exists.'){
		
									  }else{
										  res.send(500, { "status": 500, "message": err.message || "user creation error." });
									  }
								  } else {
									  var cognitoUser;
									  cognitoUser = result.user;
									  res.status(200).send({ "status": 200, "message": "user created", "data": user })
								  }
							   });
				   }else{
					res.status(200).send({ "status": 200, "message": "user created", "data": user })
				   }

			   })
			   .catch(error => res.status(500).send(error))
             })
             .catch(error => res.status(500).send(error))
           })
		   .catch(error => res.status(500).send(error))
}
else{
	res.status(500).send({ "status": 500, "message": "User Is already registered" });
}
})
} catch (error) {
	res.send(500, { "status": 500, "message": "user creation error" });
}
},

enablePendingPatient: function (req, res){
  module.exports.updatePatient(req, res);
  User.find({
	where:{
		email: req.body.email,
		role_id: 3
	}
	})
	.then((user) =>{
		if(user){
			const attrList = [];
			const emailAttribute = { Name: 'email', Value: lowerCase(req.body.email) };
			randomPassword = user.password;
		  
			attrList.push(new cognito.CognitoUserAttribute(emailAttribute));
		  
			userPool.signUp(lowerCase(req.body.email), randomPassword, attrList, null, function (err, result) {
			  if (err) {
				if (err.message == 'An account with the given email already exists.'){
		  
				}else{
				  res.send(500, { "status": 500, "message": err.message || "user creation error." });
				}
			  } else {
				var cognitoUser;
				cognitoUser = result.user;
				res.status(200).send({ "status": 200, "message": "user created", "data": user })
			  }
			 });
		}else{
			res.send(500, {"status": 500, "message": "invalid data provided"});
		}
	})
	.catch(err => res.status(500).send("Invalid data provided"))
},

registerPhysioTherapist: function (req, res, next) {
	if (!req.body)
		res.status(500).send({ "status": 500, "message": "PhysioTherapist Details is required" })

	try {
		User.findAll({
			where:{
				email: req.body.email
			}
		})
		.then(user=>{
			if (!user.length){

				const attrList = [];
				const emailAttribute = { Name: 'email', Value: lowerCase(req.body.email) };
				attrList.push(new cognito.CognitoUserAttribute(emailAttribute));
				let randomPassword = randomstring.generate(15);
				var database_user;
				database_user = User.create({
					name: req.body.name,
					email: req.body.email,
					contact_no: req.body.contact_no,
					clinic_id:req.body.clinic_id,
					password:randomPassword,
					role_id: '2',
					is_active: '1'
				})
				.then(user => {
					userPool.signUp(lowerCase(req.body.email), randomPassword, attrList, null, function (err, result) {
						if (err) {
							if (err.message == 'An account with the given email already exists.') {
								res.send(500, {"status": 500, "message": err.message});

							}
							else{
								res.send(500, { "status": 500, "message": err.message || "user creation error." });
							}
						} else {
							var cognitoUser;
							cognitoUser = result.user;
							res.status(201).send(user);
							return database_user;
						}
					})
				.catch(error => res.status(500).send(error))
			})
		}
			else{
				res.status(500).send({ "status": 500, "message": "User Is already registered" });
			}
		})
	} catch (error) {
		res.status(500).send({ "status": 500, "message": "user creation error" });
	}
},

addClinic: function(req,res){

	if (!req.body) {
		res.status(500).send({ "status": 500, "message": "Clinic Details is required" })
	}
	Clinic.findAll({
		where:{
			clinic_name: req.body.clinic_name
		}
	})
	.then(checkClinic=>{
		if (!checkClinic.length){
			return Clinic.create({
				clinic_name: req.body.clinic_name,
        		google_review_link: req.body.google_review_link
			})
			.then(clinic => res.status(201).send({ "status": 200, "message": "Clinic Created Successfully", "data": clinic }))
			.catch(error => res.status(500).send(error));
		}
		else{
			res.status(400).send({"success":"1","message":"Clinic is already exists"});
		}


	})
},

listClinic: function(req, res){

	return Clinic.findAll({
		order: [
		['clinic_name', 'ASC']
		]
	})
	.then(clinic => res.status(200).send(clinic))
	.catch(error => res.status(400).send(error));
},

updateClinic: function(req,res){
	return Clinic.findAll({
		where:{
			clinic_name:req.body.clinic_name
		}
	})
	.then(checkClinic=>{
		if (!checkClinic.length){
			Clinic.update(
			{
				clinic_name:req.body.clinic_name,
				google_review_link: req.body.google_review_link
			},
			{
				where: { id: req.params.clinicId }
			}).then(function (data) {res.status(200).json(data)})
			.catch(error => res.status(400).send(error));
		}
		else{
			res.status(400).send({"success":"1","message":"Clinic already exist"});
		}

	});
},

getClinic: function (req, res){

	return Clinic.findOne({
		where: { id: req.params.clinicId }
	})
	.then(clinic => res.status(200).send(clinic))
	.catch(error => res.status(400).send(error));
},

DeleteClinic: function(req, res){
	const id = req.params.clinicId;
	Clinic.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).json({msg:'deleted successfully a customer with id = ' + id});
	});
},

listPatient:function(req,res){
	User.hasOne(Treatment, { foreignKey: 'patient_id' });
	Treatment.belongsTo(User, { foreignKey: 'patient_id' });

	Discharge.hasOne(User, { foreignKey: 'discharge' });
	User.belongsTo(Discharge, { foreignKey: 'discharge' });

	Injury.hasMany(Treatment, { foreignKey: 'injury_id' });
	Treatment.belongsTo(Injury, { foreignKey: 'injury_id' });

	Template.hasMany(Treatment, { foreignKey: 'template_id' });
	Treatment.belongsTo(Template, { foreignKey: 'template_id' });

	if(req.params.therapistId > 0){
		return User.findAll({
			where: {
				role_id: '3'
			},order: [
			['name', 'ASC']
			],
			include: [{
				model:Treatment,
				where:{
					pt_id: req.params.therapistId
				},
				include : [Injury, Template]
			},Discharge]
		})
		.then(patient => res.status(200).send(patient))
		.catch(error => res.status(400).send(error));
	}
	else{
		return User.findAll({
			where: {
				role_id: '3'
			},
			include: [{
				model:Treatment,
				include : [Injury, Template]
			},Discharge]
		})
		.then(patient => res.status(200).send(patient))
		.catch(error => res.status(400).send(error));
	}

},

getAllPatients:function(req, res){
  User.hasOne(Treatment, { foreignKey: 'patient_id' });
	Treatment.belongsTo(User, { foreignKey: 'patient_id' });

	Discharge.hasOne(User, { foreignKey: 'discharge' });
	User.belongsTo(Discharge, { foreignKey: 'discharge' });

	Injury.hasMany(Treatment, { foreignKey: 'injury_id' });
	Treatment.belongsTo(Injury, { foreignKey: 'injury_id' });

	Template.hasMany(Treatment, { foreignKey: 'template_id' });
	Treatment.belongsTo(Template, { foreignKey: 'template_id' });

  return User.findAll({
    where: {
      role_id: '3',
      clinic_id: req.params.clinicId

    },
    include: [{
      model:Treatment,
      include : [Injury, Template]
    },Discharge]
  })
  .then(patient => res.status(200).send(patient))
  .catch(error => res.status(400).send(error));

},

listPhysioTherapist: function (req, res) {
	Clinic.hasOne(User, { foreignKey: 'clinic_id' });
	User.belongsTo(Clinic, { foreignKey: 'clinic_id' });

	return User.findAll({
		where: {
			role_id: '2'
		},
		order: [
		['name', 'ASC']
		],
		include:[Clinic]
	})
	.then(PhysioTherapist => res.status(200).send(PhysioTherapist))
	.catch(error => res.status(400).send(error));
},

editPatient: function(req, res){
	return User.findOne({
		where: { id: req.params.patientId }
	})
	.then(patient =>{
		Injury.hasMany(Treatment, { foreignKey: 'injury_id' });
		Treatment.belongsTo(Injury, { foreignKey: 'injury_id' });

		Template.hasMany(Treatment, { foreignKey: 'template_id' });
		Treatment.belongsTo(Template, { foreignKey: 'template_id' });

		Treatment.find({
			where:{
				patient_id: req.params.patientId
			},include: [Injury, Template]
		})
		.then(treatment=>{
			if (treatment){
				patient.dataValues.treatment = treatment.dataValues;
			}
			res.status(200).send(patient)
		});
	})
	.catch(error => res.status(400).send(error));
},

editTherapist: function(req, res){
	return User.findOne({
		where: { id: req.params.therapistId }
	})
	.then(exercise => res.status(200).send(exercise))
	.catch(error => res.status(400).send(error));
},

deletePatient:function(req,res){
	const id = req.params.patientId;
	User.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).json({msg:'deleted successfully with id = ' + id});
	});
},

deletePhysioTherapist: function (req, res) {
	const id = req.params.therapistId;
	User.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).json({msg:'deleted successfully with id = ' + id});
	});
},

updatePhysioTherapist: function(req,res) {
	User.update(
	{
		name: req.body.name,
		email: req.body.email,
		contact_no: req.body.contact_no,
		clinic_id: req.body.clinic_id,
		is_active: '1'
	},
	{
		returning: true,
		where: { id: req.params.therapistId }
	}).then(function (rowsUpdated) {
		User.findOne(
		{
			where: { id: req.params.therapistId }
		}
		)
		.then(PhysioTherapist => res.status(200).send(PhysioTherapist))
		.catch(error => res.status(400).send(error));
	});
},

updatePatient: function(req,res){
		// return;
		User.update(
		{
			name: req.body.name,
			email: req.body.email,
			contact_no: req.body.contact_no,
			is_active: '1',
      	filled_out_review: req.body.filled_out_review
		},
		{
			returning: true,
			where: { id: req.params.patientId }
		}).then(function (rowsUpdated) {
			Treatment.update({
				injury_id: req.body.injury_id,
				patient_id: req.params.patientId,
				pt_id: req.body.therapist,
				template_id: req.body.template_id,
				start_date: req.body.start_date
			},
			{
				where:{
					id: req.body.treatment_id
				}
			})
			.then(function (rowsUpdated){
				Template_question.findAll(
				{
					where:{
						template_id: req.body.template_id
					}
				})
				.then(templateQuestionSets=>{

					TreatmentPhase.destroy({
						where:{
							treatment_id: req.body.treatment_id
						}
					}).then((r) => {

						TemplatePhases.findAll(
						{
							where:{
								template_id: req.body.template_id
							}
						})
						.then(templatePhases=>{

							for (let index = 0; index < templatePhases.length; index++) {
								TreatmentPhase.create({
									treatment_id: req.body.treatment_id,
									name: templatePhases[index].dataValues.name,
									start_week: templatePhases[index].dataValues.start_week,
									end_week: templatePhases[index].dataValues.end_week,
									sequence: templatePhases[index].dataValues.sequence
								}).then((treatmentPhase) => {

									let phase_id = templatePhases[index].dataValues.id;

									TemplatePhasePoints.findAll({
										where: {phase_id: phase_id}
									}).then((treatmentPhasePoints) => {

										for (let index = 0; index < treatmentPhasePoints.length; index++) {
											TreatmentPhasePoints.create({
												point : treatmentPhasePoints[index].dataValues.point,
												set_id : treatmentPhase.dataValues.id
											}).then((question) => {
											}).catch((error) => {
												res.status(400).send(error.message);
											});
										}

									})
									TemplatePhaseProgressCriteria.findAll({
										where: {phase_id: phase_id}
									}).then((treatmentPhaseProgressCriteria) => {

										for (let index = 0; index < treatmentPhaseProgressCriteria.length; index++) {
											TreatmentPhaseProgressCriteria.create({
												pc_point : treatmentPhaseProgressCriteria[index].dataValues.pc_point,
												set_id : treatmentPhase.dataValues.id
											}).then((question) => {
											}).catch((error) => {
												res.status(400).send(error.message);
											});
										}

									})
								})
							}
						});
					});

				});
				res.status(201).send({'message' : 'updated'})
			})
			.catch(error => res.status(400).send(error));
		})
		.catch(error => res.status(400).send(error));
	},

	clinicTherapist:function(req,res){
		User.findAll({
			where:{
				clinic_id: req.params.clinicId,
				role_id: 2
			}
		})
		.then(therapist=>{
			res.status(200).send(therapist);
		})
		.catch(error=>{
			res.status(500).send(error);
		})
	},

	patientProfile:function(req,res){
		User.hasOne(Treatment, { foreignKey: 'patient_id' });
		Treatment.belongsTo(User, { foreignKey: 'patient_id' });

		Discharge.hasMany(User, { foreignKey: 'discharge' });
		User.belongsTo(Discharge, { foreignKey: 'discharge' });

		Exercise.hasOne(Treatment_exercise,{foreignKey:'exercise_id'});
		Treatment_exercise.belongsTo(Exercise, { foreignKey: 'exercise_id' });

		Injury.hasMany(Exercise, { foreignKey: 'injury_id' });
		Exercise.belongsTo(Injury, { foreignKey: 'injury_id' });

		Injury.hasOne(Treatment, { foreignKey: 'injury_id' });
		Treatment.belongsTo(Injury, { foreignKey: 'injury_id' });

		Template.hasMany(Treatment, { foreignKey: 'template_id'});
		Treatment.belongsTo(Template, { foreignKey: 'template_id'});

		var PatientProfile = {
			profile: {},
			currentGoal:[],
			completedGoal:[],
			assigned_exercises: []
		};
		User.find({
			where:{
				id:req.params.patientId,
			},
			include:[{
				model: Treatment,
				include: [Injury, Template]
			},Discharge]
		})
		.then(profile=>{
			PatientProfile.profile = profile;
			Goal.findAll({
				where:{
					treatment_id: profile.dataValues.tbl_treatment.dataValues.id,
					status:'0'
				}
			})
			.then(currentGoal=>{
				PatientProfile.currentGoal = currentGoal;
				Goal.findAll({
					where: {
						treatment_id: profile.dataValues.tbl_treatment.dataValues.id,
						status: '1'
					}
				})
				.then(completedGoal=>{
					PatientProfile.completedGoal = completedGoal;
					Treatment_exercise.findAll({
						where:{
							treatment_id: profile.dataValues.tbl_treatment.dataValues.id
						},
						include:[{
							model: Exercise,
							include: [Injury]
						}]
					})
					.then(exercise=>{
						PatientProfile.assigned_exercises = exercise;

						PatientSurvey.findOne({
							where:{
								patient_id:req.params.patientId
							},order:[
							['date_survey_taken', 'DESC']
							]
						}).then((surveyData) =>{

							PatientProfile.function = (surveyData) ? surveyData.dataValues.score : 0;

							Patient_pain.findOne({
								where:{
									treatment_id:profile.dataValues.tbl_treatment.dataValues.id
								},order:[
								['createdAt', 'DESC']
								]
							}).then((painData) =>{

								PatientProfile.pain = (painData) ? painData.dataValues.q1 : 0;

								res.status(200).send(PatientProfile);
							});
						});
					})

				})
			})
		})
	},

	getDischarges: function(req, res){
		return Discharge.findAll({
			where:{
				default: 1
			}
		}).then((discharges) => {
			res.status(200).send(discharges);
		}).catch((error) => {
			res.status(400).send(error);
		})
	},
	dischargePatient: function (req, res) {
		if(req.body.discharge_reason == 3){
			Discharge.create({
				reason:req.body.discharge_text,
				default:0
			}).then((discharge) => {
				discharge_id = discharge.dataValues.id;
				module.exports.updateDischarge(discharge_id, req, res);
			});
		}else {
			discharge_id = req.body.discharge_reason;
			module.exports.updateDischarge(discharge_id, req, res);
		}
	},
	updateDischarge: function(discharge, req, res){
		return User.update({
			is_active: 0,
			discharge : discharge_id
		},{
			where:{
				id: req.params.patient
			}
		}).then((row) => {
			res.status(201).send({'message' : 'successful'});
		}).catch((error) => {
			res.status(400).send(error);
		});
	},
	signupEmail: function(req, res){
		let userData = {};
		if (!req.body.email) {
			res.status(400).send({ "status": 400, "message": "invalid data." });
		}
		User.findAll({
			where: {
				email: req.body.email
			}
		})
		.then(users => {
			if (users.length) {
				var user = users['0'];
				userData.role_id = user.dataValues.role_id;
				userData.password = user.dataValues.password;
				userData.clinic_id = user.dataValues.clinic_id;
				userData.email = user.dataValues.email;
				userData.name = user.dataValues.name;

				Clinic.findAll({
					where: {
						id: userData.clinic_id
					}
				})
				.then(clinics => {
					var clinic = clinics['0'];
					userData.clinic_name = clinic.dataValues.clinic_name;
					res.status(200).send({userdata: userData});
				})
			}
			else {
				res.status(400).send({"status" : 500, "message": "Email is not registered with us."});
			}
		}).catch(error => res.status(400).send({"status" : 500, "message": "Email is not registered with us."}));
	},


    createExcerciseAlias: function(req, res){
      if (!req.body)
    		res.status(500).send({ "status": 500, "message": "Alias Name Details is required" })

        Injury_Alias.findAll({
          where: {
            therapist_id: req.params.therapist_id,
            alias: req.params.alias
          }
        }).then((excerciseAlias) => {
          if (!excerciseAlias.length){
            return Injury_Alias.create({
              therapist_id: req.params.therapist_id,
              title: req.params.title,
              injury_id: req.params.injury_id,
              alias: req.params.alias,
            }).then(alias => res.status(201).send({ "status": 200, "message": "user created", "data": alias }))
          }
          else{
            res.status(500).send({ "status": 500, "message": "Alias Is already registered" });
          }
        }).catch((error) => {
          res.status(400).send(error);
        })
    },

    getInjuryAliases: function(req, res){
      if (!req.body)
    		res.status(500).send({ "status": 500, "message": "Alias Name Details is required" })
      Injury_Alias.findAll({
        where: {
          therapist_id: req.params.therapist_id,
          title: req.params.title
        }
      }).then((excerciseAlias) => {
        res.status(201).send({ "status": 200, "message": "user created", "data": excerciseAlias });
      })

    }
}
module.exports = userController;
