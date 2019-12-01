var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var users = [];
var topUsers = [];
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

function displayUsers(){
    document.getElementById("alphabeticalUsers").innerHTML = "";
    users.forEach(displayEachUser);
}

function displayEachUser(item, index) {
    document.getElementById("alphabeticalUsers").innerHTML += users[index] + "<br>"; 
}

function userData(){
    userDocRef.orderBy('name').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            users.push(doc.id);
        });
    });
}

function uData(user){
    var userRef = db.collection("users").doc(user);
    userRef.get().then(function(doc) {
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
        if (doc.exists) {
            console.log("User data received");
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

//Finish removeUser()
//need to remove from team then delete from database
function removeUser()
{
    var user = document.getElementById('user').value;
    console.log(user);
    console.log(users);
    if (userExists(user, users) == true) {
        uData(user);
        userDocRef.doc(user).delete().then(function() {
            console.log("User successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing user: ", error);
        });
        if(uTeam != null && uTeam != '') {
            teamInfo(uTeam);
            if (teamCount == 1) {
                teamDocRef.doc(uTeam).delete().then(function() {
                    console.log("Team successfully deleted!");
                }).catch(function(error) {
                    console.error("Error removing team: ", error);
                });
            }
            teamDocRef.doc(uTeam).update({ 
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
            if (user == teamM1) {
                teamDocRef.doc(uTeam).update({ 
                    member1: ''
                }).then(function(){
                    console.log('success'); 
                }).catch(function(error){
                    console.log('error occured');
                });
            }
            else if (user == teamM2) {
                teamDocRef.doc(uTeam).update({ 
                    member2: ''
                }).then(function(){
                    console.log('success'); 
                }).catch(function(error){
                    console.log('error occured');
                });
            }
            else if (user == teamM3) {
                teamDocRef.doc(uTeam).update({ 
                    member3: ''
                }).then(function(){
                    console.log('success'); 
                }).catch(function(error){
                    console.log('error occured');
                });
            }
        }
        alert(user + " was removed. Please refresh the page to view this change.");
    }
    else {
        alert("Invalid entry. This user does not exist.");
    }
}

function userExists(user, users)
{
    for(var i = 0; i < users.length; i++) {
        console.log(users[i]);
        if(users[i] == user){
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