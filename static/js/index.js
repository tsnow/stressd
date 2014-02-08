
var StressPlan = function(form){
    this.form = form;
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

$(document).ready( function() {
    Coder.socketConnection.init(function(){
        Coder.socketConnection.addListener('request_complete', function(summary){
            var status = 'Completed ' + summary.numCompleted + ' of ' + summary.numReqs + ' requests';
            $('#status').html(status);
        });
        
        $('#stress-plan').submit(function(event) {
            event.preventDefault();
            var stressPlan = new StressPlan($(this));
            stressPlan.parseForm();
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
