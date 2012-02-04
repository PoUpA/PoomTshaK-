<?php
require 'fbConnect.php';
$facebook = new fbConnect();
header('Content-Type: application/json; charset=utf8');
//header('Access-Control-Allow-Origin: http://www.example.com/');
header('Access-Control-Max-Age: 3628800');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

switch($_GET['action']){
	case 'profile':
		$facebook->getProfile();
		break;
	case 'albums':
		$facebook->getAlbums();
		break;
	case 'posts':
		$facebook->getPosts();
		break;
	case 'pastEvents':
		$facebook->getPastEvents();
		break;
	case 'nextEvents':
		$facebook->getNextEvents();
		break;
}
?>
