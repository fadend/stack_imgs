const filesInput = document.getElementById("files");
const carousel = document.getElementById("carousel");
const imgLink = document.getElementById("img-link");
const canvas = document.getElementById("canvas");
filesInput.addEventListener("change", async function () {
  carousel.innerHTML = "";
  const images = [];
  let loadedCount = 0;
  const expectedCount = filesInput.files.length;
  let allPngs = true;
  for (let i = 0; i < filesInput.files.length; i++) {
    const file = filesInput.files[i];
    if (!/\.png$/i.exec(file.name)) {
      allPngs = false;
    }
    const image = document.createElement("img");
    image.alt = file.name;
    image.title = file.name;
    images.push(image);
    carousel.appendChild(image);
    const reader = new FileReader();
    reader.onload = async function (e) {
      const dataUri = e.target.result;
      image.src = dataUri;
      image.onload = () => {
        loadedCount++;
        if (loadedCount === expectedCount) {
          let totalHeight = 0;
          let maxWidth = 0;
          for (const img of images) {
            totalHeight += img.naturalHeight;
            if (img.naturalWidth > maxWidth) {
              maxWidth = img.naturalWidth;
            }
          }
          canvas.width = maxWidth;
          canvas.height = totalHeight;
          const ctx = canvas.getContext("2d");
          let y = 0;
          for (const img of images) {
            ctx.drawImage(img, 0, y);
            y += img.naturalHeight;
          }
          const imgType = allPngs ? "png" : "jpeg";
          imgLink.href = canvas.toDataURL(`image/${imgType}`);
          imgLink.setAttribute("download", `stack.${imgType}`);
          imgLink.textContent = "Download Image";
        }
      };
    };
    reader.readAsDataURL(file);
  }
});
