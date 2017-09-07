import React from 'react'
import './player.less'
import Progress from "../components/progress"
import {Link} from 'react-router-dom'
import Pubsub from 'pubsub-js'
let duration=null;
let Player=React.createClass({
		getInitialState(){
			return {
				progress: 0,
				volume:0,
				isPlay:true,
				leftTime:'',
			}
		},
		componentDidMount(){
			$('#player').bind($.jPlayer.event.timeupdate,(e)=>{
			//es6语法，回调函数
				duration=e.jPlayer.status.duration;

				this.setState({
					volume:e.jPlayer.options.volume*100,
					progress:Math.round(e.jPlayer.status.currentPercentAbsolute),
					leftTime:duration*(1-e.jPlayer.status.currentPercentAbsolute/100)
				})
			});

		},
		componentWillUnMount(){
		$('#player').unbind($.jPlayer.event.timeupdate);
		},
		progressChangeHandler(progress){
			//console.log('from root widget'+progress);
			$('#player').jPlayer(this.state.isPlay?'play':'pause',duration*progress)

		},
		volumeChangeHandler(progress){
			//console.log(progress);
			$('#player').jPlayer('volume',progress)
		},
		play(){
			if(this.state.isPlay){
				$('#player').jPlayer('pause');
			}
			else{
				$('#player').jPlayer('play');
			}
			this.setState({
				isPlay:!this.state.isPlay
			});
		},
		playPrev(){
			Pubsub.publish('PLAY_PREV');
		},
		playNext(){
			Pubsub.publish('PLAY_NEXT');
		},
		playMode(){
			Pubsub.publish('PLAY_MODE');
		},
		formatTime(time){
			time=Math.floor(time);
			let min=Math.floor(time/60);
			let sed=time%60;
			sed=sed<10?`0${sed}`:sed;
			return min+':'+sed
		},
		render(){
			return (
			<div className="player-page">
				<h1 className="caption"><Link to="/list">我的私人音乐坊 ></Link></h1>
				<div className="mt20 row">
					<div className="controll-wrapper">
						<h2 className="music-title">{this.props.currentMusicItem.title}</h2>
						<h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
						<div className="row mt20 mb10">
							<div className="left-time -col-auto">-{this.formatTime(this.state.leftTime)}</div>
							<div className="volume-container">
								<i className="icon-volume rt" style={{top:5,left:-5}}></i>
								<div className="volume-wrapper">
									<Progress
										progress={this.state.volume}
										onProgressChange={this.volumeChangeHandler}
										barColor="#aaa"
									></Progress>

								</div>
							</div>
						</div>
						<div style={{height:10,lineHeight:'10px'}}>
							<Progress
								progress={this.state.progress}
								onProgressChange={this.progressChangeHandler}
							></Progress>
						</div>
						<div className="mt35 row">
							<div>
								<i className="icon prev" onClick={this.playPrev}></i>
								<i className={`icon ml20 ${this.state.isPlay?'pause':'play'}`}
									onClick={this.play}></i>
								<i className="icon next ml20" onClick={this.playNext}></i>
							</div>
							<div className="-col-auto">
								<i className={`icon ${this.props.cycleMode==0?'repeat-cycle':this.props.cycleMode==1?'repeat-once':'repeat-random'}`} onClick={this.playMode}></i>
							</div>
						</div>
						
					</div>
					<div className="-col-auto cover">
					<img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
					</div>
				</div>
				
			</div>
			);
		}
});
export default Player;