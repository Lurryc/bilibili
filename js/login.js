/**
 * Created by Administrator on 2017/11/11.
 */
$(".z-top-container").load("another_header.html");
$(".z-footer-container").load("footer.html");
//画验证码的函数
let valCode="",rotDeg=0,valRes=[0,0,0];
function drawYZM(){
    valCode="";
    let pool="ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz1234567890",poolLength=pool.length,
    w=130,h=40,str="",avg=w/4,
    ctx=document.getElementById("yzm_canvas").getContext("2d");
    function rn(min,max){//返回min~max之间的随机整数
        let n=Math.random()*(max-min)+min;
        return Math.floor(n);
    }
    function rc(min,max){//返回随机颜色
        let r=rn(min,max),g=rn(min,max),b=rn(min,max);
        return `rgb(${r},${g},${b})`
    }
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle=rc(180,230);
    ctx.fillRect(0,0,w,h);
    ctx.font="25px SimHei";
    ctx.textBaseline="top";
    for(let i=0;i<4;i++){
        let index=Math.floor(Math.random()*poolLength);
        str=pool[index];
        valCode+=str;
        ctx.fillStyle=rc(0,80);
        ctx.fillText(str,rn(i*avg,(i+1)*avg-15),rn(0,h-20))
    }
    for(let j=0;j<10;j++){//划线
        ctx.strokeStyle=rc(80,255);
        ctx.beginPath();
        ctx.moveTo(rn(0,w),rn(0,h));
        ctx.lineTo(rn(0,w),rn(0,h));
        ctx.stroke()
    }
    for(let k=0;k<50;k++){//随机画点
        ctx.fillStyle=rc(80,255);
        ctx.beginPath();
        ctx.arc(rn(0,w),rn(0,h),1,0,2*Math.PI);
        ctx.fill()
    }
}
function valIsNull(ele,index,errMsg){
    if(ele.val()===""){
        ele.addClass("err");
        ele.next().addClass("err").next().html(errMsg);
        valRes[index]=0;
    }else{
        ele.removeClass("err");
        ele.next().removeClass("err").next().html("");
        valRes[index]=1;
    }
}
$("[name=uname]").keyup((e)=>{
    valIsNull($(e.target),0,"请输入注册时用的昵称或者手机号呀");
});
$("[name=upwd]").keyup((e)=>{
    valIsNull($(e.target),1,"喵，你没输入密码么？");
});
drawYZM();
$(".yzm>i.refresh").click((e)=>{
    let $i=$(e.target);
    $i.css("transform","rotate("+(rotDeg+=360)+"deg)");
    drawYZM();
});
$(".btn-box>.btn-login").click(()=>{
    if($(".val_code").val()===""){
        $('.req_val').css("display",'block');
        valRes[2]=0;
    }else if($(".val_code").val().toLowerCase()!==valCode.toLowerCase()){
        $('.req_val').css("display","none");
        $(".yzm>.yzm_res").removeClass("success").addClass("err");
        valRes[2]=0;
    }else{
        $('.req_val').css("display","none");
        $(".yzm>.yzm_res").removeClass("err").addClass("success");
        valRes[2]=1;
    }
    if(valRes.indexOf(0)===-1){
        $.ajax({
            url:"data/login/login.php",
            data:{uname:$("[name=uname]").val(),upwd:$("[name=upwd]").val()},
            method:"GET",
            success:function(data) {
                if(data.code===200){
                    save();
                    location.href='index.html'
                }else{
                    $(".username>.res-text").html("用户名或密码错误");
                    drawYZM();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            },
        })
    }else{
        for(let i=0;i<2;i++){
            if(valRes[i]===0){
                $("[name]").eq(i).trigger("keyup")
            }
        }
    }
});

$(document).ready(function () {
    if ($.cookie("rmbUser") === "true") {
        $("#rmbUser").attr("checked", true);
        $("[name=uname]").val($.cookie("username"));
        $("[name=upwd]").val($.cookie("password"));
        $('.yzm>.val_code').val(valCode.toLowerCase());
        valRes=[1,1,1]
    }
});
//记住用户名密码
function save() {
    if ($("#rmbUser").prop("checked")) {
        let str_username = $("[name=uname]").val();
        let str_password = $("[name=upwd]").val();
        $.cookie("rmbUser", "true", {expires: 7}); //存储一个带7天期限的cookie
        $.cookie("username", str_username, {expires: 7});
        $.cookie("password", str_password, {expires: 7});
    }
    else {
        $.cookie("rmbUser", "false", {expire: -1});
        $.cookie("username", "", {expires: -1});
        $.cookie("password", "", {expires: -1});
    }
}