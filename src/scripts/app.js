WorkingOnApp = (function() {
  var list = [];

  var addDays = function(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  var Item = function(desc) {
    var self = this instanceof Item ? this : Object.create(Item.prototype);
    self.desc = desc;
    self.added = new Date();
    self.serial = list.length + 1;
    self.priority = 0;
    self.expirationDate = addDays(self.added, 1);
    self.isDeleted = false;
    return self;
  };

  var addItem = function(desc) {
    if(typeof desc !== typeof '') {
      console.log('Inappropriate type receieved at addItem');
      throw new Error('Inappropriate type receieved at addItem');
    }
    list.push(new Item(desc));
  };

  var deleteItem = function(serial) {
    if(serial >= 0 && serial < list.length) {
      list[serial].isDeleted = true;
      return;
    }
    console.log('Not able to remove [' + serial + '] from list at deleteItem');
    throw new Error('Not able to remove [' + serial + '] from list at deleteItem');
  };

  var updateExpiration = function(item) {
    if(item.serial >= 0 && item.serial < list.length) {
      list[item.serial].expirationDate = new Date(item.date);
      return;
    }
    console.log('Not able to update [' + item.serial + '] from list at deleteItem');
    throw new Error('Not able to update [' + item.serial + '] from list at deleteItem');
  };

  var listItems = function(items) {
    items = items || [];
    var now = new Date();
    for(var i = 0; i < list.length; i++) {
      if(list[i].expirationDate > now && !list[i].isDeleted) {
        items.push(list[i]);
      }
    }
    return items;
  };

  var updateItemDesc = function(item){
    list[item.serial].desc = item.desc;
  }

  return {
    add: addItem,
    delete: deleteItem,
    updateExpiration: updateExpiration,
    list: listItems,
    updateDesc: updateItemDesc
  };
})();


(function initiateList() {
  WorkingOnApp.add('This is an example of what I am working on.');
})();

function fetchList() {
  return WorkingOnApp.list();
}

function createDescriptionSpan(item) {
  var spanDesc = document.createElement('span');
  spanDesc.innerHTML = item.desc;
  spanDesc.classList.add("item-desc");
  spanDesc.title = "Click to edit me!";
  spanDesc.contentEditable = true;
  spanDesc.onfocus = function(){
    this.classList.add('editing');
  };
  spanDesc.onkeypress = function(e){
    if(e.charCode === 0 && e.keyCode === 13){
      this['onblur'](this); // element[event](element) for triggering events
      return false;
    }
  }
  spanDesc.onblur = function(){
    WorkingOnApp.updateDesc({serial: item.serial - 1, desc:this.innerHTML});
    showList();
    this.classList.remove('editing');
  };
  return spanDesc;
}

function createExpirationSpan(item) {
  var spanEnds = document.createElement('span');
  spanEnds.innerHTML = item.expirationDate.toDateString();
  spanEnds.classList.add("item-expiration-date");
  spanEnds.title = "Do not worry about Days: Mon, Tue etc. Just update the date. Click to edit me!";
  spanEnds.contentEditable = true;
  spanEnds.onfocus = function(){
    this.classList.add('editing');
  };
  spanEnds.onkeypress = function(e){
    if(e.charCode === 0 && e.keyCode === 13){
      this['onblur'](this); // element[event](element) for triggering events
      return false;
    }
  }
  spanEnds.onblur = function(){
    WorkingOnApp.updateExpiration({serial: item.serial - 1, date:this.innerHTML});
    showList();
    this.classList.remove('editing');
  };
  return spanEnds;
}

function createDeleteButton(serial) {
  var deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '-';
  deleteBtn.onclick = (function(id) {
    return function() {
      WorkingOnApp.delete(id);
      showList();
    };
  })(serial);
  deleteBtn.title = 'Click to delete me!';
  return deleteBtn;
}

function createLi(item) {
  var li = document.createElement('li');
  spanDesc = createDescriptionSpan(item);
  spanEnds = createExpirationSpan(item);
  li.appendChild(spanDesc);
  li.appendChild(spanEnds);
  deleteBtn = createDeleteButton(item.serial - 1);
  li.appendChild(deleteBtn);
  li.id = item.serial;
  return li;
}

function showList() {
  var ul = document.getElementById('list');
  ul.innerHTML = '';
  var list = fetchList().reverse();
  var li, spanDesc, spanEnds, deleteBtn;
  for(var i = 0; i < list.length; i++) {
    ul.appendChild(createLi(list[i]));
  }
}

function addItem() {
  var desc = document.getElementById('description').value;
  if(desc.length > 0) {
    WorkingOnApp.add(desc);
    showList();
    document.getElementById('description').value ='';
  } else {
    console.log('Cannot add nothing. Value is empty string.');
    throw new Error('Cannot add nothing. Value is empty string.');
  }
}
