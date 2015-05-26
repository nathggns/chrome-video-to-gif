var App = React.createClass({

	getInitialState() {
		return { videos : [], isDownloading : false, highlightedItem : null };
	},

	componentDidMount() {
		this.loadVideos().done();
	},

	loadVideos() {
		return getVideos()
			.then(videos => {
				this.setState({ videos });
			});
	},

	downloadVideo(id) {
		this.setState({ isDownloading : true });
		downloadVideo(id, () => {
			this.loadVideos()
				.then(() => {
					this.setState({ isDownloading : false });
				}).done();
		});
	},

	highlight(id) {
		highlight(id, true);
		this.setState({ highlightedItem : id });
	},

	unhighlight(id) {
		highlight(id, false);
		this.setState({ highlightedItem : null });
	},

	getStyle(id) {

		var style = {
			listStyle : 'none',
			padding : '5px',
			margin : 0,
			cursor : 'pointer',
			fontWeight : 'bold'
		};

		if (id === this.state.highlightedItem) {
			style.backgroundColor = '#EEE';
		}

		return style;
	},

	getListItem(video, idx) {
		return (
			<li 
				data-id={video.id}
				onClick={() => this.downloadVideo(video.id)}
				onMouseEnter={() => this.highlight(video.id)}
				onMouseLeave={() => this.unhighlight(video.id)}
				key={idx}
				style={this.getStyle(video.id)}
			>
				{video.name}
			</li>
		);
	},

	render() {
		return (
			this.state.isDownloading
			?
				<p>Downloading...</p>
			:
				(
					this.state.videos.length ?
						<div>
							<p>Please choose a video from below.</p> 
							<ul style={{ margin : 0, padding : 0, listStyle : 'none' }}>
								{
									this.state.videos.map((v, idx) => this.getListItem(v, idx))
								}
							</ul>
						</div>
					: <p>Sorry, there are no videos on this page</p>
				)
		);
	}

});

React.render(
	<App/>,
	document.body
);