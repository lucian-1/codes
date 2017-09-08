/**
 * Created by Administrator on 17-3-7.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
const Onfire = require('onfire.js');
const Link = require('react-router').Link;
const IndexLink = require('react-router').IndexLink;
const Modal = require('./Modal');
const Timeout = require('./Timeout');
const Toast = require('./Toast');
const Material = require('../Material');
const VoteSuccessPanel = require('./VoteSuccessPanel');
const Attention = require('./Attention');
const User = require('../User');
require('dropload');


//已加载
var LOADED_FLAG = false;
var ARTICLEARR = [];
var result = [];


const VotePage = React.createClass({

    getInitialState() {
        return {
            voteNum: Material.getVoteTicket(), //剩余投票数
            showSuccessPanel: false, //显示成功页
            showTip: false, //显示提示
            articleArr: [], //文章列表
            oaImage: '', //公众号头像
            oaName: '', //公众号名称
            difference: 0,
            rank: 0,
            votesCase: 0,
            voteCountToday: 0,
            leftVoteCase: 0,
            endVote: false, //截止投票
            showAttention: false //显示公号关注
        }
    },


    componentWillMount() {
        let userInfo = User.getUserInfo();

        if(userInfo.userId){
            //获取剩余票数
            this.getVoteTicket(userInfo.userId);

            //获取文章列表
            this.getArticleList(userInfo.userId);

        }else{
            Onfire.on('OAUTH_SUCCESS',(userInfo)=>{
                this.getVoteTicket(userInfo.userId);

                this.getArticleList(userInfo.userId);
            })
        }

        //todo 测试
        if(!Util.isWeixin()){
            this.getArticleList();
            this.getVoteTicket();
        }

        //首次分享成功后，投票数加一
        Onfire.on('FIRST_SHARE',()=>{
            Toast.show('分享获得一次投票机会~get~');

            this.setState({
                voteNum: this.state.voteNum + 1
            })
        })
    },


    /**
     * 组件销毁前，重设数据
     */
    componentWillUnmount() {
        console.log('componentWillUnmount,componentWillUnmount');
        this.setState({
            articleArr: []
        });

        result = [];
    },

    /**
     * 获取文章列表
     * @param userId
     */
    getArticleList(userId) {
/*        if(LOADED_FLAG){
            result = [];
            for(let i=0,len=ARTICLEARR.length;i<len;i+=5){

                result.push(ARTICLEARR.slice(i,i+5));

            }

            this.setState({
                articleArr:  result[0]
            });

            this.scrollHandler(ARTICLEARR);

            return;
        }*/

        Material.getArticleListFromServer(userId).always((articleList)=>{

            for(let i=0,len=articleList.length;i<len;i+=5){

                result.push(articleList.slice(i,i+5));

            }

            //设置文章列表
            this.setState({
                articleArr: result[0]
            });
            //设置已加载
            LOADED_FLAG = true;

            //设置list
            ARTICLEARR = articleList;

            this.scrollHandler(articleList);
        });
    },


    /**
     * 滑动分页
     * 这里用到了dropload插件
     */
    scrollHandler(articleList) {

        var page = 0;

        $('#scrollTarget').dropload({
            scrollArea : window,
            distance: 50,
            autoLoad: true,
            loadDownFn: (me)=>{

                page++;

                if(articleList.length>0 && page<result.length){

                    this.setState({
                        articleArr: this.state.articleArr.concat(result[page])
                    });

                    me.resetload();

                }else{
                    console.log('没有更多数据');
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData(true);

                    me.resetload();
                }
            }
        });
    },



    /**
     * 获取剩余投票数
     * @param userId
     */
    getVoteTicket(userId) {
        Material.getVoteTicketFromServer(userId).always((data)=>{
            console.log('获取剩余投票数data',data);
            this.setState({
                voteNum: data
            })

        });
    },

    /**
     * 投票
     */
    voteHandler(articleId,image,name,title,oaName) {
        let userInfo = User.getUserInfo();

        //非微信内打开
        if(!Util.isWeixin()){
            Toast.show('请点击右上角分享到微信好友聊天窗口，在微信内打开就可以投票啦',5000);
            return;
        }

        //投票截止
        if(this.state.endVote){
            Toast.show('投票已截止~',3000);
            return;
        }


        //用户未登录
        if(!userInfo.userId){
            Toast.show('您尚未登录，暂时不能投票，请退出重试~',5000);
            return;
        }


        //无投票权利
        if(this.state.voteNum == 0) {
            Toast.show('您今天的投票数已用完，请明天再来吧~',5000);
            return;
        }

        //设置分享配置
        this.setShareConfig(title,oaName);

        Material.vote(articleId,userInfo.userId,userInfo.sessionId).done((result)=>{


            this.setState({
                showSuccessPanel: true,
                oaImage: image,
                oaName: name,
                difference: result.difference,
                rank: result.rank,
                votesCase: result.votesCase,
                voteCountToday: result.voteCountToday,
                leftVoteCase: result.leftVoteCase,
                voteNum: this.state.voteNum - 1
            });
            let userInfo = User.getUserInfo();
            Util.postMango({eventName:'VoteSuccess',nickname:userInfo.userId}); //统计投票
            //投票后操作
            this.afterVoteHandler(articleId);

        })
        .fail((msg)=>{
            Toast.show('投票失败，请稍后重试~');

            Util.postCnzzData('投票失败',msg);
        })
    },


    /**
     * 设置分享配置
     * @param title
     * @param oaName
     */
    setShareConfig(title,oaName) {
        User.shareConfig(oaName+'正在参加「万物增长」征文大赛，快来看排名！');
    },

    /**
     * 投票完成后的操作
     * @param articleId
     */
    afterVoteHandler(articleId) {
        let data = $.extend(true, [], this.state.articleArr);

        for(let i of data){
            if(i.articleId == articleId){
                if(i.difference>0){
                    i.difference = i.difference - 1;
                }
                break;
            }
        }

        this.setState({
            articleArr: data
        })
    },

    /**
     * 点击模板操作
     */
    onModalHide() {
        this.setState({
            showSuccessPanel: false
        });

        let userInfo = User.getUserInfo();
        //未关注公号的用户，引导去关注公号
        if(userInfo.subscribe == false){
            //GHGuider.show('关注公号后可获得最新排行信息~');
            console.log('未关注公号');
            this.setState({
                showAttention: true
            })
        }
    },

    /**
     * 显示tip
     */
    showTipHandler() {
        Toast.show('每人每天有1张投票。每日首次分享可额外获得1票。',5000);
    },


    /**
     * 点击文章跳转
     * @param url
     * @param title
     * @param oaName
     */
    clickArticleHandler(url,title,oaName) {

        if(!url){
            dialogAlertComp.show('提示',
                oaName+'的文章暂时还没有发布，一会儿再来吧，或者先去看看其他人。',
            '好的',()=>{},'',false);

            return;
        }

        location.href = url;
        Util.postMango({eventName:'文章跳转',title:title})
    },

    /**
     * 投票截止操作
     */
    endVoteHandler(){
        this.setState({
            endVote: true
        })
    },

    /**
     * 隐藏关注
     */
    attentionHideHandler() {
        this.setState({
            showAttention: false
        })
    },

    render() {
        return(
            <div className="vote-page">
                <Timeout finalDate={[2017,3,20,24,0,0]} stopVote={this.endVoteHandler}/>
                <p className="vote-ticket">
                    <img src="./assets48/image/votePage/ticket.png" className="clock-image"/>
                    剩余投票券：{this.state.voteNum}张
                    <img src="./assets48/image/votePage/question.png" className="clock-image" onClick={this.showTipHandler}/>
                </p>

                <div ref="contentArea" id="scrollTarget">
                    {this.renderList()}
                </div>


                {this.state.showSuccessPanel && <div onClick={this.onModalHide}><Modal onHide={true} >
                    <VoteSuccessPanel
                        oaImage={this.state.oaImage}
                        oaName={this.state.oaName}
                        difference={this.state.difference}
                        rank={this.state.rank}
                        votesCase={this.state.votesCase}
                        voteCountToday={this.state.voteCountToday}
                        leftVoteCase={this.state.leftVoteCase}/>
                </Modal></div>}


                {this.state.showAttention && <div onClick={this.attentionHideHandler}>
                    <Modal><Attention onHide={this.attentionHideHandler}/></Modal>
                    </div>}
            </div>
        )
    },

    /**
     * 渲染列表
     * @returns {XML}
     */
    renderList() {
        let list = this.state.articleArr,arr = [];

        if(!list){
            return null;
        }

        for(let i of list){

            arr.push(
                <div className="vote-item" >
                    <div className="vote-item-left">
                        {i.favorite == true && <img src="./assets48/image/votePage/idol.png" className="idol-image"/>}
                        <Link to={"/writerIntroduce/"+i.oa.oaId}>
                            <img className="vote-image" src={i.oa.image}/>
                        </Link>
                        {/*<div className="vote-rank">{i.rank+""}</div>*/}
                        <p className="vote-button"
                           onClick={this.voteHandler.bind(this,i.articleId,i.oa.image,i.oa.name,i.title,i.oa.name)}>投票
                        </p>
                    </div>

                    <div className="vote-item-right">
                        <Link to={"/writerIntroduce/"+i.oa.oaId}>
                            <div className="vote-name">
                                <span className="vote-oaname">{i.oa.name}</span>
                            </div>
                        </Link>
                        <p className="vote-article" onClick={this.clickArticleHandler.bind(this,i.url,i.title,i.oa.name)}>《{i.title}》</p>
                        <p className="vote-difference">
                            {i.rank != 1 && <span> 与前一名相差{i.difference}票，</span>}
                            <span> 暂列第{i.rank} </span>
                        </p>

                        {/*<p className="vote-detail">文章详情文章详情文章详情文章详情文章详情文章详情</p>*/}
                    </div>
                </div>

            )
        }

        return arr;
    }
});

module.exports = VotePage;