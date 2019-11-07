/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];
var infoTeam;
var teamIndex = -1;

//this log info should also automatically update the progress page
//maybe have saveInfo event invoke updating to home page as well

//evoke function saveInfo when click the submit button//
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('infoBtn').addEventListener('click',saveInfo);
});

const saveInfo = (ev)=>{
    ev.preventDefault();    
    var teamName;
    let userName = window.prompt("What is your user name?","Please Enter Here");
    //Grab information from input boxes
    let bikingTemp = document.getElementById('biking').value;
    let runningTemp = document.getElementById('running').value;
    let swimmingTemp = document.getElementById('swim').value;

    //convert Temp (strings) to integer
    var biking = parseInt(bikingTemp);
    var running = parseInt(runningTemp);
    var swimming = parseInt(swimmingTemp);

    for(var x=0;x<users.length;x++){
        if(users[x].userName === userName){
            users[x].run += running;
            users[x].bike += biking;
            users[x].swim += swimming; 
            teamName = users[x].team;
            localStorage.setItem('UserList',JSON.stringify(users));  
            break;
        }
    }

    //Clear forms
    document.querySelector('form').reset();
    for ( var x=0;x<teams.length;x++ ){
        if(teams[x].id===teamName){
            teamIndex = x;
            //update team's information
            teams[x].run = running + teams[x].run;
            teams[x].swim = swimming + teams[x].swim;
            teams[x].bike = biking + teams[x].bike;
            //save result to localStorage
            localStorage.setItem('TeamList', JSON.stringify(teams));
            //let tempObject = JSON.parse(JSON.stringify(teams[x]));
        }
    }
    
}