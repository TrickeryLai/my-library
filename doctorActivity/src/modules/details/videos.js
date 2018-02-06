var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');



module.exports=React.createClass({
    getInitialState:function(){
        return {
            url:''
        }
    },
    componentDidMount:function(){
        this.createIfromUrl()
    },
    createIfromUrl:function(){
        if(this.props.location.state.status==1){
            this.setState({
                url:this.props.location.state.url+'?nickName='+localStorage.getItem('liveName')+'&token='+this.props.location.state.pass
            })
        }else{
            this.setState({
                url:this.props.location.state.url+'&nickName='+localStorage.getItem('liveName')
            })
        }
        
    },
    render:function(){
      
        return (
            <div style={{width:'100%',height:'100%',maxWidth:'100%'}}>
                <iframe scrolling="no" src={this.state.url} frameborder="0" id="gsplayeriframeid" style={{width:'100%',height:'100%',maxWidth:'100%'}}>

                </iframe>
            </div>
        )
    }




})