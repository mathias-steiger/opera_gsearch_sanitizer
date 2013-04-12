// GPLv3 code (C) Mathias Steiger  - mst@master.ms
// ==UserScript==
// @include htt*://*

var globspecial = [ "location:", "source:", "-", "allinanchor:", "allintext:", "allintitle:", "allinurl:", "cache:", "define:", "filetype:", "id:", "inanchor:", "info:", "intext:", "intitle:", "inurl:", "link:", "related:", "site:" ];
// 'DOMContentLoaded'
window.addEventListener('DOMContentLoaded', function() {
//opera.addEventListener('BeforeScript', function(userJSEvent) {
//  userJSEvent.element.text = userJSEvent.element.text.replace(/function\s+window\.onload\(/g, 'window.onload = function(');
		var applydomains = ["\.google\."];
		var noapplydomains = ["webcache\.google\."];
		var resumefunction = false;
		var re;
		for (var i = 0; i < applydomains.length; i++)
			{ re = new RegExp(applydomains, "gi"); if(document.URL.match(re)) { resumefunction = true; } ;}
		for (var i = 0; i < noapplydomains.length; i++)
			{ re = new RegExp(noapplydomains, "gi"); if(document.URL.match(re)) { resumefunction = false; } ;}
		if(!resumefunction) { return(true); }

		var arr = document.URL.match(/[\?&]q=[^&]*/) || ["000"];
		var alreadyparsed = document.URL.match(/&hl=en&num=31337/) || [""];
//		var quotect = arr[0].match(/\%22/) || [""];
		if(arr[0].length > 3 && alreadyparsed[0].length == 0 )// && quotect[0].length == 0)
		{
			domains = [".google.com", "www.google.com", "images.google.com", "google.com"];
			for (var i = 0; i < domains.length; i++)
				{ setCookie("PREF", 
					'ID=a3e5cfb9acbfc779:U=cd65c70870305362:FF=0:LD=en:NR=31337:TM=1365760287:LM=1365760315:SG=2:S=fkRtAy8-o9-K_iZU', 
					9999, domains[i]); }
	
			var sub1 = url_quote(arr[arr.length-1].substr(3));

			// some important vars
			var important = "";
			if((document.URL.match(/[\?&]tbm=[^&]*/) || [""]).length != 0) { important += "&"+(document.URL.match(/[\?&]tbm=[^&]*/) || [""])[0].substr(1); }

			this.document.location.href = "http://www.google.com/search?q="+sub1+"&hl=en&num=31337&safe=off"+important;
		}
		else if(alreadyparsed[0].length != 0)
		{
			// set input box without single words quoted
			var terms = input_dequote(document.forms['gbqf'].q.value);
			document.forms['gbqf'].q.value = terms.join(" ");

			// remove all quotes and all special search keys because we don't really want to know what they all do
			var newterms = [ ];
			for (var i = 0; i < terms.length; i++)
			{
				terms[i] = terms[i].replace(/"/g, "");
				for (var j = 0; j < globspecial.length; j++)
				{
					re = new RegExp("^"+globspecial[j], "gi");	
					if(terms[i].match(re) == null) { newterms.push(terms[i]); break; }
				}
			}
			// remove results that do not contain all of the search terms (might just not show up on the search engine itself though, but rarely that is so)
			var res = document.getElementById('ires').getElementsByClassName("g");
			for (var i = 0; i < res.length; i++)
			{
				for (var j = 0; j < terms.length; j++)
				{
					re = new RegExp(terms[j], "gi");
					if(!(res[i].innerHTML.match(re))) { res[i].innerHTML = ""; break; }
				}
			}
				
		}
}, false);

function setCookie(c_name, value, exdays, domain)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value + "; domain="+domain;
	document.cookie=c_name + "=" + c_value;
}
// basically ignore quoted phrases and just strip " from single words - returns terms as array
function input_dequote(s)
{
	var a0 = s.split(" ");	
	var a1 = new Array();
	var opennew = true;

	for (var i = 0; i < a0.length; i++)
	{
		if(opennew && (a0[i].match(/"/g) || "").length == 1) 
			{ atemp = a0[i]; opennew = false; }
		else if(!opennew && (a0[i].match(/"/g) || "").length == 1 && !opennew) 
			{ atemp += " "+a0[i]; opennew = true; }
		else if(!opennew) 
			{ atemp += " "+a0[i]; }
		else 	{ atemp = (a0[i].replace(/"/g, "")); }

		if(opennew) { a1.push(atemp); }
	}
	return(a1);
}

// example input: s = '%22this+text%22+is+quoted+intitle%3A%22par-+tially%22' ("this text" is quoted intitle:"par- tially")
function url_quote(s)
{
	var a0 = s.split("+");
	var a1 = new Array();
	var atemp = "";
	var opennew = true;

	// pull shit properly apart
	for (var i = 0; i < a0.length; i++)
	{
		if(a0[i].length == 0 || a0[i] == "%22%22") { continue; }

		if(opennew && (a0[i].match(/%22/g) || "").length == 1 && (a0[i].match(/%22$/) || "").length == 1) // that kind of makes no sense, replace with inch
			{ atemp = a0[i].replace(/%22$/, " inch"); } 
		else if(opennew && (a0[i].match(/%22/g) || "").length == 1) 
			{ atemp = a0[i]; opennew = false; }
		else if(!opennew && (a0[i].match(/%22/g) || "").length == 1 && !opennew) 
			{ atemp += "+"+a0[i]; opennew = true; }
		else if(!opennew) 
			{ atemp += "+"+a0[i]; }
		else 	{ atemp = a0[i]; }

		if(opennew) { a1.push(atemp); }
	}

	// quote everything unquoted
	for (var i = 0; i < a1.length; i++)
	{
		if((a1[i].match(/%22/g) || "").length == 2) { continue; }
		else if((a1[i].match(/%22/g) || "").length%2 != 0) // odd number of quotes gets removed!
			{ a1[i] = a1[i].replace(/%22/g, ""); } 

		a1[i] = "%22"+strip_quotes(a1[i])+"%22";
		a1[i] = gf_quote(a1[i]);
	}
	// example output: '%22this+text%22+%22is%22+%22quoted%22+intitle%3A%22par-+tially%22' ~("this text" "is" "quoted" intitle:"par- tially")
	return(a1.join('+'));
}

// remove all quotes
function strip_quotes(s)
{
//	in-quote quotes code - turns out multi-quotes do not even work with google!
//
//	if((s.match(/^%22/) || "").length !=  0 && (s.match(/%22$/) || "").length != 0) 
//	{
//		var start = (((s.match(/^(%22)*/))[0]).length);
//		var end = (((s.match(/(%22)*$/))[0]).length);
//		var use = ((s.match(/^(%22)*/))[0]);
//		if(start > end) use = ((s.match(/(%22)*$/))[0]);
//		re = new RegExp("^"+use);
//		s = s.replace(re, ""); 
//		re = new RegExp(use+"$");
//		s = s.replace(re, ""); 
//	}
	s = s.replace(/%22/g, "");
	return(s);
}

// example input: s = '%22intitle%3Aquoted%22' ('"intitle:quoted"')
function gf_quote(s)
{
	var special = globspecial.slice(0);
	for (var i = 0; i < special.length; i++)
		{ special[i] = special[i].replace(/:/g, "%3A"); }

	var re;
	var temp;
	for (var i = 0; i < special.length; i++) 
	{
		re = new RegExp("^%22"+special[i], "gi");
		if((s.match(re) || "").length > 0)
		{
			s = special[i]+"%22"+strip_quotes(s.replace(re, ''))+"%22";
		}
	}
	// example output: 'intitle%3A%22quoted%22' ~(intitle:"quoted")
	return(s);
}
// ==/UserScript==

