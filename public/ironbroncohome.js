//display team progress, button should not need a button
//check loginfo page for comments ~ event in loginfo should auotmatically update this page
//maybe when the link to this home page is clicked it will be updated

var userEmail = JSON.parse(localStorage.getItem('email'));
var userName = JSON.parse(localStorage.getItem('userName'));
var userBiking, userRunning, userSwimming, userTotal;
var teamName, teamBiking, teamRunning, teamSwimming, teamTotal;

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


function userData(){
    userRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("User data received");
            userRunning = doc.data().run;
            userBiking = doc.data().bike;
            userSwimming = doc.data().swim;
            userTotal = doc.data().total;
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
            teamRunning = doc.data().run;
            teamBiking = doc.data().bike;
            teamSwimming = doc.data().swim;
            teamTotal = doc.data().total;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


/*function display(){
    var userSwim,userRun,userBike,teamSwim,teamBike,teamRun;
    let userName = window.prompt("What is your user name?", "Please Enter Here");
    let teamName = window.prompt("What is your team name?", "Please Enter Here");

    var userIndex = -1;
    var teamIndex = -1;
    
    for(var x =0;x<users.length;x++){
        if(users[x].userName===userName)
        {
            userIndex = x;
            break;
        }else{
            window.alert('User not found!');
            return;
        }
    }

    userSwim = users[userIndex].swim;
    userRun = users[userIndex].run;
    userBike = users[userIndex].bike;
    

    for(var y=0;y<teams.length;y++){
        if(teams[y].id === teamName){
            teamIndex = y;
            break;
        }else{
            window.alert('Team Not Found!');
            return;
        }
    }


    var userSwimData= {"userSwim" : userSwim}; //need to display the data stored instead of 0
    var userRunData= {"userRun" : userRun};
    var userBikeData= {"userBike" : userBike};

    w3.displayObject("userSwim", userSwimData);
    w3.displayObject("userRun", userRunData);
    w3.displayObject("userBike", userBikeData);

    var teamSwimData= {"teamSwim" : teamSwim}; //need to display the data stored instead of 0
    var teamRunData= {"teamRun" : teamRun};
    var teamBikeData= {"teamBike" : teamBike};

    w3.displayObject("teamSwim", teamSwimData);
    w3.displayObject("teamRun", teamRunData);
    w3.displayObject("teamBike", teamBikeData);
}*/

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    localStorage.clear();
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}