
const maxReadSize = 50 * 1024 * 1024;

let fileName;

export default {
    template: `
<div>
    <input type="file"  ref="upload">
    </input>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="upload">上传到服务器</el-button>
</div>
`,
    data() {
        return {};
    },
    mounted() {

    },
    methods: {
        upload: function () {
            if(this.$refs.upload.files.length == 0){
                this.$message.error("选择文件");
                return;
            }
            let vue = this;
            let file = this.$refs.upload.files[0];
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
            reader.readAsArrayBuffer(file);
        }
    }

}