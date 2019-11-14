/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];

//Event listener for button Create Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('newTeamBtn').addEventListener('click', createTeam);
    document.getElementById('newTeamBtn').addEventListener('click',clearNewTeam);
    document.getElementById('joinTeamBtn').addEventListener('click',clearJoinTeam);
    document.getElementById('joinTeamBtn').addEventListener('click',joinTeam);
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
    var promptBox = prompt("Please Enter Your Username:", "Enter Here");
    if(promptBox == null || promptBox == ''){
        window.alert('Please Enter A Your Username');
        return;
    }
    else{
        mmber1=promptBox;
    }

    //check to make sure member exists
	var userIndex = -1;
    if(isAUser(mmber1)== -1){
        window.alert('User does not Exist..');
        return;
    }else{
        userIndex = isAUser(mmber1);
    }

    let tempTeamName = document.getElementById('newTeamName').value;
    
	for(var i=0;i<teams.length;i++){
        if(teams[i].id === tempTeamName){
        	window.alert('This team name is taken.');
        	return;
        }
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
    //update team data
    team.bike = users[userIndex].bike;
    team.run = users[userIndex].run;
    team.swim = users[userIndex].swim;
    team.total = users[userIndex].total; 
    teams.push(team);

    //saving to local storage
    localStorage.setItem('TeamList', JSON.stringify(teams));
    localStorage.setItem('UserList', JSON.stringify(users));
}

const joinTeam = (ev)=>{
    ev.preventDefault();
    var teamIndex = -1;
    var userIndex;
    let teamName = document.getElementById('teamName').value;
    let mmber = window.prompt("What is your user name?", "Please Enter Here");
    if(isAMember(mmber)==-1){
        window.alert("User does not exist");
        return;
    }else{
        userIndex = isAMember(mmber);
    }

    //check if user has a team already
    if(users[userIndex].team !== '' || users[userIndex].team !==null){
        window.alert('User is already in a team');
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

    switch(teams[teamIndex].memberCnt){
        case 1:
            teams[teamIndex].member2 = mmber;
            teams[teamIndex].memberCnt++;
            teams[teamIndex].run += users[userIndex].run;
            teams[teamIndex].bike += users[userIndex].bike;
            teams[teamIndex].swim += users[userindex].swim;
            users[userIndex].team = teamName;
            break;
        case 2:
            teams[teamIndex].member3 = mmber;
            teams[teamIndex].memberCnt++;
            teams[teamIndex].run += users[userIndex].run;
            teams[teamIndex].bike += users[userIndex].bike;
            teams[teamIndex].swim += users[userindex].swim;
            users[userIndex].team = teamName;
            break; 
        case 3:
            window.alert('Team is full!');
            return;
            }
    //document.querySelector('joinForm').reset;
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