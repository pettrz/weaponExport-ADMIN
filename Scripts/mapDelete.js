//Sends correct data from database
getRequest = new XMLHttpRequest();
getRequest.open('GET', 'http://localhost:1137/map', true);
getRequest.send();

//Define request to get mapcontent from database with api
getRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        
        viewModel.selectedCollection(undefined);
        viewModel.selectedCountry(undefined);
        viewModel.countries([]);
        viewModel.visibleCountries(undefined);
        console.log('returned all countries');
        var response = JSON.parse(this.response);
        
        //Creates list from viewModel
        for (var i = 0; i < response.length; i++) {  
            viewModel.countries.push(new Country(response[i]._id, response[i].country, response[i].collection));
        }
    }
}

//Define request to get mapcontent from database with api
deleteRequest = new XMLHttpRequest();
deleteRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response)
        getRequest.open('GET', 'http://localhost:1137/map', true);
        getRequest.send();
    }
}

//Collection "class" 
Collection = function(code, name){
    this.Code = code;
    this.Name = name;
}

//Collection "class" 
Country = function(id, name, collection){
    this.Id = id;
    this.Name = name;
    this.Collection = collection;
}

//Validation for inputs
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

//viewmodel for map - validation
var viewModel = {
    self: this,
    countries: ko.observableArray(),
    visibleCountries: ko.observableArray(),
    selectedCountry: ko.observable().extend({required: "Ange ett land"}),
    collections: ko.observableArray([
        new Collection('AF', 'Afrika'),
        new Collection('AS', 'Asien'),
        new Collection('EU', 'Europa'),
        new Collection('NA', 'Nordamerika'),
        new Collection('OC', 'Oceanien'),
        new Collection('SA', 'Sydamerika'),
    ]),
    selectedCollection: ko.observable().extend({required: "Ange en kontinent"}),
    deleteCountry: function() {
        if(noErrors()) {
            requestPrep();
            deleteRequest.send();
        }   
    },
}

//Sends validation through viewmodel
ko.applyBindings(viewModel);

//Retrieves content from selectedCollection
viewModel.selectedCollection.subscribe(function(value) {
    console.log(value)
    console.log(value != undefined);
    if (value != undefined) {
        var list = [];

        //Finds correct selectedCollection
        for (i = 0; i < viewModel.countries().length; i++) {
            console.log('country: ' + viewModel.countries()[i].Collection);
            console.log('collection: ' + viewModel.selectedCollection().Code);
            if (viewModel.countries()[i].Collection ==  viewModel.selectedCollection().Code)
                list.push(viewModel.countries()[i]);
        }
        //sorts countrylist in alphabetical order
        list.sort(function(a, b) { 
            var countryA = a.Name.toUpperCase();
            var countryB = b.Name.toUpperCase();
            if (countryA < countryB) {
            return -1;
            }
            if (countryA > countryB) {
            return 1;
            }
        });
        viewModel.visibleCountries(list);
    } else { 
        viewModel.visibleCountries([]);
}});

//Checks errors in input
function noErrors() {
    if (viewModel.selectedCountry.hasError() ||
        viewModel.selectedCollection.hasError()) {
            alert('Vänligen kontrollera de obligatoriska fälten.')
            return false;
        }
    else {
        //Edit confirmation
        if (confirm("Är du säker på att du vill ta bort " + viewModel.selectedCountry().Name + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

//Sends content - updates map
var requestPrep = function() {
    deleteRequest.open('DELETE', 'http://localhost:1137/remove/' + 
    viewModel.selectedCollection().Code + '/' + viewModel.selectedCountry().Id, true);

    deleteRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}