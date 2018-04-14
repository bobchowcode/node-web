$(document).ready(function () {
    var totalCost = 0;

    $.ajax({
        url: "/product/getCartList",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                createProductRow(i, data[i]);
            }
        }
    }).always(function() {
        $("#loading-panel").fadeOut("fast");
        $("#cartTotalCost").html("HK" + currency(totalCost, { formatWithSymbol: true }).format());
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
        var product_cost = currency(product.price*product.quantity);
        totalCost = currency(totalCost).add(product_cost);

        $(product_clone).attr("id", product_id + "_row");
        $(product_title).attr("id", product_id + "_title");
        $(product_price).attr("id", product_id + "_price");
        $(product_button_div).attr("id", product_id + "_button");

        $(product_title).html(product.title);
        $(product_quantity_span).html(product.quantity);
        $(product_price).html("HK" + currency(product_cost, { formatWithSymbol: true }).format());
        $(product_button).on("click", function () {
            minusProduct(product, product_clone, product_quantity_span, product_price);
        });
        $(product_clone).hide();
        $(product_list).append(product_clone);
        $(product_clone).fadeIn("slow");
    }

    function minusProduct(product, product_elem, product_elem_quantity, product_elem_price) {
        $("#loading-panel").fadeIn("fast");
        $.ajax({
            url: "/product/minusProduct",
            method: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            data: JSON.stringify(product),
            success: function (data) {
               if (data.res === "success") {
                   product.quantity--;
                   $(product_elem_quantity).html(product.quantity);
                   $(product_elem_price).html("HK" + currency(product.price*product.quantity, { formatWithSymbol: true }).format());
                   if (product.quantity <= 0) {
                       $(product_elem).slideUp("slow", function() {
                           $(product_elem).remove();
                        });
                    }
                    totalCost = currency(totalCost).subtract(product.price);
                    $("#cartTotalCost").html("HK" + currency(totalCost, { formatWithSymbol: true }).format());
               }
            }
        }).always(function() {
            $("#loading-panel").fadeOut("fast");
        });
    }
});