/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];
var teamIndex,member1,member2, member3
var member1Index,member2Index,member3Index;
var user1Bike,user1Swim,user1Run;
var user2Bike,user2Swim,user2Run;
var user3Bike,user3Swim,user3Run;

//Need to implement
//Display all team members and have a remove button
//ability for leader of team to remove team members ~> maybe added a leader boolean to user object

function displayData(){
    var teamName = window.prompt('What is your teamname?','Enter here');
    if(teamIndex(teamName) == -1){
        window.alert("Cannot find team");
        return;
    }else{
        teamIndex = teamIndex(teamName);
    }

    member1 = teams[teamIndex].mmber1;
    member2 = teams[teamIndex].mmber2;
    member3 = teams[teamIndex].mmber3;

    member1Index = userIndex(member1);
    member2Index = userIndex(member2);
    member3Index = userIndex(member3);

    user1Swim = users[member1Index].swim;
    user1Run = users[member1Index].run;
    user1Bike = users[member1Index].bike;

    user2Swim = users[member2Index].swim;
    user2Run = users[member2Index].run;
    user2Bike = users[member2Index].bike;

    user3Swim = users[member3Index].swim;
    user3Run = users[member3Index].run;
    user3Bike = users[member3Index].bike;

    var user1SwimData= {"userSwim" : user1Swim}; 
    var user1RunData= {"userRun" : user1Run};
    var user1BikeData= {"userBike" : user1Bike};

    var user2SwimData= {"userSwim" : user2Swim}; 
    var user2RunData= {"userRun" : user2Run};
    var user2BikeData= {"userBike" : user2Bike};

    var user3SwimData= {"userSwim" : user3Swim}; 
    var user3RunData= {"userRun" : user3Run};
    var user3BikeData= {"userBike" : user3Bike};

    w3.displayObject("user1Swim", user1SwimData);
    w3.displayObject("user1Run", user1RunData);
    w3.displayObject("user1Bike", user1BikeData);

    w3.displayObject("user2Swim", user2SwimData);
    w3.displayObject("user2Run", user2RunData);
    w3.displayObject("user2Bike", user2BikeData);

    w3.displayObject("user3Swim", user3SwimData);
    w3.displayObject("user3Run", user3RunData);
    w3.displayObject("user3Bike", user3BikeData);
}

function teamIndex(name){
    for(var x=0;x<teams.length;x++){
        if(teams[x].id == teamName){
            return x;
        }
    }
    return -1;
}

function userIndex(user){
    for(var x=0;x<users.length;x++){
        if(users[x].username == user){
            return x;
        }
    }
    return -1;
}