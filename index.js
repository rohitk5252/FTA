const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileInput = document.querySelector("#fileInput");

const progressContainer = document.querySelector(".progress-container");
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar")

const sharingContainer = document.querySelector(".sharing-container");
const fileURLInput = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copyBtn");

const host = "https://innshare.herokuapp.com/"
const uploadURL = `${host}api/files`;
// const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }
  
});

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.table(files);
    console.log(e.dataTransfer.files.length);
    if(files.length){
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", ()=>{
    uploadFile();
});

browseBtn.addEventListener("click", ()=>{
    fileInput.click();
});

copyBtn.addEventListener("click", (e)=>{
    fileURLInput.select();
    // .execCommand is depricated
    document.execCommand("copy");
});

const uploadFile = () => {
    progressContainer.style.display = "block";
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);
    const xhr = new XMLHttpRequest();
    // jab event change (finissh , stop , start) hota hai to hume state milta hai 
    xhr.onreadystatechange = () => {
        if(xhr.readyState==XMLHttpRequest.DONE){
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;
    // 1:10 

    xhr.open("POST", uploadURL);
    xhr.send(formData)
};

const updateProgress = (e)=>{
    const percent = Math.round((e.loaded/e.total)*100); 
    // console.log(percent);
    bgProgress.style.width = `${percent}%`;
    // 1:15:44
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`;
};

//      TESTING ----------------- TESTING

// for(i=0;i<=100;i++){
//     const percent = i;
//     bgProgress.style.width = `${percent}%`
//     percentDiv.innerText = percent;
//     progressBar.style.transform = `scaleX(${percent/100})`;
// }  
 

   

const showLink = ({file: url})=>{
    console.log(url);
    // hide progress bar after upload 
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";

    fileURLInput.value = url;
}

//  showLink("cskbwkbilshodciilcbilswbdlicbildilb");