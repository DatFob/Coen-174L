/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];
var infoTeam;
var teamIndex = -1;

//implement google log in thing here

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('createBtn').addEventListener('click', addUser);
});

const addUser = (ev)=>{
    ev.preventDefault();
    let user = {
        id:Date.now(),
        userName: document.getElementById('loginUserName').value,
        password: document.getElementById('loginPassword').value,
        team: '', //set team when join team or create team
        swim: 0,
        run: 0,
        bike: 0
    }

    for(var x=0;x<users.length;x++){
    	if(users[x].userName === user.userName)
    	{
    		window.alert('This username is already taken!');
    		return;
    	}
    }
    users.push(user);
    document.querySelector('form').reset();

    //saving to local storage
    localStorage.setItem('UserList', JSON.stringify(users));
}