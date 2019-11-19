/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];

//display team progress, button should not need a button
//check loginfo page for comments ~ event in loginfo should auotmatically update this page
//maybe when the link to this home page is clicked it will be updated


function display(){
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