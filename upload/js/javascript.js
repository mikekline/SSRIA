/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import { getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

  import {getDatabase, ref, set, child, get, update, remove} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"

/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {

 Redacted


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
const addProjectForm = document.getElementById('addProjectForm');
const uploadForm = document.getElementById('uploadForm');
const mainMenu = document.getElementById('mainMenu');
const addProject = document.getElementById('addProject');
const uploadBtn = document.getElementById('upload');
const deleteBtn = document.getElementById('delete');
const ProjectBackMainMenu = document.getElementById('ProjectBackMainMenu');
const uploadBackMainMenu = document.getElementById('uploadBackMainMenu');
const confirm = document.getElementById('confirm');
const confirmData = document.getElementById('confirmData');
const cancelBtn = document.getElementById('cancelBtn');
const okBtn = document.getElementById('okBtn');
const progressIndicator1 = document.getElementById('progress1');
const progressIndicator2 = document.getElementById('progress2');
const documentType = document.getElementById('documentType');
const fileTitleRef = document.getElementById('fileTitle');
const videoURLRef = document.getElementById('videoURL');
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


const allDropdownsCheckboxes = [
  buildingTypologycheckboxes,
  buildingEnvelopecheckboxes,
  HeatingCoolingcheckboxes,
  MechanicalElectricalcheckboxes,
  DesignProcesscheckboxes,
]


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

function ValidateFileTitle(fileTitle){
  let regex = /\//ig;
  return !(regex.test(fileTitle));
}

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
  let fileNameOnly = GetFileName(files[0])
  
  
  if(projectList.value == 0){
    alert('Please add a project');
    document.getElementById("btnUpload").disabled = true;
    return;
  }

  if (!ValidateFileTitle(fileTitleRef.value)){
    alert(`File title can't contain a forward slash!`);
    return;
   }
 
  if(!(files[0]==undefined) && !(videoURLRef.value == '')){
    alert('There can be only one or the other! Either a Video url or a file to upload!')
    fileInput.value = '';
    return;
  }

  
  if (files[0]==undefined){

    let videoURL = videoURLRef.value;      
    saveFileURLtoDB(videoURL, videoURL, fileTitleRef.value);
  } else {
    fileName = files[0].name;
    fileToUpload = files[0];
   
    
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
            
              saveFileURLtoDB(downloadURL, fileName, fileTitleRef.value);
            
          })
        }
      );
    }
  }
  allDropdownsCheckboxes.forEach((countainer)=>{
    countainer.style.display = "none";
  })
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
  

  if(!ValidateProjectName() || projectNameUpload == ''){
    alert(`Project name can't contain "spaces", ".", "#", "$", "[", or "]"`);
    return;
  }else if (projectWebsiteUpload == ''){
    alert ('Please add a Project Website');
    return;
  }


  const ref = doc(db, "Projects", projectNameUpload);
  const docSnapshot = await getDoc(doc(db, "Projects", projectNameUpload));

  
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
  const tags = [pName, docType, checkboxValues];
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
  const filteredTagsToUpload = tagsToUpload.filter(Boolean); 
  const filteredTagsToDisplay = filteredTagsToUpload.join(', ');



 async function uploadFile(){
  if(docSnapshot.exists()){
    alert('This Title already exists, Please enter another Title name!')
  

  } else {

    const cancel = () => {
      uploadForm.style.display = "block";
      confirm.style.display = "none";
    }

    uploadForm.style.display = "none";
    confirm.style.display = "flex";
    cancelBtn.onclick = cancel;
    

    confirmData.innerHTML = `
      <h3 class='dataHeader'>File Title</h3>
      <p class='datacontent'>${fileTitle}</p>
      <h3 class='dataHeader'>File Name</h3>
      <p class='datacontent'>${fileName}</p>
      <h3 class='dataHeader'>File URL</h3>
      <P><a class='datacontent' href="${URL}" target="_blank" rel="noopener noreferrer">${URL}</a></p>
      <h3 class='dataHeader'>Document Type</h3>
      <p class='datacontent'>${docType}</p>
      <h3 class='dataHeader'>Tags for Files</h3>
      <p class='datacontent'>${filteredTagsToDisplay}</p>
    `;

    const okay = async () => {
      await setDoc(fileRef, {
          fileTitle: fileTitle,
          fileName:fileName,
          fileURL: URL,
          documentType: docType,
          tags: filteredTagsToUpload
        }
      )
      .then(()=>{
        alert('File was uploaded!');
      })
      .catch((error) =>{
        alert('An error occurred, did not upload file: '+ error);
      });

      fileTitleRef.value = '';
      videoURLRef.value = '';
      uploadForm.style.display = "block";
      confirm.style.display = "none";

    }
   okBtn.onclick = okay;
   
  }

 }
 
 await TestForExistingFile(URL, uploadFile)
 
}







/*********************************************Functions for Dropdown menu checkboxes********************************************************/


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

buildingTypologySelectBox.onclick = buildingTypologyShowCheckboxes;
buildingEnvelopeSelectBox.onclick = buildingEnvelopeShowCheckboxes;
HeatingCoolingSelectBox.onclick = HeatingCoolingShowCheckboxes;
MechanicalElectricalSelectBox.onclick = MechanicalElectricalShowCheckboxes;
DesignProcessSelectBox.onclick = DesignProcessShowCheckboxes;


/*********************************************Functions for Main Menu********************************************************/

const mainMenuProjectPage = () => {
  addProjectForm.style.display = "flex";
  mainMenu.style.display = "none";
}

const mainMenuUpload = () => {
  uploadForm.style.display = "block";
  mainMenu.style.display = "none";
}

const returnToMainMenu = () => {
  fileTitleRef.value = '';
  videoURLRef.value = '';
  addProjectForm.style.display = "none";
  uploadForm.style.display = "none";
  mainMenu.style.display = "flex";
}

addProject.onclick = mainMenuProjectPage;
uploadBtn.onclick = mainMenuUpload;
ProjectBackMainMenu.onclick = returnToMainMenu;
uploadBackMainMenu.onclick = returnToMainMenu;

// .catch((error) =>{
      //   alert('An error occurred, did not upload: '+ error);
      //   return;
      // });