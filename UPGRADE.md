# Change from Drupal 7 (old) to Drupal 8 (new)

## Node Retrieve

### Old JSON
```
var node = {
  type: 'page',
  language: 'und',
  title: 'Hello world',
  status: 1,
  created: 123456789,
  changed: 987654321,
  promote: 0,
  sticky: 0
};
node.language = 'und';
```

### New JSON
```
var node = {
  type: [{ target_id: 'page' }],
  langcode: [{ value: 'en' }],
  title: [{ value: 'Hello world', lang: 'en' }],
  status: [{ value: 1, lang: 'en' }],
  created: [{ value: 123456789, lang: 'en' }],
  changed: [{ value: 987654321, lang: 'en' }],
  promote: [{ value: 0, lang: 'en' }],
  sticky: [{ value: 0, lang: 'en' }]
};
```

## Node Create JSON

### Old Way
```
var node = {
  type: 'page',
  title: 'Hello world'
};
node_save(node, ...);
```

### New Way (hal+json)
```
var node = {
  type: [{ target_id: 'page' }],
  title: [{ value: 'Hello world' }]
};
node_save(node, ...);
```

## Node Create Response

### Old Way
```
// 200 OK (json response)
{
  nid: 123,
  uri: "http://example.com/node/123"
}
```

### New Way
```
// 201 Created (string response)
http://example.com/node/123
```

## Topic

### Old Way
```
```

### New Way
```
```


