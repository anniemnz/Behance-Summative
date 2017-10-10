$(function() {

  	// jquery coding inside this function
  	let key = 'uvF145qvSLKIWMiedZfpdGxSH8lmHajb';

  	let portfolioHTML = $('#portfolio-template').text();
	let portfolioTemplate = Template7(portfolioHTML).compile();

 	if($('#behance-api').length>0){


		let urlProjects = 'https://api.behance.net/v2/users/ilonaveresk/projects?client_id='+key; 
		$.ajax({
			url: urlProjects,
			dataType: 'jsonp',
			success: function(res){
				let projects = res.projects;

				let currentPage = 1;

				let lastPage = Math.ceil(projects.length/6);

				

				function showPortfolios(pageNumber){

					let startIndex = (pageNumber - 1) * 6;
					let endIndex = startIndex + 5;

					if(endIndex > projects.length - 1){
						endIndex = projects.length - 1;
					}

					$('.project-container').empty()
					for(i=startIndex; i<=endIndex; i++){

						let project = projects[i];
						let output = portfolioTemplate(project);
						$(output).appendTo('.project-container')						
				
					}

				}

				showPortfolios(currentPage);

				$('.arrows .fa-angle-down').on('click',function(){
					currentPage++;

					if(currentPage > lastPage){
						currentPage = lastPage;
					}
					showPortfolios(currentPage);
				});

				$('.arrows .fa-angle-up').on('click',function(){
					currentPage--;

					if(currentPage < 1){
						currentPage = 1;
					}
					showPortfolios(currentPage);
				});
				
			}			
		});

		let urlUser = 'https://api.behance.net/v2/users/ilonaveresk?client_id='+key; 
		$.ajax({
			url: urlUser,
			dataType: 'jsonp',
			success: function(res){
			
				let user = res.user;
				$('.about-text h1').text(user.display_name);
				$('.about-text .company').text(user.company);
				$('.about-text .city').text(user.location);
				$('.about-text .social-media a').attr('href',user.social_links["0"].url);
				$('.about-text .social-media a').text(user.social_links["0"].url);
				$('.about-text .social-media2 a').attr('href',user.social_links["2"].url);
				$('.about-text .social-media2 a').text(user.social_links["2"].url);
				$('.about-text .website').text(user.website);

				console.log(res);
			}			
		});


	}


// ================  MAP  ==================

	let center = [55.7765730186677,37.705078125];
	let map = L.map('map', {attributionControl: false}).setView(center,4);
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

	
	let location =[
					{
						latlng:[55.727110085045986,37.705078125],
						description: 'Moscow, RUSSIA',
						content:'<img src="images/moscow-map.jpg">',
						iconImage: 'images/pointer.svg'
					}
					];

	_(location).each(function(city){

		let pointerIcon = L.icon({
									iconUrl: city.iconImage,
									iconSize:[50,50]
								});
		let marker = L.marker(city.latlng,{icon:pointerIcon}).addTo(map);
		marker.bindPopup('<div class="pop-up">'+city.description+city.content+'</div>')


	});

// ===========  DRAW GRAPHS  ============

	// =======  PROMISES  ===========

	let urlUser1 = 'https://api.behance.net/v2/users/ilonaveresk?client_id='+key;
	let urlUser2 = 'https://api.behance.net/v2/users/Carlaveggio?client_id='+key;
	let urlUser3 = 'https://api.behance.net/v2/users/andrejosselin?client_id='+key;
	let urlUser4 = 'https://api.behance.net/v2/users/tinapicardphoto?client_id='+key;

	let promise1 = $.ajax({
		url:urlUser1,
		dataType: 'jsonp'
	});

	let promise2 = $.ajax({
		url:urlUser2,
		dataType: 'jsonp'
	});

	let promise3 = $.ajax({
		url:urlUser3,
		dataType: 'jsonp'
	});

	let promise4 = $.ajax({
		url:urlUser4,
		dataType: 'jsonp'
	});

	let width = 700;
	let height = 300;
	let margin = 100;
	let marginLeft = 100;


	$.when(promise1,promise2,promise3,promise4).done(function(r1,r2,r3,r4){

		let viewsData = [
			{name: r1[0].user.username, value: r1[0].user.stats.views},
			{name: r2[0].user.username, value: r2[0].user.stats.views},
			{name: r3[0].user.username, value: r3[0].user.stats.views},
			{name: r4[0].user.username, value: r4[0].user.stats.views}

		];

		let apprecData = [
			{name: r1[0].user.username, value: r1[0].user.stats.appreciations},
			{name: r2[0].user.username, value: r2[0].user.stats.appreciations},
			{name: r3[0].user.username, value: r3[0].user.stats.appreciations},
			{name: r4[0].user.username, value: r4[0].user.stats.appreciations}

		];

		let follData = [
			{name: r1[0].user.username, value: r1[0].user.stats.followers},
			{name: r2[0].user.username, value: r2[0].user.stats.followers},
			{name: r3[0].user.username, value: r3[0].user.stats.followers},
			{name: r4[0].user.username, value: r4[0].user.stats.followers}

		];

		let followingData = [
			{name: r1[0].user.username, value: r1[0].user.stats.following},
			{name: r2[0].user.username, value: r2[0].user.stats.following},
			{name: r3[0].user.username, value: r3[0].user.stats.following},
			{name: r4[0].user.username, value: r4[0].user.stats.following}

		];

// ==========  END OF PROMISES  ===========

		//console.log(r1[0].user.stats);
		// ===========  GRAPH-1 VIEWS  ============


		
		let viewsGraph = d3.select('#views')
					   	.append('g');
		viewsGraph.attr('transform','translate('+margin+','+margin+')')
					
							
		var maxViews = d3.max(viewsData, function(d) { return +d.value;} );
		var yViewsScale = d3.scaleLinear()
				.domain([0,maxViews])
				.range([height,0])	

		let viewsRects = viewsGraph.selectAll('rect')
			.data(viewsData)
			.enter()
			.append('rect')
			.attr('class','bar')
			.attr('width',50)
			.attr('x',function(d,i){ return i*100})
			.attr('y',function(d){ return yViewsScale(d.value) })
			.attr('height',function(d){ return height - yViewsScale(d.value) })	
			.attr('fill','#8ba3a6');

		viewsRects.on('mouseover',function(e){
			console.log(e);
		})

		var yAxisViewsGen = d3.axisLeft(yViewsScale).ticks(5);
		viewsGraph.append('g')
			.call(yAxisViewsGen);

		//tooltip for views
		var viewsTooltip = viewsGraph.append('g')
				.style('opacity',0)
				.attr('class','tooltip');


		viewsTooltip.append('rect')
				.attr('width',150)
				.attr('height',50)
				.attr('fill','rgba(0,0,0,0.8)');

		var viewsTooltipText = viewsTooltip.append('text')
								.text('bla')
								.attr('class','gtext')
								.attr('fill','white')
								.attr('x',75)
								.attr('y',25)
								.style('alignment-baseline', 'middle')
								.style('text-anchor', 'middle');

		viewsBars = viewsGraph.selectAll('.bar');

		//mouse events
		viewsBars.on('mouseover',function(d){
			viewsTooltip.style('opacity',1);
			viewsTooltipText.text(d.name + ' : '+ d.value);
		});

		viewsBars.on('mouseout',function(d){
			viewsTooltip.style('opacity',0);
		});

		viewsBars.on('mousemove',function(d){
			//move the tooltip around
			var mousePos = d3.mouse(this.parentNode);
			var xPos = mousePos[0]-75;
			var yPos = mousePos[1]-60;

			viewsTooltip.attr('transform','translate('+xPos+','+yPos+')');


		});


// ===========  GRAPH-2 APPRECIATIONS  ============

	let apprecGraph = d3.select('#appreciations')
						.append('g');
	apprecGraph.attr('transform','translate('+margin+','+margin+')')

	var maxApprec = d3.max(apprecData, function(d) { return +d.value;} );
	var yApprecScale = d3.scaleLinear()
			.domain([0,maxApprec])
			.range([height,0])	


	let apprecRects = apprecGraph.selectAll('rect')
		.data(apprecData)
		.enter()
		.append('rect')
		.attr('class','bar')
		.attr('width',50)
		.attr('x',function(d,i){ return i*100})
		.attr('y',function(d){ return yApprecScale(d.value) })
		.attr('height',function(d){ return height - yApprecScale(d.value) })
		.attr('fill','#4c6575');

	apprecRects.on('mouseover',function(e){
			console.log(e);
		})

	var yAxisApprecGen = d3.axisLeft(yApprecScale).ticks(5);
		apprecGraph.append('g')
			.call(yAxisApprecGen);

	//tooltip for appreciations
	var apprecTooltip = apprecGraph.append('g')
			.style('opacity',0)
			.attr('class','tooltip');


	apprecTooltip.append('rect')
			.attr('width',150)
			.attr('height',50)
			.attr('fill','rgba(0,0,0,0.8)');

	var apprecTooltipText = apprecTooltip.append('text')
							.text('bla')
							.attr('class','gtext')
							.attr('fill','white')
							.attr('x',75)
							.attr('y',25)
							.style('alignment-baseline', 'middle')
							.style('text-anchor', 'middle');

	apprecBars = apprecGraph.selectAll('.bar');

	//mouse events
	apprecBars.on('mouseover',function(d){
		apprecTooltip.style('opacity',1);
		apprecTooltipText.text(d.name + ' : '+ d.value);
	});

	apprecBars.on('mouseout',function(d){
		apprecTooltip.style('opacity',0);
	});

	apprecBars.on('mousemove',function(d){
		//move the tooltip around
		var mousePos = d3.mouse(this.parentNode);
		var xPos = mousePos[0]-75;
		var yPos = mousePos[1]-60;

		apprecTooltip.attr('transform','translate('+xPos+','+yPos+')');


	});


	// ===========  GRAPH-3 FOLLOWERS  ============


	let follGraph = d3.select('#followers')
						.append('g');
	follGraph.attr('transform','translate('+margin+','+margin+')')

	var maxFoll = d3.max(follData, function(d) { return +d.value;} );
	var yFollScale = d3.scaleLinear()
				.domain([0,maxFoll])
				.range([height,0])

	let follRects = follGraph.selectAll('rect')
		.data(follData)
		.enter()
		.append('rect')
		.attr('class','bar')
		.attr('width',50)
		.attr('x',function(d,i){ return i*100})
		.attr('y',function(d){ return yFollScale(d.value) })
		.attr('height',function(d){ return height - yFollScale(d.value) })
		.attr('fill','#293e4f');

	follRects.on('mouseover',function(e){
			console.log(e);
		})

	var yAxisFollGen = d3.axisLeft(yFollScale).ticks(5);
		follGraph.append('g')
			.call(yAxisFollGen);

	//tooltip for follows
	var follTooltip = follGraph.append('g')
			.style('opacity',0)
			.attr('class','tooltip');


	follTooltip.append('rect')
			.attr('width',150)
			.attr('height',50)
			.attr('fill','rgba(0,0,0,0.8)');

	var follTooltipText = follTooltip.append('text')
							.text('bla')
							.attr('class','gtext')
							.attr('fill','white')
							.attr('x',75)
							.attr('y',25)
							.style('alignment-baseline', 'middle')
							.style('text-anchor', 'middle');

	follBars = follGraph.selectAll('.bar');

	//mouse events
	follBars.on('mouseover',function(d){
		follTooltip.style('opacity',1);
		follTooltipText.text(d.name + ' : '+ d.value);
	});

	follBars.on('mouseout',function(d){
		follTooltip.style('opacity',0);
	});

	follBars.on('mousemove',function(d){
		//move the tooltip around
		var mousePos = d3.mouse(this.parentNode);
		var xPos = mousePos[0]-75;
		var yPos = mousePos[1]-60;

		follTooltip.attr('transform','translate('+xPos+','+yPos+')');


	});


// ===========  GRAPH-4 FOLLOWING  ============

	let followingGraph = d3.select('#following')
							.append('g');
	followingGraph.attr('transform','translate('+margin+','+margin+')')

	var maxFollowing = d3.max(followingData, function(d) { return +d.value;} );
		var yFollowingScale = d3.scaleLinear()
				.domain([0,maxFollowing])
				.range([height,0])

	let followingRects = followingGraph.selectAll('rect')
		.data(followingData)
		.enter()
		.append('rect')
		.attr('class','bar')
		.attr('width',50)
		.attr('x',function(d,i){ return i*100})
		.attr('y',function(d){ return yFollowingScale(d.value) })
		.attr('height',function(d){ return height - yFollowingScale(d.value) })
		.attr('fill','#1a2330');

	followingRects.on('mouseover',function(e){
			console.log(e);
	})

	var yAxisFollowingGen = d3.axisLeft(yFollowingScale).ticks(5);
	followingGraph.append('g')
		.call(yAxisFollowingGen);

	//tooltip for views
	var followingTooltip = followingGraph.append('g')
		.style('opacity',0)
			.attr('class','tooltip');


	followingTooltip.append('rect')
			.attr('width',150)
			.attr('height',50)
			.attr('fill','rgba(0,0,0,0.8)');

	var followingTooltipText = followingTooltip.append('text')
							.text('bla')
							.attr('class','gtext')
							.attr('fill','white')
							.attr('x',75)
							.attr('y',25)
							.style('alignment-baseline', 'middle')
							.style('text-anchor', 'middle');

	followingBars = followingGraph.selectAll('.bar');

	//mouse events
	followingBars.on('mouseover',function(d){
		followingTooltip.style('opacity',1);
		followingTooltipText.text(d.name + ' : '+ d.value);
	});

	followingBars.on('mouseout',function(d){
		followingTooltip.style('opacity',0);
	});

	followingBars.on('mousemove',function(d){
		//move the tooltip around
		var mousePos = d3.mouse(this.parentNode);
		var xPos = mousePos[0]-75;
		var yPos = mousePos[1]-60;

		followingTooltip.attr('transform','translate('+xPos+','+yPos+')');


	});

// ==========  END OF GRAPHS  ===========




	});

});
		

// var modal = document.getElementById('projects');

// // Get the button that opens the modal
// // var img = document.getElementById("history");
// var img2 = document.getElementById("nzImg");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks the button, open the modal 
// img.onclick = function() {
//     modal.style.display = "block";
// };

// img2.onclick = function() {
//     modal.style.display = "block";
// };

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// };

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// };

	

		






















