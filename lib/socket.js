var c         = require('./common.js'),
	sockets   = {};


module.exports = function(conn) {
	SOCKET.handler.addToSockets(conn);

	conn.on('data', function(message) {
		SOCKET.handler.onDataEvent(conn, message);
	});

	conn.on('close', function() {
		SOCKET.handler.onCloseEvent(conn);
	});
}


var SOCKET = new SOCKTET_LIB() || {};

SOCKET.init();

function SOCKTET_LIB(){
	var self = this;

    //VOEG EEN FUNCTIE TOE AAN DE FUNCTIE ARRAY();
    Array.prototype.contains = function(v) {
	    for(var i = 0; i < this.length; i++) {
	        if(this[i] === v) return true;
	    }
	    return false;
	};

    Array.prototype.unique = function() {
        var arr = [];
        for(var i = 0; i < this.length; i++) {
            if(!arr.contains(this[i])) {
                arr.push(this[i]);
            }
        }
        return arr; 
    }

	/**************************************/
	/****** SET OPTIONS FOR SOCKETS *******/
	/**************************************/
	var options = {
		leaguevine_link:'https://api.leaguevine.com/v1/',
		tournament_id:'19389',	   		// Tournament id for leaguevine
		access_token: '2f541e27c7',  	// Access token for leaguevine
		showConnectedClients: true,     // Show connected clients in server console.
		refreshRate: 10,                // Interval for show connected
	};

	self.init = function(){
		if(options.showConnectedClients)
			setInterval(self.handler.showConnected, options.refreshRate * 1000);
	};

	self.handler = {
		onDataEvent: function(conn, msg) {
			try {
				var data = JSON.parse(msg),
				client_id = conn.tmp_session_id;
				switch(data.fn) {
					case 'getPools':
						self.calls.getPools(client_id, data.fn);
					break;
					case 'getSelectedPool':
						self.calls.getSelectedPool(client_id, data.fn, data.pool);
					break;
					case 'getSelectedGameScore':
						self.calls.getSelectedGameScore(client_id, data.fn, data.gameID);
					break;
				}
			} catch(e) {
				console.log(e);
			}
		},

		onCloseEvent: function(conn) {
			self.handler.removeFromSockets(conn);
		},

		addToSockets: function(conn) {
			conn.tmp_session_id = conn.url.split('/')[3];
			sockets[conn.tmp_session_id] = conn;
		},

		removeFromSockets: function(conn) {
			if (sockets[conn.tmp_session_id] !== undefined)
				delete sockets[conn.tmp_session_id];
		},

		showConnected: function() {
			var count_sockets = 0;
			for (socket in sockets) count_sockets++;

			console.log('\n--------------------------------');
			console.log('Total connected: ' + count_sockets);
		}
	};

	self.calls = {
		getPools: function(client_id, fn){
			c.request(options.leaguevine_link+'pools/?tournament_id='+options.tournament_id+'&access_token='+options.access_token, function (error, response, body) {
				if (!error && response.statusCode == 200) {
			  		console.log('Succeeded: Index tournament request');
			 		sockets[client_id].write(JSON.stringify({fn: fn, data: body}));
				}else{
			  		console.log(error);
				}
	  		});
		},

		getSelectedPool: function(client_id, fn, pool){
			var fields = "[id,pool_round,team_1,team_1_score,team_2,team_2_score,winner]";
			c.request(options.leaguevine_link+'games/?pool_id='+pool+'&access_token='+options.access_token+'&fields='+fields, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					
					body = JSON.parse(body); 

					console.log('Succeeded: Game pool request');

					var pool_ids = [];
					
					for (var i = 0; i < body.objects.length; i++) {
						body.objects[i].pool_round.start_time = c.dateFormat(body.objects[i].pool_round.start_time, "dddd | dd-mm-yy | hh:MM");
                		pool_ids.push(body.objects[i].pool_round.id);
                	}

                	body.meta.pool_ids = pool_ids.unique();

                	body = JSON.stringify(body);


			 		sockets[client_id].write(JSON.stringify({fn: fn, data: body}));
				}else{
			  		console.log(error);
				}
	  		});
		},

		getSelectedGameScore: function(client_id, fn, gameID){
			var fields = "[id,is_final,team_1,team_1_score,team_2,team_2_score,time]";
			c.request(options.leaguevine_link+'game_scores/?game_id='+gameID+'&fields='+fields+'&access_token='+options.access_token+'&limit=1', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log('Succeeded: Game score request');
			 		sockets[client_id].write(JSON.stringify({fn: fn, data: body}));
				}else{
					console.log(response.statusCode);
			  		console.log(error);
				}
	  		});
		}
	};
}