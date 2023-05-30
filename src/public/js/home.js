console.log("home.js loaded");

function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      //reload page
      window.location.reload();
    })
    .catch((err) => console.log(err));
}
