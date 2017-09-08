var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');

var Dimensions = require('../Dimensions');
var Util = require('../Util');
//var User = require('../User');

var ReactRadio=React.createClass({
    getPropTypes (){
        return {
            index: React.PropTypes.number.isRequired,  //编号
            text: React.PropTypes.string.isRequired,  //文案
            checked: React.PropTypes.bool.isRequired, //是否被选中
            value: React.PropTypes.any.isRequired,  //值
            onClick: React.PropTypes.func.isRequired  //点击后的回调函数
        }

    },
    getInitialState (){
        return{
            //display: true  //是否显示
        }
},
    clickHandler() {
        this.props.onClick(this.props.index, this.props.value);//将值与编号传出
    },

    render() {

        let dotStyle;
        if( !this.props.checked ) {
            dotStyle = { display: 'none' };
        }

        return  (<div className="radio" onClick={this.clickHandler}>
            <div className="circle">
                <span className="dot" style={dotStyle}> </span>
            </div>
            <p className="text">{this.props.text}</p>
         </div>)
            }

    });

module.exports = ReactRadio;