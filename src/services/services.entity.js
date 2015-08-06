/**
 * Creates an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_create(entity_type, bundle, entity, options) {
  try {
    Drupal.services.call({
        method: 'POST',
        async: options.async,
        path: entity_type + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        bundle: bundle,
        data: JSON.stringify(entity),
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_create - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_create - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_create - ' + error); }
}

/**
 * Retrieves an entity.
 * @param {String} entity_type
 * @param {Number} ids
 * @param {Object} options
 */
function entity_retrieve(entity_type, ids, options) {
  try {
    Drupal.services.call({
        method: 'GET',
        path: entity_type + '/' + ids + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: ids,
        success: function(data) {
          try {
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_retrieve - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_retrieve - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_retrieve - ' + error); }
}

/**
 * Updates an entity.
 * @param {String} entity_type
 * @param {String} bundle
 * @param {Object} entity
 * @param {Object} options
 */
function entity_update(entity_type, bundle, entity, options) {
  try {
    var entity_wrapper = _entity_wrap(entity_type, entity);
    var primary_key = entity_primary_key(entity_type);
    var data = JSON.stringify(entity_wrapper);
    Drupal.services.call({
        method: 'PUT',
        path: entity_type + '/' + entity[primary_key] + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: entity[entity_primary_key(entity_type)],
        bundle: bundle,
        data: data,
        success: function(result) {
          try {
            _entity_local_storage_delete(entity_type, entity[primary_key]);
            if (options.success) { options.success(result); }
          }
          catch (error) { console.log('entity_update - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_update - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_update - ' + error); }
}

/**
 * Deletes an entity.
 * @param {String} entity_type
 * @param {Number} entity_id
 * @param {Object} options
 */
function entity_delete(entity_type, entity_id, options) {
  try {
    Drupal.services.call({
        method: 'DELETE',
        path: entity_type + '/' + entity_id + '.json',
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        entity_id: entity_id,
        success: function(data) {
          try {
            _entity_local_storage_delete(entity_type, entity_id);
            if (options.success) { options.success(data); }
          }
          catch (error) { console.log('entity_delete - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_delete - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_delete - ' + error); }
}

/**
 * Performs an entity index.
 * @param {String} entity_type
 * @param {String} query
 * @param {Object} options
 */
function entity_index(entity_type, query, options) {
  try {
    var query_string;
    if (typeof query === 'object') {
      query_string = entity_index_build_query_string(query);
    }
    else if (typeof query === 'string') {
      query_string = query;
    }
    if (query_string) { query_string = '&' + query_string; }
    else { query_string = ''; }
    Drupal.services.call({
        method: 'GET',
        path: entity_type + '.json' + query_string,
        service: options.service,
        resource: options.resource,
        entity_type: entity_type,
        success: function(result) {
          try {
            if (options.success) { options.success(result); }
          }
          catch (error) { console.log('entity_index - success - ' + error); }
        },
        error: function(xhr, status, message) {
          try {
            if (options.error) { options.error(xhr, status, message); }
          }
          catch (error) { console.log('entity_index - error - ' + error); }
        }
    });
  }
  catch (error) { console.log('entity_index - ' + error); }
}
/**
 * Builds a query string from a query object for an entity index resource.
 * @param {Object} query
 * @return {String}
 */
function entity_index_build_query_string(query) {
  try {
    var result = '';
    if (!query) { return result; }
    if (query.fields) { // array
      var fields = '';
      for (var i = 0; i < query.fields.length; i++) {
        fields += encodeURIComponent(query.fields[i]) + ',';
      }
      if (fields != '') {
        fields = 'fields=' + fields.substring(0, fields.length - 1);
        result += fields + '&';
      }
    }
    if (query.parameters) { // object
      var parameters = '';
      for (var parameter in query.parameters) {
          if (query.parameters.hasOwnProperty(parameter)) {
            var key = encodeURIComponent(parameter);
            var value = encodeURIComponent(query.parameters[parameter]);
            parameters += 'parameters[' + key + ']=' + value + '&';
          }
      }
      if (parameters != '') {
        parameters = parameters.substring(0, parameters.length - 1);
        result += parameters + '&';
      }
    }
    if (query.parameters_op) { // object
      var parameters_op = '';
      for (var parameter_op in query.parameters_op) {
          if (query.parameters_op.hasOwnProperty(parameter_op)) {
            var key = encodeURIComponent(parameter_op);
            var value = encodeURIComponent(query.parameters_op[parameter_op]);
            // @TODO remove double compatability upon resolution of #2537968 on
            // drupal.org
            parameters_op += 'parameters_op[' + key + ']=' + value + '&';
            parameters_op +=
              'options[parameters_op][' + key + ']=' + value + '&';
          }
      }
      if (parameters_op != '') {
        parameters_op = parameters_op.substring(0, parameters_op.length - 1);
        result += parameters_op + '&';
      }
    }
    if (query.orderby) {
      var orderby = '';
      for (var column in query.orderby) {
          if (!query.orderby.hasOwnProperty(column)) { continue; }
          var key = encodeURIComponent(column);
          var value = encodeURIComponent(query.orderby[column]);
          // @TODO remove double compatability upon resolution of #2537968 on
          // drupal.org
          orderby += 'orderby[' + key + ']=' + value + '&';
          orderby += 'options[orderby][' + key + ']=' + value + '&';
      }
      if (orderby != '') {
        orderby = orderby.substring(0, orderby.length - 1);
        result += orderby + '&';
      }
    }
    if (query.options) {
      var options = '';
      for (var option in query.options) {
          if (!query.options.hasOwnProperty(option)) { continue; }
          var _option = query.options[option];
          for (var column in _option) {
            if (!_option.hasOwnProperty(column)) { continue; }
            var key = encodeURIComponent(column);
            var value = encodeURIComponent(_option[column]);
            options += 'options[' + option + '][' + key + ']=' + value + '&';
          }
      }
      if (options != '') {
        options = options.substring(0, options.length - 1);
        result += options + '&';
      }
    }
    if (typeof query.page !== 'undefined') { // int
      result += 'page=' + encodeURIComponent(query.page) + '&';
    }
    if (typeof query.page_size !== 'undefined') { // int
      result += 'pagesize=' + encodeURIComponent(query.page_size) + '&';
    }
    return result.substring(0, result.length - 1);
  }
  catch (error) { console.log('entity_index_build_query_string - ' + error); }
}

/**
 * Wraps an entity in a JSON object, keyed by its type.
 * @param {String} entity_type
 * @param {Object} entity
 * @return {String}
 */
function _entity_wrap(entity_type, entity) {
  try {
    // We don't wrap comments, taxonomy, users or commerce entities.
    var entity_wrapper = {};
    if (entity_type == 'comment' || entity_type == 'taxonomy_term' ||
      entity_type == 'taxonomy_vocabulary' ||
      entity_type == 'user' || entity_type.indexOf('commerce') != -1) {
      entity_wrapper = entity;
    }
    else { entity_wrapper[entity_type] = entity; }
    return entity_wrapper;
  }
  catch (error) { console.log('_entity_wrap - ' + error); }
}

