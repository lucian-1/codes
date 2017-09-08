/**
 * Created by Administrator on 17-3-7.
 */
var $ = window.$ = require('jquery');
var React = require('react');
const Modal = require('./Modal');


var Attention = React.createClass({

    getInitialState() {
        return {
            showSuccessPanel: false, //显示弹窗
        }
    },

    componentWillMount() {
        console.log('显示');

    },
    /**
     * 点击模板操作
     */
    onModalHide() {
        console.log('消失');
        this.setState({
            showSuccessPanel: false,
        });
    },
    render() {
        return(
            <div className="attention-panel">
                <Modal onHide={true} >
                <div className="attention-bottom">
                    <img className="User-img" src="./assets48/image/oaImg.png"/>
                    <p className="attention-font">关注投票平台<strong>「万物增长」</strong></p>
                    <p className="attention-font">即可定时接收到投票进度和作者资讯</p>
                    <img className="attentionOa" src="./assets48/image/oaImage.jpg"/>
                    <div onClick={this.onModalHide}><p className="attention-out">取消，继续浏览</p></div>
                </div>
                </Modal>
            </div>
        )
    },

});

module.exports = Attention;