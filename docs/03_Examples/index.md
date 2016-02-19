For brevity, all the examples use a [closure](http://stackoverflow.com/q/111102/763010).

> A Bunch of Common jDrupal Examples

- [Authentication](Examples/Authentication)
- [Users](Examples/Users)
- [Views](Examples/Views)
- [Nodes](Examples/Nodes)
- [Comments](Examples/Comments)
- [Taxonomy Terms](Examples/Taxonomy_Terms)

> Understanding Closures

With a closure, you can access jDrupal using a `$`:
```
// With a closure...
(function($) {

  $.nodeLoad(123).then(function(node) {
    console.log(node.getTitle());
  });

})(jDrupal);
```

Without a closure, you can access jDrupal using the `jDrupal` object:
```
// Without a closure...
jDrupal.nodeLoad(123).then(function(node) {
  console.log(node.getTitle());
});
```

> Using jQuery too?

Then don't use a `$` for your jDrupal closure.