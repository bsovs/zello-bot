import * as $ from "jquery";
import {serverUri, isLocal, API_URL, GITHUB_CLIENT_ID} from "./Config/config";

class httpFactory {

	betsPage = () => {
		$.ajax({
			url: API_URL + `/lol-bets`,
			type: "GET",
			timeout: 15000
		});	
	}

	setBet = (summoner, wager, isWin) => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/lol/setBet?summoner=${summoner}&wager=${wager}&isWin=${isWin}`,
				type: "POST",
				timeout: 30000,
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});		
	};
	
	logout = () => { 
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/logout/`,
				type: "POST",
				success: (data) => {
					resolve(data);
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});		
	};
	
	login = () => { 
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/token/`,
				type: "POST",
				data: ``,
				success: (data) => {
					resolve(JSON.stringify({"success": data}));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					resolve(JSON.stringify({"error": errorThrown}));
				}
			});
		});		
	};
	
	login = (username, password, grant_type, scope, client_id, client_secret) => { 
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/token/`,
				type: "POST",
				data: `username=${username}&password=${password}`+
					'&grant_type='+(grant_type?grant_type:'')+
					'&scope='+(scope?scope:'')+
					'&client_id='+(client_id?client_id:'')+
					'&client_secret='+(client_secret?client_secret:''),
				success: (data) => {
					resolve(JSON.stringify({"success": data}));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					resolve(JSON.stringify({"error": errorThrown}));
				}
			});
		});		
	};
	
	signup = (username, password, email, fullName) => { 
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/signup/?username=${username}&password=${password}&email=${email}&full_name=${fullName}`,
				type: "POST",
				success: (data) => {
					resolve(JSON.stringify({"success": data}));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					resolve(JSON.stringify({"error": errorThrown}));
				}
			});
		});		
	};
	
	getProfile = (JWT) => { 
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/users/me/`,
				type: "GET",
				success: (data) => {
					resolve(data);
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					console.log('Error', errorThrown);
					reject(errorThrown);
				}
			});
		});		
	};
}
export const http = new httpFactory();