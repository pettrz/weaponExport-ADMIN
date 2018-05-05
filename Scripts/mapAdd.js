//Sends correct data from database
xhttp = new XMLHttpRequest();
xhttp.open('POST', 'http://localhost:1137/add', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

//Define request to get mapcontent from database with api
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        alert('Ett land har lagts till!')
        viewModel.country('');
        viewModel.code('');
        viewModel.selectedFHstatus('');
        viewModel.gpi('');
        viewModel.info('');
        viewModel.links([{title:'', link:''}]);
        viewModel.selectedCollection('');
        xhttp.open('POST', 'http://localhost:1137/add', true);
     }
}

//Collection "class" 
Collection = function(code, name){
    //This code is sent to database 
    this.collectionCode = code;
    //This code is sent to GUI
    this.collectionName = name;
}

//Validation for inputs
ko.extenders.required = function(target, overrideMessage) {
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    function validate(newValue) {
        target.hasError(newValue ? false : true);
        target.validationMessage(newValue ? '' : overrideMessage || "Det här fältet måste fyllas i");
    }

    validate(target());

    target.subscribe(validate);

    return target;
}

//viewmodel for map - validation
var viewModel = {
    self: this,
    //Requires content in each input 
    country: ko.observable().extend({required: "Ange ett land"}),
    code: ko.observable().extend({required: "Ange en landskod"}),
    FHstatuses: ko.observableArray([
        'Fri',
        'Delvis fri',
        'Inte fri',
    ]),
    selectedFHstatus: ko.observable().extend({required: "Ange en FH-status"}),
    gpi: ko.observable().extend({required: "Ange en GPI-rank"}),
    info: ko.observable().extend({required: "Ange en informationstext"}),
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
    postCountry: function() {

        //Checks validation - if not: sends content
        if (noErrors()) {
            console.log(prepCountry());
            xhttp.send(prepCountry());
        }
    },
}

//Sends validation through viewmodel
ko.applyBindings(viewModel);

//Checks errors in input
function noErrors() {
    if (viewModel.country.hasError() ||
        viewModel.code.hasError() ||
        viewModel.selectedFHstatus.hasError() ||
        viewModel.gpi.hasError() ||
        viewModel.info.hasError() ||
        viewModel.selectedCollection.hasError()) {
            alert('Vänligen kolla igenom de obligatoriska fälten')
            return false
        }
    else {
        return true
    }
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
        '&collection=' + viewModel.selectedCollection().collectionCode
    )
}
