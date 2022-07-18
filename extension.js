let internals = {}

internals.options = {
	favicon: { 
		position: 'left',
		size: 16,  // values between 14 and 18 should work well
		paddingOffset: 4
	},
	provider: 'google'
};

function onload() {

	try {
		createObserver('div.roam-main');
		createObserver('div#right-sidebar');
	}
	catch (err) {
		console.error('roam-show-favicon', err);
	}
}

function onunload() {

	if (internals.observer) {
		internals.observer.disconnect();	
	}
}

function createObserver (selector) {

	let rootEl = document.querySelector(selector);

	let observerCallback = function observerCallback (mutationsList, observer) {

		// we don't care about mutationsList; it's simpler (and faster) to just query the DOM directly

		Array.from(rootEl.querySelectorAll(`${selector} a`)).forEach(addFaviconToAnchorEl);
	};

	// debounce the observer callback: 
	// "will postpone its execution until after wait = 500ms have elapsed since the last time it was invoked.";
	// otherwise we would be calling querySelectorAll and addFaviconToAnchorEl for for every keystroke

	let observer = internals.observer = new MutationObserver(debounce(observerCallback));

	let observerOptions = {
		attributes: false,
		childList: true,
		subtree: true
	}
	
	observer.observe(rootEl, observerOptions);

	// force initial execution by adding and immediatelly removing a dummy element

	rootEl.appendChild(document.createElement('span')).remove()
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
	'google': hostname => `https://www.google.com/s2/favicons?domain=${hostname}`,  // we could have used sz=16|32|64 (default is 16)
	'yandex': hostname => `https://favicon.yandex.net/favicon/${hostname}`, 
	// TODO: add https://icon.horse
}

function addFaviconToAnchorEl (el) {

	// skip "dummy anchor elements" that are internal to the roam app (examples: popover in the topbar, "All Pages")

	if (el.hostname === '') { return }

	// skip anchor elements that are already processed

	if (el.style['background-image'] !== '') { return }

	let { favicon, provider } = internals.options;

	// reference: https://css-tricks.com/favicons-next-to-external-links/
	
	el.style['background-image'] = `url(${providers[provider](el.hostname)})`;
	el.style['background-position'] = `${favicon.position} center`;
	el.style['background-repeat'] = 'no-repeat';
	el.style['background-size'] = `${favicon.size}px`;
	el.style[favicon.position === 'left' ? 'paddingLeft' : 'paddingRight'] = `${favicon.size + favicon.paddingOffset}px`;
}

export default {
  onload,
  onunload
};
