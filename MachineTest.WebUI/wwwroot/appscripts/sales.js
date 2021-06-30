$(function () {
    var baseUrl = $('#ApiBaseUrl').val();

    $('#CountryCode').change(function () {

        let id = $('#CountryCode').val();

        $('#RegionCode').empty();

        if (id != null) {

            $.ajax({
                //headers: {
                //    'Authorization': bearerToken,
                //    'BranchId': branchId
                //},
                url: baseUrl + 'Sales/get-region/' + id,
                type: 'GET',
                datatype: 'json',
                success: function (response) {
                    var items = "";
                    $('#RegionCode').empty();
                    $.each(response.data, function (i, row) {
                        items += "<option value= '" + row.regionCode + "'>" + row.regionName + "</option>";
                    });
                    $('#RegionCode').html(items);
                    $("#RegionCode").trigger("chosen:updated");
                    //$.each(response.data, function (index, item) {

                    //    $('#RegionCode').append(
                    //        $("<option></option>")
                    //            .text(item.regionName)
                    //            .val(item.regionCode)
                    //    );
                    //});
                }
            });
        }
    });
    $('#RegionCode').change(function () {

        let id = $('#RegionCode').val();

        $('#CityCode').empty();

        if (id != null) {

            $.ajax({
                //headers: {
                //    'Authorization': bearerToken,
                //    'BranchId': branchId
                //},
                url: baseUrl + 'Sales/get-city/' + id,
                type: 'GET',
                datatype: 'json',
                success: function (response) {
                    var items = "";
                    $('#CityCode').empty();
                    $.each(response.data, function (i, row) {
                        items += "<option value= '" + row.cityCode + "'>" + row.cityName + "</option>";
                    });
                    $('#CityCode').html(items);
                    $("#CityCode").trigger("chosen:updated");
                    //$.each(response.data, function (index, item) {

                    //    $('#CityCode').append(
                    //        $("<option></option>")
                    //            .text(item.cityName)
                    //            .val(item.cityCode)
                    //    );
                    //});
                }
            });
        }
    });


    $('#countryCodeFilter').change(function () {

        let id = $('#countryCodeFilter').val();

        $('#regionCodeFilter').empty();

        if (id != null) {

            $.ajax({
                //headers: {
                //    'Authorization': bearerToken,
                //    'BranchId': branchId
                //},
                url: baseUrl + 'Sales/get-region/' + id,
                type: 'GET',
                datatype: 'json',
                success: function (response) {
                    var items = "";
                    $('#regionCodeFilter').empty();
                    $.each(response.data, function (i, row) {
                        items += "<option value= '" + row.regionCode + "'>" + row.regionName + "</option>";
                    });
                    $('#regionCodeFilter').html(items);
                    $("#regionCodeFilter").trigger("chosen:updated");
                    //$.each(response.data, function (index, item) {

                    //    $('#RegionCode').append(
                    //        $("<option></option>")
                    //            .text(item.regionName)
                    //            .val(item.regionCode)
                    //    );
                    //});
                }
            });
        }
    });
    $('#regionCodeFilter').change(function () {

        let id = $('#regionCodeFilter').val();

        $('#cityCodeFilter').empty();

        if (id != null) {

            $.ajax({
                //headers: {
                //    'Authorization': bearerToken,
                //    'BranchId': branchId
                //},
                url: baseUrl + 'Sales/get-city/' + id,
                type: 'GET',
                datatype: 'json',
                success: function (response) {
                    var items = "";
                    $('#cityCodeFilter').empty();
                    $.each(response.data, function (i, row) {
                        items += "<option value= '" + row.cityCode + "'>" + row.cityName + "</option>";
                    });
                    $('#cityCodeFilter').html(items);
                    $("#cityCodeFilter").trigger("chosen:updated");
                    //$.each(response.data, function (index, item) {

                    //    $('#CityCode').append(
                    //        $("<option></option>")
                    //            .text(item.cityName)
                    //            .val(item.cityCode)
                    //    );
                    //});
                }
            });
        }
    });

    $('#btn-AddSales').click(function () {
        PostSale();
    });
    $('#btn-Reset').click(function () {
        loadSales();
    });
    $('#btn-Filter').click(function () {
        let from = document.getElementById("from");
        let to = document.getElementById("to");
        let countryCodeFilter = document.getElementById("countryCodeFilter");
        let regionCodeFilter = document.getElementById("regionCodeFilter");
        let cityCodeFilter = document.getElementById("cityCodeFilter");

        let IsValidFromDate = from.checkValidity();
        let IsValidToDate = to.checkValidity();
        let IsValidCountryCodeFilter = countryCodeFilter.checkValidity();
        let IsValidRegionCodeFilter = regionCodeFilter.checkValidity();
        let IsValidCityCodeFilter = cityCodeFilter.checkValidity();

        let isValid = true;

        if (IsValidFromDate == false || IsValidToDate == false || IsValidCountryCodeFilter == false || IsValidRegionCodeFilter == false || IsValidCityCodeFilter == false) {
            isValid = false;
        }

        if (isValid == false) {
            swal({
                title: "Failed!",
                text: "All filter options are required",
                icon: "warning",
                closeOnClickOutside: false,
                closeOnEsc: false
            })
                .then(() => {
                    return false
                });
        }
        else {
            Filter();
        }
     
    });
    loadSales();

    function loadSales() {
        var remoteDataLoader = window.DevExpress.data.AspNet.createStore({
            key: "salesRef",
            loadUrl: baseUrl + "Sales/get-all-sales",
            onBeforeSend: function (operation,
                ajaxSettings) {
                ajaxSettings.beforeSend = function (xhr) {

                },
                    ajaxSettings.global = false;
            }
        });




        var dataGrid,
            gridOptions = {
                dataSource: remoteDataLoader,
                columnHidingEnabled: true,
                showBorders: true,
                remoteOperations: {
                    paging: true,
                    filtering: true,
                    sorting: true,
                    grouping: true,
                    summary: true,
                    groupPaging: true
                },
                searchPanel: {
                    visible: true,
                    placeholder: "Search...",
                    width: 250
                },
                paging: {
                    pageSize: 10
                },
                pager: {
                    showNavigationButtons: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 20, 100, 250],
                    showInfo: true
                },
                selection: {
                    mode: "single",
                    mode: "multiple",
                    selectAllMode: 'page',
                    showCheckBoxesMode: 'no'
                },
                "export": {
                    enabled: false,
                    fileName: ""
                },
                hoverStateEnabled: true,
                showRowLines: true,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                columns: [
                    {
                        caption: 'S/N',
                        width: "auto",
                        allowSorting: false,
                        allowFiltering: false,
                        allowReordering: false,
                        allowHeaderFiltering: false,
                        allowGrouping: false,
                        cellTemplate: function (container, options) {
                            container.text(dataGrid.pageIndex() * dataGrid.pageSize() + (options.rowIndex + 1));

                        }
                    },
                    {
                        dataField: "salesRef",
                        caption: "Bill Number",
                        sortIndex: 0,
                        sortOrder: 'asc',
                        //fixed: true,
                        cssClass: 'font-bold'

                    },
                    {
                        dataField: "customerName",
                        caption: "Customer Name"

                    },
                    {
                        dataField: "countryName",
                        caption: "Country Name"

                    },
                    {
                        dataField: "regionName",
                        caption: "Region Name"

                    },
                    {
                        dataField: "cityName",
                        caption: "City Name"

                    },
                    {
                        dataField: "transactionDate",
                        caption: "Date"
                    },
                    {
                        dataField: "productName",
                        caption: "Product"

                    },
                    {
                        dataField: "quantity",
                        caption: "Quantity"

                    },

                ],

            };

        dataGrid = window.$("#salesContainer").dxDataGrid(gridOptions).dxDataGrid("instance");
    }
    function Filter() {
        var remoteDataLoader = window.DevExpress.data.AspNet.createStore({
            key: "salesRef",
            loadUrl: baseUrl + "Sales/get-all-sales",
            onBeforeSend: function (operation,
                ajaxSettings) {
                ajaxSettings.beforeSend = function (xhr) {
                    xhr.setRequestHeader('from', $('#from').val());
                    xhr.setRequestHeader('to', $('#to').val());
                    xhr.setRequestHeader('cityCodeFilter', $('#cityCodeFilter').val());
                    xhr.setRequestHeader('regionCodeFilter', $('#regionCodeFilter').val());
                    xhr.setRequestHeader('countryCodeFilter', $('#countryCodeFilter').val());
                },
                    ajaxSettings.global = false;
            }
        });




        var dataGrid,
            gridOptions = {
                dataSource: remoteDataLoader,
                columnHidingEnabled: true,
                showBorders: true,
                remoteOperations: {
                    paging: true,
                    filtering: true,
                    sorting: true,
                    grouping: true,
                    summary: true,
                    groupPaging: true
                },
                searchPanel: {
                    visible: true,
                    placeholder: "Search...",
                    width: 250
                },
                paging: {
                    pageSize: 10
                },
                pager: {
                    showNavigationButtons: true,
                    showPageSizeSelector: true,
                    allowedPageSizes: [10, 20, 100, 250],
                    showInfo: true
                },
                selection: {
                    mode: "single",
                    mode: "multiple",
                    selectAllMode: 'page',
                    showCheckBoxesMode: 'no'
                },
                "export": {
                    enabled: false,
                    fileName: ""
                },
                hoverStateEnabled: true,
                showRowLines: true,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                columns: [
                    {
                        caption: 'S/N',
                        width: "auto",
                        allowSorting: false,
                        allowFiltering: false,
                        allowReordering: false,
                        allowHeaderFiltering: false,
                        allowGrouping: false,
                        cellTemplate: function (container, options) {
                            container.text(dataGrid.pageIndex() * dataGrid.pageSize() + (options.rowIndex + 1));

                        }
                    },
                    {
                        dataField: "salesRef",
                        caption: "Bill Number",
                        sortIndex: 0,
                        sortOrder: 'asc',
                        //fixed: true,
                        cssClass: 'font-bold'

                    },
                    {
                        dataField: "customerName",
                        caption: "Customer Name"

                    },
                    {
                        dataField: "countryName",
                        caption: "Country Name"

                    },
                    {
                        dataField: "regionName",
                        caption: "Region Name"

                    },
                    {
                        dataField: "cityName",
                        caption: "City Name"

                    },
                    {
                        dataField: "transactionDate",
                        caption: "Date"
                    },
                    {
                        dataField: "productName",
                        caption: "Product"

                    },
                    {
                        dataField: "quantity",
                        caption: "Quantity"

                    },

                ],

            };

        dataGrid = window.$("#salesContainer").dxDataGrid(gridOptions).dxDataGrid("instance");
    }

    function PostSale() {
        var PostSaleRequest = {
            CustomerName: $('#CustomerName').val(),
            CountryCode: $('#CountryCode').val(),
            RegionCode: $('#RegionCode').val(),
            CityCode: $('#CityCode').val(),
            ProductId: $('#ProductId').val(),
            Quantity: $('#Quantity').val()
        };

      
        var applicationUrl = baseUrl + 'Sales/post-sale';
        $.ajax({
            url: applicationUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(PostSaleRequest),
            success: function (data) {
                if (data.succeeded == true) {
                    swal({
                        title: "Successful!",
                        text: data.message,
                        icon: "success",
                        closeOnClickOutside: false,
                        closeOnEsc: false
                    })
                        .then(() => {
                            $('#SalesModal').modal('hide');
                            loadSales();
                        });
                }
                else {
                    swal({
                        title: "Failed!",
                        text: data.message,
                        icon: "danger",
                        closeOnClickOutside: false,
                        closeOnEsc: false
                    })
                        .then(() => {

                        });
                }


            },
            error: function (xhr) {
                //alert('Woow something went wrong');
            }
        });

    }


});
$(document).on({
    ajaxStart: function () {
        $('#cover-spin').show(0);
    },
    ajaxStop: function () {
        $('#cover-spin').hide();
    }
});
