/**
 * Created by Administrator on 16-8-18.
 */
var React = require('react');
var Hammer = require('Hammerjs');

var MathUtil = require('../MathUtil');
//var Hammer = require('react-hammerjs');

var _plusTimer;
var _minusTimer;

var PlusMinus = React.createClass({

    getPropsType() {
        return {
            defaultValue: React.PropTypes.number.isRequired, //默认值
            cash: React.PropTypes.number.isRequired, //最大值
            onChange: React.PropTypes.func.isRequired //value change
        }
    },

    getInitialState() {
        return{
            value: this.props.defaultValue,
            plusEnable: true //可使用
        }
    },

    /**
     * 减法
     */
    minus() {
        let oldValue = this.state.value,
            newValue;

        if(oldValue <= 0){
            newValue = 0;
            this.setState({
                value: newValue
            });
            return;
        }

        if(oldValue < 1){
            newValue = 0;
        }else{
            newValue = oldValue - 1;
        }

        this.setState({
            value: newValue,
            plusEnable: true
        });

        this.props.onChange(newValue, oldValue);

    },

    /**
     * 加法
     */
    plus() {
        if(this.props.cash < 1){
            return;
        }

        let oldValue = this.state.value,
            newValue = oldValue + 1;

        console.log('newValue',newValue);
        console.log('oldValue',oldValue);

        if(newValue >= this.props.cash){
            this.setState({
                plusEnable: false
            });

        }

        if(newValue> this.props.cash){
            return
        }

        this.setState({
            value: newValue,
            plusEnable: true
        });

        this.props.onChange(newValue,oldValue);
    },

    /**
     * 获取当前值
     * @returns {*}
     */
    getValue() {
        return this.state.value;
    },


    pressMinusHandler(event) {
        event.preventDefault();

        for( let i = 0; i < 10; i++ ) {
            this.minus();
        }
    },

    pressUpMinusHandler() {
        //this._minusTimer && clearInterval(this._minusTimer);
        //alert('pressUpMinusHandler');
    },

    pressPlusHandler(event){
        event.preventDefault();

        for( let i = 0; i < 10; i++ ) {
            this.plus();
        }
    },

    pressUpPlusHandler(){
        //this._plusTimer && clearInterval(this._plusTimer);
        //alert('pressUpPlusHandler');
    },

    /**
     * 添加press事件
     */
    componentDidMount() {
        let minusHammer = new Hammer.Manager(this.refs.minusButton),
            plusHammer = new Hammer.Manager(this.refs.plusButton);

        minusHammer.add(new Hammer.Press({time: 200}));
        plusHammer.add(new Hammer.Press({time: 200}));

        minusHammer.on('press', this.pressMinusHandler);
        minusHammer.on('pressup', this.pressUpMinusHandler);

        this.refs.minusButton.addEventListener('click', this.minus);
        //this.refs.minusButton.addEventListener('touchstart', (e)=>{
        //    e.preventDefault();
        //});
        //minusHammer.on('tap', this.minus);

        plusHammer.on('press', this.pressPlusHandler);
        plusHammer.on('pressup', this.pressUpPlusHandler);
        //minusHammer.on('tap', this.plus);
        this.refs.plusButton.addEventListener('click', this.plus);
        //this.refs.plusButton.addEventListener('touchstart', (e)=>{
        //    e.preventDefault();
        //});

    },

    preventDefault(e) {
        e.preventDefault();
    },

    render() {
        let minusCls,plusCls;

        plusCls =  !this.state.plusEnable ? 'button-disabled' : '';
        minusCls = this.state.value == 0 ? 'button-disabled' : '';

        return(
            <div className="pm-item">

                <div className={minusCls+" minus"}

                     ref="minusButton">--</div>

                <div className="num">{MathUtil.toFixed(this.state.value,1)}</div>

                <div className={plusCls+" plus"}

                     ref="plusButton">+</div>

            </div>
        )
    }
});

module.exports = PlusMinus;
