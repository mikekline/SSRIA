/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import {getFirestore, doc, getDoc, getDocs, collection} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"

/****************************************** web app's Firebase configuration***********************************************************/ 


  const firebaseConfig = {

Redacted

  };
  

/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const db = getFirestore();


/********************************************************Referances**************************************************/ 


//search form
const getDataForm = document.getElementById('getDataForm');
//results page
const results = document.getElementById('results');
const displayData = document.getElementById("displayData");
const websiteContainer = document.getElementById('websiteContainer');
const websiteRef = document.getElementById("websites");
const backBtn = document.getElementById('backBtn');
const loadingElement = document.getElementById('loading');
//dropdown selectors
const documentType = document.getElementsByName("documentType")
const documentTypeAll = document.getElementById("documentTypeAll");
const documentTypeSelectBox = document.getElementById("documentTypeSelectBox");
const documentTypeCheckboxes = document.getElementById("documentTypeCheckboxes");
const buildingTypes = document.getElementsByName("buildingTypes")
const buildingTypesAll = document.getElementById("buildingTypesAll");
const buildingTypesSelectBox = document.getElementById("buildingTypesSelectBox");
const buildingTypesCheckboxes = document.getElementById("buildingTypesCheckboxes");
const BuildingSystems = document.getElementsByName("BuildingSystems")
const BuildingSystemsAll = document.getElementById("BuildingSystemsAll");
const BuildingSystemsSelectBox = document.getElementById("BuildingSystemsSelectBox");
const BuildingSystemsCheckboxes = document.getElementById("BuildingSystemsCheckboxes");
const PopularSubjects = document.getElementsByName("PopularSubjects")
const PopularSubjectsAll = document.getElementById("PopularSubjectsAll");
const PopularSubjectsSelectBox = document.getElementById("PopularSubjectsSelectBox");
const PopularSubjectsCheckboxes = document.getElementById("PopularSubjectsCheckboxes");




/****************************************************************Global Variables and inital states********************************************************/ 


const allDropdownsCheckboxes = [
  documentTypeCheckboxes,
  buildingTypesCheckboxes,
  BuildingSystemsCheckboxes,
  PopularSubjectsCheckboxes
]

const allCheckbox = [
  documentTypeAll,
  buildingTypesAll,
  BuildingSystemsAll,
  PopularSubjectsAll
];

const checkBoxName = [
  documentType,
  buildingTypes,
  BuildingSystems,
  PopularSubjects
];

const selectBoxes = [
  documentTypeSelectBox,
  buildingTypesSelectBox,
  BuildingSystemsSelectBox,
  PopularSubjectsSelectBox
];



/***********************************************************EventListeners**************************************************************************/


/***** when all checkbox is clicked selectes all in drop down menu*/
for (let i= 0; i<allCheckbox.length; i++){
  allCheckbox[i].addEventListener("change", () =>{
    checkBoxName[i].forEach((element)=>{
      element.checked = allCheckbox[i].checked;
    });
  });
};


/*********************************************Functions for Dropdown menu checkboxes********************************************************/


for (let i = 0; i<selectBoxes.length; i++){
  let expanded = false;

  selectBoxes[i].onclick = () => {
    if (!expanded) {
      allDropdownsCheckboxes[i].style.display = "block";
      expanded = true;
    } else {
      allDropdownsCheckboxes[i].style.display = "none";
      expanded = false;
    }
  };
};



/*********************************************************Selections and Helpers***************************************************************/


//gets list of projects
async function getProjects(){
  const projects = await getDocs(collection(db, "Projects")); 
  return projects
}

//gets project names
async function getProjectNames(){
  const projectNames = []
  const projects = await getProjects()

  projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;    
    projectNames.push(projectNameRef);
  })
  
  return projectNames;
}



/*********************************************Functions for Search form********************************************************/


