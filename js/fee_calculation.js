// Get DOM elements
var first_h = document.getElementById("FirstH");
var second_h = document.getElementById("SecondH");
var third_h = document.getElementById("ThirdH");

var size = document.getElementById("Size");
var time = document.getElementById("Time");
var fee_rate = document.getElementById("FeeRate");
var total_fee = document.getElementById("TotalFee");
var currency = document.getElementById("Currency");
var confirm_button = document.getElementById("ConfirmSize");

var total_fee_selector = document.getElementById("TotalFeeSelector");
var currency_selector = document.getElementById("CurrencySelector");
var fee_rate_selector = document.getElementById("FeeRateSelector");
var time_selector = document.getElementById("TimeSelector");
var size_selector = document.getElementById("SizeSelector");

var unit_multipliers = {
        "bytes": 1,
    "kilobytes": 0.0009765625,
          "min": 1,
        "hours": 0.0166666667,
      "satbyte": 1,
        "satkb": 0.0009765625,
     "mbtcbyte": 0.00001,
       "mbtckb": 0.001024,
          "usd": 1,
          "eur": 0.8491,
          "sat": 1,
         "bits": 0.01,
         "mbtc": 0.00001,
          "btc": 0.00000001
}

var base_units = {
        "Size": null,
     "FeeRate": null,
    "TotalFee": null,
        "Time": null,
    "Currency": null
}
var base_units_keys = Object.keys(base_units);

ResetFields();

time.setAttribute("disabled", true);
time_selector.setAttribute("disabled", true);

fee_rate.setAttribute("disabled", true);
fee_rate_selector.setAttribute("disabled", true);

total_fee.setAttribute("disabled", true);
total_fee_selector.setAttribute("disabled", true);

currency.setAttribute("disabled", true);
currency_selector.setAttribute("disabled", true);

