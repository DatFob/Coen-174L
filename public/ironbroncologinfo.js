/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];

//team array to store all teams
var teams = [];


//this log info should also automatically update the progress page
//maybe have saveInfo event invoke updating to home page as well

//evoke function saveInfo when click the submit button//
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('infoBtn').addEventListener('click',saveInfo);
});

const saveInfo = (ev)=>{
    ev.preventDefault();    
    var teamIndex,teamName;
    var userIndex;
    let userName = window.prompt("What is your user name?","Please Enter Here");

    //user IsAUser check if user exists, if so set userIndex
    if(isAUser(userName) == -1){
        window.alert('User Not Found');
        document.getElementById('biking').value = '';
        document.getElementById('running').value = '';
        document.getElementsByTagName('swim').value = '';
        return;
    }else{
        userIndex = isAUser(userName);
    }

    teamName = users[userIndex].team;
    teamIndex = teamIndex(teamName);
    if(teamIndex == -1){
        window.alert('System Error finding team, contact support');
        return;
    }

    //Grab information from input boxes
    let bikingTemp = document.getElementById('biking').value;
    let runningTemp = document.getElementById('running').value;
    let swimmingTemp = document.getElementById('swim').value;

    //convert Temp (strings) to integer
    var biking = parseInt(bikingTemp);
    var running = parseInt(runningTemp);
    var swimming = parseInt(swimmingTemp);

    //Check if values are valid (>0)
    if(biking < 0 || running < 0 || swimming < 0){
        window.alert('Please Enter valid values');
        return;
    }

    users[userIndex].swim += swimming;
    users[userIndex].run += running;
    users[userIndex].bike += biking;
    users[userIndex].total = users[userIndex].swim + users[userIndex].bike + users[userIndex].run;

    teams[teamIndex].swim += swimming;
    teams[teamIndex].run += running;
    teams[teamIndex].bike += biking;
    teams[teamIndex].total += users[userIndex].total;
    

    localStorage.setItem('UserList', JSON.stringify(users));
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

//if user found eturns userIndex, else return -1
function isAUser(memberName)
{
    for(var x =0;x<users.length;x++){
        if(users[x].userName == memberName)
        {
            return x;
        }
    }

    return -1;
}

//return team index
function teamIndex(team){
    for(var x =0;x<teams.length;x++){
        if(teams[x].id == team){
            return x;
        }
    }
    return -1;
}

function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
      sessionStorage.clear();
}