var apiURL = 'http://localhost/personal/dash/public/api/'

Vue.component('dungeon-select', {
  // options
  template: '<select id="dungeon_select" v-model="selected"><option disabled value="">Please select a dungeon</option><option v-for="dungeon in dungeon_list" v-bind:value="dungeon.dg_id"> {{ dungeon.dg_name }} </option></select>',
  data: function() {
    return {
      selected: '',
      dungeon_list: [],
      dungeon: []
    }
  },
  created: function() {
    this.fetchDungeonList()
  },
  watch: {
    selected: function() {
      this.fetchDungeonData(this.selected)
    }
  },
  methods: {
    fetchDungeonList: function() {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', 'http://localhost/personal/dash/public/api/get_dungeon_list')
      xhr.onload = function() {
        self.dungeon_list = JSON.parse(xhr.responseText)
      }
      xhr.send()
    },
    fetchDungeonData: function(dungeon_id) {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', 'http://localhost/personal/dash/public/api/get_dungeon_data/'+dungeon_id)
      xhr.onload = function() {
        self.dungeon = JSON.parse(xhr.responseText)
        console.log(self.dungeon)
      }
      xhr.send()
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    name: 'Vue.js'
  },
  // define methods under the `methods` object
  methods: {
    placeDot: function(event) {
      // `this` inside methods points to the Vue instance
      console.log('(' + event.clientX + ',' + event.clientY + ')');
      // `event` is the native DOM event
    }
  }
})