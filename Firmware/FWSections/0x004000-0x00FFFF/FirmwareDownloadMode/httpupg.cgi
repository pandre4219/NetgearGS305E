<!DOCTYPE html>
<html style="opacity:0;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>HTTP Upgrade</title>
<link rel="stylesheet" type="text/css" href="/loader.css">
<script  src="/tree.js" type="text/javascript"></script>
</head>
<script language="JavaScript">
function conf_backup()
{
window.location.href = "/httpupg.cgi?cmd=conf_backup";
}
function enableHttpImage()
{
var str = CreateButtons('button','Cancel','cancelButton()','btn_Cancel','on');
str += CreateButtons('button','Apply','submitHttpForm()','btn_Apply','on');
PaintButtons(str);
}
function changeAction(value)
{
var upload_conf = document.getElementById('textfield');
upload_conf.value = value;
upload_conf.value = upload_conf.value.substr(upload_conf.value.lastIndexOf("\\")+1);
}
</script>
<script language="JavaScript">
var str = CreateButtons('button','Cancel','javaScript:void(0)','btn_Cancel','off');
str += CreateButtons('button','Apply','javaScript:void(0)','btn_Apply','off');
PaintButtons(str);
</script>
<style>
.file-box{position:relative;width:500px;}
.file-box *{vertical-align:middle;}
.txt{width:310px;margin-top:1px;}
#upload_btn{position:absolute; display:inline-block;overflow:hidden;height:26px;margin-left:3px;}
#Btn{color:#ffffff;vertical-align:middle;height:25px;padding:0 12px;*padding:0 6px;_padding:-1 6px;line-height:22px;*line-height:18px;border:#00a1de 1px solid;background-color:#00a1de;}
.file{position:absolute;top:0;right:3px;width:400px;height:25px;filter:alpha(opacity:0);opacity:0;cursor:pointer;}
</style>
<body>
<form method="post"  enctype="multipart/form-data" action="httpupg.cgi?cmd=fw_upgrade">
<table class="detailsAreaContainer">
<tr><td>
<table class="tableStyle" cellpadding="0" cellspacing="0">
<tr><script>tbhdr('Firmware Update', 'httpDownload')</script></tr>
<tr><td class="paddingsubSectionBodyNone"><div id="fileDiv"><table class="tableStyle" style="width:748px">
<tr>
<td colspan='2' class="font10Bold padding4Top lang">Select the file to update the firmware:</td></tr>
<tr><td style="padding-top:3px;">
<div class="file-box">
<input type="text" class="txt" id="textfield" style="margin-top:0;height:21px;" onkeydown="disableKeyInput(event);" />
<div id="upload_btn"><input type="button" class="btn lang" id="Btn" value="Browse" />
<input type="file" name="fileField" class="file" id="fileField" onchange="enableHttpImage();changeAction(this.value);" /></div>
</div></td>
</tr>
</table></div></td></tr>
</table></td></tr>
</form>
</body>
</html>
 