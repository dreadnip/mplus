var apiURL = 'http://localhost/personal/dash/public/api/'

Vue.component('dungeon-select', {
  // options
  template: `
  <select id="dungeon_select" v-model="selected">
    <option disabled value="">Please select a dungeon</option>
    <option v-for="dungeon in dungeon_list" v-bind:value="dungeon.dg_id"> {{ dungeon.dg_name }} </option>
  </select>
  `,
  data: function() {
    return {
      selected: '',
      dungeon_list: [],
    }
  },
  created: function() {
    this.fetchDungeonList()
  },
  watch: {
    selected: function() {
      this.$emit('selected', this.selected)
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
    }
  }
})

/*
<svg>
    <g v-for="pt in pts">
        <rect x="{{pt.x}}" y="{{pt.y}}" width="{{z}}" height="{{z}}"></rect>
    </g>
</svg>
*/

Vue.component('dungeon-map', {

  template: `
  <div class="dungeon-map">
    <div class="row">
      <!-- dynamic dungeon select dropdown -->
      <dungeon-select v-on:selected="fetchDungeonData"></dungeon-select>
      <!-- percentage display div -->
      <div id="percentage_display">{{ percent }}%</div>
    </div>
    <div class="row">
        <svg id="map_overlay" v-on:click="placeDot">
            
            <g v-for="path in path_list">
                <line :x1="path.start_x" :y1="path.start_y" :x2="path.end_x" :y2="path.end_y" stroke-width="2" stroke="black"/>
            </g>

            <g v-for="mob in mob_list">
                <circle :cx="mob.x" :cy="mob.y" r="6" :class="mob.type" :data-percent="mob.percent" v-on:click="connectDots"/>
                  <title>{{ mob.name }} - {{ mob.percent }}%</title>
                </circle>
            </g>

        </svg>
        <div class="map">
          <img src="img/the_arcway.jpg" :src="dungeon.dg_image_path"/>
        </div>
    </div>
  </div>
  `,
  data: function() {
    return {
      dungeon: [],
      mob_list: [],
      path_list: [],
      percent: 0
    }
  },
  created: function() {

  },
  methods: {
    fetchDungeonData: function(dungeon_id) {
      var xhr = new XMLHttpRequest()
      var self = this
      xhr.open('GET', 'http://localhost/personal/dash/public/api/get_dungeon_data/' + dungeon_id)
      xhr.onload = function() {
        self.dungeon = JSON.parse(xhr.responseText);
        var mob_json = JSON.parse(self.dungeon.dg_trash_array);
        self.mob_list = mob_json.mobs;
        self.path_list = [];
        self.percent = 0;
      }
      xhr.send()
    },
    placeDot: function(event) {
      var mouseX = event.clientX - 20;
      var mouseY = event.clientY - 70;
      console.log('('+mouseX+','+mouseY+')'); 
    },
    connectDots: function(event) {
      var clicked_x = event.currentTarget.getAttribute('cx');
      var clicked_y = event.currentTarget.getAttribute('cy');
      console.log(event.currentTarget.getAttribute('data-percent'));
      this.percent += parseInt(event.currentTarget.getAttribute('data-percent'));
      console.log(this.percent);
      if (this.path_list.length > 0) {
        var last_point = this.path_list[this.path_list.length - 1];
        var new_path = {
          "start_x": last_point.end_x,
          "start_y": last_point.end_y,
          "end_x": clicked_x,
          "end_y": clicked_y
        };
        this.path_list.push(new_path);
      } else {
        var starting_point = this.mob_list[0];
        var new_path = {
          "start_x": starting_point.x,
          "start_y": starting_point.y,
          "end_x": clicked_x,
          "end_y": clicked_y
        };
        this.path_list.push(new_path);
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  template: `
    <div id="app">
        <!-- interactive dungeon map -->
        <dungeon-map></dungeon-map>
    </div>
  `
})