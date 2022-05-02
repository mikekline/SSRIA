/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL, deleteObject} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, deleteDoc} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {

  Redacted

  };
  
/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const db = getFirestore();

  const storage = getStorage();

/*******************************************************************Referances********************************************************/ 


//main menu
const mainMenu = document.getElementById('mainMenu');
const addProjectForm = document.getElementById('addProjectForm');
const deleteForm = document.getElementById('deleteForm');
const uploadForm = document.getElementById('uploadForm');
//project page and project lists
const createProject = document.getElementById('projectButton');
const projectName = document.getElementById('projectName');
const projectWebsite = document.getElementById('projectWebsite');
const projectList = document.getElementById('projects');
const addProject = document.getElementById('addProject');
const ProjectBackMainMenu = document.getElementById('ProjectBackMainMenu');
//file to be uploaded page
const documentType = document.getElementById('documentType');
const buildingTypes = document.getElementById('buildingTypes');
const fileTitleRef = document.getElementById('fileTitle');
const videoURLRef = document.getElementById('videoURL');
const fileInput = document.getElementById('file');
const uploadBackMainMenu = document.getElementById('uploadBackMainMenu');
//checkbox selectors on upload page
const BuildingSystems = document.getElementsByName("BuildingSystems")
const BuildingSystemsAll = document.getElementById("BuildingSystemsAll");
const PopularSubjects = document.getElementsByName("PopularSubjects")
const PopularSubjectsAll = document.getElementById("PopularSubjectsAll");
//file upload confirmation page
const confirmPage = document.getElementById('confirmPage');
const confirmData = document.getElementById('confirmData');
const cancelBtn = document.getElementById('cancelBtn');
const okBtn = document.getElementById('okBtn');
const loadingElement = document.getElementById('loading');
const uploadBtn = document.getElementById('upload');
const progressIndicator1 = document.getElementById('progress1');
const progressIndicator2 = document.getElementById('progress2');
//deletefiles page
const deleteMenu = document.getElementById('deleteMenu');
const deleteSelectProject = document.getElementById('deleteSelectProject');
const deleteFileFromProject = document.getElementById('deleteFileFromProject');
const filestoBeDeleted = document.getElementById('filestoBeDeleted');
const deleteBackMainMenu = document.getElementById('deleteBackMainMenu');
const deleteBtns = document.getElementsByClassName('deleteBtn')
//confirmation and alert boxes
const alertContent = document.getElementById('alertContent');
const alertBackground = document.getElementById('alertBackground');
const alertBox = document.getElementById('alertBox');
const alertBtn = document.getElementById('alertBtn');
const confirmCancel = document.getElementById('confirmCancel');
const confirmOk = document.getElementById('confirmOk');
const confirmContent = document.getElementById('confirmContent');
const confirmBox = document.getElementById('confirmBox');



/****************************************************************Global Variables and inital states********************************************************/ 


let files = [];
let reader = new FileReader();
let fileURL = null;
let checkboxValues = []

const allCheckbox = [
  BuildingSystemsAll,
  PopularSubjectsAll
];

const checkBoxName = [
  BuildingSystems,
  PopularSubjects
];

loadingElement.style.visibility = 'hidden';



/***********************************************************EventListeners**************************************************************************/


/**************grabs file when added to form *******/
fileInput.addEventListener('change', (e) => {
  files = e.target.files; 		
  reader.readAsDataURL(files[0]);
});

//alows file to be veiwed before upload
reader.onload = () =>{
  fileURL = reader.result  
};

/***** when all checkbox is clicked selectes all in drop down menu*/
for (let i= 0; i<allCheckbox.length; i++){
  allCheckbox[i].addEventListener('change', () =>{
    checkBoxName[i].forEach((element)=>{
      element.checked = allCheckbox[i].checked;
    });
  });
};



/**********************************************************Functions for Main Menu**************************************************************/

const mainMenuProjectPage = () => {
  clearForms()
  addProjectForm.style.display = "flex";
  mainMenu.style.display = "none";
};

const mainMenuUpload = () => {
  clearForms()
  getProjectNameList();
  uploadForm.style.display = "block";
  mainMenu.style.display = "none";
};

const deletePage = () => {
  clearForms()
  filestoBeDeleted.innerHTML = '';
  deleteForm.style.display = "flex";
  mainMenu.style.display = "none";
  deleteSelectProject.onclick = deleteFiles;
};

const returnToMainMenu = () => {
  clearForms()
  addProjectForm.style.display = "none";
  uploadForm.style.display = "none";
  deleteForm.style.display = "none";
  mainMenu.style.display = "flex";
};

