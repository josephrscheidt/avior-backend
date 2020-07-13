var lowerCase = require('lower-case');
const Survey = require('../models').tbl_survey;
const Question = require('../models').tbl_survey_question;
const QuestionType = require('../models').tbl_question_type;
const Answers = require('../models').tbl_survey_answer;

exports.add = (req,res) => {
    let data = req.body;

    return Question.create({
        question_text: data.question_text,
        question_type: data.question_type,
        survey_id: data.survey_id,
    })
    .then((question) => { 

        let answers = data.answers;
        let scores = data.scores;

        for (let index = 0; index < answers.length; index++) {
            Answers.create({
                answer_choice: answers[index],
                answer_score: scores[index],
                survey_id: data.survey_id,
                survey_question_id: question.dataValues.id
            }).then((answer) => {
            }).catch((error) => { res.status(400).send(error) });
        }        
        res.status(200).send(question); 
    })
    .catch((error) => { res.status(400).send(error) });
};

exports.edit = (req, res) => {

    Question.hasMany(Answers, { foreignKey: 'survey_question_id' });
    Answers.belongsTo(Question, { foreignKey: 'survey_question_id' }); 

    return Question.findOne({
        where: { 
            id: req.params.questionId
        },
        include: [Answers]
    })
    .then((question) => { res.status(200).send(question); })
    .catch((error) => { res.status(400).send(error) });
};

exports.list = (req, res) => {

    Survey.hasMany(Question, { foreignKey: 'survey_id' });
    Question.belongsTo(Survey, { foreignKey: 'survey_id' }); 

    return Survey.find({
        where: {
            id: req.params.surveyId
        },
        include: [Question]
    })
    .then((questions) => { res.status(200).send(questions) })
    .catch((error) => { res.status(400).send(error) });
};

exports.types = (req, res) => {

    return QuestionType.findAll()
    .then((questionTypes) => { res.status(200).send(questionTypes); })
    .catch((error) => { res.status(400).send(error) });

};

exports.delete = (req, res) => {

    const id = req.params.questionId;

    Question.destroy({
        where: { id: id }
    }).then(() => {
        Answers.destroy({
            where: {
                survey_question_id: req.params.questionId
            }
        }).then(() => { 
            res.status(200).json({msg:'deleted successfully with id = ' + id});
        });
    })
    .catch((error) => { res.status(400).send(error) });
};

exports.update = (req, res) => {
    let data = req.body;

    return Question.update({
        question_text: data.question_text,
        question_type: data.question_type,
        survey_id: data.survey_id,
    },{
        returning: true,
        where: { id: req.params.questionId }
    })
    .then((question) => { 
        Answers.destroy({
            where: {
                survey_question_id: req.params.questionId
            }
        }).then(() => {
            let answers = data.answers;
            let scores = data.scores;

            for (let index = 0; index < answers.length; index++) {
                Answers.create({
                    answer_choice: answers[index],
                    answer_score: scores[index],
                    survey_id: data.survey_id,
                    survey_question_id: req.params.questionId
                }).then((answer) => {
                }).catch((error) => { res.status(400).send(error) });
            }    
            res.status(201).send(question); 
        });    
    })
    .catch((error) => { res.status(400).send(error) });
};