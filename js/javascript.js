/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import { getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

  import {getDatabase, ref, set, child, get, update, remove} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";


/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {

   REDACTED

  };


/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const realdb = getDatabase();




/**************************************************Variables, Referances and EventListeners*********************************************/ 


let files = [];
let fileNameOnly = [];
const createProject = document.getElementById('addProject');
const projectName = document.getElementById('projectName');
const projectWebsite = document.getElementById('projectWebsite');
const projectList = document.getElementById('projects');
const fileInput = document.getElementById('file');
const uploadForm = document.getElementById('uploadForm');
const progressIndicator = document.getElementById('progress');

fileInput.addEventListener("change", (e) => {
  files = e.target.files; 		
});




/*********************************************************selections********************************************************************/


function GetFileName(file) {
  let temp = file.name.split('.');
  let fname = temp.slice(0,-1).join('.')
  return fname
}




/*********************************************Uploading files to Cloud Storage********************************************************/


async function Upload(e){
  e.preventDefault();

  let fileToUpload = files[0];
  let fileName = files[0].name;
  fileNameOnly = GetFileName(files[0]);


  const metaData = {
    contentType: fileToUpload.type
  };


  const storage = getStorage();

  const storageRef = sRef(storage, 'Files/'+ fileName);

  const uploadTask = uploadBytesResumable(storageRef, fileToUpload, metaData);



  uploadTask.on('state-changed', (snapshot) => {
    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    progressIndicator.innerHTML = "Uploaded: " + progress + "%"
    },
    (error) => {
      alert("error: file not uploaded!");
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        //gettting file url 
        saveFileURLtoRealTimeDB(downloadURL, fileName);
      })
    }
  );
};

uploadForm.onsubmit = Upload;




/*********************************************Functions for Realtime Database********************************************************/


function getProjectNameList() {
  let dbRef = ref(realdb);
  
  get(child(dbRef, "Projects/")).then((snapshot)=>{
    snapshot.forEach((node)=>{
      let projectNameNode = node.val().ProjectName;
      projectList.innerHTML+= `<option value=${projectNameNode}>${projectNameNode}</option>`;
    })
  });  
};


window.onload = () => {
  getProjectNameList();
};


function addProjectName(e)  {
  let projectNameUpload = projectName.value;
  let projectWebsiteUpload = projectWebsite.value;

  update(ref(realdb, "Projects/"+ projectNameUpload),{
    ProjectName: projectNameUpload,
    ProjectURL: projectWebsiteUpload
  });
  
  getProjectNameList();
};


function saveFileURLtoRealTimeDB (URL, fileName){
  let pName = projectList.value
  
  update(ref(realdb,`Projects/${pName}/${fileNameOnly}`),{
    fileName:fileName,
    fileURL: URL,
    tags:""
  });
}



createProject.onsubmit = addProjectName;