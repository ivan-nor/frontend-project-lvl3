import init from './init.js';

import './style.scss';

const point = document.querySelector('#point');

const lng = 'ru';
const proxy = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
// const testProxy = 'https://allorigins.hexlet.app';

init(point, { lng, proxy });
