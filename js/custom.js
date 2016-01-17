$(document).ready(function(){
	locallinks_init();
	countdown_init();
	buttons_init();
	news_init();
	agenda_init();
	
	shadelr_init();
	speakers_init();

	fix_placeholders();	
	fillform_init();
	
	setTimeout(iscroll_init, 200);

	$('.register-button').click(function (event) {
		event.preventDefault();
		$('#paypalForm').submit();
	});

	if($.browser.webkit)
		$('body').addClass('webkit');

	if(navigator.platform.indexOf("iPhone") == -1 && navigator.platform.indexOf("Symbian") == -1)
	{
		cufon_init();
			
		$(window).resize(function(){
			cufon_refresh_resize();
		});
	}
	
	if(navigator.platform.indexOf("iPhone") != -1 || navigator.platform.indexOf("iPad") != -1 || navigator.platform.indexOf("Symbian") != -1 || navigator.platform.indexOf("android") != -1)
		$('body').addClass('touch-device');

	headline_init();
});

function locallinks_init()
{
	$('a[href^=#]').each(function(){
		var rel=$(this).attr('href');
		var $obj=$(rel);
		if($obj.length)
		{
			$(this).click(function(){
				var $obj=$($(this).attr('href'));
				var top=$obj.offset().top-20;
				$('body,html').stop(true).animate({scrollTop: top+'px'}, 700);
					
				window.location.hash=rel;
				return false;
			});
		}
	});
}

function headline_init()
{
	var pw=$(window).width();
	$('.headline-wrapper').mousemove(function(e){
		var k=e.pageX/pw-0.5;
		var bx=Math.round(k*600);
		var sx=Math.round(k*300);
		$('.headline-wrapper').stop(true).animate({backgroundPosition: bx+'px 0'}, 1000);
		$('.headline').stop(true).animate({backgroundPosition: sx+'px 0'}, 1000);
	});
}

/********* Iscroll ************/
var newsScroll;
function iscroll_init()
{
	if(!$.browser.msie)
	{
		newsScroll = new iScroll('news-scroll-frame', {
			scrollbarClass: 'news-scrollbar',
			hScroll: false,
			hideScrollbar: true
		});
	}
}
/********* /Iscroll ************/

function speakers_init()
{
	$('.speakers > li').mouseenter(function(){
		$(this).children('.pic').stop(true).animate({top: '-10px'}, 600, 'swing');
	}).mouseleave(function(){
		$(this).children('.pic').stop(true).animate({top: '0px'}, 600, 'swing');
	});
}

function news_init()
{
	$('#news > li').addClass('shade-lr').mouseleave(function(){
		$('#news > li.hov').removeClass('hov');
	}).mouseenter(function(){
		$('#news > li.hov').removeClass('hov');
	});
	$('#news > li:first').addClass('hov');
}

function agenda_init()
{
	$('.agenda-item').addClass('shade-lr');
}

function shadelr_init()
{
	$('.shade-lr').append('<span class="shade_l"/><span class="shade_r"/>');
}

function cufon_init()
{
	Cufon.replace('.dates-place, .countdown-comment', { fontFamily: 'Open Sans', textShadow: '0 0 #dbdce5'});
	Cufon.replace('.countdown-box .field .value .current', { fontFamily: 'Open Sans', textShadow: '0 -1px rgba(0, 0, 0, 0.4)'});
	Cufon.replace('.countdown-box .field .value .next', { fontFamily: 'Open Sans', textShadow: '0 -1px rgba(0, 0, 0, 0.4)'});
	Cufon.replace('h1', { fontFamily: 'Terminal Dosis', textShadow: '0 2px rgba(0,0,0,0.8)'});
	Cufon.replace('h2, h3, h4, h5, h6, .agenda-day', { fontFamily: 'Open Sans' , textShadow: '0 2px #fff'});
	Cufon.replace('.agenda-day', { fontFamily: 'Open Sans' , textShadow: '0 2px #fff'});
	Cufon.replace('.register-pane .text div', { fontFamily: 'Open Sans' , textShadow: '0 -1px #000'});
	Cufon.replace('.register-button', { fontFamily: 'Open Sans', textShadow: '0 -1px rgba(0, 0, 0, 0.25)'});
	Cufon.replace('.menu', { fontFamily: 'Open Sans', hover: true});
}

