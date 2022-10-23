// @ts-check

import 'bootstrap';

import init from './init';

import '../styles/style.scss';

const point = document.querySelector('#point');

const lng = 'ru';
const proxy = 'https://allorigins.hexlet.app/get?url=';

init(point, { lng, proxy });
