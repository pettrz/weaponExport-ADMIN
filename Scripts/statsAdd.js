//init request
xhttp = new XMLHttpRequest();
//Change this line if api url changes, routes should be the same
xhttp.open('POST', 'http://localhost:1137/addstats', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        alert('Point has been added!')
        //clear VM
        viewModel.year('');
        viewModel.code('');
        viewModel.value('');
        viewModel.info('');
        //open a new request when the last one finished to prep
        xhttp.open('POST', 'http://localhost:1137/addstats', true);
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

//.extend allows errorchecking
//the required prop contains the message to be shown
var viewModel = {
    self: this,
    year: ko.observable().extend({required: "Fyll i ett år"}),
    code: ko.observable().extend({required: "Fyll i en landskod"}),
    value: ko.observable().extend({required: "Fyll i ett värde"}),
    info: ko.observable().extend({required: "Fyll i info-texten"}),
    links: ko.observableArray([{statLink:'', statTitle:''}]),
    postStat: function() {
        if (noErrors()) {
            console.log(prepPoint());
            xhttp.send(prepPoint());
        }
    },
}

ko.applyBindings(viewModel);

//Checks if inputs have errors, this could be improved
function noErrors() {
    if (viewModel.year.hasError() ||
        viewModel.code.hasError() ||
        viewModel.info.hasError() ||
        viewModel.value.hasError()) {
            alert('Vänligen kolla igenom de obligatoriska fälten')
            return false
        }
    else {
        return true
    }
}

//preps point to be sent
function prepPoint() {
    return (
        'year=' + viewModel.year() +
        '&code=' + viewModel.code().toUpperCase() +
        '&weapons=' + viewModel.value() +
        '&info=' + viewModel.info() +
        '&links=' + JSON.stringify(viewModel.links())
    )
}
