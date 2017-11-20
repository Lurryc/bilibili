var types=['life','animation','bangumi','music','game','movie','TV'];
$("#header").load("header.html",function(){
    $.ajax({
        url:'data/index/session_data.php',
        method:"GET",
        success:function (data) {
            if(data.uname){
                $('.login_register').html("<a href='javascript:'>欢迎:"+data.uname+"</a><i></i><a href='javascript:' class='logout'>登出</a>")
                $(".logout").click(()=>{
                    $.ajax({
                        url:'data/index/logout.php',
                        method:"GET",
                        success:function(){
                            $('.login_register').html("<a href='login.html'>登录</a><i></i><a href='register.html'>注册</a>")
                        }
                    })
                })
            }
        }
    })
});
$("#footer").load("footer.html");
//顶部的轮播图部分
(()=>{
    var carouselImg=$(".carousel-module>.pic"),
        carouseTitle=$(".carousel-module>.title"),
        carouseInd=$(".carousel-module>.trig");
    var n=0,timer=null,trans=300,interval=2000,liwidth=440;
    $.get("data/index/carousel-module.php")
        .then(data=>{
            var strTitle="";
            for(var img of data){
                strTitle+=`
                    <a href="${img.href}">${img.title}</a>
                `
            }
            data.push(data[0]);
            var strImg="";
            for(var img of data){
                strImg+=`
                    <li class="left">
                        <a href="${img.href}">
                          <img src="${img.img}" alt="">
                        </a>
                    </li>
                `
            }
            var strInds="<li class='left'></li>".repeat(data.length-1)
            carouselImg.css("width",liwidth*data.length)
            $(".carousel-module>.pic").html(strImg)
            carouseInd.html(strInds)
            carouseTitle.html(strTitle)
            carouseInd.children().first().addClass("on")
            carouseTitle.children().first().addClass("on")
            return new Promise(resolve=>resolve())
        })
        .then(()=>{
            function moveOnce(){
                n++;
                var left=-liwidth*n;
                carouselImg.css({left});
                carouseInd.children(":eq("+(n-1)+")").removeClass("on");
                carouseTitle.children(":eq("+(n-1)+")").removeClass("on");
                if(n===carouselImg.children().length-1){
                    carouseInd.children().first().addClass("on");
                    carouseTitle.children().first().addClass("on");
                    setTimeout(()=>{
                        carouselImg.css("transition","0s");
                        carouselImg.css("left",0);
                        n=0;
                        setTimeout(()=>{
                            carouselImg.css("transition",`all .${trans/100}s linear`)
                        },400)
                    },trans)
                }else {
                    carouseTitle.children(":eq("+n+")").addClass("on");
                    carouseInd.children(":eq("+n+")").addClass("on")
                }
            }
            timer=setInterval(moveOnce,interval+trans);
            $('#chief_recommend>.carousel-module').mouseenter(()=>{
                clearInterval(timer)
                timer=null;
            });
            return new Promise(resolve=>resolve(moveOnce))
        })
        .then(moveOnce=>{
            carouselImg.parent().mouseover(()=>{
                clearInterval(timer)
                timer=null
            });
            carouselImg.parent().mouseout(()=>{
                timer=setInterval(moveOnce,interval+trans)
            });
            carouseInd.children().click(e=>{
                n=$(e.target).index();
                carouselImg.css("left",-n*liwidth);
                carouseInd.children().removeClass("on");
                carouseTitle.children().removeClass("on");
                carouseInd.children(":eq("+n+")").addClass("on");
                carouseTitle.children(":eq("+n+")").addClass("on");
            })
        });
})();

