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
        var response = JSON.parse(this.response);
        
        //Creates list from viewModel
        for (var i = 0; i < response.length; i++) {  
            viewModel.countries.push(response[i]);
        }
    }
}

//Sends correct data from database
updateRequest = new XMLHttpRequest();
updateRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getRequest.open('GET', 'http://localhost:1137/map', true);
        getRequest.send();
    }
}

//Collection "class" 
Collection = function(code, name){
    //This code is sent to database 
    this.Code = code;
    //This code is sent to GUI
    this.Name = name;
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
    //Requires content in each input 
    countries: ko.observableArray(),
    visibleCountries: ko.observableArray(),
    selectedCountry: ko.observable().extend({required: "Ange ett land"}),
    country: ko.observable().extend({required: "Ange ett land"}),
    code: ko.observable().extend({required: "Ange en landskod"}),
    gpi: ko.observable().extend({required: "Ange GPI-rank"}),
    info: ko.observable().extend({required: "Ange en informationstext"}),
    FHstatuses: ko.observableArray([
        'Fri',
        'Delvis fri',
        'Inte fri',
    ]),
    selectedFHstatus: ko.observable().extend({required: "Ange FH-status"}),
    links: ko.observableArray([
        {title:'', link:''},
    ]),
    //Requires a selected continent
    collections: ko.observableArray([
        new Collection('AF', 'Afrika'),
        new Collection('AS', 'Asien'),
        new Collection('EU', 'Europa'),
        new Collection('NA', 'Nordamerika'),
        new Collection('OC', 'Oceanien'),
        new Collection('SA', 'Sydamerika'),
    ]),
    selectedCollection: ko.observable().extend({required: "Ange en kontinent"}),
    //Checks validation - if not: sends content
    updateCountry: function() {
        if(noErrors()) {
            requestPrep();
            updateRequest.send(prepCountry());
        }   
    },
}

//Sends validation through viewmodel
ko.applyBindings(viewModel);

//Retrieves content from selectedCollection
viewModel.selectedCollection.subscribe(function(value) {
    if (value != undefined) {
        var list = [];

        //Finds correct selectedCollection
        for (i = 0; i < viewModel.countries().length; i++) {
            if (viewModel.countries()[i].collection ==  viewModel.selectedCollection().Code)
                list.push(viewModel.countries()[i]);
        }
        
        //sorts countrylist in alphabetical order
        list.sort(function(a, b) { 
            var countryA = a.country.toUpperCase();
            var countryB = b.country.toUpperCase();
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

//Retrieves content from selectedCountry
viewModel.selectedCountry.subscribe(function(value) {
    if (value != undefined) {
        viewModel.country(value.country);
        viewModel.code(value.code);
        viewModel.gpi(value.gpi);
        viewModel.selectedFHstatus(value.FHstatus);
        viewModel.links(value.links);
        viewModel.info(value.info);
    }
});

//Checks errors in input
function noErrors() {
    if (viewModel.selectedCountry.hasError() ||
        viewModel.selectedCollection.hasError() ||
        viewModel.country.hasError() ||
        viewModel.code.hasError() ||
        viewModel.selectedFHstatus.hasError() ||
        viewModel.gpi.hasError() ||
        viewModel.info.hasError()) {
            alert('Vänligen kontrollera de obligatoriska fälten')
            return false;
        }
    else {
        //Edit confirmation
        if (confirm("Är du säker på att du vill redigera " + viewModel.selectedCountry().country + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

//Sends content - updates map
var requestPrep = function() {
    updateRequest.open('PUT', 'http://localhost:1137/edit/' + 
    viewModel.selectedCollection().Code + '/' + viewModel.selectedCountry()._id, true);

    updateRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}

//Collects variables from viewModel
var prepCountry = () => {
    return (
        'country=' + viewModel.country() +
        '&code=' + viewModel.code().toUpperCase() +
        '&FHstatus=' + viewModel.selectedFHstatus() +
        '&gpi=' + viewModel.gpi() +
        '&info=' + viewModel.info() +
        '&links=' + JSON.stringify(viewModel.links()) +
        '&collection=' + viewModel.selectedCollection().Code
    )
}

// $(document).ready(function() {
//     var max = 100;
//     var  x = 1;

//     $('.add').click(function() {

//         if(x < max){

//             viewModel.links.push({title:'', link:''})

//             $('.block:last').before('<div class="block"><div id="card-wrapper"><div id="linkCard" class="card"><div class="card-header" style="text-align: center;">Länk' +
//             '<i class="remove far fa-minus-square fa-lg" style="position: absolute; right: 10px;"></i></div><ul class="list-group list-group-flush"><li class="list-group-item">' +
//             '<input class="form-control" type="text" placeholder="Titel" data-bind="value: title, valueUpdate: \'afterkeydown\'" /></li>' +
//             '<li class="list-group-item"><input class="form-control" type="text" placeholder="Länk" data-bind="value: link, valueUpdate: \'afterkeydown\'"/>' +
//             '</li></ul></div></div>');
//             $('.optionBox').on('click','.remove',function() {
//                 $(this).parent().parent().remove();
//            });
//             x++;
//         }
//         else{
//             e.preventDefault();
//         }
//     });
// });