// This would cause a scroll down on small screens
//$(function () { $('#appKey').focus(); })

$('#siteSearchForm').submit(function(e) {
	e.preventDefault();

	$('#lastSearch').val($('#searchBox').val());
	$('#pageNumber').val('1');

	doSearch();
});

$('.search-results-footer li.next a').click(function(e) {
	e.preventDefault();

	if (!$(e.target).parent().hasClass('disabled')) {
		$('#pageNumber').val(parseInt($('#pageNumber').val()) + 1);
		doSearch();
	}
})

$('.search-results-footer li.previous a').click(function(e) {
	e.preventDefault();

	if (!$(e.target).parent().hasClass('disabled')) {
		$('#pageNumber').val(parseInt($('#pageNumber').val()) - 1);
		doSearch();
	}
})

function beginLoadResults()
{
	$('.search-results-repeater').children().not('.template').remove();
	$('.search-results-footer').hide();
	window.scrollTo(0, 0);
}

function doSearch() {
	if (!$('#appKey').val()) {
		alert('App Key is required.');
		$('#appKey').focus();
		return;
	}
	if (!$('#searchBox').val()) {
		alert('Query is required.');
		$('#searchBox').focus();
		return;
	}

	beginLoadResults();

	$.bingSearch({
		appKey: $('#appKey').val(),
		pageNumber: parseInt($('#pageNumber').val()),
		query: $('#lastSearch').val(),
		debug: false,
		beforeSearchResults: function(data) {
			if (data.hasMore || $('#pageNumber').val() > 1) {
				$('.search-results-footer .pagination').show();
				$('.search-results-footer .end').hide();
			}
			else {
				$('.search-results-footer .end').show();
				$('.search-results-footer .pagination').hide();
			}

			$('.search-results-footer').show();
			if ($('.search-results').is(':hidden')) {
				$('.search-results').removeClass('hidden');
			}
		},
		searchResultIterator: function(data) {
			var instance = $('.search-results-repeater .template').clone();
			$(instance).removeClass('template');

			var link = $(instance).find('.search-result-title a');
			var displayLink = $(instance).find('.search-result-displayurl a');
			var description = $(instance).find('.search-result-description');
			var displayurl = $(instance).find('.search-result-displayurl');

			$(link).attr('href', data.Url);
			$(link).text(data.Title);

			$(displayLink).attr('href', data.Url);
			$(displayLink).text(data.DisplayUrl);

			$(description).text(data.Description);

			$('.search-results-repeater').append(instance);
		},
		afterSearchResults: function(data) {
			var prev = $('.search-results-footer li.previous');
			var next = $('.search-results-footer li.next');
			var page = parseInt($('#pageNumber').val());

			if (prev.hasClass('disabled') && page > 1)
				prev.removeClass('disabled');
			else if (page == 1)
				prev.addClass('disabled');

			if (next.hasClass('disabled') && data.hasMore)
				next.removeClass('disabled');
			else if (!data.hasMore)
				next.addClass('disabled');

			if (!$('#appKey').hasClass('disabled')) {
				$('#appKey').addClass('disabled');
			}

			// Scroll code courtesy of http://stackoverflow.com/a/2906009
			var container = $('html, body');
			var scrollTo = $("div.search-results").first();
			var funcScroll = function() { container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop()); }
			window.setTimeout(funcScroll, 100);
		}
	});
}
