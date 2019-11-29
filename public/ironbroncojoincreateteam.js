var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var newTeamName, joinTeamName, memberCount;
var userBiking, userSwimming, userRunning, userTotal;
var teamBiking, teamSwimming, teamRunning, teamTotal;

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
var userDocRef = db.collection("users");
var userRef = db.collection("users").doc(userName);
var teamDocRef = db.collection("teams");

function userData(){
    userRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            userRunning = doc.data().run;
            userBiking = doc.data().bike;
            userSwimming = doc.data().swim;
            userTotal = doc.data().total;
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
            teamTotal = doc.data().total;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function checkTeam(){
    console.log("Check Team Function Evoked...");
    userRef.get().then(function(doc) {
        if (doc.exists) {
            if(doc.data().team == '' || doc.data().team == null){
                console.log("User does not have a team...");
                return false;
            }
            else{
                alert("You are already a member of a team.");
                console.log("User has a team...");
                return true;
            }
        } else {
            console.log("No such user...");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function teamToUser(teamName){
    return userRef.update({
        team: teamName 
    })
    .then(function() {
        console.log("Team name successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

function createTeam(){
    if(checkTeam() != true){
        newTeamName = document.getElementById('newTeamName').value;
        console.log('Create team function evoked');
        teamDocRef.doc(newTeamName).set({
            name: newTeamName,
            member1: userName,
            member2: '',
            member3: '',    
            swim: userSwimming,
            run: userRunning,
            bike: userBiking,
            total: userTotal,
            memberCnt: 1
        }).then(function(){
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        teamToUser(newTeamName);
    }
}

function joinTeam(){
    if(checkTeam() != true){
        joinTeamName = document.getElementById('teamName').value;
        if(isTeamFull(joinTeamName) != true){
            setJoinMember();
            userRef.update({
                team: joinTeamName
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
    }
}

function setJoinMember(){
    teamData(joinTeamName);
    if(memberCount == 1){
        return teamDocRef.doc(joinTeamName).update({
            member2: userName,
            memberCnt: 2,
            swim: teamSwimming + userSwimming,
            run: teamRunning + userRunning,
            bike: teamBiking + userBiking,
            total: teamTotal + userTotal
        })
        .then(function() {
            alert("You have joined the team " + joinTeamName +".");
            console.log("New team member successfully added!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error adding second member: ", error);
        });
    }else if(memberCount == 2){
        return teamDocRef.doc(joinTeamName).update({
            member3: userName,
            memberCnt: 3,
            swim: teamSwimming + userSwimming,
            run: teamRunning + userRunning,
            bike: teamBiking + userBiking,
            total: teamTotal + userTotal
        })
        .then(function() {
            alert("You have joined the team " + joinTeamName +".");
            console.log("New team member successfully added!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error adding last member: ", error);
        });
    }
    teamToUser(joinTeamName);
}

//return true if team is full else return false
function isTeamFull(teamName){
    teamDocRef.doc(teamName).get().then(function(doc) {
        if (doc.exists) {
            if(doc.memberCnt == 3){
                alert(teamName + " already has 3 memebers and is full.");
                console.log("team has 3 members...");
                return true;
            }
            else{
                memberCount = doc.memberCnt;
                return false;
            }
        } else {
            // doc.data() will be undefined in this case
            alert(teamName +" does not exist.");
            console.log("Team does not exist...");
            return true;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
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