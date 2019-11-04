//team array to store all teams
var teams = [];

//a team object will be created with one member and pushed into teams array
const createTeam = (ev)=>{
    ev.preventDefault();
    let mmber1 = window.prompt("What is your user name?","Please Enter Here");
    let team = {
        id:document.getElementById('newTeamName').value,
        memberCnt: 1,
        member1: mmber1,
        member2: '',
        member3: ''
    }
    teams.push(team);
    document.querySelector('form').reset();


    //saving to local storage
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

//Event listener for button Create Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('newTeamBtn').addEventListener('click', createTeam);
});

const joinTeam = (ev)=>{
    ev.preventDefault();
    let teamName = document.getElementById('teamName').value;
    let mmber = window.prompt("What is your user name?", "Please ENter Here");
    //traverse thru teams array, find the right team. If not full, set member name and udpate member count
    for(var i=0;i<teams.length;i++){
        if(teams[i].id === teamName){
            if(memberCnt = 1){
                teams[i].member2 = mmber;
                teams[i].memberCnt++;
            }
            else if(memberCnt = 2){
                teams[i].member3 = mmber;
                teams[i].memberCnt++;
            }else{
                console.log('Team is full');
            }

        }
    }

    localStorage.setItem('TeamList', JSON.stringify(teams));
}

//Event listener for button Join Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinTeamBtn').addEventListener('click', joinTeam);
});