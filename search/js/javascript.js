/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  
  import {getDatabase, ref, set, child, get, update, remove, orderByChild, equalTo, query} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query as store, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"
/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {

 Redacted


  };
  

/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const realDB = getDatabase();

  const db = getFirestore();


/**************************************************Variables, Referances and EventListeners*********************************************/ 


let files = [];
let expanded = false;


const getDataForm = document.getElementById('getDataForm');
const resultsBtn = document.getElementById('resultsBtn');
const websiteContainer = document.getElementById('websiteContainer');
const loadingElement = document.getElementById('loading');

const results = document.getElementById('results');
const websiteRef = document.getElementById("websites");
const displayData = document.getElementById("displayData");

const documentTypeSelectBox = document.getElementById('documentTypeSelectBox');
const documentTypeCheckboxes = document.getElementById("documentTypeCheckboxes");
const buildingTypologySelectBox = document.getElementById('buildingTypologySelectBox');
const buildingTypologycheckboxes = document.getElementById("buildingTypologycheckboxes");
const buildingEnvelopeSelectBox = document.getElementById('buildingEnvelopeSelectBox');
const buildingEnvelopecheckboxes= document.getElementById("buildingEnvelopecheckboxes");
const HeatingCoolingSelectBox = document.getElementById('HeatingCoolingSelectBox');
const HeatingCoolingcheckboxes = document.getElementById("HeatingCoolingcheckboxes");
const MechanicalElectricalSelectBox = document.getElementById('MechanicalElectricalSelectBox');
const MechanicalElectricalcheckboxes = document.getElementById("MechanicalElectricalcheckboxes");
const DesignProcessSelectBox = document.getElementById('DesignProcessSelectBox');
const DesignProcesscheckboxes = document.getElementById("DesignProcesscheckboxes");



const documentTypeAll = document.getElementById("documentTypeAll");
const documentType = document.getElementsByName("documentType");
const buildingTypologyAll = document.getElementById("buildingTypologyAll");
const buildingTypology = document.getElementsByName("buildingTypology");
const buildingEnvelopeAll = document.getElementById("buildingEnvelopeAll");
const buildingEnvelope = document.getElementsByName("buildingEnvelope");
const HeatingCoolingAll = document.getElementById("HeatingCoolingAll");
const HeatingCooling = document.getElementsByName("HeatingCooling");
const MechanicalElectricalAll = document.getElementById("MechanicalElectricalAll");
const MechanicalElectrical = document.getElementsByName("MechanicalElectrical");
const DesignProcessAll = document.getElementById("DesignProcessAll");
const DesignProcess = document.getElementsByName("DesignProcess");




documentTypeAll.addEventListener("change", () =>{
  documentType.forEach((element)=>{
    element.checked = documentTypeAll.checked;
  })
})

buildingTypologyAll.addEventListener("change", () =>{alert
  buildingTypology.forEach((element)=>{
    element.checked = buildingTypologyAll.checked;
  })
})

buildingEnvelopeAll.addEventListener("change", () =>{
  buildingEnvelope.forEach((element)=>{
    element.checked = buildingEnvelopeAll.checked;
  })
})

HeatingCoolingAll.addEventListener("change", () =>{
  HeatingCooling.forEach((element)=>{
    element.checked = HeatingCoolingAll.checked;
  })
})

MechanicalElectricalAll.addEventListener("change", () =>{
  MechanicalElectrical.forEach((element)=>{
    element.checked = MechanicalElectricalAll.checked;
  })
})

DesignProcessAll.addEventListener("change", () =>{
  DesignProcess.forEach((element)=>{
    element.checked = DesignProcessAll.checked;
  })
})

/*********************************************************Selections and Helpers***************************************************************/



async function getProjects(){
  const projects = await getDocs(collection(db, "Projects")); 
  return projects
}

async function getProjectNames(){
  const projectName = []
  const projects = await getProjects()

  projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;    
    projectName.push(projectNameRef);
  })

  return projectName;
}















/*********************************************Functions for Realtime Database********************************************************/

