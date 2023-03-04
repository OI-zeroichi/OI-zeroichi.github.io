document.getElementById("download").onclick = (event) => {
  let canvas = document.getElementById("text-layer");

  let link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "test.png";
  link.click();
};
