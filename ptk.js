/* 
*************** PoomTshaK! website **************
Created by : 								PoUpA
Creation date: 						   30.12.2011 	
Version : 									0.0.2
Last modification date : 			   22.01.2012

*/

var userid = 'PoomTshaK';

function ptk(){
	var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-28628667-1']);
	  _gaq.push(['_trackPageview']);

	  (function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	$(document).ready(function() {
		renderMain();
	});
}

function renderMain(step){
	switch(step){
		case 'preRendering' : 
			getFBProfileData();
		break;
		case 'profile' :
			getFBPostsData();
		break;
		case 'posts' :
			getFBAlbumsData();
		break;
		case 'albums' :
			getFBNextEventsData();
		break;
		case 'nextEvents' :
			getFBPastEventsData();
		break;
		case 'pastEvents' :
			postRendering();
		break;
		default :
			preRendering();
		break;
	}

}

function preRendering(){
	$('#main').after(renderDiv('mainLoader','mainLoader','loading...'));
	$('#main').css('min-height','500px');
	$('#main').addClass('ui-state-active ui-corner-all');
	$('#main').isotope({layoutMode: 'masonry'});
	$( "#mainLoader" ).dialog({
			height: 140,
			modal: true,
			title: 'Loader' 
		});
	$('#main').after(renderDiv('footer','footer','© PoomTshaK! 2012'));
	$("#main").show("fast");
	
	renderMain('preRendering');
}

function renderProfile(profileData){
	createMainElement(
		'profile',
		profileData.username
	).appendTo("#main");
	renderDiv('profileContent','profileContent').appendTo("#profile");
	renderDiv('profileLogo','profileLogo',$("<img/>").attr("src", profileData.picture)).appendTo("#profileContent");
	$('#profileContent').append(
		$('<div/>').append(
		profileData.location.city + " " + profileData.location.zip + " "+ profileData.location.country)
	);
	$('#profileContent').append(
		$('<div/>').append(
		profileData.description)
	);
	//$('#profileLoader').remove();
	
	
	$('#profile').show();
	$('#main').isotope( 'addItems', $('#profile'));
	$('#main').isotope( 'reLayout', renderMain('profile'));
	
}

function renderPosts(postsData, alertPosts){
	createMainElement('posts','Posts').appendTo("#main");
	$('<div/>').attr({
			id: 'postsElements',
			class: 'mainElement'
		})
	.appendTo("#posts");

	$.each(postsData.data, function(i,item){
		if(!item.story){
			$('#postsElements').append($('<div/>').attr({
			id: item.id,
			class: 'postEntry'
			}).append(
				$('<h3/>').attr({
					class: 'postEntryTitle'
				}).append(item.name).appendTo("#postsElements"))
			.append(
				$('<div/>').attr({
					class: 'postMessage'
				}).append(item.message).append(
				$('<div/>').attr({
					class: 'postEntryFooter'
				}).append('Posted by : '+item.from.name)))
			);
		}

	});
	//$('#postsLoader').remove();
	
	
	$('#posts').show('fast');
	$('#main').isotope( 'addItems', $('#posts'));
	$('#main').isotope( 'reLayout', renderMain('posts'));
}

function renderAlbums(albumsData){
	createMainElement('albums','Albums').appendTo("#main");
	$('<div/>').attr({
			id: 'albumsElements',
			class: 'mainElement'
		})
	.appendTo("#albums");
	$.each(albumsData, function(i,item){
		$('<div/>').attr({
			id: item.id,
			class: 'album'
		}).appendTo('#albumsElements');
		$('<h3/>').attr({
			class: 'albumEntryTitle'
		}).append(item.name)
		.appendTo('#'+item.id);
				/*alert(item.name);*/
		$('<div/>').attr({
			id: item.id+"_container",
			class: 'albumContainer'
		}).appendTo('#'+item.id);		
		$(item.photos).each( function(i,image){
			$('<div/>').attr({
			id: image.id,
			class: 'photo'
			}).append(
			$("<img/>")
			.attr("src", image.images['1'].source)
			).appendTo('#'+item.id+"_container");
		});
		
	});
	//$('#albumsLoader').remove();
	
	$("#albums").show();
	$('.albumContainer').each( function(index,album){
			$(album).isotope({
			// options
			itemSelector : '.photo',
			layoutMode : 'masonry',
			height: '500px'
		});
		$(album).click(function(){
			$(album).isotope('shuffle');
		});
	});
	$('#main').isotope( 'addItems', $('#albums'));
	$('#main').isotope( 'reLayout', renderMain('albums'));
}

function renderNextEvents(eventsData){
	createMainElement('nextEvents','Next Events').appendTo("#main");
	createEventsSubElements(
		eventsData,
		'nextEvents',
		'No next events.'
	);	
	
	//$('#nextEventsLoader').remove();

	$('#main').isotope( 'addItems', $('#nextEvents'));
	$('#main').isotope( 'reLayout', renderMain('nextEvents'));
	
}

function renderPastEvents(eventsData){
	createMainElement('pastEvents','Past Events').appendTo("#main");
	createEventsSubElements(
		eventsData,
		'pastEvents',
		'No past events.'
	);	
	//$('#pastEventsLoader').remove();
	
	renderMain('pastEvents');
	$('#main').isotope( 'addItems', $('#pastEvents'));
	$('#main').isotope( 'reLayout', renderMain('pastEvents'));
}
//load this after all default elements are loaded
function postRendering() {
	$( "#mainLoader" ).hide('fast');
	$( "#mainLoader" ).dialog( "destroy" );
	//$("#main").accordion({ header: 'h2',autoHeight: false});
	/*
	*/
}

/*
Facebook Helper

*/

function getFBProfileData(){
	//renderH1('profileLoader','profileLoader','Loading Profile').appendTo("#main");
	renderDiv('profileLoader','profileLoader','Loading Profile').appendTo("#mainLoader");
	$.getJSON('facebook_helper.php?action=profile', renderProfile);
}

function getFBPostsData(){
	//renderH1('postsLoader', 'postsLoader','Loading Posts').appendTo("#main");
	renderDiv('postsLoader', 'postsLoader','Loading Posts').appendTo("#mainLoader");
	$.getJSON('facebook_helper.php?action=posts',renderPosts);
}

function getFBAlbumsData(){
	renderDiv('albumsLoader','albumsLoader','Loading Albums').appendTo("#mainLoader");
	$.getJSON('facebook_helper.php?action=albums', renderAlbums);
}

function getFBNextEventsData(){
	renderDiv('nextEventsLoader','nextEventsLoader','Loading Next Events').appendTo("#mainLoader");
	$.getJSON('facebook_helper.php?action=nextEvents', renderNextEvents);
}

function getFBPastEventsData(){
	renderDiv('pastEventsLoader','pastEventsLoader','Loading Past Events').appendTo("#mainLoader");
	$.getJSON('facebook_helper.php?action=pastEvents', renderPastEvents);
}

/* HTML tools */

function renderH1(idText, classText, content){
	return $('<h1/>').attr({
			id: idText,
			class: classText
		}).append(content);
}

function renderH2(idText, classText, content){
	return $('<h2/>').attr({
			id: idText,
			class: classText
		}).append(content);
}

function renderH3(idText, classText, content){
	return $('<h3/>').attr({
			id: idText,
			class: classText
		}).append(content);
}

function renderDiv(idText, classText, content){
	return $('<div/>').attr({
			id: idText,
			class: classText
		}).append(content);
}

function createMainElement(idText,content){
	return $('<div/>').attr({
			id: idText,
			class: 'mainElement'
		})
	.append(
		renderH2('mainElementHeader_'+idText,'mainElementHeader',content)
	).append(
	$('<div/>').attr({
			id: idText+'Elements',
			class: 'mainElement'
		})
	.appendTo("#"+idText));
}

function createEventsSubElements(data,idText,noDataText,content){
	if($(data).length==0){
		renderDiv('noSubElements_'+idText,'noSubElements_'+idText,noDataText).appendTo('#'+idText);
	}
	else {
		renderDiv('subElements_'+idText,'subElements_'+idText).appendTo('#'+idText);
		$.each(data, function(i,item){
			if(!item.story){
				renderDiv('element_'+idText+'_'+item.id,'subElement_'+idText).appendTo('#'+'subElements_'+idText);
				renderH3(item.id,'entryHeader_'+idText,item.name).appendTo('#'+'element_'+idText+'_'+item.id);
				$('#'+item.id).after(
					renderDiv(
						'elementContent_'+idText+'_'+item.id,
						'entryFooter_'+idText,
						item.description!=undefined?item.description.replace(/\n/g,'<br />')+'</br>location :'+item.location:''
					)
				);
			}
			
		});
	}
}
