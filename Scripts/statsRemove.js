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
            viewModel.years.push(new Point(response[i]._id, response[i].year));
        }
    }
}

Point = function(id, year){
    this.Id = id;
    this.Year = year;
}

//Define request to get mapcontent from database with api
deleteRequest = new XMLHttpRequest();
deleteRequest.onreadystatechange = function() {
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

//.extend allows errorchecking
//the required prop contains the message to be shown
var viewModel = {
    self: this,
    years: ko.observableArray(),
    selectedYear: ko.observable().extend({required: "Ange ett år"}),
    deleteStat: function() {
        if (noErrors()) {
            requestPrep();
            deleteRequest.send();
        }
    },
}

ko.applyBindings(viewModel);

//Checks if inputs have errors, this could be improved
function noErrors() {
    if (viewModel.selectedYear.hasError()) {
            alert('Vänligen kontrollera de obligatoriska fälten.')
            return false
        }
    else {
        if (confirm("Är du säker på att du vill ta bort " + viewModel.selectedYear().Year + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

//preps point to be sent
function requestPrep() {
    deleteRequest.open('DELETE', 'http://localhost:1137/removestat/' + viewModel.selectedYear().Id, true);

    deleteRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}
