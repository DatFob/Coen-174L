var userEmail, userName, teamName;

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
var firestore = project.firestore();

function getInfo(){
    userName = JSON.parse(localStorage.getItem('userName'));
    userEmail = JSON.parse(localStorage.getItem('email'));
    console.log(userName);
    console.log(userEmail);
}

var docRef = firestore.collection("users").doc(userName);

function teamToUser(){
    return firestore.collection("users").doc(userName).update({
        team: teamName 
    })
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

function createTeam(){
    teamName = document.getElementById('newTeamName').value;
    console.log('Save Data function evoked');
    firestore.collection("teams").doc(teamName).set({
        name: teamName,
        member1: userName,
        member2: '',
        member3: '',
        swim: 0,
        run: 0,
        bike: 0,
        total: 0
    }).then(function(){
        console.log('success'); 
    }).catch(function(error){
        console.log('error occured');
    });
    teamToUser();
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