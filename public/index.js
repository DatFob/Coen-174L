/* Each account will be created as an object with attributes of userName and passWord*/

var userEmail, userName;
const firebaseConfig = {
  apiKey: "AIzaSyCCcz2sIMLOFhT6Ltj9DSjvDdoFaPNehd0",
  authDomain: "test-login-1573079166139.firebaseapp.com",
  databaseURL: "https://test-login-1573079166139.firebaseio.com",
  projectId: "test-login-1573079166139",
  storageBucket: "test-login-1573079166139.appspot.com",
  messagingSenderId: "1042080648547",
  appId: "1:1042080648547:web:42a92c14b913d229909756",
  measurementId: "G-WQ9Z1673RK"
};
var project = firebase.initializeApp(firebaseConfig);
var firestore = project.firestore();
var collectionRef = firestore.collection("users");
var userRef;
var docRef = firestore.doc('users/Test');


function saveLoginInfo(userName, userEmail){
  console.log('Save Data function evoked');
  userRef.get().then((docSnapshot) => {
    if (docSnapshot.exists) {
      userRef.onSnapshot((doc) => {
          console.log(".........................................................");
      });
    } else {
      userRef.set({
        name: userName,
        email: userEmail,
        team: '',
        swim: 0,
        run: 0,
        bike: 0,
        total: 0
    }).then(function(){
      console.log('success'); 
    }).catch(function(error){
      console.log('error occured');
    });
    }
});
  
}

function onSignIn(googleUser) 
{
    var id_token = googleUser.getAuthResponse().id_token;
    verifyIdToken(id_token);
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    userEmail = profile.getEmail();
    userName = profile.getName();
    userRef = collectionRef.doc(userName);
    saveLoginInfo(userName,userEmail);
    handleClientLoad();

    alert(profile.getName());
}

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());
  userEmail = profile.getEmail();
  userName = profile.getName();
  userRef = collectionRef.doc(userName);
  localStorage.setItem('userName', JSON.stringify((userName)));
  localStorage.setItem('email',JSON.stringify(userEmail));
  saveLoginInfo(userName,userEmail);
  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);
  return window.location.href='https://test-login-1573079166139.firebaseapp.com/IronBroncoHome.html';
}

function signOut() {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
      
}

function verifyIdToken(id_token)
{
  userEmail = profile.getEmail();
  userName = profile.getName();
  userRef = collectionRef.doc(userName);
  saveLoginInfo(userName,userEmail);

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