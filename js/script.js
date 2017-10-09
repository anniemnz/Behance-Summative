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
			{name: 'user1', value: r1[0].user.stats.views},
			{name: 'user2', value: r2[0].user.stats.views},
			{name: 'user3', value: r3[0].user.stats.views},
			{name: 'user4', value: r4[0].user.stats.views}

		];

		let apprecData = [
			{name: 'user1', value: r1[0].user.stats.appreciations},
			{name: 'user2', value: r2[0].user.stats.appreciations},
			{name: 'user3', value: r3[0].user.stats.appreciations},
			{name: 'user4', value: r4[0].user.stats.appreciations}

		];

		let follData = [
			{name: 'user1', value: r1[0].user.stats.followers},
			{name: 'user2', value: r2[0].user.stats.followers},
			{name: 'user3', value: r3[0].user.stats.followers},
			{name: 'user4', value: r4[0].user.stats.followers}

		];

		let followingData = [
			{name: 'user1', value: r1[0].user.stats.following},
			{name: 'user2', value: r2[0].user.stats.following},
			{name: 'user3', value: r3[0].user.stats.following},
			{name: 'user4', value: r4[0].user.stats.following}

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

		viewsGraph.selectAll('rect')
			.data(viewsData)
			.enter()
			.append('rect')
			.attr('width',50)
			.attr('x',function(d,i){ return i*100})
			.attr('y',function(d){ return yViewsScale(d.value) })
			.attr('height',function(d){ return height - yViewsScale(d.value) })	
			.attr('fill','#8ba3a6');

		var yAxisViewsGen = d3.axisLeft(yViewsScale).ticks(5);
		viewsGraph.append('g')
			.call(yAxisViewsGen);


// ===========  GRAPH-2 APPRECIATIONS  ============

	let apprecGraph = d3.select('#appreciations')
						.append('g');
	apprecGraph.attr('transform','translate('+margin+','+margin+')')

	var maxApprec = d3.max(apprecData, function(d) { return +d.value;} );
		var yApprecScale = d3.scaleLinear()
				.domain([0,maxApprec])
				.range([height,0])	


	apprecGraph.selectAll('rect')
		.data(apprecData)
		.enter()
		.append('rect')
		.attr('width',50)
		.attr('x',function(d,i){ return i*100})
		.attr('y',function(d){ return height - d.value})
		.attr('y',function(d){ return yApprecScale(d.value) })
		.attr('height',function(d){ return height - yApprecScale(d.value) })
		.attr('fill','#4c6575');

	var yAxisApprecGen = d3.axisLeft(yApprecScale).ticks(5);
		apprecGraph.append('g')
			.call(yAxisApprecGen);


	// ===========  GRAPH-3 FOLLOWERS  ============


	let follGraph = d3.select('#followers')
						.append('g');
	follGraph.attr('transform','translate('+margin+','+margin+')')

	var maxFoll = d3.max(follData, function(d) { return +d.value;} );
		var yFollScale = d3.scaleLinear()
				.domain([0,maxFoll])
				.range([height,0])

	follGraph.selectAll('rect')
		.data(follData)
		.enter()
		.append('rect')
		.attr('width',50)
		.attr('x',function(d,i){ return i*100})
		.attr('y',function(d){ return height - d.value})
		.attr('y',function(d){ return yFollScale(d.value) })
		.attr('height',function(d){ return height - yFollScale(d.value) })
		.attr('fill','#293e4f');

	var yAxisFollGen = d3.axisLeft(yFollScale).ticks(5);
		follGraph.append('g')
			.call(yAxisFollGen);


// ===========  GRAPH-4 FOLLOWING  ============

	let followingGraph = d3.select('#following')
							.append('g');
	followingGraph.attr('transform','translate('+margin+','+margin+')')

	var maxFollowing = d3.max(followingData, function(d) { return +d.value;} );
		var yFollowingScale = d3.scaleLinear()
				.domain([0,maxFollowing])
				.range([height,0])

	followingGraph.selectAll('rect')
		.data(followingData)
		.enter()
		.append('rect')
		.attr('width',50)
		.attr('x',function(d,i){ return i*100})
		.attr('y',function(d){ return height - d.value})
		.attr('y',function(d){ return yFollowingScale(d.value) })
		.attr('height',function(d){ return height - yFollowingScale(d.value) })
		.attr('fill','#1a2330');

		var yAxisFollowingGen = d3.axisLeft(yFollowingScale).ticks(5);
		followingGraph.append('g')
			.call(yAxisFollowingGen);

// ==========  END OF GRAPHS  ===========




	});

});
		



	

		






















