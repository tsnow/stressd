
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

    this.url = url;
    this.http_method = http_method;
    this.http_headers = http_headers;
    this.request_body = request_body;
    this.completed = false;
        this.completed = true;
        this.succeeded = succeeded;
        this.endTime = new Date();
$(document).ready( function() {
    Coder.socketConnection.init(function(){
        
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
            Coder.socketConnection.sendData( 'plan', {
                num_requests: stressPlan.num_requests, 
                num_workers: stressPlan.num_workers,
                http_method: stressPlan.http_method,
                http_headers: stressPlan.http_headers,
                url: stressPlan.url,
                request_body: stressPlan.request_body
            });
        });
    });
});
