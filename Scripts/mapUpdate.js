getRequest = new XMLHttpRequest();
getRequest.open('GET', 'http://localhost:1137/map', true);
getRequest.send();

getRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        
        viewModel.selectedCollection(undefined);
        viewModel.selectedCountry(undefined);
        viewModel.countries([]);
        viewModel.visibleCountries(undefined);
        var response = JSON.parse(this.response);
        
        for (var i = 0; i < response.length; i++) {  
            viewModel.countries.push(response[i]);
        }
    }
}

updateRequest = new XMLHttpRequest();
updateRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getRequest.open('GET', 'http://localhost:1137/map', true);
        getRequest.send();
    }
}


Collection = function(code, name){
    this.Code = code;
    this.Name = name;
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
    selectedCountry: ko.observable().extend({required: "Please select country"}),
    country: ko.observable().extend({required: "Please enter a country name"}),
    code: ko.observable().extend({required: "Please enter a code"}),
    gpi: ko.observable().extend({required: "Please enter a gpi"}),
    info: ko.observable().extend({required: "Please enter info"}),
    FHstatuses: ko.observableArray([
        'Fri',
        'Delvis fri',
        'Inte fri',
    ]),
    selectedFHstatus: ko.observable().extend({required: "Please enter FH status"}),
    links: ko.observableArray([
        {title:'', link:''},
    ]),
    collections: ko.observableArray([
        new Collection('AF', 'Afrika'),
        new Collection('AS', 'Asien'),
        new Collection('EU', 'Europa'),
        new Collection('NA', 'Nordamerika'),
        new Collection('OC', 'Oceanien'),
        new Collection('SA', 'Sydamerika'),
    ]),
    selectedCollection: ko.observable().extend({required: "Please select continent"}),
    updateCountry: function() {
        if(noErrors()) {
            requestPrep();
            updateRequest.send(prepCountry());
        }   
    },
}

ko.applyBindings(viewModel);

viewModel.selectedCollection.subscribe(function(value) {
    if (value != undefined) {
        var list = [];

        for (i = 0; i < viewModel.countries().length; i++) {
            if (viewModel.countries()[i].collection ==  viewModel.selectedCollection().Code)
                list.push(viewModel.countries()[i]);
        }
        viewModel.visibleCountries(list);
    } else { 
        viewModel.visibleCountries([]);
}});

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

function noErrors() {
    if (viewModel.selectedCountry.hasError() ||
        viewModel.selectedCollection.hasError() ||
        viewModel.country.hasError() ||
        viewModel.code.hasError() ||
        viewModel.selectedFHstatus.hasError() ||
        viewModel.gpi.hasError() ||
        viewModel.info.hasError()) {
            alert('Please check required fields')
            return false;
        }
    else {
        if (confirm("Är du säker på att du vill redigera " + viewModel.selectedCountry().country + '?')) {
            return true;
        } else {
            return false;
        }
    }
}

var requestPrep = function() {
    updateRequest.open('PUT', 'http://localhost:1137/edit/' + 
    viewModel.selectedCollection().Code + '/' + viewModel.selectedCountry()._id, true);

    updateRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
}

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