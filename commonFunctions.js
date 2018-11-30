//1. gps 坐标点转 百度地图 坐标
function GpsToBaiduPoint(point){
  var _t = wgs2bd(point.lat,point.lng);
  var _BPoint = new BMap.Point(_t[1], _t[0]);
  return _BPoint;
}

//1.1 转换的核心代码 下
var pi = 3.14159265358979324;
var a = 6378245.0;
var ee = 0.00669342162296594323;
var x_pi = 3.14159265358979324*3000.0/180.0;


function wgs2bd(lat,lon) {
  var wgs2gcjR = wgs2gcj(lat, lon);
  var gcj2bdR = gcj2bd(wgs2gcjR[0], wgs2gcjR[1]);
  return gcj2bdR;
}

function gcj2bd(lat,lon) {
  var x = lon, y = lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  var bd_lon = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  var result = [];
  result.push(bd_lat);
  result.push(bd_lon);
  return result;
}

function bd2gcj(lat,lon) {
  var x = lon - 0.0065, y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lon = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  var result = [];
  result.push(gg_lat);
  result.push(gg_lon);
  return result;
}

function wgs2gcj(lat,lon) {
  var dLat = transformLat(lon - 105.0, lat - 35.0);
  var dLon = transformLon(lon - 105.0, lat - 35.0);
  var radLat = lat / 180.0 * pi;
  var magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  var sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
  dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
  var mgLat = lat + dLat;
  var mgLon = lon + dLon;
  var result = [];
  result.push(mgLat);
  result.push(mgLon);
  return result;
}

function transformLat(lat,lon) {
  var ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon + 0.2 * Math.sqrt(Math.abs(lat));
  ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lon * pi) + 40.0 * Math.sin(lon / 3.0 * pi)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lon / 12.0 * pi) + 320 * Math.sin(lon * pi  / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLon(lat,lon) {
  var ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 * Math.sqrt(Math.abs(lat));
  ret += (20.0 * Math.sin(6.0 * lat * pi) + 20.0 * Math.sin(2.0 * lat * pi)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * pi) + 40.0 * Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lat / 12.0 * pi) + 300.0 * Math.sin(lat / 30.0 * pi)) * 2.0 / 3.0;
  return ret;
}

//2. “毫秒” 转换 “时分秒”的函数 下
function toTime(value) {
  var hour=0;
  var min=0;
  var second=0;
  if(value>=3600){
    hour=parseInt(value/3600);
    if(value-hour*3600>=60){
      min=parseInt((value-hour*3600)/60);
      second=value-hour*3600-min*60;
   }else{
     second=value-hour*3600;
   }
}else{
  if(value>=60){
    min=parseInt((value)/60)
    second=value-min*60;
}else{
   second=value;
 }
}
return {hour:hour,min:min,second:second}
}

//3. echarts截图函数  下
function downloadImpByChart(chartId,echart) {
  var myChart = echart.getInstanceByDom(document.getElementById(chartId));
  var url = myChart.getConnectedDataURL({
    pixelRatio: 5,　　//导出的图片分辨率比率,默认是1
    backgroundColor: '#fff',　　//图表背景色
    excludeComponents:[　　//保存图表时忽略的工具组件,默认忽略工具栏
      'toolbox'
    ],
    type:'png'　　//图片类型支持png和jpeg
  });
  var $a = document.createElement('a');
  var type = 'png';
  $a.download = myChart.getOption().title[0].text + '.' + type;
  $a.target = '_blank';
  $a.href = url;
// Chrome and Firefox
  if (typeof MouseEvent === 'function') {
    var evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false
    });
    $a.dispatchEvent(evt);
  }
// IE
  else {
    var html = '' + '<body style="margin:0;">' + '<img src="' + url + '" style="max-width:100%;" title="' + myChart.getOption().title[0].text + '" />' + '</body>';
    var tab = window.open();
    tab.document.write(html);
  }
}

//4. 获取当前日期，格式YYYY-MM-DD  下
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

//5.1 数组升序函数  下
function orderA(a) {     //升序函数
    for(var i=0;i<a.length;i++){
        for(var j = i + 1;j<a.length;j++){
            if(a[i]>a[j]){
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
        }
    }
}
//5.2 数组降序函数  下
function orderD(a) {     //降序函数
    for(var i=0;i<a.length;i++){
        for(var j = i + 1;j<a.length;j++){
            if(a[i]<a[j]){
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
        }
    }
}

//6. 获取浏览器窗口的长宽
function getClientWidthAndHeight() {
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    return:{clientW:w,clientH:h}
}


/*导出以上函数*/
const commonFunction={
  GpsToBaiduPoint:GpsToBaiduPoint,
  toTime:toTime,
  orderA:orderA,
  orderD:orderD,
  downloadImpByChart:downloadImpByChart,
  getNowFormatDate:getNowFormatDate,
    getClientWidthAndHeight:getClientWidthAndHeight

}
module.exports=commonFunction;
