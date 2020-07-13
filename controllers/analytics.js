const Analytics = require('../models').tbl_analytics;
module.exports = {

	postData: function(req, res) {
    var event = req.body.event;

    return Analytics.create({
      type: event.type,
      userId: event.userId,
      clinicId: event.clinicId,
      roleId: event.roleId,
      data: JSON.stringify(event.data)
    }).then((data) => {
      res.status(201).send(data)
    }).catch((err) => {
      res.status(400).send(err)
    })
    // console.log('Got request from Lambda');
    // res.status(200).send({message: "Got your request, Lambda."})
  },

  getData: function(req, res) {
    return Analytics.findAll({
      where : {
        clinicId: req.params.clinicId,
        type: "ga"
      }
    }).then((data) => {
      res.status(200).send(data);
    }).catch((err) => {
      res.status(400).send(err);
    })

  }

}