async function getData(e){
  e.preventDefault();
  loadingElement.style.visibility = 'visible';
  const eachProject = await getProjectNames()
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  let includeFile = []
  let includeWebsite = [];
  let includeDocumentType = [];
  const checkboxValues = [];

  //removes search form and clears any previous results
  getDataForm.style.display = 'none';
  results.style.display = 'flex';
  displayData.innerHTML = '';
  websiteRef.innerHTML = '';
  let websiteURL = '';
 
  
  //gets all selected checkmarks
  checkboxes.forEach((checkbox) => {
    checkboxValues.push(checkbox.value);
    checkbox.checked = false
  });




    eachProject.forEach((collectionRef)=>{
      async function getfileRef(){
        
        //gets project websites and each project files
        const snapshotRef = doc(db, "Projects", collectionRef);
        const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));
        const project = await getDoc(snapshotRef);
        websiteURL = project.data().ProjectURL;
        

        docSnapshot.forEach((Snapshot)=>{
          const file = Snapshot.data();       
          //returns blank if no checkmarks selected
          if(checkboxValues.length===0){
            return;
          }
          
          checkboxValues.forEach( (checkmarks)=>{
            if(file.tags.includes(checkmarks)){
              
              //adds file to results if equals to selected checkmarks
              if(includeFile.indexOf(file.fileTitle) == -1) {
                includeFile.push(file.fileTitle);

                //gets and displays results document type if applicable
                //from search results and removes duplicates
                if(includeDocumentType.indexOf(file.documentType) == -1){
                  includeDocumentType.push(file.documentType);

                  displayData.innerHTML += `
                    <h2 id='documentTypeHeader'>${file.documentType}</h2>
                    <div id='display${file.documentType}'></div>
                  `;
                };
                  
                   
                //displays each results file under appropriate document type listed
                includeDocumentType.forEach((type)=>{
                  const displayDocument = document.getElementById('display'+type)
                  if (type==file.documentType){
                    displayDocument.innerHTML += `<a id='data' href='${file.fileURL}' target='_blank' rel='noopener noreferrer'>${file.fileTitle}</a>`;
                  }
                });


                //displays website of project if there is an associated file displayed
                //removes duplicates
                if(includeWebsite.indexOf(websiteURL) == -1){
                  includeWebsite.push(websiteURL)
                  websiteRef.innerHTML += `<a id='webURL' href='${websiteURL}' target='_blank' rel='noopener noreferrer'>${websiteURL}</a>`;
                };
              };
            };
          }); 
        });
      };
      // if there is no search results hides the website Associated 
      //Project Websites title and makes visible if there are results
      getfileRef().then(async (includeDocumentType)=>{
        if (await displayData.childNodes.length == 0){
          websiteContainer.style.visibility = 'hidden';
        };
        if (await displayData.childNodes.length > 0){
          websiteContainer.style.visibility = 'visible';
        };
      });
    });
  //resets all drop downs to closed
  allDropdownsCheckboxes.forEach((countainer)=>{
    countainer.style.display = 'none';
  });
  //hides loading once search is completed loading
  setTimeout(function(){
    loadingElement.style.visibility = 'hidden';
  }, 500);   
};

getDataForm.onsubmit = getData;


/*********************************************Back button********************************************************/

const backToSearch = () =>{
  getDataForm.style.display = 'block';
  results.style.display = 'none';
  websiteContainer.style.visibility = 'hidden';
};

backBtn.onclick = backToSearch;















//***********************************************extra*************************************************************** */

 let tags2 = ['a', 'b', 'y', 'z'];
 let checkmarks2 = ['a', 'y', 'k'];
 
 
 
 let intersection = tags2.filter(x => checkmarks2.includes(x)); 
 
 
 
 console.log(intersection);


 intersection.sort();
checkmarks2.sort()

let str1 = intersection.toString();
let str2 = checkmarks2.toString();
console.log(str1)
console.log(str2)

if (str1 == str2){
  console.log("sucess")
}
//************************************************************************************************************
