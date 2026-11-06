const DEFAULT_STATE={lang:'en',view:'resident',onboarded:false,mohallaId:null,demoControls:true,supported:[3,7],rsvps:[],joined:[],votes:{poll1:null},confirmed:[],notifications:[],issues:ISSUES};
let state;
function clone(v){return JSON.parse(JSON.stringify(v))}function loadState(){try{state=Object.assign(clone(DEFAULT_STATE),JSON.parse(localStorage.getItem('mw_state_v1')||'{}'));if(!Array.isArray(state.issues))state.issues=clone(ISSUES)}catch(e){state=clone(DEFAULT_STATE)}return state}function saveState(){localStorage.setItem('mw_state_v1',JSON.stringify(state))}function resetState(){localStorage.removeItem('mw_state_v1');state=clone(DEFAULT_STATE);location.hash='#/choose';render()}
loadState();
