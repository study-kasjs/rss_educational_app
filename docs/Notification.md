## Creating notification messages within application

While developing, you may want to show some notification to user. For convenience porposes we have built custom "toasterService" which allows you to display different kind of "toaster" messages.

#### Syntax
```javascript
toasterService.custom(options [, scope][, onShow]);
```


You can pass custom options to toaster methods as first parameter.

##### Options properties:
- __message__: string
- __overlay__: boolean 
- __delay__: value (ms)
- __type__: one of ['__toaster-default__', '__toaster-success__', '__toaster-info__', '__toaster-error__']
- __iconClass__: string (name of glyph class, e.g.: "fa fa-info")
- __confirm__: Function (callback that will ba called if user confirm toaster action)


##### Example:
```javascript
toasterService.custom({
    message: "Lorem Ipsum",
    type: "toaster-info",
    iconClass: "fa fa-info",
    delay: 3000
});
```
You can also pass scope and callback function as second and third optional parameter:
```javascript
toasterService.custom({
    message: "Lorem Ipsum",
    type: "toaster-info",
    iconClass: "fa fa-info",
    delay: 3000
}, $scope, function(){
    alert("Toster shown");
});
```

#### To get started, you need to:
1. Add dependency to eather controller or service like so:
```javascript
module.controller('SomeController', [$scope, 'toasterService', function ($scope, toasterService) ....
```
2. Call toaster somewhere inside:
```javascript
    toasterService.success("Success!!");
```

There are several predefined toaster types:

##### Success

```javascript
    toasterService.success("Success");
```
![Info toaster image](https://github.com/VALIKCOOL/Ch-041/blob/development/docs/assets/toaster-success.png)


##### Info

```javascript
    toasterService.info("Information");
```

![Info toaster image](https://github.com/VALIKCOOL/Ch-041/blob/development/docs/assets/toaster-info.png)

##### Error
```javascript
    toasterService.error("Error");
```

![Info toaster image](https://github.com/VALIKCOOL/Ch-041/blob/development/docs/assets/toaster-error.png)

##### Confirm
```javascript
    toasterService.confirm({
        message: "Confirm?",
        confirm: "confirmFeedDelete"
    }, $scope); 
```

![Info toaster image](https://github.com/VALIKCOOL/Ch-041/blob/development/docs/assets/toaster-confirm.png)
