const fb = require("../../firebase");
const db = fb.firestore();

exports.getClassLists = (req, res) => {
    db.collection("classes").get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                if (doc.data().naam.length === 0) {
                    db.collection("classes").doc(doc.id).delete();
                }
            });
            return snapshot.docs;
        })
        .then(klas => {
            res.render("classlists/classlists", {title: "CMS", dest: "classlists", klas: klas});
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
};

exports.getAddStudentListModal = (req, res) => {
    res.render("classlists/add-class", {title: "CMS", dest: "classlists"});
};

exports.insertUploadedClasslist = (req, res) => {
    let data = {
        groep: req.body.classGroup,
        naam: req.body.className
    };
    db.collection('classes').add(data)
        .then(result => {
            res.redirect(`/cms/class-lists/${result.id}`)
        });
};