
var StressPlan = function(form){
    this.form = form;
    this.requests = [];
};

StressPlan.prototype = {
        buildRequests: function(){
            var request = this.oneRequest();
            this.requests = [request];
            request.ajax();
        },
        parseForm: function(){
            this.num_requests = this.form.find('input[name="num_requests"]').value();
            this.num_workers = this.form.find('input[name="num_workers"]').value();
            this.http_method = this.form.find('input[name="http_method"]').value();
            this.http_headers = this.form.find('input[name="http_headers"]').value().split("\n");
            this.url = this.form.find('input[name="url"]').value();
            this.request_body = this.form.find('input[name="request_body"]').value();
        },
        oneRequest: function(){
            return new Request(this,this.url, this.http_method, this.http_headers, this.request_body);
        }
};

var Request = function(plan, url, http_method, http_headers, request_body){
    this.startTime = new Date();
    this.ajax = function(){ $.ajax(url, {context: this, success: function(){ this.success() }, type: http_method, url: url});};
    this.success = function(){ this.endTime = new Date(); }
};

$(document).ready( function() {
    $('#stress-plan').submit(function() {
            var stressPlan = new StressPlan($(this));
            stressPlan.parseForm();
            stressPlan.buildRequests();
    });
});