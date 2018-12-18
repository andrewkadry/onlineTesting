var express = require('express');
var router = express.Router();
var secret = require('../helper/encrypt');
var nodemailer = require('nodemailer');

/* GET candidates listing. */
router.get('/', function (req, res, next) {
    var sql = 'SELECT candidate.ID, candidate.Name AS "CandidateName", candidate.Email, candidate.Phone, candidate.CV, candidate.Approved, position.Name AS "PositionName" FROM candidate INNER JOIN position ON candidate.PositionID = position.ID';
    db.query(sql, function (err, result) {
        if (err)
            return res.status(500).send(err);
        res.render('candidates', {title: 'Candidates', candidates: result});
    });
});

/* GET approve page */
router.get('/approve/:id', function (req, res, next) {
    var candidateId = req.params.id;
    var sql1 = "SELECT * FROM `exam`";
    var sql2 = "SELECT exam.ID, exam.Name FROM candidate_exam INNER JOIN exam ON candidate_exam.ExamID = exam.ID WHERE candidate_exam.CandidateID = " + candidateId;
    db.query(sql1, function (err, result1) {
        if (err)
            return res.status(500).send(err);
        db.query(sql2, function (err, result2) {
            if (err)
                return res.status(500).send(err);
            res.render('approve', {title: 'Approve', candidateId: candidateId, exams: result1, userExams: result2});
        });
    });
});

/* Add exam to candidate */
router.post('/addExam/:examId/to/:candidateId', function (req, res, next) {
    var examId = req.params.examId;
    var candidateId = req.params.candidateId;
    var sql = "INSERT INTO `candidate_exam`(`CandidateID`, `ExamID`) VALUES (" + candidateId + "," + examId + ")";
    db.query(sql, function (err, result) {
        if (err)
            return res.status(500).send(err);
        res.status(200).send("Data added sucessfully");
    });
});

/* Remove exam to candidate */
router.post('/removeExam/:examId/to/:candidateId', function (req, res, next) {
    var examId = req.params.examId;
    var candidateId = req.params.candidateId;
    var sql = "DELETE FROM `candidate_exam` WHERE CandidateID = " + candidateId + " && ExamID = " + examId;
    db.query(sql, function (err, result) {
        if (err)
            return res.status(500).send(err);
        res.status(200).send("Data removed sucessfully");
    });
});

/* Send approval mail */
router.post('/sendApprovalMail/:candidateId', function (req, res, next) {
    var candidateId = req.params.candidateId;
    var sql1 = "SELECT * FROM `candidate` WHERE ID = " + candidateId;
    db.query(sql1, function (err, result) {
        if (err)
            return res.status(500).send(err);
        if (result.length == 0) {
            return res.status(404).send("Candidate not founded");
        }
        console.log(result[0].Email);

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'onlinetestingia@gmail.com',
                pass: 'jzlsnogjvozqduhi'
            }
        });

        const mailOptions = {
            from: 'onlinetestingia@gmail.com', // sender address
            to: result[0].Email, // list of receivers
            subject: 'online testing approve', // Subject line
            html: '<p>Your html here</p>'// plain text body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                return res.status(500).send("not sended");
            else
                var sql2 = "UPDATE `candidate` SET `Approved`= 1 WHERE ID = " + candidateId;
                db.query(sql2, function (err, result) {
                    if (err)
                        return res.status(500).send(err);
                    res.status(200).send("candidate approved sucessfully");
                });
        });
    });
});

/* Add candidate registraion */
router.post('/addRegistration', function (req, res, next) {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var name = firstName + ' ' + lastName;
    var email = req.body.Email;
    var phone = req.body.Phone;
    var postion = req.body.Position;
    var file = req.files.CV;
    if (file.mimetype === "application/pdf") {
        var fileExtension = file.mimetype.split('/')[1];
        var fileName = secret.hide(email);
        var fileSave = fileName + '.' + fileExtension;
        file.mv(`routes/uploads/${fileSave}`, function (err) {
            if (err)
                return res.status(500).send(err);
        });
    } else {
        return res.status(400).send("Only pdf format allowed");
    }
    var sql = "INSERT INTO `candidate`(`Name`, `Email`, `Phone`, `CV`, `PositionID`) VALUES ('" + name + "','" + email + "','" + phone + "','" + fileName + "'," + postion + ")";
    db.query(sql, function (err, result) {
        if (err)
            return res.status(500).send(err);
        return res.status(200).send("Data added sucessfully");
    });
});

/* Check candidate email exist */
router.get('/checkEmail/:email', function (req, res, next) {
    var useremail = req.params.email;
    var sql = "SELECT * FROM candidate WHERE Email = '" + useremail + "'";
    db.query(sql, function (err, result) {
        if (err)
            return res.status(500).send(err);
        if (result.length > 0) {
            return res.status(400).send("Email already existing");
        }
        return res.status(200).send("Email not founded");
    });
});

/* GET candidate cv */
router.get('/cv/:id', function (req, res, next) {
    var id = req.params.id;
    var sql = "SELECT * FROM candidate WHERE ID =" + id;
    db.query(sql, function (err, result) {
        if (err)
            return res.status(500).send(err);
        var file = __dirname + '/uploads/' + result[0].CV + '.pdf';
        res.download(file);
    });
});

module.exports = router;
