this.serverUrl = "http://localhost:3000";

var backbtn = function() {
    $(".semdiv").empty();
    $(".yeardiv").css({ "display": "block" });
    $(".resultdiv").css({ 'display': 'none' });
}

$(".tableViewBtn").click(function() {
    $(".graphView").css({ 'display': 'none' });
    $(".tableView").css({ 'display': 'block' });
});

$(".graphViewBtn").click(function() {
    $(".graphView").css({ 'display': 'block' });
    $(".tableView").css({ 'display': 'none' });
});

$(".listViewBtn").click(function() {
    $('#semStudentResultDiv').css({ 'display': 'block' });
    $('#semStudentResultDatatable').css({ 'display': 'none' });
});

$(".datatableViewBtn").click(function() {
    $('#semStudentResultDiv').css({ 'display': 'none' });
    $('#semStudentResultDatatable').css({ 'display': 'block' });
});

function round(value){
    if(!value || value == 0 || typeof value === 'undefined'){
        return "0.00";
    }
    return value.toFixed(2);
}

var tr = $("<tr></tr>");
tr.append($("<th></th>").html("Enrollment"));
tr.append($("<th></th>").html("Name"));
tr.append($("<th></th>").html("SPI"));
tr.append($("<th></th>").html("CPI"));
$('.sem-datatable-header').append(tr);
this.dataTable = $('#sem-datatable').DataTable();

var self = this;

function branchInit(branchName, branchIcon) {
    self.branchName = branchName;
    $('.departmenttext').html(branchName);
    $('.fontawosemeIcon').removeClass(self.branchIcon);
    $('.fontawosemeIcon').addClass(branchIcon);
    self.branchIcon = branchIcon;
    $(".yeardiv").empty();
    $('.studentDataDiv').css({ 'display': 'none' });
    $('.batchDataDiv').css({ 'display': 'block' });
    $("#searchinput").val("");
    backbtn();

    $.ajax({
        type: 'POST',
        url: self.serverUrl + "/years?branch=" + self.branchName,
        dataType: 'json',
        success: function(data) {
            data = _.sortBy(data, function(num) {
                return num * -1;
            });
            _.each(data, function(year) {
                var btn = $("<button></button").addClass("yearbtn");
                btn.html(year + " Batch" + "<div class='yearCap'><i class='fa fa-graduation-cap'></i></div>");
                btn.attr("year", year);
                btn.click(function(e) {
                    var year = $(e.currentTarget).attr('year');
                    $.ajax({
                        type: 'POST',
                        url: self.serverUrl + "/sem?year=" + year + "&branch=" + branchName,
                        dataType: 'json',
                        success: function(data) {
                            $(".yeardiv").css({ "display": "none" });
                            $(".semdiv").empty();
                            $(".semdiv").append($("<button class='backbtn'></button").html('<div><i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i></div>'));
                            $(".backbtn").click(backbtn);
                            data = _.sortBy(data, function(num) {
                                return num.sem
                            });
                            _.each(data, function(sem) {
                                var sem = sem.sem;
                                sem = sem.replace("BE SEM ", "");
                                sem = sem[0];
                                var sembtn = $("<button></button").addClass("sembtn");
                                sembtn.html("Sem " + sem + "<div class='semCap'><i class='fa fa-user-circle'></i></div>");
                                sembtn.attr("sem", (sem));
                                sembtn.attr("year", (year));
                                sembtn.click(sembtnclick);
                                $(".semdiv").append(sembtn);
                            });
                        },
                        error: function(httpReq, status, exception) {
                            console.log(status + " " + exception);
                        }
                    });
                });
                $(".yeardiv").append(btn);
            });
        },
        error: function(httpReq, status, exception) {
            console.log(status + " " + exception);
        }
    });
}

