const Template = require('../models').tbl_template;
const Template_about = require('../models').tbl_template_about;
const Template_didyouknow = require('../models').tbl_did_you_know;
const Question = require('../models').tbl_question;
const Treat_Question = require('../models').tbl_treat_question;
const Template_question = require('../models').tbl_template_question;
const Treatment_question = require('../models').tbl_treatment_question;
const Injury = require('../models').tbl_injury;
const Treatment = require('../models').tbl_treatment;
var config = require('../config/awsconfig.js');
var multer = require('multer');
var S3FS = require('s3fs');
var lowerCase = require('lower-case');
var randomstring = require("randomstring");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 25 * 1024 * 1024
    }
}).array('image', 1);

Template.hasMany(Template_about, { foreignKey: 'template_id' });
Template_about.belongsTo(Template, { foreignKey: 'template_id' });

Template.hasMany(Template_didyouknow, { foreignKey: 'template_id' });
Template_didyouknow.belongsTo(Template, { foreignKey: 'template_id' });

exports.delete = (req, res) => {

    return Template.destroy({
        where: {
            id: req.params.templateId
        }
    })
    .then(template => {
        Template_about.destroy({
            where: {
                template_id: req.params.templateId
            }
        })
        .then(template_about => {
            Template_didyouknow.destroy({
                where: {
                    template_id: req.params.templateId
                }
            })
            .then(template_about => res.status(200).json({msg:'deleted successfully'}));
        });
    })
    .catch(error => res.status(400).send(error));
};

exports.list = (req, res) => {

    Injury.hasMany(Template, { foreignKey: 'injury_id' });
    Template.belongsTo(Injury, { foreignKey: 'injury_id' });

    return Template.findAll({
        where:{
            is_active:'1'
        },
        order: [
        ['about_desc', 'ASC']
        ],
        include: [Template_about, Template_didyouknow, Injury]
    })
    .then(template =>
        res.status(200).send(template)
        )
    .catch(error => res.status(400).send(error));
};

