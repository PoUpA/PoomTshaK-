<?php
require 'facebook.php';

class fbConnect {
	private $facebook;
	private $userId;
	
	
	
	public function __construct($userId=null){
		$this->userId = $userId!=null?$userId:'PoomTshaK';
		$this->facebook = new Facebook(array(
		  'appId'  => '127050684078153',
		  'secret' => '73ace9d64305ac92b18fa86612a66b03',
		));
	}
	
	public function setUserId($userId=null){
		$this->userId = $userId!=null?$userId:'PoomTshaK';
	}
	
	public function getUserId($userId=null){
		return $this->userId;
	}
	
	public function getProfile(){
		echo(json_encode($this->facebook->api($this->userId.'/')));
	}

	public function getPosts(){
		echo(json_encode($this->facebook->api($this->userId.'/posts')));
	}

	public function getAlbums(){
		$albums = $this->facebook->api($this->userId.'/albums');
		$parsedAlbums = array();
		foreach($albums['data'] as $album){
			if(is_array($album) && $album['type'] == 'normal'){
				$photos = $this->facebook->api($album['id'].'/photos');
				$album['photos'] = $photos['data'];
				$parsedAlbums[] = $album;
			}
		}
	
		echo(json_encode($parsedAlbums));
	}
	
	public function getPastEvents(){
		$posts = $this->facebook->api($this->userId.'/posts?until=today');
		
		$events = array();
		foreach($posts['data'] as $post){
			//print_r($post);
			if(is_array($post) && $post['type'] == 'event' ){
				$events[] = $post;
			}
			if(is_array($post) && $post['type'] == 'status' && in_array('actions',array_keys($post)) && preg_match('#^http(|s)://www.facebook.com/events/?#',$post['actions'][0]['link'])){
				
				$events[] = $this->facebook->api(preg_replace('#^http(|s)://www.facebook.com/events/?#','/',$post['actions'][0]['link']));
			}
			if(is_array($post) && $post['type'] == 'link' && preg_match('#^http(|s)://www.facebook.com/events/?#',$post['link'])){
				
				$events[] = $this->facebook->api(preg_replace('#^http(|s)://www.facebook.com/events/?#','/',$post['link']));
			}
		}
		echo(json_encode($events));
	}
	
	public function getNextEvents(){
		$posts = $this->facebook->api($this->userId.'/posts?since=today');
		
		$events = array();
		foreach($posts['data'] as $post){
			//print_r($post);
			if(is_array($post) && $post['type'] == 'event' ){
				$events[] = $post;
			}
			if(is_array($post) && $post['type'] == 'status' && in_array('actions',array_keys($post)) && preg_match('#^http(|s)://www.facebook.com/events/?#',$post['actions'][0]['link'])){
				
				$events[] = $this->facebook->api(preg_replace('#^http(|s)://www.facebook.com/events/?#','/',$post['actions'][0]['link']));
			}
			if(is_array($post) && $post['type'] == 'link' && preg_match('#^http(|s)://www.facebook.com/events/?#',$post['link'])){
				
				$events[] = $this->facebook->api(preg_replace('#^http(|s)://www.facebook.com/events/?#','/',$post['link']));
			}
		}
		echo(json_encode($events));
	}
}
?>