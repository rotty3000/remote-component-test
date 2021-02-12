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

	const initialState = {
		counter: 0,
		text: 'Fascinating sample text:',
	};

	const WORDS = ['foo', 'bar', 'baz', 'qux'];

	function reducer(state, action) {
		if (action.type === 'append') {
			return {
				...state,
				counter: state.counter + 1,
				text: state.text + ` ${WORDS[state.counter % WORDS.length]}`,
			};
		}
		else if (action.type === 'initial') {
			return action.state;
		}

		return state;
	}

	class ReduxVanillaSlim extends HTMLElement {
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

			const {dispatch, getState, subscribe} = StateManager.GlobalStore.Get(true).CreateStore('redux-vanilla-slim', reducer, []);

			this.dispatch = dispatch;

			this.unsubscribe = subscribe(() => {
				this.prose.innerText = getState().text;
			});

			this.dispatch({type: 'initial', state: initialState});
		}

		disconnectedCallback() {
			this.button.removeEventListener('click', this.append);

			this.unsubscribe();
		}
	}

	if (customElements.get('redux-vanilla-slim')) {
		console.log(
			'Skipping registration for <redux-vanilla-slim> (already registered)'
		);
	} else {
		customElements.define('redux-vanilla-slim', ReduxVanillaSlim);
	}
})();
