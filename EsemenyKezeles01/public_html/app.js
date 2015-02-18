/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function onButtonClick(e) {
    console.log("button clicked.");
    
    e.target.innerHTML = "Kattintás után!";
}

window.onload = function(){
    //called after document loads
    //add event handlers here   
    console.log("page loaded.");
    
    //without jquery
    //document.querySelector("BUTTON").addEventListener("click", onButtonClick);
    
    //with jquery
    $("BUTTON").addEventListener("click", onButtonClick());
};