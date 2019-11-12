/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];

//event listener for login
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('sighInBtn').addEventListener('click', checkLoginInfo);
    document.getElementById('sighInBtn').addEventListener('click', clearInput);
});

//login page code
const checkLoginInfo = (ev)=>{
    ev.preventDefault();

    let userName = document.getElementById('inputEmail3').value;
    let password = document.getElementById('inputPassword3').value;

	//check to make sure username exists
    var userIndex = -1;
    for(var x =0;x<users.length;x++){
        if(users[x].userName === userName)
        {
            userIndex = x;
            break;
        }
    }

    if(noUser === -1)
    {
    	window.alert('This username does not exist.');
    	return;
    }
    
    //User userIndex to check if passwords match
    if(users[userIndex].password === password){
        window.alert('Logged in');
        break;
    }
    else{
        window.alert('wrong password, please try again');
        break;
    }
}

function clearInput(){
    document.getElementById('inputPassword3').value = '';
    document.getElementById('inputEmail3').value = '';
}