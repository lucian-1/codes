/**
 * Created by Administrator on 2017/3/8.
 */

var React = require('react');
var ReactDom = require('react-dom');
var Material = require('../Material');
const Modal = require('./Modal');

var Link = require('react-router').Link;
const IndexLink = require('react-router').IndexLink;

var LOADED_FLAG = false;
var GH_Info = null;

var WriterIntroduce = React.createClass({

    getInitialState() {
        return{
            oaId : this.props.params.oaId,   //公号Id
            GH_info:{
                name : "",
                intro : "",    //公号介绍
                image : "",
                articles : [],
                wxId : null,
                showCheckInPanel: false   //模态层开关
            },
        }
    },

    componentWillMount() {

        let userInfo = User.getUserInfo();
        let oaId = this.state.oaId;
        let userId = userInfo.userId;
            // Material.GetGhInfo(oaId,userId,this.processData);
        Material.GetGhInfo(oaId,userId).always((data)=>{
            this.processData(data);

        })
    },

    processData (data){
        console.log(data);
        let GH_info = {
                image : data.image,
                intro : data.desc,
                name : data.name,
                articles : data.articles,
                qrImage : data.qrImage,
                wxId : data.wxId
            };

        //设置信息
        GH_Info = GH_info;

        //设置页面信息
        this.setState({
            GH_info : GH_info
        })

    },

    modalClickHandler() {
        this.setState({
            showCheckInPanel: false
        })
    },
    qrhandleClick() {
        this.setState({
            showCheckInPanel: true
        })
    },
    /**
     * 点击文章跳转
     * @param url
     * @param title
     */
    clickArticleHandler(url,title) {
        if(!url){
            dialogAlertComp.show('提示',
                this.state.GH_info.name+'的文章暂时还没有发布，一会儿再来吧，或者先去看看其他人。',
                '好的',()=>{},'',false);

            return;
        }

        location.href = url;
        Util.postMango({eventName:'文章跳转',essay:title,JumpLink:'公号主详情页'});
    },

    render() {
        return(
            <div className="WriterIntroduce">
                <div className="banner">
                    <img src={this.state.GH_info.image} className="avatar"/>
                    <div className="GH_name">{this.state.GH_info.name}</div>
                    {/*{this.state.GH_info.wxId == null ? (null) : (<div className="wx_code">微信号：{this.state.GH_info.wxId}</div>)}*/}
                    <div className="intro">{this.state.GH_info.intro}</div>
                    <div className="btn_saoma" onClick={this.qrhandleClick}>扫码关注</div>
                    {
                        this.state.showCheckInPanel && <div onClick={this.modalClickHandler}><Modal hideOnTap={true}>
                            <img src={this.state.GH_info.qrImage} className="qr_code"/>
                        </Modal></div>
                    }
                </div>
                {this.renderList()}
            </div>
        )
    },


    /**
     * 渲染列表
     *  <Link to={i.url}>
     * @returns {XML}
     */
    renderList() {
        let list = this.state.GH_info.articles,arr = [];

        for(let i of list){
            arr.push(
                <div onClick={this.clickArticleHandler.bind(this,i.link,i.title)} className="item">
                    <div className="name">《{i.title}》</div>
                    <div className="time">{i.createTime}</div>
                </div>
            )
        }

        return arr;
    }
});

module.exports = WriterIntroduce;
