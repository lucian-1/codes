var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var Progress = React.createClass({
    getPropType() {
        return {
            activeIndex1:React.PropTypes.number.isRequired//激活的页码
        }
    },

    getInitialState() {
        return {

        }
    },


    render() {
        let style= {};
        if(this.props.activeIndex1==1){
            style.width=34+'%';
        }else if(this.props.activeIndex1==2){
            style.width=68+'%'
        }else{
            style.width=100+'%'
        }

        return <div className="container">
            <div className="weui_progress progress ">
                <div className="weui_progress_bar out_bar" >
                    <div className="weui_progress_inner_bar inner_bar" style={style} ></div>
                </div>
                <span className="now_num">
                    <span className="progress_num">{this.props.activeIndex1}</span>/3
                </span>
            </div>

        </div>
    }
});

module.exports = Progress;