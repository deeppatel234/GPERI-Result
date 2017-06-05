Handlebars.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1;
});

Handlebars.registerHelper("round", function(value, options) {
	if(!value || value == 0 || typeof value === 'undefined'){
        return "0.00";
    }
    return value.toFixed(2);
});

var self = this;
Handlebars.registerHelper("upper", function(value, options) {
	self.key = value;
    return value.toUpperCase();
});

Handlebars.registerHelper("branch", function(value, options) {
    return value.replace(" ENGINEERING","");
});

Handlebars.registerHelper("grade", function(value, options) {
    if(!value[self.key]){
    	return 0.00;
    }
    return value[self.key].toFixed(2);
});

Handlebars.registerHelper("attr", function(value, options) {
    return value.replace(" ENGINEERING","").toLowerCase();
});

Handlebars.registerHelper("semkey", function(value, options) {
    return value._id;
});


$("#templateLoader").load("static/template/template.html");
