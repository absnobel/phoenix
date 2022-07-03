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
    btnSave.className="btn bg-gradient-success w-100 mt-4 mb-0";
    btnSave.removeAttribute("disabled");
}
async function getmcIMG(){
    const txtMCUsername = document.getElementById("txtUsernamemc");
    const thecontainer = document.querySelector(".mcimg");
    const mcimg = document.getElementById("imgMC"); 
  //  let useravatar = await fetch(`/minecraftimg/${txtMCUsername.value}`);
    //let skin = await useravatar.text();
    if(txtMCUsername.value.length>3 ){
    mcimg.src = `https://mc-heads.net/avatar/${txtMCUsername.value}/100`;
    thecontainer.style.display="block";
    }
    
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
async function getmcusername(){
    let fulldetails = null;
    const fetchstuff = await fetchme().then(user=>{return user.me});
    console.log(fetchstuff)
    return fetchstuff.minecraft;
}
async function LoadEdit() {

    //init elements here add username etc...
    const signout = document.querySelector(".liSignout");
    let fulldetails = null;
    const me = await fetchme().then(user => {fulldetails=user.me; return `${user.username}#${user.discrim}`});
    const signoutBtn = document.querySelector("a.signout");
    signoutBtn.addEventListener("click",fnsignout, false)
    document.querySelector("span.username").innerText = `Welcome ${me}`;
    const isSettings = location.href.match(/settings.html/i);
    if(isSettings)
    {
        //init settings page
       const txtMCUsername = document.getElementById("txtMCUsername");
       const txtUsernamemc = document.getElementById("txtUsernamemc");
       const mcusername = document.getElementById("mcusername");
       mcusername.innerText= me;
       txtMCUsername.innerText=fulldetails.minecraft||"unlinked";
              const chkDisableCapes = document.getElementById("disableCapes");
       const chkDisableCosmetics = document.getElementById("disableCosmetics");
       const btnSave = document.getElementById("btnSave");
        btnSave.style.display=fulldetails&&fulldetails.minecraft ? "none":"block";
       txtMCUsername.addEventListener("change",setSave);
       txtUsernamemc.addEventListener("keyup", getmcIMG);
       chkDisableCapes.addEventListener("change",setSave);
       chkDisableCosmetics.addEventListener("change",setSave);
       btnSave.addEventListener("click", SaveChanges);
        }
}

