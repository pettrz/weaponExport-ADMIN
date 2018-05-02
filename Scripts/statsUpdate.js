//Sends correct data from database
getRequest = new XMLHttpRequest();
getRequest.open('GET', 'http://localhost:1137/stats', true);
getRequest.send();

//Define request to get points from database with api
getRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        
        viewModel.selectedYear(undefined);
        viewModel.years([]);
        console.log('returned all years');
        var response = JSON.parse(this.response);
        
        //Creates list from viewModel
        for (var i = 0; i < response.length; i++) {  
            viewModel.years.push(response[i]);
        }
    }
}

//Sends correct data from database
updateRequest = new XMLHttpRequest();
updateRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response)
        getRequest.open('GET', 'http://localhost:1137/stats', true);
        getRequest.send();
    }
}

//Error checking via knockout
ko.extenders.required = function(target, overrideMessage) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        target.hasError(newValue ? false : true);
        target.validationMessage(newValue ? '' : overrideMessage || "This field is required");
    }

    validate(target());

    target.subscribe(validate);

    return target;
}

var viewModel = {
    self: this,
    years: ko.observableArray(),
    selectedYear: ko.observable().extend({required: "Please select a year"}),
    year: ko.observable().extend({required: "Please enter a year"}),
    code: ko.observable().extend({required: "Please enter a code"}),
    weapons: ko.observable().extend({required: "Please enter a value"}),
    info: ko.observable().extend({required: "Please enter info"}),
    statLinks: ko.observableArray([{statLink:'', statTitle:''}]),
    updateStat: function() {
        if (noErrors()) {
            requestPrep();
            updateRequest.send(prepPoint());
        }
    },
}

ko.applyBindings(viewModel);

//Retrieves content from selectedYear
viewModel.selectedYear.subscribe(function(content) {
    if (content != undefined) {
        viewModel.year(content.year);
        viewModel.code(content.code);
        viewModel.weapons(content.weapons);
        viewModel.statLinks(content.statLinks);
        viewModel.info(content.info);
    }
});

//Checks errors in input
function noErrors() {
    if (viewModel.selectedYear.hasError() ||
        viewModel.code.hasError() ||
        viewModel.weapons.hasError() ||
        viewModel.info.hasError()) {
            alert('Vänligen kolla igenom de obligatoriska fälten')
            return false;
        }
    else {
        //Edit confirmation
        if (confirm("Är du säker på att du vill redigera " + viewModel.selectedYear().year + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

//opens put request
var requestPrep = function() {
    updateRequest.open('PUT', 'http://localhost:1137/editstat/' + viewModel.selectedYear()._id, true);

    updateRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}

//Collects variables from viewModel
var prepPoint = () => {
    return (
        'year=' + viewModel.year() +
        '&weapons=' + viewModel.weapons() +
        '&code=' + viewModel.code().toUpperCase() +
        '&info=' + viewModel.info() +
        '&links=' + JSON.stringify(viewModel.statLinks())
    )
}