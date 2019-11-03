/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
var first_password;
var second_password;
var name;
var users_index = 0;

var object = function(user, pass){
    this.userName = user;
    this.passWord = pass;
}

/* Check if password & confirmed password are the same*/
function passwordCheck(a,b){
    if(a!==b){
        return false;
    }
    return true;
}


document.querySelector('button[type="button"]').addEventListener('click', function(){
    name = document.getElementById("createForm").elements.namedItem("username");
    first_password = document.getElementById("createForm").elements.namedItem("password");
    second_password = document.getElementById("createForm").elements.namedItem("confirmPassword");
});


/*Check passwords then create an object, putting it into users array*/
function createAccount(){
    if(passwordCheck(first_password,second_password)==false){
        console.log("Passwords dont match");
        return;
    }
    var user = new object(name,first_password);
    users[user_index] = user;
    user_index++;
}

createAccount();