// Only numbers will be allowed
function isNumber(evt) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    //
    if (charCode > 46 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function ResetFields() {
    size.value = "";
    fee_rate.value = "";
    time.value = "";
    currency.value = "";
    total_fee.value = "";
}

function SaveBaseNumber(_dom_id, _value) {
    if (_value == "")
        _value = 0;

    _value = parseFloat(_value);

    switch (_dom_id) {
        case size.id:
            switch (size_selector.value) {
                case "bytes":
                    base_units.Size = _value;
                    break;
                case "kilobytes":
                    base_units.Size = _value / unit_multipliers.kilobytes;
                    break;
                default:
                    break;
            }
            break;
        case fee_rate.id:
            switch (fee_rate_selector.value) {
                case "satbyte":
                    base_units.FeeRate = _value;
                    break;
                case "satkb":
                    base_units.FeeRate = _value / unit_multipliers.satkb;
                    break;
                case "mbtcbyte":
                    base_units.FeeRate = _value / unit_multipliers.mbtcbyte;
                    break;
                case "mbtckb":
                    base_units.FeeRate = _value / unit_multipliers.mbtckb;
                    break;
                default:
                    break;
            }
            break;
        case time.id:
            switch (time_selector.value) {
                case "min":
                    base_units.Time = _value;
                    break;
                case "hours":
                    base_units.Time = _value / unit_multipliers.hours;
                    break;
                default:
                    break;
            }
            break;
        case total_fee.id:
            switch (total_fee_selector.value) {
                case "sat":
                    base_units.TotalFee = _value;
                    break;
                case "bits":
                    base_units.TotalFee = _value / unit_multipliers.bits;
                    break;
                case "mbtc":
                    base_units.TotalFee = _value / unit_multipliers.mbtc;
                    break;
                case "btc":
                    base_units.TotalFee = _value / unit_multipliers.btc;
                    break;
                default:
                    break;
            }
            break;
        case currency.id:
            switch (currency_selector.value) {
                case "usd":
                    base_units.Currency = _value;
                    break;
                case "eur":
                    base_units.Currency = _value / unit_multipliers.eur;
                    break;
                default:
                    break;
            }
        default:
            break;
    }
}

function CheckBaseFormula(_dom_id) {
    var fullfilled_fields = 0;
    var empty_field = "";

    for (var i = 0; i < 3; i++) {
        if (base_units[base_units_keys[i]] !== null) fullfilled_fields++;
        else empty_field = base_units_keys[i];
    }

    if (fullfilled_fields == 2) {
        switch (empty_field) {
            case total_fee.id:
                CalculateTotalFee();
                break;
            case fee_rate.id:
                CalculateFeeRate();
                break;
            default:
                break;
        }
    } else if (fullfilled_fields == 3) {
        switch (_dom_id) {
            case size.id:
                CalculateTotalFee();
                break;
            case time.id:
            case fee_rate.id:
                CalculateTotalFee();
                break;
            case currency.id:
            case total_fee.id:
                CalculateFeeRate();
                break;
            default:
                break;
        }
    }
}

function CalculateTotalFee() {
    base_units.TotalFee = base_units.Size * base_units.FeeRate;
}

function CalculateFeeRate() {
    base_units.FeeRate = base_units.TotalFee / base_units.Size;
}

function UpdateTime() {
    var found_time;

    for (var _key in json_fees) {
        if (json_fees[_key]["maxFee"] >= (base_units.FeeRate)) {
            found_time = json_fees[_key]["maxMinutes"];
            break;
        }
    }

    if (found_time === undefined) base_units.Time = null;
    else base_units.Time = parseFloat(found_time);
}

function UpdateFeeRate() {
    var found_fee;

    for (var _key in json_fees) {
        if (json_fees[_key]["maxMinutes"] <= (base_units.Time)){
            found_fee = json_fees[_key]["maxFee"];
            break;
        }
    }

    if (found_fee === undefined) base_units.FeeRate = null;
    else base_units.FeeRate = found_fee;
}

function UpdateCurrency() {
    var btc = base_units.TotalFee * unit_multipliers.btc;
    base_units.Currency = btc * currency_values.usd;
}

function UpdateTotalFee() {
    var btc = base_units.Currency / currency_values.usd;
    base_units.TotalFee = btc / unit_multipliers.btc;
}

function PrintAll(_dom_id) {
    var aux_amount = 0;

    console.log(_dom_id);

    if (_dom_id != size.id) {
        aux_amount = base_units.Size * unit_multipliers[size_selector.value];
        if(size_selector.value === "bytes") size.value = Math.round(aux_amount);
        else size.value = parseFloat(aux_amount.toFixed(2));
    }

    if (_dom_id != fee_rate.id) {
        aux_amount = base_units.FeeRate * unit_multipliers[fee_rate_selector.value];
        if(fee_rate_selector.value === "satbyte") fee_rate.value = Math.round(aux_amount);
        else fee_rate.value = parseFloat(aux_amount.toFixed(3));
    }

    if (_dom_id != time.id) {
        aux_amount = base_units.Time * unit_multipliers[time_selector.value];
        if(time_selector.value === "min") time.value = Math.round(aux_amount);
        else time.value = parseFloat(aux_amount.toFixed(1));
    }
    if (_dom_id != currency.id)
        currency.value = parseFloat((base_units.Currency * unit_multipliers[currency_selector.value]).toFixed(2));

    if (_dom_id != total_fee.id) {
        aux_amount = base_units.TotalFee * unit_multipliers[total_fee_selector.value];
        if(total_fee_selector.value === "sat") total_fee.value = Math.round(aux_amount);
        else total_fee.value = parseFloat(aux_amount.toFixed(6));
    }
}

var base_formula_elements = [size, fee_rate, total_fee];

size.addEventListener("keyup", function(event){
    if (event.keyCode == 110)
        return;
    SaveBaseNumber(this.id, size.value);
    CheckBaseFormula(this.id);
});

fee_rate.addEventListener("keyup", function(event){
    if (event.keyCode == 110)
        return;
    SaveBaseNumber(this.id, fee_rate.value);
    UpdateTime();
    CheckBaseFormula(this.id);
    UpdateCurrency();
    PrintAll(this.id);
});

time.addEventListener("keyup", function(event){
    if (event.keyCode == 110)
        return;
    SaveBaseNumber(this.id, time.value);
    UpdateFeeRate();
    CheckBaseFormula(this.id);
    UpdateCurrency();
    PrintAll(this.id);
});

total_fee.addEventListener("keyup", function(event){
    if (event.keyCode == 110)
        return;
    SaveBaseNumber(this.id, total_fee.value);
    UpdateCurrency();
    CheckBaseFormula(this.id);
    UpdateTime();
    PrintAll(this.id);
});

currency.addEventListener("keyup", function(event){
    if (event.keyCode == 110)
        return;
    SaveBaseNumber(this.id, currency.value);
    UpdateTotalFee();
    CheckBaseFormula(this.id);
    UpdateTime();
    PrintAll(this.id);
});

var selectors_array = [size_selector, time_selector, fee_rate_selector, currency_selector, total_fee_selector];
selectors_array.forEach(function(elem) {
    elem.addEventListener("change", function(){
        var aux_amount = 0;
        switch (this.id) {
            case size_selector.id:
                aux_amount = base_units.Size * unit_multipliers[size_selector.value];
                if(size_selector.value === "bytes") size.value = Math.round(aux_amount);
                else size.value = parseFloat(aux_amount.toFixed(2));
                break;
            case time_selector.id:
                aux_amount = base_units.Time * unit_multipliers[time_selector.value];
                if(time_selector.value === "min") time.value = Math.round(aux_amount);
                else time.value = parseFloat(aux_amount.toFixed(1));
                break;
            case fee_rate_selector.id:
                aux_amount = base_units.FeeRate * unit_multipliers[fee_rate_selector.value];
                if(fee_rate_selector.value === "satbyte") fee_rate.value = Math.round(aux_amount);
                else fee_rate.value = parseFloat(aux_amount.toFixed(3));
                break;
            case currency_selector.id:
                currency.value = parseFloat((base_units.Currency * unit_multipliers[currency_selector.value]).toFixed(2));
                break;
            case total_fee_selector.id:
                aux_amount = base_units.TotalFee * unit_multipliers[total_fee_selector.value];
                if(total_fee_selector.value === "sat") total_fee.value = Math.round(aux_amount);
                else total_fee.value = parseFloat(aux_amount.toFixed(6));
                break;
            default:
                break;
        }
    });
});

confirm_button.addEventListener("click", function(){
    unit_multipliers.eur = eur_exchange_rate;

    confirm_button.setAttribute("class","btn btn-info btn-lg disabled");

    size.setAttribute("disabled", true);
    size_selector.setAttribute("disabled", true);

    time.removeAttribute("disabled");
    time_selector.removeAttribute("disabled");
    fee_rate.removeAttribute("disabled");
    fee_rate_selector.removeAttribute("disabled");
    total_fee.removeAttribute("disabled");
    total_fee_selector.removeAttribute("disabled");
    currency.removeAttribute("disabled");
    currency_selector.removeAttribute("disabled");

    first_h.classList.replace("blue-text", "blue-text-disabled");
    second_h.classList.replace("blue-text-disabled", "blue-text");
    third_h.classList.replace("blue-text-disabled", "blue-text");

    size_selector.classList.replace("select-white", "select-white-disabled");
    time_selector.classList.replace("select-white-disabled", "select-white");
    fee_rate_selector.classList.replace("select-white-disabled", "select-white");
    currency_selector.classList.replace("select-white-disabled", "select-white");
    total_fee_selector.classList.replace("select-white-disabled", "select-white");
});