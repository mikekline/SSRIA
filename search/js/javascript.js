/***************************************Import the functions you need from the SDKs you need**********************************************/ 
	
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
	
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

  
  import {getDatabase, ref, set, child, get, update, remove, orderByChild, equalTo, query} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

  import {getFirestore, doc, getDoc, getDocs, setDoc, collection, addDoc, updateDoc, deleteDoc, query as store, where, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"
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

  const realDB = getDatabase();

  const db = getFirestore();


/**************************************************Variables, Referances and EventListeners*********************************************/ 


let files = [];
let expanded = false;


const getDataForm = document.getElementById('getDataForm');
const resultsBtn = document.getElementById('resultsBtn');
const websiteContainer = document.getElementById('websiteContainer');
const loadingElement = document.getElementById('loading');

const results = document.getElementById('results');
const websiteRef = document.getElementById("websites");
const displayData = document.getElementById("displayData");

const documentTypeSelectBox = document.getElementById('documentTypeSelectBox');
const documentTypeCheckboxes = document.getElementById("documentTypeCheckboxes");
const buildingTypologySelectBox = document.getElementById('buildingTypologySelectBox');
const buildingTypologycheckboxes = document.getElementById("buildingTypologycheckboxes");
const documentTypeAll = document.getElementById("documentTypeAll");
const documentType = document.getElementsByName("documentType");
const buildingTypologyAll = document.getElementById("buildingTypologyAll");
const buildingTypology = document.getElementsByName("buildingTypology");


documentTypeAll.addEventListener("change", () =>{
  documentType.forEach((element)=>{
    element.checked = documentTypeAll.checked;
  })
})

buildingTypologyAll.addEventListener("change", () =>{
  buildingTypology.forEach((element)=>{
    element.checked = buildingTypologyAll.checked;
  })
})

/*********************************************************Selections and Helpers***************************************************************/





async function getProjects(){
  const projects = await getDocs(collection(db, "Projects")); 
  return projects
}

async function getProjectNames(){
  const projectName = [];
  const projects = await getProjects()

  projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;     
    projectName.push(projectNameRef);
  })

  return projectName;
}



async function fileName(e){
  e.preventDefault();
  const eachProject = await getProjectNames()
  const fileRef = []
  let includeFile = []

  getDataForm.style.display = 'none';
  results.style.display = 'flex';
  websiteContainer.style.visibility = "visible";
  displayData.innerHTML = '';




  const checkboxValues = [];
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

  checkboxes.forEach((checkbox) => {
    checkboxValues.push(checkbox.value);
    checkbox.checked = false
  });


  console.log(includeFile)



    eachProject.forEach((collectionRef)=>{
      async function getfileRef(){
        const snapshotRef = doc(db, "Projects", collectionRef);
        const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));
        
        // fileRef.push(docSnapshot)
        docSnapshot.forEach((Snapshot)=>{
          const file = Snapshot.data()
          // fileRef.push(Snapshot.data().fileName);

          let result = false;
        const test=[]
         
          // console.log(test)
          console.log(file.fileName+includeFile.indexOf(file.fileName))
         
          if(checkboxValues.length===0){
            result = false;
          }else {
            result = checkboxValues.forEach( (checkmarks)=>{
               if(file.tags.includes(checkmarks)){


                if(includeFile.indexOf(file.fileName) == -1) {
                  includeFile.push(file.fileName)
                  displayData.innerHTML += `<a id='data' href='${file.fileURL}' target="_blank" rel="noopener noreferrer">${file.fileName}</a>`;
                } else {
                  return;
                }


                  
                
                 
                 
                  
                // console.log(file.fileName)
                // displayData.innerHTML += `<a id='data' href='${file.fileURL}' target="_blank" rel="noopener noreferrer">${file.fileName}</a>`;
               }else{
                 return;
               };
            });
          };

        

        })
        
      }
      getfileRef()
    })

   

  return fileRef;
}


getDataForm.onsubmit =fileName;

// fileName().then(()=>{
     
// })



// async function queryFile(){
 
//   let fileRef = await fileName()
//   let websiteURL = new Set();






// fileRef.forEach((test)=>{
//   console.log('test')
// })
// return fileRef
// }
// queryFile().then(()=>{
//   let a= fileRef.length

// console.log(a)
// })

// getDataForm.onsubmit = queryFile;























// let websiteURL = [];    
          

//     async function websites(snapshotRef){
//             const website = await getDoc(snapshotRef)
//             websiteURL.push(website.data().ProjectURL)
            
//             // const updatedWebsiteURL = new Set();
//             // let reduceArray = [...websiteURL] 
//             // updatedWebsiteURL.add(webCollection);
            
//             console.log(websiteURL)
//             // updatedWebsiteURL.forEach((websiteUrlValue)=>{
//               websiteRef.innerHTML += `<a id='webURL' href='${websiteURL}' target="_blank" rel="noopener noreferrer">${websiteURL}</a>`;
//             // })
           
