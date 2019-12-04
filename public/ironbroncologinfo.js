/* COEN 174l 2019 Fall
   Emma Allegrucci
   Joseph Sindelar
   Mike Zhao
   The Iron Bronco Project*/

var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var userBiking, userRunning, userSwimming;
var teamName, teamBiking, teamRunning, teamSwimming;
var biking, running, swimming;

//Below is firebase configuration and set up code
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

//Grab user data and save into variables
function userData(){
    userRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            userRunning = doc.data().run;
            userBiking = doc.data().bike;
            userSwimming = doc.data().swim;
            teamName = doc.data().team;
            if (teamName != '' && teamName != null) {
                teamData(teamName);
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//Grab team data and save into variables
function teamData(teamName){
    var teamRef = teamDocRef.doc(teamName);
    teamRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Team data received");
            teamRunning = doc.data().run;
            teamBiking = doc.data().bike;
            teamSwimming = doc.data().swim;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//update user mileages data
function updateUserMileageInfo(userName){
    var tempBike, tempRun, tempSwim, tempTotal;
    tempBike = biking + userBiking;
    tempRun = running + userRunning;
    tempSwim = swimming + userSwimming;
    tempTotal = tempBike + tempRun + tempSwim;
    db.collection("users").doc(userName).update({
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

//update team mileages data
function updateTeamMileageInfo(teamName){
    var tempBike, tempRun, tempSwim, tempTotal;
    tempBike = biking + teamBiking;
    tempRun = running + teamRunning;
    tempSwim = swimming + teamSwimming;
    tempTotal = tempBike + tempRun + tempSwim;
    teamDocRef.doc(teamName).update({
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

//update user mileages and team mileages
function updateMileage(){
    biking = parseInt(document.getElementById('biking').value);
    running = parseInt(document.getElementById('running').value);
    swimming = parseInt(document.getElementById('swim').value);
    updateUserMileageInfo(userName);
    if (teamName != '' && teamName != null) {
        updateTeamMileageInfo(teamName);
    }
}

//Delete user from team, update user and team data
function leaveTeam() {
    if (teamName != null && teamName != '')
    {
        userRef.update({
            team: ''
        }).then(function(){
            alert("You have left the team " + teamName + ".");
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        if(teamCount == 1)
        {
            teamDocRef.doc(teamName).delete().then(function() {
                console.log("Team successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing team: ", error);
            });
        }
        if(member1 == userName){
            teamDocRef.doc(teamName).update({
                member1: '',  
                swim: teamSwimming - userSwimming,
                run: teamRunning - userRunning,
                bike: teamBiking - userBiking,
                total: teamTotal - userTotal,
                memberCnt: teamCount - 1
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        else if(member2 == userName){
            teamDocRef.doc(teamName).update({
                member2: '',  
                swim: teamSwimming - userSwimming,
                run: teamRunning - userRunning,
                bike: teamBiking - userBiking,
                total: teamTotal - userTotal,
                memberCnt: teamCount - 1
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
        else if(member3 == userName){
            teamDocRef.doc(teamName).update({
                member3: '',  
                swim: teamSwimming - userSwimming,
                run: teamRunning - userRunning,
                bike: teamBiking - userBiking,
                total: teamTotal - userTotal,
                memberCnt: teamCount - 1
            }).then(function(){
                console.log('success'); 
            }).catch(function(error){
                console.log('error occured');
            });
        }
    }
    else{
        alert("Unable to leave a team since you are not a member of one.");
    }
}

//signs users out of the system
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