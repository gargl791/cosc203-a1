

let birds_data;
const statusDictionary = {
	"Not Threatened": "not-threatened",
	"Naturally Uncommon": "naturally-uncommon",
	"Relict": "relict",
	"Recovering": "recovering",
	"Declining": "declining",
	"Nationally Increasing": "nationally-increasing",
	"Nationally Vulnerable": "nationally-vulnerable",
	"Nationally Endangered": "nationally-endangered",
	"Nationally Critical": "nationally-critical",
	"Extinct": "extinct",
	"black": "extinct",
	"Data Deficient": "data-deficient",
  };

const dataOrder = ["scientific_name", "family", "order", "status", "size", "size"];
const dataOrderTitles = ["Scientific Name", "Family", "Order", "Status", "Length", "Weight"];


fetchData();

function fetchData() {
	fetch("./data/nzbird.json") // fetch data from API
		.then(response => response.json()) // parse to JSON
		.then(setUpVariables) // use the data
		.catch(error => console.error(error)); // error handling
}


/*
async function fetchData() {
	const response = await fetch('cosc203-ass01/data/nzbird.json');
	if (!response.ok){
		console.error(response.status); // error handling
	}
	const data = response.json()  // parse to JSON
	console.log(data); // use the data
}
*/


function setUpVariables(data) {
    birds_data = data;

    //set up bird cards
    initializeBirdCards(data);
}




function initializeBirdCards(data) {
	console.log("initializeBirdCards() called");

	//initialize bird cards count
	birdCountCards(data);

	const cardGridContainer = document.querySelector('.card-grid-container.flex-container');

    //for(let i = 0; i < 1; i++){
	for(let i in data) {
        //console.log(data[i].primary_name);
		let currBird = data[i];

		let card = document.createElement('div');
		card.setAttribute('class', 'card glow-text');

		//create and append bird images
		let birdImg = document.createElement('img');
		birdImg.setAttribute('src', currBird.photo.source);
		birdImg.setAttribute('alt', currBird.english_name);
		card.appendChild(birdImg);
		

		//create and append bird status circle
		let birdStatus = document.createElement("div");
		birdStatus.setAttribute("class", "status-circle " +  statusDictionary[currBird.status]);
		card.appendChild(birdStatus);

		//create and append bird primary name and photo credit
		let birdPrimaryName = document.createElement("h6");
		let photoCredit = document.createElement("p");
		birdPrimaryName.textContent = currBird.primary_name;
		photoCredit.textContent = "Photo by " + currBird.photo.credit;
		card.appendChild(birdPrimaryName);
		card.appendChild(photoCredit);

		//create and append bird english name
		let birdEnglishName = document.createElement("h3");
		birdEnglishName.setAttribute("class", "title");
		birdEnglishName.textContent = currBird.english_name;
		card.appendChild(birdEnglishName);

		//create and append table of bird data
		let birdDataTable = document.createElement("table");
		birdDataTable.setAttribute("class", "borderless-table");
		let bold = document.createElement("b");
			
		for (let idx = 0; idx < dataOrder.length; idx++) {
			let tableRow = document.createElement("tr");
			let bold = document.createElement("b");
			let tableDataTitle = document.createElement("td");
			bold.textContent = dataOrderTitles[idx];
			tableDataTitle.appendChild(bold);
			let tableData = document.createElement("td");
		  
			if (idx >= 4) {
				//ternary operator for length or weight
				let lengthOrWeight = idx == 4 ? "length" : "weight";

				// size list from json currBird
				let sizeList = dataOrder[idx];
				tableData.textContent = currBird.size[lengthOrWeight].value + " " + currBird.size[lengthOrWeight].units;
			  } 
			  else {
				tableData.textContent = currBird[dataOrder[idx]];
			  }
		  
			tableRow.appendChild(tableDataTitle);
			tableRow.appendChild(tableData);
			birdDataTable.appendChild(tableRow);
		  }
		  card.appendChild(birdDataTable);


		//append finished bird card to card container
		cardGridContainer.appendChild(card);

    }

}


//event handler for filter results button
const buttonRef = document.querySelector("#filterButton");
buttonRef.addEventListener("click", myEventHandler);

function myEventHandler(eventData) {
	let filteredSearchArray = filterBirdSearch();
	 let filteredStatusArray = filterBirdStatus(filteredSearchArray);
	 let filteredSortByArray = filterSortBy(filteredStatusArray);
	 birdCountCards(filteredStatusArray);

	 //updates bird card grid container after filtering and sorting birds
	 initializeBirdCards(filteredSortByArray);
	//console.log(filterArray);

	// Keep this! Otherwise the <form> will reload the page
	eventData.preventDefault();
}




