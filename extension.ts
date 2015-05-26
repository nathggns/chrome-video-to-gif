/// <reference path="typings/tsd.d.ts" />

import Q = require('q');

import { VideoManager } from './modules/video/manager';
import { Video } from './modules/video/video';

var vm = new VideoManager(document.body);
var button = document.createElement('button');
var videos : { [index:string] : Video} = {};
var highlighters : { [ index : string] : ElementHighlighter; } = {};

class ElementHighlighter {

	private highlighted = false;
	private highlightDiv : HTMLDivElement;

	constructor(private element : HTMLElement) {

	}

	toggle() {
		this.highlighted ? this.unhighlight() : this.highlight();
	}

	highlight() {
		if (this.highlighted) {
			return;
		}
		var div = this.highlightDiv = document.createElement('div');
		var rect = this.getRect();

		div.style.backgroundColor = 'rgba(0,0,255,0.5)';
		div.style.zIndex = 9999;
		div.style.position = 'absolute';
		div.style.top = rect.top + 'px';
		div.style.left = rect.left + 'px';
		div.style.width = rect.width + 'px';
		div.style.height = rect.height + 'px';

		document.body.appendChild(div);
		this.highlighted = true;
	}

	unhighlight() {
		if (!this.highlighted) {
			return;
		}
		document.body.removeChild(this.highlightDiv);
		this.highlightDiv = null;
		this.highlighted = false;
	}

	private getRect() {
		return this.element.getBoundingClientRect();
	}
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.log(request);
	if (request.type === 'loadVideos') {
		sendResponse({
			type : 'videos',
			videos : vm.get().map(v => {
				var name = v.getFileName();
				var id = `${v.getFileName(false)}-${Math.random()}`;
				var url = v.source;

				videos[id] = v;

				return { id, name, url };
			})
		});
	}

	if (request.type === 'downloadVideo') {
		var id = request.id;

		if (videos[id]) {

			if (!highlighters[request.id]) {
				highlighters[request.id] = new ElementHighlighter(videos[request.id].element);
			}

			highlighters[request.id].highlight();			

			chrome.runtime.sendMessage({
				type : 'convertVideoToGif',
				url : videos[id].source
			}, (response) => {
				if (chrome.runtime.lastError) {
					alert('Error');
					console.warn(chrome.runtime.lastError);
				} else {
					highlighters[request.id].unhighlight();
					sendResponse(response);
				}
			});
		}

		return true;
	}

	if (request.type === 'highlightVideo') {
		console.log('higlighting', request);
		if (videos[request.id] && videos[request.id].element) {
			if (!highlighters[request.id]) {
				highlighters[request.id] = new ElementHighlighter(videos[request.id].element);
			}

			if (request.highlight) {
				highlighters[request.id].highlight();
			} else {
				highlighters[request.id].unhighlight();
			}
		}
	}
});