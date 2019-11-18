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
    userEmail = document.getElementById('inputEmail3').value;

    //NULL check for all input fields
    if((userName == '') || (userPassword == '') || (userConfirmPassword == '') || (userEmail == '')){
        window.alert('Please Do Not Leave Any Input Fields Blank...');
        return;
    }

    let user = {
        email:userEmail,
        username: userName,
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
    document.getElementById('inputEmail3').value = '';
}

function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
      sessionStorage.clear();
}