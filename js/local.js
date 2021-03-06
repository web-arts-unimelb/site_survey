(function ($) {
  Drupal.behaviors.site_survey = {
    attach: function(context, settings) {
			jQuery(document).ready(function() {
				// Ajax cross domain requests will work
				jQuery.support.cors = true;

				// Insert html
				jQuery(output_survey_1()).insertAfter("div#content-wrapper");
				
				// Initial
				responsive_func();
		
				// Resize
				// http://stackoverflow.com/questions/23996726/will-window-resize-fire-on-orientation-change
				window.addEventListener("orientationchange", function() {
    			responsive_func();
				}, false);
		
				jQuery('p.site_survey_denied a').click(function() {
					setCookie('site_survey_cookie','site_survey_cookie',30);
					//ajax to count denials??
					jQuery('.site_survey').dialog('close');
				});

				jQuery('.site_survey_cookie_delete').click(function() {		
					deleteCookie('site_survey_cookie');
					alert('Survey cookie cleared. Hit Refresh to see the survey again.');
				});

				//
				jQuery("input[name='visitor_type']").click(function() {
					if( jQuery('input:radio[name=visitor_type]:checked').val() === 'Other' )
					{
						// Keep other_visitor_type's value
					}
					else
					{
						 jQuery("input[name='other_visitor_type']").attr("value", "");
					}
				});

				//
				jQuery("input[name='other_visitor_type']").click(function() {
					jQuery("input[name='visitor_type']").removeAttr("checked");
					jQuery("input[value='Other']").attr("checked", true);
				});


				checkCookie('site_survey_cookie');
				assign_visitor_ip();	
			});
			
		}
	}
	
	function responsive_func() {
		var dialog_width = 0;
		var fix_margin = 10;
		width = jQuery(window).width();
		
		if(width <= 480) {
			dialog_width = width - 2*fix_margin;
		}
		else {
			dialog_width = 500;
		}
		
		// Call dialog
		// http://stackoverflow.com/questions/744554/jquery-ui-dialog-positioning
		jQuery(".site_survey").dialog({
			bgiframe: true,
			modal: true,
			width: dialog_width,
			resizable: false,
			autoOpen: true,
			buttons: {
				Submit: my_submit
			}
		}).dialog('widget').position({ my: 'top', at: 'center', of: jQuery('#content-wrapper') });
	}
	
	function my_submit() {
		var post_url = "http://arts.unimelb.edu.au/sites/arts.unimelb.edu.au/forms/site_survey/process_site_survey.php";
		// csv result here:
		// http://arts.unimelb.edu.au/sites/arts.unimelb.edu.au/forms/site_survey/csv.php		

		if(
			jQuery("input[name='visitor_type']:checked").val() === undefined &&
			jQuery("input[name='other_visitor_type']").val() === ''
		)
		{
			$("div.site_survey_error_message").html("<p>Please select an option</p>");		
		}
		else
		{
			setCookie('site_survey_cookie', 'site_survey_cookie', 30);

			jQuery.ajax({
				crossDomain: true,
				cache: false,
				url: post_url,
				data: $(".popup_site_survey").serialize(),
				dataType: 'jsonp',
				type: "POST",
				success:function(data){
					//alert("Good");
					if (window.console) {
						console.log(data);
					}	
				},
				error: function(jqXHR, textStatus, ex) {
	  			alert("Test: " + textStatus + "," + ex + "," + jqXHR.responseText);
				}
			});

			// Force to close
			jQuery('.site_survey').dialog('close');
		}
	}
	
	function setCookie(c_name, value, expiredays)
	{
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = c_name + "=" + escape(value) + ( (expiredays==null) ? "" : ";expires=" + exdate.toGMTString());
	}

	function getCookie(c_name)
	{
		if(document.cookie.length>0)
		{
			c_start = document.cookie.indexOf(c_name + "=");
			if(c_start != -1)
			{
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if(c_end == -1) 
					c_end = document.cookie.length;
				
				return unescape(document.cookie.substring(c_start,c_end));
			}
		}
		return "";
	}

	function checkCookie(c_name)
	{
		cookie_value = getCookie(c_name);
		if(cookie_value == "") 
		{
			jQuery('.site_survey').dialog('open');
		}
		else
		{
			jQuery('.site_survey').dialog('close');
		}  
	}

	function deleteCookie(c_name) 
	{
		document.cookie = c_name +'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	}

	// Old survey template, unused.
	function output_survey()
	{
		var output = '<div class="site_survey_container">\
			<div class="site_survey" title="Survey">\
				<p class="site_survey_denied"><a href="#">No, thanks</a></p>\
				<form class="popup_site_survey" name="popup_site_survey" method="post">\
					<p>We want to build a better website and learn more about you. Are you a:</p>\
					<input type="radio" name="visitor_type" value="Current undergraduate student" />Current undergraduate student<br />\
					<input type="radio" name="visitor_type" value="Current graduate student" />Current graduate student<br />\
					<input type="radio" name="visitor_type" value="Current research student" />Current research student<br />\
					<input type="radio" name="visitor_type" value="Prospective undergraduate student" />Prospective undergraduate student<br />\
					<input type="radio" name="visitor_type" value="Prospective graduate student" />Prospective graduate student<br />\
					<input type="radio" name="visitor_type" value="Prospective research student" />Prospective research student<br />\
					<input type="radio" name="visitor_type" value="Academic/researcher (University of Melbourne)" />Academic/researcher (University of Melbourne)<br />\
					<input type="radio" name="visitor_type" value="Academic/researcher (NON - University of Melbourne)" />Academic/researcher (NON - University of Melbourne)<br />\
					<input type="radio" name="visitor_type" value="Professional staff (University of Melbourne)" />Professional staff (University of Melbourne)<br /><br/>\
					<input type="radio" name="visitor_type" value="Other" />Other (please specify) <input type="text" name="other_visitor_type" value="" /><br />';
		
		output = output + '<input type="hidden" name="url" value="' + document.URL + '"/>';		
		output = output + '<input type="hidden" name="ip" value=""/>';			
		output = output +	'</form><div class="site_survey_error_message"></div></div></div>';

		return output;
	}


	// Another template
	function output_survey_1()
	{
		var output = '<div class="site_survey_container">\
		  <div class="site_survey" title="Survey">\
		    <p class="site_survey_denied"><a href="#">No, thanks</a></p>\
		    <form class="popup_site_survey" name="popup_site_survey" method="post">\
		      <p>We want to build a better website and learn more about you. Are you a:</p>\
		      <input type="radio" name="visitor_type" value="Current undergraduate student" />Current undergraduate student<br />\
		      <input type="radio" name="visitor_type" value="Current graduate student" />Current graduate student<br />\
		      <input type="radio" name="visitor_type" value="Prospective undergraduate student" />Prospective undergraduate student<br />\
		      <input type="radio" name="visitor_type" value="Prospective graduate student" />Prospective graduate student<br />\
		      <input type="radio" name="visitor_type" value="Academic/researcher (University of Melbourne)" />Academic/researcher (University of Melbourne)<br />\
		      <input type="radio" name="visitor_type" value="Academic/researcher (NON - University of Melbourne)" />Academic/researcher (NON - University of Melbourne)<br />\
					<input type="radio" name="visitor_type" value="Alumnus" />Alumnus<br />\
		      <input type="radio" name="visitor_type" value="Professional staff (University of Melbourne)" />Professional staff (University of Melbourne)<br />\
					<input type="radio" name="visitor_type" value="Industry or research partner" />Industry or research partner<br /><br />\
		      <input type="radio" name="visitor_type" value="Other" />Other (please specify) <input type="text" name="other_visitor_type" value="" /><br />';

		output = output + '<input type="hidden" name="url" value="' + document.URL + '"/>';
		output = output + '<input type="hidden" name="ip" value=""/>';
		output = output + '</form><div class="site_survey_error_message"></div></div></div>';

		return output;
	}

	function assign_visitor_ip()
	{
		//var url = "http://smart-ip.net/geoip-json?callback=?" // Not working??
		//var url = "http://api.ipify.org?format=json";
		var url = "http://ipinfo.io";
		jQuery.getJSON(url,
			function(data){
		  	jQuery("input[name='ip']").attr("value", data.ip);
				//test
				//console.log("test ip: " + data.ip);
		  }
		);
	}
})(jQuery);	


/*
NOTE: to clean the cookie in console, paste the following code
to console

function deleteCookie(c_name)
{
  document.cookie = c_name +'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}

deleteCookie('site_survey_cookie');

*/




