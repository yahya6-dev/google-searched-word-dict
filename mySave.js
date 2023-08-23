
console.log("content scripts get injected!")
function filterKeyword(text){
	//we parse using regular expression
	let regexp = /[a-zA-Z?]+$/;
	let match = text.match(regexp)[0]
	return match.replace(/[?.!]/,"")
}

function getItems(){
	let searchField  = document.querySelector("input.gLFyf").value
	let definition   = document.querySelector("#tsuid_29 > span > div > div > div:nth-child(3) > div > div:nth-child(3) > div > div > ol > li > div > div > div.LTKOO.sY7ric > div > div > div > div:nth-child(1)").innerText 
	return [filterKeyword(searchField).toLowerCase(),definition]

};

(
  function sendMessage(){
  	[searchField,definition] = getItems()
  	chrome.runtime.sendMessage([searchField,definition],function(response){
  		console.log("response => ",response)
  	})


  }


)()