/**
 * 蒙板
 * Created by lip on 2016/7/8.
 */

var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');
var Hammer = require('hammerjs');

var Dimensions = require('../Dimensions');
var GHGuider = require('./GHGuider');
var modalInstance = null;

//排行榜数组
var Modal = React.createClass({

    getInitialState() {
        return {
            display: true,
            content: null
        };
    },

    getPropsType() {
        return {
            hideOnTap: React.PropTypes.bool,
            onHide: React.PropTypes.func
        }
    },




    componentDidMount() {
        if( this.props.hideOnTap === false ) {
            return;
        }

        //添加tap事件
        new Hammer(this.refs.self).on('tap', (e)=>{
            false && console.log('modal tap');

        });
    },

    /**
     * 显示整个组件
     */
    show() {
        this.setState({
            display: true
        });
    },

    /**
     * 隐藏整个组件
     */
    hide() {
        this.setState({
            display: false
        });

        var Util = require('../Util');
        Util.unlockScroll();
    },

    render() {
        let style = this.state.display ? null : { display: 'none' };

        return <div className="modal modal-mask" style={style} ref="self">
            {this.props.children}
        </div>
    }

});


class CommonModal {
    static show(){
        if( modalInstance ){
            modalInstance.show();
        }else {
            modalInstance = ReactDom.render(
                <Modal>
                    <GHGuider blank={false}/>
                </Modal>,
                $('#toast')[0]);
        }
    }
}
window.CommonModal = CommonModal;

module.exports = Modal;