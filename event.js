function filterKeyword(text){
	//we parse using regular expression
	let regexp = /[a-zA-Z?]+$/;
	let match = text.match(regexp)[0]
	return match.replace(/[?.!]/,"")
}
chrome.runtime.onInstalled.addListener(function(reason){
	chrome.storage.sync.set({data:{Definition:"Exact expression"}},()=>{
		/*chrome.tabs.query({},function(tabs){
			chrome.browserAction.setPopup({tabId:tabs[0].id,popup:"ui/definition.html"})
		})*/		
		console.log("created!")
	})
})

chrome.omnibox.onInputEntered.addListener((text,disposition) => {
	console.log("input entered")
	let match = filterKeyword(text)
	chrome.storage.sync.get(match,function(result){
		if (result !== null || result !== undefined){
			chrome.storage.sync.set({active:match},()=>console.log("inserted the active word"))
			chrome.browserAction.setBadgeText({text:"ok"})
			chrome.browserAction.setBadgeBackgroundColor({color:[41,171,135,0]})
		}
		else{
			chrome.browserAction.setBadgeText({text:''})
		}


	})
})

chrome.runtime.onMessage.addListener(function(message,sender,response){
	chrome.storage.sync.get("data",function(result){
		let [key,value] = message 
		result = Object.assign(result.data,{[key]:value})

		chrome.storage.sync.set({data:result},() => console.log("success"))
	})
	
})