function cufon_refresh_resize()
{
	Cufon.refresh('h1');
	Cufon.refresh('h2, h3, h4, h5, h6, .agenda-day');
	Cufon.refresh('.register-button');
}

function buttons_init()
{
	$('.register-button').wrapInner('<span class="inner"/>').prepend('<span class="hov"/>');
	$('.register-button').mouseenter(function(){
		$(this).children('.hov').stop(true).fadeTo(700,1);
		$(this).children('.inner:not(:animated)').animate({backgroundPosition: '200% 0'},500,'easeInExpo',function(){
			$(this).css('background-position','-100% 0').animate({backgroundPosition: '50% 0'},500,'easeOutExpo');
		});
	}).mouseleave(function(){
		$(this).children('.hov').stop(true).fadeTo(500,0);
		$(this).children('.inner:not(:animated)').animate({backgroundPosition: '50% 0'},500);
	}).click(function(){
		if($(this).attr('href') == '#register-form')
		{
			setTimeout(function(){
				$('.form-wraper').addClass('lighted');
				setTimeout(function(){
					$('.form-wraper').removeClass('lighted');
				},700);
			},1500);
			
			return false;
		}
	});
	
	setInterval(function(){
		$('.register-button').children('.inner:not(:animated)').animate({backgroundPosition: '200% 0'},500,'easeInExpo',function(){
			$(this).css('background-position','-100% 0').animate({backgroundPosition: '50% 0'},500,'easeOutExpo');
		});
	},7000);	
}

function countdown_init()
{
	if($('#countdown').length)
	{
		var $obj=$('#countdown');
		
		var txt=$obj.text().replace( /^\s+/g, '').replace( /\s+$/g, '');
		var tmp=txt.split(' ');
		if(tmp.length == 2)
		{
			var tmp_d=tmp[0].split('-');
			var tmp_h=tmp[1].split(':');
			if(tmp_d.length == 3 && tmp_h.length == 3)
			{
				$('#countdown').after(
					'<div class="countdown-box">'+
						'<div class="field">'+
							'<div class="value" id="countdown-days"><div class="current"></div><div class="next"></div><div class="shade"></div></div>'+
							'<div class="name">days</div>'+
						'</div>'+
						'<div class="field dropshade">'+
							'<div class="value" id="countdown-hours"><div class="current"></div><div class="next"></div><div class="shade"></div></div>'+
							'<div class="name">hrs</div>'+
						'</div>'+
						'<div class="field dropshade">'+
							'<div class="value" id="countdown-minutes"><div class="current"></div><div class="next"></div><div class="shade"></div></div>'+
							'<div class="name">min</div>'+
						'</div>'+
						'<div class="field dropshade last">'+
							'<div class="value" id="countdown-seconds"><div class="current"></div><div class="next"></div><div class="shade"></div></div>'+
							'<div class="name">sec</div>'+
						'</div>'+
						'<div class="clear"></div>'+
					'</div>'
				);
				
				$obj.countdown({
					until: new Date(tmp_d[0], tmp_d[1]-1, tmp_d[2], tmp_h[0], tmp_h[1], tmp_h[2]),
					onTick: countdown_tick
				});
			}
			else
				$(this).remove();
		}
		else
			$(this).remove();
	}
}

