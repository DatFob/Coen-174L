/* COEN 174l 2019 Fall
   Emma Allegrucci
   Joseph Sindelar
   Mike Zhao
   The Iron Bronco Project*/

var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var teamName, teamRunning, teamBiking, teamSwimming, teamTotal, member1, member2, member3, teamCount;
var requestedTeams = [];

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
var requestedTeamsDocRef = db.collection("requestedTeams");

//function to display all requested teams' names
function displayRequestedTeams(){
    document.getElementById("requestedTeams").innerHTML = "";
    requestedTeams.forEach(displayEachRequestedTeam);
}

//function to display requested teams' names
function displayEachRequestedTeam(item, index) {
    document.getElementById("requestedTeams").innerHTML += requestedTeams[index] + "<br>"; 
}

//grabs the requestedTeam data collection from database and stores it in local array
function requestedTeamData(){
    requestedTeamsDocRef.orderBy('name').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            requestedTeams.push(doc.id);
            console.log(requestedTeams);
        });
    });
}

//Approves teams, move from collection "requested teams" to collection "teams"
function approveTeam() {
    teamName = document.getElementById('team').value;
    teamData(teamName);
    db.collection('teams').doc(teamName).set({
        name: teamName,
        member1: member1,
        member2: member2,
        member3: member3,    
        swim: teamSwimming,
        run: teamRunning,
        bike: teamBiking,
        total: teamTotal,
        memberCnt: teamCount
    }).then(function(){
        console.log('Successfully approved team'); 
    }).catch(function(error){
        console.log('error occured');
    });
    teamToUser(teamName);
    deleteOldTeam(teamName);
}

//Delete the team doc in requested, used in approveTeam()
function deleteOldTeam(teamName){
    db.collection("requestedTeams").doc(teamName).delete().then(function() {
        console.log('successfully deleted team in requested section');
        }).catch(function(error) {
        console.log('error occured during deleting team');
        });
}

//Update team name in user's "team" section, used in approveTeam()
function teamToUser(team){
    db.collection("users").doc(member1).update({
        team: team 
    })
    .then(function() {
        console.log("Team name successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

//use input teamName to grab team data and save those into variables
function teamData(teamName){
    var teamRef = db.collection('requestedTeams').doc(teamName);
    teamRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Team data received");
            teamRunning = doc.data().run;
            teamBiking = doc.data().bike;
            teamSwimming = doc.data().swim;
            teamTotal = doc.data().total;
            member1 = doc.data().member1;
            member2 = doc.data().member2;
            member3 = doc.data().member3;
            teamCount = doc.data().memberCnt;
        } else {
            // doc.data() will be undefined in this case
            console.log("teamData: team does not exist!");
        }
    }).catch(function(error) {
        console.log("teamData error:", error);
    });
}

//sign out function, signs out users
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