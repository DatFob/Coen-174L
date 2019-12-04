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
var userDocRef = db.collection("users");
var teamDocRef = db.collection("teams");

//Displays users on admin's page
function displayUsers(){
    console.log("users:");
    console.log(users);
    users.forEach(displayEachUser);
}

//Display teams on admin's page
function displayTeams(){
    console.log("teams:");
    console.log(teams);
    teams.forEach(displayEachTeam);
}

//Display team's data
function displayEachTeam(item, index) {
    document.getElementById("teamLeaders").innerHTML += teams[index].name + " " + teams[index].total + " miles" + "<br>"; 
}

//Display user's data
function displayEachUser(item, index) {
    document.getElementById("individualLeaders").innerHTML += users[index].name + " " + users[index].total + " miles" + "<br>"; 
}

//Retrieve team and user data
function data(){
    userData();
    teamData();
    console.log("Team and user data retrieved");
}

//Grab each user's data
function userData(){
    userDocRef.orderBy('total').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            users.push({name:doc.id, total:doc.data().total});
        });
    });
}

//Grab each team's data
function teamData(){
    teamDocRef.orderBy('total').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            teams.push({name:doc.id, total:doc.data().total});
        });
    });
}

//Display leaderboard in a decreasing order
function displayLeaderboards(){
    document.getElementById("individualLeaders").innerHTML = "";
    document.getElementById("teamLeaders").innerHTML = "";
    teams.reverse();
    users.reverse();
    displayUsers();
    displayTeams();
}


//Sign out function, signs user out of the system
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