/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import { getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

  import {getDatabase, ref, set, child, get, update, remove} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"

/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {

    apiKey: "AIzaSyCm2Qbv0nYxcnwN3HHJg2c03mK7p5SaBSY",

    authDomain: "resource-library-582d7.firebaseapp.com",

    databaseURL: "https://resource-library-582d7-default-rtdb.firebaseio.com",

    projectId: "resource-library-582d7",

    storageBucket: "resource-library-582d7.appspot.com",

    messagingSenderId: "58705463627",

    appId: "1:58705463627:web:1980af966213d48d9900ce",

    measurementId: "G-3BFTT2HXC0"


  };
  

/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const realdb = getDatabase();

  const db = getFirestore();

  const storage = getStorage();


/**************************************************Global Variables, Referances and EventListeners*********************************************/ 


let files = [];
// let counter = 0;
let expanded = false;

const createProject = document.getElementById('projectButton');
const projectName = document.getElementById('projectName');
const projectWebsite = document.getElementById('projectWebsite');
const projectList = document.getElementById('projects');
const fileInput = document.getElementById('file');
const uploadForm = document.getElementById('uploadForm');
const progressIndicator1 = document.getElementById('progress1');
const progressIndicator2 = document.getElementById('progress2');
const documentType = document.getElementById('documentType');
const fileTitle = document.getElementById('fileTitle');
const videoURLRef = document.getElementById('videoURL');
const btSelectBox = document.getElementById('btSelectBox');
const checkboxesDropdown = document.getElementById("checkboxes");
const buildingEnvelopeSelectBox = document.getElementById('buildingEnvelopeSelectBox');
const buildingEnvelopecheckboxes= document.getElementById("buildingEnvelopecheckboxes");
const HeatingCoolingSelectBox = document.getElementById('HeatingCoolingSelectBox');
const HeatingCoolingcheckboxes = document.getElementById("HeatingCoolingcheckboxes");
const MechanicalElectricalSelectBox = document.getElementById('MechanicalElectricalSelectBox');
const MechanicalElectricalcheckboxes = document.getElementById("MechanicalElectricalcheckboxes");
const DesignProcessSelectBox = document.getElementById('DesignProcessSelectBox');
const DesignProcesscheckboxes = document.getElementById("DesignProcesscheckboxes");
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




fileInput.addEventListener("change", (e) => {
  files = e.target.files; 		
});

buildingTypologyAll.addEventListener("change", () =>{
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


function GetFileName(file) {
  if(file){
    let temp = file.name.split('.');
    let fname = temp.slice(0,-1).join('.')
    return fname
  } 
}


//Project name can't contain "spaces", ".", "#", "$", "[", or "]"
function ValidateProjectName(){
  let regex = /[\.#$\s\[\]]/
  return !(regex.test(projectName.value));
}

// function ValidateFileName(fileName){
//   let regex = /[\.#$\s\[\]]/
//   return !(regex.test(fileName));
// }

function ValidateFileName(fileName){
    let regex = /^[a-zA-Z0-9_]+$/g
    return (regex.test(fileName));
  }


async function TestForExistingFile(URL, uploadFile){
  const projects = await getDocs(collection(db, "Projects")); 
  const projectName = []
  let flag =false
  let URLtest = []
  let shouldSkip = false;
  
  projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;    
    projectName.push(projectNameRef);
  })
  
  
  projectName.forEach((collectionRef)=>{
    async function getfileRef(){
      const snapshotRef = doc(db, "Projects", collectionRef);
      const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));     
      
      docSnapshot.forEach((Snapshot)=>{
        const file = Snapshot.data() 
        if (URL == file.fileURL){
          flag = true
          URLtest.push(flag);
        } else{
          flag = false
          URLtest.push(flag);
        } 
      })
      return URLtest
    }
    
    
    getfileRef().then((result)=>{
      if (shouldSkip) {
        return;
      }
      
      if (result.includes(true)){
        alert('File already exists! Please choose a differant one!')
        shouldSkip = true;
      }else{
        uploadFile()
        shouldSkip = true;
      }
    })
  })
}


/*************************************Uploading files to Cloud Storage and video url to Database*********************************************/


