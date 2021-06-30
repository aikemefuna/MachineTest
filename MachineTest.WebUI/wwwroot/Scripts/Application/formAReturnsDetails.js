$(function () {
    $.ajaxSetup({
        cache: false
    });

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 2
    })


    var h = formatter.format(1000) //"N1,000.00"
    //console.log(h);

    var dataGrid, selectBoxYear, selfServiceBaseUrl, domainName, baseUrl;
    var that = this;

    domainName = document.querySelector("#domainNameId").value;
    baseUrl = domainName;
    selectBoxYear = document.querySelector("#SelectedYearId").value;
    selfServiceBaseUrl = document.querySelector("#selfServiceBaseUrlId").value;

    $("#goBackBtn")
        .click(function () {
            history.back();
            return false;
        });

    allFormAReturnDetailsRemoteDataLoaders = DevExpress.data.AspNet.createStore({
        key: "taxPayerUtin",
        loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllFormAReturnDetails",
        loadParams: { taxAgentUtin: $('#payerUtin').val(), taxYear: selectBoxYear },
        onBeforeSend: function (operation,
            ajaxSettings) {
            ajaxSettings.beforeSend = function (xhr) {
                xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
            };
            ajaxSettings.global = false;
        }
    });

    dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
    dataGrid.clearFilter();

    dataGrid = $("#divDetails").dxDataGrid({
        dataSource: allFormAReturnDetailsRemoteDataLoaders,
        //keyExpr: "payerUtin",
        showBorders: true,
        selection: {
            mode: "single"
        },
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
        "export": {
            enabled: true,
            //fileName: "AllAssessmentsList",
            allowExportSelectedData: true
        },
        onExporting: function (e) {
            var now = new Date();
            e.fileName = $('#payerNameId').val() + $('#SelectedYearId').val() + 'AnnualReturnsReviewList' + '(' + now.toISOString() + ')';
        },
        stateStoring: {
            enabled: false,
            type: "localStorage",
            storageKey: "storage"
        },
        onExported: function (e) {
            DevExpress.ui.notify({
                message: "Export Successful",
                type: "success",
                displayTime: 3000,
                closeOnClick: true
            });
        },
        hoverStateEnabled: true,
        wordWrapEnabled: true,
        //showRowLines: true,
        rowAlternationEnabled: true,
        columnAutoWidth: true,
        columns: [
            {
                dataField: "taxPayerUtin",
                caption: "Payer Utin",
                wordWrapEnabled: true,
                cssClass: 'font-bold'
            },
            {
                dataField: "surname",
                caption: "Payer Name",
                wordWrapEnabled: true,
                sortIndex: 0,
                cssClass: 'font-bold',
                sortOrder: 'asc'
            },
            {
                dataField: "othernames",
                wordWrapEnabled: true,
                caption: "Other Names",
                cssClass: 'font-bold',
                visible: true
            },
            {
                dataField: "taxAgentUtin",
                wordWrapEnabled: true,
                caption: "Payer Utin",
                visible: false
            },
            {
                dataField: "months",
                width: 65,
                caption: "Months ",
                visible: true
            },
            {
                dataField: "basicSalary",
                caption: "Basic Salary",
                alignment: "right",
                cssClass: 'font-bold'
            },
            {
                dataField: "housingAllowance",
                caption: "Housing Allowance",
                alignment: "right",
                cssClass: 'font-bold'
            },
            {
                dataField: "transportAllowance",
                caption: "Transport Allowance",
                alignment: "right",
                cssClass: 'font-bold'
            },
            {
                dataField: "otherAllowance",
                caption: "Other Allowances",
                alignment: "right",
                cssClass: 'font-bold'
            },
            {
                dataField: "totalIncomeEmis",
                caption: "Total Income",
                alignment: "right",
                cssClass: 'font-bold'
            },
            {
                dataField: "pensionRelief",
                caption: "Pension Contribution",
                alignment: "right",
                cssClass: 'font-bold'
            },
            {
                dataField: "nationalPension",
                caption: "NHIS Relief",
                alignment: "right",
                cssClass: 'font-bold'
            },
            {
                dataField: "nationalRelief",
                caption: "NHF Relief",
                alignment: "right",
                cssClass: 'font-bold'
            }
           
        ],
        summary: {
            totalItems: [
                {
                    column: "taxPayerUtin",
                    summaryType: "count"
                }
                //{
                //    column: "totalLiability",
                //    summaryType: "sum",
                //    customizeText: function (data) {
                //        //return "Total: " + formatter.format(data.value);
                //        return formatter.format(data.value);
                //    }
                //}
            ]
        },
        onToolbarPreparing: function (e) {
            var internalGrid = e.component;
            e.toolbarOptions.items.unshift(
                {
                    location: "after",
                    widget: "dxButton",
                    showText: "inMenu",
                    options: {
                        text: "Refresh View",
                        hint: "Refresh View",
                        icon: "refresh",
                        onClick: function () {
                            DevExpress.ui.notify({
                                message: "Refreshing view",
                                type: "success",
                                displayTime: 3000,
                                closeOnClick: true
                            });
                            internalGrid.refresh();
                        }
                    },
                    locateInMenu: "auto"
                }
            );
        }
    });
    
});