var sembtnclick = function(e) {
    var sems = $(e.currentTarget).attr('sem');
    var years = $(e.currentTarget).attr('year');
    $.ajax({
        type: 'POST',
        url: self.serverUrl + "/branch?branch=" + self.branchName + "&sem=" + sems + "&year=" + years,
        dataType: 'json',
        success: function(ddata) {
            $(".resultdiv").css({ 'display': 'block' });
            $(".batchName").html(years + " BATCH");
            $(".semName").html("SEM " + sems);

            var remedialResutl = _.filter(ddata, function(d) {
                return d['sem'].indexOf('Remedial') != -1;
            });

            if (remedialResutl.length != 0) {
                $('#remidialExamResultDiv').empty();
                var raw_template = $('#sem-result-template').html();
                var template = Handlebars.compile(raw_template);
                var html = template({ data: remedialResutl });
                $('#remidialExamResultDiv').append(html);
                $('.RemedialDiv').css({ 'display': 'block' });
            } else {
                $('.RemedialDiv').css({ 'display': 'none' });
            }

            ddata = _.filter(ddata, function(d) {
                return d['sem'].indexOf('Remedial') == -1;
            });

            var back = { 'fail': 0, 'pass': 0 };

            _.each(ddata, function(value) {
                if (value.currentsemblock != 0) {
                    back["fail"]++;
                } else {
                    back["pass"]++;
                }
            });
            semGraph(back);

            var table = $('.topSemTable');
            table.empty();
            _.each(_.last(_.sortBy(ddata, "spi", true), 10).reverse(), function(value, index) {
                var tr = $("<tr></tr>");
                tr.append($("<td></td>").html(index + 1));
                tr.append($("<td></td>").html(value['enrollment']));
                tr.append($("<td></td>").html(value['name']));
                tr.append($("<td></td>").html( round(value['spi'])));
                table.append(tr);
            });

            $('#semStudentResultDiv').html("");
            var raw_template = $('#sem-result-template').html();
            var template = Handlebars.compile(raw_template);
            var html = template({ data: ddata });
            $('#semStudentResultDiv').append(html);

            var subjectTable = $(".subjectSemTable");
            subjectTable.empty();
            var grade = {};

            _.each(ddata, function(value) {
                _.each(value.subject, function(sub) {
                    if (!grade[sub.name]) {
                        grade[sub.name] = { AA: 0, AB: 0, BB: 0, BC: 0, CC: 0, CD: 0, DD: 0, FF: 0 }
                    }
                    grade[sub.name][sub.subjectgrade]++;
                });
            });

            _.each(grade, function(value, key) {
                var tr = $("<tr></tr>");
                tr.append($("<td></td>").html(key));
                _.each(value, function(tddata) {
                    tr.append($("<td></td>").html(tddata));
                });
                subjectTable.append(tr);
            });


            $('.subjectGraphViewBtnDiv').empty();
            _.each(grade, function(value, key) {
                var subjectGraphViewBtn = $("<button class='subjectGraphViewBtn'></button>");
                subjectGraphViewBtn.html(key);
                subjectGraphViewBtn.click(function() {
                    $('.subjectGraphViewName').html(key);
                    subjectGraphViewGraphFun(grade[key]);
                });
                $('.subjectGraphViewBtnDiv').append(subjectGraphViewBtn);
            });

            if ($('.subjectGraphViewBtn')[0]) {
                $($('.subjectGraphViewBtn')[0]).trigger('click');
            }

            self.dataTable.destroy();
            $('#sem-datatable').empty();
          
            $('#sem-datatable').append($("<thead></thead>").addClass('sem-datatable-header'));
            $('#sem-datatable').append($("<tbody></tbody>").addClass('sem-datatable-body'));
            
            var subjectCount = 0;
            if (ddata[0]) {
                var tr = $("<tr></tr>");
                tr.append($("<th></th>").html("Enrollment"));
                tr.append($("<th></th>").html("Name"));
                _.each(ddata[0].subject, function(subject) {
                    tr.append($("<th></th>").html(subject.name));
                    subjectCount++;
                });
                tr.append($("<th></th>").html("SPI"));
                tr.append($("<th></th>").html("CPI"));
                $('.sem-datatable-header').append(tr);
            }

            var semDatatableBody = $('.sem-datatable-body');
            _.each(ddata, function(student) {
                var tr = $("<tr></tr>");
                var studentSubjectCount = 0;
                tr.append($("<td></td>").html(student['enrollment']));
                tr.append($("<td></td>").html(student['name']));
                _.each(student.subject, function(subject) {
                    tr.append($("<th></th>").html(subject.subjectgrade));
                    studentSubjectCount++;
                });
                tr.append($("<td></td>").html( round(student['spi']) ));
                tr.append($("<td></td>").html( round(student['cpi']) ));
                if(studentSubjectCount == subjectCount){
                    semDatatableBody.append(tr);
                }
            });

            self.dataTable = $('#sem-datatable').DataTable();

        },
        error: function(httpReq, status, exception) {
            console.log(status + " " + exception);
        }
    });
}

$(".searchbtn").click(function() {
    var en = $("#searchinput").val();
    en = en.substring(0, en.indexOf('|')).trim();
    if (en) {
        $.ajax({
            type: 'POST',
            url: self.serverUrl + "/student?enrollment=" + en,
            dataType: 'json',
            success: function(data) {
                $(".batchDataDiv").css({ "display": "none" });
                $(".studentDataDiv").css({ "display": "block" });
                $('.studentResultsDiv').html("");
                var raw_template = $('#student-result-template').html();
                var template = Handlebars.compile(raw_template);
                var html = template({ data: data });
                $('.studentResultsDiv').append(html);
                $(".studentName").html(data[0].name);
                $(".studentEnroll").html(data[0].enrollment);
                $(".studentSemBtn").click(studentSemBtnclick);
                var studentSpi = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
                var studentBacklog = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
                _.each(data, function(value) {
                    var sem = value.sem;
                    sem = sem.replace("BE SEM ", "");
                    sem = sem[0];
                    studentSpi[sem] = value.spi;
                    studentBacklog[sem] = value.currentsemblock;
                });
                graph(studentSpi, studentBacklog);
            },
            error: function(httpReq, status, exception) {
                console.log(status + " " + exception);
            }
        });
    }
});

$(".studentDataDiv").append($("<button class='studentBackBtn'></button").html('<div><i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i></div>'));
$(".studentBackBtn").click(function() {
    $(".batchDataDiv").css({ "display": "block" });
    $(".studentDataDiv").css({ "display": "none" });
    $("#searchinput").val("");
});

this.btn = -1;
var self = this;
var studentSemBtnclick = function(e) {
    $('.studentResultsDiv').find("." + self.btn + "data").css({ "display": "none" });
    self.btn = $(e.currentTarget).attr("data");
    $('.studentResultsDiv').find("." + self.btn + "data").css({ "display": "block" });
};



$("#searchinput").keyup(function(e) {
    if (e.which == 13)
        $(".searchbtn").trigger("click");

    $.ajax({
        type: 'POST',
        url: self.serverUrl + "/search?branch=" + self.branchName + "&string=" + $("#searchinput").val(),
        dataType: 'json',
        success: function(data) {

            var newData = [];
            _.each(data, function(d) {
                newData.push(d["enrollment"] + " | " + d["name"]);
            });

            $("#searchinput").autocomplete({
                source: _.uniq(newData, function(y) {
                    return y;
                })
            });
        },
        error: function(httpReq, status, exception) {
            console.log(status + " " + exception);
        }
    });
});
