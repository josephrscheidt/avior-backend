var lowerCase = require('lower-case');
const Survey = require('../models').tbl_survey;
const Diagnosis = require('../models').tbl_template;
const Question = require('../models').tbl_survey_question;
const Answers = require('../models').tbl_survey_answer;
const PatientSurvey = require('../models').tbl_patient_survey;
const sequelize = require('sequelize');

exports.add = (req,res) => {
    let data = req.body;

    return Survey.create({
        survey_title: data.survey_title,
        survey_description: data.survey_description,
        diagnosis_id: data.diagnosis_id,
    })
    .then((survey) => { res.status(201).send(survey) })
    .catch((error) => { res.status(400).send(error) });
};

exports.list = (req, res) => {

    Diagnosis.hasOne(Survey, { foreignKey: 'diagnosis_id' });
    Survey.belongsTo(Diagnosis, { foreignKey: 'diagnosis_id' }); 

    return Survey.findAll({
        order: [
        ['survey_title', 'ASC']
        ],
        include: [Diagnosis]
    })
    .then((surveys) => { res.status(200).send(surveys) })
    .catch((error) => { res.status(400).send(error) });
};

exports.edit = (req, res) => {

    return Survey.findOne({
        where: { 
            id: req.params.surveyId
        }
    })
    .then((survey) => { res.status(200).send(survey); })
    .catch((error) => { res.status(400).send(error) });
};

exports.delete = (req, res) => {

    const id = req.params.surveyId;

    Survey.destroy({
        where: { id: id }
    }).then(() => {
        res.status(200).json({msg:'deleted successfully with id = ' + id});
    });
};

exports.update = (req, res) => {
    let data = req.body;

    return Survey.update({
        survey_title: data.survey_title,
        survey_description: data.survey_description,
        diagnosis_id: data.diagnosis_id,
    },{
        returning: true,
        where: {
            id: req.params.surveyId
        }
    })
    .then((survey) => { res.status(201).send(survey) })
    .catch((error) => { res.status(400).send(error) });
};

exports.getSurvey = (req, res) => {

    Survey.hasMany(Question, { foreignKey : 'survey_id'} );
    Question.belongsTo(Survey, { foreignKey : 'survey_id'} );

    Question.hasMany(Answers, { foreignKey : 'survey_question_id'} );
    Answers.belongsTo(Question, { foreignKey : 'survey_question_id'} );

    Survey.findOne({
        where : {
            diagnosis_id: req.params.diagnosisId
        },
        include: [{
            model: Question,
            include: [Answers]
        }],order : [
        [Question, 'question_text', 'ASC']
        ]
    }).then((survey) => {
        res.status(200).send(survey);
    }).catch((error) => {
        res.status(400).send({message: error.message});
    });

}

exports.addSurvey = (req, res) => {

    let data = req.body;

    PatientSurvey.findOne({
        where: {
            survey_id: data.survey_id,
            patient_id: data.patient_id,
            date_survey_taken:{
                gte: Date.parse(new Date().toJSON().slice(0,10))
            }
        },order: [ 
            [ 'date_survey_taken', 'DESC' ]
        ]
    }).then(survey => {
        if(!survey) {
            Answers.find({
                attributes: [[sequelize.fn('sum', sequelize.col('answer_score')), 'total']],
                where: {
                    id : eval(data.answers)
                }
            }).then((answers) => {
        
                PatientSurvey.create({
                    survey_id: data.survey_id,
                    patient_id: data.patient_id,
                    score: answers.dataValues.total
                }).then((patient) => {
                    res.status(200).send({ message : 'Success' });
                }).catch((error) => {
                    res.status(400).send( { message : error.message} );
                });
        
            }).catch((error) => {
                res.status(400).send( { message : error.message} );
            });
        }else {
            res.status(400).send( {message : "Survey Already Submitted, please wait!"});
        }
    })

}