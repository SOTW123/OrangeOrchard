document.getElementById("imageInput").addEventListener("change", async () => {
  const fileInput = document.getElementById("imageInput");
  const resultText = document.getElementById("result");

  if (fileInput.files.length === 0) {
    resultText.innerText = "Please upload an image.";
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const imageDataUrl = event.target.result.split(",")[1]; // Get base64 part

    console.log("VISION");
    const VISION_KEY = import.meta.env.VITE_VISION;
    console.log(VISION_KEY);
    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: imageDataUrl,
                },
                features: [
                  {
                    type: "LABEL_DETECTION",
                    maxResults: 10,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      const labels = data.responses[0].labelAnnotations.map(
        (label) => label.description
      );

      if (labels.includes("Orange")) {
        resultText.innerText = "Yes, this image contains an orange!";
      } else {
        resultText.innerText = "No, this image does not contain an orange.";
      }
    } catch (error) {
      resultText.innerText = "Error: " + error.message;
    }
  };

  reader.readAsDataURL(file);
});
document.addEventListener("keydown", (event) => {
  if (event.code == "Escape") {
    window.location.href = "/";
  }
});