//昨日三日一周推荐部分
(()=>{
    function loadRecommend(date,selector){
        $.ajax({
            type:"get",
            url:"data/index/recommend-module.php?date="+date,
            success:function(data){
                var html='',arr=["昨日","三日","一周"],prev='',next='',i=arr.indexOf(data[0].date);
                for(item of data){
                    html+=`
                      <div class="recommend-item left">
                        <a href="${item.href}" title="${item.title}">
                          <img src="${item.img}" alt="${item.title}" class="pic">
                          <div class="mask">
                            <p title="${item.title}" class="title">${item.title}</p>
                            <p class="author item">up主 : ${item.author}</p>
                            <p class="play item">播放 : ${item.play}</p>
                          </div>
                        </a>
                        <div class="w-later" data-toggle="watch-later-toggle" title="稍后再看"></div>
                      </div>
                    `
                };
                if(data[0].date==arr[0]){
                    prev=arr[arr.length-1];
                    next=arr[1];
                }else if(data[0].date==arr[arr.length-1]){
                    prev=arr[arr.length-2];
                    next=arr[0];
                }else {
                    prev=arr[i-1];
                    next=arr[i+1];
                }
                html+=`
                <span class="rec-btn prev">${prev}</span>
                <span class="rec-btn next">${next}</span>
                `;
                $(selector).html(html)
            },
            error:function(){
                alert("网络出现故障,请检查!!")
            },
        });
    }
    loadRecommend("一周",".recommend-module");
    $(".recommend-module").on("click",".rec-btn",e=>{
        loadRecommend($(e.target).html(),".recommend-module")
    });
})();

//移动鼠标画面动起来的方法
    var smallImgCounts=[];
    function countImgs(that){
        var showImg= $(that).find("img.cover").get()[0],canvas=$('canvas').get()[0],
            ctxt = canvas.getContext('2d'),
            img = new Image();
        img.src = showImg.dataset.trigger;
        img.onload=function(){
            var data=[],arr=[];
            canvas.width=1600;
            canvas.height=900;
            ctxt.drawImage(img,0,0);
            for(var x=480,y=0,imgCounts=3;y<=810;imgCounts++){
                if(x==1600) {y+=90,x=0;}
                data=ctxt.getImageData(x+70, y+35, 20, 20).data,arr=[];
                for(var i=0;i<1599;i+=4){
                    arr.push(data.slice(i,i+4))
                }
                if(arr[0][0]<20&&
                   arr[0][1]<20&&
                   arr[0][2]<20&&
                   !arr.some(value=>{return JSON.stringify(value) != JSON.stringify(arr[0])})){
                    smallImgCounts[showImg.dataset.trigger]=imgCounts;
                    canvas.width=0;
                    canvas.height=0;
                    return ;
                }
                if(imgCounts==100){
                    smallImgCounts[showImg.dataset.trigger]=imgCounts;
                    canvas.width=0;
                    canvas.height=0;console.log(imgCounts,'2');
                    return ;
                }
                // for(var i=0;i<1600;i++){
                //     if(i==1599||imgCounts==100) {
                //         smallImgCounts[showImg.dataset.trigger]=imgCounts;
                //         canvas.width=0;
                //         canvas.height=0;
                //         return ;
                //     }
                //     if((i+1)%4==1&&(data[i]<10||data[i]>20)&&data[i]!=data[0]){break;}
                //     else if((i+1)%4==2&&(data[i]<10||data[i]>20)&&data[i]!=data[1]){break;}
                //     else if((i+1)%4==3&&(data[i]<10||data[i]>20)&&data[i]!=data[2]){break;}
                // }
                x+=160;
            }
        }
    }
    function drawImg(that,event,src){
        var $img= $(that).find("img.cover");
        var length=160/smallImgCounts[src],num=Math.floor(event.offsetX/length);
        if(event.offsetX/length|0==0){
            x=-(num%10)*160;
            y=-Math.floor(num/10)*90;
            $img.css('background-position',x+'px '+y+'px');
        }
    }


