const IMGBB_API_KEY = "5a70b5507805c2019114c373572a4435";

function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => data.data.url);
}
