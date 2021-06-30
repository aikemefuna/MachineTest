var gridDataSource = [];
var dataGrid, gridOptions;
$(document).ready(function () {
    showTaxAgent();
    //showMainAgentSelectBox();
    showTaxPayer();
    gridOptions = {
        keyExpr: "PaymentReference",
        editing: { allowDeleting: true },
        hoverStateEnabled: true,
        //wordWrapEnabled: true,
        columnAutoWidth: true,
        selection: {
            mode: "single",
            selectAllMode: 'page'
        },
        onSelectionChanged: function (selectedItems) {
            var data = selectedItems.selectedRowsData[0];
            that.showPreview(data);
            //console.log('selectedItems');
            //console.log(data);
        },
        onRowClick: function (info) {
            //that.showPreview(null, info);
        },
        columns: [
            {
                caption: '#',
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
                dataField: "PaymentReference",
                caption: "Payment Reference",
                cssClass: 'font-bold'
            },
            {
                dataField: "StatusMessage",
                caption: "Status",
                visible: false,
                cellTemplate: $("#paymentStatusTemp")
            }
        ],
        onRowRemoved: function (info) {
            that.resetPaymentDetails();
        }
    };
});



    
function showMainAgentSelectBox() {
    //var mechCode = $("[id*=HfMerchantcode]").val();
    var url = window.location.origin + window.location.pathname;
    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    console.log(baseUrl);
    var agentDataLoader = DevExpress.data.AspNet.createStore({
        key: "PaymentRefNumber",
        loadUrl: baseUrl + "/api/PeriodicNormalization/getNormalizedpayment",
        loadParams: { start: "2020-01-01", end: "2020-03-31" },
    });
    var agentDataSource = new DevExpress.data.DataSource({
        pageSize: 10,
        paginate: true,
        store: agentDataLoader
    });

    mainAgentList = $("#ddlTaxAgent").dxSelectBox({
        dataSource: agentDataSource,
        //valueExpr: ["PayerName", "PayerID"],
        //valueExpr: "PaymentRefNumber",
        displayExpr: "PayerName",
        searchEnabled: true,
        placeholder: "Enter Agent Name or Utin to search",
        //itemTemplate: $("#item-template-agent"),
        hoverStateEnabled: true,
        showClearButton: true,
        searchExpr: ["PayerName", "PayerID"],
        //minSearchLength: 2,
        onValueChanged: function (data) {
            console.log("we got here");
            console.log(data.value);

        }
    }).dxSelectBox("instance");
}

function showTaxAgent() {
    var remoteDataLoader = window.DevExpress.data.AspNet.createStore({
        key: "PayerUtin",
        //loadUrl: "<%= ResolveUrl(LocalizedPath) %>"
        //loadUrl: "api/reg/agents/DTSS"
        loadUrl: "https://liveservices.ogunstaterevenue.com/RegistrationService/api/reg/agents/OGSS"
        //https://liveservices.ogunstaterevenue.com/registrationService/api/reg/payers/OGSS?
    });

    dataGrid,
        gridOptions = {
            dataSource: remoteDataLoader,
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
                pageSize: 20
            },
            pager: {
                showNavigationButtons: true,
                showPageSizeSelector: true,
                allowedPageSizes: [20, 50, 100, 250],
                showInfo: true
            },
            selection: {
                //mode: "single",
                mode: "multiple",
                selectAllMode: 'page',
                showCheckBoxesMode: 'always'
            },
            "export": {
                enabled: true,
                fileName: "TaxPayerList"
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
                }, {
                    dataField: "PayerName",
                    caption: "Business Name",
                    sortIndex: 0,
                    sortOrder: 'asc'
                }, {
                    dataField: "PayerUtin",
                    caption: "Payer Reference"

                    //This allow us to give hyperlink
                    , cellTemplate: function (container, options) {
                        window.$('<a/>').addClass('dx-link').addClass('font-bold').addClass('dx-link-edit')
                            .text(options.value)
                            .on('dxclick', function () {
                                console.log(options.data);
                                //alert('id = ' + options.value + ', utin = ' + options.data.PayerUtin);
                                //window.that.showPopup(options.data);
                                //processSelection(options.data);
                                //that.manageEdit(options.data);
                            }).appendTo(container);
                    }
                },
                {
                    dataField: "Address",
                    caption: "Address"
                },
                {
                    dataField: "BusinessTypeName",
                    caption: "Business Type Name"
                },
                {
                    dataField: "BusinessClassId",
                    caption: "Business ClassId",
                    visible: false
                },
                {
                    dataField: "LgaName",
                    caption: "Lga Name"
                },
                {
                    dataField: "LgaId",
                    caption: "LgaId",
                    visible: false
                },
                {
                    dataField: "PhoneNo",
                    caption: "Phone"
                }

            ]
        };

    dataGrid = window.$("#gridContainer").dxDataGrid(gridOptions).dxDataGrid("instance");

}