addProject.onclick = mainMenuProjectPage;
uploadBtn.onclick = mainMenuUpload;
deleteMenu.onclick = deletePage;
ProjectBackMainMenu.onclick = returnToMainMenu;
uploadBackMainMenu.onclick = returnToMainMenu;
deleteBackMainMenu.onclick = returnToMainMenu;



/*********************************************************Selections and Helpers***************************************************************/


//removes extention from the file name
function GetFileName(file) {
  if(file){
    let temp = file.name.split('.');
    let fname = temp.slice(0,-1).join('.');
    return fname;
  };
};


//Project name can not contain "spaces", ".", "#", "$", "[", or "]"
function ValidateProjectName(){
  let regex = /[\.#$\s\[\]]/;
  return !(regex.test(projectName.value));
};


//File title can not contain forward slash check
function ValidateFileTitle(fileTitle){
  let regex = /\//ig;
  return !(regex.test(fileTitle));
};


//file name can not cotain special characters other than underscore
function ValidateFileName(fileName){
    let regex = /^[a-zA-Z0-9_]+$/g;
    return (regex.test(fileName));
};


//URL must conatin https:// to be navigatable
function ValidateURL(URLTest){
  if (URLTest.includes('https://')) {
    return true;
  };
};


//gets all selected checkmarks and clears all after submiting
function getCheckmarks(){
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  checkboxes.forEach((checkbox) => {
    checkboxValues.push(checkbox.value);
    checkbox.checked = false;
  });
};


//displays alert box
function Alert(alertText){
  alertContent.innerHTML = alertText;
  alertBackground.style.display = 'flex';
  alertBox.style.display = 'flex';
  const alertOk = () => {
    clearForms();
  };
  alertBtn.onclick = alertOk;
  return;
};


//displays confirmation box
function Confirm(confirmText){
  confirmContent.innerHTML = confirmText;
  alertBackground.style.display = 'flex';
  confirmBox.style.display = 'flex';
};


//clears all forms, checkmarks and closes all dropdown menus
function clearForms(){
  alertBackground.style.display = 'none';
  alertBox.style.display = 'none';
  confirmBox.style.display = 'none';
  projectName.value = '';
  projectWebsite.value = '';
  fileTitleRef.value = '';
  videoURLRef.value = '';
  fileInput.value = '';
  getCheckmarks();
};



//checks to see if the file or URL has already been uploaded to the database if not then uploads file 
async function TestForExistingFileandUpload(URL, uploadFile){
  const projects = await getDocs(collection(db, "Projects")); 
  const projectName = [];
  let flag = false;
  let URLtest = [];
  let shouldSkip = false;
  
  projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;    
    projectName.push(projectNameRef);
  });
  
  projectName.forEach((collectionRef)=>{
    async function getfileRef(){
      const snapshotRef = doc(db, "Projects", collectionRef);
      const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));     
      //checks each file's url on database
      docSnapshot.forEach((Snapshot)=>{
        const file = Snapshot.data() 
        if (URL == file.fileURL){
          flag = true;
          URLtest.push(flag);
        } else{
          flag = false;
          URLtest.push(flag);
        } 
      })
      return URLtest;
    }
      
    getfileRef().then((result)=>{
      //if file exists from the check alerts that already exists otherwise if doesn't exist then uploads file
      //once uploaded or alerted will break loop as file has already been uploaded or the file aready exists 
      if (shouldSkip) {
        return;
      }
      if (result.includes(true)){
        Alert('File already exists! Please choose a differant one!');
        shouldSkip = true;
      }else{
        uploadFile();
        shouldSkip = true;
      }
    })
  })
}



//Displays all of the file information before uploading
function checkFileToBeUploaded(URL, fileName, fileTitle){
  getCheckmarks();
  uploadForm.style.display = 'none';
  confirmPage.style.display = 'flex';

  let URLToDisplay = null;
  const projectName = projectList.value;
  const docType = documentType.value;
  const buildingType = buildingTypes.value;
  const tags = [projectName, docType, buildingType, checkboxValues];
  //converts tags to a single array, removes empty elements from all element, and filters to be displayed properly
  const tagsToUpload=[].concat.apply([], tags);
  const filteredTagsToUpload = tagsToUpload.filter(Boolean); 
  const filteredTagsToDisplay = filteredTagsToUpload.join(', ');

  //verifies valid URL
  if (files[0]==undefined){
    if (!ValidateURL(URL)){
      Alert(`URL must conatin https:// at the begining!`);
      return;
    }
    URLToDisplay = URL;
  } else {
    URLToDisplay = fileURL;
  };

  //verifies file title
  if(!(fileTitleRef.value)){
    Alert('Please add a Title for the file!');
    return;
  };
  
  
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
    uploadForm.style.display = 'block';
    confirmPage.style.display = 'none';
    checkboxValues.length = 0;
    clearForms();
    return;
  }
  cancelBtn.onclick = cancel;  
}







