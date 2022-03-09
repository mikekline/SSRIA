/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  import { getStorage, ref as sRef, uploadBytes, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js";

  import {getDatabase, ref, set, child, get, update, remove} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"

/****************************************** web app's Firebase configuration***********************************************************/ 

  const firebaseConfig = {
REDACTED

  };
  

/****************************************************Initialize Firebase****************************************************************/ 

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);

  const realdb = getDatabase();

  const db = getFirestore();


/**************************************************Variables, Referances and EventListeners*********************************************/ 


let files = [];
let counter = 0;
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
const videoURL = document.getElementById('videoURL');
const btSelectBox = document.getElementById('btSelectBox');
const checkboxesDropdown = document.getElementById("checkboxes");

fileInput.addEventListener("change", (e) => {
  files = e.target.files; 		
});


projectButton

/*********************************************************Selections and Helpers***************************************************************/


function GetFileName(file) {
  if(file){
    let temp = file.name.split('.');
    let fname = temp.slice(0,-1).join('.')
    return fname
  } 
}


//Project name can't contain "spaces", ".", "#", "$", "[", or "]"
function ValidateName(){
  let regex = /[\.#$\s\[\]]/
  return !(regex.test(projectName.value));
}



/*************************************Uploading files to Cloud Storage and video url to Database*********************************************/


async function Upload(e){
  e.preventDefault();
  let fileName ='';
  let fileToUpload = '';
  let fileNameOnly = '';
  let pName = projectList.value;
  
  
  if(projectList.value == 0){
    alert('Please add a project');
    document.getElementById("btnUpload").disabled = true;
    return;
  }
 
  
  if (files[0]==undefined){
    let dbRef = ref(realdb);
    

    const querySnapshot = await getDoc(doc(db, "Projects", pName));
    if (querySnapshot.exists()) {
      counter = querySnapshot.data().counter;     
      counter++ 
      //bug: adds to counter when file already exists 
    } else {
      alert('An error occurred, Please try again!');
      return;
    }
    
    
    




  //   get(child(dbRef, "Projects/" + pName)).then((snapshot)=>{
  //     counter = snapshot.val().counter; 
  //     counter++
  //  })
  //  .then(()=>{
      fileName = 'video' + counter;
      fileNameOnly = 'video' + counter;
      let vURL = videoURL.value;

      const projectRef = doc(db, "Projects", pName);
      await updateDoc(projectRef, {
        counter: counter
      })
      .catch((error) =>{
        alert('An error occurred, did not upload: '+ error);
        return;
      });

      
      // update(ref(realdb, "Projects/"+ pName),{
      //   counter: counter
      // });

      saveFileURLtoDB(vURL, fileName, fileNameOnly);
  //  }) 
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
          
            saveFileURLtoDB(downloadURL, fileName, fileNameOnly);
          
        })
      }
    );
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



  // let dbRef = ref(realdb);
  
  // get(child(dbRef, "Projects/")).then((snapshot)=>{
  //   snapshot.forEach((node)=>{
  //     let projectNameNode = node.val().ProjectName; 
  //     projectList.innerHTML+= `<option value=${projectNameNode}>${projectNameNode}</option>`;
  //   })
  // });  
};




window.onload = () => {
  getProjectNameList();
};




 async function addProjectName()  {
  let projectNameUpload = projectName.value;
  let projectWebsiteUpload = projectWebsite.value;
  const ref = doc(db, "Projects", projectNameUpload);
  const docSnapshot = await getDoc(doc(db, "Projects", projectNameUpload));

  if(!ValidateName() || projectNameUpload == ''){
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

      
    // update(ref(realdb, "Projects/"+ projectNameUpload),{
    //   ProjectName: projectNameUpload,
    //   ProjectURL: projectWebsiteUpload,
    //   counter: 0
    // });
    
    getProjectNameList();
  }
};

createProject.onclick = addProjectName;



async function saveFileURLtoDB (URL, fileName, fileNameOnly){
  const pName = projectList.value;
  const dType = documentType.value;
  const values = []
  const tags = [dType, pName, values];
  const ref = doc(db, "Projects", pName);
  const fileRef = doc(ref, pName, fileNameOnly)
  const snapshotRef = doc(db, "Projects", pName);
  const docSnapshot = await getDoc(doc(snapshotRef, pName, fileNameOnly))
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked')

  
  checkboxes.forEach((checkbox) => {
    values.push(checkbox.value);
  });
  

  const tagsToUpload=[].concat.apply([], tags);
  
  if(!(URL)){
    alert("Please add a file or video url to be uploaded!");
    return;
  }
  

 
  if(docSnapshot.exists()){
    alert('File already exists, Please enter another name!')
  } else {

    await setDoc(fileRef, {
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
  // update(ref(realdb,`Projects/${pName}/${fileNameOnly}`),{
  //   fileName:fileName,
  //   fileURL: URL,
  //   tags: tagsToUpload
  // });

  // const ref = doc(db, "Projects", projectNameUpload);

  // checkboxes = false;
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

btSelectBox.onclick = showCheckboxes;