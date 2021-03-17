import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { Link, Route, Switch, BrowserRouter } from "react-router-dom";

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

const HomePage = ({name, onNameChange}) => {
	return (
		<div>
			<h2>Home</h2>
			<div>
				<label>
					<span>Name:</span>
					<input
						onChange={(event) => onNameChange(event.target.value)}
						type="text"
						value={name}
					/>
				</label>
				<p>Hello, {name}!</p>
			</div>
		</div>
	);
};

const ContactPage = ({name, onNameChange}) => {
	return (
		<div>
			<h2>Contact</h2>
			<div>
				<label>
					<span>Name:</span>
					<input
						onChange={(event) => onNameChange(event.target.value)}
						type="text"
						value={name}
					/>
				</label>
				<p>Hello, {name}!</p>
			</div>
		</div>
	);
};

const ProfilePage = ({name, onNameChange}) => {
	return (
		<div>
			<h2>Profile</h2>
			<div>
				<label>
					<span>Name:</span>
					<input
						onChange={(event) => onNameChange(event.target.value)}
						type="text"
						value={name}
					/>
				</label>
				<p>Hello, {name}!</p>
			</div>
		</div>
	);
};

const Main = ({name, onNameChange, externalNavigation}) => {
	return (
		<div className="app">
			<div>
				<h3>Internal Navigation</h3>
				<Link to="/">Home</Link>|
				<Link to="/contact">Contact</Link>|
				<Link to="/profile">Profile</Link>
			</div>
			<div className="content">
				<Switch>
					<Route exact path="/">
						<HomePage
							onNameChange={onNameChange}
							name={name}
						/>
					</Route>
					<Route path="/contact">
						<ContactPage
							onNameChange={onNameChange}
							name={name}
						/>
					</Route>
					<Route path="/profile">
						<ProfilePage
							onNameChange={onNameChange}
							name={name}
						/>
					</Route>
					<Route>
						<HomePage
							onNameChange={onNameChange}
							name={name}
						/>
					</Route>
				</Switch>
			</div>
			{/* <div>
				<h5>External Navigation</h5>
				<ul>
					{externalNavigation.routerBaseSite && <li><a href={externalNavigation.routerBaseSite}>{externalNavigation.routerBaseSite}</a></li>}
					{externalNavigation.routerBasePage && <li><a href={externalNavigation.routerBasePage}>{externalNavigation.routerBasePage}</a></li>}
					{externalNavigation.routerBaseComponents && externalNavigation.routerBaseComponents.flatMap(
						e => e.navigations
					).map(
						n => (<li key={n}><a href={n}>{n}</a></li>)
					)}
				</ul>
			</div> */}
		</div>
	);
};

class App extends React.Component {
	constructor(props) {
		super(props);

		try {
			this.unsubscribe = props.StateManager.GlobalStore.Get().Subscribe(
				'com.liferay.portlet.navigation',
				s => this.setState({...this.state, externalNavigation: s})
			);
		}
		catch(err) {
			console.debug("No store was found, ignoring.");
		}

		this.state = {
			// This illustrates a gotcha with web component attributes; if not
			// provided, `getAttribute` returns `null`, which prevents React's
			// defaultProps mechanism from working.
			//
			// If you care about it, you have to do a manual fallback.
			userName: props.userName ?? App.defaultProps.userName,
			routerBaseSelf: props.routerBaseSelf ?? App.defaultProps.routerBaseSelf,
			externalNavigation: {}
		};
	}

	componentDidUpdate(_prevProps, prevState) {
		if (this.props.onChange && this.state.userName !== prevState.userName) {
			this.props.onChange({userName: this.state.userName});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.userName && nextProps.userName !== this.state.userName) {
			this.setState({userName: nextProps.userName});
		}
	}

	componentWillUnmount() {
		this.unsubscribe && this.unsubscribe();
	}

	render() {
		return (
			<BrowserRouter basename={this.state.routerBaseSelf}>
				<Main
					name={this.state.userName}
					onNameChange={(userName) => this.setState({userName})}
					externalNavigation={this.state.externalNavigation}
				/>
			</BrowserRouter>
		);
	}
}

App.defaultProps = {
	userName: 'Jane Tester',
	routerBaseSelf: '/packages/simple-react-app'
};

class SimpleReactApp extends HTMLElement {
	static get observedAttributes() {
		return ['name'];
	}

	constructor() {
		super();

		this.container = document.createElement('div');

		this.attachShadow({mode: 'open'}).appendChild(this.container);
	}

	attributeChangedCallback(attributeName, oldValue, newValue) {
		if (attributeName === 'name') {
			// Trigger a whole-app re-render, just to show that we can.
			//
			// As noted here, this is ok for small apps:
			// https://stackoverflow.com/a/35675972/2103996
			this.connectedCallback();
		}
	}

	connectedCallback() {
		const StateManager = lookupDescriptor(this.getAttribute('statemanager-descriptor'));

		let name = this.getAttribute('name');
		let routerBaseSelf = this.getAttribute("router-base-self");

		this.render(name, routerBaseSelf, StateManager);
	}

	render(name, routerBaseSelf, StateManager) {
		ReactDOM.render(
			<App
				userName={name}
				routerBaseSelf={routerBaseSelf}
				StateManager={StateManager}
			/>,
			this.container
		);
	}

	disconnectedCallback() {
		ReactDOM.unmountComponentAtNode(this.container);
		this.unsubscribe && this.unsubscribe();
	}
}

if (!customElements.get('simple-react-app')) {
	customElements.define('simple-react-app', SimpleReactApp);
}

const container = document.getElementById('simple-react-app-standalone-root');

if (container) {
	const component = document.createElement('simple-react-app');

	container.appendChild(component);
}
