const fb = require("../../firebase");
const bucket = fb.storage().bucket();
const db = fb.firestore();


/**
 * gets the class from the class collection linked to the document id
 * @param req
 * @param res
 */
exports.getClass = (req, res) => {
    let classID = req.params.classId;

    async function getImages(id) {
        try {
            return await bucket.file(id).get();
        } catch (e) {
            console.log(e);
        }
    }

    db.collection('classes').doc(classID).get()
        .then(doc => {
            let className = doc.data().naam;
            db.collection('students').where('klas', '==', classID).get()
                .then(snapshot => {
                    return snapshot.docs;
                })
                .then(studenten => {
                    res.render("classlists/class", {
                        title: "CMS",
                        dest: "classlists",
                        studenten: studenten,
                        klas: className,
                        klasId: classID
                    });
                });
        });
};


/**
 * Gets a students progression
 * @param req
 * @param res
 */
exports.getStudent = (req, res) => {
    db.collection('students').doc(req.params.studentId).get()
        .then(doc => {
            let student = doc;
            db.collection('progression').where('student', '==', student.id).get()
                .then(progress => {
                    return progress.docs;
                })
                .then(studentProgress => {
                    let data = studentProgress.map(data => {
                        return {
                            moeilijkeWoorden: data.data().moeilijkeWoorden,
                            lijst: data.data().woordenlijst,
                            aantalWoorden: data.data().wordsCompleted,
                        }
                    });
                    res.render('classlists/student-detail', {
                        title: "CMS",
                        dest: "classlists",
                        firstname: student.data().voornaam,
                        lastname: student.data().achternaam,
                        moeite: data[0].moeilijkeWoorden,
                        lijst: data[0].lijst,
                        aantalGeoefend: data[0].aantalWoorden
                    });
                }).catch(e => {
                console.log(e)
            });
        })
};

exports.newStudentScreen = (req, res) => {
    res.render("classlists/add-student", {
        title: "CMS",
        dest: "classlists",
        word: "",
        listId: req.params.listId,
        hasImage: false
    });
};

exports.addStudentManually = (req, res) => {
    res.render('classlists/add-student-manually', {
        title: "CMS",
        dest: "classlists",
    });
};

exports.insertUploadedStudent = (req, res) => {
    let data = {
        leeftijd: req.body.age,
        voornaam: req.body.firstname,
        achternaam: req.body.lastname,
        klas: req.params.classId,
    };
    db.collection('students').add(data)
        .then(result => {
            let progressionInit = {
                moeilijkeWoorden: [],
                student: result.id,
                woordenlijst: '',
                woordenGeoefend: 0
            };
            db.collection('progression').add(progressionInit);
            res.redirect(`/cms/class-lists/${data.klas}/${result.id}`)
        });
};

async function classInfo(req) {
    let classId = req.params.classId;
    let getClassName = await db.collection('classes').doc(classId).get();
    let className = getClassName.data().naam;
    return className;
}

exports.lijstKiezen = (req, res) => {

    async function wordLists() {
        let wordLists = await db.collection('wordlists').get();
        return wordLists;
    }

    wordLists().then(wordLists => {
        let woordenlijsten = wordLists.docs.map(doc => {
            return {
                id: doc.id,
                naam: doc.data().name
            }
        });
        classInfo(req).then(className => {
            res.render('classlists/lijst-kiezen', {
                title: "CMS",
                dest: "classlists",
                klas: className,
                lijsten: woordenlijsten
            });
        });
    });
};

exports.lijstToewijzen = (req,res) => {
    async function getStudents() {
        let classId = req.params.classId;
        let students = await db.collection('students').where('klas','==',classId).get();
        return students;
    }
    getStudents().then(students => {
        let studentenlijst = students.docs.map(doc => {
            return {
                id: doc.id,
                voornaam: doc.data().voornaam,
                achternaam: doc.data().achternaam
            }
        });
        classInfo(req).then(className => {
            res.render('classlists/lijst-toewijzen', {
                title: "CMS",
                dest: "classlists",
                klas: className,
                studenten: studentenlijst
            });
        });
    });
};

exports.lijstUploaden = (req,res) => {
    let student = req.body.student;
    let lijst = req.params.listId;
    let klas = req.params.classId;
    db.collection('students').doc(student)
        .update({woordenlijst: lijst});
    res.redirect(`/cms/class-lists/${klas}`);
};