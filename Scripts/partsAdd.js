// VAPENKARTA ADMIN
// Created by Team Chaos - 2018

// Petter Knutsson - petterknutsson5@gmail.com
// Viola Turesson - violaturesson@gmail.com
// Jenny Miderkvist - jenny.miderkvist@gmail.com
// Joakim Linna - joakimlinna1998@gmail.com

//init request
xhttp = new XMLHttpRequest();
//Change this line if api url changes, routes should be the same
xhttp.open('POST', 'http://localhost:1137/addpart', true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        alert('Aktör har blivit tillagd!')
        //clear VM
        viewModel.img('');
        viewModel.title('');
        viewModel.info('');
        viewModel.links([{logoTitle:'', logoLink:''}]);
        //open a new request when the last one finished to prep
        xhttp.open('POST', 'http://localhost:1137/addpart', true);
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
    img: ko.observable().extend({required: "Ange en bildlänk"}),
    title: ko.observable().extend({required: "Ange en bildtitel"}),
    info: ko.observable().extend({required: "Ange en informationstext"}),
    links: ko.observableArray([{logoTitle:'', logoLink:''}]),
    postPart: function() {
        if (noErrors()) {
            console.log(prepPart());
            xhttp.send(prepPart());
        }
    },
}

ko.applyBindings(viewModel);

//Checks if inputs have errors, this could be improved
function noErrors() {
    if (viewModel.img.hasError() ||
        viewModel.title.hasError() ||
        viewModel.info.hasError()) {
            alert('Vänligen kontrollera de obligatoriska fälten.')
            return false
        }
    else {
        return true
    }
}

//preps point to be sent
function prepPart() {
    return (
        'img=' + viewModel.img() +
        '&title=' + viewModel.title() +
        '&info=' + viewModel.info() +
        '&links=' + JSON.stringify(viewModel.links())
    )
}
