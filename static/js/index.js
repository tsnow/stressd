
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
        }
};

var ClientStressor = function(plan){
    this.plan = plan;
    this.workers = [];
    for(var i = 0; i != this.plan.num_workers; i++) {
        this.workers[i] = new ClientStressorWorker(this.plan);
    }
};

ClientStressor.prototype = {
    start: function(){
        for(var i = 0; i != this.workers.length; i++) {
            this.workers[i].start();
        }
    }
};

var ClientStressorWorker = function(plan){
    this.plan = plan;
    this.requests = [];
};

ClientStressorWorker.prototype = {
    start: function() {
        this.makeNextRequest();
        // TODO: Impose timeout and start a new request
    },
    
    makeNextRequest: function() {
        if(this.requests.length >= this.plan.num_requests) return;
        var request = new Request(this.plan.url, this.plan.http_method,
            this.plan.http_headers, this.plan.request_body);
        this.requests.push(request);
        request.ajax().always(this.makeNextRequest.bind(this));
    }
};

var Request = function(url, http_method, http_headers, request_body){
    this.url = url;
    this.http_method = http_method;
    this.http_headers = http_headers;
    this.request_body = request_body;
};

Request.prototype = {
    ajax: function(){
        console.log("Request is for reals being submitted...");
        this.startTime = new Date();
        return $.ajax(this.url, {
            context: this,
            success: function(){ this.success() },
            type: this.http_method,
            url: this.url
        });
    },
    
    success: function(){
        this.endTime = new Date();
    }
};

$(document).ready( function() {
    $('#stress-plan').submit(function(event) {
            event.preventDefault();
            var stressPlan = new StressPlan($(this));
            stressPlan.parseForm();
            var stressor = new ClientStressor(stressPlan);
            stressor.start();
    });
});