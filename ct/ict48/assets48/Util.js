/**
 * 工具类
 * Created by Robot on 2016/7/26
 */
var Group = require('./Group');
var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
var Material = require('./Material');

var Config = require('./Config');
//var Modal = require('./component/Modal');
var GHGuider = require('./component/GHGuider');
var User = require('./User');
var OnFire =require('onfire.js');

const TEST_APPID = 'wxdd25f06df84b18ea';  //测试环境APPID 登录appid（红：长投学习）
const FORMA_APPID = 'wx40fe59ebb6d8a53f'; //正式环境APPI 万物增长
const FORMAL_API_DOMAIN = 'https://m.ichangtou.com/';//生产环境 API域名
const TEST_API_DOMAIN = 'http://devh5.ichangtou.com.cn/';//测试环境 API域名

const API_URL_DOMAIN = Config.environment ? FORMAL_API_DOMAIN : TEST_API_DOMAIN; //开发环境or生产环境
const APPID = Config.environment ? FORMA_APPID : TEST_APPID;

//API TOKEN
const FORMAL_API_Token = 'DE:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e';//生产环境 API Token
const TEST_API_Token = 'XX:_:w2qlJFV@ccOeiq41ENp><ETXh3o@aX8M<[_QOsZ<d8[Yz:NIMcKwpjtBk0e';//测试环境 API Token
const API_Token = Config.environment ? FORMAL_API_Token : TEST_API_Token; //开发环境or生产环境


//mango database
const TEST_MANGO_SERVER = 'http://121.40.131.112:3000';
const FORMAL_MANGO_SERVER = 'https://mongo.ichangtou.com';

const MANGO_SERVER = Config.environment ? FORMAL_MANGO_SERVER : TEST_MANGO_SERVER;


var MINIC_ID = '';  //迷你课买房与资产配置课程ID
const MINIC_NAME = 'ICT48'; //项目名称

const SHARE_TITLE = '万物增长征文大赛，总有一个作者是你的菜。';
const SHARE_DESC = '查看目前排名';

//是否是debug
const IS_DEBUG = location.href.indexOf('localhost') > 0;

//API请求url
const API_URL_GROUP = {
    'get_order': 'payment/wx/jsapi/order',  //获取统一订单
    'wx_sign': 'wx/signature', //微信接口签名
    'userinfo_authorization': 'wx/h5/wwzz/authorization/user-info', //万物增长授权注册
    'base_login': 'wx/h5/wwzz/base/user-info',//万物增长静默登录

    'get_vote_ticket' : 'ict48/votes-case', //获取剩余票数
    'get_vote_number' : 'ict48/focus-oa/{oaId}', //获取公号信息
    'get_article_list' : 'ict48/articles', //文章列表
    'post_vote': 'ict48/vote/{articleId}', //投票
    'get_rank_list': 'ict48/ranking-list',//排行榜
    'put_first_share': 'ict48/share', //首次分享
    'get_personal_data': 'ict48/personal-center', //个人中心
    'get_writer_info': 'ict48/oa-article/{oaId}'  //公号信息

};

class Util {

    /**
     * 获取MangoServer
     * @returns {string}
     */
    static getMangoServer() {
        return MANGO_SERVER;
    }


