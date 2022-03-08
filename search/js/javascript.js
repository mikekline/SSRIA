/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  
  import {getDatabase, ref, set, child, get, update, remove, orderByChild, equalTo, query} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query as store, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"
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
const projectWebsite = document.getElementById('projectWebsite');
const projectList = document.getElementById('projects');
const fileInput = document.getElementById('file');
const getDataForm = document.getElementById('getDataForm');
const progressIndicator = document.getElementById('progress');
const documentType = document.getElementById('documentType');
const container = document.getElementById('container');
const btSelectBox = document.getElementById('btSelectBox');
const checkboxesDropdown = document.getElementById("checkboxes");
const websiteRef = document.getElementById("websites");

const displayData = document.getElementById("displayData");
const displayData2 = document.getElementById("displayData2");

/*********************************************************Selections and Helpers***************************************************************/





              
          






/*********************************************Functions for Realtime Database********************************************************/

async function getData (e) {
  e.preventDefault();
 
  const projects = await getDocs(collection(db, "Projects"));
  const projectName = [];
  
  container.style.display = 'flex';
  displayData.innerHTML = '';
  websiteRef.innerHTML = '';

   projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;     
    projectName.push(projectNameRef);
  })
  
  
 


  
 
  
   
  projectName.forEach((collectionRef)=>{
    async function getFileName(){
      const snapshotRef = doc(db, "Projects", collectionRef);
      const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));
      
      
  
  
  
      
      docSnapshot.forEach((documentRef)=>{
        const file = documentRef.data();
        const fileName = [];
        const fileURL = [];
        const checkboxValues = [];
        const websiteURL = [];
        let result = false;
        
        
        
        const dType = documentType.value;
        //havn't gotten document type yet
        let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');



        checkboxes.forEach((checkbox) => {
          checkboxValues.push(checkbox.value);
        });
       
        if(checkboxValues.length===0){
          result = false;
        }else {
          result = checkboxValues.every( (checkmarks)=>{
          return file.tags.includes(checkmarks);
          });
        };


        if (result === true){
          fileName.push(file.fileName);
          fileURL.push(file.fileURL);
          
         
          async function websites(){
            const website = await getDoc(snapshotRef)
            websiteURL.push(website.data().ProjectURL)
            
            // const updatedWebsiteURL = new Set();
            // let reduceArray = [...websiteURL] 
            // updatedWebsiteURL.add(reduceArray);

            
            // updatedWebsiteURL.forEach((websiteUrlValue)=>{
              websiteRef.innerHTML += `<a id='webURL' href='${websiteURL}' target="_blank" rel="noopener noreferrer">${websiteURL}</a>`;
            // })
            
          }
          websites()
         
        } else {
          return;
        }
    
     
        
        displayData.innerHTML += `<a id='data' href='${fileURL}' target="_blank" rel="noopener noreferrer">${fileName}</a>`;
        displayData2.innerHTML += `<a id='data' href='${fileURL}' target="_blank" rel="noopener noreferrer">${fileName}</a>`;
      })
    }
  getFileName();  
  })
};



getDataForm.onsubmit = getData;

console.log(websiteRef)

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
  







