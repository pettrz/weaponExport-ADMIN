getRequest = new XMLHttpRequest();
getRequest.open('GET', 'http://localhost:1137/map', true);
getRequest.send();

getRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log('returned all countries');
        var response = JSON.parse(this.response);
        
        for (var i = 0; i < response.length; i++) {  
            viewModel.countries.push(new Country(response[i]._id, response[i].country, response[i].collection));
            console.log('pushed ' + response[i].country);
        }
    }
}

deleteRequest = new XMLHttpRequest();
deleteRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response)
        viewModel.selectedCollection('');
        viewModel.selectedCountry('');
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

// function viewModel() {
//     self = this;
//     self.countries = ko.observableArray();
//     // self.sortedCountries = function() {
//     //     if (!self.selectedCollection.hasError()) {
//     //         var list = [];
    
//     //         for (i = 0; i < self.countries.length; i++) {
//     //             if (self.countries[i].Collection() == self.selectedCollection.Code())
//     //                 list.push(self.countries[i]);
//     //         }
    
//     //         return list;
//     //     } else { return [] }
//     // };
//     self.selectedCountry = ko.observable().extend({required: "Please enter a country"});
//     self.collections = ko.observableArray([
//         new Collection('AF', 'Afrika'),
//         new Collection('AS', 'Asien'),
//         new Collection('EU', 'Europa'),
//         new Collection('NA', 'Nordamerika'),
//         new Collection('OC', 'Oceanien'),
//         new Collection('SA', 'Sydamerika'),
//     ]);
//     self.selectedCollection = ko.observable().extend({required: "Please enter continent"});
//     self.deleteCountry = function() {
//         if(noErrors()) {
//             requestPrep();
//             deleteRequest.send();
//         }
//     }
// };

ko.applyBindings(viewModel);

function sortedCountries() {
    if (!self.selectedCollection().hasError()) {
        var list = [];

        for (i = 0; i < viewModel.countries.length; i++) {
            if (viewModel.countries[i].Collection == viewModel.selectedCollection.Code)
                list.push(viewModel.countries[i]);
        }

        return list;
    } else { return [{}]}
}

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

$(document).ready(function() {
    var max = 100;
    var  x = 1;

    $('.add').click(function() {

        if(x < max){

            viewModel.links.push({title:'', link:''})

            $('.block:last').before('<div class="block"><div id="card-wrapper"><div id="linkCard" class="card"><div class="card-header" style="text-align: center;">Länk' +
            '<i class="remove far fa-minus-square fa-lg" style="position: absolute; right: 10px;"></i></div><ul class="list-group list-group-flush"><li class="list-group-item">' +
            '<input class="form-control" type="text" placeholder="Titel" data-bind="value: links()[' + x + '].title, valueUpdate: \'afterkeydown\'" /></li>' +
            '<li class="list-group-item"><input class="form-control" type="text" placeholder="Länk" data-bind="value: links()[' + x + '].link, valueUpdate: \'afterkeydown\'"/>' +
            '</li></ul></div></div>');
            $('.optionBox').on('click','.remove',function() {
                $(this).parent().parent().remove();
                viewModel.links.remove(viewModel.links()[x])
           });
            x++;
        }
        else{
            e.preventDefault();
        }
    });
});