
/*
Generated by coffee-script, any changes should be made to the adagios.coffee file
*/

(function() {
  var fatalError, getCookie, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.epochToDate = function(epoch) {
    return new Date(epoch * 1000);
  };

  root.dateToEpoch = function(date) {
    return parseInt(date.getTime() / 1000);
  };

  root.dateStr = function(date) {
    return date.getFullYear() + "-" + zeropad(date.getMonth() + 1, 2) + "-" + zeropad(date.getDate(), 2);
  };

  root.zeropad = function(number, length) {
    var result;
    result = number + "";
    while (result.length < length) {
      result = "0" + result;
    }
    return result;
  };

  jQuery(function() {
    return $('div.btn-group[data-toggle="buttons-radio"]').each(function() {
      var form, group, hidden, name;
      group = $(this);
      form = group.parents("form").eq(0);
      name = group.attr("data-toggle-name");
      hidden = $("input[name=\"" + name + "\"]", form);
      return $("button", group).each(function() {
        var button;
        button = $(this);
        button.on("click", function() {
          return hidden.val($(this).val());
        });
        if (button.val() === hidden.val()) return button.addClass("active");
      });
    });
  });

  jQuery(function() {
    return $('input.livestatus').each(function() {
      var $this, object_type, query_function;
      $this = $(this);
      object_type = $this.attr('data-object-type');
      if (object_type === void 0) return false;
      query_function = function(query) {
        return adagios.objectbrowser.select2_objects_query(object_type, query);
      };
      $this.select2({
        minimumInputLength: 0,
        query: query_function
      });
      $this.css('width', '400px');
      return true;
    });
  });

  $.extend($.fn.dataTableExt.oStdClasses, {
    sSortAsc: "header headerSortDown",
    sSortDesc: "header headerSortUp",
    sSortable: "header"
  });

  (function($) {
    var filter_cache, obIgnoreTables, object_types;
    obIgnoreTables = [$("table#service-table")[0], $("table#contact-table")[0], $("table#host-table")[0], $("table#command-table")[0], $("table#timeperiod-table")[0]];
    filter_cache = {};
    object_types = ['service', 'servicegroup', 'host', 'hostgroup', 'contact', 'contactgroup', 'command', 'timeperiod'];
    $.fn.dataTableExt.afnFiltering.push(function(oSettings, aData) {
      var cache_type, object_type;
      if ($.inArray(oSettings.nTable, obIgnoreTables) === -1) return true;
      object_type = oSettings["sTableId"].split("-")[0];
      cache_type = filter_cache[object_type];
      if (cache_type === void 0) return true;
      console.log(aData);
      if (aData[1] !== null && cache_type === "2") return true;
      if (cache_type === "1" && aData[2] === ("" + object_type + "group") && aData[1] === null) {
        return true;
      }
      if (cache_type === "0" && aData[2] === object_type && aData[1] === null) {
        return true;
      }
      return false;
    });
    $.fn.adagios_version = function() {
      var $this, current_version;
      $this = $(this);
      current_version = $('#current_version').text();
      $.getJSON("https://opensource.ok.is/cgi-bin/version.cgi?version=" + current_version + "&callback=?", function(data) {
        return this;
      }).success(function(data) {
        $this.text(data['version']);
        return $('a#version_info').attr('href', data['link']);
      });
      return this;
    };
    $.fn.ob_check_datatable_column_visibility = function() {
      var window_width;
      window_width = $(window).width();
      $(this).each(function() {
        var $this, columns, dt;
        $this = $(this);
        dt = $this.dataTable();
        columns = dt.fnSettings().aoColumns.length;
        console.log($this.attr('id'));
        if ($this.attr('id') === 'service-table') {
          if (window_width < 470) {
            dt.fnSetColumnVis(3, false);
            dt.fnSetColumnVis(4, false);
            dt.fnSetColumnVis(5, false);
            dt.fnSetColumnVis(6, true);
            return this;
          } else {
            dt.fnSetColumnVis(3, true);
            dt.fnSetColumnVis(6, false);
          }
        }
        if (columns > 5) dt.fnSetColumnVis(5, window_width > 970);
        if (columns > 4) return dt.fnSetColumnVis(4, window_width > 470);
      });
      return this;
    };
    $.fn.adagios_datetimepicker = function(start_time, end_time) {
      var $this, val, which, _i, _len, _ref;
      $this = $(this);
      $this.data('start_time', start_time);
      $this.data('end_time', end_time);
      $this.data('start_time_epoch', start_time);
      $this.data('end_time_epoch', end_time);
      $this.data('start_time_obj', epochToDate(start_time));
      $this.data('end_time_obj', epochToDate(end_time));
      $this.data('start_hours', zeropad($this.data('start_time_obj').getHours()) + ":" + zeropad($this.data('start_time_obj').getMinutes()));
      $this.data('end_hours', zeropad($this.data('end_time_obj').getHours()) + ":" + zeropad($this.data('end_time_obj').getMinutes()));
      _ref = ['start', 'end'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        which = _ref[_i];
        val = $this.data("" + which + "_time_epoch");
        if (!$this.find("input[name=\"" + which + "_time\"]").length) {
          $this.append("<input name=\"" + which + "_time\" type=\"hidden\" value=\"" + val + "\">");
        }
        $this.find("input[name='" + which + "_time_picker']").each(function() {
          var $dateobj;
          $dateobj = $this.data("" + which + "_time_obj");
          $(this).val(root.dateStr($dateobj));
          return $(this).datepicker({
            format: "yyyy-mm-dd"
          }).on('changeDate', function(ev) {
            $dateobj.setYear(ev.date.getFullYear());
            $dateobj.setMonth(ev.date.getMonth());
            $dateobj.setDate(ev.date.getDate());
            return false;
          });
        });
        $this.find("input[name='" + which + "_hours']").val($this.data("" + which + "_time_obj").getHours() + ":" + zeropad($this.data("" + which + "_time_obj").getMinutes(), 2)).change({
          which: which
        }, function(event) {
          var time, time_regex;
          time = $(this).val();
          time_regex = /^\d{1,2}:\d{1,2}$/;
          if (!time_regex.test(time)) {
            $(this).parent().addClass('error');
            return false;
          }
          time = time.split(':');
          time[0] = time[0] % 24;
          time[1] = zeropad(time[1] % 60, 2);
          $(this).parent().removeClass('error');
          $(this).val("" + time[0] + ":" + time[1]);
          $this.data("" + event.data.which + "_time_obj").setHours(time[0]);
          $this.data("" + event.data.which + "_time_obj").setMinutes(time[1]);
          return true;
        });
      }
      return $this.submit(function() {
        var which, _j, _len2, _ref2, _results;
        _ref2 = ['start', 'end'];
        _results = [];
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          which = _ref2[_j];
          _results.push($this.find("input[name='" + which + "_time']").val(dateToEpoch($this.data("" + which + "_time_obj"))));
        }
        return _results;
      });
    };
    $.fn.adagios_ob_configure_dataTable = function(aoColumns, fetch) {
      var $this;
      aoColumns.unshift({
        sTitle: "register",
        bVisible: false
      }, {
        sTitle: "object_type",
        bVisible: false
      }, {
        sTitle: "name",
        bVisible: false
      }, {
        sTitle: "<label rel=\"tooltip\" title=\"Select All\" id=\"selectall\" class=\"checkbox\"><input type=\"checkbox\"></label>",
        sWidth: "32px"
      });
      $this = $(this);
      $this.data("fetch", fetch);
      $this.data("aoColumns", aoColumns);
      return $this;
    };
    $.fn.adagios_ob_render_dataTable = function() {
      var $this;
      $this = $(this);
      $this.dtData = [];
      $this.fetch = $this.data("fetch");
      $this.aoColumns = $this.data("aoColumns");
      $this.jsonqueries = $this.fetch.length;
      return $.each($this.fetch, function(f, v) {
        var json_query_fields, object_type;
        object_type = v["object_type"];
        console.log("Populating " + object_type + " " + ($this.attr("id")) + "<br/>");
        json_query_fields = ["id", "register"];
        $.each(v["rows"], function(k, field) {
          if ("cName" in field) json_query_fields.push(field["cName"]);
          if ("cAltName" in field) json_query_fields.push(field["cAltName"]);
          if ("cHidden" in field) return json_query_fields.push(field["cHidden"]);
        });
        $.getJSON("../rest/pynag/json/get_objects", {
          object_type: object_type,
          with_fields: json_query_fields.join(",")
        }, function(data) {
          var count;
          count = data.length;
          return $.each(data, function(i, item) {
            var field_array;
            field_array = [item["register"], item["name"], object_type, "<input id=\"ob_mass_select\" name=\"" + item["id"] + "\" type=\"checkbox\">"];
            return $.each(v["rows"], function(k, field) {
              var cell, field_value;
              cell = "<a href=\"id=" + item["id"] + "\">";
              field_value = "";
              if ("icon" in field) cell += "<i class=\"" + field.icon + "\"></i>";
              if (item[field["cName"]]) {
                field_value = item[field["cName"]];
              } else {
                if (item[field["cAltName"]]) field_value = item[field["cAltName"]];
              }
              field_value = field_value.replace("\"", "&quot;");
              field_value = field_value.replace(">", "&gt;");
              field_value = field_value.replace("<", "&lt;");
              if ("truncate" in field && field_value.length > (field["truncate"] + 3)) {
                cell += "<abbr rel=\"tooltip\" title=\" " + field_value + "\">" + (field_value.substr(0, field["truncate"])) + " ...</abbr>";
              } else {
                cell += " " + field_value;
              }
              cell += "</a>";
              field_array.push(cell);
              if (field["cName"] === v["rows"][v["rows"].length - 1]["cName"]) {
                $this.dtData.push(field_array);
                return count--;
              }
            });
          });
        }).success(function() {
          var checked;
          $this.jsonqueries = $this.jsonqueries - 1;
          if ($this.jsonqueries === 0) {
            $("[rel=tooltip]").tooltip();
            $this.data("dtData", $this.dtData);
            $this.adagios_ob_dtPopulate();
            checked = $("input#ob_mass_select:checked").length;
            $("#bulkselected").html(checked);
            if (checked > 0) {
              return $("#actions #modify a").removeClass('disabled');
            } else {
              return $("#actions #modify a").addClass('disabled');
            }
          }
        }).error(function(jqXHR) {});
        return this;
      });
    };
    $.fn.adagios_ob_dtPopulate = function() {
      var $this, aoColumns, dt, dtData, object_type, ot, _i, _len;
      $this = $(this);
      object_type = $this.attr('id').split("-")[0];
      dtData = $this.data("dtData");
      aoColumns = $this.data("aoColumns");
      $("#" + object_type + "-tab #loading").hide();
      console.log("Hiding #" + object_type + "-tab #loading");
      dt = $this.dataTable({
        aoColumns: aoColumns,
        sPaginationType: "bootstrap",
        bAutoWidth: false,
        bScrollCollapse: false,
        bPaginate: true,
        iDisplayLength: 100,
        aaData: dtData,
        sDom: "<'row-fluid'<'span7'<'toolbar_" + object_type + "'>>'<'span5'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        fnDrawCallback: function() {
          $("[rel=tooltip]").tooltip();
          return $("input").click(function() {
            var checked;
            checked = $("input#ob_mass_select:checked").length;
            $("#bulkselected").html(checked);
            if (checked > 0) {
              return $("#actions #modify a").removeClass('disabled');
            } else {
              return $("#actions #modify a").addClass('disabled');
            }
          });
        }
      });
      dt.ob_check_datatable_column_visibility();
      $("table\#" + object_type + "-table th:first").unbind("click");
      $(".toolbar_" + object_type).html("<div class=\"row-fluid\">\n  <div class=\"span12\"></div>\n</div>");
      $(".toolbar_" + object_type + " div.row-fluid div.span12").append("<div class=\"pull-left\" id=\"actions\">\n  <div id=\"add\" class=\"btn-group pull-left\">\n    <a href=\"" + BASE_URL + "objectbrowser/add/" + object_type + "\" class=\"btn capitalize\">\n      Add " + object_type + "\n    </a>\n    <a href=\"#\" class=\"btn dropdown-toggle\" data-toggle=\"dropdown\">\n      <i class=\"caret\"></i>\n    </a>\n    <ul class=\"dropdown-menu nav\">\n      <li class=\"nav-header\">Add</li>\n    </ul>\n  </div>\n  <div id=\"modify\" class=\"btn-group pull-left\">\n    <a rel=\"tooltip\" id=\"copy\" title=\"Copy\" class=\"btn btn-important\" data-target-bulk=\"bulk_copy\" data-target=\"copy\"><i class=\"icon-copy\"></i></a>\n    <a rel=\"tooltip\" id=\"update\" title=\"Edit\" class=\"btn\" data-target-bulk=\"bulk_edit\" data-target=\"edit_object\"><i class=\"glyph-pencil\"></i></a>\n    <a rel=\"tooltip\" id=\"delete\" title=\"Delete\" class=\"btn\" data-target-bulk=\"bulk_delete\" data-target=\"delete_object\"><i class=\"glyph-bin\"></i></a>\n  </div>\n  <div id=\"view_filter\" class=\"btn-group pull-right\"></div>\n</div>\n");
      if (object_type === "command" || object_type === "timeperiod") {
        $("#view_filter").hide();
      }
      $("#actions #modify a").on("click", function(e) {
        var $form, checked, id, params, swhat, where;
        checked = $("input#ob_mass_select:checked").length;
        if (checked > 1) {
          params = {};
          swhat = $(this).attr('data-target-bulk');
          $form = $("form[name=\"bulk\"]");
          $form.attr("action", swhat);
          $("table tbody input:checked").each(function(index) {
            return $("<input>").attr({
              type: "hidden",
              name: "change_" + $(this).attr("name"),
              value: "1"
            }).appendTo($form);
          });
          $form.submit();
        } else if (checked > 0) {
          where = $(this).attr('data-target');
          id = $("table tbody input:checked").attr('name');
          window.location.href = window.location.href.split("#")[0] + ("" + where + "/id=" + id);
        }
        return e.preventDefault();
      });
      if (object_type !== "command" && object_type !== "timeperiod") {
        $(".toolbar_" + object_type + " div.row-fluid ul.dropdown-menu").append("<li><a href=\"" + BASE_URL + "objectbrowser/add/" + object_type + "group\" class=\"capitalize\">" + object_type + "group</a></li>\n<li class=\"divider\"></li>");
        $(".toolbar_" + object_type + " div#view_filter.btn-group").append("<a rel=\"tooltip\" title=\"Show " + object_type + "s\" class=\"btn active\" data-filter-type=\"0\">\n  <i class=\"glyph-computer-service\"></i>\n</a>\n<a rel=\"tooltip\" title=\"Show " + object_type + "groups\" class=\"btn\" data-filter-type=\"1\">\n  <i class=\"glyph-parents\"></i>\n</a>\n<a rel=\"tooltip\" title=\"Show " + object_type + " templates\" class=\"btn\" data-filter-type=\"2\">\n  <i class=\"glyph-cogwheels\"></i>\n</a>");
        filter_cache[object_type] = "0";
      }
      for (_i = 0, _len = object_types.length; _i < _len; _i++) {
        ot = object_types[_i];
        if (ot === object_type || ot === ("" + object_type + "group")) continue;
        $(".toolbar_" + object_type + " div.row-fluid ul.dropdown-menu").append("<li class=\"capitalize\"><a href=\"" + BASE_URL + "objectbrowser/add/" + ot + "\">" + ot + "</a></li>");
      }
      $(".toolbar_" + object_type + " div.row-fluid ul.dropdown-menu").append("<li class=\"divider\"></li>\n<li><a href=\"" + BASE_URL + "objectbrowser/add/template\" class=\"capitalize\">Template</a></li>");
      $("#" + object_type + "-tab.tab-pane label#selectall").on("click", function(e) {
        var $checkbox, checked;
        $checkbox = $("#" + object_type + "-tab.tab-pane #selectall input");
        if ($checkbox.prop("checked")) {
          $(".tab-pane.active .dataTable input#ob_mass_select").each(function() {
            return $(this).prop("checked", true);
          });
        } else {
          $(".tab-pane.active .dataTable input#ob_mass_select").each(function() {
            return $(this).prop("checked", false);
          });
        }
        checked = $("input#ob_mass_select:checked").length;
        $("#bulkselected").html(checked);
        if (checked > 0) {
          return $("#actions #modify a").removeClass('disabled');
        } else {
          return $("#actions #modify a").addClass('disabled');
        }
      });
      $("[class^=\"toolbar_\"] div#view_filter.btn-group a").on("click", function(e) {
        var $target;
        console.log("HAI");
        $target = $(this);
        e.preventDefault();
        if ($target.hasClass("active")) return false;
        object_type = $target.parentsUntil(".tab-content", ".tab-pane").attr("id").split("-")[0];
        $target.siblings().each(function() {
          return $(this).removeClass("active");
        });
        $target.addClass("active");
        filter_cache[object_type] = $target.attr('data-filter-type');
        $("table#" + object_type + "-table").dataTable().fnDraw();
        return false;
      });
      $("div\#" + object_type + "_filter.dataTables_filter input").addClass("input-medium search-query");
      if (object_type === "service") {
        return dt.fnSort([[4, "asc"], [5, "asc"]]);
      } else {
        return dt.fnSort([[4, "asc"]]);
      }
    };
    return $.fn.adagios_ob_run_check_command = function(click_event) {
      var bar, id, modal, object_type, plugin_execution_time, run_check_plugin_div, step, steps, updateTimer;
      modal = $(this);
      id = modal.attr("data-object-id");
      object_type = modal.attr("data-object-type");
      if (!id) {
        console.log("Error, no data-object-id for run command");
        click_event.preventDefault();
        return false;
      }
      $("#run_check_plugin #state").removeClass("label-important");
      $("#run_check_plugin #state").removeClass("label-warning");
      $("#run_check_plugin #state").removeClass("label-success");
      $("#run_check_plugin #state").html("Pending");
      $("#run_check_plugin #output pre").html("Executing check plugin");
      plugin_execution_time = $("#run_check_plugin div.progress").attr("data-timer");
      if (plugin_execution_time > 1) {
        updateTimer = function() {
          step += 1;
          $("#run_check_plugin div.bar").css("width", step * 5 + "%");
          if (step < 20) return setTimeout(updateTimer, step * steps);
        };
        $("#run_check_plugin div.progress").show();
        bar = $("#run_check_plugin div.bar");
        step = 0;
        steps = (plugin_execution_time / 20) * 100;
        updateTimer();
      }
      run_check_plugin_div = $("div#run_check_plugin");
      $.getJSON(BASE_URL + "rest/pynag/json/run_check_command", {
        object_id: id
      }, function(data) {
        var statusLabel, statusString;
        statusLabel = "label-inverse";
        statusString = "Unknown";
        if (object_type === "host") {
          if (data[0] > 1) {
            statusLabel = "label-important";
            statusString = "DOWN";
          } else {
            statusLabel = "label-success";
            statusString = "UP";
          }
        } else {
          if (data[0] === 2) {
            statusLabel = "label-important";
            statusString = "Critical";
          }
          if (data[0] === 1) {
            statusLabel = "label-warning";
            statusString = "Warning";
          }
          if (data[0] === 0) {
            statusLabel = "label-success";
            statusString = "OK";
          }
        }
        run_check_plugin_div.find("#state").addClass(statusLabel);
        run_check_plugin_div.find("#state").html(statusString);
        if (data[1]) {
          run_check_plugin_div.find("div#output pre").text(data[1]);
        } else {
          run_check_plugin_div.find("#output pre").html("No data received on stdout");
        }
        if (data[2]) {
          run_check_plugin_div.find("#error #error_content").text(data[2]);
          run_check_plugin_div.find("#error #error_title").text("Plugin output (standard error)");
          run_check_plugin_div.find("div#error").show();
        } else {
          run_check_plugin_div.find("#error pre").text = "";
          run_check_plugin_div.find("div#error").hide();
        }
        run_check_plugin_div.find("div#plugin_output").show();
        run_check_plugin_div.find("dl").show();
        $("#run_check_plugin_refresh").show();
        run_check_plugin_div.find("div.progress").hide();
        return $("#run_check_plugin_refresh").unbind('click').click(function(click_event) {
          return $(this).adagios_ob_run_check_command(click_event);
        });
      }).error(function(jqXHR) {
        run_check_plugin_div = $("div#run_check_plugin");
        run_check_plugin_div.find("#error_title").text("Error fetching JSON");
        run_check_plugin_div.find("#error_content").text("Failed to fetch data: URL: \"" + this.url + "\" Server Status: \"" + jqXHR.status + "\" Status: \"" + jqXHR.statusText + "\"");
        run_check_plugin_div.find("#error").show();
        run_check_plugin_div.find("div#plugin_output").hide();
        return run_check_plugin_div.find("dl").hide();
      });
      return this;
    };
  })(jQuery);

  fatalError = function(errorTitle, errorContent, errorFooter) {
    return $('div.container-fluid.content').html("<div class=\"row-fluid\">\n  <div class=\"span4\">\n    <div class=\"alert alert-error\">\n      <h2>Fatal Error - " + errorTitle + "</h2>\n      <div>" + errorContent + "</div>\n      <div>" + errorFooter + "</div>\n    </div>\n  </div>\n</div>");
  };

  getCookie = function(name) {
    var cookie, cookieValue, cookies, i;
    cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      cookies = document.cookie.split(";");
      i = 0;
      while (i < cookies.length) {
        cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, name.length + 1) === (name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
        i++;
      }
    }
    return cookieValue;
  };

  window.csrftoken = getCookie('csrftoken');

  $(document).ready(function() {
    $("[rel=tooltip]").popover();
    $("#popover").popover();
    $("select").select2({
      placeholder: "Select an item",
      containerCssClass: "select2field"
    });
    $("body").on("click", "a.disabled", function(event) {
      event.preventDefault();
    });
    return $('div.modal#notifications div.alert').bind('close', function(e) {
      var $this, id;
      $this = $(this);
      id = $this.attr('data-notification-dismiss');
      console.log("dismissing id " + id);
      if ($this.data('dismissed')) return true;
      if (id) {
        $.post("" + BASE_URL + "rest/adagios/txt/clear_notification", {
          notification_id: id
        }, function(data) {
          var num_notifications;
          num_notifications = 0;
          if (data === "success") {
            $('span#num_notifications').each(function() {
              var num;
              num = +$(this).text();
              num_notifications = num - 1;
              return $(this).text(num_notifications);
            });
            console.log("Notifications " + num_notifications);
            if (num_notifications === 0) {
              $('a[href="#notifications"] div.badge').removeClass('badge-warning');
              $('div#notifications.modal div.modal-body').text("No notifications");
            }
            $this.data('dismissed', 1);
            return $this.alert('close');
          } else {
            return console.log("Unable to dismiss notification for " + id);
          }
        });
        return e.preventDefault();
      }
      return true;
    });
  });

}).call(this);
