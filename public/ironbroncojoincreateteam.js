/* COEN 174l 2019 Fall
   Emma Allegrucci
   Joseph Sindelar
   Mike Zhao
   The Iron Bronco Project*/
var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var newTeamName, joinTeamName, memberCount;
var userBiking, userSwimming, userRunning, userTotal;
var teamBiking, teamSwimming, teamRunning, teamTotal;
var teamCount, teamName;
var member1, member2, member3;


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
var userRef = db.collection("users").doc(userName);
var teamDocRef = db.collection("teams");

//HTML only supports one "onload()", start() is used in order evoke two functions
function start(){
    userData();
    teamData(teamName);
}

//grab user data and save it to variables
function userData(){
    userRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            userRunning = doc.data().run;
            userBiking = doc.data().bike;
            userSwimming = doc.data().swim;
            userTotal = doc.data().total;
            teamName = doc.data().team;
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//grab team's data and save it to variables
function teamData(team){
    var teamRef = teamDocRef.doc(team);
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

//Check if user is already in a team or no 
function checkTeam(){
    console.log("Check Team Function Evoked...");
    if(teamName != '' && teamName != null){
        alert("You are already a member of a team.");
        console.log("User has a team...");
        return true;
    }
    else {
        console.log("User does not have a team...");
        return false;
    }
}

//update user's "team" category in database
function teamToUser(team){
    userRef.update({
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

//Send create team request to database and wait for admin to approve team name
function createTeam(){
    if(checkTeam() == true){
        window.alert('User already in a team...');
        return;
    }
    newTeamName = document.getElementById('newTeamName').value;
    console.log('Create team function evoked');
    if (newTeamName == null || newTeamName == '')
    {
        window.alert("Invalid. No team name entered in field.");
        return;
    }
    db.collection('requestedTeams').doc(newTeamName).set({
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
        teamName = newTeamName;
        console.log('successfully sent new team request'); 
    }).catch(function(error){
        console.log('error occured');
    });
    //teamToUser(newTeamName);
    window.alert("Please wait for 2 business days for admin to approve new team.");
}

//Join a team if user does not have a team and the team does not have 3 members
function joinTeam(){
    if(checkTeam() == true){
        window.alert('User already in a team');
        return;
    }
    joinTeamName = document.getElementById('teamName').value;
    if(existance(joinTeamName) == false){
        return;
    }
    if (joinTeamName == null || joinTeamName == '')
    {
        window.alert("Invalid join team name...");
        return;
    }
    teamData(joinTeamName);
    console.log(teamCount);
    if(isTeamFull(joinTeamName) != true){
        setJoinMember();
    }
}

//Check if a team exists in database, used in joinTeam()
function existance(x){
    var ref = db.collection("teams").doc(x);
    ref.get().then(function(doc) {
        if (doc.exists) {
            return true;
        } else {
            window.alert('team does not exist...');
            return false;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//Set member and update mileages, three situations: one member, two member or team is full
function setJoinMember(){
    if(memberCount == 1){
        teamDocRef.doc(joinTeamName).update({
            member2: userName,
            memberCnt: 2,
            swim: teamSwimming + userSwimming,
            run: teamRunning + userRunning,
            bike: teamBiking + userBiking,
            total: teamTotal + userTotal
        })
        .then(function() {
            teamName = joinTeamName;
            alert("You have joined the team " + joinTeamName +".");
            console.log("New team member successfully added!");
        })
        .catch(function(error) {
            console.error("Error adding second member: ", error);
        });
        teamToUser(joinTeamName);
    }
    else if(memberCount == 2){
        teamDocRef.doc(joinTeamName).update({
            member3: userName,
            memberCnt: 3,
            swim: teamSwimming + userSwimming,
            run: teamRunning + userRunning,
            bike: teamBiking + userBiking,
            total: teamTotal + userTotal
        })
        .then(function() {
            teamName = joinTeamName;
            alert("You have joined the team " + joinTeamName +".");
            console.log("New team member successfully added!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error adding last member: ", error);
        });
        teamToUser(joinTeamName);
    }
    else {
        console.log("Team is full. Unable to join " + joinTeamName +".");
    }
}

//return true if team is full else return false
function isTeamFull(team){
    teamDocRef.doc(team).get().then(function(doc) {
        if (doc.exists) {
            if(doc.memberCnt == 3){
                alert(team + " already has 3 members and is full.");
                console.log("team has 3 members...");
                return true;
            }
            else {
                memberCount = doc.data().memberCnt;
                return false;
            }
        }
        else {
            console.log("isTeamFull: Team does not exist...");
            return true;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//Delete user from team, and update team & user data
function leaveTeam() {
    if (teamName != null && teamName != '')
    {
        if(teamCount <= 1)
        {
            console.log("teamcount 1");
            teamDocRef.doc(teamName).delete().then(function() {
                console.log("Team successfully deleted!");
                teamName = '';
            }).catch(function(error) {
                console.error("Error removing team: ", error);
            });
        }
        else {
            if(member1 == userName){
                teamDocRef.doc(teamName).update({
                    member1: '',  
                    swim: teamSwimming - userSwimming,
                    run: teamRunning - userRunning,
                    bike: teamBiking - userBiking,
                    total: teamTotal - userTotal,
                    memberCnt: teamCount - 1
                }).then(function(){
                    teamName = '';
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
                    teamName = '';
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
                    teamName = '';
                    console.log('success'); 
                }).catch(function(error){
                    console.log('error occured');
                });
            }
        }
        userRef.update({
            team: ''
        }).then(function(){
            alert("You have left the team " + teamName + ".");
            teamName = '';
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
    }
    else {
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