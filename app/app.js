exports.settings={};
//These are dynamically updated by the runtime
//settings.appname - the app id (folder) where your app is installed
//settings.viewpath - prefix to where your view html files are located
//settings.staticurl - base url path to static assets /static/apps/appname
//settings.appurl - base url path to this app /app/appname
//settings.device_name - name given to this coder by the user, Ie."Billy's Coder"
//settings.coder_owner - name of the user, Ie. "Suzie Q."
//settings.coder_color - hex css color given to this coder.

exports.get_routes = [
    { path:'/', handler:'index_handler' },
];

exports.post_routes = [
];

exports.socketio_routes = [
    { key: 'plan', handler: 'execute_plan'}
];

var StressPlan = function(data){
    this.requests = [];
    this.num_requests = data.num_requests
    this.num_workers = data.num_workers 
    this.http_method = data.http_method 
    this.http_headers = data.http_headers
    this.url = data.url
    this.request_body = data.request_body
};

StressPlan.prototype = {
        numTotalRequests: function() {
            return this.num_workers * this.num_requests;
        }
};


var ClientStressor = function(plan, statusCallback){
    this.plan = plan;
    this.workers = [];
    this.statusCallback = statusCallback;
    for(var i = 0; i != this.plan.num_workers; i++) {
        this.workers[i] = new ClientStressorWorker(this);
    }
};

ClientStressor.prototype = {
    start: function(){
        this.workers.forEach(function(worker) { worker.start(); });
    },
    
    numCompletedRequests: function(){
        return this.workers.reduce(function(sum, worker) {
            return sum + worker.numCompletedRequests();
        }, 0);
    },
    
    statusChanged: function(){
        // TODO: This is sort of a bogus event scheme, please feel free to rewire it
        this.statusCallback(this);
    }
};

var ClientStressorWorker = function(parent){
    this.parent = parent;
    this.plan = parent.plan;
    this.requests = [];
};

ClientStressorWorker.prototype = {
    start: function() {
        this.makeNextRequest();
        // TODO: Impose timeout and start a new request
    },
    
    numCompletedRequests: function() {
        return this.requests.filter(function(req) { return req.completed; }).length;
    },
    
    makeNextRequest: function() {
        var that = this;
        if(this.requests.length >= this.plan.num_requests) return;
        var request = new Request(this.plan.url, this.plan.http_method,
            this.plan.http_headers, this.plan.request_body, function(r){ 
                that.parent.statusChanged(); 
                that.makeNextRequest();
            });
        this.requests.push(request);
        request.execute();
    }
};

var Request = function(url, http_method, http_headers, request_body, completed_callback){
    this.completed_callback = completed_callback;
    this.url = url;
    this.http_method = http_method;
    var l = http_headers.length;
    for(var i = 0; i++; i < l){
        var splitter = http_headers[i].indexOf('=');
        var name = "";
        var value = "";
        if(splitter === -1){
            name = http_headers[i];
            value = "";
        } else {
            name = http_headers[i].slice(0,splitter);
            value = http_headers[i].slice(splitter, http_headers[i].length - splitter);
        }
        this.http_headers[name] = value;
    }
    this.request_body = request_body;
    this.completed = false;
};

Request.prototype = {
    execute: function(){
        var that = this;
        console.log("Request is for reals being submitted...");
        this.startTime = new Date();
        var uri = require('url').parse(this.url);
        var req = require('http').request({ 
            hostname: uri.hostname,
            path: uri.path,
            port: uri.port,
            method: this.http_method,
            auth: uri.auth,
            headers: this.http_headers
        }, function(res){
                that.done(true);
            });
        req.on('error', function(e){
            that.done(false);
        });
        req.end(this.request_body);
        this.req = req;
        return this;
    },
    
    done: function(succeeded){
        this.completed = true;
        this.succeeded = succeeded;
        this.endTime = new Date();
        this.completed_callback(this);
    }
};

exports.execute_plan = function( socket, data ){
    var onStatusChange = function(stressor) {
        var numReqs = stressor.plan.numTotalRequests();
        var numCompleted = stressor.numCompletedRequests();
        socket.emit('appdata', {
                    key: "request_complete", 
                    data: {numReqs: numReqs, numCompleted: numCompleted}
        });
    };
            
    var stressor = new ClientStressor(new StressPlan(data), onStatusChange);
    stressor.start();
};

exports.index_handler = function( req, res ) {
    var tmplvars = {};
    tmplvars['static_url'] = exports.settings.staticurl;
    tmplvars['app_name'] = exports.settings.appname;
    tmplvars['app_url'] = exports.settings.appurl;
    tmplvars['device_name'] = exports.settings.device_name;

    res.render( exports.settings.viewpath + '/index', tmplvars );
};

exports.on_destroy = function() {
};
