/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  
  import {getDatabase, ref, set, child, get, update, remove, orderByChild, equalTo, query} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"
/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {

    REDACTED

  };
  

/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const realDB = getDatabase();

  const db = getFirestore();


/**************************************************Variables, Referances and EventListeners*********************************************/ 


let files = [];
let expanded = false;


const createProject = document.getElementById('addProject');
const projectName = document.getElementById('projectName');
const projectWebsite = document.getElementById('projectWebsite');
const projectList = document.getElementById('projects');
const fileInput = document.getElementById('file');
const getDataForm = document.getElementById('getDataForm');
const progressIndicator = document.getElementById('progress');
const documentType = document.getElementById('documentType');
const videoURL = document.getElementById('videoURL');
const btSelectBox = document.getElementById('btSelectBox');
const checkboxesDropdown = document.getElementById("checkboxes");





/*********************************************************Selections and Helpers***************************************************************/

  
  





/*********************************************Functions for Realtime Database********************************************************/

async function getData (e) {
  e.preventDefault();
 

//  const que = query(ref(realdb, "Projects"), orderByChild('01_BTW'), equalTo('Residential'))

// get(que).then((snapshot)=>{
//  snapshot.forEach((childSnapshot)=>{
//    console.log(childSnapshot.val()) 
//  })
// })

//  get(child(dbRef, "Projects/03_LGS/video1/tags")).then((snapshot)=>{
//   console.log(snapshot.val())
  
//   snapshot.forEach((node)=>{
//     let test = node.val(); 
//    console.log(test)
//   })
// });

   

};



getDataForm.onsubmit = getData;



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

btSelectBox.onclick = showCheckboxes;















// uploadTask.on('state-changed', (snapshot) => {
//   let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//    progressIndicator.innerHTML = "Uploaded: " + progress + "%";
//   fileInput.value = '';
  
//   setTimeout(function(){
//     progressIndicator.innerHTML = '';
//   }, 2000);
// },
// (error) => {
//   alert("error: file not uploaded!");
// },
// ()=>{
//   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
    
//       saveFileURLtoRealTimeDB(downloadURL, fileName, fileNameOnly);
    
//   })
// }
// );








//function getProjectNameList() {
  //   let dbRef = ref(realdb);
    
  //   get(child(dbRef, "Projects/")).then((snapshot)=>{
  //     snapshot.forEach((node)=>{
  //       let projectNameNode = node.val().ProjectName; 
  //       projectList.innerHTML+= `<option value=${projectNameNode}>${projectNameNode}</option>`;
  //     })
  //   });  
  // };
  
  
  
  
  // function saveFileURLtoRealTimeDB (URL, fileName, fileNameOnly){
  //   const pName = projectList.value;
  //   const dType = documentType.value;
  //   const values = []
  //   const tags = [dType, pName, values];
  //   let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
  
  //   checkboxes.forEach((checkbox) => {
  //     values.push(checkbox.value);
  //   });
    
  //   const tagsToUpload=[].concat.apply([], tags);
    
  //   update(ref(realdb,`Projects/${pName}/${fileNameOnly}`),{
  //     fileName:fileName,
  //     fileURL: URL,
  //     tags: tagsToUpload
  //   });
  //   checkboxes = false;
  // }
  







