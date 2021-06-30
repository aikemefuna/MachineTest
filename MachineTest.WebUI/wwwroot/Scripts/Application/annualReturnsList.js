$(function () {
    tSmart.GridController = function () {
        var dataGrid, gridOptions,
            selectBoxYear, selectBoxMode, selectReturnType, selectBoxRevenueOffice, domainName, selfServiceBaseUrl, baseUrl, selectedYearValue, selectedYearText, selectedModeValue, selectedModeText, selectReturnTypeValue, selectReturnTypeText, selectedMinistryValue, selectedMinistryText, merchantCode, merchantId, pageIdentityId, yearListDataLoader, modeListDataLoader, returnTypeListDataLoader, ministryListDataLoader, allAnnualReviewReturnsRemoteDataLoaders, allAnnualReturnsByYearRemoteDataLoaders, allWthHistoryBySelectedYearRemoteDataLoaders;

        var that = this;
        domainName = document.querySelector("#domainNameId").value;
        selfServiceBaseUrl = document.querySelector("#selfServiceBaseUrlId").value;
        console.log(domainName);
        baseUrl = domainName;
        merchantCode = document.querySelector("#merchantCode").value;
        merchantId = document.querySelector("#merchantId").value;
        pageIdentityId = document.querySelector("#pageIdentityId").value;

        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        })

        const numberFormatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0
        })

        const formatterWithNaira = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        })

        modeListDataLoader = [{
            "ModeId": 1,
            "Mode": "Revenue Office",
        },
        {
            "ModeId": 2,
            "Mode": "Global",
        }
        ];

        returnTypeListDataLoader = [{
            "ReturnTypeId": 1,
            "ReturnType": "Annual Returns",
        },
        {
            "ReturnTypeId": 2,
            "ReturnType": "Annual Returns Review",
        },
        {
            "ReturnTypeId": 3,
            "ReturnType": "Monthly Schedule",
        },
        {
            "ReturnTypeId": 4,
            "ReturnType": "Form A",
        },
        {
            "ReturnTypeId": 5,
            "ReturnType": "Withholding",
        }
        ];

        yearListDataLoader = DevExpress.data.AspNet.createStore({
            key: "periodId",
            loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllActiveFiscalPeriods",
            loadParams: { transType: "EMIS" }
        });

        ministryListDataLoader = DevExpress.data.AspNet.createStore({
            key: "agencyCode",
            loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerMinistryByMerchantCode/" + merchantCode,
            onBeforeSend: function (operation,
                ajaxSettings) {
                ajaxSettings.beforeSend = function (xhr) {
                    xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                };
                ajaxSettings.global = false;
            }
        });

        this.initPage = function () {
            DevExpress.ui.setTemplateEngine("underscore");
            $('#goBackId').hide();
            $('#goBackId').click(function () {
                var hfSelectedView = $('#hfSelectedView').val();
                if (hfSelectedView === "AnnualReturnDetailsByTaxOffice") {
                    that.showAllAnnualReturnsByYearByRevenueOffice(selectedYearText);
                }
                if (hfSelectedView === "AnnualReturnDetailsReviewedByTaxOffice") {
                    that.showAllAnnualReviewReturnsByYearByRevenueOffice(selectedYearText);
                }
                if (hfSelectedView === "TccDetailsFromSummary") {
                    that.showAllSummaryTccDetailsListBySelectedDate();
                }

                if (hfSelectedView === "RegistrationDetailsFromSummary") {
                    that.showCompaniesSummaryListBySelectedDate(startDateValue, endDateValue);
                }

            });
            //that.displayDefaultDashboard();

            selectBoxYear = $("#taxYearSelectBox").dxSelectBox({
                dataSource: yearListDataLoader,
                valueExpr: "periodId",
                displayExpr: "taxYear",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["taxYear", "periodId"],
                placeholder: "Click to Select Year",
                showClearButton: true,
                onValueChanged: function (e) {
                    $('#returnTypeId').hide();
                    $("#returnTypeSelectBox").dxSelectBox('instance').option('value', null);
                    dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectedYearValue = value;
                    selectedYearText = text;
                    if (selectedYearValue !== null) {
                        $('#modeId').removeAttr('disabled');
                        $("#modeSelectBox").prop("disabled", false);
                        $("#modeSelectBox").dxSelectBox('instance').option('value', null);
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        $('#revenueOfficeId').hide();
                    }
                    if (selectedYearValue === null) {
                        $("#modeSelectBox").dxSelectBox('instance').option('value', null);
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        $('#modeId').attr('disabled', 'disabled');
                        $("#modeSelectBox").prop("disabled", true);
                    }

                    $('#divDetails').hide();
                    $('#displaySelectedYearId').hide();
                    $('#goBackId').hide();

                    dataGrid = $("#divDetails").dxDataGrid("instance").option('value', null);

                    //let element = document.getElementById("#divDetails");
                    //let instance = DevExpress.ui.dxDataGrid.getInstance(element);
                    //console.log(instance);
                }
            }).dxSelectBox("instance");

            selectBoxMode = $("#modeSelectBox").dxSelectBox({
                dataSource: modeListDataLoader,
                valueExpr: "ModeId",
                displayExpr: "Mode",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["Mode", "ModeId"],
                placeholder: "Click to Select Mode",
                showClearButton: true,
                onValueChanged: function (e) {
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectedModeValue = value;
                    console.log(selectedModeValue);
                    selectedModeText = text;
                    if (selectedModeValue === 1) {
                        $("#returnTypeSelectBox").dxSelectBox('instance').option('value', null);
                        $('#revenueOfficeId').hide();
                        $('#returnTypeId').show();
                        $('#divDetails').hide();
                        $('#displaySelectedYearId').hide();
                        //Write method to display returns by revenue office

                    }
                    if (selectedModeValue === 2) {
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        $("#returnTypeSelectBox").dxSelectBox('instance').option('value', null);
                        $('#revenueOfficeId').hide();
                        $('#returnTypeId').show();
                        $('#displaySelectedYearId').hide();

                    }
                    $('#goBackId').hide();

                    //if (selectedModeValue === null) {
                    //    $('#revenueOfficeId').hide();
                    //    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                    //    $("#returnTypeSelectBox").dxSelectBox('instance').option('value', null);
                    //    $('#divDetails').hide();
                    //}
                }
            }).dxSelectBox("instance");

            selectReturnType = $("#returnTypeSelectBox").dxSelectBox({
                dataSource: returnTypeListDataLoader,
                valueExpr: "ReturnTypeId",
                displayExpr: "ReturnType",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["ReturnType", "ReturnTypeId"],
                placeholder: "Click to Select Return Type",
                showClearButton: true,
                onValueChanged: function (e) {
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectReturnTypeValue = value;
                    console.log(selectReturnTypeValue);
                    selectReturnTypeText = text;
                    if (selectReturnTypeValue === 1 && selectedModeValue === 2) //Annual Returns
                    {
                        that.showAllAnnualReturnsByYear(selectedYearText);
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 2 && selectedModeValue === 2) //Annual Return Review
                    {
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        that.showAllAnnualReviewReturnsByYear(selectedYearText);
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 3 && selectedModeValue === 2) //Monthly Schedule
                    {
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        that.showAllMonthlyReturnsByYear(selectedYearText);
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 4 && selectedModeValue === 2) //Form A
                    {
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        that.showAllFormAReturnsByYear(selectedYearText);
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 5 && selectedModeValue === 2) //Withholding Return
                    {
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        that.showallWthHistoryByYear(selectedYearText);
                        $('#goBackId').hide();
                    }

                    //This is for Revenue office
                    if (selectReturnTypeValue === 1 && selectedModeValue === 1) //Annual Returns
                    {
                        $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
                        $("#divDetails").dxDataGrid("instance").option('value', null);
                        that.showAllAnnualReturnsByYearByRevenueOffice(selectedYearText);
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        selectedModeValue === null;
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 2 && selectedModeValue === 1) //Annual Return Review
                    {
                        $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
                        $("#divDetails").dxDataGrid("instance").option('value', null);
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        that.showAllAnnualReviewReturnsByYearByRevenueOffice(selectedYearText);
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 3 && selectedModeValue === 1) //Monthly Schedule
                    {
                        $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
                        $("#divDetails").dxDataGrid("instance").option('value', null);
                        $('#revenueOfficeId').hide();
                        $('#divDetails').show();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        that.showAllMonthlyReturnsByYearByTaxOffice(selectedYearText);
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 4 && selectedModeValue === 1) //Form A
                    {
                        $('#revenueOfficeId').hide();
                        $('#divDetails').hide();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        //that.showAllFormAReturnsByYear(selectedYearText);
                        ShowMessagePopup("Info", "This is coming up soon", "warning"); $('#displaySelectedYearId').hide();
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === 5 && selectedModeValue === 1) //Withholding Return
                    {
                        $('#revenueOfficeId').hide();
                        $('#divDetails').hide();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        //that.showallWthHistoryByYear(selectedYearText);
                        ShowMessagePopup("Info", "This is coming up soon", "warning"); $('#displaySelectedYearId').hide();
                        $('#goBackId').hide();
                    }
                    if (selectReturnTypeValue === null) {
                        $('#revenueOfficeId').hide();
                        $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                        $('#divDetails').hide();
                        $('#goBackId').hide();
                        $('#displaySelectedYearId').hide();
                    }
                }
            }).dxSelectBox("instance");

            selectBoxRevenueOffice = $("#revenueOfficeSelectBox").dxSelectBox({
                dataSource: ministryListDataLoader,
                valueExpr: "agencyCode",
                displayExpr: "agencyName",
                searchEnabled: true,
                hoverStateEnabled: true,
                searchExpr: ["agencyName", "agencyCode"],
                placeholder: "Click to Select Ministry",
                showClearButton: true,
                onValueChanged: function (e) {
                    var value = e.component.option("value");
                    var text = e.component.option("text");
                    selectedMinistryValue = value;
                    selectedMinistryText = text;
                    if (selectedMinistryValue !== null) {
                        that.showPayerTransactionDetails(selectedMinistryValue);
                        $('#divDetails').show();
                        $('#goBackId').hide();
                    }
                }
            }).dxSelectBox("instance");

            $('#revenueOfficeId').hide();
            $('#modeId').attr('disabled', 'disabled');
            $("#modeSelectBox").prop("disabled", true);

            $('#divDetails').hide();
            $('#displaySelectedYearId').hide();

            if (pageIdentityId !== null && pageIdentityId === "AnnualReturnDetailsPage") {
                //Do auto click the express button
                //$("#viewannualReturnsDetails").trigger('click');
                if (selectedYearValue !== null) {
                    that.showAllAnnualReturnsByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReturnsByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            }

            if (pageIdentityId !== null && pageIdentityId === "AnnualReturnReviewDetailsPage") {
                if (selectedYearValue !== null) {
                    that.showAllAnnualReviewReturnsByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReviewReturnsByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            }

            if (pageIdentityId !== null && pageIdentityId === "FormAReturnDetailsPage") {
                if (selectedYearValue !== null) {
                    that.showAllFormAReturnsByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showAllFormAReturnsByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            }

            $('#viewannualReturnsDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllAnnualReturnsByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReturnsByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            });

            $('#viewannualReturnsReviewDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllAnnualReviewReturnsByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showAllAnnualReviewReturnsByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            });

            $('#viewMonthlyScheduleDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllMonthlyReturnsByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showAllMonthlyReturnsByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            });

            $('#viewFormADetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showAllFormAReturnsByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showAllFormAReturnsByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            });

            $('#viewWithholdingDetails').click(function () {
                if (selectedYearValue !== null) {
                    that.showallWthHistoryByYear(selectedYearText);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
                if (selectedYearValue === null) {
                    that.showallWthHistoryByYear(null);
                    $('#revenueOfficeId').hide();
                    $('#divDetails').show();
                    $("#revenueOfficeSelectBox").dxSelectBox('instance').option('value', null);
                }
            });

        };

        this.displayDefaultDashboard = function () {
            $('#annualReturnReviewTotalCount').text(0);
            $('#annualReturnTotalCount').text(0);
            $('#monthlyScheduleTotalAssCount').text(0);
            $('#formATotalAssCount').text(0);


            //$('#assessmentTotalAssAmt').text("0.00");

            //Annual Returns Review
            $.ajax({
                type: "GET",
                //url: selfServiceBaseUrl + "/api/SelfService/getAllActiveFiscalPeriods" + merchantCode,
                url: selfServiceBaseUrl + "/api/SelfService/getAnnualReturnsReviewCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    //xhr.setRequestHeader('PN-UI', JSON.stringify(serviceUserInfo));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = response.recordResponseObject;
                        //var amountValue = formatter.format(response.data.recordTotal);
                        //$('#annualReturnReviewTotalCount').text(amountValue);
                        $('#annualReturnReviewTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        //$('#assessmentTotalAssAmtView').show();
                    }

                    $('#loading').hide();
                }
            });

            //Annual Returns Count
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getAnnualReturnsCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = response.recordResponseObject;
                        console.log(countValue);
                        $('#annualReturnTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#loading').hide();
                        $('#viewTccDetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });

            //Monthly Schedule
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getMonthlyScheduleCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = 0;
                        countValue = response.recordResponseObject;
                        console.log(parseInt(countValue));
                        $('#monthlyScheduleTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#loading').hide();
                        $('#viewMonthlyScheduleDetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });

            //Form A
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getFormACounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    //xhr.setRequestHeader('MerchantCode', JSON.stringify(merchantCode));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = 0;
                        countValue = response.recordResponseObject;
                        $('#formATotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#loading').hide();
                        $('#viewFormADetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });

            //Withholding Returns
            $.ajax({
                type: "GET",
                url: selfServiceBaseUrl + "/api/SelfService/getWithholdingReturnsCounts",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    //xhr.setRequestHeader('MerchantCode', JSON.stringify(merchantCode));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = 0;
                        countValue = response.recordResponseObject;
                        $('#withholdingTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#loading').hide();
                        $('#viewWithholdingDetails').show();
                        return;
                    }

                    $('#loading').hide();
                }
            });
        };

        this.showAllAnnualReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allAnnualReturnsByYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReturnsByYearRemoteDataLoaders,
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
                        e.fileName = taxYear + 'Annual Return List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "createdOnFormated",
                            //dataType: "datetime",
                            caption: "Date Submitted"
                        },
                        {
                            dataField: "totalAmountFormated",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'glyphicons unshare btn-sm btn-theme',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "annualReturnsList";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                console.log(taxAgentUtin);
                                console.log(taxYear);
                                console.log(employerReturnsId);
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); addClass("btn btn-danger btn-block animated lightSpeedIn btn-push no-margin rounded");btn btn-info btn-sm

                                return $("<a>", { "href": "./AnnualReturnDetails?" + "&annualReturnDetailsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");

                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "totalAmountFormated",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Submitted");
        }

        this.showAllAnnualReturnsByYearByTaxOfficeId = function (sentData) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allAnnualReturnsByYearByTaxOfficeIdRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsByRevenueOfficeDetailsList",
                loadParams: { taxYear: selectedYearText, revenueOfficeId: sentData.revenueOfficeId },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReturnsByYearByTaxOfficeIdRemoteDataLoaders,
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
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = selectedYearText + 'Annual Return List At ' + sentData.revenueOfficeName + '(' + now.toISOString() + ')';
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
                            dataField: "revenueOfficeName",
                            caption: "Revenue Office Name",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "organizationName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentTIN",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "createdOnFormated",
                            //dataType: "datetime",
                            caption: "Date Submitted"
                        },
                        {
                            dataField: "totalAmount",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentTIN",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'glyphicons unshare btn-sm btn-theme',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentTIN;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "annualReturnsList";
                                var formedString = taxAgentUtin + "/" + options.data.organizationName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); addClass("btn btn-danger btn-block animated lightSpeedIn btn-push no-margin rounded");btn btn-info btn-sm

                                return $("<a>", { "href": "./AnnualReturnDetails?" + "&annualReturnDetailsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");

                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentTIN",
                                summaryType: "count"
                            },
                            {
                                column: "totalAmount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Submitted At " + sentData.revenueOfficeName);
            $('#hfSelectedView').val("AnnualReturnDetailsReviewedByTaxOffice");
            $('#goBackId').show();
        }

        this.showAllAnnualReturnsReviewedByYearByTaxOfficeId = function (sentData) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allAnnualReturnsByYearByTaxOfficeIdRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsByRevenueOfficeDetailsList",
                loadParams: { taxYear: selectedYearText, revenueOfficeId: sentData.revenueOfficeId, sentWorkedon: "1" },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReturnsByYearByTaxOfficeIdRemoteDataLoaders,
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
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = selectedYearText + 'Annual Return Submitted & Reviewed List At ' + sentData.revenueOfficeName + '(' + now.toISOString() + ')';
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
                            dataField: "revenueOfficeName",
                            caption: "Revenue Office Name",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "organizationName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentTIN",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "createdOnFormated",
                            //dataType: "datetime",
                            caption: "Date Submitted"
                        },
                        {
                            dataField: "totalAmount",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentTIN",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'glyphicons unshare btn-sm btn-theme',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentTIN;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "annualReturnsList";
                                var formedString = taxAgentUtin + "/" + options.data.organizationName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); addClass("btn btn-danger btn-block animated lightSpeedIn btn-push no-margin rounded");btn btn-info btn-sm

                                return $("<a>", { "href": "./AnnualReturnReviewDetails?" + "&annualReturnsReviewUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");

                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentTIN",
                                summaryType: "count"
                            },
                            {
                                column: "totalAmount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Submitted & Reviewed At " + sentData.revenueOfficeName);
            $('#hfSelectedView').val("AnnualReturnDetailsReviewedByTaxOffice");
            $('#goBackId').show();
        }

        this.showAllAnnualReviewReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allAnnualReviewReturnsRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "taxAgentUtin",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsReviewList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReviewReturnsRemoteDataLoaders,
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
                        e.fileName = taxYear + 'Annual Return Review List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            sortOrder: 'asc',
                            alignment: "left",
                            wordWrapEnabled: true,
                            sortIndex: 1,
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            alignment: "left",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxAgentCount",
                            dataType: "number",
                            alignment: "left",
                            caption: "Staff Strength"
                        },
                        {
                            dataField: "grossIncome",
                            caption: "Gross Income",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxPayable",
                            caption: "Tax Payable",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxDeducted",
                            caption: "Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxRemitted",
                            caption: "Tax Remitted",
                            alignment: "right",
                            cssClass: 'font-bold'
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "underRemittance",
                            caption: "Under Remittance",
                            alignment: "right",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "totalLiability",
                            caption: "Total Liability",
                            alignment: "right",
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "underDeduction",
                            caption: "Under/(Over) Deduction",
                            alignment: "right",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "isReviewLetterPrinted",
                            caption: "Status",
                            sortIndex: 5,
                            sortOrder: 'asc',
                            dataType: "boolean",
                            alignment: "center",
                            wordWrapEnabled: true,
                            visible: false,
                            cellTemplate: function (container, options) {
                                if (options.value === true) {

                                    return $("<div/>")
                                        .addClass("label label-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Printed")
                                        );
                                }
                                else if (options.value === false) {
                                    return $("<div/>")
                                        .addClass("label label-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Awaiting Printing")
                                        );
                                }
                                else {
                                    return $("<div/>")
                                        .addClass("label label-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Not Printed")
                                        );
                                }

                            }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'primary',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "annualReturnsList";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); 

                                return $("<a>", { "href": "./AnnualReturnReviewDetails?" + "&annualReturnsReviewUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        },
                        {
                            caption: "Review Letter",
                            width: 140,
                            alignment: "center",
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'Generate',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            var result = window.DevExpress.ui.dialog.confirm("Do you want to generate " + options.data.taxAgentName + " review letter. click Yes otherwise click No?", "Review Letter");
                                            result.done(function (dialogResult) {
                                                if (dialogResult) {
                                                    that.showReviewDetailsPopUp(options.data);
                                                }
                                                else
                                                    window.DevExpress.ui.notify("Review Letter Canceled", "error", 2000);
                                            });
                                            return false;
                                        }
                                    }
                                ).appendTo(container);
                            },
                            visible: false
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Review Letter",
                            alignment: "center",
                            wordWrapEnabled: true,
                            //cssClass: 'primary',
                            visible: false,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = selectedYearText;
                                var employerReturnsId = options.data.employerReturnsId;
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear;
                                console.log(taxAgentUtin);
                                console.log(taxYear);
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); 

                                return $("<a>", { "href": "../SelfService/AnnualReturnReviewDetail?" + "&annualReturnsReviewUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('Generate').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "grossIncome",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "taxPayable",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "taxRemitted",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "underRemittance",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            //$('#displaySelectedYearId').text(selectedYearText);
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Review");
        }

        this.showAllMonthlyReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allMonthlyReturnsByYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerMonthlyReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllMonthlyReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allMonthlyReturnsByYearRemoteDataLoaders,
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
                        e.fileName = taxYear + 'Monthly Return List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "taxYear",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },

                        {
                            dataField: "periodValueCount",
                            caption: "No. of Month",
                            cssClass: 'font-bold',
                            alignment: "center",
                            visible: true
                        },
                        //{
                        //    dataField: "createdOnFormated",
                        //    //dataType: "datetime",
                        //    caption: "Date Submitted"
                        //},
                        {
                            dataField: "totalAmountFormated",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Summary Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            cssClass: 'success',
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.taxYear;
                                var employerReturnsId = options.data.employerReturnsId;
                                var pageName = "annualReturnsList";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + employerReturnsId + "/" + pageName;
                                console.log(taxAgentUtin);
                                console.log(taxYear);
                                console.log(employerReturnsId);
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //console.log(itemKeyEncodedStringWith); 

                                //return $("<a>", { "href": "../SelfService/MonthlyReturnSummary?" + "&monthlyreturnsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View');

                                return $("<a>", { "href": "../SelfService/MonthlyReturnSummary?" + "&monthlyreturnsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "totalAmountFormated",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Monthly Schedule Submitted");
        }

        this.showAllMonthlyReturnsByYearByTaxOffice = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allMonthlyReturnsByYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "revenueOfficeId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllMonthlyReturnsList",
                loadParams: { taxYear: taxYear, forReview: true },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allMonthlyReturnsByYearRemoteDataLoaders,
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
                        e.fileName = taxYear + 'Monthly Return By Revenue Office List' + '(' + now.toISOString() + ')';
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
                            dataField: "revenueOfficeName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Revenue Office Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "revenueOfficeId",
                            caption: "RevenueOfficeId",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "taxAgentCount",
                            caption: "Tax Agent Count",
                            calculateCellValue: function (data) {
                                return numberFormatter.format(data.taxAgentCount);
                            },
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "totalAmountFormated",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold'
                        },
                        {
                            caption: "Details",
                            width: 200,
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            $('#divDetails').hide();
                                            ShowMessagePopup("Info", "This is coming up soon", "warning");
                                            //that.showAllAnnualReturnsByYearByTaxOfficeId(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "revenueOfficeName",
                                summaryType: "count"
                            },
                            {
                                column: "taxAgentCount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    return "Total: " + numberFormatter.format(data.value);
                                }
                            },
                            {
                                column: "totalAmountFormated",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Monthly Schedule Submitted By Revenue Office");
        }

        this.showAllFormAReturnsByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allFormAReturnsByYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "employerFormAReturnsId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllFormAReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allFormAReturnsByYearRemoteDataLoaders,
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
                        e.fileName = taxYear + 'Form A Return List' + '(' + now.toISOString() + ')';
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
                            dataField: "taxAgentName",
                            wordWrapEnabled: true,
                            caption: "Organization Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Organization UTIN",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "year",
                            caption: "Year",
                            cssClass: 'font-bold',
                            visible: true
                        },
                        {
                            dataField: "createdOnFormated",
                            //dataType: "datetime",
                            caption: "Date Submitted"
                        },
                        {
                            dataField: "totalIncomeFormated",
                            caption: "Total Income",
                            alignment: "right",
                            cssClass: 'font-bold',
                            //dataType: "number",
                            //format: { type: 'fixedPoint', precision: 4 }
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Complete Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            visible: true,
                            cellTemplate: function (container, options) {
                                var taxAgentUtin = options.data.taxAgentUtin;
                                var taxYear = options.data.year;
                                //var employerFormAReturnsId = options.data.employerFormAReturnsId;
                                var pageName = "annualReturnsList";
                                var formedString = taxAgentUtin + "/" + options.data.taxAgentName + "/" + taxYear + "/" + pageName;
                                var padding = "'='";
                                var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');

                                //return $("<a>", { "href": "../SelfService/FormAReturnDetails?" + "&fromareturns=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View');

                                return $("<a>", { "href": "./FormADetailsView?" + "&formAReturnsUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('View').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");
                            }
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentUtin",
                                summaryType: "count"
                            },
                            {
                                column: "totalIncomeFormated",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Form A Returns Submitted");
        }

        this.showallWthHistoryByYear = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allWthHistoryBySelectedYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "taxAgentUtin",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllWithholdingReturnsList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allWthHistoryBySelectedYearRemoteDataLoaders,
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
                        pageSize: 12
                    },
                    pager: {
                        showNavigationButtons: true,
                        showPageSizeSelector: true,
                        allowedPageSizes: [20, 50, 100, 250],
                        showInfo: true
                    },
                    "export": {
                        enabled: true,
                        //fileName: "AllTccList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'AllWithholdingList' + '(' + now.toISOString() + ')';
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
                            dataField: "nameOfContractor",
                            caption: "Name Of Contractor/Consultant",
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                            //calculateCellValue: function (data) {
                            //    return [data.lastname,
                            //    data.firstname, data.othernames]
                            //        .join(" ");
                            //}
                        },
                        {
                            dataField: "addressOfBusinessOutfit",
                            caption: "Address",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "natureOfContract",
                            wordWrapEnabled: true,
                            caption: "Nature of Contract",
                            sortIndex: 1,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "contractSum",
                            caption: "Contract Sum",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "percentOFTaxWithHeld",
                            wordWrapEnabled: true,
                            caption: "Percentage of Tax Withheld"
                        },
                        {
                            dataField: "amountWithHeld",
                            caption: "Amount WithHeld",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "monthName",
                            wordWrapEnabled: true,
                            caption: "Month(s)",
                            sortIndex: 3,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "whtTransReferenceNumber",
                            caption: "Trans Reference Number",
                            alignment: "left",
                            visible: false,
                        },
                        {
                            dataField: "taxAgentUtin",
                            caption: "Tax AgentUtin",
                            alignment: "left",
                            visible: false,
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "monthName",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },

                            {
                                column: "amountWithHeld",
                                summaryType: "sum",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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

                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Withholding Returns Submitted");
        }

        //By Revenue Office
        this.showAllAnnualReturnsByYearByRevenueOffice = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allAnnualReturnsByYearTaxOfficeRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "revenueOfficeId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsByRevenueOfficeList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReturnsByYearTaxOfficeRemoteDataLoaders,
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
                        e.fileName = taxYear + 'Annual Return List By Revenue Office' + '(' + now.toISOString() + ')';
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
                            dataField: "revenueOfficeId",
                            caption: "RevenueOfficeId",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "revenueOfficeName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Revenue Office Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentCount",
                            dataType: "number",
                            alignment: "left",
                            calculateCellValue: function (data) {
                                return numberFormatter.format(data.taxAgentCount);
                            },
                            caption: "Agent Count"
                        },
                        {
                            dataField: "totalAmount",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold'
                        },
                        {
                            caption: "Details",
                            width: 200,
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            $('#divDetails').hide();
                                            that.showAllAnnualReturnsByYearByTaxOfficeId(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        }
                        //{
                        //    dataField: "revenueOfficeId",
                        //    caption: "View",
                        //    alignment: "center",
                        //    wordWrapEnabled: true,
                        //    //cssClass: 'glyphicons unshare btn-sm btn-theme',
                        //    visible: true,
                        //    cellTemplate: function (container, options) {
                        //        var revenueOfficeId = options.data.revenueOfficeId;
                        //        var taxYear = taxYear;
                        //        var revenueOfficeName = options.data.revenueOfficeName;
                        //        var pageName = "annualReturnsList";
                        //        var formedString = revenueOfficeId + "/" + revenueOfficeName + "/" + taxYear + "/" + pageName;
                        //        //console.log(taxAgentUtin);
                        //        //console.log(taxYear);
                        //        //console.log(employerReturnsId);
                        //        var padding = "'='";
                        //        var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                        //        //console.log(itemKeyEncodedStringWith); addClass("btn btn-danger btn-block animated lightSpeedIn btn-push no-margin rounded");btn btn-info btn-sm

                        //        return $("<a>", { "href": "./AnnualReturnDetailsByTaxOffice?" + "&annualReturnDetailsByTaxOfficeUrlEncoded=" + itemKeyEncodedStringWith, "target": "_parent" }).text('Details').addClass("btn btn-info btn-block animated lightSpeedIn btn-push no-margin rounded");

                        //    }
                        //}

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "revenueOfficeName",
                                summaryType: "count"
                            },
                            {
                                column: "taxAgentCount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    return "Total: " + numberFormatter.format(data.value);
                                }
                            },
                            {
                                column: "totalAmount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Submitted By Revenue Office");
            $('#goBackId').hide();
        }

        this.showAllAnnualReviewReturnsByYearByRevenueOffice = function (taxYear) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            allAnnualReviewReturnsByYearTaxOfficeRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "revenueOfficeId",
                loadUrl: selfServiceBaseUrl + "/api/SelfService/getAllAnnualReturnsReviewedByRevenueOfficeList",
                loadParams: { taxYear: taxYear },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allAnnualReviewReturnsByYearTaxOfficeRemoteDataLoaders,
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
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = taxYear + 'Annual Return Submitted & Reviewed List By Revenue Office' + '(' + now.toISOString() + ')';
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
                            dataField: "revenueOfficeId",
                            caption: "RevenueOfficeId",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "revenueOfficeName",
                            //width: 180,
                            wordWrapEnabled: true,
                            caption: "Revenue Office Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxAgentCount",
                            dataType: "number",
                            alignment: "left",
                            calculateCellValue: function (data) {
                                return numberFormatter.format(data.taxAgentCount);
                            },
                            caption: "Agent Count"
                        },
                        {
                            dataField: "totalAmount",
                            caption: "Total Tax Deducted",
                            alignment: "right",
                            cssClass: 'font-bold'
                        },
                        {
                            caption: "Details",
                            width: 200,
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            $('#divDetails').hide();
                                            that.showAllAnnualReturnsReviewedByYearByTaxOfficeId(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "revenueOfficeName",
                                summaryType: "count"
                            },
                            {
                                column: "taxAgentCount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    return "Total: " + numberFormatter.format(data.value);
                                }
                            },
                            {
                                column: "totalAmount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
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
                };

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#displaySelectedYearId').show();
            $('#displaySelectedYearId').text("Details of Annual Returns Submitted & Reviewed By Revenue Office");
            $('#goBackId').hide();
        }




        this.showPayerTransactionDetails = function (agencyCode) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $('#divDetails').show();
            $('#platformNameSelected').text("Details of Payer Ledger By Agency View");
            $.ajaxSetup({
                cache: false
            });

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "payerId",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerSummaryGroupedByMerchantCode/" + merchantCode,
                //loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('agencyCode', JSON.stringify(agencyCode));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                    };
                    ajaxSettings.global = false;
                }
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
                    //selection: {
                    //    mode: "multiple",
                    //    //mode: "single",
                    //    selectAllMode: 'page',
                    //    showCheckBoxesMode: 'always'
                    //},

                    "export": {
                        enabled: true,
                        //fileName: "AssessmentSummaryByPlatformList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'PayerTransactionDetailsList' + '(' + now.toISOString() + ')';
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
                            dataField: "payerName",
                            caption: "Payer Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "payerId",
                            caption: "Payer ID",
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "currentYearAss",
                            caption: "Current Year Ass.",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "currentYearPayment",
                            caption: "Current Year Payment",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "balance",
                            caption: "Balance",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        //{
                        //    dataField: "balance",
                        //    caption: "Total",
                        //    dataType: "number",
                        //    alignment: "right",
                        //    cssClass: 'font-bold',
                        //    format: { type: 'fixedPoint', precision: 2 },
                        //    calculateCellValue: function (data) {
                        //        return [data.currentYearAss +
                        //            data.currentYearPayment + data.balance];
                        //    }
                        //},
                        {
                            caption: "Details",
                            width: 200,
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            $('#divDetails').hide();
                                            //console.log(options.data);
                                            that.showPayerLedgerDetailsPopUp(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "payerId",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "balance",
                                summaryType: "sum",
                                showInColumn: "balance",
                                displayFormat: "Column: {4}.: {0}",
                                //displayFormat: "Column: {1}. Sales: {0}",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }

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
                };
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");

            //$('#exportButton').dxButton({
            //    icon: 'exportpdf',
            //    text: 'Export to PDF',
            //    onClick: function () {
            //        const doc = new jsPDF();
            //        DevExpress.pdfExporter.exportDataGrid({
            //            jsPDFDocument: doc,
            //            component: dataGrid
            //        }).then(function () {
            //            doc.save('PayerLedgerInformationList.pdf');
            //        });
            //    }
            //});

            //$("#print").dxButton({
            //    icon: "print",
            //    text: "Print",
            //    onClick: function () {
            //        dataGrid.print();
            //    }
            //});
        };

        this.showPayerTransactionDetailsByGlobalMode = function () {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $('#divDetails').show();
            $('#platformNameSelected').text("Details of Payer Ledger By Global View");
            $.ajaxSetup({
                cache: false
            });

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "payerId",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerSummaryGroupedByMerchantCode/" + merchantCode,
                //loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('agencyCode', JSON.stringify(null));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                    };
                    ajaxSettings.global = false;
                }
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
                    //selection: {
                    //    mode: "multiple",
                    //    //mode: "single",
                    //    selectAllMode: 'page',
                    //    showCheckBoxesMode: 'always'
                    //},

                    "export": {
                        enabled: true,
                        //fileName: "AssessmentSummaryByPlatformList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'PayerTransactionDetailsList' + '(' + now.toISOString() + ')';
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
                            dataField: "payerName",
                            caption: "Payer Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "payerId",
                            caption: "Payer ID",
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "agencyName",
                            caption: "Agency Name",
                            sortIndex: 2,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "currentYearAss",
                            caption: "Current Year Ass.",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "currentYearPayment",
                            caption: "Current Year Payment",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "balance",
                            caption: "Balance",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        //{
                        //    dataField: "balance",
                        //    caption: "Total",
                        //    dataType: "number",
                        //    alignment: "right",
                        //    cssClass: 'font-bold',
                        //    format: { type: 'fixedPoint', precision: 2 },
                        //    calculateCellValue: function (data) {
                        //        return [data.currentYearAss +
                        //            data.currentYearPayment + data.balance];
                        //    }
                        //},
                        {
                            caption: "Details",
                            width: 200,
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            $('#divDetails').hide();
                                            //console.log(options.data);
                                            that.showPayerLedgerGlobalDetailsPopUp(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "payerId",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "balance",
                                summaryType: "sum",
                                showInColumn: "balance",
                                displayFormat: "Column: {4}.: {0}",
                                //displayFormat: "Column: {1}. Sales: {0}",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }

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
                };
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");

            //$('#exportButton').dxButton({
            //    icon: 'exportpdf',
            //    text: 'Export to PDF',
            //    onClick: function () {
            //        const doc = new jsPDF();
            //        DevExpress.pdfExporter.exportDataGrid({
            //            jsPDFDocument: doc,
            //            component: dataGrid
            //        }).then(function () {
            //            doc.save('PayerLedgerInformationList.pdf');
            //        });
            //    }
            //});
        };

        var hy;

        this.showPayerLedgerDetailsPopUp = function (sentData) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();

            $.ajaxSetup({
                cache: false
            });

            var displayDetailsOfPayerLedger = DevExpress.data.AspNet.createStore({
                key: "agentUtin",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerDetailsByPayerId/" + merchantCode,
                loadParams: { tccNo: sentData.tccNo },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('payerId', JSON.stringify(sentData.payerId));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                        xhr.setRequestHeader('agencyCode', JSON.stringify(selectedMinistryValue));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = $("#grdContainerPayerLedgerDetails").dxDataGrid({
                    dataSource: displayDetailsOfPayerLedger,
                    showBorders: true,
                    "export": {
                        enabled: true,
                        //fileName: "AllTccList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'TccDetails' + '(' + now.toISOString() + ')';
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
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "agentUtin",
                            caption: "Payer ID",
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            visible: false,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "createdOn",
                            caption: "Dated On",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            width: 100,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        },
                        //{
                        //    dataField: "createdOnFormated",
                        //    caption: "Expiry Date",
                        //    dataType: "date",
                        //    wordWrapEnabled: true,
                        //    format: "dd-MMM-yyyy"
                        //},
                        {
                            dataField: "narration",
                            caption: "Description",
                            alignment: "left",
                            //width: 80,
                            wordWrapEnabled: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "referenceNo",
                            caption: "Reference No.",
                            wordWrapEnabled: true,
                            alignment: "left",
                            width: 180,
                            cssClass: 'font-bold',
                        },
                        {
                            dataField: "debit",
                            caption: "Debit",
                            alignment: "right",
                            wordWrapEnabled: true,
                            //width: 160,
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "credit",
                            caption: "Credit",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            wordWrapEnabled: true,
                            //width: 150,
                            format: { type: 'fixedPoint', precision: 2 },
                        },
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "agentUtin",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "debit",
                                summaryType: "sum",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "credit",
                                summaryType: "sum",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
                        ]
                    },
                });

            var fullName = sentData.payerName;
            var title = "Payer Ledger DETAILS" + " " + "Of" + " - " + fullName;
            $("#modal-owner-tccDetails .modal-title").html(title);
            $('#lblTccOwnerName').text(fullName);
            $('#lblTccOwnerNo').text(sentData.tccNo);
            $('#lblOwnerUtin').text(sentData.payerId);
            $('#lblTccOwnerTaxYear').text(sentData.taxYear);
            //that.EnableModal();
            $('#modal-owner-tccDetails').modal({
                backdrop: 'static'
            });
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
        };

        this.showPayerLedgerGlobalDetailsPopUp = function (sentData) {
            dataGrid = $("#divDetails").dxDataGrid(null).dxDataGrid("instance");
            dataGrid.clearFilter();
            
            $.ajaxSetup({
                cache: false
            });

            var displayDetailsOfPayerLedger = DevExpress.data.AspNet.createStore({
                key: "agentUtin",
                loadUrl: baseUrl + "/api/v1.0/PayerLedger/getPayerLedgerDetailsByPayerId/" + merchantCode,
                loadParams: { tccNo: sentData.tccNo },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('payerId', JSON.stringify(sentData.payerId));
                        xhr.setRequestHeader('mode', JSON.stringify(selectedModeValue));
                        xhr.setRequestHeader('taxYear', JSON.stringify(selectedYearValue));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = $("#grdContainerPayerLedgerDetails").dxDataGrid({
                    dataSource: displayDetailsOfPayerLedger,
                    showBorders: true,
                    "export": {
                        enabled: true,
                        //fileName: "AllTccList",
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'TccDetails' + '(' + now.toISOString() + ')';
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
                            dataField: "agentUtin",
                            caption: "Payer ID",
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            visible: false,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "createdOn",
                            caption: "Dated On",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            width: 100,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        },
                        //{
                        //    dataField: "createdOnFormated",
                        //    caption: "Expiry Date",
                        //    dataType: "date",
                        //    wordWrapEnabled: true,
                        //    format: "dd-MMM-yyyy"
                        //},
                        {
                            dataField: "narration",
                            caption: "Description",
                            alignment: "left",
                            //width: 80,
                            wordWrapEnabled: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "referenceNo",
                            caption: "Reference No.",
                            wordWrapEnabled: true,
                            alignment: "left",
                            width: 180,
                            cssClass: 'font-bold',
                        },
                        {
                            dataField: "debit",
                            caption: "Debit",
                            alignment: "right",
                            wordWrapEnabled: true,
                            //width: 160,
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "credit",
                            caption: "Credit",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            wordWrapEnabled: true,
                            //width: 150,
                            format: { type: 'fixedPoint', precision: 2 },
                        },
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "agentUtin",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "debit",
                                summaryType: "sum",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);

                                    return formatterWithNaira.format(data.value);
                                }
                            },
                            {
                                column: "credit",
                                summaryType: "sum",
                                //valueFormat: { type: 'fixedPoint', precision: 2 },
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    hy = data.value;
                                    console.log(hy);
                                    return formatterWithNaira.format(data.value);
                                }
                            }
                        ]
                    },
                });

            var fullName = sentData.payerName;
            var title = "Payer Ledger DETAILS" + " " + "Of" + " - " + fullName;
            $("#modal-owner-tccDetails .modal-title").html(title);
            $('#lblTccOwnerName').text(fullName);
            $('#lblTccOwnerNo').text(sentData.tccNo);
            $('#lblOwnerUtin').text(sentData.payerId);
            $('#lblTccOwnerTaxYear').text(sentData.taxYear);
            //$('#lblBalance').text(hy);
            //that.EnableModal();
            $('#modal-owner-tccDetails').modal({
                backdrop: 'static'
            });

            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
        };

        $('#btnLogin').on('click', function () {
            $('#btnLogin').attr('disabled', 'disabled');
            var isValid = true;
            if ($('#txtUsername').val().trim() === "") {
                $('#txtUsername').css('border-color', 'Red');
                isValid = false;
            }
            else {
                $('#txtUsername').css('border-color', 'lightgrey');
            }
            if ($('#txtpassword').val().trim() === "") {
                $('#txtpassword').css('border-color', 'Red');
                isValid = false;
            }
            else {
                $('#txtpassword').css('border-color', 'lightgrey');
            }
            if (isValid === false) {
                ShowMessagePopup("Oops!", "Please ensure you fill both username and password field", "warning");
                $('#txtUsername').focus();
                ($('#txtUsername').focus());
                $('#btnLogin').removeAttr('disabled');
                return false;
            }

            that.PostToServer();
        })

        this.PostToServer = function () {

            var options = {};
            options.url = "Login?handler=ValidateCredentialsAsync";
            options.type = "POST";

            var inputedLoginParameters = {};
            inputedLoginParameters.Email = $('#txtUsername').val();
            inputedLoginParameters.Password = $('#txtpassword').val();
            inputedLoginParameters.RememberMe = $('#txtRememberMe').val(); //true;

            //console.log("got dere");
            options.data = JSON.stringify(inputedLoginParameters);
            options.contentType = "application/json";
            options.dataType = "json";
            options.async = true;
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader("MY-XSRF-TOKEN",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
                xhr.setRequestHeader('inputedLoginParameters', JSON.stringify(inputedLoginParameters));
                $("#loader").show();
                $("#loaderId").show();
            };

            options.success = function (data) {
                $("#loader").show();
                $("#loaderId").show();
                //console.log(data);
                var returnMsgId = data.statusId;
                var returnMsg = data.statusMessage;
                if (returnMsgId < 1) {
                    ShowMessagePopup("Oops!", returnMsg, "error");
                }
                else {
                    var hashComputed = data.recordResponseObject.computedHash;
                    var postParamsToExpress = data.recordResponseObject.postParamsToExpress;
                    ShowMessagePopup("Attention!", "Please wait, Transaction Processing....", "success");
                    //Do auto click the express button
                    //$("#expressBtn").trigger('click');
                    $("#pay").html(postParamsToExpress);
                }
            };
            options.error = function () {
                msg = "Error while processing your transaction!";
                ShowMessagePopup("Oops!", msg, "error");
                $("#loader").hide();
                $("#loaderId").hide();
            };
            $.ajax(options);
        };

        this.PostToServers = function () {
            console.log("About to login");

            $('#btnSaveUpload').attr('disabled', 'disabled');

            var inputedLoginParameters = {};
            inputedLoginParameters.Email = $('#txtUsername').val();
            inputedLoginParameters.Password = $('#txtpassword').val();
            inputedLoginParameters.RememberMe = $('#txtRememberMe').val(); //true;

            //console.log(selectBoxYear);
            //console.log($('#payerUtin').val());
            $.ajax({
                type: "POST",
                url: "Login?handler=ValidateCredentialsAsync",  //baseUrl + "/api/SelfService/ImportAnnualReturnsExcel",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("XSRF-TOKEN",
                        $('input:hidden[name="__RequestVerificationToken"]').val());
                    xhr.setRequestHeader('inputedLoginParameters', JSON.stringify(inputedLoginParameters));
                    $("#loader").show();
                },
                data: "",
                contentType: false,
                processData: false,
                success: function (response) {
                    $("#loader").hide();
                    $('#btnSearch').removeAttr('disabled');
                    console.log(response);
                    var returnMsgId = response.statusId;
                    var returnMsg = response.statusMessage;
                    console.log(returnMsg);
                    var responseObject = response.recordResponseObject;
                    if (response.length === 0)
                        ShowMessagePopup("Oops!", returnMsg, "error");
                    else if (response.length !== 0 && returnMsgId < 1) {
                        ShowMessagePopup("Oops!", returnMsg, "error");
                        $('#divPrint').html(responseObject);
                        $("#divPrint").css("color", "red");
                        document.getElementById('divPrint').style.color = 'red';
                    }
                    else {
                        swal({
                            title: "Successful!",
                            text: returnMsg,
                            icon: "success",
                            closeOnClickOutside: false,
                            closeOnEsc: false
                        })
                            .then((willDelete) => {
                                if (willDelete) {
                                    location.reload();
                                } else {
                                    swal("Transaction Successful, Please Reload The Page!", {
                                        icon: "success",
                                        closeOnClickOutside: false,
                                        closeOnEsc: false
                                    });
                                }
                            });
                        //ShowMessagePopup("Successful!", returnMsg, "success");
                        $('#btnRefreshPage').show();
                        //$('#divPrint').html(responseObject);  //Remove later cos rendering effect use dev if compulsory.

                        //$("#btnUpdate").css("display", "block");
                        //var box = bootbox.alert("User has been added successfully.");
                        //box.modal('show');
                        //document.getElementById('editpasshide').style.color = 'hidden';
                        //var theElement = document.getElementById("editpasshide");
                        //theElement.visible == false
                        //document.getElementById("<%=editpasshide.ClientID %>").visibility:hidden;
                    }
                },
                error: function (e) {
                    $("#loader").hide();
                    ShowMessagePopup("UnSuccessful!", e.responseText, "error");
                    //$('#divPrint').html(e.responseText);
                },
                complete: function () {
                    $("#loader").hide();
                }
            });
        };

        $('#btnRefreshPage').on('click', function () {
            location.reload();
        });

    }

    tSmart.gridController = tSmart.gridController || new tSmart.GridController;
    tSmart.gridController.initPage();
    //tSmart.gridController.searchPanel();
});




