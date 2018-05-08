// VAPENKARTA ADMIN
// Created by Team Chaos - 2018

// Petter Knutsson - petterknutsson5@gmail.com
// Viola Turesson - violaturesson@gmail.com
// Jenny Miderkvist - jenny.miderkvist@gmail.com
// Joakim Linna - joakimlinna1998@gmail.com

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
        
        //sorts countrylist in alphabetical order
        response.sort(function(a, b) { 
            var yearA = a.year;
            var yearB = b.year;
            if (yearA < yearB) {
            return -1;
            }
            if (yearA > yearB) {
            return 1;
            }
        });

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
        target.validationMessage(newValue ? '' : overrideMessage || "Den här rutan måste fyllas i");
    }

    validate(target());

    target.subscribe(validate);

    return target;
}

var viewModel = {
    self: this,
    years: ko.observableArray(),
    selectedYear: ko.observable().extend({required: "Ange ett årtal"}),
    year: ko.observable().extend({required: "Ange ett årtal"}),
    code: ko.observable().extend({required: "Ange en landskod"}),
    weapons: ko.observable().extend({required: "Ange ett värde"}),
    info: ko.observable().extend({required: "Ange en informationstext"}),
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
            alert('Vänligen kontrollera de obligatoriska fälten.')
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
var prepPoint = function() {
    return (
        'year=' + viewModel.year() +
        '&weapons=' + viewModel.weapons() +
        '&code=' + viewModel.code().toUpperCase() +
        '&info=' + viewModel.info() +
        '&links=' + JSON.stringify(viewModel.statLinks())
    )
}