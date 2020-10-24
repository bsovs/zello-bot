import openSocket from 'socket.io-client';
import { Capacitor } from '@capacitor/core';

let uri = `${window.location.protocol.toString()}//${window.location.hostname.toString()}`;
const port = `${window.location.port.toString()}`;

export let isLocal = false;

if(window.location.hostname==='localhost' && Capacitor.platform==='web'){
	uri += `:${port}`;
	isLocal = true;
}

const API_URL_REMOTE = `https://zellobot.herokuapp.com`;
const API_URL_LOCAL = `http://localhost:8080`;

export const GITHUB_CLIENT_ID = isLocal ? 'c8a0302dd23b175757a2' : '817801a99739bd814274';
export const API_URL = isLocal ? API_URL_LOCAL : API_URL_REMOTE;
export const socket = openSocket(`${API_URL}`);
