import init from './init.js';

import './style.scss';

const point = document.querySelector('#point');

const lng = 'ru';
const proxy = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

init(point, { lng, proxy });
