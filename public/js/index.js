$(document).ready(function () {

    $.ajax({
        url: "/product/getFeaturedProducts",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                createProductGrid(i, data[i]);
            }
            $("#loading-panel").fadeOut("slow");
        }
    });

    function createProductGrid(i, data) {
        var idx = i;
        var product = data;
        var product_list = $("#product_list");
        var product_clone = $("#product_row").clone();
        var product_image = $(product_clone).find("#temp_product_image");
        var product_title = $(product_clone).find("#temp_product_title");
        var product_desc = $(product_clone).find("#temp_product_desc");
        var product_id = "product_" + idx;

        $(product_clone).attr("id", product_id + "_grid");
        $(product_image).attr("id", product_id + "_image");
        $(product_title).attr("id", product_id + "_title");
        $(product_desc).attr("id", product_id + "_desc");

        $(product_image).attr("src", "images/"+product._id+".png");
        $(product_title).html(data.title);
        $(product_desc).html(data.description);

        $(product_list).append(product_clone);
    }

});