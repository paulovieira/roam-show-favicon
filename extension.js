let internals = {};

internals.anchorSelector = 'a[target="_blank"]';
internals.observers = {};
internals.options = {
	favicon: { 
		position: 'left',
		size: 16,  // values between 14 and 18 should work well
		paddingOffset: 4
	},
	provider: 'duckduckgo'
};

function onload() {

	startObserver('div.roam-main');
	startObserver('div#right-sidebar');
}

function onunload() {

	stopObserver('div.roam-main');
	stopObserver('div#right-sidebar');
}

function startObserver (selector) {

	let rootEl = document.querySelector(selector);

	if (rootEl == null) { return }

	// reference: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/MutationObserver

	let observerCallback = function observerCallback (mutationList, observer) {

		// we don't care about mutationList; it's simpler (and faster) to just query the DOM directly

		Array.from(rootEl.querySelectorAll(internals.anchorSelector)).forEach(addFavicon);
	};

	// debounce the observer callback: 
	// "will postpone its execution until after wait = 500ms have elapsed since the last time it was invoked.";
	// otherwise we would be calling querySelectorAll + addFavicon for for every keystroke, which
	// would be unnecessary

	internals.observers[selector] = new MutationObserver(debounce(observerCallback));

	let observerOptions = {
		attributes: false,
		childList: true,
		subtree: true
	}
	
	internals.observers[selector].observe(rootEl, observerOptions);

	// force initial execution

	observerCallback()
}

function stopObserver (selector) {
	
	internals.observers[selector].disconnect();

	let rootEl = document.querySelector(selector);
	Array.from(rootEl.querySelectorAll(internals.anchorSelector)).forEach(removeFavicon);	
}

function debounce (fn, wait = 500) {

  let timeoutId = null;
  let debouncedFn = function debouncedFn (...args) {

    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(fn, wait, ...args);
  };

  return debouncedFn;
}

// reference: https://dev.to/derlin/get-favicons-from-any-website-using-a-hidden-google-api-3p1e

let providers = {
	'duckduckgo': hostname => `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
	'google': hostname => `https://www.google.com/s2/favicons?domain=${hostname}`,  // we can also use sz=16|32|64 (default is 16)
	'yandex': hostname => `https://favicon.yandex.net/favicon/${hostname}`, 
	// TODO: add https://icon.horse?
}

function addFavicon (el) {

	// skip anchor elements that have already been processed

	if (el.dataset.showFavicon === 'true') { return }

	// add favicon according to this technique: https://css-tricks.com/favicons-next-to-external-links/

	let { favicon, provider } = internals.options;
	let faviconUrl = providers[provider](el.hostname);

	el.style['background-image'] = `url(${faviconUrl})`;
	el.style['background-position'] = `${favicon.position} center`;
	el.style['background-repeat'] = 'no-repeat';
	el.style['background-size'] = `${favicon.size}px`;
	el.style[favicon.position === 'left' ? 'paddingLeft' : 'paddingRight'] = `${favicon.size + favicon.paddingOffset}px`;

	el.dataset.showFavicon = 'true';
}

function removeFavicon (el) {

	if (el.dataset.showFavicon === 'true') {
		// 'initial' means 'none'; see: https://developer.mozilla.org/en-US/docs/Web/CSS/background-image?retiredLocale=pt-PT#formal_definition
		el.style['background-image'] = 'initial';
		el.style['background-position'] = 'initial';
		el.style['background-repeat'] = 'initial';
		el.style['background-size'] = 'initial';
		el.style[internals.options.favicon.position === 'left' ? 'paddingLeft' : 'paddingRight'] = 'initial';

		delete el.dataset.showFavicon;
	}
}

export default {
  onload,
  onunload
};
