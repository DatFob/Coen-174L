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