//推广部分左侧
(()=>{
    $.ajax({
        url: 'data/index/promotion.php',
        type: 'GET',
        success: function (data) {
            var src = '', html = '';
            for (prom of data) {
                src = prom.img.slice(0, prom.img.indexOf('.jpg@160w_100h.webp')) + '_background.jpg@.webp';
                html += `
                  <div class="spread-module">
                    <a href="${prom.href}">
                      <div class="pic">
                        <div class="lazy-img">
                          <img src="${prom.img}" alt="">
                        </div>
                        <div class="cover-module">
                          <div class="process"><span></span></div>
                          <img class="cover" data-trigger="${src}" style="width:160px;height:90px;background:url(${src})"/>
                        </div>
                        <div class="mask"></div>
                        <span class="dur">${prom.dur}</span>
                        <div class="w-later" data-toggle="watch-later-toggle" title="稍后再看"></div>
                      </div>
                      <p class="detail" title="${prom.detail}">${prom.detail}</p>
                    </a>  
                  </div>
                `
            }
            $('#promotion .storey-box').html(html)
        }
    });
    $('#promotion .storey-box').on('mouseover', '.spread-module', function () {
        var timer = setTimeout(() => {
            $(this).find('.lazy-img').next().css('display', 'block')
        }, 500);
        $('#promotion .storey-box').on('mouseleave', '.spread-module', function () {
            clearTimeout(timer);
            timer = null;
        });
        $(this).find('.lazy-img').next().nextAll(':lt(3)').css('opacity', 1);
        if (smallImgCounts[$(this).find("img.cover").data('trigger')] == null) {
            countImgs(this)
        }
    });
    $('#promotion .storey-box').on('mouseleave', '.spread-module', function () {
        $(this).find('.lazy-img').next().css('display', 'none')
        $(this).find('.lazy-img').next().nextAll(':lt(3)').css('opacity', 0)
    });
    $('#promotion .storey-box').on('mousemove', '.spread-module', function (e) {
        drawImg(this, e, $(this).find("img.cover").data('trigger'));
        $(this).find('.process>span').css('width', e.offsetX / 1.6 + "%")
    });
})();
// 各楼层中项目的动态生成
    function loadFloorItem(item,isNews,isSub){
        $.ajax({
            url:'data/index/floor-item.php',
            data:{item:item,isLatestNews:isNews,isLatestSub:isSub},
            type:'GET',
            success:function(data){
                var html='';
                for(fitem of data) {
                    src = fitem.img.slice(0, fitem.img.indexOf('.jpg@160w_100h.webp')) + '_background.jpg@.webp';
                    html += `
                      <div class="spread-module">
                        <a href="${fitem.href}">
                          <div class="pic">
                            <div class="lazy-img">
                              <img src="${fitem.img}" alt="">
                            </div>
                            <div class="cover-module">
                              <div class="process"><span></span></div>
                              <img class="cover" data-trigger="${src}" style="width:160px;height:90px;background:url(${src})"/>
                            </div>
                            <div class="mask"></div>
                            <span class="dur">${fitem.dur}</span>
                            <div class="w-later" data-toggle="watch-later-toggle" title="稍后再看"></div>
                          </div>
                          <p class="detail" title="${fitem.detail}">${fitem.detail}</p>
                          <p class="num">
                            <span class="play"><i class="icon"></i>${fitem.playNumber}</span><span class="danmu"><i class="icon"></i>${fitem.danmuNumber}</span>
                          </p>
                        </a>  
                      </div>
                    `
                }
                $(`#${item} .storey-box`).html(html);
            },
            error:function () {
                alert("数据连接错误...")
            }
        })
    }
    for(item of types){
        loadFloorItem(item,1,0)
    }