/********************************************function for uploading files to Cloud Storage and video url to Database*********************************************/


async function Upload(e){
  e.preventDefault();
  

  //verifies and validates files to be uploaded and file title/URL
  if(projectList.value == 0){
    Alert('Please add a project');
    document.getElementById('btnUpload').disabled = true;
    return;
  }

  if (!ValidateFileTitle(fileTitleRef.value)){
    Alert(`File title can't contain a forward slash!`);
    return;
   }

   if((files[0]==undefined) && (videoURLRef.value == '')){
    Alert('Please add a file or video URL to be uploaded!');
    return;
  }
 
  if(!(files[0]==undefined) && !(videoURLRef.value == '')){
    Alert('There can be only one or the other! Either a Video url or a file to upload!')
    return;
  }
  
  
  if (files[0]==undefined){
    let videoURL = videoURLRef.value;
    //opens confirmation page, and saves the data  
    //with URL to the database on clicking the okay button 
    const okay = async (fileTitle) => {
      uploadForm.style.display = 'block';
      confirmPage.style.display = 'none';
      saveFileURLtoDB(videoURL, videoURL, fileTitle); //see below
      loadingElement.style.visibility = 'visible';
    } 
    okBtn.onclick = okay.bind(okBtn, fileTitleRef.value);
    checkFileToBeUploaded(videoURL, videoURL, fileTitleRef.value);

  } else {
    //opens confirmation page, and uploads the file to the firebase storage then saves  
    // the data to the database on clicking the okay button 
    
    //validates file name
    let fileName = files[0].name;
    let fileNameOnly = GetFileName(files[0])
    if (!ValidateFileName(fileNameOnly)){
      Alert(`File name can't contain spaces or any special characters, except for Underscore!`);
      return;
    }

    const okay = async (fileTitle) => {
      uploadForm.style.display = 'block';
      confirmPage.style.display = 'none';
      let fileToUpload = files[0];
      const storageRef = sRef(storage, 'Files/'+ fileName);
      
      //forSecurityAuth metadata added for simplified firebase storage rules to allow uploading  
      const metaData = {
        contentType: fileToUpload.type,
        customMetadata: {forSecurityAuth: '*qUD2VR19SRIA23#-:Rk4^r'},
      };

      
      getDownloadURL(storageRef).then(
        //checks to see if file is already in the firebase storage
        () => {
          Alert('File already exists! Please choose a differant one!');
          clearForms()
          return;
        },
        () => {
          //uploades file to the storage and displays progress bar untill file is uploaded 
          const uploadTask = uploadBytesResumable(storageRef, fileToUpload, metaData);

          uploadTask.on('state-changed', (snapshot) => {
              let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              progressIndicator1.innerHTML = 'Uploaded: ' + progress + '%';
              progressIndicator2.style.display = 'block';
              progressIndicator2.value =  progress;
              
              setTimeout(function(){
                progressIndicator1.innerHTML = '';
                progressIndicator2.style.display = 'none';
              }, 2100);
            },
            (error) => {
              Alert('error: file not uploaded!');
            },
            ()=>{
              //gets the URL location of the file once stored on the firebase storage and 
              //adds it to the rest of the data uploaded to the database
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{  
                saveFileURLtoDB(downloadURL, fileName, fileTitle); //see below
              })
            }
          );
        }).catch((error)=>{
          Alert('File not uploaded, error: '+ error)
          return;
      });
    }
    //opens confirmation page, and saves the data  
    //with file location to the database on clicking the okay button  
    okBtn.onclick = okay.bind(okBtn, fileTitleRef.value);
    checkFileToBeUploaded(fileName, fileName, fileTitleRef.value);
  }

};

uploadForm.onsubmit = Upload;
  

  



  

/*******************************************************************Functions for Database****************************************************************/


//gets a list of projects and populates project lists where aplicable
async function getProjectNameList() {
  projectList.innerHTML = '';
  deleteFileFromProject.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, "Projects"));
  
  querySnapshot.forEach((doc) => {
    let projectNameDocument = doc.data().ProjectName;     
    projectList.innerHTML += `<option value=${projectNameDocument}>${projectNameDocument}</option>`;
    deleteFileFromProject.innerHTML += `<option value=${projectNameDocument}>${projectNameDocument}</option>`;
  });
};

window.onload = () => {
  getProjectNameList();
};





