const makeImages = (result) => {
  if (result.image) {
    const img = document.createElement("img");
    img.src = result.image.medium;
    document.body.append(img);
  }
};

const form = document.querySelector("#searchForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const searchTerm = form.elements.query.value;
  const config = { params: { q: searchTerm } };
  const res = await axios.get(
    `https://api.tvmaze.com/singlesearch/shows`,
    config
  );
  makeImages(res.data);
  form.elements.query.value = "";
});
