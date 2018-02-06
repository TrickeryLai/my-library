var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Button = AntdMobile.Button;


module.exports = React.createClass({
    getInitialState:function(){
        return {}
    },
    render:function(){
        return(
            <div style={styles.btnBg}>
                <span
                    onClick={this.props.onClick} 
                    style={styles.btnIcon}
                    >{this.props.content}</span>
            </div>
        )
    }
})
var styles={
    btnBg:{
        background:'rgba(255,255,255,0.95)',
        width:'100%',
        border:'0 solid #E5E5E5',
        position: 'absolute',
        bottom: 0,
        textAlign:'center',
        padding:'5px 0',
        boxShadow: '1px 11px 3px 10px #666',
        zIndex:'10'
    },
    btnIcon:{
        background:'#4BA7F7',
        borderRadius: '5px',
        width:'98%',
        color:'#fff',
        display:' inline-block',
        padding:' 8px 0',

    }
}