/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];
var infoTeam;
var teamIndex = -1;

//Event listener for button Create Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('newTeamBtn').addEventListener('click', createTeam);
});

//a team object will be created with one member and pushed into teams array
const createTeam = (ev)=>{
    ev.preventDefault();
    let mmber1 = window.prompt("What is your user name?","Please Enter Here");
    let tempTeamName = document.getElementById('newTeamName').value;
    
	for(var i=0;i<teams.length;i++){
        if(teams[i].id === tempTeamName){
        	window.alert('This team name is taken.');
        	return;
        }
    }

    //check to make sure member exists
	var noMemb1 = 0;
    for(var x=0;x<users.length;x++){
        if(users[x].userName === mmber1){
            users[x].team = tempTeamName;
            noMemb1++;  
            break;
        }
    }

    if(noMemb1 === 0)
    {
    	window.alert('This user does not exist.');
    	return;
    }
    let team = {
        id:tempTeamName,
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
    localStorage.setItem('UserList', JSON.stringify(users));
}

//Event listener for button Join Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinTeamBtn').addEventListener('click', joinTeam);
});

const joinTeam = (ev)=>{
    ev.preventDefault();
    var userIndex;
    let teamName = document.getElementById('teamName').value;
    let mmber = window.prompt("What is your user name?", "Please Enter Here");
    //check to make sure the mmber exists
    if(!isAMember(mmber))
    {
    	window.alert('This user does not exist.');
    	return;
    }

    if(teams.length === 0)
    {
        window.alert('This team does not exist.');
    	return;
    }

    //traverse thru teams array, find the right team. If not full, set member name and udpate member count
    for(var i=0;i<teams.length;i++){
        if(teams[i].id === teamName){
        	if(teams[i].member1.userName === mmber)
        	{
        		window.alert('You are already a member of this team');
        		break;
        	}
            switch(teams[i].memberCnt){
                case 1:
                    teams[i].member2 = mmber;
                    teams[i].memberCnt++;
                    for(var x=0;x<users.length;x++){
                        if(users[x].userName === mmber){
                            users[x].team = teamName;
                            break;
                        }
                    }
                    break;
                case 2:
                    teams[i].member3 = mmber;
                    teams[i].memberCnt++;
                    for(var x=0;x<users.length;x++){
                        if(users[x].userName === mmber){
                            users[x].team = teamName;
                            break;
                        }
                    }
                    break; 
                case 3:
                    window.alert('Team is full!');
                    break;
            }
        }
    }
    //document.querySelector('joinForm').reset;
    localStorage.setItem('UserList', JSON.stringify(users));
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

function isAMember(memberName)
{
    for(var x =0;x<users.length;x++){
        if(users[x].userName == memberName)
        {
            return 1;
        }
    }

    return 0;
}