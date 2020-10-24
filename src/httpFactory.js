import * as $ from "jquery";
import {serverUri, isLocal, API_URL, GITHUB_CLIENT_ID} from "./Config/config";

class httpFactory {

	githubLogin = () => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/githubLogin`,
				type: "POST",
				timeout: 10000,
				success: (data) => {
					resolve(data);
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});		
	};
	githubCommit = () => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/gitcommit`,
				type: "POST",
				timeout: 10000,
				success: (data) => {
					resolve(data);
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					console.log(errorThrown);
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
}
export const http = new httpFactory();