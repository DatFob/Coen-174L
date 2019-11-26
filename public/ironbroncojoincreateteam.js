var userEmail, userName, newTeamName, joinTeamName, memberCount;

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

var userCollection = firestore.collection("users");
//var userRef = userCollection.doc(userName);


function checkTeam(){
    console.log("Check Team Function Evoked...");
    firestore.collection("users").doc(userName).get().then(function(doc) {
        if (doc.exists) {
            if(doc.data().team == '' || doc.data().team == null){
                console.log("User does not have a team...");
                return false;
            }
            else{
                console.log("User has a team...");
                return true;
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such user...");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function teamToUser(teamName){
    return firestore.collection("users").doc(UserName).update({
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
    if(checkTeam == true){
        console.log("Unable to create team, you're already in a team...");
        return;
    }
    newTeamName = document.getElementById('newTeamName').value;
    console.log('Create team function evoked');
    firestore.collection("teams").doc(newTeamName).set({
        name: newTeamName,
        member1: userName,
        member2: '',
        member3: '',    
        swim: 0,
        run: 0,
        bike: 0,
        total: 0,
        memberCnt: 1
    }).then(function(){
        console.log('success'); 
    }).catch(function(error){
        console.log('error occured');
    });
    teamToUser(newTeamName);
}

function joinTeam(){
    if(checkTeam == true){
        console.log("Unable to create team, you're already in a team...");
        return;
    }
    joinTeamName = getElementById('teamName').value;
    if(isTeamFull(joinTeamName) = true){
        console.log("Error: Team name DNE or Team is full");
        return;
    }
    setJoinMember();
}

function setJoinMember(){
    if(memberCount == 1){
        return firestore.collection("teams").doc(joinTeamName).update({
            member2: userName,
            memberCnt: 2
        })
        .then(function() {
            console.log("New team member successfully added!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error adding second member: ", error);
        });
    }else if(memberCount == 2){
        return firestore.collection("teams").doc(joinTeamName).update({
            member3: userName,
            memberCnt: 3
        })
        .then(function() {
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
    firestore.collection("teams").doc(teamName).get().then(function(doc) {
        if (doc.exists) {
            if(doc.memberCnt == 3){
                console.log("team has 3 members...");
                return true;
            }
            else{
                memberCount = doc.memberCnt;
                return false;
            }
        } else {
            // doc.data() will be undefined in this case
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