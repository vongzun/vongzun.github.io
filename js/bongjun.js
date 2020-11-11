// Initialization
initPage();

// Initialize page
function initPage() {
	includePubs();
}

// Show the navbar and add the sticky class to the navbar when you reach its scroll position. 
// Hide the navbar and remove "sticky" when you leave the scroll position

function includePubs() {
  var url_string = window.location.href;
  //var url = new URL(url_string);
  //var url = "corelab.or.kr";
  //var host = url.hostname;
  var host = "corelab.or.kr";
  var addr = "http://"+host+"/Pubs/pubs.php";
  var categorize = 1;
  var author = "bongjun";
  $("#pubs").load(addr+"?categorize="+categorize+"&setselect="+author+"&abslink="+addr, function(){
    var pubs = $("#pubs").html();
    //pubs = pubs.replace(/Bongjun Kim/gi, "<span class='highlight'>$&</span>");
    pubs = pubs.replace(/Bongjun Kim/gi, "<span style='background-color: khaki'>$&</span>");
    $("#pubs").html(pubs);
  });
}

function toggleDisplayAbstract(paper_id) {
  isDisplayed = document.getElementById(paper_id).style.display;
  if (isDisplayed == "none") {
    document.getElementById(paper_id).style.display = "block";
  } else if (isDisplayed = "block") {
    document.getElementById(paper_id).style.display = "none";
  } else {
    document.getElementById(paper_id).style.display = "block";
  }
}
