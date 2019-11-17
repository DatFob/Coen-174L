/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
var userIndex;
var userEmail;
var password;

//event listener for login
document.addEventListener('DOMContentLoaded', ()=>{
    //data stored in local host is in string form, use json.parse to turn it back to array
    let tempUsers = localStorage.getItem('UserList');
    users = JSON.parse(tempUsers);
    document.getElementById('signInBtn').addEventListener('click', checkLoginInfo);
    document.getElementById('signInBtn').addEventListener('click', clearInput);
});


//login page code
const checkLoginInfo = (ev)=>{

    ev.preventDefault();

    userEmail = document.getElementById('inputEmail3').value;
    password = document.getElementById('inputPassword3').value;

    //check to make sure username exists
    userIndex = -1;
    for(var x =0;x<users.length;x++){
        if(users[x].email == userEmail)
        {
            userIndex = x;
            break;
        }
    }

    if(userIndex === -1)
    {
        window.alert('This email does not exist.');
        return;
    }
    
    //User userIndex to check if passwords match
    if(users[userIndex].password === password){
        window.alert('Logged in');
        createCookie(userEmail);
    }
    else{
        window.alert('wrong password, please try again');
    }
}

function clearInput(){
    document.getElementById('inputPassword3').value = '';
    document.getElementById('inputEmail3').value = '';
}

function createCookie(a){
    document.cookie = "username=" + a;
    console.log(document.cookie);
}