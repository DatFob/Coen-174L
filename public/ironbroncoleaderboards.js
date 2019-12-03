/* COEN 174l 2019 Fall
   Emma Allegrucci
   Joseph Sindelar
   Mike Zhao
   The Iron Bronco Project*/

var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var teams = [];
var users = [];
var topTeams = [];
var topUsers = [];
var teamName;
var topUsersCnt, topTeamsCnt;

//Below is code to set up and configure firebase
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

//If user has a team, save team name to teamName 
function userTeamName(){
    userDocRef.doc(userName).get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            teamName = doc.data().team;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//Display all users
function displayUsers(){
    console.log("users:");
    console.log(users);
    users.forEach(displayEachUser);
}
//Display all teams
function displayTeams(){
    console.log("teams:");
    console.log(teams);
    teams.forEach(displayEachTeam);
}
//Display each team
function displayEachTeam(item, index) {
    document.getElementById("teamLeaders").innerHTML += teams[index].name + " " + teams[index].total + " miles" + "<br>"; 
}
//Display each user
function displayEachUser(item, index) {
    document.getElementById("individualLeaders").innerHTML += users[index].name + " " + users[index].total + " miles" + "<br>"; 
}
//use functions to grab team and user data
function data(){
    userData();
    teamData();
    userTeamName(); 
    console.log("Team and user data retrieved");
}

//Order users in decreasing order by "total" then push into users
function userData(){
    userDocRef.orderBy('total').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            users.push({name:doc.id, total:doc.data().total});
        });
    });
}
//Order teams in decreasing order by "total" then push into teams
function teamData(){
    teamDocRef.orderBy('total').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            teams.push({name:doc.id, total:doc.data().total});
        });
    });
}
//display current leaderboards
function displayLeaderboards(){
    document.getElementById("individualLeaders").innerHTML = "";
    document.getElementById("teamLeaders").innerHTML = "";
    teams.reverse();
    users.reverse();
    displayUsers();
    displayTeams();
}
//delete user from team, update team and user data
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
//signs user out of the system
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