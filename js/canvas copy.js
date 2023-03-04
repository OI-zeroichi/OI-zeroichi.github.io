function draw() {
  var canvasWidth = 720;
  var canvasHeight = 720;

  //#background-layer
  var bgLayer = document.getElementById("bg-layer").getContext("2d");
  bgLayer.fillStyle = "white";
  bgLayer.fillRect(0, 0, 1280, 720);

  //#img-layer
  var imgLayer = document.getElementById("img-layer").getContext("2d");
  var img = new Image(); // 新たな img 要素を作成

  img.onload = function () {
    imgLayer.drawImage(
      img,
      0,
      0,
      this.width * (canvasHeight / this.height),
      canvasHeight
    );
  };
  img.src = "./img/default_img.png"; // ソースのパスを設定

  //#text-layer
  var textLayer = document.getElementById("text-layer").getContext("2d");

  var character_name = "Name";
  var character_age = "Age";
  var text =
    "F1ドライバーのロズベルグ選手は、所属するメルセデスチームとの契約をカリブ海の英領バージン諸島にある企業を介して行っていることが判明。";

  textLayer.fillStyle = "rgb(250, 0, 200)";
  textLayer.font = "48px serif";

  textLayer.fillText(text, 10, 50);

  textLayer.fillText(character_name, 10, 100);
  textLayer.fillText(character_age, 10, 150);
}
