/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];
var infoTeam;
var teamIndex = -1;

//event listener for login
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('loginBtn').addEventListener('click', checkLoginInfo);
});

//login page code
const checkLoginInfo = (ev)=>{
    ev.preventDefault();

    let userName = document.getElementById('userName').value;
    let password = document.getElementById('password').value;

	//check to make sure username exists
    var noUser = 0;
    for(var x =0;x<users.length;x++){
        if(users[x].userName === userName)
        {
            noUser++;
            break;
        }
    }

    if(noUser === 0)
    {
    	window.alert('This username does not exist.');
    	return;
    }
    
    //traverse user array to find matching password
    for(var y = 0;y<users.length;y++){
        if(users[y].userName === userName){
            if(users[y].password === password){
                userIndex = y;
                window.alert('Logged in');
                break;
            }
            else{
                window.alert('wrong password, please try again');
                break;
            }
        }
    }
    document.querySelector('form').reset();
}