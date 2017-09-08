/**
 * 登录和用户信息控制器
 * Created by lip on 2016/7/20.
 */
var $ = require('jquery');
var Util = require('./Util');
var OnFire = require('onfire.js');

var userInfo = JSON.parse(localStorage.getItem('minicfm-user-info')) || {};
var rankingInfo = []; //排行榜数据
var celebrityList = []; //名人榜数据

var seniorInfo = {};

class User {

    /**
     * 初始化用户信息
     * 非微信浏览器不加载数据
     */
    static initAccessInfo() {
        var Util = require('./Util');

        if( !Util.isWeixin() ) {
            //QQ浏览器中不加载数据
            return;
        }

        //有登录缓存不做登录
        if(localStorage.getItem('FINISH_LOGIN') === 'true'){
            userInfo = JSON.parse(localStorage.getItem('ict48-user-info'));
            console.log('userInfo',userInfo);
            OnFire.fire('OAUTH_SUCCESS',userInfo);

            return;
        }

        if(User.getWxUserInfoFromServer()) {
            //重定向走之后结束动作
            console.log('服务器获取用户信息');
            return;
        }
    }

    /**
     * 拉取服务器端的微信用户信息
     */
    static getWxUserInfoFromServer() {
        var Util = require('./Util');

        //携带在地址栏的code信息
        let code = Util.getUrlPara('code'),
            APIUrl = Util.getAPIUrl('base_login');

        if( !code ) {
            //地址栏里没有code 信息则重定向去微信静默授权
            User.redirectToBaseInfo();
            return true;
        }

        let jsonData = JSON.stringify({'code': code});
        if( Util.getUrlPara('isuserinfo') ) {
            //如果正在请求用户信息，则发送注册请求
            APIUrl = Util.getAPIUrl('userinfo_authorization');

            jsonData =  JSON.stringify({'code': code });
        }


        $.ajax({
            url: APIUrl,//静默授权登录
            data: jsonData,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: (request) => {
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
            success: User.onGetWxInfoSuccess,
            error : User.onGetWxInfoError
        });

    }

    /**
     * 请求微信数据后的回调函数
     * @param data
     */
    static onGetWxInfoSuccess(data) {
        if( !data || !data.userId ) {
            //如果后台没有数据，代表没有授权过，去往snsapi_userinfo授权
            User.redirectToUserinfo();
            return;
        }

        //保存用户信息
        userInfo = {};
        userInfo.userId = data.userId;
        userInfo.sessionId = data.sessionId;
        userInfo.openId = data.openId;
        userInfo.nickName = data.nickName;
        if( userInfo.nickName && userInfo.nickName.length > 10 ){
            userInfo.nickName = userInfo.nickName.substr(0, userInfo.nickName.length-6);
        }

        userInfo.headImage = data.headImage;

        userInfo.subscribe = data.subscribe;//是否关注公众号

        //缓存
        localStorage.setItem('ict48-user-info',JSON.stringify(userInfo));
        localStorage.setItem('FINISH_LOGIN','true');
        console.log('正常登陆 将用户信息做缓存');

        let Util = require('./Util');
        //触发授权登录成功
        OnFire.fire('OAUTH_SUCCESS',userInfo);

        Util.postMango({eventName: 'Login_success',nickname: userInfo.userId});

        // 统计
        Util.postCnzzData('用户登录');

    }


    static getLocalUserInfo() {
        return JSON.parse(localStorage.getItem('minicfm-user-info'));
    }

    /**
     * 获取微信数据失败
     */
    static onGetWxInfoError(data) {
        User.redirectToUserinfo();
    }


    /**
     * 重定向到微信的静默授权页面
     */
    static redirectToBaseInfo() {
        var Util = require('./Util');

        if( Util.getDebugFlag() ) {
            return;
        }

        if( !Util.isWeixin() ){
            //QQ中打开不跳转
            return;
        }

        //不带code的话，强制去静默授权
        let redirectUri = Util.getRedirectUri(),
            scope = 'snsapi_base';//snsapi_userinfo;

        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Util.getAppId() +
            '&redirect_uri=' + redirectUri +
            '&response_type=code' +
            '&scope=' + scope +
            '&state=minic&connect_redirect=1#wechat_redirect';

        window.location.href = url;
    }


    /**
     * 重定向到微信的userInfo授权（会弹出绿色的授权界面）
     */
    static redirectToUserinfo() {
        var Util = require('./Util');

        if( !Util.isWeixin() ){
            //QQ中打开不跳转
            return;
        }

        //不带code的话，强制去静默授权
        let redirectUri = Util.getRedirectUri(true),
            scope = 'snsapi_userinfo';//snsapi_userinfo;

        //记录请求次数，超过3次，则不再请求
        let errCounter = 0;
        if( localStorage.getItem('userInfoErrCounter') ){
            errCounter = parseInt(localStorage.getItem('userInfoErrCounter'));
        }
        if( errCounter > 3 ) {
            localStorage.removeItem('userInfoErrCounter');
            OnFire.fire('OAUTH_FAIL');
            return;
        }else {
            localStorage.setItem('userInfoErrCounter', errCounter+1);
        }

        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + Util.getAppId() +
            '&redirect_uri=' + redirectUri +
            '&response_type=code' +
            '&scope=' + scope +
            '&state=minic#wechat_redirect';

        location.href = url;
    }

    /**
     * 初始化为微信的普通API
     */
    static signWxApi() {
        var Util = require('./Util');

        let url = JSON.stringify({'url': location.href}),
            me = User;

        $.ajax({
            url: Util.getAPIUrl('wx_sign'),
            data: url,
            type: 'post',
            cache: false,
            contentType: 'application/json;charset=utf-8',
            dataType:'json',
            headers: {
                Accept:"application/json"
            },
            beforeSend: (request)=>{
                request.setRequestHeader("X-iChangTou-Json-Api-Token", Util.getApiToken());
            },
            success: (data) => {
                User.wxdata = data;
                me.wxconfig(data);
            },
            error: () => {

            }
        });
    }


    /**
     * 配置微信
     * @param data
     */
    static wxconfig(data) {
        wx.config({
            appId: data.wechat_appid,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'chooseWXPay'
            ]
        });

        wx.ready( () => {
            User.shareConfig();
        });
    }

