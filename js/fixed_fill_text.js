
(function(){

var text = 'F1ドライバーのロズベルグ選手は、所属するメルセデスチームとの契約をカリブ海の英領バージン諸島にある企業を介して行っていることが判明。';

var canvas, context;

canvas		= document.createElement('canvas');
canvas.width	= 512;
canvas.height   = 256;
document.body.appendChild(canvas);

context			= canvas.getContext('2d');
context.fillStyle	= 'blue';
context.font		= "12px 'ＭＳ ゴシック'";
context.textAlign   	= 'left';

fixedFillText(context, text, 100, 16);

/**
 * 折り返しと改行を伴うテキストをキャンバスに描画する.
 * 改行文字は\n
 * alignがright|center以外が指定された時はleftとして扱う
 * @param context
 * @param width 横幅
 * @param lineHight 行送り
 * @param align 行揃え right|center
 */
function fixedFillText(context, text, width, lineHight, align) {

	var column = [''], line = 0, padding;

	for (var i = 0; i < text.length; i++) {
		var char = text.charAt(i);
		if (char == &quot;\n&quot; || context.measureText(column[line] + char).width > width) {
			line++;
			column[line] = '';
		}
		column[line] += char;
	}

	var padding, lineWidth;
	for (var i = 0; i < column.length; i++) {
		var lineWidth = context.measureText(column[i]).width;
		if (align == 'right') {
			padding = width - lineWidth;
		}
		else if (align == 'center') {
			padding = (width - lineWidth)/2;
		}
		else {
			padding = 0;
		}
		context.fillText(column[i], 0 + padding, lineHight + lineHight * i);
	}

}

})();