async function getData(e){
  e.preventDefault();
  loadingElement.style.visibility = 'visible';
  const eachProject = await getProjectNames()
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  let includeFile = []
  let websiteURL = '';
  let includeWebsite = [];
  const checkboxValues = [];

  getDataForm.style.display = 'none';
  results.style.display = 'flex';
  displayData.innerHTML = '';
  websiteRef.innerHTML = '';


  

  checkboxes.forEach((checkbox) => {
    checkboxValues.push(checkbox.value);
    checkbox.checked = false
  });




    eachProject.forEach((collectionRef)=>{
      async function getfileRef(){
        const snapshotRef = doc(db, "Projects", collectionRef);
        const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));
        const project = await getDoc(snapshotRef);
        websiteURL = project.data().ProjectURL;
        

        docSnapshot.forEach((Snapshot)=>{
          const file = Snapshot.data()       
         
          if(checkboxValues.length===0){
            return;
          }
             checkboxValues.forEach( (checkmarks)=>{
               if(file.tags.includes(checkmarks)){
              // must iterate over many includes maybe in abover includes to iterate over or below
                //use check against .every for checkmarks and includes
                if(includeFile.indexOf(file.fileTitle) == -1) {
                  includeFile.push(file.fileTitle)
                  //use includes, but must iterate over many includes here or above
                  displayData.innerHTML += `<a id='data' href='${file.fileURL}' target="_blank" rel="noopener noreferrer">${file.fileTitle}</a>`;
                  if(includeWebsite.indexOf(websiteURL) == -1){
                    includeWebsite.push(websiteURL)
                    websiteRef.innerHTML += `<a id='webURL' href='${websiteURL}' target="_blank" rel="noopener noreferrer">${websiteURL}</a>`;
                  }
                } else {
                  return;
                }
               }else{
                 return;
               };
            });
          
        })
        
      }
      getfileRef().then(async ()=>{
        if (await displayData.childNodes.length == 0){
          console.log("test")
          websiteContainer.style.visibility = "hidden";
        }
        if (await displayData.childNodes.length > 0){
          websiteContainer.style.visibility = "visible";
        }
      }
      )
    })


    setTimeout(function(){
      loadingElement.style.visibility = 'hidden';
    }, 500);
}

getDataForm.onsubmit = getData;




const backToSearch = () =>{
  getDataForm.style.display = 'block';
  results.style.display = 'none';
  websiteContainer.style.visibility = "hidden";
}

resultsBtn.onclick = backToSearch;



/*********************************************Function for Dropdown menu checkboxes********************************************************/


function documentTypeSelectBoxShowCheckboxes() {
  
  if (!expanded) {
    documentTypeCheckboxes.style.display = "block";
    expanded = true;
  } else {
    documentTypeCheckboxes.style.display = "none";
    expanded = false;
  }
}

function buildingTypologyShowCheckboxes() {
  
  if (!expanded) {
    buildingTypologycheckboxes.style.display = "block";
    expanded = true;
  } else {
    buildingTypologycheckboxes.style.display = "none";
    expanded = false;
  }
}

function buildingEnvelopeShowCheckboxes() {
  
  if (!expanded) {
    buildingEnvelopecheckboxes.style.display = "block";
    expanded = true;
  } else {
    buildingEnvelopecheckboxes.style.display = "none";
    expanded = false;
  }
}

function HeatingCoolingShowCheckboxes() {
  
  if (!expanded) {
    HeatingCoolingcheckboxes.style.display = "block";
    expanded = true;
  } else {
    HeatingCoolingcheckboxes.style.display = "none";
    expanded = false;
  }
}

function MechanicalElectricalShowCheckboxes() {
  
  if (!expanded) {
    MechanicalElectricalcheckboxes.style.display = "block";
    expanded = true;
  } else {
    MechanicalElectricalcheckboxes.style.display = "none";
    expanded = false;
  }
}

function DesignProcessShowCheckboxes() {
  
  if (!expanded) {
    DesignProcesscheckboxes.style.display = "block";
    expanded = true;
  } else {
    DesignProcesscheckboxes.style.display = "none";
    expanded = false;
  }
}

documentTypeSelectBox.onclick = documentTypeSelectBoxShowCheckboxes;
buildingTypologySelectBox.onclick = buildingTypologyShowCheckboxes;
buildingEnvelopeSelectBox.onclick = buildingEnvelopeShowCheckboxes;
HeatingCoolingSelectBox.onclick = HeatingCoolingShowCheckboxes;
MechanicalElectricalSelectBox.onclick = MechanicalElectricalShowCheckboxes;
DesignProcessSelectBox.onclick = DesignProcessShowCheckboxes;

