function countdown_tick(periods)
{
	var d,h,m,s;
	var cd,ch,cm,cs;
	
	if(periods[3] < 10)
		d='0'+periods[3];
	else
		d=periods[3];
		
	if(periods[4] < 10)
		h='0'+periods[4];
	else
		h=periods[4];
		
	if(periods[5] < 10)
		m='0'+periods[5];
	else
		m=periods[5];
		
	if(periods[6] < 10)
		s='0'+periods[6];
	else
		s=periods[6];
	
	cd=$('#countdown-days').children('.current').text();
	ch=$('#countdown-hours').children('.current').text();
	cm=$('#countdown-minutes').children('.current').text();
	cs=$('#countdown-seconds').children('.current').text();
	
	if(s != cs)
	{
		var $next=$('#countdown-seconds').children('.next');
		var $current=$('#countdown-seconds').children('.current');
		countdown_scroll($next,$current,s);
	}
	
	if(m != cm)
	{
		var $next=$('#countdown-minutes').children('.next');
		var $current=$('#countdown-minutes').children('.current');
		countdown_scroll($next,$current,m);
	}
	
	if(h != ch)
	{
		var $next=$('#countdown-hours').children('.next');
		var $current=$('#countdown-hours').children('.current');
		countdown_scroll($next,$current,h);
	}
	
	if(d != cd)
	{
		var $next=$('#countdown-days').children('.next');
		var $current=$('#countdown-days').children('.current');
		countdown_scroll($next,$current,d);
	}
}

function countdown_scroll($next,$current,val)
{
	var cur_top=0;
	var next_top=-54;
	var cur_goto_top=54;
	
	if(val.toString().length > 2)
		$next.addClass('narrow');
	else
		$next.removeClass('narrow');
	$next.html(val);
	Cufon.refresh('.countdown-box .field .value .next');

	$next.removeClass('next').addClass('current');
	$next.css('top',next_top+'px');
	$next.stop(true).animate({top:cur_top+'px'},1000, 'linear');
	
	$current.removeClass('current').addClass('next');
	$current.stop(true).animate({top:cur_goto_top+'px'},1000, 'linear');
}

/*************************************************************************/

// "Fill the form" block
function fillform_init()
{
  var options = {
		data: { site: 1 },
		success: fillform_success,
		dataType: 'json',
		beforeSubmit: fillform_before
	}; 	
	
	$("#contact-form").validate({
		submitHandler: function(form) {
			$(form).ajaxSubmit(options);
		},
		errorPlacement: function(error, element) {
		},
		wrapper: 'div'
	});
}

function fillform_before()
{
	var $obj=$('#contact-form');
	$obj.fadeTo(300,0.5);
	$obj.before('<div id="contact-form-blocker" style="position:absolute;width:'+$obj.outerWidth()+'px;height:'+$obj.outerHeight()+'px;z-index:9999;background:url(img/ajax-loading.gif) no-repeat center center"></div>');
}

function fillform_success(obj)
{
	$('#contact-form-blocker').remove();
	if(obj.error == 0)
	{
		$('#contact-form').fadeOut(300,function(){
			$('#contact-form').remove();
			$('#contact-form-success').fadeIn(200);
		});
	}
	else
	{
		$('#contact-form').fadeOut(300,function(){
			$('#contact-form').remove();
			$('#contact-form-error').fadeIn(200);
		});		
	}
}

/***********************************/

function fix_placeholders() {
	
	var input = document.createElement("input");
  if(('placeholder' in input)==false) { 
		jQuery('[placeholder]').focus(function() {
			var i = jQuery(this);
			if(i.val() == i.attr('placeholder')) {
				i.val('').removeClass('placeholder');
				if(i.hasClass('password')) {
					i.removeClass('password');
					this.type='password';
				}			
			}
		}).blur(function() {
			var i = jQuery(this);	
			if(i.val() == '' || i.val() == i.attr('placeholder')) {
				if(this.type=='password') {
					i.addClass('password');
					this.type='text';
				}
				i.addClass('placeholder').val(i.attr('placeholder'));
			}
		}).blur().parents('form').submit(function() {
			jQuery(this).find('[placeholder]').each(function() {
				var i = jQuery(this);
				if(i.val() == i.attr('placeholder')) {
					i.val('').removeClass('placeholder').addClass('placeholder-submitting');
					if(i.hasClass('password')) {
						i.removeClass('password');
						this.type='password';
					}			
				}
			})
		});
	}
}