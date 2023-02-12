const express = require('express')
const fs = require('fs')
const contentDisposition = require('content-disposition')
const formidable = require('formidable')

const app = express()


app.use(express.static('public'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

app.set('view engine', 'ejs')
app.use(express.urlencoded({
    extended: false
}))

let filterTasks = []
let tasks = [];
app.get('/:status', (req, res) => {

    if (req.url.includes("status")) {
        filterTasks = []
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].status.includes(req.query.status)) {
                filterTasks.push(tasks[i])
            }
        }
    } else if (req.url.includes("path")) {
        res.writeHead(200, {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": "attachment; filename=" + contentDisposition(req.query.filename)
        });
        fs.createReadStream("C:\\Users\\derri\\AppData\\Local\\Temp\\" + req.query.path).pipe(res);
        return;
    }

    res.render('index', {
        filterTasks: filterTasks
    })

});

app.post('/', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        let task = {};
        task.content = fields.task_content;
        task.status = fields.executing_status;
        task.date = fields.completion_date;
        task.newFilename = files.input_file.newFilename;
        task.fileName = files.input_file.originalFilename;
        tasks.push(task);
    });
    res.render('index', {
        filterTasks: filterTasks
    })
})

const PORT = 5005;
app.listen(PORT);

