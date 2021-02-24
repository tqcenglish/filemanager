
const maxReadSize = 50 * 1024 * 1024;

let fileName;

export default {
    template: `
<div>
    <el-row :gutter="10">
        <el-col :span="8">
            <el-upload
                drag
                ref="upload"
                :auto-upload="false"
                action="">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                    <div class="el-upload__tip">
                        <h3>上传到 <span style="color:red;">/tmp</span> 目录</h3>
                    </div>
                </template>
            </el-upload>
        </el-col>
        <el-col :span="8" :offset="4">
            <el-button style="margin-left: 10px;" size="small" type="success" @click="upload">上传到服务器</el-button>
        </el-col>
    </el-row>
    
</div>
`,
    data() {
        return {};
    },
    mounted() {

    },
    methods: {
        upload: function () {
            if(this.$refs.upload.uploadFiles.length == 0){
                this.$message.error("选择文件");
                return;
            }
            let vue = this;
            let file = this.$refs.upload.uploadFiles[0];
            fileName = file.name;
            console.log(fileName);

            let reader = new FileReader();
            reader.onload = function (e) {
                cockpit.file(`/tmp/${fileName}`, { binary: true }).replace(new Uint8Array(reader.result)).then(() => {
                    vue.$message("上传成功");
                }).catch(err => {
                    console.error(err);
                    vue.$message.error("上传失败");
                });
            };
            reader.readAsArrayBuffer(file.raw);
        }
    }

}