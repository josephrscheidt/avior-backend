var lowerCase = require('lower-case');
const Treatment_question = require('../models').tbl_treatment_question;

var treatmentController = {

    deletequestion:function(req,res){
        return Treatment_question.destroy({
            where: {
                id: req.params.questionId
            }
        })
        .then(function (rowsUpdated) {
            res.status(200).send({ "success": "1", "message": "Question Deleted Successfully" });
        })
        .catch(error => res.status(400).send(error));
    }
}

module.exports = treatmentController;