    /**
     * 分享设置
     */
    static shareConfig(shareTitle,shareDesc) {
        var Util = require('./Util');

        let imgUrl = User.getUserInfo().headImage,
            desc = shareDesc||Util.getShareDesc(),
            title = shareTitle||Util.getShareTitle(),
            link = Util.getShareLink();

        if( !imgUrl ) {
            imgUrl = Util.getDomain() + 'build/share-icon.png';
        }

        let timelineOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('朋友圈');
            },
            cancel: ()=>{
                Util.onShareFailure('朋友圈');
            }
        }, messageOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('消息');
            },
            cancel: ()=>{
                Util.onShareFailure('消息');
            }
        }, QQOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('QQ');
            },
            cancel: ()=>{
                Util.onShareFailure('QQ');
            }
        }, weiboOpt = {
            title,
            desc,
            link,
            imgUrl,
            success: ()=>{
                Util.onShareSuccess('weibo');
            },
            cancel: ()=>{
                Util.onShareFailure('weibo');
            }
        };

        //QQ的分享链接单独设置（为了能在QQ中打开）
        QQOpt.link = Util.getQQShareLink();

        wx.onMenuShareTimeline(timelineOpt);
        wx.onMenuShareAppMessage(messageOpt);
        wx.onMenuShareQQ(QQOpt);
        wx.onMenuShareWeibo(weiboOpt);
    }


    /**
     * 获取内存中记录的用户信息
     * @returns {}
     */
    static getUserInfo() {
        return userInfo;
    }


    /**
     * 获取本地数据
     * @returns {{}}
     */
    static getSeniorInfo() {
        return seniorInfo;
    }

}

window.User = User;

module.exports = User;