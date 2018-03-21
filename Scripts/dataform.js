var xhttp = new XMLHttpRequest();
xhttp.open('POST', 'http://localhost:1137/add', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById('confirm').innerHTML = 'Skickat';
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
    country: ko.observable('').extend({required: "Please enter a country"}),
    code: ko.observable('').extend({required: "Please enter a code"}),
    FHstatus: ko.observable('').extend({required: "Please enter an FH status"}),
    gpi: ko.observable('').extend({required: "Please enter a gpi"}),
    info: ko.observable('').extend({required: "Please enter info"}),
    links: ko.observable('').extend({required: "Please enter one or more links"}),
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
    buttonToggle: ko.observable('visible'),
}

ko.applyBindings(viewModel);

var prepCountry = () => {
    
    return {
        country: viewModel.country(),
        code: viewModel.code(),
        FHstatus: viewModel.FHstatus(),
        info: viewModel.info(),
        links: viewModel.links(),
        collection: viewModel.selectedCollection().collectionCode,
    }
}