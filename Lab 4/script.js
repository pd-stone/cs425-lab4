var Lab4 = (function () {

    var rates = null;

    var createCurrencyMenu = function (currencies) {

        var select = document.getElementById("currencymenu")

        for (let i = 0; i < currencies.length; i++) {
            var option = document.createElement("option");
            option.value = currencies[i]["id"];
            option.innerHTML = (currencies[i]["id"] + " " + currencies[i]["description"]);
            select.appendChild(option);
        }
    };

    var convert = function () {

        var rate_date = rates["date"];
        var rate_id = document.getElementById("currencymenu");
        var rate_usd = Number(rates["rates"]["USD"]);
        var rate_gbp = Number(rates["rates"][rate_id.value]);

        var usd_value = Number($("#usd_value").val());

        var target_value_euro = usd_value / rate_usd;
        var target_value_final = rate_gbp * target_value_euro;
        

        console.log("USD: " + rate_usd + ", GBP: " + rate_gbp);

        var convert_value_string = (target_value_final).toLocaleString('en-US', {
            style: 'currency',
            currency: rate_id.value,
        });
        var usd_value_string = (usd_value).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        document.getElementById('output').innerHTML = ("The equivalent of " + usd_value_string + " in " + rate_id.value + " for the date " + $("#rate_date").val() +
            " is: " + convert_value_string);

    };

    var getRatesAndConvert = function (rate_date) {

        console.log("Getting rates for " + rate_date + " ...");

        $.ajax({
            url: 'https://testbed.jaysnellen.com:8443/JSUExchangeRatesServer/rates?date=' + rate_date,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                rates = response;
                convert();
            }
        });

    };

    return {

        getCurrenciesList: function () {

            $.ajax({
                url: 'https://testbed.jaysnellen.com:8443/JSUExchangeRatesServer/currencies',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    createCurrencyMenu(response);
                },
            });

        },

        onClick: function () {

            var rate_date = $("#rate_date").val();

            if (rate_date === "") {
                alert("Please enter or select a date in the \"Date\" field!");
            }
            else {

                // if rates have not been retrieved yet, or if the date is different, fetch new rates

                if ((rates === null) || (rate_date !== rates["date"])) {
                    getRatesAndConvert(rate_date);
                }

                // if rates for the selected date are already available, perform the conversion

                else {
                    convert();
                }

            }

        }

    };

})();