/**
 * Created by Administrator on 17-2-24.
 */
const React = require('react');
const ReactDom = require('react-dom');
const $ = require('jquery');
const Link = require('react-router').Link;

const TitleBar = React.createClass({

    getPropsType() {
        return {
            title: React.PropTypes.string
        }
    },


    backHandler() {
        history.back();
    },


    render() {

        return ( <div className="title-bar">
            <img className="back" onClick={this.backHandler} src="./assets/image/bar/back.png"/>
            <span className="title">{this.props.title || ''}</span>
        </div>)
    }

});
module.exports = TitleBar;