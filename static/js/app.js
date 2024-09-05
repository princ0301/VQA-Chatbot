// Image preview
document.getElementById("image-upload").onchange = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        var imagePreview = document.getElementById("image-preview");
        imagePreview.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};

// Form submission
document.getElementById("upload-form").onsubmit = function (event) {
    event.preventDefault();

    var formData = new FormData();
    var fileInput = document.getElementById("image-upload");
    var questionInput = document.getElementById("question");

    formData.append("image", fileInput.files[0]);
    formData.append("question", questionInput.value);

    fetch("/ask", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        var answerDiv = document.getElementById("answer");
        if (data.error) {
            answerDiv.innerHTML = "<p>Error: " + data.error + "</p>";
        } else {
            answerDiv.innerHTML = "<p>Answer: " + data.answer + "</p>";
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
};
