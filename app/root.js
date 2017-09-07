//包裹器
import React from "react"
import Header from "./components/header"
import Player from "./page/player"
import List from './page/list'
import {MUSIC_LIST} from "./config/config"
import {Route,BrowserRouter, Switch,hashHistory} from 'react-router-dom';
import Pubsub from 'pubsub-js'
let App=React.createClass({
	getInitialState(){
		return {
			musicList:MUSIC_LIST,
			currentMusicItem:MUSIC_LIST[0],
			mode:0
		}
	},
	playMusic(musicItem){
		$('#player').jPlayer('setMedia',{mp3:musicItem.file}).jPlayer('play');
		this.setState({
			currentMusicItem:musicItem
		});
	},
	playNext(type='next'){
		let index=this.findMusicIndex(this.state.currentMusicItem);
		let len=this.state.musicList.length;
		if(type=='next'){
			index=(index+1)%len;
		}
		else{
			index=(index-1+len)%len;
		}
		this.playMusic(this.state.musicList[index]);
	},
	findMusicIndex(musicItem){
		return this.state.musicList.indexOf(musicItem);
	},
	playWhenEnd(type='next'){
		let mode=this.state.mode;
		if(mode==0){
			this.playNext(type);
		}
		else if(mode==1){
			this.playMusic(this.state.currentMusicItem);
		}
		else{
			let index=this.findMusicIndex(this.state.currentMusicItem);
			let newIndex=Math.floor(Math.random()*this.state.musicList.length);
			while(index==newIndex){
				newIndex=Math.floor(Math.random()*this.state.musicList.length);
			}
			this.playMusic(this.state.musicList[newIndex]);
		}
	},
	componentDidMount(){
		$('#player').jPlayer({
			supplied:'mp3',
			wmode:'window'
		});
		this.playMusic(this.state.currentMusicItem);
		$('#player').bind($.jPlayer.event.ended,(e)=>{
			this.playWhenEnd();
		})
		Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem)=>{
			if(this.state.currentMusicItem==musicItem){
				this.playNext();
			}
			this.setState({
				musicList:this.state.musicList.filter(item=>{
					return item!==musicItem;
				})
			})
		});
		Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
			this.playMusic(musicItem);
		});
		Pubsub.subscribe('PLAY_PREV',(msg)=>{
			this.playWhenEnd('prev');
		});
		Pubsub.subscribe('PLAY_NEXT',(msg)=>{
			this.playWhenEnd();
		});
		Pubsub.subscribe('PLAY_MODE',(msg)=>{
			let type=(this.state.mode+1)%3;
			this.setState({
				mode:type
			})
		});

	},
	componentWillUnMount(){
		Pubsub.unsubscribe('DELETE_MUSIC');
		Pubsub.unsubscribe('PLAY_MUSIC');
		Pubsub.unsubscribe('PLAY_PREV');
		Pubsub.unsubscribe('PLAY_NEXT');
		Pubsub.unsubscribe('PLAY_MODE');
		$('#player').unbind($.jPlayer.event.ended);

	},
	render(){
		const NewList=()=>(<List musicList={this.state.musicList} currentMusicItem={this.state.currentMusicItem}/>);
		const Home=()=>(<Player currentMusicItem={this.state.currentMusicItem} cycleMode={this.state.mode}></Player>);
		return (
			<BrowserRouter history={hashHistory}>
			<div>
				<Header/>
				<Switch>
					<Route exact path='/' component={Home}></Route>
					<Route path='/List' component={NewList}></Route>	
				</Switch>>
			</div>
			</BrowserRouter>
		);
	}
});
let Root=React.createClass({

	render(){
		return (<App/>
		);
	}

});
export default Root;
