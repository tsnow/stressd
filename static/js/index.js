
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
            this.num_requests = this.form.find('input[name="num_requests"]').val();
            this.num_workers = this.form.find('input[name="num_workers"]').val();
            this.http_method = this.form.find('input[name="http_method"]').val();
            this.http_headers = this.form.find('textarea[name="http_headers"]').val().split("\n");
            this.url = this.form.find('input[name="url"]').val();
            this.request_body = this.form.find('textarea[name="request_body"]').val();
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
    $('#stress-plan').submit(function(event) {
            event.preventDefault();
            var stressPlan = new StressPlan($(this));
            stressPlan.parseForm();
            stressPlan.buildRequests();
    });
});