var MultLang = {
    attrs: ["title"],
    parmMark: ["@@", "##"],

    transNodes: function(em){
        if(typeof top.lang === "undefined" || typeof top.orLang === "undefined"){
            return;
        }
        var ELEMENT_NODE = 1, TEXT_NODE = 3,
            nodeType = em.nodeType, value;

        if(nodeType === TEXT_NODE){ //translate text that is not empty
            if(!(/^\s+$/.test(em.nodeValue))){
                em.nodeValue = MultLang.transLang(em.nodeValue);
            }
        }else if(nodeType === ELEMENT_NODE){
            if(MultLang.transAttrs(em)){ //translate current element's attrs
                var childs = em.childNodes;
                for(var i=0, len=childs.length; i<len; i++){
                    arguments.callee(childs[i]); //do same operation for childNodes
                }
            }
        }
    },

    transAttrs: function(em){
        var tagName = em.nodeName.toLowerCase(),
            allAttrs = em.attributes,
            node, name, value, typ, isTrans,
            withsubtag = allAttrs.getNamedItem("withsubtag"),
            untrans = allAttrs.getNamedItem("untrans"),
            trans = allAttrs.getNamedItem("trans");

        if(!!untrans){
            return false;
		}
        if(tagName === "script" && tagName === "style"){
            return false;
        }
        if(tagName === "input"){
            typ = em.type.toLowerCase();
            if(typ === "button" || typ === "submit" || trans){
                em.value = MultLang.transLang(em.value);
            }
        }
        for(var i=0, len=MultLang.attrs.length; i<len; i++){
            name = MultLang.attrs[i];
            node = allAttrs.getNamedItem(name);
            if(!!node){
                node.nodeValue = MultLang.transLang(node.nodeValue);
            }
        }
        if(!!withsubtag){
            em.innerHTML = MultLang.transLang(em.innerHTML);
            return false;
        }
        return true;
    },

    trim: function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    transLang: function(str){
        var value = MultLang.trim(str);
        if(typeof top.lang === "undefined" || typeof top.orLang === "undefined"){
            return str;
        }
        if(!!top.orLang[value]){
            return top.lang[top.orLang[value]];
        }else{
            return str;
        }
    },

    transParmLang: function(str){
        var parmArr = MultLang.parmMark,
            paraNum = parmArr.length,
            dataObj = pickData(str);

        if(Object.getOwnPropertyNames(dataObj).length > 0){
            var value = dropData(str),
            tmpStr = MultLang.transLang(value);
            return addData(tmpStr);
        }

        return MultLang.transLang(str);


        function pickData(str){
            var pattern, mark, len,
                dataObj = {};

            for(var i=0; i<paraNum; i++){
                len = parmArr[i].length;
                mark = parmArr[i].substring(0, len/2);
                pattern = new RegExp(mark + '(.*)' + mark);
                if(str.match(pattern)){
                    dataObj[parmArr[i]] = str.match(pattern)[1];
                }
            }
            return dataObj;
        }

        function dropData(str){
            var mark, len,
                dataObj = pickData(str);

            for(var i=0; i<paraNum; i++){
                len = parmArr[i].length;
                mark = parmArr[i].substring(0, len/2);
                str = str.replace(mark + dataObj[parmArr[i]] + mark, mark+mark);
            }
            return str;
        }

        function addData(str){
            for(var i=0; i<paraNum; i++){
                str = str.replace(parmArr[i], dataObj[parmArr[i]]);
            }
            return str;
        }
    }
};
document.addEventListener("DOMContentLoaded", function(){
    if(!(typeof top.lang == "undefined")){
        MultLang.transNodes(document.body);
    }
    var errMsgDiv = document.getElementById("pwdErr");
    if (errMsgDiv && errMsgDiv.innerHTML != "") {
        errMsgDiv.innerHTML = MultLang.transParmLang(errMsgDiv.innerHTML);
    }
    document.documentElement.style.opacity = 1;
}, false);

