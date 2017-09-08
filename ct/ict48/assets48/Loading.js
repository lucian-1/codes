/**
 * Created by Administrator on 2016/6/13.
 */
var $ = require('jquery');
var Preloader = require('./Preloader');
var React = require('react');
var ReactDom = require('react-dom');
var Util = require('./Util');

var buildDir = Util.getDomain() + 'build'+ Util.getMinicId() +'/';

const PRELOAD_FILES = [
    buildDir + '8e53482907c88031174d5d251224e053.jpg',//首页背景图
    buildDir + '57072d0f672ce9936baea30e4c9c05a5.png'//BOSS头像
    //buildDir + 'ea089aafad04b1ee6f49b110a919e86d.png'  //课程标题
];
const LOADER_CONTAINER_ID = 'weLoader';

/**
 * 创建一个微信模拟微信原生的loading
 */
var ReactLoader = React.createClass({
    render(){
        return (<div id="weLoadingToast" className="weui_loading_toast">
            <div className="weui_mask_transparent"></div>
            <div className="weui_toast">
                <div className="weui_loading">
                    <div className="weui_loading_leaf weui_loading_leaf_0"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_1"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_2"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_3"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_4"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_5"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_6"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_7"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_8"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_9"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_10"></div>
                    <div className="weui_loading_leaf weui_loading_leaf_11"></div>
                </div>
                <p className="weui_toast_content loader-content">{this.props.text || '加载中...'}</p>
            </div>
        </div>
        );
    }
});

class Loading {
    constructor($loading, $loadPrencetage, $content) {
        //加载界面
        this.$loading = $loading || $('#loading');

        //进度数据显示
        this.$loadPrencetage = $loadPrencetage || $('#loadPrencetage');

        //内容界面
        this.$content =$content || $('#content');
    }

    /**
     * 初始化
     */
    init() {
        let me = this;

        let opt = {
            files: PRELOAD_FILES,
            progress: (para1, para2, percent) => {
                me.$loadPrencetage.html(percent + '%' );
            },

            complete: () => {
                me.$content.show();
                me.$loading.hide();
            }
        };

        new Preloader(opt);

        /**
         * 保证3s内一定显示内容
         */
        setTimeout(()=>{
            me.$content.show();
            me.$loading.hide();
        }, 3000);
    }

    /**
     * 显示loading，隐藏内容
     * @param text  文案
     */
    static showLoading(text) {
        let $weLoader = $('#weLoadingToast');
        if( !$weLoader[0] ) {
            //如果不存在，创建
            ReactDom.render(<ReactLoader />, $('#'+LOADER_CONTAINER_ID)[0]);
        }
        $('.loader-content').html(text);
        $('#'+LOADER_CONTAINER_ID).show();

        //let $loadingContainer = $('#loading'),
        //    $loadingText = $('#loadPrencetage');
        //
        //if( text ) {
        //    $loadingText.html(text);
        //}
        //
        //$loadingContainer.show();
    }

    /**
     * 隐藏loading，显示内容
     */
    static hideLoading(){
        $('#content').show();
        //$('#loading').hide();
        $('#'+LOADER_CONTAINER_ID).hide();
    }
}
Loading.Loader = ReactLoader;
window.Loading = Loading;

module.exports = Loading;