/**
 * select 컴포넌트의 option을 동적으로 추가하는 함수 
 * @param selectId : 추가할 컴포넌트 ID
 * @param list : option에 추가할 목록
 * @param code : option의 value 값
 * @param value : option의 name 값
 * @param isDel : 기존의 옵션을 지우고 생성할지에 대한 여부, true : 기존의 옵션 값이 모두 지워짐, false : 기존의 옵션값에  추가됨
 * @returns
 */

function addSelOption(selectId, list, value, name, isDel){
	if(isDel){
		$(selectId+" option").remove();
	}
	
	var CODE, VALUE;
	console.log(list.length);
	for(var i = 0; i < list.length; i++){
		CODE = list[i][value];
		NAME = list[i][name];
		$(selectId).append("<option value='" + CODE + "'>" + NAME + "</option>");
	}
}

/**
 * select 컴포넌트의 option을 동적으로 추가하는 함수  name 에 value 값을 같이 표시
 * @param selectId : 추가할 컴포넌트 ID
 * @param list : option에 추가할 목록
 * @param code : option의 value 값
 * @param value : option의 name 값
 * @param isDel : 기존의 옵션을 지우고 생성할지에 대한 여부, true : 기존의 옵션 값이 모두 지워짐, false : 기존의 옵션값에  추가됨
 * @returns
 */

function addSelOption2(selectId, list, value, name, isDel){
	if(isDel){
		$(selectId+" option").remove();
	}
	
	var CODE, VALUE;
	for(var i = 0; i < list.length; i++){
		CODE = list[i][value];
		NAME = list[i][name];
		$(selectId).append("<option value='" + CODE + "'>"+CODE+"&nbsp; &nbsp;" + NAME + "</option>");
	}
}

/**
 * 입력창에 숫자만입력.
 */
$(document).on('keyup', "input:text[numberonly]",function () {  
	$(this).val($(this).val().replace(/[^0-9]/g,""));
});

/**
 * 입력창에 숫자만입력.
 */
$(document).on('keyup', "input:text[numberonlycomma]",function () {
    var value = $(this).val().replace(/[^0-9]/g,"");
	$(this).val(numberWithCommas(value));
});

/**
 * 입력창에 전화번호 자동 하이픈.
 */
$(document).on('keyup', "input:text[autophonenumber]",function () {
    var value = $(this).val().replace(/[^0-9]/g,"");
	value = value.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
	$(this).val(value);
});

/**
 * 3자리수 마다 ,  표시(달러)
 * @param x : 금액
 * @returns 3자리 마다 ,표시된 달러값
 */
function numberWithCommas(x) {
	if(typeof x == "undefined" || x == null || x == "")
		return "";
		
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function nullchk(x) {
	if(typeof x == "undefined" || x == null)
		return "";
	return x;
}
 
/**
 * 콤마 삭제
 * @param x : 금액
 * @returns 3자리 마다 ,표시된 달러값
 */
function unComma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}

/**
 * SAP numbering format
 * @param x : String key number
 * @returns int 입력 자리수를 0으로 맞춰줍니다.
 */
function numberTofit(n, digit) {
	if (n != undefined) {
		var result = n.toString();
		for (var idx=0; idx < digit; idx++) {
			if (result.length < 10) {
				result = "0"+result;
			}
		}
		return result;
	} else {
		return;
	}
}


/*   
 *   
 * 같은 값이 있는 열을 병합함  
 *   
 * 사용법 : $('#테이블 ID').rowspan(0);  
 *   
 */       
$.fn.rowspan = function(colIdx, isStats) {         
	return this.each(function(){        
		var that;       
        $('tr', this).each(function(row) {        
        	$('td',this).eq(colIdx).filter(':visible').each(function(col) {  
        		if ($(this).html() == $(that).html()  
                    && (!isStats || isStats && $(this).prev().html() == $(that).prev().html() )  ) {              
	                    rowspan = $(that).attr("rowspan") || 1;  
	                    rowspan = Number(rowspan)+1;  
	  
	                    $(that).attr("rowspan",rowspan);  
	                      
	                    // do your action for the colspan cell here              
	                    $(this).hide();  
	                      
	                    //$(this).remove();   
	                    // do your action for the old cell here  
                } else {              
                    that = this;           
                }            
                // set the that if not already set  
                that = (that == null) ? this : that;        
            });       
        });      
    });    
};   


