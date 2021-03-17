import React from 'react'
import ReactDOM from 'react-dom'
import styles from './index.css'
import primitiveui from './primitiveui.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'

class WebComponent extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        const routerBasename = this.getAttribute('router-base-self') ?? '';

        ReactDOM.render(
            <>
                <style type='text/css'>
                    {primitiveui[0][1]}
                    {styles[0][1]}
                </style>
                <React.StrictMode>
                    <Provider store={store}>
                        <App basename={routerBasename} />
                    </Provider>
                </React.StrictMode>
            </>,
            this.shadowRoot
        );
    }
}

if (!customElements.get('redux-essentials-example-app')) {
    customElements.define('redux-essentials-example-app', WebComponent);
}