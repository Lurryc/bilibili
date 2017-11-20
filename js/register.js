/**
 * Created by Administrator on 2017/11/11.
 */
$(".z-top-container").load("another_header.html");
$(".z-footer-container").load("footer.html");

var canPass = [0,0,0,0,0],yzm='';
$('input').focus(e=>{
    var input=$(e.target);
    input.data('save',input.attr('placeholder'));
    input.attr('placeholder','')
});
$('input').blur(e=>{
    var input=$(e.target);
    input.attr('placeholder',input.data('save'))
});
$("[name=uname]").keyup(e=>{
    var $input = $(e.target),val = $input.val(),regExp = /[^a-zA-Z_\-0-9\u4e00-\u9fa5]/;
    if(val=="") {$input.next().html("请告诉我你的昵称吧");canPass[0]=0}
    else if(val.length<3) {$input.next().html("你的用户名过短，不允许注册！");canPass[0]=0}
    else if(val.length>16) {$input.next().html("你的用户名或用户笔名过长，不允许注册！");canPass[0]=0}
    else if(regExp.test(val)) {$input.next().html("昵称含有非法字符");canPass[0]=0}
    else  {$input.next().html("");canPass[0]=1}
});
$("[name=uname]").blur(e=>{
    var $input = $(e.target),val = $input.val();
    $.ajax({
        method:'GET',
        url:"data/register/check_uname.php",
        data:{uname:val},
        success:function (data) {
            if(data.code==201){
                $input.next().html("这个昵称已经有人用过了");
                canPass[0]=0
            }else if(val!==""){
                $input.next().html("");
            }else{
                $input.next().html("请告诉我你的昵称吧");
            }
        }
    })
});
$("[name=upwd]").keyup(e=>{
    var $input = $(e.target),val = $input.val(),
        $safe = $(".safe_window"),
        $line = $(".safe_window>.safe_line>div"),
        $word = $(".safe_window>.safe_line>span");
    if(val=="") {$input.next().html("密码不能为空");canPass[1]=0;$safe.css("display","none")}
    else if(val.length<6) {$input.next().html("密码不能小于6个字符");canPass[1]=0}
    else if(val.length>16) {$input.next().html("密码不能大于16个字符");canPass[1]=0}
    else  {$input.next().html("");canPass[1]=1};
    if(val.length!==0){
        $safe.css("display","block");
        if(val.length<6) {
            $line.eq(0).css('backgroundColor',$line.eq(0).data('color'))
                 .nextAll('div').css("backgroundColor","transparent");
            $word.eq(0).css('display',"block").siblings('span').css('display',"none")
        }else if(val.match(/^\d*$|^[a-zA-Z]*$|^[^a-zA-Z0-9]*$/)){
            for(var i=0;i<$line.length;i++){
                i<=1?$line.eq(i).css('backgroundColor',$line.eq(i).data('color')):
                     $line.eq(i).css('backgroundColor',"transparent");
            }
            $word.eq(1).css('display',"block").siblings('span').css('display',"none")
        }else if(val.match(/^(\d|[a-zA-Z])*$/)){
            for(var i=0;i<$line.length;i++){
                i<=2?$line.eq(i).css('backgroundColor',$line.eq(i).data('color')):
                    $line.eq(i).css('backgroundColor',"transparent");
            }
            $word.eq(1).css('display',"block").siblings('span').css('display',"none")
        }else if(val.match(/^(\d|[^a-zA-Z0-9])+$|^([a-zA-Z]|[^a-zA-Z0-9])+$/)){
            for(var i=0;i<$line.length;i++){
                i<=3?$line.eq(i).css('backgroundColor',$line.eq(i).data('color')):
                    $line.eq(i).css('backgroundColor',"transparent");
            }
            $word.eq(1).css('display',"block").siblings('span').css('display',"none")
        }else{
            for(var i=0;i<$line.length;i++){
                $line.eq(i).css('backgroundColor',$line.eq(i).data('color'))
            }
            $word.eq(2).css('display',"block").siblings('span').css('display',"none")
        }
    }
});
$(".conf_pwd").blur((e)=>{
    var $input = $(e.target),curVal = $input.val(),oriVal = $("[name=upwd]").val();
    if(curVal!==oriVal) {
        $input.next().html("两次密码输入不一致");
        canPass[2]=0
    }else{
        $input.next().html("");
        canPass[2]=1
    }
});
$(".my_phone").blur((e)=>{
    var $input = $(e.target),val = $input.val();
    if(val.match(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/)){
        canPass[3]=1;
        $input.next().html("")
    }else{
        canPass[3]=0;
        $input.next().html("亲，看起来不像手机号呢")
    }
    $.ajax({
        method:'GET',
        url:"data/register/check_phone.php",
        data:{phone:val},
        success:function (data) {
            if(data.code==201){
                $input.next().html("对不起哦,有人先你一步注册了此号码");
                canPass[3]=0
            }
        }
    })
});
$('.get_yzm_buttom').click((e)=>{
    var $btn = $(e.target)
    if(!$btn.hasClass('disabled')){
        if(canPass[3]==1){
            yzm=Math.floor(Math.random()*9000+1000)
            alert('您的手机号是:+'+$("[name=country]>option:selected").attr("code")+" "+$("[name=tel]").val()+"\n\n验证码见控制台")
            console.log(yzm)
            $btn.next().html("验证码已发到你手机上了，5分钟内有效。");
            var resumTime=60;
            $btn.html("60秒后重新获取")
            $btn.addClass('disabled');
            var timer=setInterval(()=>{
                $btn.html(--resumTime+"秒后重新获取")
                if(resumTime==0){
                    clearInterval(timer);
                    timer=null;
                    $btn.removeClass("disabled")
                    $btn.html("点击获取")
                }
            },1000)
            setTimeout(()=>{
                yzm=""
            },300000)
        }else{
            $(".my_phone").get(0).focus()
        }
    }
});
$(".pc-register-descript>label>input").click((e)=>{
    if($(e.target).is(":checked")){
        $(".register_button").addClass("enable");
    }else{
        $(".register_button").removeClass("enable");
    }
});
$('.register_button').click((e)=>{
    var $code=$('[name=code]'),$btn=$(e.target);
    e.preventDefault();
    if($btn.hasClass('enable')){
        if($code.val()==yzm&&$code.val()!==""){
            canPass[4]=1;
            $code.nextAll('.yz_result').html("")
            $(".yz_phone>.check").css("display","block")
        }else{
            canPass[4]=0;
            $code.nextAll('.yz_result').html("验证码错误")
            $(".yz_phone>.check").css("display","none")
        }
        if(canPass.indexOf(0)==-1){
            $.ajax({
                url:"data/register/register.php",
                data:$("#registerForm").serialize(),
                method:"POST",
                success:function(data){
                    if(data.code==200){
                        $('#jump-to-index').css('display','block')
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                    alert(XMLHttpRequest.readyState);
                    alert(textStatus);
                },
            })
        }
    }
});
$('#jump-to-index .confirm').click(()=>{
    location.href='index.html';
});