async function Upload(e){
  e.preventDefault();
  let fileName ='';
  let fileToUpload = '';
 
  
  
  if(projectList.value == 0){
    alert('Please add a project');
    document.getElementById("btnUpload").disabled = true;
    return;
  }
 
  if(!(files[0]==undefined) && !(videoURLRef.value == '')){
    alert('There can be only one or the other! Either a Video url or a file to upload!')
    fileInput.value = '';
    return;
  }
  
  if (files[0]==undefined){

    let videoURL = videoURLRef.value;      
    saveFileURLtoDB(videoURL, videoURL, fileTitle.value);
   
  } else {
    fileName = files[0].name;
    fileToUpload = files[0];
   
    let fileNameOnly = GetFileName(files[0])
     if (!ValidateFileName(fileNameOnly)){
      alert(`File name can't contain spaces or any special characters, except for Underscore!`);
      fileInput.value = '';
      return;
     }



    const metaData = {
      contentType: fileToUpload.type
    };


    

    const storageRef = sRef(storage, 'Files/'+ fileName);

    
    getDownloadURL(storageRef).then(onResolve, onNotFound);

    function onResolve(foundURL) {
      alert("File already exists! Please choose a differant one!");
      fileInput.value = '';
      return;
    }
  

    function onNotFound() {
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload, metaData);

      uploadTask.on('state-changed', (snapshot) => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressIndicator1.innerHTML = "Uploaded: " + progress + "%";
          progressIndicator2.style.display = 'block';
          progressIndicator2.value =  progress;
          fileInput.value = '';
          
          setTimeout(function(){
            progressIndicator1.innerHTML = '';
            progressIndicator2.style.display = 'none';
          }, 2100);
        },
        (error) => {
          alert("error: file not uploaded!");
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            
              saveFileURLtoDB(downloadURL, fileName, fileTitle.value);
            
          })
        }
      );
    }
  }
};


  uploadForm.onsubmit = Upload;
  

  




/*********************************************Functions for Database********************************************************/


async function getProjectNameList() {

projectList.innerHTML='';

  const querySnapshot = await getDocs(collection(db, "Projects"));
  querySnapshot.forEach((doc) => {
    let projectNameDocument = doc.data().ProjectName;     
    projectList.innerHTML+= `<option value=${projectNameDocument}>${projectNameDocument}</option>`;
  });
};




window.onload = () => {
  getProjectNameList();
};




 async function addProjectName()  {
  let projectNameUpload = projectName.value;
  let projectWebsiteUpload = projectWebsite.value;
  const ref = doc(db, "Projects", projectNameUpload);
  const docSnapshot = await getDoc(doc(db, "Projects", projectNameUpload));

  if(!ValidateProjectName() || projectNameUpload == ''){
    alert(`Project name can't contain "spaces", ".", "#", "$", "[", or "]"`);
    return;
  }else if (projectWebsiteUpload == ''){
    alert ('Please add a Project Website');
    return;
  }




  
  if(docSnapshot.exists()){
    alert('Project already exists, Please enter another name!')
  } else {
 
    await setDoc(ref, {
        ProjectName: projectNameUpload,
        ProjectURL: projectWebsiteUpload,
        counter: 0
      },
      {
        merge: true
      }
    )
    .then(()=>{
      alert(projectNameUpload + ' was added');
    })
    .catch((error)=>{
      alert("Project was not added: " + error)
    })
    
    getProjectNameList();
  }
};

createProject.onclick = addProjectName;



async function saveFileURLtoDB (URL, fileName, fileTitle){
  if(!(fileTitle)){
    alert("Please add a Title for the file!");
    return;
  }
  if(!(URL)){
    alert("Please add a file or video url to be uploaded!");
    return;
  }
  
  const pName = projectList.value;
  const docType = documentType.value;
  const checkboxValues = []
  const tags = [docType, pName, checkboxValues];
  const ref = doc(db, "Projects", pName);
  const fileRef = doc(ref, pName, fileTitle)
  const snapshotRef = doc(db, "Projects", pName);
  const docSnapshot = await getDoc(doc(snapshotRef, pName, fileTitle))
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')



  
 


  
  checkboxes.forEach((checkbox) => {
    checkboxValues.push(checkbox.value);
    checkbox.checked = false
  })
  


  const tagsToUpload=[].concat.apply([], tags);



 async function uploadFile(){
  if(docSnapshot.exists()){
    alert('This Title already exists, Please enter another Title name!')
  

  } else {

    await setDoc(fileRef, {
        fileTitle: fileTitle,
        fileName:fileName,
        fileURL: URL,
        tags: tagsToUpload
      }
    )
    .then(()=>{
      alert('File was uploaded!');
    })
    .catch((error) =>{
      alert('An error occurred, did not upload file: '+ error);
    });
  }

 }
 
 await TestForExistingFile(URL, uploadFile)
 
}







/*********************************************Function for Dropdown menu checkboxes********************************************************/


function showCheckboxes() {
  
  if (!expanded) {
    checkboxesDropdown.style.display = "block";
    expanded = true;
  } else {
    checkboxesDropdown.style.display = "none";
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

btSelectBox.onclick = showCheckboxes;
buildingEnvelopeSelectBox.onclick = buildingEnvelopeShowCheckboxes;
HeatingCoolingSelectBox.onclick = HeatingCoolingShowCheckboxes;
MechanicalElectricalSelectBox.onclick = MechanicalElectricalShowCheckboxes;
DesignProcessSelectBox.onclick = DesignProcessShowCheckboxes;




// .catch((error) =>{
      //   alert('An error occurred, did not upload: '+ error);
      //   return;
      // });