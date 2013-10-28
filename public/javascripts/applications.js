var APP = new SCOREAPP() || {};

onDomReady(function() {
    APP.init();
});

function SCOREAPP(){
    var self = this,
        windowsWidth = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"]);

    self.init = function(){
        //START APP
        self.tools.loadingSpinner(true, true, function(){
            self.tools.listeners();
            self.socket.createSocket();   
        });
    };

    self.socket = {
        createSocket: function(){
            sock = new SockJS('http://145.28.224.255:3000/ws');

            sock.onopen = function() { 
                self.api.getPools();
                //self.api.getSelectedGameScore(127162);
            };

            sock.onmessage = self.socket.onSocketData;
            sock.onclose = self.socket.onSocketClose;
        },

        onSocketData: function(e){
            // try {
                var obj = JSON.parse(e.data);
                switch(obj.fn) {
                    case 'getPools':
                        self.display.pools(obj.data);
                    break;
                    case 'getSelectedPool':
                        self.display.selectedPools(obj.data);
                    break;
                    case 'getSelectedGameScore':
                        self.display.selectedGameScore(obj.data);
                    break;
                }
            // } catch(e) {
            //     console.log(e);
            // }
        },

        onSocketClose: function(){

        }
    };

    self.api = {
        getPools: function(){
            sock.send(JSON.stringify({fn: 'getPools'}));
        },

        getSelectedPool: function(selectedPool){
            sock.send(JSON.stringify({fn: 'getSelectedPool', pool: selectedPool}));
        },
         getSelectedGameScore: function(gameID){
            sock.send(JSON.stringify({fn: 'getSelectedGameScore', gameID: gameID}));
        }
    };

    self.tools = {
        listeners: function(){
            //HOMEPAGE
            $$('.link').tap(function() {
                var link_function = $$(this).data('function');

                if(link_function == 'pool'){
                    var selectedPool = $$(this).data('selected-pool');
                    self.tools.loadingSpinner(false, true ,function(){
                        self.api.getSelectedPool(selectedPool);
                    });
                }
            });

            // //SWIPE ACTION
            // $$('.current_page').swipeRight(function(){
            //     if (x$('.prev_page_1')[0]){
            //     }else{
            //         self.effects.fadeOut('.prev_btn');
            //     }
            //     self.effects.slideRightOut('.current_page', function(){
            //         x$('.current_page').html('remove');               
            //         x$('.prev_page').addClass('current_page');
            //         x$('.prev_page').removeClass('prev_page');
            //         if (x$('.prev_page_1')[0]){
            //             x$('.prev_page_1').addClass('prev_page');
            //             x$('.prev_page_1').removeClass('prev_page_1');
            //         }
            //         self.effects.slideLeftIn('.current_page');
            //     });
            // });

            //SINGLE POOL PAGE
            $$('.prev_btn').tap(function() {
                self.effects.fadeOut('.prev_btn');
                self.effects.slideRightOut('.current_page', function(){
                    x$('.current_page').html('remove');               
                    x$('.prev_page').addClass('current_page');
                    x$('.prev_page').removeClass('prev_page');
                    self.effects.slideLeftIn('.current_page');
                });
            });

            //GAMEPAGE
            $$('.button').tap(function() {
                var gameID = $$(this).data('gameid');

                self.tools.loadingSpinner(false, true ,function(){
                    self.api.getSelectedGameScore(gameID);
                });
            });
        },

        loadingSpinner:  function(init, display, callback){
            if(init == true){
                var opts = {
                      lines: 13, // The number of lines to draw
                      length: 14, // The length of each line
                      width: 21, // The line thickness
                      radius: 60, // The radius of the inner circle
                      corners: 0.3, // Corner roundness (0..1)
                      rotate: 90, // The rotation offset
                      direction: 1, // 1: clockwise, -1: counterclockwise
                      color: '#3f3f3f', // #rgb or #rrggbb or array of colors
                      speed: 1.9, // Rounds per second
                      trail: 56, // Afterglow percentage
                      shadow: false, // Whether to render a shadow
                      hwaccel: false, // Whether to use hardware acceleration
                      className: 'spinner', // The CSS class to assign to the spinner
                      zIndex: 2e9, // The z-index (defaults to 2000000000)
                      top: 'auto', // Top position relative to parent in px
                      left: 'auto' // Left position relative to parent in px
                };
                var target = document.getElementById('spinner');
                var spinner = new Spinner(opts);
                spinner.spin(target);}

            if(display == true){

                $$('#overlay').show(callback());}

            if(display == false){
                $$('#overlay').hide(callback());}
        },

        sortByPool: function(array){
            array.sort(function(a,b){
                if(a.name < b.name) return -1;
                if(a.name > b.name) return 1;
                return 0;
            });
            return array;
        },

        sortByWins: function(array){
            array.sort(function(a,b) {
                if(parseInt(a.wins) > parseInt(b.wins)) return -1;
                if(parseInt(a.wins) < parseInt(b.wins)) return 1;
                if(parseInt(a.wins) == parseInt(b.wins)){
                    if(parseInt(a.plus_minus) < parseInt(b.plus_minus))
                        return -1;
                    if(parseInt(a.plus_minus) > parseInt(b.plus_minus))
                        return 1;
                    if(parseInt(a.plus_minus) == parseInt(b.plus_minus))
                        return 0;
                    }
                });
            return array;  
        }
    };

    self.effects ={
        slideLeftIn: function(element, callback){
            x$(element).tween({left:'0px', duration:400 , easing: easings.easeOut, after: function(){
                typeof callback === 'function' && callback();} 
            });
        },
        slideLeftOut: function(element, callback){
            x$(element).tween({left:'-'+windowsWidth+'px', duration:400 , easing: easings.easeIn,  after: function(){
                typeof callback === 'function' && callback();} 
            });
        },
        slideRightOut: function(element, callback){
            x$(element).tween({left: ''+windowsWidth+'', duration:400 , easing: easings.easeIn,  after: function(){
                typeof callback === 'function' && callback();} 
            });
        },
        fadeIn: function(element, callback){
            x$(element).tween({opacity: '1', duration:100 , easing: easings.easeIn,  after: function(){
                typeof callback === 'function' && callback();} 
            });
        },
        fadeOut: function(element, callback){
            x$(element).tween({opacity: '0', duration:100 , easing: easings.easeIn,  after: function(){
                typeof callback === 'function' && callback();} 
            });
        }
    };

    self.display = {
        pools: function(data){
            data = JSON.parse(data);
            
            var html = '<section id="pools_view" class="new_page">';

            data.objects = self.tools.sortByPool(data.objects);
            for (var i = 0; i < data.objects.length; i++) {
                
                var html_pool = '<div class="pool"><h2>'+data.objects[i].name+'</h2><div class="link check-pool" data-function="pool" data-selected-pool="'+data.objects[i].id+'">Check pool</div><div class="clear"></div>';
               
                html = html + html_pool;
                
                var html_pool_table = '<table><tr><th><img src="images/team_icon.png" alt="Teams"/></br><span>Teams</span></th><th><img src="images/medal_icon.png" alt="W"/><span>Wins</span></th><th><img src="images/losses_icon.png" alt="L"/><span>Losses</span></th><th><img src="images/match_icon.png" alt="Played"/><span>Played</span></th></tr>'

                html = html + html_pool_table;

                data.objects[i].standings = self.tools.sortByWins(data.objects[i].standings);

                for (var ii = 0; ii < data.objects[i].standings.length; ii++){
                    var html_pool_teams = '<tr><td>'+data.objects[i].standings[ii].team.name+'</td><td>'+data.objects[i].standings[ii].wins+'</td><td>'+data.objects[i].standings[ii].losses+'</td><td>'+data.objects[i].standings[ii].games_played+'</td></tr>'
                    html = html + html_pool_teams;
                }

                var html_pool_end = '</table></div>';

                html = html + html_pool_end;
            }

            var end_html = '</section>';

            html = html + end_html;
            
            x$('#content').html(html);

            self.tools.loadingSpinner(false, false ,function(){
                self.effects.slideLeftIn('.new_page', function(){
                    x$('.new_page').addClass('current_page');
                    x$('.new_page').removeClass('new_page');
                });
            });
        },

        selectedPools: function(data){
            data = JSON.parse(data);

            var html = '',

            html_pool = '<section id="single-pool" class="new_page"><h2>'+data.objects[0].pool_round.pool.name+'</h2>';

            html = html + html_pool;
                
            var html_pool_table = '<table><tr><th><img src="images/team_icon.png" alt="Team 1"/><br/><span>Team 1</span></th><th><img src="images/medal_icon.png" alt="W"/><br/><span>Score</span></th><th><img src="images/team_icon.png" alt="Team 2"/><br/><span>Team 2</span></th></tr>';

            html = html + html_pool_table;
           
            for (var i = 0; i < data.meta.pool_ids.length; i++) {

                for (var ii = 0; ii < data.objects.length; ii++) {
                    if(data.meta.pool_ids[i] == data.objects[ii].pool_round.id){
                        var html_pool_round = '<tr><th class="rounds" colspan="4">Round '+data.objects[ii].pool_round.round_number+' | ' +data.objects[ii].pool_round.start_time+'</th><tr>';
                        html = html + html_pool_round;
                        break;
                    }
                }

                for (var ii = 0; ii < data.objects.length; ii++) {
                    if(data.meta.pool_ids[i] == data.objects[ii].pool_round.id){
                        var html_pool_teams = '<tr><td class="'+((data.objects[ii].winner == null) ? '' : ((data.objects[ii].team_1.id == data.objects[ii].winner.id) ? 'win' : ''))+'">'+data.objects[ii].team_1.name+'</td><td>'+data.objects[ii].team_1_score+' - '+data.objects[ii].team_2_score+'</td><td class="'+((data.objects[ii].winner == null) ? '' : ((data.objects[ii].team_2.id == data.objects[ii].winner.id) ? 'win' : ''))+'">'+data.objects[ii].team_2.name+'</td><td class="button" data-gameID='+data.objects[ii].id+'><img src="images/edit_icon.png"/></td></tr>';
                        html = html + html_pool_teams;
                    }
                }

                var empty_row = '<tr><td colspan="4" style="background:#f2f2f2 !important;"></td></tr>'               
                html = html + empty_row;
            }

            var html_pool_end = '</table></section>';

            html = html + html_pool_end;

            x$('#content section.current_page').html('after', html);
            
            self.tools.loadingSpinner(false, false,function(){
                self.effects.slideLeftOut('.current_page', function(){
                    self.effects.fadeIn('.prev_btn');
                    x$('.current_page').addClass('prev_page');
                    x$('.current_page').removeClass('current_page');

                    self.effects.slideLeftIn('.new_page', function(){
                        x$('.new_page').addClass('current_page');
                        x$('.new_page').removeClass('new_page');
                    });
                });
            }); 
        },

        selectedGameScore: function(data){
            data = JSON.parse(data);

            var html = '',

            html_game = '<section id="game" class="new_page">';

            html = html + html_game;

            for (var i = 0; i < data.objects.length; i++) {
              
                var team_1 = '<div class="team team_one"><div class="name"><h3>'+data.objects[i].team_1.name+'</h3></div><div class="score"><span>'+data.objects[i].team_1_score+'</span></div></div>';
                
                html = html + team_1;

                var vs = '<div class="versus"><h1>VS</h1></div>';

                html = html + vs;

                var team_2 = '<div class="team team_two"><div class="name"><h3>'+data.objects[i].team_2.name+'</h3></div><div class="score"><span>'+data.objects[i].team_2_score+'</span></div></div>';
                html = html + team_2;
            }

            var end_html_game = '<div class="clear"></div><div class="button_score"><span>Leave game</span></div></section>';

            html =  html + end_html_game;

            x$('#content section.current_page').html('after', html);
            
            self.tools.loadingSpinner(false, false,function(){
                self.effects.slideLeftOut('.new_page', function(){

    

                    x$('.current_page').addClass('prev_page');
                    x$('.current_page').removeClass('current_page');

                    self.effects.slideLeftIn('.new_page', function(){
                        x$('.new_page').addClass('current_page');
                        x$('.new_page').removeClass('new_page');
                    });
                });
            }); 
        }
    };
}