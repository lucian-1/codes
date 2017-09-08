/**
 * 动作完成的toast
 * Created by Robot on 2016/7/10.
 */
var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');

var doneToastInstance = null;

var DoneToastComp = React.createClass({
    getPropsType() {
        return  {
            time: React.PropTypes.number //显示持续时间
        };
    },

    getDefaultProps() {
      return {
          time: 3000
      }
    },

    onTransitionEnd() {
        console.log('onTransitionEnd');
    },
    getInitialState() {
        return {
            hide: false,
            text: '已完成'
        };
    },

    show(time) {
        time = time || 3000;

        this.setState({
            hide: false
        });

        setTimeout(this.hide, time);
    },

    componentDidMount(){
        setTimeout(this.hide, 3000);
    },

    hide() {
        this.setState({
            hide: true
        });
    },

    onMaskTouchEnd() {
        this.hide();
    },

    render(){
        let hide = this.state.hide ? 'hide' : '',
            text = this.state.text || this.props.text;

        return (
            <div ref="self" className={"done-toast " + hide} onTransitionEnd={this.onTransitionEnd}>
                <div className="weui_mask_transparent" onTouchEnd={this.onMaskTouchEnd}></div>
                <div className="weui_toast">
                    <i className="weui_icon_toast"></i>
                    <p className="weui_toast_content">{text}</p>
                </div>
            </div>
        );
    }
});

class DoneToast {
    static show(text, time){
        if( doneToastInstance ){
            doneToastInstance.show(time);
        }else {
            doneToastInstance = ReactDom.render(<DoneToastComp time={time} />, $('#toast')[0]);
        }

        doneToastInstance.setState({
            text: text
        });
    }
}
window.DoneToast = DoneToast;

module.exports = DoneToast;