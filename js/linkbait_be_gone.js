
console.log('deleting_upworthy_links');

String.prototype.contains = String.prototype.contains ||
	function(s) { return this.indexOf(s) !== -1 };

var lbbg = {
	fb_page : /https:\/\/.*?.facebook.com\/.*?/,
	offending_link: function(link){
		return !!(link.href && link.href.contains('upworthy.com'));
	},
	delete_node: function(node_id){
		var node = document.getElementById(node_id);
		node.parentNode.removeChild(node);
	},
	remove_duplicates: function(arr){
		return arr.filter(function(elem, pos){
			return arr.indexOf(elem) == pos;
		});
	},
	find_parental_unit: function(node){
		return lbbg.is_timeline_unit(node) ? 
				node.id : lbbg.find_parental_unit(node.parentNode);
	},
	is_timeline_unit: function(node){
		return node.className.contains('fbTimelineUnit') ||
			lbbg.has_userContentWrapper_child(node);
	},
	has_userContentWrapper_child: function(node){
		return !!(node.childNodes &&
			node.childNodes[0].className &&
			node.childNodes[0].className.contains('userContentWrapper'));
	}
};
console.log('linkbait');

var links = document.getElementsByTagName('a');
var for_removal = [];
for (var ix=0; ix < links.length; ix++){
	if (lbbg.offending_link(links[ix])){
		for_removal.push(lbbg.find_parental_unit(links[ix]));
	}
}
for_removal = lbbg.remove_duplicates(for_removal);
for (var ix=0; ix < for_removal.length; ix++){
	lbbg.delete_node(for_removal[ix]);
}
