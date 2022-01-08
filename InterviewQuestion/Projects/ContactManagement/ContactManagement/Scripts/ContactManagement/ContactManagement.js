
var isValid = false;
var inputFields = '#txtFirstName,#txtLastName,#txtEmail,#txtUserName,#txtPassword,#txtConfirmPassword,#txtPhoneNo,#txtAddress';
var contactList;
var statusOperation = 0;

$(document).ready(function () {
    Intitialize();
    $('#btnSaveContact').click(SaveContact); 
    $(inputFields).change(function () {
        $('#lblValidation').text('');
        $('#lblEmailValidation').text('');
        $('#lblPasswordValidation').text('');
    });
});

function Intitialize() {
    GetContactList();
}

function GetContactList() {
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        url: "/ContactManagement/GetContactList",
        success: OnGetContactListSuccess,
        error: OnError
    });
}

function OnGetContactListSuccess(response) {
    if (response.Success) {
        contactList = response.contactList;
        var tblContactListData = JSLINQ(contactList).Where(function (item) {
            return item.IsFavourite == false;
        }).ToArray();

        var tblFavouriteListData = JSLINQ(contactList).Where(function (item) {
            return item.IsFavourite == true;
        }).ToArray();

        if (tblContactListData.length > 0) {
            for (var i = 0; i < tblContactListData.length; i++) {
                var markup = '<tr>' +
                    '<td style="width:30%;"> ' + tblContactListData[i].FirstName + '</td>' +
                    '<td style="width:30%;">' + tblContactListData[i].EmailAddress + '</td>' +
                    '<td style="width:30%;">' + tblContactListData[i].PhoneNo + '</td>' +
                    '<td style="width:30%;"><button type=button class=Delete onclick="UpdateFavouriteStatus(' + tblContactListData[i].Id + ',true,1)" >AddToFav</button></td>' +
                    //'<td style="width:16.6%;"></td>' + 
                    '</tr>';
                $("#tblContactList").append(markup);
            } 
        }
        if (tblFavouriteListData.length > 0) {
            for (var i = 0; i < tblFavouriteListData.length; i++) {
                var markup = '<tr>' +
                    '<td style="width:30%;"> ' + tblFavouriteListData[i].FirstName + '</td>' +
                    '<td style="width:30%;">' + tblFavouriteListData[i].EmailAddress + '</td>' +
                    '<td style="width:30%;">' + tblFavouriteListData[i].PhoneNo + '</td>' +
                    '<td style="width:30%;"><button type=button class=Delete onclick="UpdateFavouriteStatus(' + tblFavouriteListData[i].Id + ',false,2)" >Remove</button></td>' +
                    //'<td style="width:16.6%;"></td>' + 
                    '</tr>';
                $("#tblFavouriteList").append(markup);
            } 
        }
    }
}

function SaveContact() {
    ValidateFields();
    if (isValid) {
        SaveContactData();
    }
}

function ValidateFields() {
    if ($('#txtFirstName').val() == '' || $('#txtFirstName').val() == null || $('#txtFirstName').val() == 'undefined' ||
        $('#txtLastName').val() == '' || $('#txtLastName').val() == null || $('#txtLastName').val() == 'undefined' ||
        $('#txtEmail').val() == '' || $('#txtEmail').val() == null || $('#txtEmail').val() == 'undefined' ||
        $('#txtUserName').val() == '' || $('#txtUserName').val() == null || $('#txtUserName').val() == 'undefined' ||
        $('#txtPassword').val() == '' || $('#txtPassword').val() == null || $('#txtPassword').val() == 'undefined' ||
        $('#txtConfirmPassword').val() == '' || $('#txtConfirmPassword').val() == null || $('#txtConfirmPassword').val() == 'undefined' ||
        $('#txtPhoneNo').val() == '' || $('#txtPhoneNo').val() == null || $('#txtPhoneNo').val() == 'undefined' ||
        $('#txtAddress').val() == '' || $('#txtAddress').val() == null || $('#txtAddress').val() == 'undefined')
    {
        $('#lblValidation').text('All fields are required.');
        isValid = false;
    }
    else {
        ValidateEmail();
        ValidatePasswords();
    }
}

function ValidateEmail() {
    var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    if (filter.test($('#txtEmail').val())) {
        isValid = true
        $('#lblEmailValidation').text('');
    }
    else {
        $('#lblEmailValidation').text('Please enter a valid email.');
        isValid = false;
    }
}

function ValidatePasswords() {
    if ($('#txtPassword').val() == $('#txtConfirmPassword').val()) {
        isValid = true
        $('#lblPasswordValidation').text('');
    }
    else {
        $('#lblPasswordValidation').text('Password fields must be identical.');
        isValid = false;
    }
}

function SaveContactData() {
    var contactData = {
        FirstName:     $('#txtFirstName').val() ,
        LastName:      $('#txtLastName').val()  ,
        EmailAddress:  $('#txtEmail').val() ,
        UserName:      $('#txtUserName').val()  ,
        Password:      $('#txtPassword').val()  ,
        PhoneNo:       $('#txtPhoneNo').val() ,
        Address:       $('#txtAddress').val(),
        IsFavourite:   false
    };
    var data = { 'Contact': contactData }
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        url: "/ContactManagement/SaveAdminSetting",
        data: JSON.stringify(data),
        dataType: "json",
        success: OnSaveContactDataSuccess,
        error: OnError
    });
}

function OnSaveContactDataSuccess(response) {
    if (response.Success) {
        swal("Successfully!", "New contact detail has been added!", "success").then((value) => {
            location.reload();
        });
    }
}

function UpdateFavouriteStatus(id, status, operation) {
    statusOperation = operation;
    var data = { 'Id': id, 'IsFavourite':status }
    $.ajax({
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        url: "/ContactManagement/UpdateFavouriteStatus",
        data: JSON.stringify(data),
        dataType: "json",
        success: OnUpdateFavouriteStatusSuccess,
        error: OnError
    });
}

function OnUpdateFavouriteStatusSuccess(response) {
    
        if (response.Success) {
            if (statusOperation == 1) {
                swal("Successfully!", "Contact has been added to the favourite list.", "success").then((value) => {
                    location.reload();
                });
            }
            else if (statusOperation == 2) {
                swal("Successfully!", "Contact has been removed from the favourite list.", "success").then((value) => {
                    location.reload();
                });
            }
           
        }
    
}

function OnError(response) {
    swal('Something went wrong!', response.Message, 'error');
}
