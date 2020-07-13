var lowerCase = require('lower-case');
const Goal = require('../models').tbl_patient_goals;
const User = require('../models').tbl_user;
const Treatment = require('../models').tbl_treatment;
const Treat_Question = require('../models').tbl_treat_question;
const Templates = require('../models').tbl_template;
const Tempphases = require('../models').tbl_template_phases;
const Phasespoint = require('../models').tbl_phases_point;
const Phasesprogcriteria = require('../models').tbl_phases_progress_criteria;
const Template_about = require('../models').tbl_template_about;
const Template_didyouknow = require('../models').tbl_did_you_know;
const TemplateAbout = require('../models').tbl_template_about;
const Treatment_exercise = require('../models').tbl_treatment_exercise;
const Treatment_question = require('../models').tbl_treatment_question;

const TemplateQuestion = require('../models').tbl_template_question;
const Questions = require('../models').tbl_question;

const Patient_pain = require('../models').tbl_patient_pain;
const Patient_hep = require('../models').tbl_patient_hep;
const Exercise = require('../models').tbl_exercise;
const Sequelize = require('sequelize');
const date = require('./date');
const Op = Sequelize.Op

const TreatmentPhase = require('../models').tbl_treatment_phases;
const TreatmentPhasePoints = require('../models').tbl_treatment_phases_point;
const TreatmentPhaseProgressCriteria = require('../models').tbl_treatment_phases_progress_criteria;

const PatientSurvey = require('../models').tbl_patient_survey;

