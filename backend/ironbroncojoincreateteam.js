/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];

//Event listener for button Create Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('newTeamBtn').addEventListener('click', createTeam);
    document.getElementById('newTeamBtn').addEventListener('click',clearNewTeam);
    document.getElementById('joinTeamBtn').addEventListener('click',clearJoinTeam);
});

//Function to clear input fields
function clearNewTeam(){
    document.getElementById('newTeamName').value = '';
}

function clearJoinTeam(){
    document.getElementById('teamName').value = '';
}

//a team object will be created with one member and pushed into teams array
const createTeam = (ev)=>{
    ev.preventDefault();
    //let mmber1 = user name passed from login.js page
    let tempTeamName = document.getElementById('newTeamName').value;
    
	for(var i=0;i<teams.length;i++){
        if(teams[i].id === tempTeamName){
        	window.alert('This team name is taken.');
        	return;
        }
    }

    //check to make sure member exists
	var userIndex = -1;
    for(var x=0;x<users.length;x++){
        if(users[x].userName === mmber1){
            users[x].team = tempTeamName;
            userIndex = x;  
            break;
        }
    }

    if(noMemb1 === -1)
    {
    	window.alert('This user does not exist.');
    	return;
    }

    //set team element in user to the new team name
    users[userIndex].team = tempTeamName;

    //Create a new team object with new teamname and member1
    let team = {
        id:tempTeamName,
        memberCnt: 1,
        member1: mmber1,
        member2: '',
        member3: '',
        swim: 0,
        run: 0,
        bike: 0,
        total: 0
    }
    teams.push(team);

    //saving to local storage
    localStorage.setItem('TeamList', JSON.stringify(teams));
    localStorage.setItem('UserList', JSON.stringify(users));
}

//Event listener for button Join Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinTeamBtn').addEventListener('click', joinTeam);
});

const joinTeam = (ev)=>{
    ev.preventDefault();
    var teamIndex = -1;
    let teamName = document.getElementById('teamName').value;
    let mmber = window.prompt("What is your user name?", "Please Enter Here");
    var userIndex = isAMember(mmber);
    //check to make sure the mmber exists
    if(userIndex === -1)
    {
    	window.alert('This user does not exist.');
    	return;
    }

    for(var x =0;x<teams.length;x++){
        if(teams[x].id === teamName){
            teamIndex = x;
        }
    }
    if(teamIndex === -1){
        window.alert('cannot find team...');
        return;
    }

    //traverse thru teams array, find the right team. If not full, set member name and udpate member count
	if((users[userIndex].team !== '') || (users[userIndex].team !== null)){
    	window.alert('You are already in a team');
        return;
    }
    switch(teams[teamIndex].memberCnt){
        case 1:
            teams[i].member2 = mmber;
            teams[i].memberCnt++;
            users[userIndex].team = teamName;
            break;
        case 2:
            teams[i].member3 = mmber;
            teams[i].memberCnt++;
            users[userIndex].team = teamName;
            break; 
        case 3:
            window.alert('Team is full!');
            break;
            }
    //document.querySelector('joinForm').reset;
    localStorage.setItem('UserList', JSON.stringify(users));
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

//if user found eturns userIndex, else return -1
function isAMember(memberName)
{
    for(var x =0;x<users.length;x++){
        if(users[x].userName == memberName)
        {
            return x;
        }
    }

    return -1;
}