function filterBirdSearch() {
	let copyData = [...birds_data];
	let filteredBirds;
	let cardGridContainer = document.querySelector('.card-grid-container.flex-container');

	const filterSearchRef = document.querySelector("#filterSearch");
	const filterSearchValue = filterSearchRef.value.normalize("NFC").toLowerCase();

	cardGridContainer.innerHTML = "";

	//normalizes the bird names
	filteredBirds = copyData.filter(bird => searchBird(bird, filterSearchValue));
	
	
	
	
	
	return filteredBirds;

	//searchBird nested function to filter out birds
	 function searchBird(bird, filterSearchValue) {
		let englishName = bird.english_name.normalize("NFC").toLowerCase().includes(filterSearchValue.normalize("NFC").toLowerCase());
		let primaryName = bird.primary_name.normalize("NFC").toLowerCase().includes(filterSearchValue.normalize("NFC").toLowerCase());
		let scientificName = bird.scientific_name.normalize("NFC").toLowerCase().includes(filterSearchValue.normalize("NFC").toLowerCase());
		let otherNames = bird.other_names;
		let otherNamesFlag = false;

		//checks inside other_names array for each bird
		for(let i = 0; i < bird.other_names.length; i++) {
			if(otherNames[i].normalize("NFC").toLowerCase().includes(filterSearchValue.normalize("NFC").toLowerCase())) {
				otherNamesFlag = true;
				break;
			}
		}
		return englishName || primaryName || scientificName || otherNamesFlag;
		
	}
}



function filterBirdStatus(fb) {
	let filteredBirds = fb;
	let cardGridContainer = document.querySelector('.card-grid-container.flex-container');

	const filterStatusRef = document.querySelector(".filterStatus");
	const filterStatusValue = filterStatusRef.value;
	
	cardGridContainer.innerHTML = "";	
	
	if(filterStatusValue == "All") {
	} 
	else {
		filteredBirds = filteredBirds.filter(bird => bird.status == filterStatusValue);
	}
	

	return filteredBirds;
	//console.log(filterStatusValue);
	//console.log(birds_data);
}


function filterSortBy(fb) {
	let filteredBirds = fb;
	let cardGridContainer = document.querySelector('.card-grid-container.flex-container');

	const filterSortRef = document.querySelector(".filterSort");
	const filterSortValue = filterSortRef.value;

	cardGridContainer.innerHTML = "";

	if(filterSortValue == "Ascending: Weight"){
		filteredBirds.sort((a, b) => a.size.weight.value - b.size.weight.value);
	}
	else if(filterSortValue == "Descending: Weight"){
		filteredBirds.sort((a, b) => b.size.weight.value - a.size.weight.value);
	}
	else if(filterSortValue == "Ascending: Length"){
		filteredBirds.sort((a, b) => a.size.length.value - b.size.length.value);
	}
	else if(filterSortValue == "Descending: Length"){
		filteredBirds.sort((a, b) => b.size.length.value - a.size.length.value);
	}
	else if(filterSortValue == "Ascending: English Name"){
		filteredBirds.sort((a, b) => a.english_name.localeCompare(b.english_name));
	}
	else if(filterSortValue == "Descending: English Name"){
		filteredBirds.sort((a, b) => b.english_name.localeCompare(a.english_name));
	}
	else if(filterSortValue == "Ascending: Maori Name"){
		filteredBirds.sort((a, b) => a.primary_name.localeCompare(b.primary_name));
	}
	else if(filterSortValue == "Descending: Maori Name"){
		filteredBirds.sort((a, b) => b.primary_name.localeCompare(a.primary_name));
	}
	else if(filterSortValue == "Ascending: Scientific Name"){
		filteredBirds.sort((a, b) => a.scientific_name.localeCompare(b.scientific_name));
	}
	else if(filterSortValue == "Descending: Scientific Name"){
		filteredBirds.sort((a, b) => b.scientific_name.localeCompare(a.scientific_name));
	}

	return filteredBirds;

}



function birdCountCards(filteredBirds) {
	let birdCountText = document.querySelector(".birdCount");
	let birdCount = filteredBirds.length;
	birdCountText.textContent = "(" + birdCount +")";
}








