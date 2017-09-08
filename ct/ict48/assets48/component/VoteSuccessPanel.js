/**
 * Created by Administrator on 17-3-7.
 */
const React = require('react');

const VoteSuccessPanel = React.createClass({

    getPropsType() {
        return {
            difference: React.PropTypes.number.isRequired,//差额
            rank: React.PropTypes.number.isRequired,//排名
            votesCase: React.PropTypes.number.isRequired, //得票数
            voteCountToday:  React.PropTypes.number.isRequired, //已投票数
            leftVoteCase:  React.PropTypes.number.isRequired, //未投票数
            oaImage: React.PropTypes.string.isRequired, //公众号头像
            oaName: React.PropTypes.string.isRequired //公众号名称
        }
    },

    getInitialState() {
        return {
            difference: this.props.difference,
            rank: this.props.rank,
            votesCase: this.props.votesCase,
            voteCountToday: this.props.voteCountToday,
            leftVoteCase: this.props.leftVoteCase,
            oaImage: this.props.oaImage,
            oaName: this.props.oaName
        }
    },
    componentWillReceiveProps(nextProps) {
        console.log('nextProps',nextProps);
        //if(this.state.oaName != nextProps.oaName){
            this.setState({
                oaImage: nextProps.oaImage,
                oaName: nextProps.oaName,
                difference: nextProps.difference,
                rank: nextProps.rank,
                votesCase: nextProps.votesCase,
                voteCountToday: nextProps.voteCountToday,
                leftVoteCase: nextProps.leftVoteCase
            });
        //}
    },
    /**
     * 显示分享操作
     */
    showShareHandler() {

        alert('hi');
    },
    render() {

        console.log('this.state.oaImage',this.state.oaImage);
        return (
            <div className="vote-success">
                <div className="success-parent">
                    <div className="success-bottom">
                        <h3 className="vote-title">投票成功</h3>
                        <p className="vote-detail">今日已投{this.state.voteCountToday}票，剩余{this.state.leftVoteCase}票</p>
                        <img className="vote-author" src={this.state.oaImage}/>
                        <p className="vote-detail">{this.state.oaName}已获得{this.state.votesCase}票</p>
                        <p className="vote-detail">目前排名第{this.state.rank}位</p>
                        <span className="share-font">点击右上角分享，通知好友来投票</span>
                        <p className="vote-share">*本日首次分享可获得1张投票</p>
                    </div>
                </div>
            </div>
        )
    }

});

module.exports = VoteSuccessPanel;