var xhttp = new XMLHttpRequest();
xhttp.open('POST', 'http://localhost:1137/add', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById('confirm').innerHTML = 'Skickat';
        viewModel.country('');
        viewModel.code('');
        viewModel.FHstatus('');
        viewModel.gpi('');
        viewModel.info('');
        viewModel.links('');
        viewModel.Collection('EU');
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

    // validate(target());

    target.subscribe(validate);
    
    return target;
}

var viewModel = {
    self: this,
    country: ko.observable('').extend({required: "Please enter a country"}),
    code: ko.observable(''),
    FHstatus: ko.observable(''),
    gpi: ko.observable(''),
    info: ko.observable(''),
    links: ko.observable(''),
    collections: ko.observableArray([
        new Collection('AF', 'Afrika'),
        new Collection('AS', 'Asien'),
        new Collection('EU', 'Europa'),
        new Collection('NA', 'Nordamerika'),
        new Collection('OC', 'Oceanien'),
        new Collection('SA', 'Sydamerika'),
    ]),
    selectedCollection : ko.observable(''),
    postCountry: () => {
        //xhttp.send(prepCountry());
        console.log(prepCountry());
    },
}

ko.applyBindings(viewModel);

var prepCountry = () => {
    if (viewModel.country().hasError()) {
        console.log(viewModel.country.errors())
    } else {
        console.log(prepCountry());
    }

    // return {
    //     country: viewModel.country(),
    //     code: viewModel.code(),
    //     FHstatus: viewModel.FHstatus(),
    //     info: viewModel.info(),
    //     links: viewModel.links(),
    //     collection: viewModel.selectedCollection().collectionCode,
    // }
}