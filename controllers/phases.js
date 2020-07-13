const Tempphases = require('../models').tbl_template_phases;
const Phasespoint = require('../models').tbl_phases_point;
const Phasesprogcriteria = require('../models').tbl_phases_progress_criteria;

const TreatmentPhase = require('../models').tbl_treatment_phases;
const TreatmentPhasePoints = require('../models').tbl_treatment_phases_point;
const TreatmentPhaseProgressCriteria = require('../models').tbl_treatment_phases_progress_criteria;
const sequelize = require('sequelize');

exports.add = (req,res) => {

    if (!req.body)
        res.status(500).send({ "status": 500, "message": "Patient Details is required" })

    try {

        if(req.params.flag == "0"){
            Tempphases.findOne({
                attributes: [[sequelize.fn('count', sequelize.col('id')), 'total']],
                where: {
                    template_id: req.body.template_id
                }
            }).then((templateCount) => {
                console.log(templateCount);
                return Tempphases.create({
                    template_id: req.body.template_id,
                    name: req.body.name,
                    start_week: req.body.start_week,
                    end_week: req.body.end_week,
                    sequence: parseInt(templateCount.dataValues.total) + 1
                })
                .then(phase => {
                    var points = req.body.points;
                    var progress_criteria = req.body.progress_criteria;

                    for (let index = 0; index < points.length; index++) {
                        Phasespoint.create({
                            phase_id: phase.dataValues.id,
                            point: points[index],
                        })
                        .then(phasepoint => {
                        });
                    }

                    for (let index1 = 0; index1 < progress_criteria.length; index1++) {
                        Phasesprogcriteria.create({
                            phase_id: phase.dataValues.id,
                            pc_point: progress_criteria[index1],
                        })
                        .then(phasesProgressCriteria => {
                        });
                    }
                    res.status(200).send(phase);
                })
                .catch((error) => {
                    res.status(400).send(error);
                });
            });

        }else{
            TreatmentPhase.findOne({
                attributes: [[sequelize.fn('count', sequelize.col('id')), 'total']],
                where: {
                    treatment_id: req.body.treatment_id,
                }
            }).then((templateCount) => {
                TreatmentPhase.create({
                    treatment_id: req.body.treatment_id,
                    name: req.body.name,
                    start_week: req.body.start_week,
                    end_week: req.body.end_week,
                    sequence: parseInt(templateCount.dataValues.total) + 1
                })
                .then(phase => {
                    var points = req.body.points;
                    var progress_criteria = req.body.progress_criteria;

                    for (let index = 0; index < points.length; index++) {
                        TreatmentPhasePoints.create({
                            set_id: phase.dataValues.id,
                            point: points[index],
                        })
                        .then(phasepoint => {
                        });
                    }

                    for (let index1 = 0; index1 < progress_criteria.length; index1++) {
                        TreatmentPhaseProgressCriteria.create({
                            set_id: phase.dataValues.id,
                            pc_point: progress_criteria[index1],
                        })
                        .then(phasesProgressCriteria => {
                        });
                    }
                    res.status(200).send(phase);
                })
                .catch((error) => {
                    res.status(400).send(error);
                });
            });
        }

    } catch(error){
        res.send(500, { "status": 500, "message": "add phase error" });
    }
}

