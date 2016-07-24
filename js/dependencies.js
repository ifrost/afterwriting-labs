define(['es6-promise', 'jquery', 'impromptu', 'jstree', 'cookie', 'utils/jquery-tooltip'], function(Promise, $) {
    $.jstree.defaults.core.worker = window.JS_TREE_WORKERS_ENABLED;
});