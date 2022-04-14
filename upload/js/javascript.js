/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import { getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"

/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {

Redacted


  };
  

/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const db = getFirestore();

  const storage = getStorage();


/**************************************************Global Variables, Referances and EventListeners*********************************************/ 


let files = [];
let expanded = false;
let reader = new FileReader();
let fileURL = null;

const createProject = document.getElementById('projectButton');
const projectName = document.getElementById('projectName');
const projectWebsite = document.getElementById('projectWebsite');
const projectList = document.getElementById('projects');
const deleteProjects = document.getElementById('deleteProjects');
const fileInput = document.getElementById('file');
const addProjectForm = document.getElementById('addProjectForm');
const deleteForm = document.getElementById('deleteForm');
const uploadForm = document.getElementById('uploadForm');
const mainMenu = document.getElementById('mainMenu');
const addProject = document.getElementById('addProject');
const loadingElement = document.getElementById('loading');
const uploadBtn = document.getElementById('upload');
const deleteMenu = document.getElementById('deleteMenu');
const deleteBtn = document.getElementById('deleteBtn');
const deleteSelectProject = document.getElementById('deleteSelectProject');
const filestoBeDeleted = document.getElementById('filestoBeDeleted');
const ProjectBackMainMenu = document.getElementById('ProjectBackMainMenu');
const uploadBackMainMenu = document.getElementById('uploadBackMainMenu');
const deleteBackMainMenu = document.getElementById('deleteBackMainMenu');
const confirmPage = document.getElementById('confirmPage');
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
const alertContent = document.getElementById("alertContent");
const alertBackground = document.getElementById("alertBackground");
const alertBox = document.getElementById("alertBox");
const alertBtn = document.getElementById("alertBtn");

const allDropdownsCheckboxes = [
  buildingTypologycheckboxes,
  buildingEnvelopecheckboxes,
  HeatingCoolingcheckboxes,
  MechanicalElectricalcheckboxes,
  DesignProcesscheckboxes,
]







fileInput.addEventListener("change", (e) => {
  files = e.target.files; 		
  reader.readAsDataURL(files[0]);
});


reader.onload = () =>{
  fileURL = reader.result  
}



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
loadingElement.style.visibility = 'hidden';

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

function ValidateURL(URLTest){
  if (URLTest.includes('https://')) {
    return true
  }
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
        Alert('File already exists! Please choose a differant one!')
        shouldSkip = true;
      }else{
        uploadFile()
        shouldSkip = true;
      }
    })
  })
}




function checkFileToBeUploaded(URL, fileName, fileTitle){
  let URLToDisplay = null;

  if (files[0]==undefined){
    if (!ValidateURL(URL)){
      Alert(`URL must conatin https:// at the begining!`);
      return;
    }
    URLToDisplay = URL
  } else {
    URLToDisplay = fileURL
  }

  

  if(!(fileTitleRef.value)){
    Alert("Please add a Title for the file!");
    return;
  }

  uploadForm.style.display = "none";
  confirmPage.style.display = "flex";

  
  const projectName = projectList.value;
  const docType = documentType.value;
  const checkboxValues = []
  const tags = [projectName, docType, checkboxValues];
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  
  checkboxes.forEach((checkbox) => {
    checkboxValues.push(checkbox.value);
    checkbox.checked = false
  })

  const tagsToUpload=[].concat.apply([], tags);
  const filteredTagsToUpload = tagsToUpload.filter(Boolean); 
  const filteredTagsToDisplay = filteredTagsToUpload.join(', ');
  
  



    confirmData.innerHTML = `
      <h3 class='dataHeader'>File Title</h3>
      <p class='datacontent'>${fileTitle}</p>
      <h3 class='dataHeader'>Project</h3>
      <p class='datacontent'>${projectName}</p>
      <h3 class='dataHeader'>File or URL to be uploaded</h3>
      <P><a class='datacontent' href="${URLToDisplay}" target="_blank" rel="noopener noreferrer">${fileName}</a></p>
      <h3 class='dataHeader'>Document Type</h3>
      <p class='datacontent'>${docType}</p>
      <h3 class='dataHeader'>Tags for Files</h3>
      <p class='datacontent'>${filteredTagsToDisplay}</p>
    `;

    const cancel = () => {
      uploadForm.style.display = "block";
      confirmPage.style.display = "none";
      return
    }

   

  cancelBtn.onclick = cancel;
  

  allDropdownsCheckboxes.forEach((countainer)=>{
    countainer.style.display = "none";
  })
  fileTitleRef.value = '';
  videoURLRef.value = '';
  fileInput.value = '';
}




