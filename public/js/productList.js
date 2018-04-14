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
});