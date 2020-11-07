define(['jquery', 'impromptu', 'jstree', 'cookie', 'jquery-ui', 'jquery-ui-touch-punch', 'utils/font-utils'], function($) {
    $.jstree.defaults.core.worker = window.JS_TREE_WORKERS_ENABLED;
});