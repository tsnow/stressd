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
        if(this.requests.length >= this.plan.num_requests) return;
        var request = new Request(this.plan.url, this.plan.http_method,
            this.plan.http_headers, this.plan.request_body, function(r){ 
                this.parent.statusChanged.bind(this.parent)(); 
                this.makeNextRequest.bind(this)();
            });
        this.requests.push(request);
        request.execute();
    }
};
exports.execute_plan = function( socket, data ){
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
