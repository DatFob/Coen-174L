/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
var userName,userPassword, userConfirmPassword,userEmail;

//implement google log in thing here

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('createAccountBtn').addEventListener('click', addUser);
    document.getElementById('createAccountBtn').addEventListener('click',clearInput);
});

const addUser = (ev)=>{
    ev.preventDefault();
    userName = document.getElementById('inputUserName').value;
    userPassword = document.getElementById('inputPassword3').value;
    userConfirmPassword = document.getElementById('inputConfirm').value;
    userEmail = document.getElementById('inputEmail3').value;

    //NULL check for all input fields
    if((userName == '') || (userPassword == '') || (userConfirmPassword == '') || (userEmail == '')){
        window.alert('Please Do Not Leave Any Input Fields Blank...');
        return;
    }
    //Password comparison check
    if(userPassword !== userConfirmPassword){
        window.alert('Passwords do not match...');
        return;
    }

    //Duplicated username Check
    /*for(var x=0;x<users.length;x++){
    	if(users[x].userName === user.userName)
    	{
    		window.alert('This username is already taken!');
    		return;
    	}
    }*/

    let user = {
        email:userEmail,
        username: userName,
        password: userPassword,
        team: '', //set team when join team or create team
        swim: 0,
        run: 0,
        bike: 0,
        total: 0
    }

    users.push(user);

    //saving to local storage
    localStorage.setItem('UserList', JSON.stringify(users));
}

//Clear all input fields 
function clearInput(){
    document.getElementById('inputUserName').value = '';
    document.getElementById('inputPassword3').value = '';
    document.getElementById('inputConfirm').value = '';
    document.getElementById('inputEmail3').value = '';
}