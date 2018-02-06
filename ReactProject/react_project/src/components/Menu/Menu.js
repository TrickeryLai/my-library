
/*jshint esversion:6*/

import React ,{Component}from 'react';
import {Link} from 'react-router-dom';

let style = {
    a:{
        margin:"0 10px",
    },
    menuList: {
        position: "absolute",
    }
};

class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            url: '123.jpg',
            linkData: {
                "commentApp":{
                    url: '/commentApp',
                    txt: 'Comment'
                },
                "zoom":{
                    url: '/zoom',
                    txt: 'zoom'
                },
                "calculate":{
                    url: '/calculate',
                    txt: 'Calculate'
                },
                "maze":{
                    url: '/maze',
                    txt: 'Maze'
                }
            }
        };
    }
    componentWillMount(){
        //设置zoom 参数
        // let data = {
        //         id: 11
        //     },
        //     zoomUrl = this.state.linkData.zoom.url,
        //     url = {
        //         pathname: zoomUrl,
        //         query: data
        //     };
        //
        // this.setLinkData('zoom', {url});

        //url 传递
        // let url = {
        //     url: `/zoom/${this.state.url}`
        // };
        //
        // this.setLinkData('zoom', url);

    }
    componentDidMount(){

    }
    setLinkData(name, data, isAll){
        let {linkData} = this.state;

        //--true (替换) --false （合并）
        if(isAll){
            linkData[name] = data;
        }else{
            linkData[name] = Object.assign({}, linkData[name], data);
        }

        this.setState({linkData});

    }
    render(){
        return (
            <div>
                <ul style={style.menuList}>
                    {
                       Object.values(this.state.linkData).map( (item, index) => {
                           return <li key={index} style={style.menuListLi}><Link style={style.a} to = {item.url} >{item.txt}</Link></li>;
                       })
                    }
                </ul>
            </div>
            )

    }
}

export default Menu;