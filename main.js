function filesSelected() {
    currentFileIndex = 0;
    readNextFile();
}

function readNextFile() {
    if (files.files[currentFileIndex]) {
        reader.readAsDataURL(files.files[currentFileIndex]);
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

    for (var i = 0; i < images.length; i++) {
        var image = images[i];
        var container = document.getElementById("image_" + (i + 1));

        if (container) {
            container.style.backgroundImage = "url(" + image + ")";

            if (settingFillBorders.checked) {
                container.style.boxShadow = "inset 0px 0px 0px 4px black";
            }
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

var reader = new FileReader();
initializeFileReader();

var files = document.getElementById("files");
files.onchange = filesSelected;