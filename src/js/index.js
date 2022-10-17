// @ts-check

import 'bootstrap';

import init from './init';

import '../styles/style.css';
import '../styles/style.scss';

const point = document.querySelector('#point');

const lng = 'ru';

init(point, { lng });
