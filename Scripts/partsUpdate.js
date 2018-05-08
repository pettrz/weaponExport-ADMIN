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
        
        //Creates list from viewModel
        for (var i = 0; i < response.length; i++) {  
            viewModel.parts.push(response[i]);
        }
    }
}

//Sends correct data from database
updateRequest = new XMLHttpRequest();
updateRequest.onreadystatechange = function() {
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

var viewModel = {
    self: this,
    parts: ko.observableArray(),
    selectedPart: ko.observable().extend({required: "Ange en aktör"}),
    img: ko.observable().extend({required: "Ange en bildlänk"}),
    title: ko.observable().extend({required: "Ange en bildtitel"}),
    info: ko.observable().extend({required: "Ange en informationstext"}),
    links: ko.observableArray([{logoTitle:'', logoLink:''}]),
    updatePart: function() {
        if (noErrors()) {
            requestPrep();
            updateRequest.send(prepPart());
        }
    },
}

ko.applyBindings(viewModel);

//Retrieves content from selectedYear
viewModel.selectedPart.subscribe(function(content) {
    if (content != undefined) {
        viewModel.title(content.participantTitle);
        viewModel.img(content.img);
        viewModel.links(content.logoLinks);
        viewModel.info(content.info);
    }
});

//Checks errors in input
function noErrors() {
    if (viewModel.selectedPart.hasError() ||
        viewModel.title.hasError() ||
        viewModel.img.hasError() ||
        viewModel.info.hasError()) {
            alert('Vänligen kontrollera de obligatoriska fälten')
            return false;
        }
    else {
        //Edit confirmation
        if (confirm("Är du säker på att du vill redigera " + viewModel.selectedPart().participantTitle + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

//opens put request
var requestPrep = function() {
    updateRequest.open('PUT', 'http://localhost:1137/editpart/' + viewModel.selectedPart()._id, true);

    updateRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}

//Collects variables from viewModel
var prepPart = () => {
    return (
        'img=' + viewModel.img() +
        '&title=' + viewModel.title() +
        '&info=' + viewModel.info() +
        '&links=' + JSON.stringify(viewModel.links())
    )
}