exports.delete = (req, res) => {
    if(req.params.flag == "0"){
        return Tempphases.destroy({
            where: {
                id: req.params.phasesId
            }
        })
        .then(phases => {
            Phasespoint.destroy({
                where: {
                    phase_id: req.params.phasesId
                }
            })
            .then(phasespoint => {
                Phasesprogcriteria.destroy({
                    where: {
                        phase_id: req.params.phasesId
                    }
                })
                .then(function (rowsUpdated){
                    res.status(200).send({ "success": '1', "message": "QUestion Deleted successfully" });
                })
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }else{
        return TreatmentPhase.destroy({
            where: {
                id: req.params.phasesId
            }
        })
        .then(phases => {
            TreatmentPhasePoints.destroy({
                where: {
                    set_id: req.params.phasesId
                }
            })
            .then(phasespoint => {
                TreatmentPhaseProgressCriteria.destroy({
                    where: {
                        set_id: req.params.phasesId
                    }
                })
                .then(function (rowsUpdated){
                    res.status(200).send({ "success": '1', "message": "QUestion Deleted successfully" });
                })
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }
}

exports.update = (req,res) =>{
    if(req.params.flag == "0"){
        Tempphases.update(
        {
            name: req.body.name,
            start_week: req.body.start_week,
            end_week: req.body.end_week
        },
        {
            returning: true,
            where: { id: req.params.phasesId }
        }).then(phases => {
            Phasespoint.destroy({
                where: {
                    phase_id: req.params.phasesId
                }
            })
            .then(function (rowsUpdated) {
                Phasesprogcriteria.destroy({
                    where: {
                        phase_id: req.params.phasesId
                    }
                })
                .then(function (rowsUpdated) {

                    var points = req.body.points;
                    var progress_criteria = req.body.progress_criteria;
                    
                    for (let index = 0; index < points.length; index++) {
                        Phasespoint.create({
                            phase_id: req.params.phasesId,
                            point: points[index]
                        })
                        .then(phasespoint => {
                            phases.push('point[]', phasespoint.dataValues);
                        });
                    }

                    for (let index1 = 0; index1 < progress_criteria.length; index1++) {
                        Phasesprogcriteria.create({
                            phase_id: req.params.phasesId,
                            pc_point: progress_criteria[index1]
                        })
                        .then(phasesProgressCriteria => {
                            phases.push('progress_criteria[]', phasesProgressCriteria.dataValues);
                        });
                    }
                    res.status(200).send({ 'success': '1', "message": "Phases update successfully" });
                })
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }else{
        TreatmentPhase.update(
        {
            name: req.body.name,
            start_week: req.body.start_week,
            end_week: req.body.end_week
        },
        {
            returning: true,
            where: { id: req.params.phasesId }
        }).then(phases => {
            TreatmentPhasePoints.destroy({
                where: {
                    set_id: req.params.phasesId
                }
            })
            .then(function (rowsUpdated) {
                TreatmentPhaseProgressCriteria.destroy({
                    where: {
                        set_id: req.params.phasesId
                    }
                })
                .then(function (rowsUpdated) {

                    var points = req.body.points;
                    var progress_criteria = req.body.progress_criteria;
                    
                    for (let index = 0; index < points.length; index++) {
                        TreatmentPhasePoints.create({
                            set_id: req.params.phasesId,
                            point: points[index]
                        })
                        .then(phasespoint => {
                            phases.push('point[]', phasespoint.dataValues);
                        });
                    }

                    for (let index1 = 0; index1 < progress_criteria.length; index1++) {
                        TreatmentPhaseProgressCriteria.create({
                            set_id: req.params.phasesId,
                            pc_point: progress_criteria[index1]
                        })
                        .then(phasesProgressCriteria => {
                            phases.push('progress_criteria[]', phasesProgressCriteria.dataValues);
                        });
                    }
                    res.status(200).send({ 'success': '1', "message": "Phases update successfully" });
                })
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }
}

exports.list = (req,res) => {
    if(req.params.flag=='0'){

        Tempphases.hasMany(Phasespoint, { foreignKey: 'phase_id' });
        Phasespoint.belongsTo(Tempphases, { foreignKey: 'phase_id' });

        Tempphases.hasMany(Phasesprogcriteria, { foreignKey: 'phase_id' });
        Phasesprogcriteria.belongsTo(Tempphases, { foreignKey: 'phase_id' });

        return Tempphases.findAll({
            where: {
                template_id: req.params.templateId
            },order:[
            ['sequence' , 'ASC']
            ],include: [Phasespoint, Phasesprogcriteria]
        })
        .then(phases =>{
            res.status(200).send(phases);
        }).catch(error => res.status(400).send(error));
    }else{
        TreatmentPhase.hasMany(TreatmentPhasePoints, { foreignKey: 'set_id' });
        TreatmentPhasePoints.belongsTo(TreatmentPhase, { foreignKey: 'set_id' });

        TreatmentPhase.hasMany(TreatmentPhaseProgressCriteria, { foreignKey: 'set_id' });
        TreatmentPhaseProgressCriteria.belongsTo(TreatmentPhase, { foreignKey: 'set_id' });

        return TreatmentPhase.findAll({
            where: {
                treatment_id: req.params.templateId
            },order:[
            ['sequence' , 'ASC']
            ],include: [TreatmentPhasePoints, TreatmentPhaseProgressCriteria]
        })
        .then(phases =>{
            res.status(200).send(phases);
        }).catch(error => res.status(400).send(error));
    }
}

exports.get = (req,res) =>{

    if (req.params.flag == "0" ) {

        Tempphases.hasMany(Phasespoint, { foreignKey: 'phase_id' });
        Phasespoint.belongsTo(Tempphases, { foreignKey: 'phase_id' });

        Tempphases.hasMany(Phasesprogcriteria, { foreignKey: 'phase_id' });
        Phasesprogcriteria.belongsTo(Tempphases, { foreignKey: 'phase_id' });

        return Tempphases.findOne({
            where: {
                id: req.params.phaseId
            },
            order: [
            ['id', 'DESC']
            ],
            include: [Phasespoint, Phasesprogcriteria]

        })
        .then(phase=>{
            res.status(200).send(phase);
        }) 
        .catch(error => res.status(400).send(error));
    }else{
        TreatmentPhase.hasMany(TreatmentPhasePoints, { foreignKey: 'set_id' });
        TreatmentPhasePoints.belongsTo(TreatmentPhase, { foreignKey: 'set_id' });

        TreatmentPhase.hasMany(TreatmentPhaseProgressCriteria, { foreignKey: 'set_id' });
        TreatmentPhaseProgressCriteria.belongsTo(TreatmentPhase, { foreignKey: 'set_id' });

        return TreatmentPhase.findOne({
            where: {
                id: req.params.phaseId
            },
            order: [
            ['id', 'DESC']
            ],
            include: [TreatmentPhasePoints, TreatmentPhaseProgressCriteria]

        })
        .then(phase=>{
            res.status(200).send(phase);
        }) 
        .catch(error => res.status(400).send(error));
    }
}

exports.setSequence = (req, res) => {
    if(req.body.flag == '0'){

        Tempphases.update({
            sequence: req.body.sequence
        },{
            returning: true,
            where: { id: req.params.phaseId }
        }).then((updated) => {
            res.status(201).send({'message' : 'Sequence setted'});
        }).catch((error) => { 
            res.status(201).send(error);
        });
    }else{
        TreatmentPhase.update({
            sequence: req.body.sequence
        },{
            returning: true,
            where: { id: req.params.phaseId }
        }).then((updated) => {
            res.status(201).send({'message' : 'Sequence setted'});
        }).catch((error) => { 
            res.status(201).send(error);
        });
    }
}