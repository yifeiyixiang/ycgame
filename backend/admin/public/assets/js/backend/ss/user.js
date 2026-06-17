define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'ss/user/index' + location.search,
                    add_url: 'ss/user/add',
                    edit_url: 'ss/user/edit',
                    del_url: 'ss/user/del',
                    multi_url: 'ss/user/multi',
                    import_url: 'ss/user/import',
                    table: 'game_user',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'nickname', title: __('Nickname'), operate: 'LIKE'},
                        {field: 'sign_in_days', title: __('Sign_in_days')},
                        {field: 'sign_time', title: __('Sign_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'sign_status', title: __('Sign_status')},
                        {field: 'home_level', title: __('Home_level')},
                        {field: 'created_time', title: __('Created_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false},
                        {field: 'coin_ad_count', title: __('Coin_ad_count')},
                        {field: 'power_ad_count', title: __('Power_ad_count')},
                        {field: 'activity_count', title: __('Activity_count')},
                        {field: 'activity_progress', title: __('Activity_progress')},
                        {field: 'status', title: __('Status'), searchList: {"0":__('Status 0'),"1":__('Status 1')}, formatter: Table.api.formatter.status},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
