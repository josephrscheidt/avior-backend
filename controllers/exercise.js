const Exercise = require('../models').tbl_exercise;
const Injury = require('../models').tbl_injury;
const Treatment = require('../models').tbl_treatment;
const Treatment_exercise = require('../models').tbl_treatment_exercise;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var multer = require('multer');
var config = require('../config/awsconfig.js');
var S3FS = require('s3fs');
var lowerCase = require('lower-case');
var randomstring = require("randomstring");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fieldSize: 25 * 1024 * 1024
    }
}).array('image',1);

/*Injury.hasMany(Exercise, { foreignKey: 'injury_id' });
Exercise.belongsTo(Injury, { foreignKey: 'injury_id' });*/

/*Treatment_exercise.hasMany(Exercise, { foreignKey: 'exercise_id' });
Exercise.belongsTo(Treatment_exercise, { foreignKey: 'exercise_id' });*/

exports.add = (req,res) => {
    upload(req, res, function (err) {
       //AWS S3 bucket Code
       try {
           if (!req.is('multipart/form-data')) {
               return next(new errors.InvalidContentError("Expects 'multipart/form-data'"));
           }

           let formData = req.body;

           if (!formData) {
               return next(new errors.InvalidContentError("Exercise content can not be empty"));
           }
            //s3fsImpl.create();
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

                return Exercise.create({
                    title: req.body.title,
                    description: req.body.description,
                    injury_id: (req.body.injury_id == "") ? 0 : req.body.injury_id,
                    purpose: req.body.purpose,
                    image: config.S3BASEURL +  fileNameObfuscated,
                    is_active: '1'
                })
                .then(exercise => res.status(201).send(exercise))
                .catch(error => res.status(400).send(error));

            }).error(function (err) {
                res.status(500).send({
                    "message": "Error uploading case image.1",
                    "error": JSON.stringify(err)
                });
            });
        } catch (err) {

            res.status(500).send({
                "message": "Error uploading case image.",
                "error": JSON.stringify(err)
            });
        }
    });
};

exports.getAll = (req, res) => {
    return Exercise.findAll({
        order: [
        ['group_id', 'ASC']
        ],
        where:{
            is_active:'1'
        }
    })
    .then(exercise => res.status(200).send(exercise))
    .catch(error => res.status(400).send(error));
}

exports.list = (req, res) => {
    Injury.hasMany(Exercise, { foreignKey: 'injury_id' });
    Exercise.belongsTo(Injury, { foreignKey: 'injury_id' });
    return Exercise.findAll({
        order: [
        ['title', 'ASC']
        ],
        include : [Injury],
        where:{
            is_active:'1'
        }
    })
    .then(exercise => res.status(200).send(exercise))
    .catch(error => res.status(400).send(error));
};

exports.edit = (req, res) => {
    Injury.hasMany(Exercise, { foreignKey: 'injury_id' });
    Exercise.belongsTo(Injury, { foreignKey: 'injury_id' });
    return Exercise.findOne({
        where: {
            id: req.params.exercsieId,
            is_active:'1'
        },
        include: [Injury],
    })
    .then(exercise => res.status(200).send(exercise))
    .catch(error => res.status(400).send(error));
};

