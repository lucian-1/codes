/**
 * 进度条
 * Created by doudou on 16-8-15.
 */

var React = require('react');

var Progresser = React.createClass({

    getPropsType() {
        return {
            alignPos: React.PropTypes.string.isRequired,
            outerWidth: React.PropTypes.string.isRequired,
            process: React.PropTypes.number.isRequired,
            color: React.PropTypes.string.isRequired
        }
    },

    render() {
        let style={};
        style.backgroundColor = this.props.color;
        style.width = this.props.process  * 100 +'%';
        style.textAlign = this.props.alignPos;
        let outerStyle={};
        outerStyle.width = this.props.outerWidth  * 100 +'%';
        outerStyle.textAlign = this.props.alignPos;

        return(
            <div className="outer-progress" style={outerStyle}>
                <span className="inner-progress" style={style}></span>
            </div>

        )
    }
});

module.exports = Progresser;
