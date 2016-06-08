define(['jquery', 'impromptu', 'jstree', 'cookie'], function($) {
   if (window.location.search.indexOf('ACCEPTANCE') !== -1) {
      // XXX: if you turn the workers on, the acceptance test will fail because
      // call executed by workers is asynchronous and the test does not take this
      // into account
      $.jstree.defaults.core.worker = false;
   }
});