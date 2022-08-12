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

const emailForm = document.querySelector("#emailForm");

const toast = document.querySelector(".toast");

const host = "https://innshare.herokuapp.com/"
const uploadURL = `${host}api/files`;
const emailURL = "${host}api/files/send";
// const uploadURL = `${host}api/files`;

const maxAllowedSize = 100*1024*1024; // 100mb

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
    console.log(e);
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.table(files);
    console.log(e.dataTransfer.files.length);
    if(!files.length){
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
    showToast("Link Copied!")
});

const uploadFile = () => {
    

    if(fileInput.files.length >1){
        resetFileInput();
        showToast("Only Upload 1 File");
        return;
    }
    const file = fileInput.files[0];

    if(file.size>maxAllowedSize){
        showToast("Can't upload more than 100MB");
        resetFileInput();
        return;
    }
    progressContainer.style.display = "block";


    const formData = new FormData();
    formData.append("myfile", file);
    const xhr = new XMLHttpRequest();
    // jab event change (finissh , stop , start) hota hai to hume state milta hai 
    xhr.onreadystatechange = () => {
        if(xhr.readyState==XMLHttpRequest.DONE){
            // console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;
    // 1:10 
    xhr.upload.onerror = () => {
        resetFileInput();
        // console.log(xhr.statusText);
        showToast(`Error in upload: ${xhr.statusText}`);
    }

    xhr.open("POST", uploadURL);
    xhr.send(formData);
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
 
const resetFileInput = () => {
    fileInput.value = "";
}
   

const showLink = ({file: url})=>{
    console.log(url);
    emailForm[2].Attribute("disabled","true");
    resetFileInput();
    // hide progress bar after upload 
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";

    fileURLInput.value = url;
};

emailForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log("submitted");
    const url = fileURLInput.value;
    // const url = "uru.gn/dec.ac.in/21_22/my/jbbjbjbjb/";

    const formData = {
        uuid: url.split("/").splice(-1,1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value
        // emialFrom not showing while cosole.table(formData) 2:23
    };
    // console.log(formData.emailFrom)
    // console.count(formData);
    emailForm[2].setAttribute("disabled","true");
    fetch(emailURL, {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then(res => res.json())
      .then(({success}) => {
        if(success){
            sharingContainer.style.display = "none";
            showToast("Email Sent!");
        }
    });   

});
//   showLink("cskbwkbilshodciilcbilswbdlicbildilb");

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%,0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{
    toast.style.transform = "translate(-50%,60px)";
    
    },2000);
};