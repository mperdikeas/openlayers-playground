/*
 *  a: sse-1604650096
 *  When I didn't set `esModuleInterop` in my tsconfig.json I was doing:
 *
 *      import * as $ from 'jquery';
 *
 *  When I set it to true, Typescript was complaining with:
 *
 *      TS2349: This expression is not callable.
 *
 *  ... in all cases where I was using $ to wrap something. E.g. as in '$(document).ready(...)'
 *
 *  changing the import statement to the form used below solved that.
 *
 */

import 'reset-css';

import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './app.tsx';
import './styles.css';
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'

import $ from 'jquery'; 
declare const window: any;
window.$ = $; // make jquery available to other scripts (not really applicable in our case) and the console

$(document).ready(doStuff);

function doStuff() {
  doRender();
}

function doRender() {
  ReactDOM.render(
    <App/>
    , $('#app')[0]);
}



