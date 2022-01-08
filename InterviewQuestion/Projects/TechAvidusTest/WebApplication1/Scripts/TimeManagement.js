

var timeData = [];

$(document).ready(function () {
    Initialize();
    $('#btnAddNew').click(AddNewRow);
    $('#btnsubmit').click(SaveTime);
    $("#table").on('click', '.Delete', function () {
        $(this).closest('tr').remove();
    });
});

function Initialize() {
    $('input[type=text]').timepicker({
        timeFormat: 'h:mm p',
        interval: 60,
        minTime: '10',
        maxTime: '7:00pm',
        defaultTime: '10',
        startTime: '10:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
    $("#table").hide();
}

function AddNewRow() {
    $('#divTimeEntryForm').append(
        '<div class="row"><div class= "col-lg-2 form-group" >'+
        '<label id="lblTimeIn" style="display: block;margin-bottom:5px;">Time In :</label>'+
        '<input type="text" id="" width="10" class="form-control" />'+
        //'<label id="lblErrorTimeIn" style="color:red;"></label>'+
                        '</div >'+
        '<div class="col-lg-2 form-group">'+
            '<label id="lblTimeOut" style="display: block;margin-bottom:5px;">Time Out :</label>'+
            '<input type="text" id="" width="10" class="form-control" />'+
            //'<label id="lblErrorTimeOut" style="color:red;"></label>'+
        '</div>'+
        
        '</div>');
    Initialize();
}

function SaveTime() {
    timeData = [];
    var dataItems = [];
    $('input').each(function (key) {
        if ($(this).val() != "" && $(this).val() != null && $(this).val() != 'undefined') {
            var dataItem = {};
            dataItem.Id = key + 1;
            dataItem.Value = $(this).val();
            dataItems.push(dataItem);
        }
        else {
            $('#lblErrorTimeIn').text('Please select the time.');
            dataItems = [];
        }
    });
    if (dataItems.length > 0) {
        var time1;
        var id = 0;
        var condCount = 0;
        for (var i = 0; i < dataItems.length; i++) {
            if (dataItems[i].Id == condCount) {
                id = id + 1;
                var dataItem = {};
                dataItem.Id = id;
                dataItem.Time1 = time1;
                dataItem.Time2 = dataItems[i].Value;
                timeData.push(dataItem);
                condCount = condCount + 2;
            }
            else {
                if (condCount == 0) {
                    condCount = 2;
                }
                time1 = dataItems[i].Value;
            }
        }
        BindDataToGrid();
    }
}
//timeData
function BindDataToGrid() {
    $("#table").show();
    for (var i = 0; i < timeData.length; i++) {
        markup = '<tr>'+
            '<td style="width:30%;"> ' + timeData[i].Time1+ '</td>'+
            '<td style="width:30%;">' + timeData[i].Time2 + '</td>'+            
            '<td style="width:30%;"></td>' + 
            '<td style="width:30%;"><button type=button class=Delete onclick="deletePresenceRow(' + timeData[i] + ')" >Delete</button></td>'+
            //'<td style="width:16.6%;"></td>' + 
            '</tr>';
        $("#table").append(markup);
    }   
}

function deletePresenceRow(id) {
    $.each(timeData,
        function (i, el) {
            if (this.Id == id) {
                timeData.splice(i, 1);
            }
        });
    BindDataToGrid();
}