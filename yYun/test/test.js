/* <li class='clear'>
    <div class='fl w60 fileName'>
        <input type='checkbox'>
        <i class='folder'></i>
        <a href='#/' class='verC fileClick'>新建文件夹</a>
    </div>
    <div class='fl w15 fileSize'>
        2.0MB
    </div>
    <div class='fl w25 fileChangeDate'>
        2015.11.3
    </div>
</li>
*/

var date=new Date();
var oLi=document.createElement("li"),
    oDiv1=document.createElement("div"),
    oDiv2=document.createElement("div"),
    oDiv3=document.createElement("div"),
    oCheckBox=document.createElement("input"),
    oInputText=document.createElement("input"),
    oI=document.createElement("li"),
    oBtnOk=document.createElement("input"),
    oBtnClose=document.createElement("input");

    oLi.className="clear";
    oDiv1.className="fl w60 fileName";
    oDiv2.className="fl w15 fileSize";
    oDiv3.className="fl w25 fileChangeDate";
    oI.className="folder";
    oInputText.className="newFolderText";
    oCheckBox.type="checkbox";
    oInputText.type="text";

    oBtnOk.type="button"
    oBtnOk.className="btnSmall";

    oBtnClose.type="button";
    oBtnClose.className="btnSmall";



    oInputText.value="新建文件夹";
    oDiv2.innerHTML="...";
    oDiv3.innerHTML=date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDate();

    oDiv1.appendChild(oCheckBox);
    oDiv1.appendChild(oI);
    oDiv1.appendChild(oInputText);
    oDiv1.appendChild(oBtnOk);
    oDiv1.appendChild(oBtnClose);


    oLi.appendChild(oDiv1);
    oLi.appendChild(oDiv2);
    oLi.appendChild(oDiv3); 

    var oBox=document.getElementById("yItems");

    oBox.insertBefore(oLi,oBox.firstChild);

