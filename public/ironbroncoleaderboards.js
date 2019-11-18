/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
//team array to store all teams
var teams = [];

//Need to implement
//essentially display the info that is in the database
//display user and a team leaderbard so organize in order of most percentage complete?

function sortTeams() {
    teams.sort(function(a,b){return b.total - a.total});
    displayTeamLeaderboard
}

function sortUsers() {
    users.sort(function(a, b){return b.total - a.total});
    displayUserLeaderboard();
}

function displayUserLeaderboard() {
    //substitute XXXX with paragraph id in HTML
    document.getElementById("XXXX").innerHTML =
    users[0].username + " " + users[0].total + "miles" + "<br>" +
    users[1].username + " " + users[1].total + "miles" + "<br>" +
    users[2].username + " " + users[2].total + "miles";
}

function displayTeamLeaderboard() {
    document.getElementsByTagName("XXXX").innerHTML = 
    teams[0].id + " " + teams[0].total + "miles" + "<br>" +
    teams[1].id + " " + teams[1].total + "miles" + "<br>" +
    teams[2].id + " " + teams[2].total + "miles";
}

function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
      sessionStorage.clear();
}