// 各楼层中左侧项目动画效果实现
(()=>{
    $('#floor').on('mouseover','.spread-module',function(){
        var timer=setTimeout(()=>{$(this).find('.lazy-img').next().css('display','block')},500);
        $('#floor').on('mouseleave','.spread-module',function(){
            clearTimeout(timer);
            timer=null;
        });
        $(this).find('.lazy-img').next().nextAll(':lt(3)').css('opacity',1);
        if(smallImgCounts[$(this).find("img.cover").data('trigger')]==null){
            countImgs(this)
        }
    });
    $('#floor').on('mouseleave','.spread-module',function(){
        $(this).find('.lazy-img').next().css('display','none')
        $(this).find('.lazy-img').next().nextAll(':lt(3)').css('opacity',0)
    });
    $('#floor').on('mousemove','.spread-module',function(e){
        drawImg(this,e,$(this).find("img.cover").data('trigger'));
        $(this).find('.process>span').css('width',e.offsetX/1.6+"%")
    });
    //左侧项目异步请求数据
    $('#floor>div>div>.headline').on('click','.item',(e)=>{
        var $item=$(e.target);
        $item.addClass('on');
        $item.siblings().removeClass('on');
        var isNews=$item.index()===0?1:0,
        isSub=$item.index()===1?1:0,
        item=$item.parents('[id]')[0].id;
        loadFloorItem(item,isNews,isSub)
    });
})();
// 各楼层排名的加载
(()=>{
    function loadRank(temp){
        $.ajax({
        url:'data/index/query-rank.php?type='+temp,
        type:'GET',
        success:function(data){
            var html='',hotList='',originList='';
            for(var i=0;i<data[0].length;i++){
                data[0][i].point=data[0][i].point>10000?data[0][i].point/10000+'万':data[0][i].point;
                data[0][i].play=data[0][i].play>10000?data[0][i].play/10000+'万':data[0][i].play;
                data[0][i].danmu=data[0][i].danmu>10000?data[0][i].danmu/10000+'万':data[0][i].danmu;
                data[0][i].star=data[0][i].star>10000?data[0][i].star/10000+'万':data[0][i].star;
                data[0][i].coin=data[0][i].coin>10000?data[0][i].coin/10000+'万':data[0][i].coin;
                hotList+=`
                    <li class="rank-item">
                      <i class="rank-num">${i+1}</i>
                      <a href="${data[0][i].href}" target="_blank" title="${data[0][i].title}" class="rank-info clear">
                        <div class="lazy-img">
                          <img alt="${data[0][i].title}" src="${data[0][i].img}">
                          <div class="w-later" data-toggle="watch-later-toggle" title="稍后再看""></div>
                        </div>
                        <div class="rank-detail">
                          <p class="rank-title">${data[0][i].title}</p>
                          <p class="rank-point">综合评分 : ${data[0][i].point}</p>
                        </div>
                       
                      </a>
                    </li>
                    `
            }
            for(var i=0;i<data[1].length;i++){
                data[1][i].point=data[1][i].point>10000?data[1][i].point/10000+'万':data[1][i].point;
                data[1][i].play=data[1][i].play>10000?data[1][i].play/10000+'万':data[1][i].play;
                data[1][i].danmu=data[1][i].danmu>10000?data[1][i].danmu/10000+'万':data[1][i].danmu;
                data[1][i].star=data[1][i].star>10000?data[1][i].star/10000+'万':data[1][i].star;
                data[1][i].coin=data[1][i].coin>10000?data[1][i].coin/10000+'万':data[1][i].coin;
                originList+=`
                    <li class="rank-item">
                      <i class="rank-num">${i+1}</i>
                      <a href="${data[1][i].href}" target="_blank" title="${data[1][i].title}" class="rank-info clear">
                        <div class="lazy-img">
                          <img alt="${data[1][i].title}" src="${data[1][i].img}">
                          <div class="w-later" data-toggle="watch-later-toggle" title="稍后再看""></div>
                        </div>
                        <div class="rank-detail">
                          <p class="rank-title">${data[1][i].title}</p>
                          <p class="rank-point">${data[1][i].point}</p>
                        </div>
                        
                      </a>
                    </li>
                    `
            }
            html+=`
              <div class="rank-header clear">
                <h3 class="left">排行</h3>
                <div class="b-tab rank-tab left">
                  <div class="b-tab-item left on">全部</div>
                  <div class="b-tab-item left">原创</div>
                </div>
              </div>
              <div class="rank-list">
                <ul class="hot left">${hotList}</ul>
                <ul class="origin left">${originList}</ul>
              </div>
              <a href="javascript:" target="_blank" class="more-link">
                查看更多<i class="icon icon-arrow-r"></i>
              </a>
            `
            $(`#${temp}`).find(".div-rank").html(html)
        },
        error:function(){
            console.log('error');}
    })}
    for(temp of types){loadRank(temp)}
    $("#floor .div-rank").on('mouseover','.b-tab-item',function(e){
        $(this).parents('.rank-header').next().css("margin-left",-$(this).index()*260)
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
    })
})();
// 为番剧最新部分加载内容,并绑定事件
(()=>{
    function loadBangumi(week){
        return new Promise((resolve,reject)=>{
            $.ajax({
                url:'data/index/load_bangumi.php',
                data:{week:week},
                success:function(data){
                    var html='';
                    for(bgm of data){
                        html+=`
                        <div class="timing-box-item clear">
                          <a href="${bgm.href}" title="${bgm.title}" class="pic">
                            <div class="lazy-img"><img src="${bgm.img}" alt=""></div>
                          </a>
                          <div class="r-text">
                            <a href="${bgm.href}" title="${bgm.title}" class="text">${bgm.title}</a>
                            <p class="update"><span>更新至<a href="${bgm.href}">${bgm.new}</a></span></p>
                          </div>
                        </div>
                        `
                    }
                    $('#bangumi .timing-box').html(html);
                    resolve();
                }
            });
        })
    }
    loadBangumi('最新')
    $('#bangumi>.up .headline .b-tab').on('click','div:not(.on)',(e)=>{
        var $item=$(e.target);
            $item.addClass('on').children('span').css('display','inline');
            $item.siblings().removeClass('on').children('span').css('display','none');
            loadBangumi($item.text()).then(()=>{
                var $div=$('#bangumi .up .timing-box>div')
                if($div.css('opacity')==0){
                    var width=parseFloat($div.css('width')),height=parseFloat($div.css('height'));
                    $div.css('opacity',1)
                    for(var i=0;i<$div.length;i++){
                        var xCount=i%3,yCount=Math.floor(i/3);
                        $div[i].style.top=yCount*height+'px';
                        $div[i].style.left=xCount*width+'px';
                    }
                }
            })
    });
})();
//当页面滚动时所要触发的事件
    var $floors = $('#floor>div');
    function checkOn(){
        var $liftItems = $('#lift>.nav-list>.item');
        for(var i=0;i<$floors.length;i++){
            var floorTop = $floors.get(i).getBoundingClientRect().top,floorBottom = $floors.get(i).getBoundingClientRect().bottom;
            if(floorTop<=innerHeight/2&&floorBottom>=innerHeight/2-30){
                $liftItems.eq(i).addClass('on')
            }else{
                $liftItems.eq(i).removeClass('on')
            }
        }
    }
