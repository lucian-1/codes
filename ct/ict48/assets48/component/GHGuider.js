/**
 * 公号引导者
 * Created by lip on 2016/6/30.
 */

var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
var Hammer = require('hammerjs');

var Group = require('../Group');
var Modal = require('./Modal');

/**
 * props:
 *  text: 头部的引导文案
 */
var GHGuiderComp = React.createClass({

    getPropType() {
        return {
            text: React.PropTypes.string //引导文案
        }
    },

    getInitialState(){
        return {
            display: true,
            text: ''
        };
    },

    show(text) {
        this.setState({
            display: true,
            text
        });
    },

    hide() {
        this.setState({
            display: false
        });
    },

    render() {

        let displayCls = this.state.display ? 'show' : 'hide';

        return (
            <div id="guiderComponent"
                 className={"GH-guider " + displayCls}
                 style={this.props.style}
                 ref="container"
                 onClick={this.hide}>
                <p className="qrcode-desc">{this.state.text}</p>
                <img src={"./assets48/image/tousha-qrcode.jpg"} className='qrcode-img' />

            </div>
        );

    }
});

module.exports = GHGuiderComp;

var GHGuiderInstance = null;

class GHGuider {
    static show(text){
        if( GHGuiderInstance ){
            GHGuiderInstance.show(text);
        }else {
            GHGuiderInstance = ReactDom.render(<GHGuiderComp text={text}/>, $('#guide')[0]);
        }

        GHGuiderInstance.setState({
            text: text
        });
    }

    static hide(){
        if( GHGuiderInstance ){
            GHGuiderInstance.hide();
        }
    }
}
window.GHGuider = GHGuider;