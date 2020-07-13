module.exports = (app) => {
    const exercise = require('../controllers/exercise');
    const template = require('../controllers/template');
    const user = require('../controllers/user');
    const login = require('../controllers/login');
    const injury = require('../controllers/injury');
    const phases = require('../controllers/phases');
    const treatment = require('../controllers/treatment');
    const goal = require('../controllers/goal');
    const patient = require('../controllers/patient');
    const survey = require('../controllers/survey');
    const question = require('../controllers/question');
    const analytics = require('../controllers/analytics');

    //exercise
    app.post('/exercise/', exercise.add);

    app.get('/exercise-all/', exercise.getAll);

    app.get('/exercise-assigned/:treatmentId', exercise.getAssigned);

    app.get('/exercise', exercise.list);

    app.put('/exercise/:exercsieId', exercise.update);

    app.get('/exercise/edit/:exercsieId', exercise.edit);

    app.post('/exercise/group', exercise.group);

    app.delete('/exercise/:exercsieId', exercise.delete);

    app.get('/injury-exercise/:treatmentId',exercise.injuryExercise);

    app.get('/patient-exercise/edit/:exercsieId', exercise.editTreatmentExercise);

    app.post('/patient-exercise-day/:treatmentId',exercise.exerciseDay);

    app.post('/patient-exercise/', exercise.addExercise);

    app.put('/patient-exercise/:exerciseId', exercise.updateExercise);

    app.delete('/patient-exercise/:exerciseId', exercise.deleteExercise);

    //template
    app.post('/template/', template.add);

    app.post('/tempquestion/', template.addquestion);

    app.get('/template', template.list);

    app.get('/template-question/:templateId/:flag', template.listquestion);

    app.get('/gettempquestion/:questionId/:flag', template.getquestion);

    app.put('/template/:templateId', template.update);

    app.get('/template/:templateId', template.edit);

    app.put('/tempquestion/:questionId', template.editquestion);

    app.delete('/template/:templateId', template.delete);

    app.delete('/tempquestion/:questionId', template.deletequestion);

    app.delete('/treatment-question/:questionId',treatment.deletequestion);

        //Phases
    app.post('/phases/:flag',phases.add);

    app.delete('/phases/:phasesId/:flag', phases.delete);

    app.put('/phases/:phasesId/:flag', phases.update);

    app.get('/phases/:templateId/:flag', phases.list);

    app.get('/phase/:phaseId/:flag', phases.get);

    app.put('/set-phase-sequence/:phaseId', phases.setSequence);


    //User
    app.post('/User/', user.registerNewUser);

    //Signup Email User Info
     app.post('/email/', user.signupEmail);

    //Patient
    app.post('/patient/', user.registerPatient);

    app.get('/patient/:therapistId?', user.listPatient);

    app.get('/patient/all/:clinicId?', user.getAllPatients);

    app.get('/patient/edit/:patientId', user.editPatient);

    app.delete('/patient/:patientId', user.deletePatient);

    app.put('/patient/:patientId', user.updatePatient);

    app.put('/patient/pending/:patientId', user.enablePendingPatient);

    app.get('/templateInjury/:injury_id', template.templateOnInjury);

    app.post('/template-assign/',template.templateAssign);

    app.get('/patient-profile/:patientId',user.patientProfile);

        //therapist
    app.post('/therapist/', user.registerPhysioTherapist);

    app.get('/therapist/', user.listPhysioTherapist);

    app.get('/therapist/edit/:therapistId', user.editTherapist);

    app.delete('/therapist/:therapistId', user.deletePhysioTherapist);

    app.put('/therapist/:therapistId', user.updatePhysioTherapist);

    app.post('/therapist/createAlias/:therapistId', user.createExcerciseAlias);

    app.get('/therapist/getAlias/:therapistId', user.getInjuryAliases);

        //Clinic
    app.post('/clinic/', user.addClinic);

    app.get('/clinic/', user.listClinic);

    app.delete('/clinic/:clinicId', user.DeleteClinic);

    app.get('/clinic/edit/:clinicId', user.getClinic);

    app.put('/clinic/:clinicId', user.updateClinic);

    app.get('/clinic-therapist/:clinicId',user.clinicTherapist);

    //Login
    app.post('/login/', login.login);

    app.post('/logout/', login.logout);

    app.post('/forgotpassword/',login.forgotPswdInit);

    app.post('/resetpassword/', login.confirmPswd);

    app.post('/patientLogin/', login.patientLogin);

    app.post('/demoPatientLogin/', login.demoPatientLogin);

    //Analytics
    app.post('/analytics/', analytics.postData);

    app.get('/analytics/:clinicId', analytics.getData);

    //Injury Api
    app.post('/injury/', injury.add);

    app.get('/injury', injury.list);

    app.get('/injury/edit/:injuryId', injury.edit);

    app.put('/injury/:injuryId', injury.update);

    app.delete('/injury/:injuryId', injury.delete);

    app.post('/goal', goal.add);

    app.put('/goal/:goal_id', goal.update);

    app.delete('/goal/:goal_id', goal.delete);

    app.post('/goal/:treatment_id', goal.list);

    //PWA app api
    app.get('/profile/:patientId',patient.profile);

    app.get('/about/:patientId',patient.about);

    app.get('/roadmap/:patientId', patient.roadmap);

    app.get('/exercise/:patientId', patient.exercise);

    app.get('/about-injury/:patientId', patient.aboutInjury);

    app.get('/exercise-detail/:exercise_id/:treatment_id/', patient.exerciseDetail);

    app.post('/patient-pain/:treatmentID',patient.patientPain);

    app.post('/patient-hep/', patient.patientHep);

    app.get('/get-patient-hep/:patient_id/:treatment_id', patient.getPatientHep);

    app.get('/get-pain-level/:patient_id/:treatment_id/:week', patient.getPainLevel);

    app.get('/get-patient-graph/:treatment_id', patient.getPatientGraph);

    /*Survey*/

    app.post('/survey', survey.add);

    app.get('/survey', survey.list);

    app.get('/survey/edit/:surveyId', survey.edit);

    app.put('/survey/:surveyId', survey.update);

    app.delete('/survey/:surveyId', survey.delete);

    app.get('/get-survey/:diagnosisId', survey.getSurvey);

    app.post('/add-survey', survey.addSurvey);

    /*Survey Question*/

    app.post('/question', question.add);

    app.get('/question/types', question.types);

    app.get('/question/:surveyId', question.list);

    app.get('/question/edit/:questionId', question.edit);

    app.put('/question/:questionId', question.update);

    app.delete('/question/:questionId', question.delete);

    app.get('/get-level-and-function/:therapist/:clinic', patient.getLevelFunction);

    app.get('/get-discharges', user.getDischarges);

    app.put('/discharge-patient/:patient', user.dischargePatient);

};
