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

function reducer(state = {payload: 'No task selected'}, action) {
	switch (action.type) {
		case 'task.list/update':
			return {...state, payload: action.payload};
		default:
			return state;
	}
}

const template = document.createElement('template');
template.innerHTML = `
<h2>Task Details</h2>
<pre></pre>
`;

class CamundaTaskSample extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.content.cloneNode(true));

        this.pre = this.shadowRoot.querySelector('pre');
    }

    connectedCallback() {
        const StateManager = lookupDescriptor(this.getAttribute('statemanager-descriptor'));

        const {getState, subscribe} = window.StateManager.GlobalStore.Get().CreateStore('com.desjardins.camunda.task.list', reducer, [], ['task.list/update']);

        this.unsubscribe = subscribe(() => {
            this.pre.innerText = JSON.stringify(getState().payload, null, 2);
        });

        this.pre.innerText = JSON.stringify(getState().payload, null, 2);
    }

    disconnectedCallback() {
        this.unsubscribe();
    }
}

if (!customElements.get('camunda-task-sample')) {
    customElements.define('camunda-task-sample', CamundaTaskSample);
}
