// Get currencies from http://fixer.io/

// Get BTC in EUR
// https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=EUR

// Get fees data from bitcoinfees.earn.com by ajax
var json_fees;
var xmlhttp_fees = new XMLHttpRequest();

xmlhttp_fees.onreadystatechange = function() {
    // If the state is 'request finished and response is ready' and the status is 'OK'
    if (this.readyState == 4 && this.status == 200)
        json_fees = JSON.parse(this.responseText)["fees"];
};

xmlhttp_fees.open("GET", "https://bitcoinfees.earn.com/api/v1/fees/list");
xmlhttp_fees.send();


// Get currency values for BTC
var currency_values;
var xmlhttp_currency = new XMLHttpRequest();

xmlhttp_currency.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200)
    {
        var aux_json = JSON.parse(this.responseText)[0];

        currency_values = {
            "usd":parseFloat(aux_json.price_usd),
            "eur":parseFloat(aux_json.price_eur)
        };
    }
};

xmlhttp_currency.open("GET", "https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=EUR");
xmlhttp_currency.send();

// Get currency values for BTC
var eur_exchange_rate;
var xmlhttp_exchange_rate = new XMLHttpRequest();

xmlhttp_exchange_rate.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200)
    {
        var aux_json = JSON.parse(this.responseText)["rates"]["USD"];
        eur_exchange_rate = parseFloat(parseFloat(1 / aux_json).toFixed(4));
    }
};

xmlhttp_exchange_rate.open("GET", "https://api.fixer.io/latest?symbols=USD");
xmlhttp_exchange_rate.send();