    /**
     * 发送统计到mangoDB
     * @param data
     * @returns {*}
     */
    static postMango(data){
        return $.ajax({
            url: Util.getMangoServer()+'/event/h5',
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

    }




    /**
     * 获取API token
     * @returns {string}
     */
    static getApiToken(){
        return API_Token;
    }


    /**
     * 获取DOMAIN
     * @returns {string}
     */
    static getAPIDomain() {
        return API_URL_DOMAIN;
    }

    /**
     * 获取链接中的参数内容
     * @param key
     * @returns {Array}
     */
    static getUrlPara( key ) {
        let href = location.href,
            res = href.split( key + '=' );

        if( res[1] ) {
            res = decodeURIComponent(res[1].split('&')[0]);
        }else {
            res = null;
        }
        return res;
    }

    /**
     * 获取html地址
     * @returns {*}
     */
    static getHtmlUrl() {
        return location.href.split('?')[0];
    }

    /**
     * 获取域名
     * @returns {*}
     */
    static getDomain() {
        let href = location.href,
            res = href.split( 'index'+ Util.getMinicId() +'.html' );

        return res[0];
    }

    /**
     * 是否是微信浏览器
     * @returns {boolean}
     */
    static isWeixin() {
        let ua = navigator.userAgent.toLowerCase();
        if( ua.match(/MicroMessenger/i) == 'micromessenger' ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 是否是QQ浏览器
     * @returns {boolean}
     */
    static isMQQBrowser( ) {
        if( Util.isWeixin() ){
            //如果是微信浏览器，则肯定不是QQ浏览器
            return false;
        }

        let ua = navigator.userAgent;
        if( ua.match(/MQQBrowser/i) == 'MQQBrowser' ) {
            //安卓上
            return true;
        } else if( ua.match(/QQ/i) == 'QQ' ) {
            //IOS端
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 是否是IPHONE手机
     */
    static isIphone() {
        let ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('iphone') > 0;
    }

    /**
     * 分享成功
     * @param channel
     */
    static onShareSuccess(channel) {
        Util.shareCommonHandler();

        channel = channel || '';
        Util.postCnzzData('分享成功');

        OnFire.fire('SHARE_SUCCESS');

        let User = require('./User');
        let userInfo = User.getUserInfo();
        Util.postMango({eventName: 'Share_success',nickname:userInfo.userId,channel:channel})
    }

    /**
     * 分享失败
     * @param channel
     */
    static onShareFailure(channel) {
        Util.shareCommonHandler();

        channel = channel || '';
        Util.postCnzzData('分享取消');
        let User = require('./User');
        let userInfo = User.getUserInfo();
        Util.postMango({eventName: 'Share_failure',nickname:userInfo.userId,channel:channel})
    }

    /**
     * 上传统计数据
     * @param eventName  事件名
     * @param eventParam  事件参数
     */
    static postCnzzData(eventName,eventParam){
        if( _czc && _czc.push ){
            if(eventParam){
                if( Util.getUrlPara('ict') ){
                    _czc.push(["_trackEvent", Util.getMinicName(), eventName, eventParam,Util.getUrlPara('ict')]);
                }else{
                    _czc.push(["_trackEvent", Util.getMinicName(), eventName, eventParam]);
                }

            }else{
                if( Util.getUrlPara('ict') ) {
                    _czc.push(["_trackEvent", Util.getMinicName(), eventName, Util.getUrlPara('ict')]);
                }else{
                    _czc.push(["_trackEvent", Util.getMinicName(), eventName]);
                }
            }
        }
    }

    /**
     * 获取API地址
     * @param type
     */
    static getAPIUrl(type) {
        return Util.getAPIDomain() + API_URL_GROUP[type];
    }


    /**
     * 获取公号主编号；
     * @returns {Array}
     * 0为初始值，没有任何公号主
     */
    static getIct48Id() {
        return Util.getUrlPara('ICT48')|| 0;
    }

    /**
     * 获取分享链接
     * @returns {string|*}
     */
    static getShareLink() {
        let redirectUri = Util.getHtmlUrl(),
            link,
            userInfo = User.getUserInfo() || {};

        redirectUri = redirectUri + '?ICT48=' + Util.getIct48Id();

        console.log('share link= ',redirectUri);

        redirectUri = encodeURIComponent(redirectUri);

        link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Util.getAppId() +
            '&redirect_uri=' + redirectUri +
            '&response_type=code' +
            '&scope=' + 'snsapi_base' +
            '&state=minic#wechat_redirect';

        return link;
    }

    /**
     * 获取APPID
     * @returns {string}
     */
    static getAppId() {
        return APPID;
    }

    /**
     * 获取迷你课ID
     * @returns {number}
     */
    static getMinicId() {
        return MINIC_ID;
    }

    /**
     * 获取迷你课名字
     * @returns {string}
     */
    static getMinicName() {
        return MINIC_NAME;
    }

    /**
     * 获取分享标题
     * @returns {string}
     */
    static getShareTitle() {
        return SHARE_TITLE;
    }

    /**
     * 分享时的通用操作
     */
    static shareCommonHandler() {

    }

    /**
     * 获取分享描述
     * @returns {*}
     */
    static getShareDesc() {
        return SHARE_DESC;
    }

    /**
     * debug状态
     * @returns {boolean}
     */
    static getDebugFlag() {
        return IS_DEBUG;
    }

    /**
     * 获取重定向的uri
     * @param {boolean} 是否是做userInfo级别的请求
     * @returns {string}
     */
    static getRedirectUri(isUserInfo) {
        let redirectUri = Util.getHtmlUrl(),
            prefix = '?';


        let ICT48;
        if( ICT48 = Util.getIct48Id() ) {
            //把公号主拼接到地址栏中
            redirectUri = redirectUri  + prefix + 'ICT48=' + ICT48;
            prefix = '&';
        }


        if( isUserInfo ) {
            //区分baseInfo和userInfo
            redirectUri = redirectUri  + prefix + 'isuserinfo=1';
            prefix = '&';
        }


        return encodeURIComponent(redirectUri);
    }

    /**
     * 锁住滚动
     */
    static lockScroll() {
        $('html').addClass('disable-scroll');
    }

    /**
     * 滚动解锁
     */
    static unlockScroll() {
        $('html').removeClass('disable-scroll');
    }



    /**
     * 获取分享到QQ的链接
     */
    static getQQShareLink() {
        let link = Util.getHtmlUrl() + '?ICT48=' + Util.getIct48Id();

        return link;
    }


    /**
     * 朋友圈分享的标题
     */
    static getTimelineTitle(){
        if( Config.gift ) {
            let nickName = User.getUserInfo().nickName;
            return nickName + '邀请你一起做icon';
        }else{
            return SHARE_TITLE;
        }
    }

    /**
     * 获取当前地址
     * @returns {string}
     */
    static getCurrentUrl(){
        if( location.href.indexOf('h5.ichangtou.com') > -1 ){
            //正式环境
            return 'https://h5.ichangtou.com/minic/index48.html'
        }else if(location.href.indexOf('h5test.ichangtou.com.cn') > -1){
            return 'http://h5test.ichangtou.com.cn/minic/index48.html'
        }else{
            return 'http://localhost:63342/ICT48/index.html'
        }

    }

    /**
     * checkTime
     * @returns {string}
     */
    static checkTime (i){
        if(i<10){
            i = "0" + i;
        }
        return i;
    }


    /**
     * 倒计时
     * @returns {string}
     */
    static FormatTime(year,month,day,hour,minute,second){
        let leftTime = (new Date(year,month-1,day,hour,minute,second)) - (new Date()); //计算剩余的毫秒数

        let days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
        let hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
        let minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
        let seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数

        // days = this.checkTime(days);
        // hours = this.checkTime(hours);
        // minutes = this.checkTime(minutes);
        // seconds = this.checkTime(seconds);

       return  [days,hours,minutes,seconds]
    }




}
window.Util = Util;

module.exports = Util;