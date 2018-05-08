// VAPENKARTA ADMIN
// Created by Team Chaos - 2018

// Petter Knutsson - petterknutsson5@gmail.com
// Viola Turesson - violaturesson@gmail.com
// Jenny Miderkvist - jenny.miderkvist@gmail.com
// Joakim Linna - joakimlinna1998@gmail.com

//Sends correct data from database
getRequest = new XMLHttpRequest();
getRequest.open('GET', 'http://localhost:1137/participants', true);
getRequest.send();

//Define request to get points from database with api
getRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        
        viewModel.selectedPart(undefined);
        viewModel.parts([]);
        console.log('returned all participants');
        var response = JSON.parse(this.response);
        
        //sorts countrylist in alphabetical order
        response.sort(function(a, b) { 
            var partA = a.participantTitle.toUpperCase();
            var partB = b.participantTitle.toUpperCase();
            if (partA < partB) {
            return -1;
            }
            if (partA > partB) {
            return 1;
            }
        });

        //Creates list from viewModel
        for (var i = 0; i < response.length; i++) {  
            viewModel.parts.push(new Point(response[i]._id, response[i].participantTitle));
        }
    }
}

Point = function(id, title){
    this.Id = id;
    this.Title = title;
}

//Define request to get mapcontent from database with api
deleteRequest = new XMLHttpRequest();
deleteRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response)
        getRequest.open('GET', 'http://localhost:1137/participants', true);
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
    parts: ko.observableArray(),
    selectedPart: ko.observable().extend({required: "Ange en aktör"}),
    deletePart: function() {
        if (noErrors()) {
            requestPrep();
            deleteRequest.send();
        }
    },
}

ko.applyBindings(viewModel);

//Checks if inputs have errors, this could be improved
function noErrors() {
    if (viewModel.selectedPart.hasError()) {
            alert('Vänligen kontrollera de obligatoriska fälten.')
            return false
        }
    else {
        if (confirm("Är du säker på att du vill ta bort " + viewModel.selectedPart().Title + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

//opens and sets header for delete request
function requestPrep() {
    deleteRequest.open('DELETE', 'http://localhost:1137/removepart/' + viewModel.selectedPart().Id, true);

    deleteRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}
