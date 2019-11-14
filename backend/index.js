/* Each account will be created as an object with attributes of userName and passWord*/
var users = [];
var userName, userID, userEmail;

//login page code
const checkLoginInfo = (ev)=>{
    ev.preventDefault();

    //check if username exists
    var userIndex = -1;
    for(var x =0;x<users.length;x++){
        if(users[x].userName === userName)
        {
            userIndex = x;
            break;
        }
    }

    if (userIndex == -1)
    {
        var profile = googleUser.getBasicProfile();
        let userID = profile.getId();
        let userEmail = profile.getEmail();
        let userName = profile.getName();

        console.log(userName);

        let user = {
            email:userEmail,
            username: userName,
            tempID: userID,
            team: '', //set team when join team or create team
            swim: 0,
            run: 0,
            bike: 0,
            total: swim + run + bike
        }

        users.push(user);

        //saving to local storage
        localStorage.setItem('UserList', JSON.stringify(users));
    }
}

function clearInput(){
    document.getElementById('inputPassword3').value = '';
    document.getElementById('inputEmail3').value = '';
}

function onSignIn(googleUser) 
{
    //var id_token = googleUser.getAuthResponse().id_token;
    //verifyIdToken(id_token);
    var profile = googleUser.getBasicProfile();
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function verifyIdToken(id_token)
{
    const {OAuth2Client} = require('google-auth-library');
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() 
    {
        const ticket = await client.verifyIdToken(
            {
                idToken: token,
                audience: 1042080648547-aauefq55pncnlprn62j0avqj8c8i5a1n,  
                // Specify the CLIENT_ID of the app that accesses the backend
            });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    }
    verify().catch(console.error);
}
