(function () {
	'use strict';

	/**
	 * Similar to the implementation of `lookupCallback` in simple-react-app.
	 *
	 * Given a descriptor of the form `foo.bar.baz`, looks up
	 * `window.foo.bar.baz`.
	 *
	 * Returns `undefined` if no such property exists.
	 */
	function lookupDescriptor(descriptor) {
		let api = window;
		for (const property of descriptor.split('.')) {
			if (property in api) {
				api = api[property];
			}
			else {
				api = undefined;
				break;
			}
		}
		return api
	}

	// Demo reducer.

	let defaultText = 'Lorem ipsum';

	const WORDS = `
		lorem ipsum dolor sit amet consectetur adipiscing elit sed do
		eiusmod tempor incididunt ut labore et dolore magna aliqua Ut
		enim ad minim veniam quis nostrud exercitation ullamco laboris
		nisi ut aliquip ex ea commodo consequat duis aute irure dolor in
		reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
		pariatur excepteur sint occaecat cupidatat non proident sunt in
		culpa qui officia deserunt mollit anim id est laborum
	`
		.trim()
		.split(/\s+/);

	function getRandomWord() {
		return WORDS[Math.floor(Math.random() * WORDS.length)];
	}

	function reducer(state, action) {
		if (action.type === 'append') {
			return {
				...state,
				text: `${state.text || defaultText} ${getRandomWord()}`,
			};
		}

		return state || {};
	}

	class ReduxVanilla extends HTMLElement {
		constructor() {
			super();

			this.button = document.createElement('button');
			this.button.innerText = '...';

			this.prose = document.createElement('div');

			const root = document.createElement('div');

			root.appendChild(this.prose);
			root.appendChild(this.button);

			this.attachShadow({mode: 'open'}).appendChild(root);

			this.append = this.append.bind(this);
		}

		append() {
			this.dispatch({type: 'append'});
		}

		connectedCallback() {
			this.button.addEventListener('click', this.append);

			const StateManager = lookupDescriptor(this.getAttribute('statemanager-descriptor'));

			const {dispatch, getState, subscribe} = StateManager.GlobalStore.Get(true).CreateStore('redux-vanilla', reducer, []);

			this.dispatch = dispatch;

			this.unsubscribe = subscribe(() => {
				this.prose.innerText = getState().text;
			});

			this.append();
		}

		disconnectedCallback() {
			this.button.removeEventListener('click', this.append);

			this.unsubscribe();
		}
	}

	if (!customElements.get('redux-vanilla')) {
		customElements.define('redux-vanilla', ReduxVanilla);
	}
})();
