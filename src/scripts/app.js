WorkingOnApp = (function(){
  var list = [];

  var addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  var Item = function(desc){
    var self = this instanceof Item ? this : Object.create(Item.prototype);
    self.desc = desc;
    self.added = new Date();
    self.serial = list.length + 1;
    self.priority = 0;
    self.expirationDate = addDays(self.added, 1);
    return self;
  };

  var addItem = function(desc){
    if(typeof desc !== typeof ''){
      console.log('Inappropriate type receieved at addItem');
      throw new Error('Inappropriate type receieved at addItem');
    }
    list.push(new Item(desc));
  };

  var deleteItem = function(serial){
    if(serial >= 0 && serial < list.length){
      return list.splice(serial, 1);
    }
    console.log('Not able to remove [' + serial + '] from list at deleteItem');
    throw new Error('Not able to remove [' + serial + '] from list at deleteItem');
  };

  var updateExpiration = function(serial, date){
    if(serial >= 0 && serial < list.length){
      list[serial].expirationDate = date;
      return;
    }
    console.log('Not able to update [' + serial + '] from list at deleteItem');
    throw new Error('Not able to update [' + serial + '] from list at deleteItem');
  };

  var listItems = function(items){
    items = items || [];
    var now = new Date();
    for(var i = 0; i < list.length; i++){
      if(list[i].expirationDate > now){
        items.push(list[i]);
      }
    }
    return items;
  };

  return {
    addItem: addItem,
    deleteItem: deleteItem,
    updateExpiration: updateExpiration
  };
})();
