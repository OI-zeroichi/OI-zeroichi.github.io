//キャンバス背景
function draw() {
  var canvasWidth = 720;
  var canvasHeight = 720;

  //#background
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 1280, 720);
}

//キャンバスに画像を描画する
function loadImage(id) {
  //画像を読み込んでImageオブジェクトを作成する
  var image = new Image();
  image.src = "./img/default_img.png";
  image.onload = function () {
    //画像ロードが完了してからキャンバスの準備をする
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    //キャンバスのサイズを画像サイズに合わせる
    canvas.width = image.width;
    canvas.height = image.height;
    //キャンバスに画像を描画（開始位置0,0）
    ctx.drawImage(image, 0, 0);
  };
}
//キャンバスに文字を描く
function drawText(canvas_id, text_id) {
  var canvas = document.getElementById(canvas_id);
  var ctx = canvas.getContext("2d");
  var text = document.getElementById(text_id);
  //文字のスタイルを指定
  ctx.font = "32px serif";
  ctx.fillStyle = "#404040";
  //文字の配置を指定（左上基準にしたければtop/leftだが、文字の中心座標を指定するのでcenter
  ctx.textBaseline = "center";
  ctx.textAlign = "center";
  //座標を指定して文字を描く（座標は画像の中心に）
  var x = canvas.width / 2;
  var y = canvas.height / 2;
  ctx.fillText(text.value, x, y);
}

// function draw() {
//   //#img
//   var img = new Image(); // 新たな img 要素を作成
//   img.src = "./img/default_img.png"; // ソースのパスを設定

//   img.onload = function () {
//     ctx.drawImage(
//       img,
//       0,
//       0,
//       this.width * (canvasHeight / this.height),
//       canvasHeight
//     );
//   };

//   //#text
//   var character_name = "Name";
//   var character_age = "Age";
//   var text =
//     "F1ドライバーのロズベルグ選手は、所属するメルセデスチームとの契約をカリブ海の英領バージン諸島にある企業を介して行っていることが判明。";

//   ctx.fillStyle = "rgb(250, 0, 200)";
//   ctx.font = "48px serif";

//   ctx.fillText(text, 10, 50);
//   ctx.fillText(character_name, 10, 100);
//   ctx.fillText(character_age, 10, 150);
// }
