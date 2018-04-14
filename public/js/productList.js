$(document).ready(function () {
    var typeList = ["All"];

    $.ajax({
        url: "/product/getFullProducts",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                createProductGrid(i, data[i]);
            }
            createDropDown();
        }
    }).always(function() {
        $("#loading-panel").fadeOut("fast");
    });

    $("#filterType").change(function() {
        var type = $("#filterType option:selected").val();
        $(".product_grid").show();
        if (type !== "all") {
            $(".product_grid").not(".type_"+type).hide();
        }
    });

    $("#orderHistorybutton").click(function() {
        $("#loading-panel").fadeIn("fast");
        var a = $("#orderHistoryContainer .order_records").remove();
        $.ajax({
            url: "/order/getOrderHistory",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data) {
                for (var i = 0; i< data.length; i++) {
                    renderOrderHistory(i, data[i]);
                }
                $("#orderHistoryModal").modal("show");
            }
        }).always(function() {
            $("#loading-panel").fadeOut("fast");
        });
    });

    function createProductGrid(i, data) {
        var idx = i;
        var product = data;
        var product_list = $("#product_list");
        var product_clone = $("#temp_product_grid").clone();
        var product_image = $(product_clone).find("#temp_product_image");
        var product_title = $(product_clone).find("#temp_product_title");
        var product_desc = $(product_clone).find("#temp_product_desc");
        var product_price = $(product_clone).find("#temp_product_price");
        var product_button_div = $(product_clone).find("#temp_product_button");
        var product_button = $(product_button_div).find("button");
        var product_id = "product_" + idx;
        var tempType = product.type.trim();

        $(product_clone).attr("id", product_id + "_grid");
        $(product_clone).addClass("product_grid");
        $(product_clone).addClass("type_" + tempType.toLowerCase());
        $(product_image).attr("id", product_id + "_image");
        $(product_title).attr("id", product_id + "_title");
        $(product_desc).attr("id", product_id + "_desc");
        $(product_price).attr("id", product_id + "_price");
        $(product_button_div).attr("id", product_id + "_button");

        $(product_image).attr("src", "images/"+product.imgPath);
        $(product_title).html(data.title);
        $(product_desc).html(data.description);
        $(product_price).html("HK" + currency(data.price, { formatWithSymbol: true }).format());
        $(product_button).on("click", function () {
            addToCart(product);
        });

        $(product_list).append(product_clone);

        if (typeList.indexOf(tempType) == -1) {
            typeList.push(tempType);
        }
    }

    function addToCart(product) {
        $("#loading-panel").fadeIn("fast");
        $.ajax({
            url: "/product/addToCart",
            method: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(product),
            success: function (data) {
                
            }
        }).always(function() {
            $("#loading-panel").fadeOut("fast");
        });
    }

    function createDropDown() {
        var filterType = $("#filterType");
        for (var i = 0; i < typeList.length; i++) {
            var type = document.createElement("option");
            $(type).html(typeList[i]);
            $(type).attr("value", typeList[i].toLowerCase());
            $(filterType).append(type);
        }
    }

    function renderOrderHistory(i, data) {
        var idx = i;
        var order = data;
        var orderHistoryContainer = $("#orderHistoryContainer");
        var order_clone = $("#temp_order_record").clone();
        var order_info = $(order_clone).find("#temp_order_info");
        var order_date = $(order_info).find("#temp_order_date");
        var order_detail = $(order_clone).find("#temp_order_detail");
        var order_total = $(order_clone).find("#temp_order_total");

        var orderStr = "order_" + idx;

        $(order_clone).attr("id", orderStr + "_record");
        $(order_clone).addClass("order_records");
        $(order_info).attr("id", orderStr + "_info");
        $(order_date).attr("id", orderStr + "_date");
        $(order_detail).attr("id", orderStr + "_detail");
        $(order_total).attr("id", orderStr + "_total");
        $(order_detail).empty();

        $(order_date).html((new Date(order.date)).toLocaleString());
        $(order_total).html("Total: HK" + currency(order.total, { formatWithSymbol: true }).format());

        for (var j = 0; j < order.cart.length; j++) {
            var order_product = $("#temp_order_product").clone();
            var product_quantity = $(order_product).find("#temp_product_quantity");
            var product_title = $(order_product).find("#temp_product_title");

            var productStr = orderStr + "_product_" + j;
            $(order_product).attr("id", productStr);
            $(product_quantity).attr("id", productStr + "_quantity");
            $(product_title).attr("id", productStr + "_title");

            $(product_quantity).html(order.cart[j].quantity);
            $(product_title).html(order.cart[j].title);

            $(order_detail).append(order_product);
        }

        $(order_info).click(function() {
            $(order_detail).slideToggle("slow");
        });

        $(orderHistoryContainer).append(order_clone);
    }
});