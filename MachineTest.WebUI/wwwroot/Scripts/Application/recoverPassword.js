$(function () {
    tSmart.GridController = function () {

        $.ajaxSetup({
            cache: false
        });

        var that = this;
        domainName = document.querySelector("#domainNameId").value;
        //console.log(domainName);
        baseUrl = domainName;
        $('#txtrecover').focus();
        ($('#txtrecover').focus());

        $("#btnRecoverPwd").on("click", function () {
            var enteredEmail = $("#txtrecover").val();
            console.log(enteredEmail);
            //console.log("Ready to search");

            if ($('#txtrecover').val().trim() === "") {
                $('#txtrecover').css('border-color', 'Red');
                ($('#txtrecover').focus());
                ShowMessagePopup("Oops!", "Please enter a valid registered email!", "error");
                return;
            }
            else {
                $('#txtrecover').css('border-color', 'lightgrey');
                that.confirmTransactionSearch(enteredEmail);
            }
        });

        this.confirmTransactionSearch = function (enteredEmail) {
            var result = DevExpress.ui.dialog.confirm("You are about to reset your login details with this email (" + enteredEmail + "). Do you want to continue?", "Password Recovery.");
            result.done(function (dialogResult) {
                if (dialogResult) {
                    that.PostToServer(enteredEmail);
                }
                else
                    DevExpress.ui.notify("Password Recovery Canceled", "error", 2000);
            });
            return false;
        };

        this.PostToServer = function (enteredEmail) {
            $('#btnRecoverPwd').attr('disabled', 'disabled');

            var options = {};
            options.url = baseUrl + "/api/SelfService/processPasswordRecovery";  //"RecoverPassword?handler=SearchByAgentUtin";
            options.type = "POST";

            var transParameters = {};
            transParameters.SentMail = enteredEmail;
            //console.log("got dere");
            options.data = JSON.stringify(transParameters);
            options.contentType = "application/json";
            options.dataType = "json";
            options.async = true;
            options.beforeSend = function (xhr) {
                xhr.setRequestHeader("MY-XSRF-TOKEN",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
                xhr.setRequestHeader('transParameters', JSON.stringify(transParameters));
                $("#loader").show();
                $('#btnRecoverPwd').attr('disabled', 'disabled');
            };

            options.success = function (data) {
                $("#loader").hide();
                //$('#btnRecoverPwd').removeAttr('disabled');
                //console.log(data);
                var returnMsgId = data.statusId;
                var returnMsg = data.statusMessage;
                if (returnMsgId < 1) {
                    ShowMessagePopup("Oops!", returnMsg, "error");
                }
                else {
                    var msg = "Credentials Recovery Details Successfully sent to your registered email address!";
                    //ShowMessagePopup("Transaction Status!", msg, "success");
                    swal({
                        title: "Successful!",
                        text: msg,
                        icon: "success",
                        closeOnClickOutside: false,
                        closeOnEsc: false
                    })
                        .then((willDelete) => {
                            if (willDelete) {
                                window.location = '../Account/Login';
                            } else {
                                swal("Transaction Successful, Please Reload The Page!", {
                                    icon: "success",
                                    closeOnClickOutside: false,
                                    closeOnEsc: false
                                });
                            }
                        });
                }
            };
            options.error = function () {
                var msg = "Error while processing your transaction!";
                ShowMessagePopup("Oops!", msg, "error");
                $("#loader").hide();
                $('#btnRecoverPwd').removeAttr('disabled');
            };
            $.ajax(options);
        };
    }
    tSmart.gridController = tSmart.gridController || new tSmart.GridController;
    //tSmart.gridController.initPage();
    //tSmart.gridController.searchPanel();
});