
var React = require('react');
var ReactDOM = require('react-dom');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Button = AntdMobile.Button;


module.exports = React.createClass({
    render:function(){
        return (
            <div style={styles.btnBg}>
                <Button
                    onClick={this.props.onClick} 
                    style={styles.btnIcon}
                    >{this.props.content}</Button>
            </div>
        )
    }
})
var styles={
    btnBg:{
        textAlign:'center',
        padding: '15px 0'
    },
    btnIcon:{
        background:'#53DFC5',
        borderRadius: '5px',
        width:'45%',
        color:'#fff'

    }
}