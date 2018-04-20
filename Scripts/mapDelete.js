getRequest = new XMLHttpRequest();
getRequest.open('GET', 'http://localhost:1137/map', true);
getRequest.send();

getRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        
        viewModel.selectedCollection(undefined);
        viewModel.selectedCountry(undefined);
        viewModel.countries([]);
        viewModel.visibleCountries(undefined);
        console.log('returned all countries');
        var response = JSON.parse(this.response);
        
        for (var i = 0; i < response.length; i++) {  
            viewModel.countries.push(new Country(response[i]._id, response[i].country, response[i].collection));
        }
    }
}

deleteRequest = new XMLHttpRequest();
deleteRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response)
        getRequest.open('GET', 'http://localhost:1137/map', true);
        getRequest.send();
    }
}


Collection = function(code, name){
    this.Code = code;
    this.Name = name;
}

Country = function(id, name, collection){
    this.Id = id;
    this.Name = name;
    this.Collection = collection;
}

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
    countries: ko.observableArray(),
    visibleCountries: ko.observableArray(),
    selectedCountry: ko.observable().extend({required: "Please enter a country"}),
    collections: ko.observableArray([
        new Collection('AF', 'Afrika'),
        new Collection('AS', 'Asien'),
        new Collection('EU', 'Europa'),
        new Collection('NA', 'Nordamerika'),
        new Collection('OC', 'Oceanien'),
        new Collection('SA', 'Sydamerika'),
    ]),
    selectedCollection: ko.observable().extend({required: "Please enter continent"}),
    deleteCountry: function() {
        if(noErrors()) {
            requestPrep();
            deleteRequest.send();
        }   
    },
}

ko.applyBindings(viewModel);

viewModel.selectedCollection.subscribe(function(value) {
    console.log(value)
    console.log(value != undefined);
    if (value != undefined) {
        var list = [];

        for (i = 0; i < viewModel.countries().length; i++) {
            console.log('country: ' + viewModel.countries()[i].Collection);
            console.log('collection: ' + viewModel.selectedCollection().Code);
            if (viewModel.countries()[i].Collection ==  viewModel.selectedCollection().Code)
                list.push(viewModel.countries()[i]);
        }
        viewModel.visibleCountries(list);
    } else { 
        viewModel.visibleCountries([]);
}});

function noErrors() {
    if (viewModel.selectedCountry.hasError() ||
        viewModel.selectedCollection.hasError()) {
            alert('Please check required fields')
            return false;
        }
    else {
        if (confirm("Är du säker på att du vill ta bort " + viewModel.selectedCountry().Name + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

var requestPrep = function() {
    deleteRequest.open('DELETE', 'http://localhost:1137/remove/' + 
    viewModel.selectedCollection().Code + '/' + viewModel.selectedCountry().Id, true);

    deleteRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}