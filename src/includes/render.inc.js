drupalgap.render = function(content) {
  var type = typeof content;
  if (type === 'string') { return content; }
  var html = '';
  if (type === 'object') {
    if (content.markup) {
      var _html = content.markup;
      if (content.prefix) { _html = content.prefix + _html; }
      if (content.suffix) { _html += content.suffix; }
      return _html;
    }
    if (content.theme) {
      var _html = theme(content.theme, content);
      if (content.prefix) { _html = content.prefix + _html; }
      if (content.suffix) { _html += content.suffix; }
      return _html;
    }
    if (content.prefix) { html = content.prefix + html; }
    for (var index in content) {
      if (
        !content.hasOwnProperty(index) ||
        index == 'prefix' || index == 'suffix'
      ) { continue; }
      var piece = content[index];
      var _type = $.type(piece);
      if (_type === 'object') { html += dg_render(piece); }
      else if (_type === 'array') {
        for (var i = 0; i < piece.length; i++) {
          html += dg_render(piece[i]);
        }
      }
    }
    if (content.suffix) { html += content.suffix; }
  }
  else if (type === 'array') {
    for (var i = 0; i < content.length; i++) {
      html += dg_render(content[i]);
    }
  }
  return html;
};