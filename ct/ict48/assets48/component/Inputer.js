/**
 * 输入框组件
 * Created by lip on 2016/7/26.
 */
var $ = require('jquery');
var React = require('react');
var ReactDom = require('react-dom');
var Util = require('../Util');
var User = require('../User');
var Material = require('../Material');

var DoneToast = require('./DoneToast');
var Toast = require('./Toast');
var OnFire = require('onfire.js');

var Inputer = React.createClass({
    getInitialState() {
        return {
            display: true,//显示页面
            showEditor:false//显示编辑页
        };
    },

    getPropsType() {
        return {
            onSend: React.PropTypes.func.isRequired,
            fmid: React.PropTypes.string.isRequired
            //showEditor:React.PropTypes.bool.isRequired,
            //onFocus: React.PropTypes.func.isRequired,
            //onClick:React.PropTypes.func.isRequired
        }
    },

    componentWillReceiveProps(nextProps) {
          if(nextProps.fmid != this.state.fmid){
              this.setState({
                  fmid: nextProps.fmid
              })
          }
    },


    show() {
        this.setState({
            display: true
        });
    },

    hide() {
        this.setState({
            display: false
        });
    },

    //当输入框发生改变时
    showTextHandler(){
            this.setState({
                showEditor:true
            });
        this.props.onFocus(true);

    },

    //取消输入
    cancelEditHandler(){
        this.setState({
            showEditor:false
        });
        //$(this.refs.textarea).val(null);
        this.props.onClick(false);
    },

    //保存输入内容
    //saveEditHandler(){
    //
    //    this.setState({
    //        showEditor:false
    //    });
    //    let content =$(this.refs.editor_textarea).val();
    //    $(this.refs.textarea).val(content);
    //
    //    this.props.onClick(false);
    //},



    render() {
        let style={};
        this.state.display===false ? style.display='none' : null;

        let mainStyle = {} , editorStyle = {};
        mainStyle.display = this.state.showEditor ? 'none' : 'block';
        editorStyle.display = this.state.showEditor ? 'block' : 'none';

        return (<div style={style} >
            <div className="input-container "style={mainStyle}>
                <textarea className="textar " ref="textarea"
                      placeholder="课程如此精彩，说出你的感想吧~"
                          onFocus={this.showTextHandler}>
                </textarea>
                <div  className="send-button ">发送</div>
            </div>

            <div className="edited_panel" style={editorStyle}>
                <div className="btn">
                    <img  src ="build/back.png"style={{width:'2.5rem'}}className="cancel_btn" onClick={this.cancelEditHandler}/>
                </div>
                <div className="text_border">
                    <textarea  className="text_area"
                               autofocus="autofocus"
                               ref="editor_textarea"
                               cols="4" rows="5"
                               placeholder="课程如此精彩，说出你的感想吧~" >
                    </textarea>
                </div>
                <div className="send">
                    <div  className="send-button save_btn" onClick={this.sendHandler}>发送</div>
                </div>
            </div>

        </div>);
    },

    getComment() {
        let comment = '';
        if( this.refs.editor_textarea ) {
            comment = $(this.refs.editor_textarea).val();
        }

        return comment.trim();
    },

    /**
     * 发送事件句柄
     */
    sendHandler() {

        this.setState({
            showEditor:false
        });
        this.props.onClick(false);

        let comment = this.getComment(),
            userInfo = JSON.parse(localStorage.getItem('minicfm-user-info')) || User.getUserInfo();

        if( !comment || !userInfo.userId ) {
            //没有内容或没有用户名时不提交
            return null;
        }

      /*  if(userInfo && userInfo.subscribe===false){
            Toast.show('先关注公号，才能评论噢~');
            return;
        }*/

        let fmid = this.state.fmid;

        Material.postCommentsToServer(fmid,comment,'Y',userInfo)
        .done(()=>{
            DoneToast.show('提交评论成功');
        })
        .fail(()=>{
            Toast.show('提交失败');
        });

        this.props.onSend(this.getComment());

        $(this.refs.editor_textarea).val(null);
    }
});


module.exports = Inputer;