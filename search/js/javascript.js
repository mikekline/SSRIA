/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import {getFirestore, doc, getDoc, getDocs, collection} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"

/****************************************** web app's Firebase configuration***********************************************************/ 


  const firebaseConfig = {

Redacted

  };
  

/***************************************************************Initialize Firebase***************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const db = getFirestore();


/********************************************************************Referances******************************************************/ 


//search form
const getDataForm = document.getElementById('getDataForm');
//results page
const results = document.getElementById('results');
const displayData = document.getElementById("displayData");
const websiteContainer = document.getElementById('websiteContainer');
const websiteRef = document.getElementById("websites");
const backBtn = document.getElementById('backBtn');
const loadingElement = document.getElementById('loading');
//checkbox selectors
const buildingTypes = document.getElementsByName("buildingTypes")
const buildingTypesAll = document.getElementById("buildingTypesAll");
const BuildingSystems = document.getElementsByName("BuildingSystems")
const BuildingSystemsAll = document.getElementById("BuildingSystemsAll");
const PopularSubjects = document.getElementsByName("PopularSubjects")
const PopularSubjectsAll = document.getElementById("PopularSubjectsAll");





/**************************************************************Global Variables ****************************************************/ 


const allCheckbox = [
  buildingTypesAll,
  BuildingSystemsAll,
  PopularSubjectsAll
];

const checkBoxName = [
  buildingTypes,
  BuildingSystems,
  PopularSubjects
];


/***********************************************************EventListeners**********************************************************/


/***** when all checkbox is clicked selectes all in drop down menu*/
for (let i= 0; i<allCheckbox.length; i++){
  allCheckbox[i].addEventListener("change", () =>{
    checkBoxName[i].forEach((element)=>{
      element.checked = allCheckbox[i].checked;
    });
  });
};


/*********************************************************Selections and Helpers***************************************************/


//gets list of projects from the database
async function getProjects(){
  const projects = await getDocs(collection(db, "Projects")); 
  return projects;
}

//gets project names from the database
async function getProjectNames(){
  const projectNames = [];
  const projects = await getProjects();

  projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;    
    projectNames.push(projectNameRef);
  })

  return projectNames;
}



//gets list and location of document type images and document type name from the database
async function getDocumentTypeImages(){
  const docType = await getDocs(collection(db, "DocumentTypeImages")); 
  const documentTypeImages = [];

  docType.forEach((documentRef) => {
    const documentImageNameRef = documentRef.data(); 
    documentTypeImages.push(documentImageNameRef)
  }); 

  return documentTypeImages;
}

 
/*********************************************Functions for Search form********************************************************/


async function getData(e){
  e.preventDefault();
  loadingElement.style.visibility = 'visible';
  const eachProject = await getProjectNames()
  const documentImages = await getDocumentTypeImages()
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  let includeFile = []
  let includeWebsite = [];
  let includeDocumentType = [];
  let filteredImages= [];
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

                  
                
                  //displays each Document Type Image and container to hold each result
                  //and removes duplicates
                  documentImages.forEach((eachImage)=>{ 
                    if(filteredImages.indexOf(eachImage.documentType) == -1){
                      filteredImages.push(eachImage.documentType);
                          
                      displayData.innerHTML += `
                        <div id='gridItem${eachImage.documentType}' class='gridItems'>
                          <img 
                            id='documentTypeHeader' 
                            class='documentTypeHeaders'
                            src='${eachImage.imageURL}.imageURL' 
                            alt='${eachImage.documentType}' 
                            width='50%' 
                            height='50%'
                          >
                          <div id='display${eachImage.documentType}' class="displayFiles"></div>
                        </div>
                      `;
                    }
                  });
                };
                
  
                //displays each results file under appropriate document type listed
                includeDocumentType.forEach((type)=>{
                  const displayDocument = document.getElementById('display'+type);
                  if (type==file.documentType){
                    displayDocument.innerHTML += `<a 
                                                    id='data' 
                                                    href='${file.fileURL}' 
                                                    target='_blank' 
                                                    rel='noopener 
                                                    noreferrer'>
                                                      ${file.fileTitle}
                                                    </a>`;
                  }
                });



                //displays website of project if there is an associated file displayed
                //removes duplicates
                if(includeWebsite.indexOf(websiteURL) == -1){
                  includeWebsite.push(websiteURL)
                  websiteRef.innerHTML += `<a 
                                            id='webURL' 
                                            href='${websiteURL}' 
                                            target='_blank' 
                                            rel='noopener 
                                            noreferrer'>
                                             ${websiteURL}
                                            </a>`;
                };
              };
            };
          });
        
        //removes images and grid item if no data is to be displayd of that document type
        //must have else with display flex or creates a bug and may not display an item that should be displayed  
        const displayedFiles = document.getElementById('display'+file.documentType);
        const gridItem = document.getElementById('gridItem'+file.documentType);
          if(displayedFiles.innerHTML === ''){
            gridItem.style.display = 'none';
          } else {
            gridItem.style.display = 'flex';
          }
        });
      };
      
   
      // if there is no search results hides the website Associated 
      //Project Websites title and makes visible if there are results
      getfileRef().then(async ()=>{
        if (await displayData.childNodes.length == 0){
          websiteContainer.style.visibility = 'hidden';
        };
        if (await displayData.childNodes.length > 0){
          websiteContainer.style.visibility = 'visible';
        };
      });
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

















// //***********************************************extra*************************************************************** */

//  let tags2 = ['a', 'b', 'y', 'z'];
//  let checkmarks2 = ['a', 'y', 'k'];
 
 
 
//  let intersection = tags2.filter(x => checkmarks2.includes(x)); 
 
 
 
//  console.log(intersection);


//  intersection.sort();
// checkmarks2.sort()

// let str1 = intersection.toString();
// let str2 = checkmarks2.toString();
// console.log(str1)
// console.log(str2)

// if (str1 == str2){
//   console.log("sucess")
// }
// //************************************************************************************************************