/*   
 *   
 * 같은 값이 있는 행을 병합함  
 *   
 * 사용법 : $('#테이블 ID').colspan (0);  
 *   
 */     
$.fn.colspan = function(rowIdx) {  
	return this.each(function(){  
          
		var that;  
		
		$('tr', this).filter(":eq("+rowIdx+")").each(function(row) {  
			$(this).find('td').filter(':visible').each(function(col) {  
				if ($(this).html() == $(that).html()) {  
					colspan = $(that).attr("colSpan");  
						if (colspan == undefined) {  
							$(that).attr("colSpan",1);  
							colspan = $(that).attr("colSpan");  
						}  
						colspan = Number(colspan)+1;  
						$(that).attr("colSpan",colspan);  
						$(this).hide(); // .remove();  
				} else {  
					that = this;  
				}  
				that = (that == null) ? this : that; // set the that if not already set  
			});  
		});  
	});  
}  

//JSON 배열화 함수
$.fn.serializeObject = function(){
	var data = {};
    var array = this.serializeArray();
    $.each(array, function() {
    	var name = $.trim(this.name),
    	value = $.trim(this.value);
    	
        if (data[name]) {
        	if (!data[name].push) {
        		data[name] = [data[name]];
            }
        	data[name].push(value || '');
        } else {
        	data[name] = value || '';
        }
    });
    return data;
};

/**
 * modal 창 열기
 * @param cusId : modal ID
 * @returns
 */

function openPopup(cusId) {
	if($(cusId).css("display") == "none"){   
        jQuery(cusId).css("display", "block");
    }
}

/**
 * modal 창 닫기
 * @param cusId : modal ID
 * @returns
 */
function closePopup(cusId) {
	if($(cusId).css("display") == "block"){   
        jQuery(cusId).css("display", "none");
    }
}

/**
 * 검색에서 서브검색조건 창을 열고 닫기 
 * @param cusId
 * @returns
 */
function closeSearch(cusId){
    if ($(cusId).hasClass('open')) {
      $(cusId).removeClass('open');
      $('.search_box .detail_box').removeClass('open');
    } else {
      $(cusId).addClass('open');
      $('.search_box .detail_box').addClass('open');
    }
}

/**
 * 화면에서 하부내용 열고 닫기
 * @returns
 */

function closeAccordian(){
    $(".btn_detail").on('click', function(){
        if ($(this).parent(".tit_accd").hasClass("open"))
            $(this).parent(".tit_accd").removeClass("open");
        else
            $(this).parent(".tit_accd").addClass("open");
    });
}

/**
 * 탭메뉴 화면별 화면 열고 닫기
 * @param divId
 * @param curId
 * @returns
 */
function tabMenuEvent(divId, curId){
	$(curId).parent().children().removeClass('on');
	$(curId).addClass('on');

	$('.tab_div_cont').hide();
	$(divId).show();
}	

/**
 * loading bar 보여주기
 * @returns
 */
function showLoading() {
    $('.loading_wrap').css("display", "block");
}

/**
 * loading bar 감추기
 * @returns
 */
function hideLoading() {
    $("#loadingbar").css("display", "none");
}

/**
 * Ajax 공통
 * @returns
 */

var makeExtParams = function(params, name, value) {
    if (typeof value == "undefined" || value == "")
        return params;
    
    if (params == "")
        return name + "=" + value;
    else
        return params + "&" + name + "=" + value;
}

function httpRequest(url, data, successCallback) {
    var extParams = "";
    extParams = makeExtParams(extParams, "isajax", "Y");
    
    if (data == "")
        data = extParams;
    else
        data += "&"+extParams;

    $.ajax({
        type : "post",
        url : url,
        dataType : "json",
        data : data,
        error : function(req, status, error) {
            hideLoading();
            if (req.status == 500) {
                document.location.href='/';
            }
            else
                alert("code:"+req.status+"\n"+"message:"+req.responseText+"\n"+"error:"+error);
        },
        success : function(res, status, req) {
            successCallback(res);
        },
        beforeSend : function() {
            showLoading();
        },
        complete : function() {
            hideLoading();
        }
    }); 
}

function httpRequest2(url, data, successCallback) {
        
    $.ajax({
        type : "post",
        url : url,
        dataType : "json",
        data : data,
        error : function(req, status, error) {
        	alert("처리중 에러가 발생했습니다. 잠시후 다시 시도해주세요.");
        },
        success : function(res, status, req) {
            successCallback(res);
        },
        beforeSend : function() {
            showLoading();
        },
        complete : function() {
            hideLoading();
        }
    }); 
}

