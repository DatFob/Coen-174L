//team array to store all teams
var teams = [];
var infoTeam;
var biking = 0;
var running = 0;
var swimming = 0;
var teamIndex = 0;


//evoke function saveInfo when click the submit button//
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('infoBtn').addEventListener('click',saveInfo);
});

//Event listener for button Create Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('newTeamBtn').addEventListener('click', createTeam);
});

//Event listener for button Join Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinTeamBtn').addEventListener('click', joinTeam);
});

//clear local storage
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('clearBtn').addEventListener('click',clearStorage);
});

//a team object will be created with one member and pushed into teams array
const createTeam = (ev)=>{
    ev.preventDefault();
    let mmber1 = window.prompt("What is your user name?","Please Enter Here");
    let team = {
        id:document.getElementById('newTeamName').value,
        memberCnt: 1,
        member1: mmber1,
        member2: '',
        member3: '',
        swim: 0,
        run: 0,
        bike: 0
    }
    teams.push(team);
    document.querySelector('form').reset();


    //saving to local storage
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

const joinTeam = (ev)=>{
    ev.preventDefault();
    let teamName = document.getElementById('teamName').value;
    let mmber = window.prompt("What is your user name?", "Please Enter Here");
    //traverse thru teams array, find the right team. If not full, set member name and udpate member count
    for(var i=0;i<teams.length;i++){
        if(teams[i].id === teamName){
            if(memberCnt = 1){
                teams[i].member2 = mmber;
                teams[i].memberCnt++;
                break;
            }
            if(memberCnt = 2){
                teams[i].member3 = mmber;
                teams[i].memberCnt++;
                break;
            }if(memberCnt = 3){
                console.log('Team is full');
                break;
            }
        }
    }

    localStorage.setItem('TeamList', JSON.stringify(teams));
}

//log Data code

const saveInfo = (ev)=>{
    ev.preventDefault();    
    //Find out user's team
    let teamName = document.getElementById('logTeamName').value;
    //Grab information from input boxes
    biking = document.getElementById('biking').value;
    running = document.getElementById('running').value;
    swimming = document.getElementById('swim').value;
    for(var i=0;i<teams.length;i++){
        if(teams[i].id===teamName){
            //update team's information
            teams[i].run = running + teams[i].run;
            teams[i].swim = swimming + teams[i].run;
            teams[i].bike = biking + teams[i].bike;
        }
    }

    //Clear forms
    document.querySelector('form').reset();

    //Save result to localStorage
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

const clearStorage = (ev)=>{
    ev.preventDefault();
    localStorage.removeItem('TeamList');
}
