/**
 * Created by Administrator on 17-3-7.
 */
var $ = window.$ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
var Util = require('../Util');
var User = require('../User');
var Material = require('../Material');
var Link = require('react-router').Link;
var OnFire = require('onfire.js');
const IndexLink = require('react-router').IndexLink;


var PersonCenter = React.createClass({

    getInitialState() {
        return{
            avatar_src : "", //头像
            name : "",
            votesCase : "",    //获得的投票总数
            ArticleList: [],
            oaId : "",    //公号Id
            intro : ""
        }
    },

    componentWillMount() {

        let userInfo = User.getUserInfo();

        if(userInfo.userId){
            Material.GetPersonalInfo(userInfo.userId,this.processData);
        }else{
            OnFire.on('OAUTH_SUCCESS',(userInfo)=>{
                Material.GetPersonalInfo(userInfo.userId,this.processData);
            })
        }

    },

    processData(data){
        console.log(data);
        let userInfo = User.getUserInfo();
        let Image = userInfo.headImage;
        let avatar_src = '',name = '',oaId = '',intro = '';
        let votesCase = data.votesCase;
        let ArticleList = data.recentArticle;

        if(data.favoriteOa == null){
            avatar_src = Image;
            name = null;
        }else{
            avatar_src = data.favoriteOa.image;
            name = data.favoriteOa.name;
            oaId = data.favoriteOa.oaId;
            intro = data.favoriteOa.desc;
        }

        this.setState({
            avatar_src:avatar_src,
            name : name,
            votesCase : votesCase,
            ArticleList : ArticleList,
            oaId : oaId,
            intro : intro
        });
    },

    /**
     * 点击文章跳转
     * @param url
     * @param title
     */
    clickArticleHandler(url,title) {
        if(!url){
            dialogAlertComp.show('提示',
                this.state.name+'的文章暂时还没有发布，一会儿再来吧，或者先去看看其他人。',
                '好的',()=>{},'',false);

            return;
        }

        location.href = url;
        Util.postMango({eventName:'文章跳转',essay:title,JumpLink:'个人中心下文章列表'});
    },

    /**
     * 头像跳转次数统计
     * @param name
     */
    handleLink(name) {
        Util.postMango({eventName:'头像跳转',WriterName:'name'});
    },

    render() {

        return(
            <div className="personalCenter">

                <div className="title">我最喜爱的作者</div>
                <div className="avatar">
                    <Link onClick={this.handleLink(this.state.name)} to={"/writerIntroduce/" + this.state.oaId}>
                        <img src={this.state.avatar_src} className="photo"/>
                    </Link>
                    {(this.state.name == null) ? (<Link to={"/VotePage/"}><p className="goVotepage">您还没有喜欢的作者，点击为喜欢的作者投票吧</p></Link>) : (<div><p className="writer_name">{this.state.name}</p>
                            <p className="WriterIntroduce"> {this.state.intro}</p></div>)}
                </div>
                <div className="title">你已经累积投出</div>
                <div className="personal_vote">
                    <p className="vote_number">{this.state.votesCase} <span className="Piao">票</span></p>
                </div>
                <div className="title">最近投票的文章</div>
                <div className="article_list">
                    {this.renderList()}
                </div>
            </div>
        )
    },


    /**
     * 渲染列表
     *  <Link to={i.url}>
     * @returns {XML}
     */
    renderList() {
        let list = this.state.ArticleList,arr = [];

        if( list == null){
            return null
        }

        for(let i of list){
            arr.push(
                <p onClick={this.clickArticleHandler.bind(this,i.url,i.title)}>《{i.title}》</p>
            )
        }

        return arr;
    }
});

module.exports = PersonCenter;