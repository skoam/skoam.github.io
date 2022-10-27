function useExisting() {
    filesSelected();
}

function filesSelected() {
    buttonFileUpload.disabled = true;
    buttonUseExisting.disabled = true;

    currentFileIndex = 0;
    readNextFile();
}

function readNextFile() {
    if (buttonFileUpload.files[currentFileIndex]) {
        reader.readAsDataURL(buttonFileUpload.files[currentFileIndex]);
        currentFileIndex++;
    } else {
        allImagesLoaded();
    }
}

function initializeFileReader() {
    reader.addEventListener("load", () => {
        images.push(reader.result);
        readNextFile()
    }, false);
}

function allImagesLoaded() {
    printContainer.style.display = "";
    uploadContainer.style.display = "none";

    for (var i = 0; i < 9; i++) {
        var container = document.getElementById("image_" + (i + 1));

        if (!container) {
            continue;
        }

        if (i + 1 > images.length) {
            container.style.backgroundImage = "none";
            continue;
        }

        var image = images[i];

        container.style.backgroundImage = "url(" + image + ")";

        if (settingFillBorders.checked) {
            container.className = container.className + " inner-shadow";
        }
    }
}

function hideUploadContainer() {
    printContainer.style.display = "";
    uploadContainer.style.display = "none";
}

var currentFileIndex = 0;
var images = new Array();

var printContainer = document.getElementById("print-container");
var uploadContainer = document.getElementById("upload-container");
var settingFillBorders = document.getElementById("fill-borders");
var buttonUseExisting = document.getElementById("use-existing");

var reader = new FileReader();
initializeFileReader();

var buttonFileUpload = document.getElementById("files");
buttonFileUpload.onchange = filesSelected;