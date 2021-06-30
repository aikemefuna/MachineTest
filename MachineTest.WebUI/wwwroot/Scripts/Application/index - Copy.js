$(function () {
    tSmart.GridController = function () {
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2
        })

        const formatterWithNaira = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        })
        var that = this;
        //var serviceUserInfo = taxSmart.pageSettings.serverVars.sui;
        //var baseUrl = taxSmart.pageSettings.serverVars.burl;
        //var merchantCode = taxSmart.pageSettings.serverVars.mc;
        //var nurl = taxSmart.pageSettings.serverVars.nurl;

        var dataGrid, gridOptions,
            selectBoxYear, selectBoxYearValue, yearListDataLoader, merchantCode, merchantId, domainName, baseUrl, PAYECount, DACount, allTccHistoryBySelectedDateRemoteDataLoaders,
            allCompaniesBySelectedDateRemoteDataLoaders, allIndividualPAYEBySelectedDateRemoteDataLoaders, allIndividualDABySelectedDateRemoteDataLoaders;

        domainName = document.querySelector("#domainNameId").value;
        //console.log(domainName);
        baseUrl = domainName;
        merchantCode = document.querySelector("#merchantCode").value;
        merchantId = document.querySelector("#merchantId").value;

        var startDate, endDate, startDateValue, endDateValue;

        this.searchPanel = function () {

            startDate = $("#startDate").dxDateBox({
                value: new Date(),
                stylingMode: "outlined",
                displayFormat: "dd-MM-yyyy",
                onValueChanged: function (e) {
                    endDate.option("min", e.value);
                },
                buttons: [{
                    name: "today",
                    location: "before",

                    options: {
                        text: "Today",
                        onClick: function () {
                            startDate.option("value", new Date());
                        }
                    }
                }, {
                    name: "prevDate",
                    location: "before",
                    options: {
                        icon: "spinprev",
                        stylingMode: "text",
                        onClick: function () {
                            var currentDate = startDate.option("value");
                            startDate.option("value", currentDate);
                        }
                    }
                }, {
                    name: "nextDate",
                    location: "after",
                    options: {
                        icon: "spinnext",
                        stylingMode: "text",
                        onClick: function () {
                            var currentDate = startDate.option("value");
                            startDate.option("value", currentDate);
                        }
                    }
                }, "dropDown"]
            }).dxDateBox("instance");

            endDate = $("#endDate").dxDateBox({
                value: new Date(),
                stylingMode: "outlined",
                displayFormat: "dd-MM-yyyy",
                onValueChanged: function (e) {
                    startDate.option("max", e.value);
                },
                buttons: [{
                    name: "today",
                    location: "before",

                    options: {
                        text: "Today",
                        onClick: function () {
                            endDate.option("value", new Date());
                        }
                    }
                }, {
                    name: "prevDate",
                    location: "before",
                    options: {
                        icon: "spinprev",
                        stylingMode: "text",
                        onClick: function () {
                            var currentDate = endDate.option("value");
                            endDate.option("value", currentDate);
                        }
                    }
                }, {
                    name: "nextDate",
                    location: "after",
                    options: {
                        icon: "spinnext",
                        stylingMode: "text",
                        onClick: function () {
                            var currentDate = endDate.option("value");
                            endDate.option("value", currentDate);
                        }
                    }
                }, "dropDown"]
            }).dxDateBox("instance");

            $('#assessmentTotalAssCount').text(0);
            $('#assessmentTotalAssAmt').text(0.00);
            $('#paymentsTotalAssCount').text(0);
            $('#paymentsTotalAssAmt').text(0.00);
            $('#tccDATotalCount').text(0);
            $('#tccPAYETotalCount').text(0);
            $('#tccTotalCount').text(0);
            $('#companiesTotalCount').text(0);
            $('#individualPAYETotalCount').text(0.00);
            $('#individualTotalCount').text(0);
            $('#companiesandindividualTotalCount').text(0.00);

            $('#btnSearchRecordByDateRange').hide();
            $('#divDetails').hide();
            $('#goBackId').hide();
            $('#divTotalDetailsByAssRefNo').hide();
            $('#btnSearchRecordByDateRange').click(function () {
                startDateValue = startDate.option("value");
                endDateValue = endDate.option("value");
                console.log(startDateValue);
                console.log(endDateValue);
                if (!startDateValue || !endDateValue) {
                    ShowMessagePopup("Date Required", "Payment Date Range must be selected to continue", "warning");
                    return false;
                }
                that.confirmTransactionSearch(startDateValue, endDateValue);
                $('#divDetails').hide();
                $('#platformNameSelected').hide();
            });

            $('#assessmentTotalAssAmtView').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                that.showAssessmentDetails(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            $('#paymentsTotalAssAmtView').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                that.showTotalPaymentsRemittedByDateRange(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            //Da TCC
            $('#tccDATotalCount').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                that.showDATccDetailsListBySelectedDate(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            //PAYE TCC
            $('#tccPAYETotalCount').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                that.showPAYETccDetailsListBySelectedDate(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            //Total TCC
            $('#viewTccDetails').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                //that.showAllTccDetailsListBySelectedDate(startDateValue, endDateValue);
                that.showAllSummaryTccDetailsListBySelectedDate(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            //starts
            //Payer Information DA
            $('#individualTotalCount').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                that.showIndividualDADetailsListBySelectedDate(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            //Payer Information PAYE
            $('#individualPAYETotalCount').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                that.showIndividualPAYEDetailsListBySelectedDate(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            //Payer Information Organization
            $('#companiesTotalCount').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                that.showCompaniesDetailsListBySelectedDate(startDateValue, endDateValue);
                $('#platformNameSelected').show();
            });

            //Total Payer Information 
            $('#companiesandindividualTotalCount').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                //that.showAllTccDetailsListBySelectedDate(startDateValue, endDateValue);
                //$('#platformNameSelected').show();
            });

            $('#goBackId').click(function () {
                var startDateValue = startDate.option("value");
                var endDateValue = endDate.option("value");
                var hfSelectedView = $('#hfSelectedView').val();
                if (hfSelectedView === "AssessmentGroupedByAgency") {
                    that.showAssessmentDetails(startDateValue, endDateValue);
                }
                if (hfSelectedView === "AssessmentByAgency") {
                    that.showAssessmentDetailsGroupedByAgencyGoBack();
                }
            });

            //var millisecondsInDay = 24 * 60 * 60 * 1000;


            //startDate = $("#startDate").dxDateBox({
            //    value: new Date(),
            //    displayFormat: "dd-MM-yyyy",
            //    cancelButtonText: "Cancel",
            //    onValueChanged: function (e) {
            //        endDate.option("min", e.value);
            //    },
            //}).dxDateBox("instance");

            //endDate = $("#endDate").dxDateBox({
            //    value: new Date(),
            //    displayFormat: "dd-MM-yyyy",
            //    cancelButtonText: "Cancel",
            //    onValueChanged: function (e) {
            //        startDate.option("max", e.value);
            //    }
            //}).dxDateBox("instance");

            that.displayDefaultDashboard();
        };

        this.initPage = function () {
            _.templateSettings = {
                interpolate: /\{%=(.+?)%\}/g,
                escape: /\{%-(.+?)%\}/g,
                evaluate: /\{%(.+?)%\}/g
            };
            DevExpress.ui.setTemplateEngine("underscore");

            var substr = [1, 2, 3, 4];
            $.each(substr, function (index, val) {
                console.log(index, val)
            });

            var myObjs = { firstName: "skyfoot" };
            $.each(myObjs, function (index, val) {
                if (val === "skyfoot") {
                    console.log("Congrats");
                }
                //console.log(index, val);
            });

            var myObj = { firstName: "skyfoot" };
            $.each(myObj, function (propName, propVal) {
                console.log(propName, propVal);
            });

        };

        this.formatNumber = function (number) {
            return Globalize.formatNumber(number, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        this.displayDefaultDashboard = function () {

            $('#assessmentTotalAssCount').text(0);
            $('#assessmentTotalAssAmt').text("0.00");
            $('#paymentsTotalAssCount').text(0);
            $('#paymentsTotalAssAmt').text("0.00");
            $('#tccDATotalCount').text(0);
            $('#tccPAYETotalCount').text(0);
            $('#tccTotalCount').text(0);
            $('#companiesTotalCount').text(0);
            $('#individualPAYETotalCount').text(0.00);
            $('#individualTotalCount').text(0);
            $('#companiesandindividualTotalCount').text(0.00);

            //Assessments
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/v1.0/Assessment/getAssessmentSummary/" + merchantCode,
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
                    console.log(response);
                    //console.log(response.recordResponseObject.recordCount);
                    var recordResponseObject = response.data;
                    if (recordResponseObject !== null) {
                        var countValue = response.data.recordCount;
                        var amountValue = formatter.format(response.data.recordTotal);
                        $('#assessmentTotalAssAmt').text(amountValue);
                        $('#assessmentTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                    }

                    $('#loading').hide();
                }
            });

            //Tcc
            
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/TCC/getTccByMerchantCode/" + merchantId,
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    //xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                    //xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
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
                        var countValue = response.recordResponseObject.daRecordResponseObject.recordCount;
                        console.log(countValue);
                        $('#tccTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#loading').hide();
                        return;
                    }

                    //if (recordResponseObject !== null) {
                    //    var countValue = response.recordResponseObject.daRecordResponseObject.recordCount;
                    //    var countPAYEValue = response.recordResponseObject.payeRecordResponseObject.recordCount;
                    //    var amountValue = formatter.format(response.recordResponseObject.recordTotal);
                    //    //$('#tccTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                    //    //$('#tccTotalAssAmt').text(amountValue);
                    //    $('#tccDATotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                    //    $('#tccPAYETotalCount').text(Math.ceil(countPAYEValue).toLocaleString('en'));
                    //    var DACount = countValue;
                    //    var PAYECount = countPAYEValue;
                    //    var totalCount = DACount + PAYECount;
                    //    console.log(DACount);
                    //    console.log(PAYECount);
                    //    console.log(totalCount);
                    //    $('#tccTotalCount').text(Math.ceil(totalCount).toLocaleString('en'));
                    //    $('#loading').hide();
                    //    return;
                    //}

                    $('#loading').hide();
                }
            });

            //Payments
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/Collection/getCollectionByMerchantCode/" + merchantCode,
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
                    $('#btnSearchRecordByDateRange').show();
                    $('#loading').hide();
                },
                success: function (response) {
                    //console.log(response);
                    //console.log(response.recordResponseObject.recordCount);
                    //var countValue = parseInt(response.recordResponseObject.recordCount); 

                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = response.recordResponseObject.recordCount;
                        var amountValue = formatter.format(response.recordResponseObject.recordTotal);
                        $('#paymentsTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#paymentsTotalAssAmt').text(amountValue);
                    }

                    //$('#paymentsTotalAssCount').text(response.recordResponseObject.recordCount);
                    //$.each(response.recordResponseObject, function (propName, propVal) {
                    //    console.log(propName, propVal);
                    //    console.log(propName);
                    //    if (propName === "recordCount") {
                    //        console.log(propVal);
                    //    }
                    //});
                    //ShowMessagePopup("Successful", response.statusMessage, "success");
                    //if (!response.Status) {
                    //    ShowPopup("Not Successful", response.StatusMessage, "error");
                    //    DevExpress.ui.notify(response.StatusMessage, "error", 4000);
                    //} else {
                    //    $("#itemTarget").empty();
                    //    ShowMessagePopup("Successful", response.StatusMessage, "success");
                    //    DevExpress.ui.notify(response.StatusMessage, "success", 4000);
                    //    that.switchPayerType();
                    //    dataGrid.option('dataSource', []);
                    //    $('#txtPaymentRef').val('');
                    //    //dataGrid.refresh();
                    //}

                    $('#btnSearchRecordByDateRange').show();
                    $('#loading').hide();
                }
            });

            //Registration
            $('#companiesTotalCount').text(0);
            $('#individualPAYETotalCount').text(0);
            $('#individualTotalCount').text(0);
            $('#companiesandindividualTotalCount').text(0);
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/PayerInformation/getPayerInfoByMerchantCode",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    //xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                    //xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                    xhr.setRequestHeader('MerchantCode', JSON.stringify(merchantCode));
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
                        var countValue = 0, countPAYEValue = 0, countOrgValue = 0;
                        if (response.recordResponseObject.individualRecordResponseObject !== null) {
                            countValue = response.recordResponseObject.individualRecordResponseObject.recordCount;
                        }

                        if (response.recordResponseObject.individualPAYERecordResponseObject !== null) {
                            countPAYEValue = response.recordResponseObject.individualPAYERecordResponseObject.recordCount;
                        }

                        if (response.recordResponseObject.organizationRecordResponseObject !== null) {
                            countOrgValue = response.recordResponseObject.organizationRecordResponseObject.recordCount;
                        }

                        $('#individualTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#individualPAYETotalCount').text(Math.ceil(countPAYEValue).toLocaleString('en'));
                        $('#companiesTotalCount').text(Math.ceil(countOrgValue).toLocaleString('en'));
                        var DACount = countValue;
                        var PAYECount = countPAYEValue;
                        var ORGCount = countPAYEValue;
                        var totalCount = DACount + PAYECount + ORGCount;
                        console.log(DACount);
                        console.log(PAYECount);
                        console.log(totalCount);
                        $('#companiesandindividualTotalCount').text(Math.ceil(totalCount).toLocaleString('en'));
                        $('#loading').hide();
                        return;
                    }

                    $('#loading').hide();
                }
            });

        }

        this.confirmTransactionSearch = function (startDateValue, endDateValue) {

            var dateFormat = "dd-MM-yyyy";
            var finaldateFormat = "yyyy-MM-dd";
            console.log(startDateValue.formatDate(dateFormat));
            console.log(endDateValue.formatDate(dateFormat));
            console.log(startDateValue.formatDate(finaldateFormat));
            console.log(endDateValue.formatDate(finaldateFormat));
            $('#platformNameSelected').hide();
            var msg = "You are about to search record between " + startDateValue.formatDate(dateFormat) + " and " + endDateValue.formatDate(dateFormat) + ". Do you want to continue?";
            swal({
                title: "Are you sure?",
                text: msg,
                icon: "warning",
                //buttons: true,
                buttons: [
                    'No, cancel it!',
                    'Yes, I am sure!'
                ],
                closeOnClickOutside: false,
                dangerMode: true
            })
                .then((willDelete) => {
                    if (willDelete) {
                        that.showDashboardBySelectedDates(startDateValue.formatDate(finaldateFormat), endDateValue.formatDate(finaldateFormat));
                        $('#btnSearchRecordByDateRange').hide();
                    } else {
                        //swal("Congrats! Your selected record is still safe!", {
                        //    icon: "success",
                        //    closeOnClickOutside: false,
                        //    closeOnEsc: false
                        //});
                        $('#btnSearchRecordByDateRange').show();
                        DevExpress.ui.notify("Canceled", "error", 2000);
                    }
                });
        };

        this.showDashboardBySelectedDates = function (startDate, endDate) {
            $('#assessmentTotalAssCount').text(0);
            $('#assessmentTotalAssAmt').text("0.00");
            $('#paymentsTotalAssCount').text(0);
            $('#paymentsTotalAssAmt').text("0.00");
            $('#tccDATotalCount').text(0);
            $('#tccPAYETotalCount').text(0);
            $('#tccTotalCount').text(0);
            $('#companiesTotalCount').text(0);
            $('#individualPAYETotalCount').text(0.00);
            $('#individualTotalCount').text(0);
            $('#companiesandindividualTotalCount').text(0.00);

            //Payments
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/Collection/getCollectionByMerchantCode/" + merchantCode,
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                    xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#btnSearchRecordByDateRange').show();
                    $('#loading').hide();
                },
                success: function (response) {
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = response.recordResponseObject.recordCount;
                        var amountValue = formatter.format(response.recordResponseObject.recordTotal);
                        $('#paymentsTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#paymentsTotalAssAmt').text(amountValue);
                        $('#btnSearchRecordByDateRange').show();
                        $('#loading').hide();
                        return;
                    }

                    $('#paymentsTotalAssCount').text("0");
                    $('#paymentsTotalAssAmt').text("0.00");
                    $('#btnSearchRecordByDateRange').show();
                    $('#loading').hide();
                }
            });

            //Assessments
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/v1.0/Assessment/getAssessmentSummary/" + merchantCode,
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                    xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    console.log(response);
                    //console.log(response.recordResponseObject.recordCount);
                    var recordResponseObject = response.data;
                    if (recordResponseObject !== null) {
                        var countValue = response.data.recordCount;
                        var amountValue = formatter.format(response.data.recordTotal);
                        $('#assessmentTotalAssAmt').text(amountValue);
                        $('#assessmentTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#loading').hide();
                        return;
                    }

                    $('#assessmentTotalAssAmt').text("0.00");
                    $('#assessmentTotalAssCount').text(0);
                    $('#loading').hide();
                }
            });

            //Tcc
            $('#tccDATotalCount').text(0);
            $('#tccPAYETotalCount').text(0);
            $('#tccTotalCount').text(0);
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/TCC/getTccByMerchantCode/" + merchantId,
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                    xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                    $('#loading').show();
                },
                error: function (msg) {
                    ShowMessagePopup("Page Error", msg, "error");
                    DevExpress.ui.notify(msg, "error", 4000);
                    $('#loading').hide();
                },
                success: function (response) {
                    //console.log(response);
                    //console.log(response.recordResponseObject.recordCount);
                    var recordResponseObject = response.recordResponseObject;
                    if (recordResponseObject !== null) {
                        var countValue = response.recordResponseObject.daRecordResponseObject.recordCount;
                        var countPAYEValue = response.recordResponseObject.payeRecordResponseObject.recordCount;
                        var amountValue = formatter.format(response.recordResponseObject.recordTotal);
                        //$('#tccTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        //$('#tccTotalAssAmt').text(amountValue);
                        $('#tccDATotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#tccPAYETotalCount').text(Math.ceil(countPAYEValue).toLocaleString('en'));
                        var DACount = countValue;
                        var PAYECount = countPAYEValue;
                        var totalCount = DACount + PAYECount;
                        //console.log(DACount);
                        //console.log(PAYECount);
                        //console.log(totalCount);
                        $('#tccTotalCount').text(Math.ceil(totalCount).toLocaleString('en'));
                        $('#loading').hide();
                        return;
                    }

                    $('#tccDATotalCount').text(0);
                    //$('#tccTotalAssCount').text(0);
                    //$('#tccTotalAssAmt').text("0.00");
                    $('#divDetails').hide();
                }
            });

            //Registration
            $('#companiesTotalCount').text(0);
            $('#individualPAYETotalCount').text(0);
            $('#individualTotalCount').text(0);
            $('#companiesandindividualTotalCount').text(0);
            $.ajax({
                type: "GET",
                url: baseUrl + "/api/PayerInformation/getPayerInfoByMerchantCode",
                data: null,
                dataType: "json",
                contentType: "application/json;char-set=utf-8",
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                    xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                    xhr.setRequestHeader('MerchantCode', JSON.stringify(merchantCode));
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
                        var countValue = 0, countPAYEValue = 0, countOrgValue = 0;
                        if (response.recordResponseObject.individualRecordResponseObject !== null) {
                            countValue = response.recordResponseObject.individualRecordResponseObject.recordCount;
                        }

                        if (response.recordResponseObject.individualPAYERecordResponseObject !== null) {
                            countPAYEValue = response.recordResponseObject.individualPAYERecordResponseObject.recordCount;
                        }

                        if (response.recordResponseObject.organizationRecordResponseObject !== null) {
                            countOrgValue = response.recordResponseObject.organizationRecordResponseObject.recordCount;
                        }
                        //var amountValue = formatter.format(response.recordResponseObject.recordTotal);
                        //$('#tccTotalAssCount').text(Math.ceil(countValue).toLocaleString('en'));
                        //$('#tccTotalAssAmt').text(amountValue);
                        $('#individualTotalCount').text(Math.ceil(countValue).toLocaleString('en'));
                        $('#individualPAYETotalCount').text(Math.ceil(countPAYEValue).toLocaleString('en'));
                        $('#companiesTotalCount').text(Math.ceil(countOrgValue).toLocaleString('en'));
                        var DACount = countValue;
                        var PAYECount = countPAYEValue;
                        var ORGCount = countPAYEValue;
                        var totalCount = DACount + PAYECount + ORGCount;
                        console.log(DACount);
                        console.log(PAYECount);
                        console.log(totalCount);
                        $('#companiesandindividualTotalCount').text(Math.ceil(totalCount).toLocaleString('en'));
                        $('#loading').hide();
                        return;
                    }

                    $('#loading').hide();
                }
            });

        }

        this.showAssessmentDetails = function (startDate, endDate) {
            $('#divDetails').show();
            $('#platformNameSelected').text("Details of Assessment By Platform Name");
            $.ajaxSetup({
                cache: false
            });

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "platFormName",
                loadUrl: baseUrl + "/api/v1.0/Assessment/getAssessmentSummaryGroupedByPlatform/" + merchantCode,
                loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        // $('#loading').show();
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
                        e.fileName = 'AssessmentSummaryByPlatformList' + '(' + now.toISOString() + ')';
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
                            dataField: "platFormName",
                            caption: "PlatForm Name",
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "platFormDescription",
                            caption: "PlatForm Description",
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            //width: 210,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "recordTotal",
                            caption: "Total Amount",
                            dataType: "number",
                            cssClass: 'font-bold',
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "recordCount",
                            caption: "Count (s)",
                            dataType: "number",
                            alignment: "left",
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
                                            that.showAssessmentDetailsGroupedByAgency(options.data);
                                            $('#divDetails').show();
                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        },
                        {
                            dataField: "platFormName",
                            caption: "Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            width: 210,
                            visible: false,
                            cellTemplate: function (container, options) {
                                var tccNo = options.data.platFormName;
                                //var refNo = options.data.taxPayerReferenceNumber;
                                //var formedString = options.data.itemKey; //merchantCodes + ">" + tccNo + ">" + refNo;
                                //var padding = "'='";
                                ////Encode the String
                                //var itemKeyEncodedString = Base64.encode(formedString);
                                //var itemKeyEncodedStringWith = Base64.encode(formedString).trim(padding).replace('+', '-').replace('/', '_');
                                //var finalUrls = "http://ogunstatebir.com/TaxSmartNew/TaxClearance/TccViewer/" + itemKeyEncodedString + "/" + refNo;
                                var finalUrl = "http://ogunstatebir.com/TaxSmartNew/TaxClearance/TccViewer/"; //"" + taxSmartTccViewerUr + " " + formedString;
                                //console.log(finalUrl);
                                //console.log(itemKeyEncodedString);
                                //console.log(itemKeyEncodedStringWith);

                                return $("<a>", { "href": finalUrl, "target": "_blank" }).text('View').addClass("btn btn-danger animated lightSpeedIn btn-push no-margin rounded");
                            }
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "platFormName",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "recordTotal",
                                summaryType: "sum",
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
        }

        this.showAssessmentDetailsGroupedByAgency = function (sentData) {
            $('#divDetails').show();
            $('#goBackId').show();
            $.ajaxSetup({
                cache: false
            });

            var startDateValue = startDate.option("value");
            var endDateValue = endDate.option("value");

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "agencyCode",
                loadUrl: baseUrl + "/api/v1.0/Assessment/getAssessmentSummaryGroupedByAgency/" + merchantCode,
                //loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDateValue));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDateValue));
                        xhr.setRequestHeader('PlatformParameters', JSON.stringify(sentData.platFormName));
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
                    "export": {
                        enabled: true,
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'AssessmentSummaryByAgencyNameList' + '(' + now.toISOString() + ')';
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
                            dataField: "platFormName",
                            caption: "Agency Name",
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            width: 500,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "recordTotal",
                            caption: "Total Amount",
                            dataType: "number",
                            cssClass: 'font-bold',
                            width: 210,
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "recordCount",
                            caption: "Count (s)",
                            dataType: "number",
                            alignment: "left",
                            width: 210,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "agencyCode",
                            caption: "Agency Code",
                            visible: false,
                            cssClass: 'font-bold'
                        },
                        {
                            caption: "Details",
                            width: 350,
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
                                            that.showAssessmentDetailsByAgency(options.data);
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
                                column: "platFormName",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "recordTotal",
                                summaryType: "sum",
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
            $('#platformNameSelected').text("Details of " + sentData.platFormDescription + " Assessment(s) By Agency");
            $('#hfSelectedView').val("AssessmentGroupedByAgency");
            $('#hfSelectedPlatformName').val(sentData.platFormName);
            $('#hfselectedPlatformDescription').val(sentData.platFormDescription);
        };

        this.showAssessmentDetailsGroupedByAgencyGoBack = function () {
            $('#divDetails').show();
            $('#goBackId').show();
            $.ajaxSetup({
                cache: false
            });

            var startDateValue = startDate.option("value");
            var endDateValue = endDate.option("value");
            var selectedPlatformName = $('#hfSelectedPlatformName').val();
            var selectedPlatformDescription = $('#hfselectedPlatformDescription').val();

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "agencyCode",
                loadUrl: baseUrl + "/api/v1.0/Assessment/getAssessmentSummaryGroupedByAgency/" + merchantCode,
                //loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDateValue));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDateValue));
                        xhr.setRequestHeader('PlatformParameters', JSON.stringify(selectedPlatformName));
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
                    "export": {
                        enabled: true,
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'AssessmentSummaryByAgencyNameList' + '(' + now.toISOString() + ')';
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
                            dataField: "platFormName",
                            caption: "Agency Name",
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            width: 500,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "recordTotal",
                            caption: "Total Amount",
                            dataType: "number",
                            cssClass: 'font-bold',
                            width: 210,
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "recordCount",
                            caption: "Count (s)",
                            dataType: "number",
                            alignment: "left",
                            width: 210,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "agencyCode",
                            caption: "Agency Code",
                            visible: false,
                            cssClass: 'font-bold'
                        },
                        {
                            caption: "Details",
                            width: 350,
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
                                            that.showAssessmentDetailsByAgency(options.data);
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
                                column: "platFormName",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "recordTotal",
                                summaryType: "sum",
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
            $('#platformNameSelected').text("Details of " + selectedPlatformDescription + " Assessment(s) By Agency");
            $('#hfSelectedView').val("AssessmentGroupedByAgency");
            $('#hfSelectedPlatformName').val(selectedPlatformName);
            //$('#hfSelectedPlatformName').val(selectedPlatformName);
        };

        this.showAssessmentDetailsByAgency = function (sentData) {
            $('#divDetails').show();
            $('#goBackId').show();
            $.ajaxSetup({
                cache: false
            });

            var startDateValue = startDate.option("value");
            var endDateValue = endDate.option("value");
            var hfSelectedPlatformName = $('#hfSelectedPlatformName').val();

            var remoteDataLoader = DevExpress.data.AspNet.createStore({
                key: "agencyCode",
                loadUrl: baseUrl + "/api/v1.0/Assessment/getAssByMerchantCodeAndAgencyCode/" + merchantCode,
                //loadParams: { startDate: startDate, endDate: endDate },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDateValue));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDateValue));
                        xhr.setRequestHeader('AgencyCodeParameters', JSON.stringify(sentData.agencyCode));
                        xhr.setRequestHeader('PlatformParameters', JSON.stringify(hfSelectedPlatformName));
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
                    "export": {
                        enabled: true,
                        allowExportSelectedData: true
                    },
                    onExporting: function (e) {
                        var now = new Date();
                        e.fileName = 'ListOfAssessmentByAgency' + '(' + now.toISOString() + ')';
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
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            //width: 500,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "agentUtin",
                            caption: "Payer ID",
                            wordWrapEnabled: true,
                            sortIndex: 1,
                            //width: 500,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "address",
                            wordWrapEnabled: true,
                            caption: "Address",
                            visible: false
                            //width: 500
                        },
                        {
                            dataField: "assessmentRefNo",
                            caption: "Assessment Ref. No.",
                            wordWrapEnabled: true,
                            sortIndex: 2,
                            //width: 500,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "narration",
                            wordWrapEnabled: true,
                            caption: "Narration",
                            visible: false
                            //width: 500
                        },
                        {
                            dataField: "revenueCode",
                            wordWrapEnabled: true,
                            caption: "Revenue Code",
                            visible: false
                            //width: 500
                        },
                        {
                            dataField: "revenueName",
                            caption: "Revenue Name",
                            wordWrapEnabled: true,
                            visible: false
                            //width: 500
                        },
                        {
                            dataField: "totalAmount",
                            caption: "Total Amount",
                            dataType: "number",
                            cssClass: 'font-bold',
                            width: 180,
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            caption: "Details",
                            width: 140,
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
                                            ShowMessagePopup("Page Response", "Assessment Details Coming Soon", "success");
                                            //that.showAssessmentDetailsByAgency(options.data);

                                        }
                                    }
                                ).appendTo(container)
                            },
                            visible: true
                        },
                        {
                            dataField: "assessmentRefNo",
                            caption: "Payment Details",
                            alignment: "center",
                            wordWrapEnabled: true,
                            width: 140,
                            visible: true,
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            console.log(options.data);
                                            that.showPaymentByAssRefNo(options.data); //Connect to collection to get payment details
                                        }
                                    }
                                ).appendTo(container)
                            },
                        }

                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "assessmentRefNo",
                                summaryType: "count",
                                displayFormat: "Total count: {0}"
                            },
                            {
                                column: "totalAmount",
                                summaryType: "sum",
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
            $('#platformNameSelected').text("Details of " + sentData.platFormName + " Assessment(s)");
            $('#hfSelectedView').val("AssessmentByAgency");
        };

        this.showDATccDetailsListBySelectedDate = function () {
            $.ajaxSetup({
                cache: false
            });

            var startDateValue = startDate.option("value");
            var endDateValue = endDate.option("value");

            startDate = startDateValue;
            endDate = endDateValue;

            var dateFormat = "dd-MM-yyyy";

            allTccHistoryBySelectedDateRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "tccNo",
                loadUrl: baseUrl + "/api/TCC/getTccDetailsByMerchantCode",
                loadParams: { taxAgentRefNo: null, payerType: "DA", merchantId: merchantId },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        $('#divDetails').show();
                    };

                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allTccHistoryBySelectedDateRemoteDataLoaders,
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
                        e.fileName = 'AllDATccDetailsList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "payerNames",
                            caption: "Payer Name",
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold',
                            //calculateCellValue: function (data) {
                            //    return [data.lastname,
                            //    data.firstname, data.othernames]
                            //        .join(" ");
                            //}
                        },
                        {
                            dataField: "tccNo",
                            caption: "Tcc No",
                            width: 110,
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "utin",
                            wordWrapEnabled: true,
                            caption: "TIN",
                            sortIndex: 2,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "email",
                            wordWrapEnabled: true,
                            caption: "Email",
                            sortIndex: 3,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxPayerReferenceNumber",
                            caption: "Tax Payer Reference Number",
                            alignment: "left",
                            visible: false,
                        },
                        {
                            dataField: "businessName",
                            caption: "Organisation/Business Name",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold',
                        },
                        {
                            dataField: "taxYear",
                            caption: "Tax Year",
                            alignment: "left",
                            visible: true
                        },
                        {
                            dataField: "issuedDate",
                            caption: "Issued Date",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        },
                        {
                            dataField: "expiryDate",
                            caption: "Expiry Date",
                            dataType: "date",
                            wordWrapEnabled: true,
                            format: "dd-MMM-yyyy"
                        },
                        {
                            dataField: "expiryDate",
                            caption: "Expired",
                            dataType: "date",
                            wordWrapEnabled: true,
                            format: "dd-MMM-yyyy",
                            visible: true,
                            cellTemplate: function (container, options) {
                                var now = new Date();
                                var dateFormat = "yyyy";
                                var currentYear = now.formatDate(dateFormat);
                                var convertedYear = options.value.formatDate(dateFormat);
                                if (currentYear > convertedYear) {
                                    return $("<div/>")
                                        .addClass("badge badge-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Expired")
                                        );
                                }
                                else if (currentYear <= convertedYear) {
                                    return $("<div/>")
                                        .addClass("badge badge-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Active")
                                        );
                                }
                            }
                        },
                        {
                            dataField: "isApproved",
                            caption: "Status",
                            sortIndex: 5,
                            sortOrder: 'asc',
                            dataType: "boolean",
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                if (options.value === true) {

                                    return $("<div/>")
                                        .addClass("badge badge-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Approved")
                                        );
                                }
                                else if (options.value === false) {
                                    return $("<div/>")
                                        .addClass("badge badge-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Disapproved")
                                        );
                                }
                                else {
                                    return $("<div/>")
                                        .addClass("badge badge-warning")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Awaiting Approval")
                                        );
                                }

                            }
                        },
                        {
                            caption: "Tax Details",
                            //width: 100,
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
                                            that.showTaxDetailsPopUp(options.data);
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
                                column: "payerNames",
                                summaryType: "count",
                                displayFormat: "Total count: {0} Tcc Issued"
                            }
                            //,
                            //{
                            //    column: "totalAmount",
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
                };
            $('#loading').hide();
            $('#goBackId').hide();
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#platformNameSelected').text("Details of Self Employed Tax Clearance Certificates Issued Between " + startDate.formatDate(dateFormat) + " to " + endDate.formatDate(dateFormat) + " ");
        }

        this.showPAYETccDetailsListBySelectedDate = function () {
            $.ajaxSetup({
                cache: false
            });

            var startDateValue = startDate.option("value");
            var endDateValue = endDate.option("value");

            startDate = startDateValue;
            endDate = endDateValue;

            var dateFormat = "dd-MM-yyyy";

            allTccHistoryBySelectedDateRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "tccNo",
                loadUrl: baseUrl + "/api/TCC/getTccDetailsByMerchantCode",
                loadParams: { taxAgentRefNo: null, payerType: "PA", merchantId: merchantId },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        $('#divDetails').show();
                    };

                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allTccHistoryBySelectedDateRemoteDataLoaders,
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
                        e.fileName = 'AllPAYETccDetailsList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "payerNames",
                            caption: "Payer Name",
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "tccNo",
                            caption: "Tcc No",
                            width: 110,
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "utin",
                            wordWrapEnabled: true,
                            caption: "TIN",
                            sortIndex: 2,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "email",
                            wordWrapEnabled: true,
                            caption: "Email",
                            sortIndex: 3,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxPayerReferenceNumber",
                            caption: "Tax Payer Reference Number",
                            alignment: "left",
                            visible: false,
                        },
                        {
                            dataField: "businessName",
                            caption: "Organisation/Business Name",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold',
                        },
                        {
                            dataField: "taxYear",
                            caption: "Tax Year",
                            alignment: "left",
                            visible: true
                        },
                        {
                            dataField: "issuedDate",
                            caption: "Issued Date",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        },
                        {
                            dataField: "expiryDate",
                            caption: "Expiry Date",
                            dataType: "date",
                            wordWrapEnabled: true,
                            format: "dd-MMM-yyyy"
                        },
                        {
                            dataField: "expiryDate",
                            caption: "Expired",
                            dataType: "date",
                            wordWrapEnabled: true,
                            format: "dd-MMM-yyyy",
                            visible: true,
                            cellTemplate: function (container, options) {
                                var now = new Date();
                                var dateFormat = "yyyy";
                                var currentYear = now.formatDate(dateFormat);
                                var convertedYear = options.value.formatDate(dateFormat);
                                if (currentYear > convertedYear) {
                                    return $("<div/>")
                                        .addClass("badge badge-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Expired")
                                        );
                                }
                                else if (currentYear <= convertedYear) {
                                    return $("<div/>")
                                        .addClass("badge badge-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Active")
                                        );
                                }
                            }
                        },
                        {
                            dataField: "isApproved",
                            caption: "Status",
                            sortIndex: 5,
                            sortOrder: 'asc',
                            dataType: "boolean",
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                if (options.value === true) {

                                    return $("<div/>")
                                        .addClass("badge badge-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Approved")
                                        );
                                }
                                else if (options.value === false) {
                                    return $("<div/>")
                                        .addClass("badge badge-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Disapproved")
                                        );
                                }
                                else {
                                    return $("<div/>")
                                        .addClass("badge badge-warning")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Awaiting Approval")
                                        );
                                }

                            }
                        },
                        {
                            caption: "Tax Details",
                            //width: 100,
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
                                            that.showTaxDetailsPopUp(options.data);
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
                                column: "payerNames",
                                summaryType: "count",
                                displayFormat: "Total count: {0} Tcc Issued"
                            }
                            //,
                            //{
                            //    column: "totalAmount",
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
                };
            $('#loading').hide();
            $('#goBackId').hide();
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#platformNameSelected').text("Details of Employee Tax Clearance Certificates Issued Between " + startDate.formatDate(dateFormat) + " to " + endDate.formatDate(dateFormat) + " ");
        }

        this.showAllTccDetailsListBySelectedDate = function (startDate, endDate) {
            $.ajaxSetup({
                cache: false
            });

            var dateFormat = "dd-MM-yyyy";

            allTccHistoryBySelectedDateRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "tccNo",
                loadUrl: baseUrl + "/api/TCC/getTccDetailsByMerchantCode",
                loadParams: { taxAgentRefNo: null, payerType: "ALL", merchantId: merchantId },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        $('#divDetails').show();
                    };

                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allTccHistoryBySelectedDateRemoteDataLoaders,
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
                        e.fileName = 'AllTccDetailsList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "payerNames",
                            caption: "Payer Name",
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "tccNo",
                            caption: "Tcc No",
                            width: 110,
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "utin",
                            wordWrapEnabled: true,
                            caption: "TIN",
                            sortIndex: 2,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "email",
                            wordWrapEnabled: true,
                            caption: "Email",
                            sortIndex: 3,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "taxPayerReferenceNumber",
                            caption: "Tax Payer Reference Number",
                            alignment: "left",
                            visible: false,
                        },
                        {
                            dataField: "businessName",
                            caption: "Organisation/Business Name",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold',
                        },
                        {
                            dataField: "taxYear",
                            caption: "Tax Year",
                            alignment: "left",
                            visible: true
                        },
                        {
                            dataField: "issuedDate",
                            caption: "Issued Date",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        },
                        {
                            dataField: "expiryDate",
                            caption: "Expiry Date",
                            dataType: "date",
                            wordWrapEnabled: true,
                            format: "dd-MMM-yyyy"
                        },
                        {
                            dataField: "expiryDate",
                            caption: "Expired",
                            dataType: "date",
                            wordWrapEnabled: true,
                            format: "dd-MMM-yyyy",
                            visible: true,
                            cellTemplate: function (container, options) {
                                var now = new Date();
                                var dateFormat = "yyyy";
                                var currentYear = now.formatDate(dateFormat);
                                var convertedYear = options.value.formatDate(dateFormat);
                                if (currentYear > convertedYear) {
                                    return $("<div/>")
                                        .addClass("badge badge-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Expired")
                                        );
                                }
                                else if (currentYear <= convertedYear) {
                                    return $("<div/>")
                                        .addClass("badge badge-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Active")
                                        );
                                }
                            }
                        },
                        {
                            dataField: "isApproved",
                            caption: "Status",
                            sortIndex: 5,
                            sortOrder: 'asc',
                            dataType: "boolean",
                            alignment: "center",
                            wordWrapEnabled: true,
                            cellTemplate: function (container, options) {
                                if (options.value === true) {

                                    return $("<div/>")
                                        .addClass("badge badge-success")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Approved")
                                        );
                                }
                                else if (options.value === false) {
                                    return $("<div/>")
                                        .addClass("badge badge-danger")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Disapproved")
                                        );
                                }
                                else {
                                    return $("<div/>")
                                        .addClass("badge badge-warning")
                                        .append(
                                            $("<span />")
                                                .addClass("name")
                                                .text("Awaiting Approval")
                                        );
                                }

                            }
                        },
                        {
                            caption: "Tax Details",
                            //width: 100,
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
                                            that.showTaxDetailsPopUp(options.data);
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
                                column: "payerNames",
                                summaryType: "count",
                                displayFormat: "Total count: {0} Tcc Issued"
                            }
                            //,
                            //{
                            //    column: "totalAmount",
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
                };
            $('#loading').hide();
            $('#goBackId').hide();
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#platformNameSelected').text("Details of All Tax Clearance Certificate Between " + startDate.formatDate(dateFormat) + " to " + endDate.formatDate(dateFormat) + " ");
        }

        this.showAllSummaryTccDetailsListBySelectedDate = function (startDate, endDate) {
            $.ajaxSetup({
                cache: false
            });

            var dateFormat = "dd-MM-yyyy";

            var allTccHistoryDetailsBySelectedDateRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "payerType", 
                loadUrl: baseUrl + "/api/TCC/getTccDetailsByMerchantCode/" + merchantId,
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        $('#divDetails').show();
                    };

                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                dataSource: allTccHistoryDetailsBySelectedDateRemoteDataLoaders,
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
                        e.fileName = 'SummaryTccDetailsList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "payerType",
                            caption: "Payer Type",
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "payerTypeDescription",
                            caption: "Description",
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "recordCount",
                            caption: "Count (s)",
                            dataType: "number",
                            alignment: "left",
                            width: 210,
                            cssClass: 'font-bold'
                        },
                        {
                            caption: "Details",
                            //width: 100,
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
                                            //that.showTaxDetailsPopUp(options.data);
                                            if (options.data.payerType === "DA") {
                                                that.showDATccDetailsListBySelectedDate();
                                                $('#platformNameSelected').show();
                                            }
                                            if (options.data.payerType === "PA") {
                                                that.showPAYETccDetailsListBySelectedDate();
                                                $('#platformNameSelected').show();
                                            }
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
                                column: "payerType",
                                summaryType: "count",
                                displayFormat: "Total count: {0} Tcc Issued"
                            }
                            ,
                            {
                                column: "recordCount",
                                summaryType: "sum",
                                customizeText: function (data) {
                                    //return "Total: " + formatter.format(data.value);
                                    return formatter.format(data.value);
                                }
                            },
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
            $('#loading').hide();
            $('#goBackId').hide();
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#platformNameSelected').text("Details of All Tax Clearance Certificates Issued By Payer Type Between " + startDate.formatDate(dateFormat) + " to " + endDate.formatDate(dateFormat) + " ");
        }

        this.showTaxDetailsPopUp = function (sentData) {
            //http://embed.plnkr.co/s3wNtpffgmVblJmnhLRd/
            //http://bootboxjs.com/examples.html

            var displayDetailsOfSelectedTcc = DevExpress.data.AspNet.createStore({
                key: "tccNo",
                loadUrl: baseUrl + "/api/TCC/getSelectedTccDetailsByTccNo",
                loadParams: { tccNo: sentData.tccNo },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                    };
                    ajaxSettings.global = false;
                }
            });

            //$("#grdContainerIndividualDetails").dxDataGrid({
            //    dataSource: displayDetailsOfSelectedTcc,
            //    columns: ["tccNo", "utin", "businessName", "issuedDate"],
            //    showBorders: true
            //});

            gridOptions = $("#grdContainerIndividualDetails").dxDataGrid({
                dataSource: displayDetailsOfSelectedTcc,
                //showBorders: true,
                //"export": {
                //    enabled: true,
                //    //fileName: "AllTccList",
                //    allowExportSelectedData: true
                //},
                //onExporting: function (e) {
                //    var now = new Date();
                //    e.fileName = 'TccDetails' + '(' + now.toISOString() + ')';
                //},

                hoverStateEnabled: true,
                wordWrapEnabled: true,
                rowAlternationEnabled: true,
                columnAutoWidth: true,
                columns: [
                    {
                        dataField: "year",
                        caption: "Tax Year",
                        alignment: "left",
                        width: 80,
                        wordWrapEnabled: true,
                        cssClass: 'font-bold'
                    },
                    {
                        dataField: "income",
                        caption: "Total Income",
                        alignment: "right",
                        wordWrapEnabled: true,
                        width: 160,
                        cssClass: 'font-bold',
                        dataType: "number",
                        format: { type: 'fixedPoint', precision: 2 }
                    },
                    {
                        dataField: "tax",
                        caption: "Tax Paid",
                        alignment: "right",
                        cssClass: 'font-bold',
                        dataType: "number",
                        width: 150,
                        format: { type: 'fixedPoint', precision: 2 },
                        wordWrapEnabled: true
                    },
                    {
                        dataField: "receiptNo",
                        caption: "Receipt Issued",
                        wordWrapEnabled: true,
                        alignment: "left",
                        cssClass: 'font-bold',
                    },
                ],
            });

            var fullName = sentData.payerNames; //"" + sentData.lastname + " " + sentData.firstname + " " + sentData.othernames + "";
            var title = "TCC DETAILS" + " " + "Of" + " - " + fullName;
            $("#modal-owner-tccDetails .modal-title").html(title);
            $('#lblTccOwnerName').text(fullName);
            $('#lblTccOwnerNo').text(sentData.tccNo);
            $('#lblOwnerUtin').text(sentData.utin);
            $('#lblTccOwnerTaxYear').text(sentData.taxYear);
            //that.EnableModal();
            $('#modal-owner-tccDetails').modal({
                backdrop: 'static'
            });
        };

        this.showTotalPaymentsRemittedByDateRange = function (startDateValue, endDateValue) {
            //$('#divDetails').show();
            $.ajaxSetup({
                cache: false
            });

            var dateFormat = "dd-MM-yyyy";
            var finaldateFormat = "yyyy-MM-dd";

            //var startDateValue = startDate.option("value");
            //var endDateValue = endDate.option("value");

            totalPaymentsRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "payerUtin",
                //loadUrl: "TotalPayments?handler=DisplayTotalPaymentsRemittedAsyn",
                loadUrl: baseUrl + "/api/Collection/getCollectionListByMerchantCode",
                //baseUrl + "/api/v1.0/Assessment/getAssessmentSummaryGroupedByPlatform/" + merchantCode,  //http://localhost/WebApi/api/Collection/getCollectionListByMerchantCode/DTSS
                loadParams: { merchantCode: merchantCode, payerUtin: null },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        //xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDateValue.formatDate(finaldateFormat)));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDateValue.formatDate(finaldateFormat)));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: totalPaymentsRemoteDataLoaders,
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
                        e.fileName = 'TotalPaymentsRemittedList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "payerName",
                            //width: 130,
                            caption: "PayerName",
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "paymentRefNumber",
                            wordWrapEnabled: true,
                            caption: "Payment Ref. Number"
                        },
                        {
                            dataField: "payerUtin",
                            caption: "State Utin",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "amount",
                            caption: "Amount Paid",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "paymentDateFormated",
                            //dataType: "datetime",
                            caption: "Payment Date"
                            //cellTemplate: $("#formatDate")
                        },
                        {
                            dataField: "payerAddress",
                            wordWrapEnabled: true,
                            caption: "Payer Address",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "receiptNo",
                            caption: "ReceiptNo",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "telephoneNumber",
                            caption: "TelephoneNumber",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "depositSlipNumber",
                            caption: "DepositSlipNumber",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "agencyName",
                            caption: "AgencyName",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "revenueName",
                            caption: "RevenueName",
                            cssClass: 'font-bold',
                            visible: false
                        },

                        //{
                        //    dataField: "paymentRefNumber",
                        //    caption: "View Details",
                        //    cssClass: 'font-bold',
                        //    //This allow us to give hyperlink
                        //    cellTemplate: function (container, options) {
                        //        window.$('<a />').addClass('dx-link').addClass('font-bold').addClass('dx-link-edit')
                        //            .text(options.value)
                        //            .on('dxclick', function () {
                        //                var result = window.DevExpress.ui.dialog.confirm("Do you want to view " + options.data.paymentRefNumber + " period details. click Yes otherwise click No?", "Payments Details");
                        //                result.done(function (dialogResult) {
                        //                    if (dialogResult) {
                        //                        //alert('id = ' + options.value + ', utin = ' + options.data.payerUtin, + ', amount = ' + options.data.paymentRefNumber);
                        //                        that.showPaymentDetailsPopUp(options.data);
                        //                    }
                        //                    else
                        //                        window.DevExpress.ui.notify("Payments Details Canceled", "error", 2000);
                        //                });
                        //                return false;

                        //            })
                        //            .appendTo(container);
                        //    }
                        //},
                        {
                            caption: "Details",
                            width: 180,
                            alignment: "center",
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            var result = window.DevExpress.ui.dialog.confirm("Do you want to view " + options.data.paymentRefNumber + " payment details. click Yes otherwise click No?", "Payments Details");
                                            result.done(function (dialogResult) {
                                                if (dialogResult) {
                                                    //alert('id = ' + options.value + ', utin = ' + options.data.payerUtin, + ', amount = ' + options.data.paymentRefNumber);
                                                    that.showPaymentDetailsPopUp(options.data);
                                                }
                                                else
                                                    window.DevExpress.ui.notify("Payments Details Canceled", "error", 2000);
                                            });
                                            return false;
                                            //$("#popup").dxPopup("instance").show();
                                            //$("#txtComments").dxTextArea("instance").option("value", options.data.DisapproveComment);
                                            //console.log(options.data.DisapproveComment);
                                        }
                                    }
                                ).appendTo(container);
                            },
                            visible: true
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "paymentRefNumber",
                                summaryType: "count"
                            },
                            //{
                            //    column: "paymentDate",
                            //    summaryType: "min",
                            //    //dataType: "datetime",
                            //    //valueFormat: "datetime",
                            //    customizeText: function (data) {
                            //        console.log(data.value);
                            //        return "First: " + Globalize.formatDate(data.value, { date: "medium" });
                            //    }
                            //},
                            {
                                column: "amount",
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

            $('#platformNameSelected').text("Details of Collections Between " + startDateValue.formatDate(dateFormat) + " to " + startDateValue.formatDate(dateFormat) + " ");
            $('#hfSelectedView').val("CollectionView");
            $('#goBackId').hide();
            $('#divDetails').show();

            //var selectedPlatformName = $('#hfSelectedPlatformName').val();
            //var selectedPlatformDescription = $('#hfselectedPlatformDescription').val();




            var btnDenormalized = window.$("#btnDenormalized").dxButton({
                icon: "check",
                text: "Denormalize",
                type: "success",
                onClick: function (e) {
                    var msg;
                    var keys = dataGrid.getSelectedRowKeys();
                    if (!keys || keys.length <= 0 || keys.length > 1) {
                        msg = 'No Record Selected. Please select record to continue';
                        window.DevExpress.ui.dialog.alert(msg, 'No Selection');
                        window.DevExpress.ui.notify(msg, "error", 2000);
                        return false;
                    }
                    var result = window.DevExpress.ui.dialog.confirm("You are about to denormalized selected record and its details. Do you want to continue?", "Denormalize Record");
                    result.done(function (dialogResult) {
                        if (dialogResult) {
                            $("#hfSelectedRecord").attr('value', keys);
                            //window.$('#<% =hfSelectedPayer.ClientID %>').attr('value', JSON.stringify(keys));
                            var selectedValue = $("#hfSelectedRecord").val();
                            that.denormalizedRecord(selectedValue);
                            console.log(selectedValue);
                        }
                        else
                            window.DevExpress.ui.notify("Denormalize Record Canceled", "error", 2000);
                    });
                    return false;
                }
            }).dxButton("instance");
        }

        this.showPaymentByAssRefNo = function (sentData) {
            $.ajaxSetup({
                cache: false
            });

            paymentsByAssRefNoRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "payerUtin",
                loadUrl: baseUrl + "/api/Collection/getCollectionDetailsByAssRefNo",
                loadParams: { merchantCode: merchantCode, assRefNo: sentData.assessmentRefNo },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        //xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDateValue.formatDate(finaldateFormat)));
                        //xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDateValue.formatDate(finaldateFormat)));
                    };
                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: paymentsByAssRefNoRemoteDataLoaders,
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
                        e.fileName = 'TotalPaymentsRemittedByAssRefNoList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "payerName",
                            //width: 130,
                            caption: "PayerName",
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "paymentRefNumber",
                            wordWrapEnabled: true,
                            caption: "Payment Ref. Number"
                        },
                        {
                            dataField: "payerUtin",
                            caption: "State Utin",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "amount",
                            caption: "Amount Paid",
                            alignment: "right",
                            cssClass: 'font-bold',
                            dataType: "number",
                            format: { type: 'fixedPoint', precision: 2 }
                        },
                        {
                            dataField: "paymentDateFormated",
                            //dataType: "datetime",
                            caption: "Payment Date"
                            //cellTemplate: $("#formatDate")
                        },
                        {
                            dataField: "payerAddress",
                            wordWrapEnabled: true,
                            caption: "Payer Address",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "receiptNo",
                            caption: "ReceiptNo",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "telephoneNumber",
                            caption: "TelephoneNumber",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "depositSlipNumber",
                            caption: "DepositSlipNumber",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "agencyName",
                            caption: "AgencyName",
                            cssClass: 'font-bold',
                            visible: false
                        },
                        {
                            dataField: "revenueName",
                            caption: "RevenueName",
                            cssClass: 'font-bold',
                            visible: false
                        },

                        //{
                        //    dataField: "paymentRefNumber",
                        //    caption: "View Details",
                        //    cssClass: 'font-bold',
                        //    //This allow us to give hyperlink
                        //    cellTemplate: function (container, options) {
                        //        window.$('<a />').addClass('dx-link').addClass('font-bold').addClass('dx-link-edit')
                        //            .text(options.value)
                        //            .on('dxclick', function () {
                        //                var result = window.DevExpress.ui.dialog.confirm("Do you want to view " + options.data.paymentRefNumber + " period details. click Yes otherwise click No?", "Payments Details");
                        //                result.done(function (dialogResult) {
                        //                    if (dialogResult) {
                        //                        //alert('id = ' + options.value + ', utin = ' + options.data.payerUtin, + ', amount = ' + options.data.paymentRefNumber);
                        //                        that.showPaymentDetailsPopUp(options.data);
                        //                    }
                        //                    else
                        //                        window.DevExpress.ui.notify("Payments Details Canceled", "error", 2000);
                        //                });
                        //                return false;

                        //            })
                        //            .appendTo(container);
                        //    }
                        //},
                        {
                            caption: "Details",
                            width: 180,
                            alignment: "center",
                            cellTemplate: function (container, options) {
                                $('<div />').dxButton(
                                    {
                                        icon: 'icon icon-commenting',
                                        text: 'View',
                                        type: 'danger',
                                        alignment: "center",
                                        onClick: function (args) {
                                            var result = window.DevExpress.ui.dialog.confirm("Do you want to view " + options.data.paymentRefNumber + " payment details. click Yes otherwise click No?", "Payments Details");
                                            result.done(function (dialogResult) {
                                                if (dialogResult) {
                                                    //alert('id = ' + options.value + ', utin = ' + options.data.payerUtin, + ', amount = ' + options.data.paymentRefNumber);
                                                    that.showPaymentDetailsPopUp(options.data);
                                                }
                                                else
                                                    window.DevExpress.ui.notify("Payments Details Canceled", "error", 2000);
                                            });
                                            return false;
                                            //$("#popup").dxPopup("instance").show();
                                            //$("#txtComments").dxTextArea("instance").option("value", options.data.DisapproveComment);
                                            //console.log(options.data.DisapproveComment);
                                        }
                                    }
                                ).appendTo(container);
                            },
                            visible: true
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "paymentRefNumber",
                                summaryType: "count"
                            },
                            //{
                            //    column: "paymentDate",
                            //    summaryType: "min",
                            //    //dataType: "datetime",
                            //    //valueFormat: "datetime",
                            //    customizeText: function (data) {
                            //        console.log(data.value);
                            //        return "First: " + Globalize.formatDate(data.value, { date: "medium" });
                            //    }
                            //},
                            {
                                column: "amount",
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

            dataGrid = $("#divTotalDetailsByAssRefNo").dxDataGrid(gridOptions).dxDataGrid("instance");

            $('#divTotalDetailsByAssRefNo').show();

            var title = "Payment Details" + " " + "Of" + " - " + sentData.payerName + " " + "with Assessment Ref. No. :-" + " - " + sentData.assessmentRefNo;
            var body = "Welcome to ASPSnippets.com";

            $("#paymentdetailByAssRefNo .modal-title").html(title);
            //$("#paymentdetail .modal-body").html(body);
            $("#paymentdetailByAssRefNo").modal("show");

            $('#paymentdetailByAssRefNo').modal({
                backdrop: 'static'
            });
        }

        /* Centering the modal vertically */
        function alignModal() {
            var modalDialog = $(this).find(".modal-dialog");
            modalDialog.css("margin-top", Math.max(0,
                ($(window).height() - modalDialog.height()) / 2));
        }

        $(".modal").on("shown.bs.modal", alignModal);

        /* Resizing the modal according the screen size */
        $(window).on("resize", function () {
            $(".modal:visible").each(alignModal);
        });
        /* Centering the modal vertically */

        this.showPaymentDetailsPopUp = function (sentData) {

            var title = "Payment Details" + " " + "Of" + " - " + sentData.payerName;
            var body = "Welcome to ASPSnippets.com";

            $("#paymentdetail .modal-title").html(title);
            //$("#paymentdetail .modal-body").html(body);
            $("#paymentdetail").modal("show");

            var amountValue = formatter.format(sentData.amount); //Globalize.formatNumber(parseInt(sentData.PeriodAmount), { maximumFractionDigits: 4 });
            console.log(amountValue);
            //$.trim($("[id*=lblpayerName]").val(sentData.payerName));
            //$.trim($("[id*=lblpayerName]").text(sentData.payerName));


            //$('div #lblpayerName').text(sentData.payerName);
            $('div #lblPaymentRefNo').text(sentData.paymentRefNumber);
            $('div #lblAmount').text(amountValue);
            $('div #lblPaymentDate').text(sentData.paymentDateFormated);
            $('div #lblAgencyName').text(sentData.agencyName);
            $('div #lblRevenueName').text(sentData.revenueName);
            $('div #lblReceiptNo').text(sentData.receiptNo);
            $('div #lblDepositNo').text(sentData.depositSlipNumber);
            $('div #lblTelephone').text(sentData.telephoneNumber);
            $('div #lblAddress').text(sentData.payerAddress);

            $('#paymentdetail').modal({
                backdrop: 'static'
            });
        };

        this.showCompaniesDetailsListBySelectedDate = function (startDate, endDate) {
            $.ajaxSetup({
                cache: false
            });

            var dateFormat = "dd-MM-yyyy";

            allCompaniesBySelectedDateRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "taxAgentTIN",
                loadUrl: baseUrl + "/api/PayerInformation/getPayerInfoDetailsByPayerType",
                loadParams: { payerType: "AG" },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        xhr.setRequestHeader('MerchantCode', JSON.stringify(merchantCode));
                        $('#divDetails').show();
                    };

                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allCompaniesBySelectedDateRemoteDataLoaders,
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
                        e.fileName = 'AllCompaniesDetailsList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "organizationName",
                            caption: "Company Name",
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "taxAgentTIN",
                            caption: "S-TIN",
                            wordWrapEnabled: true,
                            //width: 110,
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "phoneNo",
                            wordWrapEnabled: true,
                            caption: "Contact Phone No.",
                            sortIndex: 2,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "email",
                            wordWrapEnabled: true,
                            caption: "Contact Email",
                            sortIndex: 3,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "address",
                            caption: "Address",
                            alignment: "left",
                            wordWrapEnabled: true,
                            visible: true,
                        },
                        {
                            dataField: "revenueOfficeName",
                            caption: "Revenue Office Name",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold',
                        },
                        {
                            dataField: "registrationNumber",
                            caption: "CAC No.",
                            alignment: "left",
                            visible: true
                        },
                        {
                            dataField: "datecreated",
                            caption: "Registration Date",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "taxAgentTIN",
                                summaryType: "count",
                                displayFormat: "Total count: {0}."
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
            $('#loading').hide();
            $('#goBackId').hide();
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#platformNameSelected').text("Details of All Registered Companies Between " + startDate.formatDate(dateFormat) + " to " + endDate.formatDate(dateFormat) + " ");
        }

        this.showIndividualPAYEDetailsListBySelectedDate = function (startDate, endDate) {
            $.ajaxSetup({
                cache: false
            });

            var dateFormat = "dd-MM-yyyy";

            allIndividualPAYEBySelectedDateRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "payerUtin",
                loadUrl: baseUrl + "/api/PayerInformation/getPayerInfoDetailsByPayerType",
                loadParams: { payerType: "PA" },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        xhr.setRequestHeader('MerchantCode', JSON.stringify(merchantCode));
                        $('#divDetails').show();
                    };

                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allIndividualPAYEBySelectedDateRemoteDataLoaders,
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
                        e.fileName = 'AllPAYEPayerDetailsList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "courtesyTitle",
                            caption: "Title",
                            wordWrapEnabled: true,
                            fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "surname",
                            caption: "Surname",
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "otherName",
                            caption: "Other Names",
                            wordWrapEnabled: true,
                            //width: 110,
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "payerUtin",
                            wordWrapEnabled: true,
                            caption: "S-TIN",
                            sortIndex: 2,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "jTBTin",
                            wordWrapEnabled: true,
                            caption: "JTB TIN"
                        },
                        {
                            dataField: "employeeName",
                            wordWrapEnabled: true,
                            caption: "Company Name",
                            sortIndex: 3,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "GenderType",
                            wordWrapEnabled: true,
                            caption: "Sex",
                            sortIndex: 4,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "phoneNo",
                            wordWrapEnabled: true,
                            caption: "Phone No."
                        },
                        {
                            dataField: "email",
                            wordWrapEnabled: true,
                            caption: "Contact Email"
                        },
                        {
                            dataField: "dateofBirth",
                            caption: "Date of Birth",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            wordWrapEnabled: true
                        },
                        {
                            dataField: "address",
                            caption: "Address",
                            alignment: "left",
                            wordWrapEnabled: true,
                            visible: true,
                        },
                        {
                            dataField: "revenueOfficeName",
                            caption: "Revenue Office Name",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold',
                        },
                        
                        {
                            dataField: "dateCreated",
                            caption: "Registration Date",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "payerUtin",
                                summaryType: "count",
                                displayFormat: "Total count: {0}."
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
            $('#loading').hide();
            $('#goBackId').hide();
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#platformNameSelected').text("Details of All Registered Employed Payers Between " + startDate.formatDate(dateFormat) + " to " + endDate.formatDate(dateFormat) + " ");
        }

        this.showIndividualDADetailsListBySelectedDate = function (startDate, endDate) {
            $.ajaxSetup({
                cache: false
            });

            var dateFormat = "dd-MM-yyyy";

            allIndividualDABySelectedDateRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "payerUtin",
                loadUrl: baseUrl + "/api/PayerInformation/getPayerInfoDetailsByPayerType",
                //loadParams: { taxAgentRefNo: null, payerType: "ALL", merchantId: merchantId },
                loadParams: { payerType: "DA" },
                onBeforeSend: function (operation,
                    ajaxSettings) {
                    ajaxSettings.beforeSend = function (xhr) {
                        xhr.setRequestHeader("MY-XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
                        xhr.setRequestHeader('StartDateParameters', JSON.stringify(startDate));
                        xhr.setRequestHeader('EndDateParameters', JSON.stringify(endDate));
                        xhr.setRequestHeader('MerchantCode', JSON.stringify(merchantCode));
                        $('#divDetails').show();
                    };

                    ajaxSettings.global = false;
                }
            });

            dataGrid,
                gridOptions = {
                    dataSource: allIndividualDABySelectedDateRemoteDataLoaders,
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
                        e.fileName = 'AllDAPayerDetailsList' + '(' + now.toISOString() + ')';
                    },
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
                        {
                            dataField: "courtesyTitle",
                            caption: "Title",
                            wordWrapEnabled: true,
                            fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "surname",
                            caption: "Surname",
                            wordWrapEnabled: true,
                            sortIndex: 0,
                            sortOrder: 'asc',
                            //fixed: true,
                            cssClass: 'font-bold'
                        },
                        {
                            dataField: "otherName",
                            caption: "Other Names",
                            wordWrapEnabled: true,
                            //width: 110,
                            sortIndex: 1,
                            cssClass: 'font-bold',
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "payerUtin",
                            wordWrapEnabled: true,
                            caption: "S-TIN",
                            sortIndex: 2,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "jTBTin",
                            wordWrapEnabled: true,
                            caption: "JTB TIN"
                        },
                        {
                            dataField: "GenderType",
                            wordWrapEnabled: true,
                            caption: "Sex",
                            sortIndex: 4,
                            sortOrder: 'asc'
                        },
                        {
                            dataField: "phoneNo",
                            wordWrapEnabled: true,
                            caption: "Phone No."
                        },
                        {
                            dataField: "email",
                            wordWrapEnabled: true,
                            caption: "Contact Email"
                        },
                        {
                            dataField: "dateofBirth",
                            caption: "Date of Birth",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            wordWrapEnabled: true
                        },
                        {
                            dataField: "address",
                            caption: "Address",
                            alignment: "left",
                            wordWrapEnabled: true,
                            visible: true,
                        },
                        {
                            dataField: "revenueOfficeName",
                            caption: "Revenue Office Name",
                            wordWrapEnabled: true,
                            cssClass: 'font-bold',
                        },

                        {
                            dataField: "dateCreated",
                            caption: "Registration Date",
                            dataType: "date",
                            format: "dd-MMM-yyyy",
                            sortIndex: 4,
                            wordWrapEnabled: true,
                            sortOrder: 'desc'
                        }
                    ],
                    summary: {
                        totalItems: [
                            {
                                column: "payerUtin",
                                summaryType: "count",
                                displayFormat: "Total count: {0}."
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
            $('#loading').hide();
            $('#goBackId').hide();
            dataGrid = $("#divDetails").dxDataGrid(gridOptions).dxDataGrid("instance");
            $('#platformNameSelected').text("Details of All Registered Self Employed Payers Between " + startDate.formatDate(dateFormat) + " to " + endDate.formatDate(dateFormat) + " ");
        }















        //
        this.showallWthHistoryByYear = function (taxAgentUtin, taxYear) {
            $.ajaxSetup({
                cache: false
            });

            $.ajaxSetup({
                cache: false
            });

            allWthHistoryBySelectedYearRemoteDataLoaders = DevExpress.data.AspNet.createStore({
                key: "taxAgentUtin",
                loadUrl: "WithholdingReturnHistory?handler=DisplayAllWithholdingReturnsListAsyn",
                loadParams: { taxAgentUtin: taxAgentUtin, payerType: $('#payerTypeId').val(), taxYear: taxYear },
                //loadParams: { taxAgentUtin: taxAgentUtin, taxYear: taxYear },
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
                    hoverStateEnabled: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    columnAutoWidth: true,
                    columns: [
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
                                    return formatter.format(data.value);
                                }
                            }
                        ]
                    },
                    onToolbarPreparing: function (e) {
                        var internalGrid = e.component;
                        e.toolbarOptions.items.push(
                            {
                                location: "before",
                                template: function () {
                                    return $("<div/>")
                                        .append(
                                            $("<h5 />")
                                                .addClass("count")
                                                .text("Tax Year: ")
                                        );
                                },
                                locateInMenu: "auto"
                            }, {
                            location: "before",
                            widget: "dxSelectBox",
                            options: {
                                width: 210,
                                dataSource: yearListDataLoader,
                                displayExpr: "taxYear",
                                valueExpr: "periodId",
                                //value: yearListDataLoader[0].taxYear,
                                searchExpr: ["taxYear", "periodId"],
                                placeholder: "Click to Select Year",
                                showClearButton: true,
                                value: selectBoxYear,
                                onValueChanged: function (data) {
                                    var values = data.value;
                                    var texts = data.value;
                                    //console.log(values);
                                    //console.log(texts);
                                    var value = data.component.option("value");
                                    var text = data.component.option("text");
                                    var selectedYearValue = value;
                                    var selectedYearText = text;
                                    if (selectedYearValue > 0) {
                                        selectBoxYear = selectedYearText;
                                        selectBoxYearValue = selectedYearValue;
                                        $('#displaySelectedYearId').text(selectBoxYear);
                                        that.showallWthHistoryByYear($('#payerUtin').val(), selectBoxYear)
                                    }
                                    else if (selectedYearValue <= 0) {
                                        selectBoxYear = selectedYearText;
                                        selectBoxYearValue = 0;
                                        return false;
                                    }
                                }
                            },
                            locateInMenu: "auto"
                        }
                        );
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

            dataGrid = $("#divAllWthLists").dxDataGrid(gridOptions).dxDataGrid("instance");
        }

    }

    tSmart.gridController = tSmart.gridController || new tSmart.GridController;
    tSmart.gridController.initPage();
    tSmart.gridController.searchPanel();
});
