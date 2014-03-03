$(function(){
	$('#params').submit(doPlot);
});

function doPlot() {
	var anonid = $('#anonid').val();
	var req = {
			"query": {
				"bool": {
					"must": [
					         {
					        	 "term": {
//					        		 "query.anonid": "2263543"
//					        		 "query.anonid": "9615665"
//					        		 "query.anonid": "18350315" // Almost 100% of queries on the same site (bot ?)
//					        		 "query.anonid": "11112937" // Very similar distributions across months
					        		 "query.anonid": anonid
					        	 }
					         }
					        ],
					"must_not": [],
	    			"should": []
				}
			},
			"from": 0,
			"size": 50,
			"sort": [],
			"filter": {},
			"facets": {
				"march": {
					"terms": {
						"field": "query.query",
						"size": 1000
					},
					"facet_filter": {
						"range": {
							"time": {
								"from": "2006-03-01T00:00:00Z",
								"to": "2006-04-01T00:00:00Z"
							}
						}
					}
				},
				"april": {
					"terms": {
						"field": "query.query",
						"size": 1000
					},
					"facet_filter": {
						"range": {
							"time": {
								"from": "2006-04-01T00:00:00Z",
								"to": "2006-05-01T00:00:00Z"
							}
						}
					}
				},
				"may": {
					"terms": {
						"field": "query.query",
						"size": 1000
					},
					"facet_filter": {
						"range": {
							"time": {
								"from": "2006-05-01T00:00:00Z",
								"to": "2006-06-01T00:00:00Z"
							}
						}
					}
				}
			}
	};
	$("#plot").html("");
	$.ajax({
		url: "http://134.214.110.24:9200/aol/_search",
		method: 'POST',
		data: JSON.stringify(req),
		context: $("#plot").get(0)
	}).success(function(data,status,jqXHR){
		$(this).html("");
		var c = $(this);
		$.each(data.facets,function(k,v) {
			var fh =$("#templates #facet").clone();
			fh.removeAttr("id");
			fh.find("span[data-var=title]").replaceWith(k)			
			var t = v.total;
			var p = fh.find("span[data-var=plot]");
			p.html("");
			p.css("position","relative");
			p.height("300px");
			$.each(v.terms, function(i, e) {
				var d= $("<div class='bar' style='margin: 1px; height: 300px; width: 10px; position: relative; float:left;'>" +
						"<div class='fill' style='bottom:100px; background-color: red; width: 100%; position: absolute'></div>" +
						"<div class='label' style='bottom:0px; color: black; font-size: 9pt; -webkit-transform: rotate(-90deg); -moz-transform: rotate(-90deg); width: 100%; position: absolute'></div>" +
						"</div>");
				p.append(d);
				d.find(".fill").height((300 * e.count / t) + "px");
				d.find(".label").html(e.term);
			});
			
			c.append(fh);
		});
		$(this).addClass( "done" );
	});
};