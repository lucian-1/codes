/**
 * Created by lip on 2016/6/3.
 */
var $ = window.$ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
var OnFire = require('onfire.js');

var Dimensions = require('./Dimensions');
var Util = require('./Util');
var User = require('./User');
var Group = require('./Group');
var Loading = require('./Loading');

var Material = require('./Material');

var WxConfig = require('./WxConfig');
const DialogAlert = require('./component/DialogAlert');

var InnerRouter = require('./InnerRouter');

var style = require('./css/style.scss');

$(document).ready(() => {
    //尺寸初始化
    new Dimensions().init();


    //初始化用户信息
    User.initAccessInfo();

    //初始化微信配置
    WxConfig.initWxConfig();

    //非微信客户端打开，则提示在微信中打开页面
    if(!Util.isWeixin()){
        //隐藏loading
        $('#loading').hide();
        ReactDom.render(<InnerRouter/>, $('#root')[0]);
        return;
    }

    //$('#loading').hide();
    //ReactDom.render(<InnerRouter/>, $('#root')[0]);

    OnFire.on('OAUTH_SUCCESS',()=>{
        //隐藏loading
        $('#loading').hide();
        ReactDom.render(<InnerRouter/>, $('#root')[0]);
    });
    OnFire.on('OAUTH_FAIL',()=>{
        //隐藏loading
        $('#loading').hide();
        ReactDom.render(<InnerRouter/>, $('#root')[0]);
    });

});