function showTaxPayer() {
    var remoteDataLoader = window.DevExpress.data.AspNet.createStore({
        key: "PayerUtin",
        loadUrl: "https://liveservices.ogunstaterevenue.com/registrationService/api/reg/payers/OGSS"
    });

    var dataGrid,
        gridOptions = {
            dataSource: remoteDataLoader,
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
                pageSize: 20
            },
            pager: {
                showNavigationButtons: true,
                showPageSizeSelector: true,
                allowedPageSizes: [20, 50, 100, 250],
                showInfo: true
            },
            selection: {
                //mode: "single",
                mode: "multiple",
                selectAllMode: 'page',
                showCheckBoxesMode: 'always'
            },
            "export": {
                enabled: true,
                fileName: "TaxPayerList"
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
                }, {
                    dataField: "PayerName",
                    caption: "Business Name",
                    sortIndex: 0,
                    sortOrder: 'asc'
                }, {
                    dataField: "PayerUtin",
                    caption: "Payer Reference"

                    //This allow us to give hyperlink
                    , cellTemplate: function (container, options) {
                        window.$('<a/>').addClass('dx-link').addClass('font-bold').addClass('dx-link-edit')
                            .text(options.value)
                            .on('dxclick', function () {
                                console.log(options.data);
                                //alert('id = ' + options.value + ', utin = ' + options.data.PayerUtin);
                                //window.that.showPopup(options.data);
                                //processSelection(options.data);
                                //that.manageEdit(options.data);
                            }).appendTo(container);
                    }
                },
                {
                    dataField: "Address",
                    caption: "Address"
                }
            ]
        };

    dataGrid = window.$("#gridPayerContainer").dxDataGrid(gridOptions).dxDataGrid("instance");

};

//$('#btnAddPayment').click(function () {
//    var payRef = $('#txtPaymentRef').val();
//    if (!payRef) {
//        ShowPopup("Field Error", "Payment Reference is required", "info");
//        $('#txtPaymentRef').focus();
//        return false;
//    }
//    gridDataSource = dataGrid.option("dataSource");
//    gridDataSource = gridDataSource || [];

//    var recExist = gridDataSource.some(x => x.PaymentReference === payRef);
//    if (recExist) {
//        ShowPopup("Duplicate Entry", "Payment Reference " + payRef + " has already been added", "info");
//        $('#txtPaymentRef').focus();
//        return false;
//    }

//    gridDataSource.push({
//        PaymentReference: payRef
//    });
//    dataGrid.option("dataSource", gridDataSource);
//    if (dataGrid.columnOption('StatusMessage', 'visible'))
//        dataGrid.columnOption('StatusMessage', 'visible', false);
//    $('#txtPaymentRef').val('');
//    $('#txtPaymentRef').focus();
//    that.resetPaymentDetails();
//    return true;
//});