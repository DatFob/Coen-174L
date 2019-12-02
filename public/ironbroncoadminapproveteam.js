var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var requestedTeams = [];

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

function displayRequestedTeams(){
    document.getElementById("requestedTeams").innerHTML = "";
    requestedTeams.forEach(displayEachRequestedTeam);
}

function displayEachRequestedTeam(item, index) {
    document.getElementById("requestedTeams").innerHTML += requestedTeams[index] + "<br>"; 
}

function requestedTeamData(){
    requestedTeamsDocRef.orderBy('name').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            console.log(doc.id, " => ", doc.data());
            requestedTeams.push(doc.id);
            console.log(requestedTeams);
        });
    });
}

//TODO: below, should be similar to remove team in manageteams
function approveTeam() {

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