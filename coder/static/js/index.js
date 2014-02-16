
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
        }
};

function updateSummary(summary){
            var status = 'Completed ' + summary.numCompleted + ' of ' + summary.numReqs + ' requests';
            $('#status').html(status);
}

function initStressPlanSubmit(transport){
        $('#stress-plan').submit(function(event) {
            event.preventDefault();
            var stressPlan = new StressPlan($(this));
            stressPlan.parseForm();
            transport({
                num_requests: stressPlan.num_requests, 
                num_workers: stressPlan.num_workers,
                http_method: stressPlan.http_method,
                http_headers: stressPlan.http_headers,
                url: stressPlan.url,
                request_body: stressPlan.request_body
            });
	});
}

function initFramework(){
    var coder = 1;
    if(coder){
      Coder.socketConnection.init(function(){
          Coder.socketConnection.addListener('request_complete', updateSummary);
          initStressPlanSubmit(function(data){
              Coder.socketConnection.sendData( 'plan', data);
            });
        });
    } else {
      var connection = new WebSocket('ws://' + window.location.host.replace(':9898','') + ':9899/events');

      initStressPlanSubmit(function(data){
          connection.send(JSON.stringify({
            key: 'plan',
            data: data
          }));
      });
      // When the connection is open, send some data to the server
      connection.onopen = function () {
        // connection.send('Ping'); // Send the message 'Ping' to the server
      };

      // Log errors
      connection.onerror = function (error) {
        console.log('WebSocket Error ' + error);
      };

      // Log messages from the server
      connection.onmessage = function (e) {
        console.log('Server: ' + e.data);
        var data = JSON.parse(e.data);
        if(data.key != undefined && data.key == 'request_complete'){
          updateSummary(data.data);
        }
      };
    }
}

$(document).ready( function() {
    initFramework();
});
