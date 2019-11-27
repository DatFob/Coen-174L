var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var teamName, teamCount;
var memTeamName, memberRun, memberBike, memberSwim, memberTotal;
var teamMember1, mem1Biking, mem1Running, mem1Swimming;
var teamMember2, mem2Biking, mem2Running, mem2Swimming;
var teamMember3, mem3Biking, mem3Running, mem3Swimming;

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

function userTeamName(){
    userRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            teamName = doc.data().team;
            teamData(teamName);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function teamData(teamName){
    var teamRef = teamDocRef.doc(teamName);
    teamRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Team data received");
            teamMember1 = doc.data().member1;
            teamMember2 = doc.data().member2;
            teamMember3 = doc.data().member3;
            teamCount = doc.data().memberCnt;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function memberData(member){
    var memRef = db.collection("users").doc(member);
    memRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            memTeamName = doc.data().team;
            if(teamName == memTeamName){
                memberRun = doc.data().run;
                memberBike = doc.data().bike;
                memberSwim = doc.data().swim;
                memberTotal = doc.data().total;
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function displayTeam(){
    //get user's team name
    // userTeamName();
    //get team members from team name
    // teamData(teamName);

    //get team member 1 data
    memberData(teamMember1);
    mem1Biking = memberBike;
    mem1Running = memberRun;
    mem1Swimming = memberSwim;
    document.getElementById("user1Swim").innerHTML = mem1Swimming + "/2.4";
    document.getElementById("user1Run").innerHTML = mem1Running + "/26.2";
    document.getElementById("user1Bike").innerHTML = mem1Biking + "/112";

    //get team member 2 data and display
    if(teamCount >= 2){
        memberData(teamMember2);
        mem2Biking = memberBike;
        mem2Running = memberRun;
        mem2Swimming = memberSwim;
        document.getElementById("user2Swim").innerHTML = mem2Swimming + "/2.4";
        document.getElementById("user2Run").innerHTML = mem2Running + "/26.2";
        document.getElementById("user2Bike").innerHTML = mem2Biking + "/112";
    }
    else{
        document.getElementById("nomember2").innerHTML = "No Member 2";
    }

    //get team member 3 data and display
    if(teamCount >= 3){
        memberData(teamMember3);
        mem3Biking = memberBike;
        mem3Running = memberRun;
        mem3Swimming = memberSwim;
        document.getElementById("user3Swim").innerHTML = mem3Swimming + "/2.4";
        document.getElementById("user3Run").innerHTML = mem3Running + "/26.2";
        document.getElementById("user3Bike").innerHTML = mem3Biking + "/112";
    }   
    else{
        document.getElementById("nomember3").innerHTML = "No Member 3";
    }
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