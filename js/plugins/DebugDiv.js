window.DebugBaseButton=window.DebugBaseButton||{};
TouchInput.clear();
TouchInput.removeEventHandlers();
Input.clear();
Input.removeEventHandlers();
var canvas=document.getElementById("UpperCanvas");
    DebugBaseButton.debugDiv=DebugBaseButton.debugDiv||document.createElement("div");
    DebugBaseButton.debugInput=DebugBaseButton.debugInput||document.createElement("textarea");
    DebugBaseButton.enterInput=DebugBaseButton.enterInput||document.createElement("input");
    DebugBaseButton.exitInput=DebugBaseButton.exitInput||document.createElement("input");
    DebugBaseButton.resultDiv=DebugBaseButton.resultDiv||document.createElement("div");
    if(!DebugBaseButton.OpenedOnce){
    DebugBaseButton.OpenedOnce=true;
    DebugBaseButton.RunJavaScript=function(src,result){
        try{
            result.innerHTML="";
            var code=src.value;
            var r=eval(code);
            result.innerHTML+='<span style="color:rgba(255,255,255,1)"><b>[eval result:]</b></span>'+r+'<br />';
        } catch (e){
            result.innerHTML+="<span style='color:rgba(255,255,255,1)'><b>[catch Error!]</b></span><br />"+
            "<span style='color:rgba(255,255,255,1)'><b>[Error Name:]</b></span>"+e.name+'<br />'+
                "<span style='color:rgba(255,255,255,1)'><b>[Error Meaasge:]</b></span>"+e.message+"<br />";
        }
    };

    DebugBaseButton.clacTextWidth=function(text,fontSize){
        DebugBaseButton.clacCanvas=DebugBaseButton.clacCanvas||document.createElement("canvas");
        var context=DebugBaseButton.clacCanvas.getContext("2d");
        context.font=context.font.replace(/\d+px/, fontSize+"px");
        return context.measureText(text).width;
    }

    var console_log=console.log;
    console.log=function(message){
        var fontSize=parseInt(DebugBaseButton.resultDiv.style.fontSize);
        if (typeof message == 'object') {
            DebugBaseButton.resultDiv.innerHTML += ('<span style="color:rgba(255,255,255,1);white-space:nowrap"><b>[Console log:]</b></span>'+
                MakeObjectInnerHtmlIndent(message,DebugBaseButton.clacTextWidth('[Console log:]',fontSize),fontSize));
        } else {
            DebugBaseButton.resultDiv.innerHTML += '<span style="color:rgba(255,255,255,1);white-space:nowrap"><b>[Console log:]</b></span><span style="color:rgba(255,255,255,1)">'+message + '</span><br />';
        }
        console_log(message);
    };

    MakeObjectInnerHtmlIndent=function(object,indent,fontSize){
        var innerHTML="<div style='margin-left:"+indent+"px;'>";
        for(var i in object){
            innerHTML+="<span style='color:rgba(255,255,255,1);white-space:nowrap;'>"+i+"&nbsp:</span>";
            if(typeof object[i] =='object'){
                innerHTML+=MakeObjectInnerHtmlIndent(object[i],DebugBaseButton.clacTextWidth(i,fontSize),fontSize);
            } else {
                innerHTML+="<span style='color:rgba(255,255,255,1);white-space:nowrap;'>"+object[i]+"</span><br />"
            }
        }
        innerHTML+="</div>";
        return innerHTML;
    }

    DebugBaseButton.ExitDebug=function(Debug){
        this.removeChild(Debug);
        TouchInput._setupEventHandlers();
        Input._setupEventHandlers();
        DebugBaseButton.enterInput.removeEventListener("click",DebugBaseButton.enterInput_bind);
        DebugBaseButton.exitInput.removeEventListener("click",DebugBaseButton.exitInput_bind);
    };

    DebugBaseButton.debugDiv.setAttribute("style","position: absolute;margin: auto; top: 0px; left: 0px; right: 0px; bottom: 0px;z-index: 1000; height:"+
    canvas.offsetHeight+"px; width:"+canvas.offsetWidth+"px; background-color: rgba(0, 0, 0, 0.3); color: #FFFFFF; user-select:text;");
    DebugBaseButton.debugDiv.setAttribute("id","DebugDiv");
    document.body.appendChild(DebugBaseButton.debugDiv);

    //input.setAttribute("type","text");
    DebugBaseButton.debugInput.setAttribute("style","width:"+(canvas.offsetWidth-150*Graphics._realScale)+"px; background-color: rgba(0,0,0,0.3);"+
        "height: "+(150*Graphics._realScale)+"px; font-size: 30px; color: rgba(255,255,255,1); resize: none;");
    DebugBaseButton.debugInput.setAttribute("cols",canvas.offsetWidth-150*Graphics._realScale);
    DebugBaseButton.debugInput.setAttribute("rows","10");
    DebugBaseButton.debugDiv.appendChild(DebugBaseButton.debugInput);

    DebugBaseButton.enterInput.setAttribute("type","button");
    DebugBaseButton.enterInput.setAttribute("value","执行");
    DebugBaseButton.enterInput.setAttribute("style","position: absolute; left:"+DebugBaseButton.debugInput.offsetWidth+"px;"+
        "width: "+(canvas.offsetWidth-DebugBaseButton.debugInput.offsetWidth)+"px; height:"+(DebugBaseButton.debugInput.offsetHeight/2)+"px;"+
        "background-color: rgba(0,0,0,0.3); font-size: "+40*Graphics._realScale+"px; color: rgba(255,255,255,0.7);");
    DebugBaseButton.enterInput_bind=DebugBaseButton.RunJavaScript.bind(DebugBaseButton.enterInput,DebugBaseButton.debugInput,DebugBaseButton.resultDiv)
    DebugBaseButton.enterInput.addEventListener("click",DebugBaseButton.enterInput_bind);
    DebugBaseButton.debugDiv.appendChild(DebugBaseButton.enterInput);

    DebugBaseButton.exitInput.setAttribute("type","button");
    DebugBaseButton.exitInput.setAttribute("value","退出");
    DebugBaseButton.exitInput.setAttribute("style","position: absolute; left:"+DebugBaseButton.debugInput.offsetWidth+"px;"+
        "width: "+(canvas.offsetWidth-DebugBaseButton.debugInput.offsetWidth)+"px; top:"+(DebugBaseButton.debugInput.offsetHeight/2)+"px; height:"+(DebugBaseButton.debugInput.offsetHeight/2)+"px;"+
        "background-color: rgba(0,0,0,0.3); font-size: "+40*Graphics._realScale+"px; color: rgba(255,255,255,0.7);");
    DebugBaseButton.exitInput_bind=DebugBaseButton.ExitDebug.bind(document.body,DebugBaseButton.debugDiv);
    DebugBaseButton.exitInput.addEventListener("click",DebugBaseButton.exitInput_bind);
    DebugBaseButton.debugDiv.appendChild(DebugBaseButton.exitInput);

    DebugBaseButton.resultDiv.setAttribute("style","position: absolute; width: "+canvas.offsetWidth+"px; height:"+(canvas.offsetHeight-DebugBaseButton.debugInput.offsetHeight)+"px;"+
        "top:"+DebugBaseButton.debugInput.offsetHeight+"px; font-size: 20px; overflow: scroll");
    DebugBaseButton.resultDiv.innerHTML="输出结果在这，只在某种程度上支持console.log<br />";
    DebugBaseButton.debugDiv.appendChild(DebugBaseButton.resultDiv);
} else {
    DebugBaseButton.enterInput_bind=DebugBaseButton.RunJavaScript.bind(DebugBaseButton.enterInput,DebugBaseButton.debugInput,DebugBaseButton.resultDiv)
    DebugBaseButton.enterInput.addEventListener("click",DebugBaseButton.enterInput_bind);
    DebugBaseButton.exitInput_bind=DebugBaseButton.ExitDebug.bind(document.body,DebugBaseButton.debugDiv);
    DebugBaseButton.exitInput.addEventListener("click",DebugBaseButton.exitInput_bind);
    DebugBaseButton.resultDiv.innerHTML="输出结果在这，只在某种程度上支持console.log<br />";
    document.body.appendChild(DebugBaseButton.debugDiv);
}