(()=>{
    window.onload = window.onscroll=function(){
        //图片懒加载
        // $imgs=$("img");
        // for(img of $imgs){
        //     if((img.getBoundingClientRect().bottom>0&&img.getBoundingClientRect().top<0)
        //         ||(img.getBoundingClientRect().bottom>0&&img.getBoundingClientRect().top<innerHeight)){
        //         img.src=img.dataset.src
        //     }
        // }
        /*
            页面加载完成后计算各个大图中小图的个数
             var $spModule = $('.storey-box .spread-module');todo:注意不要放在window.onscroll中!!
             for(temp of $spModule){
                 countImgs(temp);
             }
        */
        //番剧部分
        var $div=$('#bangumi .up .timing-box>div');
        if($div.css('opacity')==0){
        var top=$('#bangumi>.up').get(0).getBoundingClientRect().top,
            bottom=$('#bangumi>.up').get(0).getBoundingClientRect().bottom;
            if((top<innerHeight/2&&top>0)||(bottom>innerHeight/2&&bottom<innerHeight)){
                var width=parseFloat($div.css('width')),height=parseFloat($div.css('height'));
                $div.css('opacity',1)
                for(var i=0;i<$div.length;i++){
                    var xCount=i%3,yCount=Math.floor(i/3);
                    $div[i].style.top=yCount*height+'px';
                    $div[i].style.left=xCount*width+'px';
                }
            }
        }
        //楼层滚动部分
        $('body').scrollTop()>232?$('#lift').css("top",120):$('#lift').css('top',232);
        checkOn()
    };
})();
// 实现番剧右侧轮播效果
(()=>{
    var ban_direction=0;
    function moveBan(){
        ban_direction=ban_direction===0?1:0
        $('#bangumi div.carousel>ul.pic').css('margin-left',-260*ban_direction)
        $('#bangumi div.carousel>ul>:nth-child('+(ban_direction+1)+')').addClass('on').siblings().removeClass('on');
    }
    var ban_timer = setInterval(moveBan,4000);

    $('#bangumi div.carousel').mouseover(()=>{
        clearInterval(ban_timer);
        ban_timer=null;
    });
    $('#bangumi div.carousel').mouseleave(()=>{
        ban_timer = setInterval(moveBan,4000);
    });
    $('#bangumi .carousel>.trig').on('mouseover','span',function () {
        moveBan()
    });
})();

