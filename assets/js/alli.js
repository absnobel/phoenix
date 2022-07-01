let fetchme = async() => {
    let me = await fetch("/me");
    me = await me.json();
    return me;
}
function fnsignout(){
    document.cookie = "name=auth; max-age=0 ";
        location.href = "/";
}       
function setSave(){
    const btnSave = document.getElementById("btnSave");
    btnSave.className="btn bg-gradient-success w-100 mt-4 mb-0"
}
function SaveChanges(){
    const txtMCUsername = document.getElementById("txtMCUsername");
    const chkDisableCapes = document.getElementById("disableCapes");
    const chkDisableCosmetics = document.getElementById("disableCosmetics");
     fetch("/save",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: txtMCUsername.value, disablecapes: chkDisableCapes.checked, disableCosmetics:chkDisableCosmetics.checked})
    });
}
async function LoadEdit() {

    //init elements here add username etc...
    const signout = document.querySelector(".liSignout");
    const me = await fetchme().then(user => `${user.username}#${user.discrim}`);
    const signoutBtn = document.querySelector("a.signout");
    signoutBtn.addEventListener("click",fnsignout, false)
    document.querySelector("span.username").innerText = `Welcome ${me}`;
    const isSettings = location.href.match(/settings.html/i);
    if(isSettings)
    {
        //init settings page
       const txtMCUsername = document.getElementById("txtMCUsername");
       const chkDisableCapes = document.getElementById("disableCapes");
       const chkDisableCosmetics = document.getElementById("disableCosmetics");
       const btnSave = document.getElementById("btnSave");
       txtMCUsername.addEventListener("change",setSave);
       chkDisableCapes.addEventListener("change",setSave);
       chkDisableCosmetics.addEventListener("change",setSave);
       btnSave.addEventListener("click", SaveChanges);
        }
}

