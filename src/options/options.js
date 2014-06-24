// Saves options to chrome.storage
function save_options() {
  var dom_links = document.getElementsByClassName('linkbait-url'),
      links = [];
  console.log(dom_links);
  for (var ix=0; ix < dom_links.length; ix++){
    links.push(dom_links[ix].innerHTML);
  }
  console.log('about to save');
  console.log(links);

  chrome.storage.sync.set({
    linkbait_links: links
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    linkbait_links: [
      "buzzfeed.com",
      "upworthy.com"
    ]
  }, function(items) {
    for (var ix=0; ix < items.linkbait_links.length; ix++){
      add_linkbait_link(items.linkbait_links[ix]);
    }
  });
}

function add_linkbait_link(link){
  console.log(link);
  var table = document.getElementById('linkbait-table-body'),
      template = linkrow_template.replace('LINKBAIT_URL',link),
      row = document.createElement('tr');
  row.innerHTML = template;
  //row.id = 'r' + row_id_count++;
  table.insertBefore(row,
    document.getElementById('user-entry-row'));

  //make sure all the rows have remove listeners
  var rows = document.getElementsByClassName('remove-row');
  for(var ix=0; ix < rows.length; ix++){
    rows[ix].onclick = remove_linkbait_link;
  }
}

function remove_linkbait_link(){
  var row = this.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function add_user_entry_text(){
  var link = document.getElementById('user-entry').value;
  if (link){
    add_linkbait_link(link);
  }
  document.getElementById('user-entry').value = "";
}

var linkrow_template = '<td><span class="linkbait-url">LINKBAIT_URL</span></td><td><button type="button" class="close remove-row" aria-hidden="true"><span class="glyphicon glyphicon-remove"></span></button></td>';
var parser = new DOMParser();

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-button').onclick = save_options;
document.getElementById('add-button').onclick = add_user_entry_text;
document.getElementById('user-entry').onkeydown = function(evt){
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if (keyCode == 13){
    add_user_entry_text();
  }
};
