import { App } from './app.mjs';

const init = () => {
	window.removeEventListener('load', init);
	const app = new App('#root');
	console.info('page loaded, app running');
}

window.addEventListener('load', init);
