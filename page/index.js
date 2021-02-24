import upload from './upload.js';
import list from './list.js';

export default {
  template: `
<div>
  <el-row :gutter="20" id="main">
    <el-col :span="24">
      <el-tabs type="border-card" v-model="activeTabName">
      <el-tab-pane v-for="tab in tabs" :label="tab.show" :key="tab.name" :name="tab.name"></el-tab-pane>
      <component v-bind:is="activeTabName" v-bind:pluginName="name"></component>
      </el-tabs>
    </el-col>
  </el-row>
</div>
`,
  data() {
    return {
      name: 'fileManager',
      activeTabName: 'list',
      tabs: [{
        name: 'list',
        show: '列表'
      },
      {
        name: 'upload',
        show: '上传'
      },
      ]
    };
  },
  components: {
    list,
    upload,
  },
  mounted() {
  },
  methods: {
  }
}