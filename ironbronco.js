/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];
var infoTeam;
var teamIndex = -1;

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
    users.push(user);
    document.querySelector('form').reset();


    //saving to local storage
    localStorage.setItem('UserList', JSON.stringify(users));
}

//evoke function saveInfo when click the submit button//
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('infoBtn').addEventListener('click',saveInfo);
});

const saveInfo = (ev)=>{
    ev.preventDefault();    
    var teamName;
    let userName = window.prompt("What is your user name?","Please Enter Here");
    //Grab information from input boxes
    let bikingTemp = document.getElementById('biking').value;
    let runningTemp = document.getElementById('running').value;
    let swimmingTemp = document.getElementById('swim').value;

    //convert Temp (strings) to integer
    var biking = parseInt(bikingTemp);
    var running = parseInt(runningTemp);
    var swimming = parseInt(swimmingTemp);

    for(var x=0;x<users.length;x++){
        if(users[x].userName === userName){
            users[x].run += running;
            users[x].bike += biking;
            users[x].swim += swimming; 
            teamName = users[x].team;
            localStorage.setItem('UserList',JSON.stringify(users));  
            break;
        }
    }

    //Clear forms
    document.querySelector('form').reset();
    for ( var x=0;x<teams.length;x++ ){
        if(teams[x].id===teamName){
            teamIndex = x;
            //update team's information
            teams[x].run = users[x].run + teams[x].run;
            teams[x].swim = users[x].swim + teams[x].swim;
            teams[x].bike = users[x].bike + teams[x].bike;
            //save result to localStorage
            localStorage.setItem('TeamList', JSON.stringify(teams));
            //let tempObject = JSON.parse(JSON.stringify(teams[x]));
        }
    }
    
}


//Event listener for button Create Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('newTeamBtn').addEventListener('click', createTeam);
});

//a team object will be created with one member and pushed into teams array
const createTeam = (ev)=>{
    ev.preventDefault();
    let mmber1 = window.prompt("What is your user name?","Please Enter Here");
    let tempTeamName = document.getElementById('newTeamName').value;
    for(var x=0;x<users.length;x++){
        if(users[x].userName === mmber1){
            users[x].team = tempTeamName;   
            break;
        }
    }
    let team = {
        id:tempTeamName,
        memberCnt: 1,
        member1: mmber1,
        member2: '',
        member3: '',
        swim: 0,
        run: 0,
        bike: 0
    }
    teams.push(team);
    document.querySelector('form').reset();


    //saving to local storage
    localStorage.setItem('TeamList', JSON.stringify(teams));
    localStorage.setItem('UserList', JSON.stringify(users));
}

//Event listener for button Join Team
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('joinTeamBtn').addEventListener('click', joinTeam);
});

const joinTeam = (ev)=>{
    ev.preventDefault();
    var userIndex;
    let teamName = document.getElementById('teamName').value;
    let mmber = window.prompt("What is your user name?", "Please Enter Here");
    //traverse thru teams array, find the right team. If not full, set member name and udpate member count
    for(var i=0;i<teams.length;i++){
        if(teams[i].id === teamName){
            switch(teams[i].memberCnt){
                case 1:
                    teams[i].member2 = mmber;
                    teams[i].memberCnt++;
                    for(var x=0;x<users.length;x++){
                        if(users[x].userName === mmber){
                            users[x].team = teamName;
                            break;
                        }
                    }
                    break;
                case 2:
                    teams[i].member3 = mmber;
                    teams[i].memberCnt++;
                    for(var x=0;x<users.length;x++){
                        if(users[x].userName === mmber){
                            users[x].team = teamName;
                            break;
                        }
                    }
                    break; 
                case 3:
                    window.alert('Team is full!');
                    break;
            }
        }
    }
    //document.querySelector('joinForm').reset;
    localStorage.setItem('UserList', JSON.stringify(users));
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

//clear local storage
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('clearBtn').addEventListener('click',clearStorage);
});

const clearStorage = (ev)=>{
    ev.preventDefault();
    localStorage.clear();
}


//event listener for login
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('loginBtn').addEventListener('click', checkLoginInfo);
});

//login page code
const checkLoginInfo = (ev)=>{
    ev.preventDefault();

    let userName = document.getElementById('userName').value;
    let password = document.getElementById('password').value;
    
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


//Need to display object for user and team progress
//look at code below and check html file
//{{usercompleted}} and {{teamcompeted}} are placeholders and will display the data here

document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('progressBtn').addEventListener('click', display);
});

function display(){
    var userSwim,userRun,userBike,teamSwim,teamBike,teamRun;
    let userName = window.prompt("What is your user name?", "Please Enter Here");
    let teamName = window.prompt("What is your team name?", "Please Enter Here");

    for(var x =0;x<users.length;x++){
        if(users[x].userName===userName){
            userSwim = users[x].swim;
            userRun = users[x].run;
            userBike = users[x].bike;
        }
    }

    for(var y=0;y<teams.length;y++){
        if(teams[y].id = teamName){
            teamSwim = teams[y].swim;
            teamRun = teams[y].run;
            teamBike = teams[y].bike;
        }
    }

    var userSwimData= {"userSwim" : userSwim}; //need to display the data stored instead of 0
    var userRunData= {"userRun" : userRun};
    var userBikeData= {"userBike" : userBike};

    w3.displayObject("userSwim", userSwimData);
    w3.displayObject("userRun", userRunData);
    w3.displayObject("userBike", userBikeData);

    var teamSwimData= {"teamSwim" : teamSwim}; //need to display the data stored instead of 0
    var teamRunData= {"teamRun" : teamRun};
    var teamBikeData= {"teamBike" : teamBike};

    w3.displayObject("teamSwim", teamSwimData);
    w3.displayObject("teamRun", teamRunData);
    w3.displayObject("teamBike", teamBikeData);
}




