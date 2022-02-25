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
const createProject = document.getElementById('addProject');
const projectName = document.getElementById('projectName');
const fileInput = document.getElementById('file');
const uploadForm = document.getElementById('uploadForm');
const progressIndicator = document.getElementById('progress');

fileInput.addEventListener("change", (e) => {
  files = e.target.files; 		
});




/*********************************************Uploading files to Cloud Storage********************************************************/


async function Upload(e){
  e.preventDefault();

  let fileToUpload = files[0];
  let fileName = files[0].name;


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
        console.log(downloadURL)
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
      let projectNameList = node.val().ProjectName;
      console.log(projectNameList)
    })
  });
};


window.onload = () => {
  getProjectNameList();
};



function addProjectName(e)  {
  e.preventDefault();  
  let projectNameUpload = projectName.value;
 
  update(ref(realdb, "Projects/"+ projectNameUpload),{
    ProjectName: projectNameUpload
  });
  
  getProjectNameList();
};

createProject.onsubmit = addProjectName;