//Adds a project name and website to the Database
async function addProjectName()  {
  const projectNameUpload = projectName.value;
  const projectWebsiteUpload = projectWebsite.value;
  const ref = doc(db, "Projects", projectNameUpload);
  const docSnapshot = await getDoc(doc(db, "Projects", projectNameUpload));
 
  
  //validates project name and website and checks to see if it already exists
  if(!ValidateProjectName() || projectNameUpload == ''){
    Alert(`Project name can't contain "spaces", ".", "#", "$", "[", or "]"`);
    return;
  }else if (projectWebsiteUpload == ''){
    Alert ('Please add a Project Website');
    return;
  }

  if(docSnapshot.exists()){
    Alert('Project already exists, Please enter another name!');
  } else {

  //opens confirmation page then oploads on confirmation.
  //forSecurityAuth added for simplified firebase firestore rules to allow uploading  
  Confirm("<h4>Project to be added: </h4>" + "<br/>" + projectNameUpload + "<br/>" + projectWebsiteUpload)
    confirmOk.addEventListener('click', async () => {
        await setDoc(ref, {
            ProjectName: projectNameUpload,
            ProjectURL: projectWebsiteUpload,
            forSecurityAuth: '*qUD2VR19SRIA23#-:Rk4^r'
          },
          {
            merge: true
          }
        )
        .then(()=>{
          clearForms();
          Alert(projectNameUpload + ' was added');
        })
        .catch((error)=>{
          clearForms();
          Alert("Project was not added: " + error)
        })
    })
    //refreshes project list on other pages 
    getProjectNameList();
  }
  confirmCancel.addEventListener('click', () => {
    clearForms();
  })
};

createProject.onclick = addProjectName;






//Takes all the data including url referance to be uploaded to database after checking if the file already exists
async function saveFileURLtoDB (URL, fileName, fileTitle){
  getCheckmarks()
  const projectName = projectList.value;
  const docType = documentType.value;
  const buildingType = buildingTypes.value;
  const tags = [projectName, docType, buildingType, checkboxValues];
  const ref = doc(db, "Projects", projectName);
  const fileRef = doc(ref, projectName, fileTitle)
  const snapshotRef = doc(db, "Projects", projectName);
  const docSnapshot = await getDoc(doc(snapshotRef, projectName, fileTitle))
  //converts tags to a single array, removes empty elements from all element
  const tagsToUpload=[].concat.apply([], tags);
  const filteredTagsToUpload = tagsToUpload.filter(Boolean); 
  
  async function uploadFile(){
    if(docSnapshot.exists()){
      Alert('This Title already exists, Please enter another Title name!')
      return

    } else {
      //forSecurityAuth added for simplified firebase firestore rules to allow uploading 
      await setDoc(fileRef, {
        fileTitle: fileTitle,
        fileName:fileName,
        fileURL: URL,
        documentType: docType,
        tags: filteredTagsToUpload,
        forSecurityAuth: '*qUD2VR19SRIA23#-:Rk4^r'
      })
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
  }

 await TestForExistingFileandUpload(URL, uploadFile)
}











/************************************************************Functions for deleteing files****************************************************************/


async function deleteFiles () {
  /*gets each file and adds each file to the delete menu. with a delete button for each file 
  while the counter is to differentiate between each file in the code */
  filestoBeDeleted.innerHTML = '';
  const projectName = deleteFileFromProject.value;
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
 
  for (var i = 0; i < deleteBtns.length; i++) {
    /*for each delete button, gets location of files that are not URLs. When clicking a delete button brings up a 
    confirmation window, on confirm deletes database reference and file from storage in aplicable, if not  then 
    just logs that it is an URL and no need to let the user know. Otherwise just cancels back to delete menu. 
    Clearing the forms is so that it updates the delete list after removing the file*/
    const fileContainer = await document.getElementById('deleteFileContainer'+[i]);
    const fileTitle = await document.getElementById('dataContent'+[i]).innerHTML;
    let fileRef = fileRefs[i];
    let fileName = fileNames[i];
    const storageRef = sRef(storage, 'Files/' + fileName);
  
    deleteBtns[i].onclick =  async function() { 
      Confirm("Delete: " + fileTitle)

      confirmOk.addEventListener('click', async () => {
          clearForms();
        //deletes Database entry and file reference    
          await deleteDoc(fileRef)
          .then(()=>{
            Alert('File Deleted')
            fileContainer.remove() 
          })
          .catch((error)=>{
            Alert('Deletion Unsuccessful, error: '+ error)
            return;
          })
          
          //deletes actual file from database storage
          getDownloadURL(storageRef).then(
            () => {
              deleteObject(storageRef)
            },
            () => {
              console.log("File to be deleted is a URL!");
              return;
            })
            .catch((error)=>{
              Alert('Deletion of storage file Unsuccessful, error: '+ error)
              return;
          })
      })

      confirmCancel.addEventListener('click', () => {
        clearForms();
      })
    }
  }
}    