function Alert(alertText){
  alertContent.innerHTML = alertText;
  alertBackground.style.display = "flex";
  alertBox.style.display = "flex";
  const alertOk = () => {
    alertBackground.style.display = "none";
    alertBox.style.display = "none";
    projectName.value = '';
    projectWebsite.value = '';
    fileTitleRef.value = '';
    videoURLRef.value = '';
    fileInput.value = '';
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })
  }
  alertBtn.onclick = alertOk
  return;
}


/*************************************Uploading files to Cloud Storage and video url to Database*********************************************/


async function Upload(e){
  e.preventDefault();
  
  
  
  if(projectList.value == 0){
    Alert('Please add a project');
    document.getElementById("btnUpload").disabled = true;
    return;
  }

  if (!ValidateFileTitle(fileTitleRef.value)){
    Alert(`File title can't contain a forward slash!`);
    return;
   }

   if((files[0]==undefined) && (videoURLRef.value == '')){
    Alert("Please add a file or video url to be uploaded!");
    return;
  }
 
  if(!(files[0]==undefined) && !(videoURLRef.value == '')){
    Alert('There can be only one or the other! Either a Video url or a file to upload!')
    videoURLRef.value = '';
    fileInput.value = '';
    return;
  }
  
  
  if (files[0]==undefined){
    let videoURL = videoURLRef.value;
    
    const okay = async (fileTitle) => {
      uploadForm.style.display = "block";
      confirmPage.style.display = "none";
      saveFileURLtoDB(videoURL, videoURL, fileTitle);
      loadingElement.style.visibility = 'visible';
    } 
    okBtn.onclick = okay.bind(okBtn, fileTitleRef.value);
    checkFileToBeUploaded(videoURL, videoURL, fileTitleRef.value);

  } else {

    let fileName = files[0].name;
    let fileToUpload = files[0];
    let fileNameOnly = GetFileName(files[0])
    
    if (!ValidateFileName(fileNameOnly)){
      Alert(`File name can't contain spaces or any special characters, except for Underscore!`);
      fileInput.value = '';
      return;
    }

    const okay = async (fileTitle) => {
      uploadForm.style.display = "block";
      confirmPage.style.display = "none";

      const metaData = {
        contentType: fileToUpload.type
      };

      const storageRef = sRef(storage, 'Files/'+ fileName);

      
      getDownloadURL(storageRef).then(

        () => {
          Alert("File already exists! Please choose a differant one!");
          fileInput.value = '';
          return;
        },
        () => {
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
              Alert("error: file not uploaded!");
            },
            ()=>{
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{  
                
                
              
              saveFileURLtoDB(downloadURL, fileName, fileTitle);
                

              })
            }
          );
        }).catch((error)=>{
          Alert('File not uploaded, error: '+ error)
          return;
      });
    } 
    okBtn.onclick = okay.bind(okBtn, fileTitleRef.value);
    checkFileToBeUploaded(fileName, fileName, fileTitleRef.value);
  }
};


  uploadForm.onsubmit = Upload;
  

  



  
/*********************************************Functions for Database********************************************************/


async function getProjectNameList() {

projectList.innerHTML='';

  const querySnapshot = await getDocs(collection(db, "Projects"));
  querySnapshot.forEach((doc) => {
    let projectNameDocument = doc.data().ProjectName;     
    projectList.innerHTML += `<option value=${projectNameDocument}>${projectNameDocument}</option>`;
    deleteProjects.innerHTML += `<option value=${projectNameDocument}>${projectNameDocument}</option>`;
  });
};




window.onload = () => {
  getProjectNameList();
};




 async function addProjectName()  {
  let projectNameUpload = projectName.value;
  let projectWebsiteUpload = projectWebsite.value;
  

  if(!ValidateProjectName() || projectNameUpload == ''){
    Alert(`Project name can't contain "spaces", ".", "#", "$", "[", or "]"`);
    return;
  }else if (projectWebsiteUpload == ''){
    Alert ('Please add a Project Website');
    return;
  }


  const ref = doc(db, "Projects", projectNameUpload);
  const docSnapshot = await getDoc(doc(db, "Projects", projectNameUpload));

  
  if(docSnapshot.exists()){
    Alert('Project already exists, Please enter another name!')
  } else {
 

    const confirmProject = confirm("Project to be added: " + projectNameUpload + " " + projectWebsiteUpload);

    if(confirmProject){
      await setDoc(ref, {
          ProjectName: projectNameUpload,
          ProjectURL: projectWebsiteUpload,
        },
        {
          merge: true
        }
      )
      .then(()=>{
        Alert(projectNameUpload + ' was added');
        projectName.value = '';
        projectWebsite.value = '';
      })
      .catch((error)=>{
        Alert("Project was not added: " + error)
      })
    }
    
    getProjectNameList();
  }
};

