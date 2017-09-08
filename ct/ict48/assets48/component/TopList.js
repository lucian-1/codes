/**
 * Created by Administrator on 17-3-7.
 */
const $ = window.$ = require('jquery');
const React = require('react');
const ReactDom = require('react-dom');
const Timeout = require('./Timeout');
const Material = require('../Material');
const Link = require('react-router').Link;
const IndexLink = require('react-router').IndexLink;


var TopList = React.createClass({

    getInitialState() {
        return {
            rankList: [],
            max:1
        }
    },

    componentWillMount() {
        console.log('TopList');
        this.getTopList();
    },


    /**
     * 获取排行榜
     */
    getTopList() {
        Material.getRankListFromServer().always((rankList)=>{
            console.log('RankList',rankList);

            this.setState({
                rankList
            });

            this.calcProcessBar(rankList);
        });
    },


    /**
     * 点击文章跳转
     * @param url
     * @param title
     * @param name
     */
    clickArticleHandler(url,title,name) {
        if(!url){
            dialogAlertComp.show('提示',
                name+'的文章暂时还没有发布，一会儿再来吧，或者先去看看其他人。',
                '好的',()=>{},'',false);
            return;
        }

        location.href = url;
        Util.postMango({eventName:'文章跳转',GH_ID:title,JumpLink:'排行榜页面'});
    },

    /**
     * 计算长度条单位
     * @param rankList
     */
    calcProcessBar(rankList) {
        let max = rankList[0].votesCase;
        console.log('max',max);

        this.setState({
            max: max
        });
    },

    render() {

        return(
            <div className="top-list">
                <div className="top-list-bottom">
                    <div className="top-time-bottom">
                        <Timeout finalDate={[2017,3,20,24,0,0]}/>
                    </div>


                    {this.renderList()}

                </div>

            </div>
        )
    },

    /**
     * 渲染列表
     * @returns {*}
     */
    renderList() {
        let list = this.state.rankList,
            arr = [];

        if(!list){
            return null;
        }

        let index = 0;
        for(let i of list){
            index++;
            i.index = index;
            //let barWidth = i.votesCase/this.state.balance+'%';
            let barWidth = (100/this.state.max)*i.votesCase+'%';

            arr.push(
                <div className="top-num-bottom">
                    <div className="top-num">
                        <div className="num-left">
                            <Link to={"/writerIntroduce/"+i.oa.oaId}>
                                <img className="num-img" src={i.oa.image} />

                                {i.index == 1 && <img src="./assets48/image/toplist/no1.png" className="num-one"/>}
                                {i.index == 2 && <img src="./assets48/image/toplist/no2.png" className="num-one"/>}
                                {i.index == 3 && <img src="./assets48/image/toplist/no3.png" className="num-one"/>}
                                {i.index > 3 && <div className="vote-rank">{i.index}</div>}
                            </Link>

                        </div>

                        <div className="num-center">
                            <div className="num-bar" style={{width: barWidth,minWidth:'0%',maxWidth:'100%'}}></div>
                            <Link to={"/writerIntroduce/"+i.oa.oaId}>
                                <p className="name-num">{i.oa.name}</p>
                            </Link>
                            <p className="name-art" onClick={this.clickArticleHandler.bind(this,i.url,i.title,i.oa.name)}>{i.title}</p>
                        </div>

                        <div className="num-right" onClick={this.clickArticleHandler.bind(this,i.url,i.title)}>
                            <p>{i.votesCase}票</p>
                        </div>
                    </div>
                </div>
            )
        }
        return arr;
    }
});

module.exports = TopList;