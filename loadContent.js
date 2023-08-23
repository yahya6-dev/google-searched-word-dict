"use strict";

const titleCase = (arg) => arg.charAt(0).toUpperCase()+arg.slice(1)
function returnMe(){
 console.log("in returnback get called")	
 console.log("I am been pressed!")
 let constructedDOM = `
   <div class="flex-column" style="margin:8px">
    <div class="flex-row justify-content-around" style="border-bottom:2px solid white; padding:8px; margin-bottom:16px">
    <img src="../dict48.png">
    <span>Mini Dictionary</span>
    </div>
    <div style="margin-bottom:8px" id="tag">
    <table class="table">
   	<thead>
  	<tr>
   	<td></td><td>S/N</td><td>Words</td>
    </tr>
    </thead>
    <tbody id="content">
    </tbody>
    </table>
    		

    </div>
    <div class="d-grid" style="margin-bottom:8px">
    <button id="reset"  class="btn btn-block text-light" type="button">Reset Dictionary!</button>
    </div>
    </div>
	`
	document.getElementById("root").innerHTML = constructedDOM

 	let resetButton = document.getElementById("reset")
 	resetButton.addEventListener("click",clearAll)
	createItems()
}

function replaceDOM(query){
	console.log("I was been called with ",query)
	let words = [titleCase(query)]
	let definition 

	chrome.storage.sync.get("data",function(results){
		results = results.data
		definition = results[query.trim()]
		console.log(typeof definition )
		console.log("is the definition found?",definition)
		console.log(results,definition)

	console.log(definition,"outside that callback")
	let constructedDOM = `
     <div id="replaced">
      <div class="flex-column">
    	<div id="header" class="flex-row justify-content-around">
    		<button  style="background-color:rgb(35,25,35);outline-width:0;border-width:0; " border="0" id="getback"><img src="../arrow-left.svg"></button>	
    		 <span id="query">What is The Definition of ${words[0]}?</span>	
    	</div>
    	<span id="title"> According to Google.</span>
    	<div id="definition">${definition}.</div>
    </div>
   </div>
   `

 //if (word.length > 0 && definition.length > 0 ){
 document.getElementById("root").innerHTML = constructedDOM
 let button = document.getElementById("getback")
 if(button)
 	button.onclick = returnMe 
 console.log("we tried to change the dom")
 //}

	})
}
function setListener(href){
 //console.log("setting listener",document.querySelectorAll("table tbody tr td"))
 //for (let href of [...document.querySelectorAll("table tbody tr td a")]){
   console.log(href)
   href.addEventListener("click",function(event) {
   	 event.preventDefault()
   	 let word = this.innerText.toLowerCase()
   	 console.log(word,"here I am looking")
   	 replaceDOM(word)

   })
 //}
}

function clearAll(){
  chrome.storage.sync.clear(function(){console.log("cleared the dict")})
  chrome.storage.sync.set({"data":{}},()=>console.log("inserted a new data"))
  window.location.reload()

};

document.addEventListener("DOMContentLoaded",function(){
 chrome.tabs.query({active:true,currentWindow:true},function(tabs){
 	chrome.browserAction.getBadgeText({tabId:tabs[0].id},function(text){
 		if (text != ''){
 			chrome.storage.sync.get("active",function(result){
 				let data = result.active
 				chrome.browserAction.setBadgeText({text:''})
			    replaceDOM(data)
 			})
 		}
 		else{

 		   chrome.browserAction.setBadgeText({text:''})
 		   let resetButton = document.getElementById("reset")
		   resetButton.addEventListener("click",clearAll)
 		   createItems()
 		}
 	})
 })
});


function createItems(){
	    console.log("in create items")
		chrome.storage.sync.get("data",function(results){
			let tbody = document.querySelector("table tbody#content")
			results = Object.entries(results["data"])
			console.log(results,"querying storage")
			//iterate through the results constructing dom in the process
			for (let i=0; i < results.length; ++i){
				let tr = document.createElement("tr")
				let tdSN = document.createElement("td")
				let tdWord = document.createElement("td")
				let tdEmpty = document.createElement("td")
				tr.appendChild(tdEmpty)
				console.log(results[i][0],results[i])
				let word = document.createTextNode(titleCase(results[i][0]))
				let href = document.createElement("a")
				href.style.color = "white"
				href.style.textDecoration = "none"
				href.href = "#"
				setListener(href)
				href.appendChild(word)
				tdWord.appendChild(href)
				tdSN.appendChild(document.createTextNode( (1+i).toString() ))
				tr.appendChild(tdSN)
				tr.appendChild(tdWord)
				tbody.appendChild(tr)
			}
		})

	}
	