//楼层滚动部分
(()=>{
    var DURA=500,STEPS=10,moved=0,step=0,interval=DURA/STEPS,timer=null;
    var floorItems=$('#floor .headline>span.name'),htmlOfLift='';
    for(var fItem of floorItems){
        htmlOfLift+=`
        <div class="item">${fItem.textContent.slice(0,2)}</div>
        `
    }
    $('#lift>.nav-list').html(htmlOfLift);
//楼层跳转的效果加载
    //楼层滚动动态效果实现
    function moveStep(){
        moved++;
        window.scrollBy(0,step);
        if(moved==STEPS){
            clearInterval(timer);
            timer=null;
            moved=0;
            checkOn();
        }
    }
    function moveTo(DIST){
        if(timer!=null){
            clearInterval(timer);
            timer=null;
            moved=0;
        }
        step=DIST/STEPS;
        timer=setInterval(moveStep,interval);
    }

    $('#lift>.back-top').click(()=>{
        moveTo(-$('body').scrollTop())
    });
    $('#lift>.nav-list').on('click','.item',(e)=>{
        var index=$(e.target).index();
        var distence=$floors[index].getBoundingClientRect().top;
        moveTo(distence);
    });
//楼层导航处手机的动态效果
  (()=>{
      var $phone = $('#lift .phone .phone-icon');
      var timer = null,imgCount = 0,dir = 1,isGo=true;
      function moveOnce(){
          imgCount=imgCount+dir;
          $phone.css('backgroundPositionX',-imgCount*90)
          if(imgCount<=0&&isGo===false){
              clearInterval(timer);
              timer=null;
          }
      }
      $phone.mouseenter(()=>{
          isGo=true
        $('#lift .phone .phone-icon-tips').css('opacity',1);
        if(timer===null){
            dir=1;
            timer = setInterval(function(){
                moveOnce();
                if(isGo){
                    if(imgCount>=15){dir = -1}
                    if(imgCount<=9){dir = 1}
                }
            },100)
        }
      });
      $phone.mouseleave(()=>{
        $('#lift .phone .phone-icon-tips').css('opacity',0)
        isGo=false;
        dir=-1;
      })
  })()
})();

//rank部分mouseover
// `<div class="rank-info-hide"">
//     <div class="rank-title">${data[0][i].title}</div>
//     <div class="rank-info">
//         <span class="name">${data[0][i].name}</span>
//         <span class="line"></span>
//         <span class="time">2017-10-13 00:00</span>
//     </div>
//     <div class="rank-detail clear">
//         <div class="lazy-img">
//             <img alt="" src="${data[0][i].img}">
//         </div>
//         <p class="txt">${data[0][i].text}</p>
//     </div>
//     <div class="rank-data">
//         <span class="play"><i class="icon"></i>${data[0][i].play}</span>
//         <span class="danmu"><i class="icon"></i>${data[0][i]}.danmu</span>
//         <span class="star"><i class="icon"></i>${data[0][i]}.star</span>
//         <span class="coin"><i class="icon"></i>${data[0][i]}.coin</span>
//     </div>
// </div>`