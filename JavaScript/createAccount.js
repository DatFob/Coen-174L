/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];

const addUser = (ev)=>{
    ev.preventDefault();
    let user = {
        id:Date.now(),
        userName: document.getElementById('userName').value,
        password: document.getElementById('password').value
    }
    users.push(user);
    document.querySelector('form').reset();


    //saving to local storage
    localStorage.setItem('UserList', JSON.stringify(users));
}
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('btn').addEventListener('click', addUser);
});


/*login page code
const checkLoginInfo = (ev)=>{
    ev.preventDefault();
    document.querySelector('form').reset();

    let userName = document.getElementById('userName').value;
    let password = document.getElementById('password').value;
    
    let realPassword = JSON.parse(window.localstorage.getItem('userName'));

    if(password!==realPassword){
        console.log('wrong password, check again\n');
    }
    else{
        window.open("IronBroncoLogInfo.html");
    }
}

//event listener for clicking the button
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('btn').addEventListener('click', checkLoginInfo);
});
*/