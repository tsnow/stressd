
var StressPlan = function(form){
    this.form = form;
    this.requests = [];
};

StressPlan.prototype = {
        parseForm: function(){
            this.num_requests = Number(this.form.find('input[name="num_requests"]').val());
            this.num_workers = Number(this.form.find('input[name="num_workers"]').val());
            this.http_method = this.form.find('input[name="http_method"]').val();
            this.http_headers = this.form.find('textarea[name="http_headers"]').val().split("\n");
            this.url = this.form.find('input[name="url"]').val();
            this.request_body = this.form.find('textarea[name="request_body"]').val();
        },
        
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
        if(this.requests.length >= this.plan.num_requests) return;
        var request = new Request(this.plan.url, this.plan.http_method,
            this.plan.http_headers, this.plan.request_body);
        this.requests.push(request);
        request.ajax()
            .always(this.parent.statusChanged.bind(this.parent))
            .always(this.makeNextRequest.bind(this));
    }
};

var Request = function(url, http_method, http_headers, request_body){
    this.url = url;
    this.http_method = http_method;
    this.http_headers = http_headers;
    this.request_body = request_body;
    this.completed = false;
};

Request.prototype = {
    ajax: function(){
        console.log("Request is for reals being submitted...");
        this.startTime = new Date();
        return $.ajax(this.url, {
            context: this,
            success: this.done.bind(this, true),
            error: this.done.bind(this, false),
            type: this.http_method,
            url: this.url
        });
    },
    
    done: function(succeeded){
        this.completed = true;
        this.succeeded = succeeded;
        this.endTime = new Date();
    }
};

$(document).ready( function() {
    $('#stress-plan').submit(function(event) {
            event.preventDefault();
            var onStatusChange = function(stressor) {
                var numReqs = stressor.plan.numTotalRequests();
                var numCompleted = stressor.numCompletedRequests();
                var status = 'Completed ' + numCompleted + ' of ' + numReqs + ' requests';
                $('#status').html(status);
            }
            var stressPlan = new StressPlan($(this));
            stressPlan.parseForm();
            var stressor = new ClientStressor(stressPlan, onStatusChange);
            stressor.start();
    });
});