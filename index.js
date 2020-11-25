
const maxReadSize = 50 * 1024 * 1024;

let uploadData;
let fileName;
let uploadFile = document.getElementById('upload_file');
uploadFile.addEventListener('change', function () {

});

new Vue({
    el: '#app',
    data: {
        files: ''
    },
    mounted() {
        this.load();
    },
    methods: {
        load: function () {
            cockpit.script("ls /tmp").then((res) => {
                this.files = res.split('\n').filter(item => item !="" && typeof item === 'string');
            })
        },
        downfile: function(filename) {
            return cockpit.file(`/tmp/${filename}`, { max_read_size: maxReadSize }).read().then((data) => {
                let blob = new Blob([data], { type: "text/plain;charset=utf-8" });
                saveAs(blob, `${filename}`)
            });
        },
        removefile: function name(filename) {
            cockpit.script(`rm -rf /tmp/${filename}`).then(() => {
                this.load();
            });
        },
        upload: function () {
            let vue = this;
            let file = this.$refs.upload_file.files[0];
            fileName = file.name;
            console.log(fileName);

            let reader = new FileReader();
            reader.onload = function (e) {
                uploadData = reader.result;

                cockpit.file(`/tmp/${fileName}`).replace(uploadData).then(() => {
                    vue.load();
                }).catch(err => {
                    console.error(err);
                });
            };
            reader.readAsText(file, 'utf-8');
        }
    }
})