exports.update = (req, res) => {
    console.log("request body: ", req.body);
    console.log("request files: ", req.files);
    console.log("raw request: ", req);
    upload(req, res, function (err) {

        if(req.files.length>0){
            try {
                if (!req.is('multipart/form-data')) {
                    return next(new errors.InvalidContentError("Expects 'multipart/form-data'"));
                }
                let formData = req.body;

                if (!formData) {
                    return next(new errors.InvalidContentError("Exercise content can not be empty"));
                }
                //s3fsImpl.create();
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

                var fileNameObfuscated = randomstring.generate(15) + fileNameSplit[0] + '-' + formData.title + '.' + fileExtension;

                s3fsImpl.writeFile(fileNameObfuscated, req.files[0].buffer).then(function (fileWriteResult) {
                    Exercise.update(
                    {
                        injury_id: (req.body.injury_id == "") ? 0 : req.body.injury_id,
                        purpose: req.body.purpose,
                        title: req.body.title,
                        description: req.body.description,
                        purpose: req.body.purpose,
                        image: config.S3BASEURL + fileNameObfuscated,
                    },
                    {
                        returning: true,
                        where: {
                            id: req.params.exercsieId
                        }
                    })
                    .then(function (rowsUpdated) {
                        Exercise.findOne({
                            where: {
                                id: req.params.exercsieId,
                                is_active: '1'
                            }
                        })
                        .then(exercise => res.status(200).send(exercise))
                        .catch(error => res.status(400).send(error));
                    })
                    .catch(error => res.status(400).send(error));
                }).error(function (err) {
                    res.status(500).send({
                        "message": "Error uploading case image.1",
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

            Exercise.update(
            {
                injury_id: (req.body.injury_id == "") ? 0 : req.body.injury_id,
                title: req.body.title,
                description: req.body.description,
                purpose: req.body.purpose
            },
            {
                returning: true,
                where: { id: req.params.exercsieId }
            })
            .then(function (rowsUpdated){
                Exercise.findOne({
                    where: { id: req.params.exercsieId },
                    include: [Injury],
                })
                .then(exercise => res.status(200).send(exercise))
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        }
    });
};

exports.delete = (req, res) => {
    const id = req.params.exercsieId;
    Exercise.update({
        is_active : 0
    },{
        where: { id: id }
    }).then(() => {
        res.status(200).json({msg:'deleted successfully with id = ' + id});
    });
};

exports.getAssigned = (req, res) => {
    //relates two tables by foreignKey exercise_id
    Exercise.hasMany(Treatment_exercise, { foreignKey: 'exercise_id' });
    Treatment_exercise.belongsTo(Exercise, { foreignKey: 'exercise_id' });

    var assigned_exercises = [];
    if (req.params.treatmentId){
        Treatment_exercise.findAll({
            where:{
                treatment_id: req.params.treatmentId,
            },
            include: [Exercise]
        })
        .then(assignExercise => {
            if(assignExercise){
                for (let i = 0; i < assignExercise.length; i++) {
                    assigned_exercises[i] = assignExercise[i].dataValues;
                }
                res.status(200).send(assigned_exercises);
            }
        })
        .catch(error => res.status(500).send(error));
    }else{
        res.status(500).send({"Message":"please assign treatment plan to patient"});
    }
}

exports.injuryExercise = (req, res )=>{
    //relates two tables by foreignKey exercise_id
    Exercise.hasMany(Treatment_exercise, { foreignKey: 'exercise_id' });
    Treatment_exercise.belongsTo(Exercise, { foreignKey: 'exercise_id' });
    var Exercises = {
        exercises :[],
        assigned_exercises:[]
    };
    if (req.params.treatmentId){
        Treatment_exercise.findAll({
            where:{
                treatment_id: req.params.treatmentId,
            },
            include:[Exercise]
        })
        .then(assignExercise => {
            var ids = [];
            if(assignExercise){
                for (let i = 0; i < assignExercise.length; i++) {
                    ids.push(assignExercise[i].dataValues.exercise_id);
                    Exercises.assigned_exercises[i] = assignExercise[i].dataValues;
                }
            }

            Treatment.findOne({
                where:{
                    id:req.params.treatmentId
                }
            })
            .then(treatment=>{
                Exercise.findAll({
                    where: {
                        injury_id: [treatment.dataValues.injury_id, Sequelize.literal('(select id from tbl_injuries where injury_name ="Generic")')],
                        is_active:'1',
                        id: {
                            [Op.notIn]:ids
                        }
                    },order:[
                    ['title', 'ASC']
                    ]
                }).then( injuryExericse => {

                    for (let index = 0; index < injuryExericse.length; index++) {
                        Exercises.exercises[index] = injuryExericse[index].dataValues;
                    }

                    res.status(200).send(Exercises);
                })
                .catch(error => res.status(500).send(error));
            })
            .catch(error => res.status(500).send(error));
        })


    }
    else{
        res.status(500).send({"Message":"please assign treatment plan to patient"});
    }
}

exports.addExercise = (req,res )=> {
    if(req.body){
        return Treatment_exercise.create({
            treatment_id:req.body.treatment_id,
            exercise_id: req.body.exercise_id,
            description:req.body.description,
            reps:req.body.reps,
            sets: req.body.sets,
            perform: req.body.perform
        })
        .then(patientExercise=>{
            res.status(200).send(patientExercise)
        })
        .catch(error=>{
            res.status(500).send(error)
        })
    }
}

exports.updateExercise = (req, res) => {
    if (req.body) {
        return Treatment_exercise.update({
            treatment_id: req.body.treatment_id,
            description: req.body.description,
            reps: req.body.reps,
            sets: req.body.sets,
            perform: req.body.perform
        },{
            where:{
                id:req.params.exerciseId
            }
        })
        .then(function(rowsUpdated) {
            res.status(200).send({"message":"Exercise Udpate successfully"});
        })
        .catch(error => {
            res.status(500).send(error);
        })
    }
}

exports.deleteExercise = (req, res) => {
    if (req.body) {
        return Treatment_exercise.destroy({
            where: {
                id: req.params.exerciseId
            }
        })
        .then(function (rowsUpdated) {
            res.status(200).send({ "message": "Exercise Deleteed successfully" });
        })
        .catch(error => {
            res.status(500).send(error);
        })
    }
}

exports.editTreatmentExercise = (req, res) => {
    Exercise.hasMany(Treatment_exercise, { foreignKey: 'exercise_id' });
    Treatment_exercise.belongsTo(Exercise, { foreignKey: 'exercise_id' });

    return Treatment_exercise.findOne({
        where: {
            id: req.params.exercsieId
        },include : [Exercise]
    })
    .then(exercise => res.status(200).send(exercise))
    .catch(error => res.status(400).send(error));

};

exports.exerciseDay = (req,res)=>{
    Treatment.update({
        week_day:req.body.week_day
    },{
        where:{
            id:req.params.treatmentId
        }
    })
    .then(treatmentExercise=>{
        res.status(200).send({'success':'1',"message":'Exercise Week Day updated succesfully'});
    })
    .catch(error=>{
        res.status(500).send(error);
    })
}

exports.group = (req, res) => {
  Exercise.findAll(
    {
      attributes: ['title', 'id'],
      where: {
        is_active: 1
      }
    }
  )
  .then(res => {
    let numOfOccurencesMap = {};
    let exerciseNameMap = {};
    let groupIdCounter = 1;
    let updatedRecords = [];

    for (let i = 0; i < res.length; i++){

      let exercise = res[i];
      let updatedExercise = {}
      let title = exercise.dataValues.title.trim();
      if (title.includes('General')){ //Do not remove trim methods
        let index = title.indexOf("General");
        title = title.trim();
        title = title.substring(0, index);
        title = title.trim();
        title = title.substring(0, title.length-1);
        title = title.trim();
      }

      else if (title.includes('Generic')){ //Do not remove trim methods
        let index = title.indexOf("Generic");
        title = title.trim();
        title = title.substring(0, index);
        title = title.trim();
        title = title.substring(0, title.length-1);
        title = title.trim();
      }

      if (exerciseNameMap[title] == null){
        exerciseNameMap[title] = groupIdCounter;
        numOfOccurencesMap[title] = 1;
        updatedExercise.title = exercise.dataValues.title;
        updatedExercise.groupId = groupIdCounter;
        updatedExercise.id = exercise.dataValues.id;
        updatedRecords.push(updatedExercise);
        groupIdCounter++;
      }
      else{
        let count = numOfOccurencesMap[title];
        count++
        numOfOccurencesMap[title] = count;

        let groupId = exerciseNameMap[title];
        updatedExercise.title = exercise.dataValues.title;
        updatedExercise.groupId = groupId;
        updatedExercise.id = exercise.dataValues.id;
        updatedRecords.push(updatedExercise);

      }
    }

    let csvMap = turnTransformMap(exerciseNameMap, numOfOccurencesMap);

    exerciseBulkUpdate(updatedRecords);
  })
  .catch(err => console.log(err));
}

let turnTransformMap = (map, occuranceMap) => {
  let ret = [];
  for (key in map){
    let value = map[key];
    let occurances = occuranceMap[key];
    let obj = {
      title: key,
      groupId: value,
      numOfOccurences: occurances
    }
    ret.push(obj);
  }
  return ret
}

let writeToCSV = (array, filePath) => {
  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
        {id: 'title', title: 'Title'},
        {id: 'groupId', title: 'Group ID'},
        {id: 'numOfOccurences', title: 'Occurances'}
    ]
  });
  csvWriter.writeRecords(array)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
}


let updateExerciseGroupId =  (exerciseTitle, groupId) => {
  return Exercise.update(
    {
      group_id: groupId
    },
    {
      where: {
        title: exerciseTitle
      }
    }
  )
}

let exerciseBulkUpdate = (records) => {
  if (records.length == 0){
    return
  }
  else{
    let recordToUpdate = records.pop();

    Exercise.update(
      {
        group_id: recordToUpdate.groupId
      },
      {
        where: {
          title: recordToUpdate.title,
          id: recordToUpdate.id
        }
      }
    )
    .then(res => exerciseBulkUpdate(records))
    .catch(err => console.log(err))

  }
}
