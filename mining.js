//用户类型 1 矿主  2 好友  3 访客
var userClass =  1;
//当前矿场等级
var lv=2;
//当前矿场arp
var arp=2.0;
var mobArp=500;
//当前正在操作的矿区ID
var currentOptAreaId =0;
var currentSelectCoin =6;
var toolTipStatus=0;
//当前在商店选择的商品ID
var currentShopingId=-1;
// 标记弹窗当前状态
let panelShow = false;

//矿区初始状态
const miningArea = [0,0,0,0,0,0,0,0,0,0,0,0];
//矿区矿种额度
const miningAreaSeeds = [0,0,0,0,0,0,0,0,0,0,0,0];
//矿区挖掘周期
const countdownSeconds=30;
const st = new Date();
st.setSeconds(st.getSeconds()+countdownSeconds);
const miningAreaDigTimes = [{"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st},
    {"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st}, {"c":1,"t":7,"startTime":st},
    {"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st},{"c":1,"t":7,"startTime":st}];
//矿区矿种类型
const miningAreaTypes = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
//矿种类型
const coinType=["USDT","BTC","ETH","XRP","SOL","BNB","MOB"];
//用户币种余额数组
const coinArr = [1000,0,500,0,6000,0,90000];
//用户道具数组
const propsArr =[1,0,0, 5, 1,0,0,0, 1, 2, 1,0,0,0];
//道具类型
const propsNameArr =["青铜镐","白银镐","黄金镐","探测器","机械狗","监视器","电围栏","防护罩","加速器",
    "矿机","初级矿产经营证","中级矿产经营证","高级矿产经营证","超级矿产经营证"];
//道具类型
const propsPriceArr =[10,50,300,50,200,300,500,1000,500,
    1000,100,1000,5000,20000];

//立即加速
function toAcceleration(i){
    currentOptAreaId=i;
    if(propsArr[8]>0){

        closeMineDetail(false);
        if(toolTipStatus==2){
            toolTipStatus=3;
            openTooltip(toolTipStatus); //弹窗
        }else {
            openMineDetail(3,currentOptAreaId);
        }
        const startTime = new Date();
        let xt =  (miningAreaDigTimes[currentOptAreaId].startTime-startTime)/1000;
        if(xt<0){xt =0;}
        startTime.setSeconds(startTime.getSeconds()+countdownSeconds+xt); //补上加速的时差
        miningAreaDigTimes[currentOptAreaId].startTime=startTime; //重置计时
        propsArr[8]=propsArr[8]-1; //消耗一个加速器

    }else {
        var elements = document.querySelectorAll('.acceleration');
        elements.forEach(function(element) {
            element.style.display="inline";
        });
    }
}

//立即开采
function goToDig(i){
    currentOptAreaId=i;
    closeMineDetail(false);
    toggleDigPanel();
}
//投入矿种开始挖掘
function toStartDig(){
    if(document.querySelector('input[name="gender"]:checked')==null){
        viewMessage("请选择要开采的矿种类型");
        return;
    }
    if(document.getElementsByName("numbers")[0]==null || document.getElementsByName("numbers")[0].value=="" ||
        document.getElementsByName("numbers")[0].value<=0){
        viewMessage("请输入要开采的矿种数量");
        return;
    }

    let digTimesValue = document.getElementById('digTimesId').options[
        document.getElementById('digTimesId').selectedIndex].value;
    let selectedValue = document.querySelector('input[name="gender"]:checked').value;
    let numbersValue = document.getElementsByName("numbers")[0].value;

    if(coinArr[selectedValue]<numbersValue){
        viewMessage("矿种数量不足，请先充值对应的矿种");
        return;
    }
    miningAreaSeeds[currentOptAreaId]=numbersValue;
    miningAreaTypes[currentOptAreaId]=selectedValue;
    miningAreaDigTimes[currentOptAreaId].t=digTimesValue;
    const startTime = new Date();
    startTime.setSeconds(startTime.getSeconds()+countdownSeconds);
    miningAreaDigTimes[currentOptAreaId].startTime=startTime;
    coinArr[selectedValue] = coinArr[selectedValue]-numbersValue;
    currentSelectCoin = selectedValue;
    miningArea[currentOptAreaId]=2;
    reforceMiningArea(currentOptAreaId,2);

    //document.getElementById("digStatus-1-"+currentOptAreaId).style.display="none";
    //document.getElementById("digStatus-2-"+currentOptAreaId).style.display="";
    closeDigPanel(false);

    if(toolTipStatus==1){
        toolTipStatus=2;
        openTooltip(toolTipStatus);
    }
}

//立即探测
function findMiningArea(i){
    closeMineDetail(false);
    if(propsArr[3]>0){
        propsArr[3]=propsArr[3]-1;
        viewMessage("已消耗一个探测器");
        //修改状态为未开发
        miningArea[i]=1;
        reforceMiningArea(i,miningArea[i]);
    }else {
        viewMessage("仓库中未找到探测器，请至商店购买");
    }
    if(toolTipStatus==0){
        toolTipStatus=1;
        openTooltip(toolTipStatus);
    }
}

function viewMessage(msg){
    document.getElementById("messageMask").style.display="grid";
    document.getElementById("messageMask").innerHTML=msg;
    setTimeout(() => {
        document.getElementById("messageMask").innerHTML="";
        document.getElementById("messageMask").style.display="none";
    }, 2000);
}


function goHome(){
    goToVisitor(1,"我");
    document.getElementById("goHome").style.display="none";
}
//切换榜单列表
function listRanking(x,e){
    var  items  = document.getElementById("ranking-list-title-id");
    for(var i=0; i<items.children.length;i++){
        items.children[i].style.color="#222";
    }
    items.children[x-1].style.color="#ffc107";
    if(x==3){
        document.getElementById("ranking-list-infos-3").style.display = '';
        document.getElementById("ranking-list-infos-2").style.display = 'none';
        document.getElementById("ranking-list-infos-1").style.display = 'none';
    }else if(x==2){
        document.getElementById("ranking-list-infos-3").style.display = 'none';
        document.getElementById("ranking-list-infos-2").style.display = '';
        document.getElementById("ranking-list-infos-1").style.display = 'none';
    }else {
        document.getElementById("ranking-list-infos-3").style.display = 'none';
        document.getElementById("ranking-list-infos-2").style.display = 'none';
        document.getElementById("ranking-list-infos-1").style.display = '';
    }
}

//切换好友列表
function listFriends(x,e){
    var  items  = document.getElementById("friend-list-title-id");
    for(var i=0; i<items.children.length;i++){
        items.children[i].style.color="#222";
    }
    items.children[x-1].style.color="#ffc107";
    if(x==3){
        document.getElementById("friend-list-infos-3").style.display = '';
        document.getElementById("friend-list-infos-2").style.display = 'none';
        document.getElementById("friend-list-infos-1").style.display = 'none';
    }else if(x==2){
        document.getElementById("friend-list-infos-3").style.display = 'none';
        document.getElementById("friend-list-infos-2").style.display = '';
        document.getElementById("friend-list-infos-1").style.display = 'none';
    }else {
        document.getElementById("friend-list-infos-3").style.display = 'none';
        document.getElementById("friend-list-infos-2").style.display = 'none';
        document.getElementById("friend-list-infos-1").style.display = '';
    }
}
//切换用户身份
function goToVisitor(x,user){

    userClass=x;
    closeFriendPanel(false);
    document.getElementById("goHome").style.display="flex";
    document.getElementById("personal").innerText=user;
}
// 点击仓库切换显示/隐藏
function toggleEquipPanel() {

        let innerHtml = "";
        for(var i=0;i<propsNameArr.length;i++){
            if(propsArr[i]>0) {
                innerHtml = innerHtml +
                    "<div class=\"equip-item\">" + propsNameArr[i]
                    + "<div style='color: burlywood'>" + propsArr[i] + "</div></div>"
            }
        }
        document.getElementById("propsId").innerHTML=innerHtml;

    const mask = document.getElementById('equipMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}

// 点击遮罩灰色区域关闭弹窗
function closeEquipPanel(e) {
    const mask = document.getElementById('equipMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

//商城选择商品
function selectedShopping(i){
   let childElements =  document.getElementById("marketId").getElementsByClassName("equip-item");
   if(currentShopingId>=0){
       childElements[currentShopingId].style.background="#ffffff";
   }
    currentShopingId=i;
    childElements[currentShopingId].style.background="#ffc107";
}
//购买商品
function buyShopping(){
    if(currentShopingId<0){
        viewMessage("请先选择要购买的商品");
        return;
    }
    if(coinArr[6] >=propsPriceArr[currentShopingId]){
        coinArr[6]= coinArr[6] - propsPriceArr[currentShopingId];
        propsArr[currentShopingId]=propsArr[currentShopingId]+1;
        viewMessage("购买成功，商品已放入仓库");
        document.getElementById("userMobId").innerHTML="MOB余额: "+ coinArr[6];
    }else {
        viewMessage("MOB余额不足，请先充值");
    }

}
// 点击仓库切换显示/隐藏
function toggleMarketPanel() {
    currentShopingId=-1;
    let innerHtml = "";
    for(var i=0;i<propsNameArr.length;i++){
            innerHtml = innerHtml +
                "<div class=\"equip-item\" onclick='selectedShopping("+i+")'>" + propsNameArr[i]
                + "<div style='color: burlywood'>" + propsPriceArr[i] + "MOB</div></div>"
    }
    document.getElementById("marketId").innerHTML=innerHtml;
    document.getElementById("userMobId").innerHTML="MOB余额: "+ coinArr[6];
    const mask = document.getElementById('marketMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeMarketPanel(e) {
    const mask = document.getElementById('marketMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
    currentShopingId=-1;
}



function getVisitorMineInfos(x,i){
    let innerHtml="";
    if(x==0){
        innerHtml="<p>尚未探测该矿区</p>\n";
    }else if(x==1){
        innerHtml="<p>尚未开采该矿区,可存入矿种进行开采</p>\n" ;
    }else if(x==2){
        innerHtml= "     <p>矿种："+coinType[miningAreaTypes[i]]+"</p>\n" +
            "            <p>数额：???</p>\n" +
            "            <p>ARP:"+arp+"%</p>\n" +
            "            <p>开采周期："+miningAreaDigTimes[i].c+" / "+miningAreaDigTimes[i].t+"</p>\n" +
            "            <br>\n" +
            "            <p>24H预期收益：??</p>\n";
    }else if(x==3) {
        innerHtml=
            "     <p>偷取成功</p>\n" +
            "     <p>窃取数额"+coinType[miningAreaTypes[i]]+" 0.3 / "+coinType[6]+"5</p>"+
            "     <p>矿种："+coinType[miningAreaTypes[i]]+"</p>\n" +
            "     <p>数额：???</p>\n" +
            "     <p>ARP:"+arp+"%</p>\n" +
            "     <p>开采周期："+miningAreaDigTimes[i].c+" / "+miningAreaDigTimes[i].t+"</p>\n" +
            "     <br>\n" +
            "     <p>窃损合计 "+coinType[miningAreaTypes[i]]+" 0.7 / "+coinType[6]+"10  </p>\n"  ;
    }
    return innerHtml;
}
function getFriendMineInfos(x,i){
    let innerHtml="";
    if(x==0){
        innerHtml="<p>尚未探测该矿区</p>\n";
    }else if(x==1){
        innerHtml="<p>尚未开采该矿区,可存入矿种进行开采</p>\n" ;
    }else if(x==2){
        let coinSeeds = (arp*miningAreaSeeds[i])/100;
        let mobSeeds = (mobArp*miningAreaSeeds[i])/100;
        innerHtml= "     <p>矿种："+coinType[miningAreaTypes[i]]+ " / "+miningAreaSeeds[i]+"</p>\n" +
            "            <p>伴生矿: "+coinType[6]+"</p>\n" +
            "            <p>ARP:"+arp+"%</p>\n" +
            "            <p>开采周期："+miningAreaDigTimes[i].c+" / "+miningAreaDigTimes[i].t+"</p>\n" +
            "            <br>\n" +
            "            <p>24H预期收益：??</p>\n" +
            "            <p>下次采收时间：<span class='countdown' id='countdown-b-a-"+i+"'>-:-:-</span></p>\n";
    }else if(x==3) {
        let coinSeeds = (arp*miningAreaSeeds[i])/100;
        let mobSeeds = (mobArp*miningAreaSeeds[i])/100;
        if(document.getElementById("mine-desc-status-1")!=null)
             document.getElementById("mine-desc-status-1").classList.add("countdown");
        innerHtml=
            "     <p>采收成功</p>\n" +
            "     <p>协采报酬 "+coinType[miningAreaTypes[i]]+"0.3 / "+coinType[6]+"5</p>"+
            "     <p>矿主收益："+coinType[miningAreaTypes[i]]+" "+ coinSeeds +" / "+coinType[6]+" "  +mobSeeds+"</p>\n" +
            "     <p>矿种："+coinType[miningAreaTypes[i]]+ " / "+miningAreaSeeds[i]+"</p>\n" +
            "     <p>伴生矿: "+coinType[6]+"</p>\n" +
            "     <p>ARP:"+arp+"%</p>\n" +
            "     <p>开采周期："+miningAreaDigTimes[i].c+" / "+miningAreaDigTimes[i].t+"</p>\n" +
            "     <br>\n" +
            "     <p>窃损合计 "+coinType[miningAreaTypes[i]]+" 0.7 / "+coinType[6]+"10  </p>\n" +
            "     <p>下次采收时间：<span class='countdown' id='countdown-b-a-"+i+"'>-:-:-</span></p>\n";

        if(miningAreaDigTimes[i].c<miningAreaDigTimes[i].t){
            miningAreaDigTimes[i].c=miningAreaDigTimes[i].c+1;//当前周期进度加1
            miningArea[i]=2; //重置矿区状态为开始挖掘
        }else {
            miningArea[i]=1; //重置矿区状态为待开采
            miningAreaDigTimes[i].c=1;//重置当前周期进度
        }
        let startTime = new Date();
        startTime.setSeconds(startTime.getSeconds()+countdownSeconds);
        miningAreaDigTimes[currentOptAreaId].startTime=startTime; //重置计时
        reforceMiningArea(i,miningArea[i]);
    }
    return innerHtml;
}
//矿区采收页面
function  getMasterMineInfos(x,i){
    let innerHtml="";
    if(x==0){
        innerHtml="<p>这是一个未开发的矿区，是否使用探测器探测该矿区？</p>\n"+
            "            <br>\n" +
            "      <p onclick='findMiningArea("+i+")' style='color: #ffc107'>立即探测</p>\n";
    }else if(x==1){
        innerHtml="<p>尚未开采该矿区,可存入矿种进行开采</p>\n"+
            "            <br>\n" +
            "          <p onclick='goToDig("+i+")' style='color: #ffc107'>立即开采</p>\n" ;
    }else if(x==2){
        let coinSeeds = (arp*miningAreaSeeds[i])/100;
        let mobSeeds = (mobArp*miningAreaSeeds[i])/100;
        innerHtml=   "     <p>矿种："+coinType[miningAreaTypes[i]]+ " / "+miningAreaSeeds[i]+"</p>\n" +
            "            <p>伴生矿: "+coinType[6]+"</p>\n" +
            "            <p>预期收益："+coinType[miningAreaTypes[i]]+" "+ coinSeeds +" / "+coinType[6]+" "  +mobSeeds+"</p>\n" +
            "            <p>ARP:"+arp+"%</p>\n" +
            "            <p>开采周期："+miningAreaDigTimes[i].c+" / "+miningAreaDigTimes[i].t+"</p>\n" +
            "            <br>\n" +
            "            <p>下次采收时间：<span class='countdown' style='font-size: 0.9rem' id='countdown-b-a-"+i+"'>-:-:-</span></p>\n" +
            "            <br>\n" +
            "            <p onclick='toAcceleration("+i+")' style='color: #ffc107'>立即加速</p>\n"+
            "            <p    class='acceleration'>尚未有加速道具，请至道具商场购买</p>";
    }else if(x==3) { //可采收状态
        let coinSeeds = (arp*miningAreaSeeds[i])/100;
        let mobSeeds = (mobArp*miningAreaSeeds[i])/100;
        if(document.getElementById("mine-desc-status-1")!=null)
           document.getElementById("mine-desc-status-1").classList.add("countdown");
        innerHtml=
            "     <p>采收成功</p>\n" +
            "     <p>矿种："+coinType[miningAreaTypes[i]]+ " / "+miningAreaSeeds[i]+"</p>\n" +
            "     <p>伴生矿: "+coinType[6]+"</p>\n" +
            "     <p>收获："+coinType[miningAreaTypes[i]]+" "+ coinSeeds +" / "+coinType[6]+" "  +mobSeeds+"</p>\n" +
            "     <p>ARP:"+arp+"%</p>\n" +
            "     <p>开采周期："+miningAreaDigTimes[i].c+" / "+miningAreaDigTimes[i].t+"</p>\n" ;
        if(Math.floor(Math.random()*10)<5){//随机展示窃损
            innerHtml=innerHtml+
                "     <p>窃损合计 "+coinType[miningAreaTypes[i]]+" 0.7 / "+coinType[6]+"10  " +
                "<span onclick='viewLossList()' style='font-size: 0.7rem;color: #cccccc'>    明细</span></p>\n" ;
        }
        innerHtml=innerHtml+
            "     <p style='font-size: 0.9rem'>下次采收时间：<span class='countdown' style='font-size: 0.9rem' id='countdown-b-a-"+i+"'>-:-:-</span></p>\n";

        if(miningAreaDigTimes[i].c<miningAreaDigTimes[i].t){
            miningAreaDigTimes[i].c=miningAreaDigTimes[i].c+1;//当前周期进度加1
            miningArea[i]=2; //重置矿区状态为开始挖掘
        }else {
            miningArea[i]=1; //重置矿区状态为待开采
            miningAreaDigTimes[i].c=1;//重置当前周期进度
        }
        let startTime = new Date();
        startTime.setSeconds(startTime.getSeconds()+countdownSeconds);
        miningAreaDigTimes[currentOptAreaId].startTime=startTime; //重置计时
        reforceMiningArea(i,miningArea[i]);

    }
    return innerHtml;

}

//窃损明细页面
function viewLossList(){
    //closeMineDetail(false);
    innerHtml="<p>Larissa  Lv3  "+coinType[0]+" 0.2 / "+coinType[6]+" 10</p>\n"+
        "<p>Lucia  Lv3  "+coinType[0]+" 0.1 / "+coinType[6]+" 20</p>\n"+
        "<p>Shelby  Lv3  "+coinType[0]+" 0.2 / "+coinType[6]+" 30</p>\n"+
        "<p>Tinisha  Lv3  "+coinType[0]+" 0.1 / "+coinType[6]+" 20</p>\n"+
        "<p>Jone  Lv3  "+coinType[0]+" 0.1 / "+coinType[6]+" 60</p>\n" +
        "<p onclick='closeMineDetail2(false)'>关闭</p>";
    const detailMask = document.getElementById('mineDetailMask2');
    document.getElementById("mdt-state-id-2").innerHTML=innerHtml;
    detailMask.style.display = 'flex';
}
function closeMineDetail2(e) {
    const detailMask = document.getElementById('mineDetailMask2');
    if(e==false || e.target === detailMask) {
        detailMask.style.display = 'none';
    }
}

function getMineInfos(x,i){
    let innerHtml = "";

    switch (userClass){
        case 1:
            innerHtml= getMasterMineInfos(x,i);
            break;
        case 2:
            innerHtml=getFriendMineInfos(x,i);
            break;
        case 3:
            innerHtml=getVisitorMineInfos(x,i);
            break;
    }
    return innerHtml;
}

//流程提示信息
function openTooltip(i) {
    const tooltipsMask = document.getElementById('tooltipsMask');
    let innerHtml = "";
    if(i==0){
        innerHtml="让我们开始挖矿吧！<br/><br/>请先点击探测一个矿区<br/><br/>" +
            "<div   onclick='closeTooltip(false)'>继续</div>"
    }else if(i==1){
        innerHtml="成功探测到新矿区<br/><br/>请在矿区中放入矿种开始挖掘。<br/><br/>" +
            "<div   onclick='closeTooltip(false)'>继续</div>"
    } if(i==2){
        innerHtml="成功放置矿种<br/><br/>请耐心等待收获吧，也可以在商店购买加速器提前收获哦。<br/><br/>" +
            "<div  onclick='closeTooltip(1)'>继续</div>"
    }if(i==3){
        innerHtml="成功使用加速器催进矿区生产<br/><br/>本次生产已完成采收，在冷却时间结束前该矿区生产已停滞。<br/><br/>" +
            "<div  onclick='closeTooltip(2)'>继续</div>"
    }
    document.getElementById("tips-state-id").innerHTML=innerHtml;

    tooltipsMask.style.display = 'flex';
}
function closeTooltip(e) {

    const detailMask = document.getElementById('tooltipsMask');
    if(e==false || e>0 || e.target === detailMask) {
        detailMask.style.display = 'none';
    }
    if(e==1){
       toggleMarketPanel();
    }else if(e==2){  //加速成功
        openMineDetail(3,currentOptAreaId);
    }
}

// 矿区详情弹窗控制
function openMineDetail(x,i) {
    const detailMask = document.getElementById('mineDetailMask');
    let innerHtml = getMineInfos(x,i);
    document.getElementById("mdt-state-id").innerHTML=innerHtml;
    detailMask.style.display = 'flex';
}
function closeMineDetail(e) {
    const detailMask = document.getElementById('mineDetailMask');
    if(e==false || e.target === detailMask) {
        detailMask.style.display = 'none';
    }
}

// 点击访客切换显示/隐藏
function toggleDigPanel() {
    const mask = document.getElementById('digMask');
    var inputstr="";
    for(var i=0;i<coinArr.length;i++){
        inputstr=inputstr+
            "<div class=\"radio-coins\"><div>" +
            "<input type=\"radio\" "+(i==0?"checked":"")+" name=\"gender\" value=\""+i+"\">"+coinType[i]+"</div><div>"+coinArr[i]+"" +
            "</div></div>\n";
    }
    mask.innerHTML="<div class=\"equip-panel\" style=\"height: 45%\" onclick=\"event.stopPropagation()\" >\n" +
        "        <div class=\"close-btn\" onclick=\"closeDigPanel(false)\">X</div>\n" +
        "         选择要开采的矿种\n" +
        inputstr +
        "<div class='dig-area-options'>" +
        "       <div>数量 <input type=\"text\" name=\"numbers\" value=\"10\" style='width: 6rem' ></div>\n" +
        "       <div><label>周期 </label>" +
        "<select name=\"digTimes\" id=\"digTimesId\" style='width: 6rem'>\n" +
        "<option value=\"1\" >1天</option>\n" +
        "<option value=\"3\">3天</option>\n" +
        "<option value=\"7\" selected>7天</option>\n" +
        "<option value=\"15\">15天</option>\n" +
        "<option value=\"30\">30天</option>\n" +
        "</select>" +
        "        </div>" +
        "</div>"+
        "        <div style=\"width: 100%;text-align: center;margin-top: 1em\" onclick=\"toStartDig()\">\n" +
        "            <span  style='font-size: 1.2em;color: #ffc107'>确定</span>\n" +
        "        </div>\n" +
        "        <div style=\"font-size: 0.5em;text-align: right;width: 100%\">开拓更多矿种</div>\n" +
        "    </div>";

    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeDigPanel(e) {
    const mask = document.getElementById('digMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}


// 点击分享切换显示/隐藏
function toggleSharePanel() {
    const mask = document.getElementById('shareMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeSharePanel(e) {
    const mask = document.getElementById('shareMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

// 点击充值切换显示/隐藏
function toggleRechargePanel() {
    const mask = document.getElementById('rechargeMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeRechargePanel(e) {
    const mask = document.getElementById('rechargeMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

// 点击设置切换显示/隐藏
function toggleSettingPanel() {
    const mask = document.getElementById('settingMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeSettingPanel(e) {
    const mask = document.getElementById('settingMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

// 点击排行榜切换显示/隐藏
function toggleRankingPanel() {
    const mask = document.getElementById('rankingMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeRankingPanel(e) {
    const mask = document.getElementById('rankingMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

// 点击资产切换显示/隐藏
function toggleAssetsPanel() {
    const mask = document.getElementById('assetsMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeAssetsPanel(e) {
    const mask = document.getElementById('assetsMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

// 点击访客切换显示/隐藏
function toggleLvPanel() {
    const mask = document.getElementById('lvMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeLvPanel(e) {
    const mask = document.getElementById('lvMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

// 点击访客切换显示/隐藏
function toggleDefendPanel() {
    const mask = document.getElementById('defendMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeDefendPanel(e) {
    const mask = document.getElementById('defendMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        panelShow = false;
    }
}

// 点击好友切换显示/隐藏
function toggleFriendPanel() {
    const mask = document.getElementById('friendMask');
    panelShow = !panelShow;
    mask.style.display = panelShow ? 'flex' : 'none';
}
// 点击遮罩灰色区域关闭弹窗
function closeFriendPanel(e) {
    const mask = document.getElementById('friendMask');
    const mask2 = document.getElementById('rankingMask');
    if(e==false || e.target === mask) {
        mask.style.display = 'none';
        mask2.style.display = 'none';
        panelShow = false;
    }
}


function reforceMiningArea(i,status){
    currentOptAreaId=i;
    let innerHtml = "";
    if(status==1){
       innerHtml="<div class=\"mine-card\" onclick=\"openMineDetail(1,"+i+")\" id=\"digStatus-1-"+currentOptAreaId+"\">\n" +
           "                <div class=\"mine-name\" style='color: #888888;font-size: 0.4em; font-weight: 100'>" +
           "存入矿种立即开采</div>\n" +
           "                <div class=\"mine-desc\">未开采</div>\n" +
           "      </div>"+
           "<div class=\"mine-card\" onclick=\"openMineDetail(2,"+i+")\" id=\"digStatus-2-"+currentOptAreaId+"\" style=\"display: none\">\n" +
           "                <div class=\"mine-name\">"+coinType[currentSelectCoin]+"</div>\n" +
           "                <div class=\"mine-seeds\">"+miningAreaSeeds[i]+"</div>"+
           "                <div class=\"mine-desc countdown\" id='countdown-h-a-"+i+"'>-:-:-</div>\n" +
           "</div>";
    }else if(status==2){
       innerHtml="<div class=\"mine-card\" onclick=\"openMineDetail(2,"+i+")\">\n" +
           "                <div class=\"mine-name\">"+coinType[currentSelectCoin]+"</div>\n" +
           "                <div class=\"mine-seeds\">"+miningAreaSeeds[i]+"个</div>"+
           "                <div  class=\"mine-times\">周期"+miningAreaDigTimes[i].c+"/"+miningAreaDigTimes[i].t+"</div>"+
           "                <div class=\"mine-desc countdown\" id='countdown-h-a-"+i+"'>-:-:-</div>\n" +
           "      </div>";

    }else if(status==3){
      innerHtml="<div class=\"mine-card\" onclick=\"openMineDetail(3,"+i+")\">\n" +
          "                <div class=\"mine-name\">"+coinType[currentSelectCoin]+"</div>\n" +
          "                <div class=\"mine-seeds\">"+miningAreaSeeds[i]+"个</div>"+
          "                <div  class=\"mine-times\">周期"+miningAreaDigTimes[i].c+"/"+miningAreaDigTimes[i].t+"</div>"+
          "                <div class=\"mine-desc\" id=\"mine-desc-status-1\">可采收</div>\n" +
          "      </div>";
    }else {
       innerHtml="<div class=\"mine-card\" onclick=\"openMineDetail(0,"+i+")\">\n" +
           "                <div class=\"mine-name\" style='color: #888888;font-size: 0.4em; font-weight: 100'>使用探测器开发该区域</div>\n" +
           "                <div class=\"mine-desc\" >未探测</div>\n" +
           "      </div>" ;
    }

    document.getElementById("mine-card-"+i).innerHTML=innerHtml;
}

//倒计时
function updateCountdown() {

    var elements = document.querySelectorAll('.countdown');
    elements.forEach(function(element) {
        //console.log(element); // 输出每个匹配的元素

        if(element.id!=null && element.id.length>5){
            let iid =element.id.split("a-")[1];
            if(miningArea[iid]==2 ){
                const now = new Date();
                const distance = miningAreaDigTimes[iid].startTime - now;
                // 时间计算
                // 总秒数、分钟数、小时数、天数
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                element.innerText = `${hours}:${minutes}:${seconds}`;

                if(miningAreaDigTimes[iid].startTime-new Date()<0){
                    miningArea[iid]=3;
                    console.log(iid);
                    reforceMiningArea(iid,3);
                    now.setSeconds(now.getSeconds()+countdownSeconds);
                    miningAreaDigTimes[iid].startTime=now;
                }
            }
        }
    });

}
// 每秒更新一次倒计时
const interval = setInterval(updateCountdown, 1000);
// 初始调用，显示初始时间
updateCountdown();