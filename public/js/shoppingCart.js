$(document).ready(function () {
    $.ajax({
        url: "/product/getCartList",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                createProductRow(i, data[i]);
            }
            $("#loading-panel").fadeOut("fast");
        }
    });

    function createProductRow(i, data) {
        var idx = i;
        var product = data;
        var product_list = $("#product_list");
        var product_clone = $("#temp_product_row").clone();
        var product_quantity = $(product_clone).find("#temp_product_quantity");
        var product_quantity_span = $(product_quantity).find("span");
        var product_title = $(product_clone).find("#temp_product_title");
        var product_price = $(product_clone).find("#temp_product_price");
        var product_button_div = $(product_clone).find("#temp_product_button");
        var product_button = $(product_button_div).find("button");
        var product_id = "product_" + idx;

        $(product_clone).attr("id", product_id + "_row");
        $(product_title).attr("id", product_id + "_title");
        $(product_price).attr("id", product_id + "_price");
        $(product_button_div).attr("id", product_id + "_button");

        $(product_title).html(data.title);
        $(product_quantity_span).html(data.quantity);
        $(product_price).html("HK" + currency(data.price*data.quantity, { formatWithSymbol: true }).format());
        $(product_button).on("click", function () {
            minusProduct(product);
            product.quantity--;
            $(product_quantity_span).html(data.quantity);
            if (product.quantity <= 0) {
                $(product_clone).slideUp("slow", function() {
                    $(product_clone).remove();
                });
            }
        });
        $(product_clone).hide();
        $(product_list).append(product_clone);
        $(product_clone).fadeIn("slow");
    }

    function minusProduct(product) {
        $("#loading-panel").fadeIn("fast");
        $.ajax({
            url: "/product/minusProduct",
            method: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            data: JSON.stringify(product),
            success: function (data) {
               
            }
        }).always(function() {
            $("#loading-panel").fadeOut("fast");
        });
    }
});