function tbhdrLoginTable(tlt, helpUrl)
{
	var str = "<td colspan='2' class='loginTableTitle'><table width='450px'><tr><td width='100%'><span class='loginTableTitleBottom'>"+tlt;
	str += "</span></td></tr></table></td>";
	document.write(str);
}
function newWindow(mypage,myname,w,h,features,purp)
{ 
	glParam = features;
	features="resizable=yes";
	var winl = (screen.width-w)/2; var wint = (screen.height-h)/2; 
	if (winl < 0) winl = 0; 
	if (wint < 0) wint = 0; 
	var settings = 'height=' + h + ','; settings += 'width=' + w + ','; settings += 'top=' + wint + ','; settings += 'left=' + winl + ','; settings += features; win = window.open(mypage,myname,settings); win.window.focus();
	if(purp=="tag"){
		document.getElementById('hd').value = glParam;
	}
}
function CheckBrowser()
{
	var ua = navigator.userAgent.toLowerCase(), s, o = {};  
	if( s=ua.match(/msie ([\d.]+)/) ) {  
       		 o.ie = true;  
	         o.info = "ie";  
        } else if( s=ua.match(/firefox\/([\d.]+)/) ) {  
  	     	 o.ff = true;  
           	 o.info = "ff";  
        } else if( s=ua.match(/chrome\/([\d.]+)/) ) {  
           	 o.chrome = true;  
         	 o.info = "chrome";  
        } else if( s=ua.match(/opera.([\d.]+)/) ) {  
       		o.opera = true;  
	        o.info = "opera";  
	} else if( s=ua.match(/version\/([\d.]+).*safari/) ) {  
	        o.safari = true;  
	     	o.info = "safari";  
        }  
	if( s && s[1] ) {  
	        o.version = parseFloat( s[1] );  
 	} else {  
	        o.version = 0;  
 	}  
	        o.info = (o.info?o.info:"") + "_" + o.version;
	return o;
}
function changeLoginButtonStyle()
{
	var browser = CheckBrowser();
	var docMode = document.documentMode;
	var errDiv = document.getElementById("pwdErr");
	var loginBtn = document.getElementById("loginBtn");

	if((browser.info == "ie_6") || (browser.info == "ie_7") || 
		(browser.info == "ie_8") || (browser.info == "ie_9") || 
		(browser.info == "ie_10") || (browser.info == "_0"))
	{
		if (docMode == 7)
		{
			if (errDiv.innerHTML != "")
			{
				loginBtn.className = "loginBtnStyle_7_2";
			}
			else
			{
				loginBtn.className = "loginBtnStyle_7";
			}
		}
		else
		{
			if (errDiv.innerHTML != "")
			{
				loginBtn.className = "loginBtnStyle2";
			}
			else
			{
				loginBtn.className = "loginBtnStyle";
			}
		}
	}
	else
	{
		if (errDiv.innerHTML != "")
		{
			loginBtn.className = "loginBtnStyle2";
		}
		else
		{
			loginBtn.className = "loginBtnStyle";
		}
	}
}

function init()
{
	document.getElementById('password').focus();
	window.onresize = autoResizeElement;
    	autoResizeElement();
}

function autoResizeElement()
{
    var body_height = (window.innerHeight - 2) || (document.getElementsByTagName('html')[0].offsetHeight - 6);
	
    document.getElementById('mainArea').setAttribute('style', 'height: '+ body_height + 'px; min-height: 768px;');
	
    // login container
    var loginContainerHeight = body_height - 87 - 139;
    document.getElementById('loginContainer').setAttribute('style', 'height:' + (loginContainerHeight - 93) + 'px; padding-top:95px; min-height: 454px;');
}
function initError()
{
    var err_msg = document.getElementById('err_msg').value;
    
    if (err_msg != "")
    {
        alert (err_msg);
    }
}

function merge(str1, str2){
    var arr1 = str1.split("");
    var arr2 = str2.split("");
    var result = "";
    var index1 = 0;
    var index2 = 0;
    while((index1 < arr1.length) || (index2 < arr2.length)){
        if(index1 < arr1.length){
            result += arr1[index1];
            index1++;
        }
        if(index2 < arr2.length){
            result += arr2[index2];
            index2++;
        }
    }
    return result;
}

function encryptPwd(){
    var password = document.getElementById("password").value;
    var randNum  = document.getElementById("rand").value;
    var resultStr = merge(password,randNum);
    document.getElementById("submitPwd").value = md5(resultStr);
}

function onEnterSub(e)
{
    var whKey;
    if (window.event)
    {
        whKey = e.keyCode;
    }
    else if (e.which)
    {
        whKey = e.which;
    }
    if(whKey == '13')
    {
        submitLogin();
    }
}