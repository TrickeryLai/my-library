var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');



module.exports=React.createClass({
    getInitialState:function(){
        this.getScript();
        return {
            videoHtml:'<div style="height:50%;padding-bottom:50px"><p style="margin: 0;text-align: center;color: #ddd;padding:5px">视频播放</p><gs:video-vod id="videoComponent" site="'+this.props.location.state.url+'" ctx="webcast" ownerid="'+this.props.location.state.rId+'" uname="'+localStorage.getItem('liveName')+'"authcode="'+this.props.location.state.pass+'"/></div><div style="height:45%"><gs:doc id="docComponent" ctx="webcast" site="'+this.props.location.state.url+'" ownerid="'+this.props.location.state.rId+'"/></div>'            
        }
    },
    getScript:function(){
        if(document.getElementById('myScript')){
            document.getElementById('myScript').remove();
        }
        var jcript = document.createElement('script');
        jcript.src='http://static.gensee.com/webcast/static/sdk/js/gssdk.js';
        jcript.type='text/javascript';
        jcript.id = 'myScript';
        document.getElementsByTagName('head')[0].appendChild(jcript);
        document.getElementsByTagName('html')[0].setAttribute('xmlns:gs','http://www.gensee.com/ec');
    },
    componentDidMount:function(){
        var script = document.getElementsByTagName('script');
        for(var i= 0;i<=script.length;i++){
            if(script[i].src && script[i].src.indexOf('mediportal') > -1){
                window.location.reload(); //刷新，第二次进来不会播放
            }
        }
    },
    
    componentWillUnmount:function(){
        document.getElementsByTagName('html')[0].removeAttribute('xmlns:gs');
        document.getElementById('myScript').remove();
        this.setState({
            videoHtml :''
        })
    },
    render:function(){
        console.log(this.props.location.state.rId);
        return (
            <div style={styles.body}>
                <div dangerouslySetInnerHTML ={{__html:this.state.videoHtml}} style={styles.body}></div>
            </div>
        )
    }


})
var styles={
    body:{
        width:'100%',
        height:'100%',
        background: '#000'
    },
    textP:{
        margin:'0',
        color:'#ddd',
        textAlign:'center'
    }
}