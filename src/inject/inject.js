chrome.storage.sync.get({
	linkbait_links: [
      "buzzfeed.com",
      "upworthy.com"
    ]
},function(items){
	window.linkbait_links = items['linkbait_links'];
})

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading

		search_and_destroy();

		//Now add a more modest refresh
		var periodicCheckInterval = setInterval(
			search_and_destroy,
			1000);
		// ----------------------------------------------------------
	}
	}, 10);
});

function search_and_destroy(){
	var links = document.getElementsByTagName('a');
	var for_removal = [];

	/* window.lbbg_ix keeps a global record of which
	links we've already searched. That way, we don't
	traverse the same ground twice. */
	if (window.lbbg_ix === undefined)
		window.lbbg_ix = 0;
	for ( ; lbbg_ix < links.length; lbbg_ix++){
		if (is_offending_link(links[lbbg_ix])){
			for_removal.push(find_parental_unit(links[lbbg_ix]));
		}
	}
	for (var ix=0; ix < for_removal.length; ix++){
		delete_node(for_removal[ix]);
	}
}


String.prototype.contains = String.prototype.contains ||
	function(s) { return this.indexOf(s) !== -1 };



function is_offending_link(link){
	if (! link.href){
		return false;
	}
	for (var ix=0; ix < linkbait_links.length; ix++){
		if (link.href.contains(linkbait_links[ix])){
			return true;
		}
	}
	return false;
}
function delete_node(node_id){
	var node = document.getElementById(node_id);
	if (node !== null){
		console.log('linkbait deleted:' + node_id);
		node.parentNode.removeChild(node);
	}
}
function remove_duplicates(arr){
	return arr.filter(function(elem, pos){
		return arr.indexOf(elem) == pos;
	});
}
function find_parental_unit(node){
	return is_timeline_unit(node) ? 
			node.id : find_parental_unit(node.parentNode);
}
function is_timeline_unit(node){
	return node.className.contains('fbTimelineUnit') ||
		(!!node.id &&
		has_userContentWrapper_child(node));
}
function has_userContentWrapper_child(node){
	return !!(node.childNodes.length &&
		node.childNodes[0].className &&
		node.childNodes[0].className.contains('userContentWrapper'));
}