//           }

//           fileName.forEach((file)=>{
      
//             websites(snapshotRef)
//           })

/*********************************************Functions for Realtime Database********************************************************/


async function getData (e) {
  e.preventDefault();
  loadingElement.style.visibility = 'visible';
  const projects = await getDocs(collection(db, "Projects"));
  const projectName = [];
  
  getDataForm.style.display = 'none';
  results.style.display = 'flex';
  websiteContainer.style.visibility = "visible";
  displayData.innerHTML = '';
  // websiteRef.innerHTML = '';

   projects.forEach((documentRef) => {
    const projectNameRef = documentRef.data().ProjectName;     
    projectName.push(projectNameRef);
  })
  
  
 


        const checkboxValues = [];
        let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

        checkboxes.forEach((checkbox) => {
          checkboxValues.push(checkbox.value);
          checkbox.checked= false
        });
 
  
        
        
        let websiteURL = new Set();



        //  const updatedWebsiteURL = new Set();
        //      let reduceArray = [...test] 
        //      updatedWebsiteURL.add(reduceArray);
        // console.log(updatedWebsiteURL)  ****************** needs a foreach   ****************
        //flaten first??????????? dedupe??????
        //otherwise, [1, 2] != [2, 1] from a set point of view
   
  projectName.forEach((collectionRef)=>{
    async function getFileName(){
      const snapshotRef = doc(db, "Projects", collectionRef);
      const docSnapshot = await getDocs(collection(snapshotRef, collectionRef));
      const website = await getDoc(snapshotRef)
      
  
      
       docSnapshot.forEach((documentRef)=>{
        const file = documentRef.data();
        const fileName = [];
        const fileURL = [];
        
        
        // console.log(websiteURL)
        let result = false;
       
      
       
        console.log(checkboxValues)
        
       
        if(checkboxValues.length===0){
          result = false;
        }else {
          result = checkboxValues.every( (checkmarks)=>{
          return file.tags.includes(checkmarks);
          });
          
        };
      
        // let result = false;
       
        // const test=[]
         
        //   console.log(test)
          
         //*************************usethis below to get to loop like */
        //   if(checkboxValues.length===0){
        //     result = false;
        //   }else {
        //     result = checkboxValues.forEach( (checkmarks)=>{
        //       test.push( file.tags.includes(checkmarks));
        //     });
            
        //   };

        if (result === true){
          fileName.push(file.fileName);
          fileURL.push(file.fileURL);
          
          
          async function websites(){
            
            const website = await getDoc(snapshotRef)
            
            // console.log(websiteURL)
            
            
            
           
            return website
          }
          websites().then((website) =>{
            
             
            websiteURL.add(website.data().ProjectURL)
            

            
             
          })


          displayData.innerHTML += `<a id='data' href='${fileURL}' target="_blank" rel="noopener noreferrer">${fileName}</a>`;
          
       
        } else {
         return;
        }
         
       
       
        
      })
      //here = soemthing diferant than in then
      // websiteURL.push(website.data().ProjectURL)


    }
  getFileName()

  
  
  })
  
    console.log(Object.keys(websiteURL))  
   

//    var size=  Object.keys(websiteURL).length;

// console.log(await size)


//  console.log(  websiteURL)


// for (let i = 0; i < websiteURL.length; i++) {
//   console.log('test')
//   const letter = await websiteURL[i];
//    console.log( letter)
// }



// async function deDuplicate(data) {

//   for await (const value of data) {
//     console.log(
//       "About to run displayValuesWithWait() process for value ",
//       value
//     );}
// }

// console.log( deDuplicate(websiteURL));
 
    // test.forEach( (websiteUrlValue)=>{
    //   console.log('test')
    //            websiteRef.innerHTML += `<a id='webURL' href='${websiteURL}' target="_blank" rel="noopener noreferrer">${websiteURL}</a>`;
    //           })

  
  setTimeout(function(){
    loadingElement.style.visibility = 'hidden';
  }, 500);
};



getDataForm.onsubmit = getData;

const backToSearch = () =>{
  getDataForm.style.display = 'block';
  results.style.display = 'none';
  websiteContainer.style.visibility = "visible";
}

resultsBtn.onclick = backToSearch;



/*********************************************Function for Dropdown menu checkboxes********************************************************/


function documentTypeSelectBoxShowCheckboxes() {
  
  if (!expanded) {
    documentTypeCheckboxes.style.display = "block";
    expanded = true;
  } else {
    documentTypeCheckboxes.style.display = "none";
    expanded = false;
  }
}

function buildingTypologyShowCheckboxes() {
  
  if (!expanded) {
    buildingTypologycheckboxes.style.display = "block";
    expanded = true;
  } else {
    buildingTypologycheckboxes.style.display = "none";
    expanded = false;
  }
}

documentTypeSelectBox.onclick = documentTypeSelectBoxShowCheckboxes;
buildingTypologySelectBox.onclick = buildingTypologyShowCheckboxes;















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
  







