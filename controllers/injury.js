const Injury = require('../models').tbl_injury;
var lowerCase = require('lower-case');

exports.list = (req, res) => {

    return Injury.findAll({
        order: [
        ['injury_name', 'ASC']
        ]
    })
    .then(injury => res.status(200).send(injury))
    .catch(error => res.status(400).send(error));
};

exports.add =(req,res) =>{
    Injury.findAll({
        where:{
            injury_name: req.body.injury_name
        }
    })
    .then(checkinjury=>{
        if (!checkinjury.length){
            return Injury.create({
                injury_name: req.body.injury_name
            }).then(injury => res.status(201).send(injury))
            .catch(error => res.status(400).send(error));
        }
        else{
            res.status(400).send({"success":"1","message":"Body Part is already exists"});
        }
        

    })
    
}

exports.delete = (req, res) => {

    const id = req.params.injuryId;
    Injury.destroy({
        where: { id: id }
    }).then(() => {
        res.status(200).json({msg:'deleted successfully a Injury with id = ' + id});
    });
};

exports.update = (req,res) =>{

    Injury.findAll({
        where:{
            injury_name: req.body.injury_name
        }
    })
    .then(checkinjury=>{
        if (!checkinjury.length){
            Injury.update({
                injury_name:req.body.injury_name
            },{
                returning: true,
                where: { id: req.params.injuryId }
            }).then(function (rowsUpdated) {
                Injury.findOne({
                    where: { id: req.params.injuryId }
                })
                .then(injury => res.status(200).send(injury))
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        }
        else{
            res.status(400).send({"success":"1","message":"Body Part is already exists"});
        }
        

    })
}

exports.edit = (req, res) => {

    return Injury.findOne({
        where: { id: req.params.injuryId }
    })
    .then(injury => res.status(200).send(injury))
    .catch(error => res.status(400).send(error));
};