var patientController = {
    profile:function(req,res){
        return User.findAll({
            where: {
                role_id: '3',
                is_active: '1',
                id: req.params.patientId
            },
            include: [Treatment]
        })
        .then(patient => res.status(200).send(patient))
        .catch(error => res.status(400).send(error));
    },

    about:function(req,res){
        Templates.hasMany(Template_about, { foreignKey: 'template_id' });
        Template_about.belongsTo(Templates, { foreignKey: 'template_id' });

        return Treatment.find({
            where:{
                patient_id: req.params.patientId
            }
        })
        .then(treatment =>{
            Templates.find({
                where:{
                    id:treatment.dataValues.template_id
                },
                include: [Template_about]
            })
            .then(template=>{
                res.status(200).send(template);
            })
            .catch(error=>{
                res.status(500).send(error);
            })
        });
    },

    roadmap:function(req,res){

        TreatmentPhase.hasMany(TreatmentPhasePoints, { foreignKey: 'set_id' });
        TreatmentPhasePoints.belongsTo(TreatmentPhase, { foreignKey: 'set_id' });

        TreatmentPhase.hasMany(TreatmentPhaseProgressCriteria, { foreignKey: 'set_id' });
        TreatmentPhaseProgressCriteria.belongsTo(TreatmentPhase, { foreignKey: 'set_id' });

        return Treatment.find({
            where: {
                patient_id: req.params.patientId
            }
        })
        .then(treatment => {
            TreatmentPhase.findAll({
                where:{
                    treatment_id: treatment.dataValues.id
                },order:[
                ['sequence', 'ASC']
                ],
                include: [TreatmentPhaseProgressCriteria, TreatmentPhasePoints]
            })
            .then(phases=>{
                res.status(200).send(phases);
            })
            .catch(error=>{
                res.status(400).send(error);
            });
        }).catch(error=>{
            res.status(400).send(error);
        });
    },

    aboutInjury:function(req,res){
        Templates.hasMany(Template_didyouknow, { foreignKey: 'template_id' });
        Template_didyouknow.belongsTo(Templates, { foreignKey: 'template_id' });

        Templates.hasMany(TemplateAbout, { foreignKey: 'template_id' });
        TemplateAbout.belongsTo(Templates, { foreignKey: 'template_id' });

        aboutInjury ={};
        aboutInjury.tempdidouknow = [];
        aboutInjury.trementque = [];

        return Treatment.find({
            where: {
                patient_id: req.params.patientId
            }
        })
        .then(treatment => {
            Templates.findAll({
                where:{
                    id:treatment.dataValues.template_id
                },
                include: [Template_didyouknow, TemplateAbout]
            })
            .then(tempdidouknow=>{
                
                TemplateQuestion.hasMany(Questions, {foreignKey: 'set_id'});
                Questions.belongsTo(TemplateQuestion, {foreignKey: 'set_id'});

                
                // console.log(week, treatment.dataValues.id);
                TemplateQuestion.findAll({
                    attributes: ['week'],
                    where:{
                        template_id:treatment.dataValues.template_id,
                    },
                    groupBy:[
                    'week'
                    ]
                }).then((t)=>{
                    weeks = [];
                    
                    let week = date.getWeek(treatment.dataValues.start_date);

                    t.forEach(function (v) {

                        weeks.push(v.dataValues.week);

                    });

                    let weeksToUse;

                    weeks.sort().forEach(function (w) {

                        if (week > w || week === w)

                            weeksToUse = w;

                    });

                    TemplateQuestion.findAll({
                        where:{
                            template_id:treatment.dataValues.template_id,
                            week: weeksToUse
                        },include: [Questions]
                    })
                    .then(trementque=>{
                        aboutInjury.tempdidouknow = tempdidouknow;
                        aboutInjury.trementque = trementque;
                        res.status(200).send(aboutInjury);    
                    })
                });

            })
            
        })
        .catch(error=>res.status(500).send(error));
    },

    exercise:function (req,res) {
        Treatment_exercise.belongsTo(Exercise,{foreignKey:'exercise_id'});
        Exercise.hasMany(Treatment_exercise, { foreignKey: 'exercise_id' });
        return Treatment.find({
            where: {
                patient_id: req.params.patientId
            }
        })
        .then(treatment=>{
            Treatment_exercise.findAll({
                where:{
                    treatment_id: treatment.dataValues.id
                },
                include:[Exercise]
            })
            .then(exercise=>{
                res.status(200).send(exercise)
            })
            .catch(error=>res.status(500).send(error));
        })
        .catch(error => res.status(500).send(error));
    },

    exerciseDetail:function(req,res){
        Treatment_exercise.belongsTo(Exercise, { foreignKey: 'exercise_id' });
        Exercise.hasMany(Treatment_exercise, { foreignKey: 'exercise_id' });

        return Treatment_exercise.find({
            where: {
                exercise_id: req.params.exercise_id,
                treatment_id: req.params.treatment_id
            },
            include: [Exercise]
        })
        .then(exercise => {
            res.status(200).send(exercise)
        })
        .catch(error => res.status(500).send(error));
    },

    patientPain:function(req,res){

        var week = date.getWeek(req.body.treatmentstartdate);

        Patient_pain.findOne({
            where: {
                treatment_id:req.body.treatment_id,
                week:week,
                createdAt:{
                    gte: Date.parse(new Date().toJSON().slice(0,10))
                }
            },order: [ 
                [ 'createdAt', 'DESC' ]
            ]
        }).then(pain => {
            if (!pain) {
                Patient_pain.create({
                    treatment_id:req.body.treatment_id,
                    q1:req.body.q1,
                    week:week
                }).then(patientpain=>{
                    res.status(200).send(patientpain);
                })
                .catch(error=>{
                    res.status(500).send(error);
                })
            }else {
                res.status(500).send({ message : "Too many submissions, please wait!"});
            }
        })
    },

    patientHep:function(req,res){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        Patient_hep.create({
            treatment_id:req.body.treatment_id,
            patient_id: req.body.patient_id,
            hep_date:today
        })
        .then(patienthep=>{
            res.status(200).send(patienthep);
        })
        .catch(error=>{
            res.status(200).send(error);
        })
    },
    
    getPatientHep: function (req, res) {
        Treatment.find({
            where: {
                id:req.params.treatment_id
            }
        }).then((treatment) => {

            let dates = date.getWeekDates();

            Patient_hep.findAll({
                where: {
                    patient_id: req.params.patient_id,
                    treatment_id:req.params.treatment_id,
                    hep_date:{   
                        [Op.between] : [dates.startDate, dates.endDate]
                    }
                }
            })
            .then(heps => {
                res.status(200).send(heps);
            })
            .catch(error => res.status(500).send(error));
        });
    },

    getPainLevel: function (req, res) {
        // This function is responsible for returning whether or not the app should prompt the user to 
        // input pain and function

        return Patient_pain.findOne({
            where: {
                week: req.params.week,
                treatment_id:req.params.treatment_id,
                createdAt:{
                    // Midnight GMT of the current day (i.e. 8 pm previous date for eastern time)
                    gte: Date.parse(new Date().toJSON().slice(0,10))
                }
            },
            order: [ [ 'createdAt', 'DESC' ]],

        }).then((pain) => {
            // If there isn't a pain entry for the patient since midnight GMT know to ask for pain

            let painAsk = (pain) ? false : true;

            // Using sunday as day 0, get the dates of the previous sunday through this saturday
            let dates = date.getWeekDates();
            
            PatientSurvey.findOne({
                where:{
                    patient_id: req.params.patient_id,
                    date_survey_taken:{   
                        [Op.between] : [dates.startDate, dates.endDate]
                    }
                },order: [ 
                [ 'date_survey_taken', 'DESC' ]
                ]
            }).then((survey) => {

                let functionAsk = (survey) ? false : true;
                
                res.status(200).send({pain: pain, painAsk : painAsk, functionAsk : functionAsk});

            }).catch((error) => {
                res.status(400).send(error);
            })
        }).catch((error) => {
            res.status(500).send(error)
        });
    },

    getPatientGraph: function(req, res){
        // Find the treatment associated with this patient
        Treatment.findOne({
            where:{
                id: req.params.treatment_id
            }
        }).then((treatment) => {
            // With that treatment in hand, find all the pain entries associated with that treatment

            Patient_pain.findAll({
                attributes: ['week', 'q1', 'createdAt'],
                where:{
                    treatment_id: req.params.treatment_id
                },order: [
                ['createdAt', 'ASC']
                ]
            }).then(pains => {
                // Now find all the survey entries associated with this patient.
                PatientSurvey.findAll({
                    where:{
                        patient_id: treatment.dataValues.patient_id
                    },order: [
                    ['date_survey_taken', 'ASC']
                    ]
                }).then((surveyRows) => {
                    // Create an array of the survey scores indexed by week. this is an issue because
                    // it assumes a single entry for each week with no gaps. need to make robust

                    const weeks = [];
                    const checkWeeks = [];
                    const functions = [];
                    const functionDates = [];
                    const rawPain = [];
                    const pain_counts = [];
                    const graphData = {weeks: '', pains: '', functions: ''};
                    let functionWeek = 0;

                    surveyRows.forEach(function (survey) {
                        functionWeek = date.getWeek(treatment.dataValues.start_date, survey.dataValues.date_survey_taken);
                        
                        if (!functionDates[functionWeek]) {functionDates[functionWeek] = survey.dataValues.score};

                    });

                    pains.forEach((pain, key) => {
                        rawPain.push(pain.dataValues.week);
                        if (checkWeeks.indexOf(pain.dataValues.week) >= 0){
                            weeks.push('');
                            functions.push(null);
                        }else{
                            weeks.push('Week '+pain.dataValues.week);
                            functions.push(functionDates[pain.dataValues.week]);
                            checkWeeks.push(pain.dataValues.week);
                        }
                        // if(pain.dataValues.week == )
                        pain_counts.push(parseFloat(pain.dataValues.q1));
                    });

                    graphData.weeks = weeks;
                    graphData.pains = pain_counts;
                    graphData.functions = functions;

                    res.status(200).send(graphData);
                });
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },

    getLevelFunction: function (req, res){

        let therapist = req.params.therapist;
        
        let clinic = req.params.clinic;
        
        if(clinic != "null"){

            return User.findAll({
                attributes: ['id'],
                where : {
                    clinic_id : clinic,
                    role_id : 2,
                }
            }).then((therapistsData) => {

                let therapists = [];

                therapistsData.forEach(function(therapist) {
                    therapists.push(therapist.id);
                });

                Treatment.findAll({
                    where:{
                        pt_id: therapists
                    }
                }).then((treatmentData) => {

                    if(treatmentData.length){

                        let patients = [];

                        let treatments = [];

                        treatmentData.forEach(function(treatment) {
                            treatments.push(treatment.id);
                            patients.push(treatment.patient_id);
                        });
                        
                        module.exports.gatherPoints(treatments, patients, res);
                    }else{
                        res.status(200).send({'pains' : [0,0,0], 'functions' : [0,0,0]});
                    }
                }).catch((error) => {
                    res.status(400).send(error);
                });
            });

        }else{
            module.exports.gatherPoints([], [], res);
        }
    },

    gatherPoints: function(treatments, patients, res){

        let painOptions = {};
        
        painOptions.attributes = [
        [Sequelize.literal('(select count(q1) from tbl_patient_pains where q1 BETWEEN 0 AND 3)'), '0-3'],
        [Sequelize.literal('(select count(q1) from tbl_patient_pains where q1 BETWEEN 4 AND 7)'), '4-7'],
        [Sequelize.literal('(select count(q1) from tbl_patient_pains where q1 BETWEEN 8 AND 10)'), '8-10']
        ];
        
        if(treatments.length){
            painOptions.where = {
                treatment_id: treatments
            }
        }
        
        let surveyOptions = {};
        
        surveyOptions.attributes = [
        [Sequelize.literal('(select count(score) from tbl_patient_surveys where score BETWEEN 0 AND 49)'), '0-49'],
        [Sequelize.literal('(select count(score) from tbl_patient_surveys where score BETWEEN 50 AND 74)'), '50-74'],
        [Sequelize.literal('(select count(score) from tbl_patient_surveys where score BETWEEN 75 AND 100)'), '75-100']
        ]
        
        if (patients.length) {   
            surveyOptions.where = {
                patient_id: patients
            }
        }

        Patient_pain.findOne(painOptions).then((painCounts) => {
            let pains = Object.values(painCounts.dataValues);

            PatientSurvey.findOne(surveyOptions).then((functionCounts) => {

                let functions = Object.values(functionCounts.dataValues);

                res.status(200).send({'pains' : pains, 'functions' : functions});

            }).catch((error) => {
                res.status(400).send(error);
            });
        }).catch((error) => {
            res.status(400).send(error);
        });
    }
}


module.exports = patientController;
