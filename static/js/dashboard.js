$(document).ready(function() {
    this.branches = {
        computer: { name: "COMPUTER ENGINEERING", icon: "fa fa-laptop" },
        civil: { name: "CIVIL ENGINEERING", icon: "fa fa-building-o" },
        electrical: { name: "ELECTRICAL ENGINEERING", icon: "fa fa-bolt" },
        mechanical: { name: "MECHANICAL ENGINEERING", icon: "fa fa-cog" }
    }

    this.serverUrl = "http://localhost:3000";
    var self = this;
    
    $('.collageTopDiv').empty();
    $.ajax({
        type: 'POST',
        url: self.serverUrl +"/collagetop",
        dataType: 'json',
        success: function(data) {
            var raw_template = $('#dashboard-top-template').html();
            var template = Handlebars.compile(raw_template);
            var html = template({ data: data });
            $('.collageTopDiv').append(html);
        },
        error: function(httpReq, status, exception) {
            console.log(status + " " + exception);
        }
    });

    self.temp = 1;
    $('.dashboardBracnchDiv').html("");
    _.each(this.branches, function(branch) {
        $.ajax({
            type: 'POST',
            url: self.serverUrl +"/branchtop?branch=" + branch.name,
            dataType: 'json',
            success: function(data) {
                var newData = {};
                newData['name'] = branch.name;
                newData['icon'] = branch.icon;
                newData['data'] = data;
                var raw_template = $('#dashboard-branch-template').html();
                var template = Handlebars.compile(raw_template);
                var html = template({ data: newData });
                $('.dashboardBracnchDiv').append(html);
                if(self.temp == Object.keys(self.branches).length)
                    $('.branchSelector').click(branchSelector);
                self.temp++;
            },
            error: function(httpReq, status, exception) {
                console.log(status + " " + exception);
            }
        });
    });

    var branchSelector =  function(e) {
        var branch = $(e.currentTarget).attr('branch');
        $('.dashboard').css({'display' : 'none'});
        $('.contant').css({'display' : 'block'});
        branchInit(self.branches[branch].name,self.branches[branch].icon);
    };

    $('.home').click(function(){
        $('.dashboard').css({'display' : 'block'});
        $('.contant').css({'display' : 'none'});
    });
});
