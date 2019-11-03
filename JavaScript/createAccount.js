/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
var first_password;
var second_password;
var name;
var users_index = 0;

var person = function(user, pass){
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

/*Copy values of username and password to local variables name, first & second password*/
function getValues(){
    name = document.getElementById("createForm").elements.namedItem("username");
    first_password = document.getElementById("createForm").elements.namedItem("password");
    second_password = document.getElementById("createForm").elements.namedItem("confirmPassword");
}

document.getElementsByName("createAccountBtn").addEventListener('click', getValues);

/*Check passwords then create an object, putting it into users array*/
function createAccount(){
    if(passwordCheck(first_password,second_password)==false){
        console.log("Passwords dont match");
        return;
    }
    var user = new person(name,first_password);
    users[user_index] = user;
    user_index++;
}

createAccount();

