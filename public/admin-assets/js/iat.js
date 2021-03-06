/**
 * 显示操作成功信息
 *
 * @param  string 提示信息, float 显示时间
 * @return null
 */
function showSuccessTip(tip, time){
	var tip = arguments[0] || '操作成功';
	var time = arguments[1] || 1.5;
	var background = '#5cb85c';
	var bordercolor = '#4cae4c';

	showTip(tip, time, background, bordercolor);
}

/**
 * 显示操作失败信息
 * @param string 提示信息, float 显示时间
 * @return null
 */
function showFailTip(tip, time){
	var tip = arguments[0] || '操作失败';
	var time = arguments[1] || 1.5;
	var background = '#c9302c';
	var bordercolor = '#ac2925';

	showTip(tip, time, background, bordercolor);
}

/**
 * 显示信息，供成功、失败调用
 * @param string 提示信息, float 显示时间, string 背景颜色, string 边框颜色
 * @return null
 */
function showTip(tip, time, background, bordercolor) {
	var windowWidth = document.documentElement.clientWidth;
	var height = 10;
	var width = 200;
	var tipsDiv = '<div class="tipsClass">' + tip + '</div>div>';

	$('body').append(tipsDiv);
	$('div.tipsClass').css({
		'z-index': 9999,
		'top': height + 'px',
		'width': width + 'px',
		'height': '30px',
		'left': (windowWidth / 2) - (width / 2) + 'px',
		'position': 'fixed',
		'padding': '3px 5px',
		'background': background,
		'border': '1px solid transparent',
		'border-color': bordercolor,
		'border-radius':'4px',
		'font-size': 14 + 'px',
		'margin': '0 auto',
		'text-align': 'center',
		'color': '#fff',
		'opacity': '0.8'
	}).show();
	setTimeout(function(){$('div.tipsClass').fadeOut();}, (time * 1000));
}

function submit_delete(datatable_id, delete_url, delete_ids, tip_msg, tip_time) {
	$('#confirm_delete_modal').modal('hide');
	$.ajax({
		url: delete_url,
		type: 'POST',
		data: {'ids': delete_ids},
		dataType: 'jsonp',
		headers: {
			'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
		},
		success: function(data) {
			if(data['status_code'] === 0) {
				$('#' + datatable_id).DataTable().draw(false);//保持分页
				showSuccessTip(tip_msg, tip_time);
			} else {
				showFailTip(tip_msg, tip_time);
			}
		},
		error: function() {
			showFailTip(tip_msg, tip_time);
		},
	});
}

function initComplete() {
	$('input').iCheck({
		checkboxClass: 'icheckbox_square-blue',
		radioClass: 'iradio_square-red',
		increaseArea: '20%' // optional
	});
	//行列高亮
	var lastIdx = null;
	$('#' + datatable_id + ' tbody')
	.on( 'mouseover', 'td', function () {
		var colIdx = table.cell(this).index().column;
		if ( colIdx !== lastIdx ) {
			$( table.cells().nodes() ).removeClass( 'highlight' );
			$( table.column( colIdx ).nodes() ).addClass( 'highlight' );
		}
	} )
	.on( 'mouseleave', function () {
		$( table.cells().nodes() ).removeClass( 'highlight' );
	})
	table.on( 'draw.dt', function () {
		$('input').iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-red',
			increaseArea: '20%' // optional
		});
		$('#checkAll').on('ifChecked', function(event){
			$('input').iCheck('check');
		});
		$('#checkAll').on('ifUnchecked', function(event){
			$('input').iCheck('uncheck');
		});
		$('#checkAll').iCheck('uncheck');
	} );
	//全选全不选
	$('#checkAll').on('ifChecked', function(event){
		$('input').iCheck('check');
	});
	$('#checkAll').on('ifUnchecked', function(event){
		$('input').iCheck('uncheck');
	});
	$("#search").on( 'keyup', function () {
        table.search( this.value )
		.draw();
	});
}
function check_delete(id) {
	var ids =[];
	if(!id) {
        $('input[name="ids"]:checked').each(function(){ ids.push($(this).val()); });
	} else {
		ids.push(id);
	}
	$('#selected_ids').attr('value', ids);
	if(ids == '') {
		$('#no_selected_modal').modal('show');
	} else {
		$('#confirm_delete_modal').modal('show');
	}
}
