//log Information Page Code Below//
//LogInfo is invoked when the page loads//
var teams = localStorage.getItem('TeamList');
var biking = 0;
var running = 0;
var swimming = 0;
var teamIndex = 0;
var i = 0;

const saveInfo = (ev)=>{
    ev.preventDefault();

    //Find out user's team
    let teamName = window.prompt("What team are you in", "Please Enter Here");

    //Grab information from input boxes
    bike = parseInt(document.getElementById('biking').value,10);
    run = document.getElementById('running').value;
    swimming = document.getElementById('swim').value;

    /*for(i=0;i<teams.length;i++){
        if(teams[i].id===teamName){
            //update team's information
            teams[i].run += running;
            teams[i].swim += swimming;
            teams[i].bike += biking;
        }
    }*/

    //Clear forms
   // document.querySelector('form').reset();

    //Save result to localStorage
    localStorage.setItem('TeamList', JSON.stringify(teams));
}

//evoke function saveInfo when click the submit button//
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('infoBtn').addEventListener('click',saveInfo);
});

const clearStorage = (ev)=>{
    ev.preventDefault();
    localStorage.clear();
}
//clear local storage
document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('clearBtn').addEventListener('click',clearStorage);
});




