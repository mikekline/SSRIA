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
let counter = 1;

const createProject = document.getElementById('addProject');
const projectName = document.getElementById('projectName');
const projectWebsite = document.getElementById('projectWebsite');
const projectList = document.getElementById('projects');
const fileInput = document.getElementById('file');
const uploadForm = document.getElementById('uploadForm');
const progressIndicator = document.getElementById('progress');
const documentType = document.getElementById('documentType');
const videoURL = document.getElementById('videoURL');

fileInput.addEventListener("change", (e) => {
  files = e.target.files; 		
});




/*********************************************************selections********************************************************************/


function GetFileName(file) {
  if(file){
    let temp = file.name.split('.');
    let fname = temp.slice(0,-1).join('.')
    return fname
  } 
}



//friday end of day test

// const huh = document.getElementById('check')
// function whatisthis(e){
//   e.preventDefault();
// var res = document.querySelectorAll("#one,#two");
// let test=[];
// res.forEach((check)=>{
//   if (check.checked){
//    test=check.value
  
//   }
//   else{
//     test = ''
    
//   }
//   console.log(test)

// })}
// huh.onsubmit = whatisthis;



/*************************************Uploading files to Cloud Storage and video url to Database*********************************************/


async function Upload(e){
  e.preventDefault();
  let fileName ='';
  let fileToUpload = '';
  let fileNameOnly = '';
  let pName = projectList.value;
  
  
 

 

  
  if (files[0]==undefined){

    let dbRef = ref(realdb);

    get(child(dbRef, "Projects/" + pName)).then((snapshot)=>{
     
     counter = snapshot.val().counter; 
     counter++
   }).then(()=>{
    fileName = 'video' + counter;
    fileNameOnly = 'video' + counter;
    let vURL = videoURL.value;
    saveFileURLtoRealTimeDB(vURL, fileName, fileNameOnly);
    console.log(counter)

    update(ref(realdb, "Projects/"+ pName),{
      counter: counter
    });
   })

    
   
    
  } else {
    fileName = files[0].name;
    fileToUpload = files[0];
    fileNameOnly = GetFileName(files[0]);
  

 


  const metaData = {
    contentType: fileToUpload.type
  };


  const storage = getStorage();

  const storageRef = sRef(storage, 'Files/'+ fileName);

  
  const uploadTask = uploadBytesResumable(storageRef, fileToUpload, metaData);



  uploadTask.on('state-changed', (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressIndicator.innerHTML = "Uploaded: " + progress + "%";
      fileInput.value = '';
    },
    (error) => {
      alert("error: file not uploaded!");
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        
          saveFileURLtoRealTimeDB(downloadURL, fileName, fileNameOnly);
        
      })
    }
  );
  }
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
  //if project list empty prevent subitting of form
};


function addProjectName(e)  {
  let projectNameUpload = projectName.value;
  let projectWebsiteUpload = projectWebsite.value;
  
  if(!ValidateName() || projectNameUpload == ''){
    alert(`Project name can't contain "spaces", ".", "#", "$", "[", or "]"`);
    return;
    }
   

  update(ref(realdb, "Projects/"+ projectNameUpload),{
    ProjectName: projectNameUpload,
    ProjectURL: projectWebsiteUpload,
    counter: 1
  });
  
  getProjectNameList();
 
};


function saveFileURLtoRealTimeDB (URL, fileName, fileNameOnly){
  let pName = projectList.value;
  let dType = documentType.value;

  update(ref(realdb,`Projects/${pName}/${fileNameOnly}`),{
    fileName:fileName,
    fileURL: URL,
    tags: dType
  });

}





//file name can't contain ".", "#", "$", "[", or "]"
function ValidateName(){
  let regex = /[\.#$\s\[\]]/
  return !(regex.test(projectName.value));
  }




createProject.onsubmit = addProjectName;