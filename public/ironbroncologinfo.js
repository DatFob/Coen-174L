/* Each account will be created as an object with attributes of userName and passWord*/
var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var userBiking, userRunning, userSwimming;
var teamName, teamBiking, teamRunning, teamSwimming;
var biking, running, swimming;
var teamMember1, teamMember2, teamMember3;

const firebaseConfig = {
    apiKey: "AIzaSyCCcz2sIMLOFhT6Ltj9DSjvDdoFaPNehd0",
    authDomain: "test-login-1573079166139.firebaseapp.com",
    databaseURL: "https://test-login-1573079166139.firebaseio.com",
    projectId: "test-login-1573079166139",
    storageBucket: "test-login-1573079166139.appspot.com",
    messagingSenderId: "1042080648547",
    appId: "1:1042080648547:web:42a92c14b913d229909756",
    measurementId: "G-WQ9Z1673RK"
};

var project = firebase.initializeApp(firebaseConfig);
var db = project.firestore();
var userRef = db.collection("users").doc(userName);
var teamDocRef = db.collection("teams");

function userData(){
    userRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            userRunning = doc.data().run;
            userBiking = doc.data().bike;
            userSwimming = doc.data().swim;
            teamName = doc.data().team;
            teamData(teamName);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function teamData(teamName){
    var teamRef = teamDocRef.doc(teamName);
    teamRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Team data received");
            teamRunning = doc.data().run;
            teamBiking = doc.data().bike;
            teamSwimming = doc.data().swim;
            teamMember1 = doc.data().member1;
            teamMember2 = doc.data().member2;
            teamMember3 = doc.data().member3;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function updateUserMileageInfo(userName){
    var tempBike, tempRun, tempSwim, tempTotal;
    tempBike = biking + userBiking;
    tempRun = running + userRunning;
    tempSwim = swimming + userSwimming;
    tempTotal = tempBike + tempRun + tempSwim;
    db.collection("users").doc(userName).set({
        name: userName,
        email: userEmail,
        team: teamName,
        swim: tempSwim,
        run: tempRun,
        bike: tempBike,
        total: tempTotal
    }).then(function(){
        console.log('success'); 
    }).catch(function(error){
        console.log('error occured');
    });
}

function updateTeamMileageInfo(teamName){
    var tempBike, tempRun, tempSwim, tempTotal;
    tempBike = biking + teamBiking;
    tempRun = running + teamRunning;
    tempSwim = swimming + teamSwimming;
    tempTotal = tempBike + tempRun + tempSwim;
    db.collection("teams").doc(teamName).set({
        member1: teamMember1,
        member2: teamMember2,
        member3: teamMember3,
        name: teamName,
        swim: tempSwim,
        run: tempRun,
        bike: tempBike,
        total: tempTotal
    }).then(function(){
        console.log('success'); 
    }).catch(function(error){
        console.log('error occured');
    });
}

function updateMileage(){
    biking = parseInt(document.getElementById('biking').value);
    running = parseInt(document.getElementById('running').value);
    swimming = parseInt(document.getElementById('swim').value);
    updateUserMileageInfo(userName);
    updateTeamMileageInfo(teamName);
    // var notify = $.notify({
    //     title: userName,
    //     message: "Your progress has been updated"
    // },{
    //     type: 'danger'
    // });
    // return notify;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}