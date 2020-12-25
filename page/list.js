export default {
    template: `
    <div>
        <el-row :gutter="5">
        /tmp  目录总共  {{files.length}} 个文件
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8" v-for="file in files" :key='file.name'>
                <el-card  style="margin: 10px;">
                    <div style="
                    display: flex;
                    align-items: center;">
                        <div>
                            <el-button style="margin: 5px;" type="primary" size="mini" @click="downfile(file)">下载</el-button>
                            <el-button style="margin: 5px;" type="danger" size="mini" @click="removefile(file)">删除</el-button>
                        </div>
                        <div style="
                        margin-left: 5px;
                        display: flex;
                        flex-direction: column;">
                            <span style="
                                font-size: 20px;
                                text-overflow:ellipsis;
                                width: 150px;
                                overflow: hidden;
                                vertical-align:top;
                                white-space: nowrap;" translate>{{file.name}}</span>
                            <span>{{file.size}}</span>
                            <span>{{file.date}}</span>
                        </div>
                    </div>
                </el-card >
            </el-col>
        </el-row>
    </div>
`,
    data() {
        return {
            files: [],
        };
    },
    mounted() {
        this.load();

    },
    methods: {
        load: function () {
            cockpit.script("ls -lh /tmp", {superuser: 'try'}).then((res) => {
                this.files = res.split('\n')
                .filter(item => item != "" && typeof item === 'string')
                .map(item =>  item.split(/\s+/))
                .filter(info => info.length == 9)
                .map(info => {
                    return {name: info[8], date: `${info[5]}${info[6]}  ${info[7]}`, size: info[4]}
                });
            })
        },
        downfile: function (file) {
            return cockpit.file(`/tmp/${file.name}`, { max_read_size: maxReadSize, binary: true }).read().then((data) => {
                let blob = new Blob([data]);
                saveAs(blob, `${filename}`)
                this.$message("下载成功");
            }).catch(() => {
                this.$message.error("下载失败");
            });
        },
        removefile: function (file) {
            cockpit.script(`rm -rf /tmp/${file.name}`).then(() => {
                this.load();
                this.$message("删除成功");
            }).catch(() => {
                this.$message.error("删除失败");
            });
        },

    }
}
