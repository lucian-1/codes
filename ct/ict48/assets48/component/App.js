/**
 * Created by Administrator on 16-11-18.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');

var Material = require('../Material');
const Link = require('react-router').Link;
const IndexLink = require('react-router').IndexLink;
var Util = require('../Util');
const Tabbar = require('./Tabbar');
var OnFire =require('onfire.js');
var User = require('../User');
const GuidePage = require('./GuidePage');


const App = React.createClass({

    getInitialState() {
        return {
            guide : false,
            writerName : '',
        }
    },

    componentWillMount() {
        console.log('App');

        let userInfo = User.getUserInfo(),
            numberId = Util.getIct48Id(),//公号主编号
            userId =userInfo.userId;//用户id

        //判断用户是否是首次进入
        if( !window.localStorage.getItem('guide') ){

            this.setState({
                guide : true
            });

            window.localStorage.setItem('guide','entry');

        }

        //判断用户是否登录
        if(userId){
            Material.postOaIdFromServer(numberId,userId);//从服务器获取公号信息
        }else{
            OnFire.on('OAUTH_SUCCESS',(userId)=>{
                Material.postOaIdFromServer(numberId,userId);//从服务器获取公号信息
            })
        }

        //把userId转换成具体名字
        const NameList = ["B姥爷","lip师兄的投资屋","二十初仲夏的树","观察者","和我不一样的人","六月小兔","暖暖雪","奇奇漫悦读","沙与墨","太匆匆的书","投资二三事儿","挽梨","文宫团","午后呓语","寻找自我的天使","严肃而活泼","言吾悦","野生闺蜜黄小污","一颗狼的树","余小鱼MSYU","周小白补习班","百合学姐的成长小窝","可怜你如花美眷","麦芒说美股"];
        let writerName = NameList[numberId - 1];
        this.setState({
            writerName : writerName
        });

        // 监听首次分享成功
        OnFire.on('SHARE_SUCCESS',this.onShareSuccess);

    },


    /***
     * 首次分享成功后通知后台
     */
    onShareSuccess() {
        let userInfo = User.getUserInfo(),
            userId = userInfo.userId;

        //判断用户是否登录
        if(userInfo.userId){
            Material.firstShare(userId);//首次分享成功后发送请求
        }else{
            OnFire.on('OAUTH_SUCCESS',(userId)=>{
                Material.firstShare(userId);
            })
        }
    },

    onHideHandler() {
        this.setState({
            guide : false
        })
    },

    render() {
        return(
            <div>
                {(this.state.guide == true) && (<GuidePage onHide={this.onHideHandler} writerName={this.state.writerName}/>)}
                {(this.state.guide == false) && (<div>{this.props.children} <Tabbar/></div>)}
            </div>
        )
    }
});

module.exports = App;