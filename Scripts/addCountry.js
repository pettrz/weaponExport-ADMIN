xhttp = new XMLHttpRequest();
xhttp.open('POST', 'http://localhost:1137/add', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // alert('Country has been added!')
        // viewModel.country('');
        // viewModel.code('');
        // viewModel.selectedFHstatus('');
        // viewModel.gpi('');
        // viewModel.info('');
        // viewModel.links([{title:'', link:''}]);
        // viewModel.selectedCollection('');
        xhttp.open('POST', 'http://localhost:1137/add', true);
     }
}

Collection = function(code, name){
    this.collectionCode = code;
    this.collectionName = name;
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
    country: ko.observable().extend({required: "Please enter a country"}),
    code: ko.observable().extend({required: "Please enter a code"}),
    FHstatuses: ko.observableArray([
        'Fri',
        'Delvis Fri',
        'Ej fri',
    ]),
    selectedFHstatus: ko.observable().extend({required: "Please enter FH status"}),
    gpi: ko.observable().extend({required: "Please enter a gpi"}),
    info: ko.observable().extend({required: "Please enter info"}),
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
    selectedCollection: ko.observable().extend({required: "Please enter continent"}),
    postCountry: function() {

        if (noErrors()) {
            console.log(prepCountry());
            xhttp.send(prepCountry());
        }
    },
}

ko.applyBindings(viewModel);

function noErrors() {
    if (viewModel.country.hasError() ||
        viewModel.code.hasError() ||
        viewModel.selectedFHstatus.hasError() ||
        viewModel.gpi.hasError() ||
        viewModel.info.hasError() ||
        viewModel.selectedCollection.hasError()) {
            alert('Please check required fields')
            return false
        }
    else {
        return true
    }
}
var prepCountry = () => {
    return (
        'country=' + viewModel.country() +
        '&code=' + viewModel.code().toUpperCase() +
        '&FHstatus=' + viewModel.selectedFHstatus() +
        '&gpi=' + viewModel.gpi() +
        '&info=' + viewModel.info() +
        '&links=' + JSON.stringify(viewModel.links()) +
        '&collection=' + viewModel.selectedCollection().collectionCode
    )
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
