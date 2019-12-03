var teams = [];
var teamName;
var uTeam, uSwim, uBike, uRun, uTotal;
var teamM1, teamM2, teamM3, teamSwimming, teamRunning, teamBiking, teamTotal, teamCount;

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
var teamDocRef = db.collection("teams");


function displayTeams(){
    document.getElementById("alphabeticalTeams").innerHTML = "";
    teams.forEach(displayEachTeam);
}

function displayEachTeam(item, index) {
    document.getElementById("alphabeticalTeams").innerHTML += teams[index] + "<br>"; 
}

function teamData(){
    teamDocRef.orderBy('name').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            teams.push(doc.id);
        });
    });
}

function userData(user){
    db.collection("users").doc(user).get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            uTeam = doc.data().team;
            uRun = doc.data().run;
            uBike = doc.data().bike;
            uSwim = doc.data().swim;
            uTotal = doc.data().total;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function teamInfo(team) {
    teamDocRef.doc(team).get().then(function(doc) {
        console.log(team);
        console.log(doc);
        if (doc.exists) {
            console.log("Team data received");
            teamM1 = doc.data().member1;
            teamM2 = doc.data().member2;
            teamM3 = doc.data().member3;
            teamSwimming = doc.data().swim;
            teamRunning = doc.data().run;
            teamBiking = doc.data().bike;
            teamTotal = doc.data().total;
            teamCount = doc.data().memberCnt;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

// Need to finish
// deletes team but does not remove team from user
// trouble accessing data from 'team'
function removeTeam() {
    var team = document.getElementById('team').value;
    teamInfo(team);
    if (teamExists(team, teams) == true) {
        console.log(team);
        // teamInfo(team);
        console.log(teamM1);
        if (teamM1 != null && teamM1 != '') {
            userDocRef.doc(teamM1).update({ 
                team: ''
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        console.log(teamM2);
        if (teamM2 != null && teamM2 != '') {
            userDocRef.doc(teamM2).update({ 
                team: ''
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        console.log(teamM3);
        if (teamM3 != null && teamM3 != '') {
            userDocRef.doc(teamM3).update({ 
                team: ''
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        deleteTeam(team);
    }
    else {
        alert("Team does not exist.");
    }
}

function deleteTeam(team) {
    teamDocRef.doc(team).delete().then(function() {
        console.log("Team successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing team: ", error);
    });
    alert(team + " was removed successfully. Please refresh the page to view changes.");
}

//Finish removeUserFromTeam()
//need to remove from team then delete from database
function removeUserFromTeam() {
    var user = document.getElementById('userName').value;
    var team = document.getElementById('teamName').value;
    if (teamExists(team, teams) == true) {
        userData(user);
        teamInfo(team);
        if (user == teamM1) {
            db.collection('teams').doc(team).update({
                member1: teamM2,
                member2: teamM3,
                member3: '',
                swim: teamSwimming - uSwim,
                run: teamRunning - uRun,
                bike: teamBiking - uBike,
                total: teamTotal - uTotal,
                memberCnt: doc.data().memberCnt - 1
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        else if (user == teamM2) {
            teamDocRef.doc(team).update({
                member2: teamM3,
                member3: '',
                swim: teamSwimming - uSwim,
                run: teamRunning - uRun,
                bike: teamBiking - uBike,
                total: teamTotal - uTotal,
                memberCnt: doc.data().memberCnt - 1
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        else if (user == teamM3) {
            teamDocRef.doc(team).update({
                member3: '',
                swim: teamSwimming - uSwim,
                run: teamRunning - uRun,
                bike: teamBiking - uBike,
                total: teamTotal - uTotal,
                memberCnt: doc.data().memberCnt - 1
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        teamInfo(team);
        if (teamCount <= 0) {
            teamDocRef.doc(uTeam).delete().then(function() {
                console.log("Team successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing team: ", error);
            });
        }
        alert(user + " was removed from " + team + ". Please refresh the page to view this change.");
    }
    else {
        alert("Invalid entry. This user does not exist.");
    }
}

function teamExists(team, teams) {
    for(var i = 0; i < teams.length; i++) {
        if(teams[i] == team){
            return true;
        } 
    }
    return false;
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    }).catch(function(error) {
    	console.log('User unable to sign out.');
    });
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}