createProject.onclick = addProjectName;



async function saveFileURLtoDB (URL, fileName, fileTitle){
  
  
  const projectName = projectList.value;
  const docType = documentType.value;
  const checkboxValues = []
  const tags = [projectName, docType, checkboxValues];
  const ref = doc(db, "Projects", projectName);
  const fileRef = doc(ref, projectName, fileTitle)
  const snapshotRef = doc(db, "Projects", projectName);
  const docSnapshot = await getDoc(doc(snapshotRef, projectName, fileTitle))
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')



  
 


  
  checkboxes.forEach((checkbox) => {
    checkboxValues.push(checkbox.value);
    checkbox.checked = false
  })
  


  const tagsToUpload=[].concat.apply([], tags);
  const filteredTagsToUpload = tagsToUpload.filter(Boolean); 
  



 async function uploadFile(){
  if(docSnapshot.exists()){
    Alert('This Title already exists, Please enter another Title name!')
    return

  } else {

    await setDoc(fileRef, {
      fileTitle: fileTitle,
      fileName:fileName,
      fileURL: URL,
      documentType: docType,
      tags: filteredTagsToUpload
    }
  )
  .then(()=>{
    setTimeout(function(){
      loadingElement.style.visibility = 'hidden';
    }, 500);
    Alert('File was uploaded!');
  })
  .catch((error) =>{
    Alert('An error occurred, did not upload file: '+ error);
  });
   
  }
  fileTitleRef.value = '';
  videoURLRef.value = '';
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

const deletePage = () => {
  deleteForm.style.display = "flex";
  mainMenu.style.display = "none";
  deleteSelectProject.onclick = deleteFiles;
}

const returnToMainMenu = () => {
  projectName.value = '';
  projectWebsite.value = '';
  fileTitleRef.value = '';
  videoURLRef.value = '';
  filestoBeDeleted.innerHTML = '';
  addProjectForm.style.display = "none";
  uploadForm.style.display = "none";
  deleteForm.style.display = "none";
  mainMenu.style.display = "flex";
}

addProject.onclick = mainMenuProjectPage;
uploadBtn.onclick = mainMenuUpload;
deleteMenu.onclick = deletePage;
ProjectBackMainMenu.onclick = returnToMainMenu;
uploadBackMainMenu.onclick = returnToMainMenu;
deleteBackMainMenu.onclick = returnToMainMenu;







async function deleteFiles () {
  filestoBeDeleted.innerHTML = '';
  const projectName = deleteProjects.value;
  let counter = 0;
  let fileRefs = [];
  let fileNames = [];

  const snapshotRef = doc(db, "Projects", projectName);
  const docSnapshot = await getDocs(collection(snapshotRef, projectName));
  
  

  docSnapshot.forEach((Snapshot)=>{
    const file = Snapshot.data()  
    const fileRef = doc(snapshotRef, projectName, file.fileTitle)
    fileRefs.push(fileRef)
    fileNames.push(file.fileName)

    filestoBeDeleted.innerHTML += `
    <div id='deleteFileContainer${counter}' class='deleteFileContainer'>
      <div id='dataContent${counter}' class='dataContent'>${file.fileTitle}</div>
      <button class='deleteBtn' type="button" >Delete</button>
    </div>`
           
      counter++ 
  });
 

  const deleteBtns = document.getElementsByClassName('deleteBtn')

  for (var i = 0; i < deleteBtns.length; i++) {
    const fileContainer = await document.getElementById('deleteFileContainer'+[i]);
    const fileTitle = await document.getElementById('dataContent'+[i]).innerHTML;
    let fileRef = fileRefs[i];
    let fileName = fileNames[i];
    const storageRef = sRef(storage, 'Files/' + fileName);
    
  
    deleteBtns[i].onclick = async function() { 
      const confirmDelete = confirm("Delete: " + fileTitle);

      if(confirmDelete){
        await deleteDoc(fileRef)
        .then(()=>{
          Alert('File Deleted')
          fileContainer.remove()
        })
        .catch((error)=>{
          Alert('Deletion Unsuccessful, error: '+ error)
          return;
        })
        
        getDownloadURL(storageRef).then(
          () => {
            deleteObject(storageRef)
            .catch((error)=>{
              Alert('Deletion of storage file Unsuccessful, error: '+ error)
              return;
            })
          },
          () => {
            console.log("File to be deleted is a URL!");
            return;
          })
          .catch((error)=>{
            Alert('Deletion of storage file Unsuccessful, error: '+ error)
            return;
        })
      }
    }
  }
}


// .catch((error) =>{
      //   alert('An error occurred, did not upload: '+ error);
      //   return;
      // });

      