import React from 'react';
import ReactDOM from 'react-dom';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

export default [{
	input: 'src/state.js',
	output: {
		file: 'dist/state.js',
		format: 'iife',
	},
	plugins: [
		resolve({browser: true}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
		commonjs({
			include: /node_modules/
		}),
		babel({
			babelHelpers: 'bundled',
			exclude: /node_modules/,
		}),
	],
}, {
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'iife',
	},
	plugins: [
		resolve({browser: true}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
		commonjs({
			include: /node_modules/
		}),
		babel({
			babelHelpers: 'bundled',
			exclude: /node_modules/,
		}),
	],
}];
