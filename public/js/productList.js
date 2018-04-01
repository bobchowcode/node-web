$(document).ready(function() {
    function Product(id, title, type, desc, price) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.desc = desc;
        this.price = price;
        this.quantity = 0;
    }

    $.ajax({
        url: "/product/getFullProducts",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                var idx = i;
                var product = data[i];
                var product_list = $("#product_list");
                var product_clone = $("#temp_product_grid").clone();
                var product_image = $(product_clone).find("#temp_product_image");
                var product_name = $(product_clone).find("#temp_product_name");
                var product_desc = $(product_clone).find("#temp_product_desc");
                var product_price = $(product_clone).find("#temp_product_price");
                var product_button_div = $(product_clone).find("#temp_product_button");
                var product_button = $(product_clone).find("#temp_product_button button");
                var product_id = "product_" + idx;

                $(product_clone).attr("id", product_id + "_grid");
                $(product_image).attr("id", product_id + "_image");
                $(product_name).attr("id", product_id + "_name");
                $(product_desc).attr("id", product_id + "_desc");
                $(product_price).attr("id", product_id + "_price");
                $(product_button_div).attr("id", product_id + "_button");
                
                $(product_image).html("");
                $(product_name).html(data[i].title);
                $(product_desc).html(data[i].description);
                $(product_price).html("HK" + currency(data[i].price, {formatWithSymbol:true}).format());
                $(product_button).on("click", function() {
                    $.ajax({
                        url: "/product/addToCart",
                        method: "POST",
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                        data: { product: JSON.stringify(product) },
                        success: function(data) {
                            if (data === "success") {
                                alert("success");
                            } else {
                                alert("abc");
                            }
                        }
                    });
                });

                $(product_list).append(product_clone);
            }
        }
    });
});