// const tags2 = [0, 2, 2, 2, 1,4, 5];
// const checkmarks2 = [0, 2, 2, 2,4,1,  ];
// const compareArrays = (tags2, checkmarks2) => {
//    const areEqual = checkmarks2.every(el => {
//      console.log(el)
//       return tags2.includes(el, el);
//    });
//    return areEqual;
// };
// console.log(compareArrays(tags2, checkmarks2));



// const tags2 = [0, 2, 2, 2, 1,4, 5];
// const checkmarks2 = [0, 2, 2, 2,1,4, 5 ];
// const compareArrays = (tags2, checkmarks2) => {
//    const areEqual = tags2.includes(0);
//    return areEqual;
// };
// console.log(compareArrays(tags2, checkmarks2));


//put below inside of every------------------------------
// const tags2 = [0, 2, 2, 2,4,1,  ];
// const checkmarks2 = [0, 2,  1,4, 6];
// var flag = true;
// for(let i=0; i<tags2.length; i++) {
//   if(!checkmarks2.includes(tags2[i])) {
//     flag = false;

//   }
// }
// if(flag) {
//   console.log("true");
// }





 


//***********************************************use*************************************************************** */

 let tags2 = ['a', 'b', 'y', 'z'];
 let checkmarks2 = ['a', 'y'];
 
 
 
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
// let test = []


//  for(let i=0; i<tags2.length; i++) {
//    if (checkmarks2.includes(tags2[i])){
//      test.push('true')
     
//    }
//    if (!checkmarks2.includes(tags2[i])){
//     test.push('false')
    
//   }
//  }

//  console.log(test)

// if (test.includes("false")){
//   console.log("nope")
// } else {
//   console.log('sucsess')
// }





//async function getData (e) {
  //   e.preventDefault();
  //   loadingElement.style.visibility = 'visible';
  //   const projects = await getDocs(collection(db, "Projects"));
  //   const projectName = [];
    
  //   getDataForm.style.display = 'none';
  //   results.style.display = 'flex';
  //   websiteContainer.style.visibility = "visible";
  //   displayData.innerHTML = '';
  //   websiteRef.innerHTML = '';
  
  //    projects.forEach((documentRef) => {
  //     const projectNameRef = documentRef.data().ProjectName;     
  //     projectName.push(projectNameRef);
  //   })
    
    
   
  
  
  //         const checkboxValues = [];
  //         let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  
  //         checkboxes.forEach((checkbox) => {
  //           checkboxValues.push(checkbox.value);
  //           checkbox.checked= false
  //         });
   
    
          
          
  //   projectName.forEach((collectionRef)=>{
  //     async function getFileName(){
  //       const snapshotRef = doc(db, "Projects", collectionRef);
  //       const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));
  //       const website = await getDoc(snapshotRef)
        
        
  //        docSnapshot.forEach((documentRef)=>{
  //         const file = documentRef.data();
  //         const fileName = [];
  //         const fileURL = [];
  
  //         let result = false;      
  //         if(checkboxValues.length===0){
  //           result = false;
  //         }else {
  //           result = checkboxValues.every( (checkmarks)=>{
  //           return file.tags.includes(checkmarks);
  //           });
            
  //         };
        
  //         // let result = false;
         
  //         // const test=[]
           
  //         //   console.log(test)
            
  //          //*************************usethis below to get to loop like */
  //         //   if(checkboxValues.length===0){
  //         //     result = false;
  //         //   }else {
  //         //     result = checkboxValues.forEach( (checkmarks)=>{
  //         //       test.push( file.tags.includes(checkmarks));
  //         //     });
              
  //         //   };
  
  //         if (result === true){
  //           fileName.push(file.fileName);
  //           fileURL.push(file.fileURL);
               
  //           async function websites(){      
  //             const website = await getDoc(snapshotRef)           
  //             return website
  //           }
  //           websites().then((website) =>{  
  //             websiteURL.add(website.data().ProjectURL)    
  //           })
  //           displayData.innerHTML += `<a id='data' href='${fileURL}' target="_blank" rel="noopener noreferrer">${fileName}</a>`;
  //         } else {
  //          return;
  //         }
  //       })
  //     }
  //   getFileName()
  // })
      
  //   setTimeout(function(){
  //     loadingElement.style.visibility = 'hidden';
  //   }, 500);
  // };
  
  // // getDataForm.onsubmit = getData;