const fb = require("../../firebase");
const bucket = fb.storage().bucket();
const db = fb.firestore();

exports.getClass = (req, res) => {
    async function getImages(id) {
        try {
            return await bucket.file(id).get();
        } catch (e) {
            console.log(e);
        }
    }
    db.collection('classes').doc(req.params.classId).get()
        .then(doc => {
            let className = doc.data().naam;
            db.collection('students').where('klas', '==', req.params.classId).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }
                    return snapshot.docs;
                })
                .then(studenten => {
                    res.render("classlists/class", {
                        title: "CMS",
                        dest: "classlists",
                        studenten: studenten,
                        klas: className,
                        klasId: req.params.classId
                    });
                });
        });
};

exports.getStudent = (req, res) => {
    db.collection('students').doc(req.params.studentId).get()
        .then(doc => {
            let student = doc;
            db.collection('progression').where('student','==',student.id).get()
                .then(progress => {
                    return progress.docs;
                })
                .then(studentProgress => {
                    let data = studentProgress.map(data => {
                        return {
                            moeilijkeWoorden: data.data().moeilijkeWoorden,
                            lijst: data.data().woordenlijst
                        }
                    });
                    res.render('classlists/student-detail', {
                        title: "CMS",
                        dest: "classlists",
                        firstname: student.data().firstname,
                        lastname: student.data().surname,
                        moeite: data[0].moeilijkeWoorden,
                        lijst: data[0].lijst
                    });
                })
        });
};