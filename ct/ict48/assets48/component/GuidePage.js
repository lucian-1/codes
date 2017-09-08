/**
 * Created by Administrator on 2017/3/15.
 */
const $ = window.$ = require('jquery');
const React = require('react');

let GuidePage = React.createClass({

    getPropsType(){
        return {
            onHide: React.PropTypes.func.isRequired,
            writerName: React.PropTypes.string.isRequired,
        }
    },

    getInitialState() {
        return {
            writerName: this.props.writerName,
        }
    },


    componentWillMount() {
        console.log('TopList');
    },

    /**
     * 点击关闭
     */
    handleClick() {
        this.props.onHide();
    },

    render() {

        return(
            <div className="guide-page">

                <img className="guideImg" src="./assets48/image/guidepage/guide-img.png" />

                <p className="wordOne"><span className="Hi">嗨！</span><span className="YouCome">你来了，</span></p>

                {(this.state.writerName)?(<p className="wordTwo"><span className="writerName">{this.state.writerName}</span>正在参加<span className="WanWu">「万物增长」</span>的首届征文大赛，与其他几十位高手同台PK。
                        需要你的投票支持，为他加油点赞。</p>) : (<p className="wordTwo">这里是「万物增长」，一个为优秀写作者展示的平台。万物成长……这里总有一个作者是你的菜。快去发掘他们，投上你宝贵的一票吧。</p>)}

                <div className="btn" onClick={this.handleClick}>好的</div>

            </div>
        )
    },

});

module.exports = GuidePage;