exports.update = (req, res) => {
    upload(req, res, function (err) {
        // console.log(req.files.length);

        if(req.files.length>0){
            try {
                if (!req.is('multipart/form-data')) {
                    return next(new errors.InvalidContentError("Expects 'multipart/form-data'"));
                }
                let formData = req.body;

                if (!formData) {
                    return next(new errors.InvalidContentError("Exercise content can not be empty"));
                }

                var bucketName = config.S3BUCKETNAME;

                var s3fsImpl = new S3FS(bucketName, {
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey
                });

                var fileNameSplit = req.files[0].originalname.split('.');

                var fileExtension = lowerCase(fileNameSplit[fileNameSplit.length - 1]);

                if (fileExtension.length > 3)
                    fileExtension = fileExtension.substring(0, 3);

                var fileNameObfuscated = randomstring.generate(15) + fileNameSplit[0] + '.' + fileExtension;

                s3fsImpl.writeFile(fileNameObfuscated, req.files[0].buffer).then(function (fileWriteResult) {
                    Template.update(
                    {
                        injury_id: req.body.injury_id,
                        about_desc: req.body.about_desc,
                        about_image: config.S3BASEURL + fileNameObfuscated,
                        is_active: '1'
                    },
                    {
                        returning: true,
                        where: { id: req.params.templateId }
                    }).then(function (rowsUpdated) {
                        Template_about.destroy({
                            where: {
                                template_id: req.params.templateId
                            }
                        })
                        .then(template_about => {
                            Template_didyouknow.destroy({
                                where: {
                                    template_id: req.params.templateId
                                }
                            })
                            .then(tempdidyouknow=>{
                                var about_point = req.body.about_point;
                                var did_you_know = req.body.did_you_know;
                                for (let index = 0; index < about_point.length; index++) {
                                    Template_about.create({
                                        template_id: req.params.templateId,
                                        about_point: about_point[index],
                                        is_active: '1'
                                    })
                                    .then(templateabout => {
                                    })
                                    .catch(error => res.status(400).send(error));
                                }

                                for (let index1 = 0; index1 < did_you_know.length; index1++) {
                                    Template_didyouknow.create({
                                        template_id: req.params.templateId,
                                        description: did_you_know[index1],
                                        is_active: '1'
                                    })
                                    .then(templatedidyouknow => {
                                    })
                                    .catch(error => res.status(400).send(error))
                                }
                                res.status(200).send({'success':'1',"message":"Template update successfully"});
                            })
                            .catch(error => res.status(400).send(error));
                        })
                        .catch(error => res.status(400).send(error));
                    })
                    .catch(error => res.status(400).send(error));
                }).error(function (err) {
                    res.status(500).send({
                        "message": "Error uploading case image",
                        "error": JSON.stringify(err)
                    });
                });
            } catch (err) {
                res.status(500).send({
                    "message": "Error uploading case image.",
                    "error": JSON.stringify(err)
                });
            }  
        }
        else{
            Template.update(
            {
                injury_id: req.body.injury_id,
                about_desc: req.body.about_desc,
                is_active: '1'
            },
            {
                returning: true,
                where: { id: req.params.templateId }
            }).then(function (rowsUpdated) {
                Template_about.destroy({
                    where: {
                        template_id: req.params.templateId
                    }
                })
                .then(template_about => {
                    Template_didyouknow.destroy({
                        where: {
                            template_id: req.params.templateId
                        }
                    })
                    .then(tempdidyouknow=>{
                        var about_point = req.body.about_point;
                        var did_you_know = req.body.did_you_know;
                        for (let index = 0; index < about_point.length; index++) {
                            Template_about.create({
                                template_id: req.params.templateId,
                                about_point: about_point[index],
                                is_active: '1'
                            })
                            .then(templateabout => {
                            })
                            .catch(error => res.status(400).send(error));
                        }

                        for (let index1 = 0; index1 < did_you_know.length; index1++) {
                            Template_didyouknow.create({
                                template_id: req.params.templateId,
                                description: did_you_know[index1],
                                is_active: '1'
                            })
                            .then(templatedidyouknow => {
                            })
                            .catch(error => res.status(400).send(error))
                        }
                        res.status(200).send({'success':'1',"message":"Template update successfully"});
                    })
                    .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        }
    });
}

//New Api
exports.add = (req, res) => {
    upload(req, res, function (err) {

        if (!req.is('multipart/form-data')) {
            return next(new errors.InvalidContentError("Expects 'multipart/form-data'"));
        }
        let formData = req.body;

        if (!formData) {
            return next(new errors.InvalidContentError("Exercise content can not be empty"));
        }

        var bucketName = config.S3BUCKETNAME;

        //TODO two ways of storing config, remove this and unify under config
        var s3fsImpl = new S3FS(bucketName, {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey
        });

        var fileNameSplit = req.files[0].originalname.split('.');

        var fileExtension = lowerCase(fileNameSplit[fileNameSplit.length - 1]);

        if (fileExtension.length > 3)
            fileExtension = fileExtension.substring(0, 3);

        var fileNameObfuscated = randomstring.generate(15) + fileNameSplit[0] + '.' + fileExtension;

        s3fsImpl.writeFile(fileNameObfuscated, req.files[0].buffer).then(function (fileWriteResult) {

            Template.create({
                injury_id: req.body.injury_id,
                about_desc: req.body.about_desc,
                about_image: config.S3BASEURL + fileNameObfuscated,
                is_active: '1',
                created_by: "1",
                updated_by: "1"
            })
            .then(template => {
                const about_point = req.body.about_point;
                const did_you_know = req.body.did_you_know;
                for (let index = 0; index < about_point.length; index++) {
                    Template_about.create({
                        template_id: template.dataValues.id,
                        about_point: about_point[index],
                        is_active: '1',
                        created_by: "1",
                        updated_by: "1"
                    });
                }

                for (let index1 = 0; index1 < did_you_know.length; index1++) {
                    Template_didyouknow.create({
                        template_id: template.dataValues.id,
                        description: did_you_know[index1],
                        is_active: '1',
                        created_by: "1",
                        updated_by: "1"
                    });
                }
                res.status(200).send(template);
            })
            .catch((error) => {
                res.status(400).send(error);
            });
        }).error(function (err) {
            res.status(500).send({
                "message": "Error uploading case image",
                "error": JSON.stringify(err)
            });
        });
    });
}

exports.addquestion = (req,res) => {
    if (!req.body)
        res.status(500).send({ "status": 500, "message": "Patient Details is required" })

    try {
        return Template_question.create({
            template_id:req.body.template_id,
            week:req.body.week,
            priority:req.body.priority
        })
        .then((question) => {
            var questions = req.body.questions;
            for (let index = 0; index < questions.length; index++) {
                Question.create({
                    question : questions[index],
                    set_id : question.dataValues.id
                }).then((question) => {
                }).catch((error) => {
                    res.status(400).send(error.message);
                });
            }
            res.status(200).send(question);
        }).catch((error) => {
            res.status(400).send(error.message);
        });
    } catch (error) {
        res.send(500, { "status": 500, "message": "Template Question Add Error" });
    }
}

exports.edit = (req, res) => {

    return Template.findOne({
        where: {
            id: req.params.templateId
        },
        include: [Template_about, Template_didyouknow]

    }).then(template=>{
        res.status(200).send(template);
    }).catch(error => res.status(400).send(error));
}

exports.editquestion = (req, res) => {
    /*console.log(req.body);
    return;*/
    if (!req.body)
        res.status(500).send({ "status": 500, "message": "Patient Details is required" })

    try {
        if(req.body.flag =='0' ){
            return Template_question.update({
                template_id: req.body.template_id,
                week: req.body.week,
                priority: req.body.priority
            },
            {
                returning: true,
                where: { id: req.params.questionId }
            })
            .then(function (rowsupdated){

                Template_question.findOne({
                    where:{
                        template_id:req.body.template_id,
                        week: req.body.week
                    }
                }).then((template) => {

                    Question.destroy({
                        where:{set_id : template.dataValues.id}
                    }).then((question)=>{
                        var questions = req.body.questions;
                        for (let index = 0; index < questions.length; index++) {
                            Question.create({
                                question : questions[index],
                                set_id : template.dataValues.id
                            }).then((question) => {
                            }).catch((error) => {
                                res.status(400).send(error.message);
                            });
                        }
                        res.status(200).send(question);
                    });

                })
                res.status(200).send({"success":'1',"Message":"Question Update successfully"})
            })
            .catch(error => res.status(500).send(error));
        }else{
            return Treatment_question.update({
                treatment_id: req.body.treatment_id,
                week: req.body.week,
                priority: req.body.priority
            },
            {
                returning: true,
                where: { id: req.params.questionId }
            })
            .then(function (rowsupdated){
                Treatment_question.findOne({
                    where:{id:req.body.treatment_id}
                }).then((treatment) => {
                    Treat_Question.destroy({
                        where:{set_id : treatment.dataValues.id}
                    }).then((question)=>{
                        var questions = req.body.questions;
                        for (let index = 0; index < questions.length; index++) {
                            Treat_Question.create({
                                question : questions[index],
                                set_id : treatment.dataValues.id
                            }).then((question) => {
                            }).catch((error) => {
                                res.status(400).send(error.message);
                            });
                        }
                        res.status(200).send(question);
                    });
                    
                })
                res.status(200).send({"success":'1',"Message":"Question Update successfully"})
            })
            .catch(error => res.status(500).send(error));
        }
    } catch (error) {
        res.send(500, { "status": 500, "message": "Question Update error" });
    }
}

exports.deletequestion = (req,res) =>{
    return Template_question.destroy({
        where: {
            id: req.params.questionId
        }
    })
    .then(function (rowsUpdated){
        res.status(200).send({"success":"1","message":"QUestion Deleted successfully"});
    })
    .catch(error => res.status(400).send(error));
}

exports.listquestion = (req,res) => {
    if(req.params.flag=='0'){
        Template_question.hasMany(Question, {foreignKey: 'set_id'});
        Question.belongsTo(Template_question, {foreignKey: 'set_id'});

        return Template_question.findAll({
            where: {
                template_id: req.params.templateId
            },
            order: [
            ['week', 'ASC']
            ],include: [Question]
        })
        .then(tempquestion =>
            res.status(200).send(tempquestion)
            )
        .catch(error => res.status(400).send(error));    
    }
    else{

        Treatment_question.hasMany(Treat_Question, {foreignKey: 'set_id'});
        Treat_Question.belongsTo(Treatment_question, {foreignKey: 'set_id'});

        return Treatment_question.findAll({
            where: {
                treatment_id: req.params.templateId
            },
            order: [
            ['week', 'ASC']
            ],include:[Treat_Question]
        })
        .then(tempquestion =>
            res.status(200).send(tempquestion)
            )
        .catch(error => res.status(400).send(error));
    }
}

exports.getquestion = (req, res) => {
    if(req.params.flag=='0'){
        Template_question.hasMany(Question, {foreignKey: 'set_id'});
        Question.belongsTo(Template_question, {foreignKey: 'set_id'});
        return Template_question.findOne({
            where: {
                id: req.params.questionId
            },
            order: [
            ['week', 'ASC']
            ],include: [Question]
        })
        .then(tempquestion =>
            res.status(200).send(tempquestion)
            )
        .catch(error => res.status(400).send(error));
    }
    else{
        Treatment_question.hasMany(Question, {foreignKey: 'set_id'});
        Question.belongsTo(Treatment_question, {foreignKey: 'set_id'});
        return Treatment_question.findOne({
            where: {
                id: req.params.questionId
            },include: [Question]
        })
        .then(tempquestion =>
            res.status(200).send(tempquestion)
            )
        .catch(error => res.status(400).send(error));
    }
}

exports.templateOnInjury = (req,res)=>{
    return Template.findAll({
        where:{
            injury_id:req.params.injury_id
        }
    })
    .then(injuryTemplate => res.status(200).send(injuryTemplate))
    .catch(error=>res.status(400).send(error));
}

exports.templateAssign = (req, res)=>{
    Treatment.update(
    {
        template_id:req.body.template_id
    },
    {
        where:{
            id:req.body.treatment_id
        }
    }
    )
    .then(function(rowsUpdated){
        Template_question.findAll(
        {
            where:{
                template_id: req.body.template_id
            }
        })
        .then(templatequestion=>{
            for (let index = 0; index < templatequestion.length; index++) {
                Treatment_question.create({
                    treatment_id: req.body.treatment_id,
                    week: templatequestion[index].dataValues.week,
                    priority: templatequestion[index].dataValues.priority
                })
                .then(treatmentque=>{
                    var questions = req.body.questions;
                    for (let index = 0; index < questions.length; index++) {
                        Treat_Question.create({
                            question : questions[index],
                            set_id : question.dataValues.id
                        }).then((question) => {
                        }).catch((error) => {
                            res.status(400).send(error.message);
                        });
                    }
                    res.status(200).send(question);
                })
            }
            res.status(200).send({"success":'1',"Message":"Successful"});
        })
    })
    .catch(error=>res.status(500).send(error));
}