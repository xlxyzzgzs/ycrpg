//=============================================================================
// InheritanceArchive.js
/*:
 * @plugindesc Inheritance Archive 
 * @author SaltedFish
 *
 * @help 
 * just trace on.
 * 
 * include this script in <head> elem of index.html 
 * try to give function to check the game is online or not
 * please put it on the top of plugins list
 */
//=============================================================================
(function(){
    var networkState=navigator.online;
    toOnLine=function(event){
        console.log(event);
        networkState=true;
    };
    toOffLine=function(event){
        console.log(event);
        networkState=false;
    };
    window.addEventListener("online",toOnLine);
    window.addEventListener("offline",toOffLine);
    window.getNetworkSatate=function(){
        return networkState;
    }
})();