function httpFileRequest(url, data, successCallback) {
    
    data.append("isajax", "Y");
    
    $.ajax({
        type : "post",
        url : url,
        mimeType : "multipart/form-data",
        contentType: false,
        cache: false,
        dataType : "json",
        processData: false,
        data : data,
        error : function(req, status, error) {
            hideLoading();
            if (req.status == 500) {
                document.location.href='/';
            }
            else
                alert("code:"+req.status+"\n"+"message:"+req.responseText+"\n"+"error:"+error);
        },
        success : function(res, status, req) {
            successCallback(res);
        },
        beforeSend : function() {
            showLoading();
        },
        complete : function() {
            hideLoading();
        }
    }); 
}


function httpFormRequest(url, formId, successCallback) {
	
	var jsonArray = $("#"+formId).serializeArray();
    var queryString = makeExtParams("", "isajax", "Y");
    if (typeof(jsonArray) != "undefined" && jsonArray != null) {
	    for (var i=0; i<jsonArray.length; i++) {
		    var json = jsonArray[i];
            queryString += ("&" + json["name"] + "=" + encodeURIComponent(json["value"]));
	    }
    }
    //loading_B     
    $.ajax({
        type : "post",
        url : url,
        dataType : "json",
        data : queryString,
        error : function(req, status, error) {
			hideLoading();
	        if (req.status == 500) {
				alert(error);
				alert("API 접근권한이 없습니다.");
		    }
		    else {
				alert("오류가 발생했습니다.");
			}
        },
        success : function(res, status, req) {
            successCallback(res);
            hideLoading();
        },
        beforeSend : function() {
            showLoading();
        },
        complete : function() {
            hideLoading();
        }
    }); 
}


function httpFormFileRequest(url, formId, successCallback) {
    var frm = document.getElementById(formId);
	if (frm == null || typeof(frm) == "undefined") {
		return;
	}
	
	frm.method = 'POST';
	frm.enctype = 'multipart/form-data';
	
	var frmData = new FormData(frm);
	frmData.append("isajax", "Y");
    
    $.ajax({
        type : "post",
        url : url,
        mimeType : "multipart/form-data",
        contentType: false,
        cache: false,
        dataType : "json",
        processData: false,
        data : frmData,
        error : function(req, status, error) {
			hideLoading();
	        if (req.status == 500) {
				alert("API 접근권한이 없습니다.");
		    }
		    else {
				alert("오류가 발생했습니다.");
			}
        },
        success : function(res, status, req) {
            successCallback(res);
        },
        beforeSend : function() {
            showLoading();
        },
        complete : function() {
            hideLoading();
        }
    }); 
}

function httpJsonRequest(url, jsonData, successCallback) {
	jsonData.push({"isajax": "Y"});
	$.ajax({
		type: "POST",
		url: url,
		contentType: "application/json",
		data: JSON.stringify(jsonData),
		success: function(res) {
			successCallback(res);
		},
		error: function(req, error) {
			hideLoading();
			if (req.status == 500) {
				alert(error);
				alert("API 접근권한이 없습니다.");
			}
			else {
				alert("오류가 발생했습니다.");
			}
		},
        beforeSend : function() {
            showLoading();
        },
        complete : function() {
            hideLoading();
        }
	});
}

function inputTimeColon(time) {
    var replaceTime = time.value.replace(/\:/g, "");
    if(replaceTime.length >= 4 && replaceTime.length < 5) {
        var hours = replaceTime.substring(0, 2);
        var minute = replaceTime.substring(2, 4);
        if(hours + minute > 2400) {
            alert("시간은 24시를 넘길 수 없습니다.");
            time.value = "24:00";
            return false;
        }
        if(minute > 60) {
            alert("분은 60분을 넘길 수 없습니다.");
            time.value = hours + ":00";
            return false;
        }
        time.value = hours + ":" + minute;
    }
}

function inputDateSlash(date) {
    var replaceDate = date.value.replace(/\:/g, "");
    if(replaceDate.length >= 4 && replaceDate.length < 5) {
        var month = replaceDate.substring(0, 2);
        var day = replaceDate.substring(2, 4);
        date.value = month + "/" + day;
    }
}

function fnPageReflash(){
	location.reload();
}

function create2DArray(rows, columns) {
    var arr = new Array(rows);
    for (var i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }
    return arr;
}