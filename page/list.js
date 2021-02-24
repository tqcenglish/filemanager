const dirInit = "/tmp/";
const maxReadSize = 1024 * 1024 * 1024; //1G

export default {
    template: `
    <div>
        <el-row :gutter="5">
            <div style="width: 80%">
                <el-input style="margin: 20px;" placeholder="请输入目录" v-model="dir">
                    <template #prepend>目录:</template>
                    <template #append>
                        <el-button icon="el-icon-search" @click="load()"></el-button>
                  </template>
                </el-input>
            </div>
        </el-row>
        <el-row :gutter="5">
            <el-col :span="8" v-for="file in files" :key='file.name'>
                <el-card  style="margin: 10px;">
                    <div style="
                    display: flex;
                    align-items: center;">
                        <div>
                            <el-button style="margin: 5px;" type="primary" size="mini" @click="downfile(file)">下载</el-button>
                            <el-popconfirm
                                confirmButtonText='好的'
                                cancelButtonText='不用了'
                                @confirm="removefile(file)"
                                icon="el-icon-info"
                                iconColor="red"
                                title="删除文件不可恢复？"
                                >
                                <template #reference>
                                    <el-button style="margin: 5px;" type="danger" size="mini">删除</el-button>
                                </template>
                            </el-popconfirm>
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
        <el-row>
            <div style="margin: 20px;"><span style="color:green">{{resultDir}}</span>  目录总共 <span style="color:red">{{files.length}} </span>个文件</div>
        </el-row>
    </div>
`,
    data() {
        return {
            files: [],
            dir: dirInit,
            resultDir: dirInit,
        };
    },
    mounted() {
        this.load();

    },
    methods: {
        load: function () {
            const command = `ls -lh ${this.dir} | grep ^-`;
            cockpit.script(command, {superuser: 'try'})
            .then((res) => {
                this.files = res.split('\n')
                .filter(item => item != "" && typeof item === 'string')
                .map(item =>  item.split(/\s+/))
                .filter(info => info.length == 9)
                .map(info => {
                    return {name: info[8], date: `${info[5]}${info[6]}  ${info[7]}`, size: info[4]}
                });
                this.resultDir = this.dir;
            })
            .catch(err => {
                // 文件夹为空
                console.error(err);
                this.files = [];
                this.resultDir = this.dir;
            })
        },
        downfile: function (file) {
            return cockpit.file(`${this.dir}${file.name}`, { max_read_size: maxReadSize, binary: true }).read().then((data) => {
                let blob = new Blob([data]);
                saveAs(blob, `${file.name}`)
                this.$message("下载成功");
            }).catch(() => {
                this.$message.error("下载失败");
            });
        },
        removefile: function (file) {
            cockpit.script(`rm -rf ${this.dir}${file.name}`).then(() => {
                this.load();
                this.$message("删除成功");
            }).catch(() => {
                this.$message.error("删除失败");
            });
        },

    }
}
