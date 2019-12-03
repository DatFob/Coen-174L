/* COEN 174l 2019 Fall
   Emma Allegrucci
   Joseph Sindelar
   Mike Zhao
   The Iron Bronco Project*/

var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var teamName, teamCount, teamSwimming, teamRunning, teamBiking, teamTotal;
var memTeamName, memberName, memberRun, memberBike, memberSwim, memberTotal;
var teamMember1, member1Swim, member1Run, member1Bike, member1Total;
var teamMember2, member2Swim, member2Run, member2Bike, member2Total;
var teamMember3, member3Swim, member3Run, member3Bike, member3Total;


//Below is firebase code for set up and configuration
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
var userDocRef = db.collection("users");
var teamDocRef = db.collection("teams");


//If user has a team, grab team name.
function userTeamName(){
    userRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            teamName = doc.data().team;
            if(teamName != '' && teamName != null){
                teamData(teamName);
            }
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


//Grab team data using input teamName then save into variables
function teamData(teamName){
    var teamRef = teamDocRef.doc(teamName);
    teamRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Team data received");
            teamMember1 = doc.data().member1;
            teamMember2 = doc.data().member2;
            teamMember3 = doc.data().member3;
            teamSwimming = doc.data().swim;
            teamRunning = doc.data().run;
            teamBiking = doc.data().bike;
            teamTotal = doc.data().total;
            teamCount = doc.data().memberCnt;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


//Grab user data using input member
function memberData(member){
    var memRef = db.collection("users").doc(member);
    console.log(member);
    memRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Member data received");
            memTeamName = doc.data().team;
            if(teamName == memTeamName){
                memberName = doc.data().name;
                memberRun = doc.data().run;
                memberBike = doc.data().bike;
                memberSwim = doc.data().swim;
                memberTotal = doc.data().total;
            }
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//Display team members in a team
function displayTeam(){
    if(teamName != '' && teamName != null){
        displayMember1();
        if(teamCount >= 2){
            displayMember2();
        }
        else {
            document.getElementById("user2Name").innerHTML = "No Member 2";
        }
        if(teamCount >= 3){
            displayMember3();
        }   
        else {
            document.getElementById("user3Name").innerHTML = "No Member 3";
        }
    }
    else {
        document.getElementById("user2Name").innerHTML = "You are not a member of a team. Click 'Join/Create a Team' to join one.";
    }
}


//Display member 1's data and progress
function displayMember1(){
    var memRef = db.collection("users").doc(teamMember1);
    memRef.get().then(function(doc) {
        if (doc.exists) {
            memTeamName = doc.data().team;
            if(teamName == memTeamName){
                document.getElementById("user1Name").innerHTML = doc.data().name;
                document.getElementById("user1Run").innerHTML = doc.data().run + "/26.2";
                document.getElementById("user1Bike").innerHTML = doc.data().bike + "/112";
                document.getElementById("user1Swim").innerHTML = doc.data().swim + "/2.4";
                member1Swim = doc.data().swim;
                member1Run = doc.data().run;
                member1Bike = doc.data().bike;
                member1Total = doc.data().total;
            }
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


//Display member 2's data and progress
function displayMember2(){
    var memRef = db.collection("users").doc(teamMember2);
    memRef.get().then(function(doc) {
        if (doc.exists) {
            memTeamName = doc.data().team;
            if(teamName == memTeamName){
                document.getElementById("user2Name").innerHTML = doc.data().name;
                document.getElementById("user2Run").innerHTML = doc.data().run + "/26.2";
                document.getElementById("user2Bike").innerHTML = doc.data().bike + "/112";
                document.getElementById("user2Swim").innerHTML = doc.data().swim + "/2.4";
                member2Swim = doc.data().swim;
                member2Run = doc.data().run;
                member2Bike = doc.data().bike;
                member2Total = doc.data().total;
            }
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


//Display member 3's data and progress
function displayMember3(){
    var memRef = db.collection("users").doc(teamMember3);
    memRef.get().then(function(doc) {
        if (doc.exists) {
            memTeamName = doc.data().team;
            if(teamName == memTeamName){
                document.getElementById("user3Name").innerHTML = doc.data().name;
                document.getElementById("user3Run").innerHTML = doc.data().run + "/26.2";
                document.getElementById("user3Bike").innerHTML = doc.data().bike + "/112";
                document.getElementById("user3Swim").innerHTML = doc.data().swim + "/2.4";
                member3Swim = doc.data().swim;
                member3Run = doc.data().run;
                member3Bike = doc.data().bike;
                member3Total = doc.data().total;
            }
        } else {
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


//Delete user from team, update user & team data
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


//remove member 1 from team
function remove1() {
    if (teamMember1) {
        memberData(teamMember1);
        teamDocRef.doc(teamName).update({
            member1: '',  
            swim: teamSwimming - member1Swim,
            run: teamRunning - member1Run,
            bike: teamBiking - member1Bike,
            total: teamTotal - member1Total,
            memberCnt: teamCount - 1
        }).then(function(){
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        userDocRef.doc(teamMember1).update({
            team: ''
        }).then(function(){
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        alert("Removed " + teamMember1 + " from the team.");
    }
    else {
        alert("Unable to remove team member 1.");
    }
    displayTeam();
}


//remove member 2 from team
function remove2() {
    if (teamMember2) {
        memberData(teamMember2);
        teamDocRef.doc(teamName).update({
            member2: '',  
            swim: teamSwimming - member2Swim,
            run: teamRunning - member2Run,
            bike: teamBiking - member2Bike,
            total: teamTotal - member2Total,
            memberCnt: teamCount - 1
        }).then(function(){
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        userDocRef.doc(teamMember2).update({
            team: ''
        }).then(function(){
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        displayTeam();
        alert("Removed " + teamMember2 + " from the team.");
    }
    else {
        alert("Unable to remove team member 2.");
    }
    displayTeam();
}


//remove member 3 from team
function remove3() {
    if (teamMember1) {
        memberData(teamMember3);
        teamDocRef.doc(teamName).update({
            member3: '',
            swim: teamSwimming - member3Swim,
            run: teamRunning - member3Run,
            bike: teamBiking - member3Bike,
            total: teamTotal - member3Total,
            memberCnt: teamCount - 1
        }).then(function(){
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        userDocRef.doc(teamMember3).update({
            team: ''
        }).then(function(){
            console.log('success'); 
        }).catch(function(error){
            console.log('error occured');
        });
        alert("Removed " + teamMember3 + " from the team.");
    }
    else {
        alert("Unable to remove team member 3.");
    }
    displayTeam();
}


//signs user out 
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