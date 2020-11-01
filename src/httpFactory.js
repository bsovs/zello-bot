import * as $ from "jquery";
import {serverUri, isLocal, API_URL, GITHUB_CLIENT_ID} from "./Config/config";

class httpFactory {

	getProfile = () => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/profile`,
				type: "GET",
				timeout: 15000,
				success: (data) => {
					resolve(data);
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});		
	}

	setBet = (summoner, wager, isWin) => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/lol/setBet?summoner=${summoner}&wager=${wager}&isWin=${isWin}`,
				type: "POST",
				timeout: 60000,
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});		
	};
	
	getBets = () => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/lol/getBets`,
				type: "GET",
				timeout: 15000,
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});	
	};
	
	checkBet = (betId) => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/lol/checkBet?betId=${betId}`,
				type: "POST",
				timeout: 60000,
				success: (data) => {
					resolve(data);
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});		
	};
	
	getPopularBets = () => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/lol/getPopularBets`,
				type: "GET",
				timeout: 15000,
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});	
	};

	getBetOdds = (summonerName) => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/lol/get-odds?summonerName=${summonerName}`,
				type: "GET",
				timeout: 15000,
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	};

	spinWheel = (betNumber, wager) => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/bets/roulette?betNumber=${betNumber}&wager=${wager}`,
				type: "POST",
				timeout: 15000,
				success: (data) => {
					resolve(data);
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	};

	getBankList = () => {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: API_URL + `/zbucks/getBankList`,
				type: "GET",
				timeout: 15000,
				success: (data) => {
					resolve(JSON.parse(data));
				},
				error: (XMLHttpRequest, textStatus, errorThrown) => {
					reject(errorThrown);
				}
			});
		});
	};
	
	/*
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
	*/
}
export const http = new httpFactory();