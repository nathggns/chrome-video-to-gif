/// <reference path="../../typings/tsd.d.ts" />

import { Video } from './video';

export class VideoManager {
	
	constructor(private container : HTMLElement) {
		
	}
	
	get() : Video[] {
		return this.getVideoElements().map<Video>(el => new Video(el));
	} 

	private getVideoElements() : HTMLVideoElement[] {
		return [].slice.call(this.container.querySelectorAll('video'));
		
	}
	
}
 