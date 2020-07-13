var lowerCase = require('lower-case');
const Goal = require('../models').tbl_patient_goals;


var goalController = {
    add:function(req,res){
        return Goal.create({
            treatment_id:req.body.treatment_id,
            patient_id: req.body.patient_id,
            goals: req.body.goal,
            status: '0'
        })
        .then(goal=>{
            res.status(200).send(goal);
        })
        .catch(error=>{
            res.status(500).send(error);
        });
    },

    update: function (req, res) {
        return Goal.update({
            treatment_id: req.body.treatment_id,
            patient_id: req.body.patient_id,
            goals: req.body.treatment_id,
            status: req.body.status
        },{
            where:{
                id:req.params.goal_id
            }
        })
        .then(goal => {
            res.status(200).send(goal);
        })
        .catch(error => {
            res.status(500).send(error);
        });
    },

    delete:function(req,res){
        Goal.destory({
            where:{
                id:req.params.goal_id
            }
        })
        .then(function(rowsUpdate){
            res.status(200).send({"message":"Goal Deleted Successfully"});
        })
        .catch(error=>{
            res.status(500).send(error);
        });
    },

    list:function(req,res){
        return Goal.findAll({
            where:{
                treatment_id:req.params.treatment_id
            }
        })
        .then(goals=>{
            res.status(200).send(goals);
        })
        .catch(error=>{
            res.status(500).send(error);
        })
    }


}

module.exports = goalController;