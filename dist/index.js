"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
let submissions = [];
console.log('Current working directory:', process.cwd());
// Load submissions from JSON file on server startup
fs_1.default.readFile('data.json', 'utf8', (err, data) => {
    if (!err) {
        submissions = JSON.parse(data);
    }
});
app.post('/submit', (req, res) => {
    const newSubmission = req.body;
    submissions.push(newSubmission);
    // Write submissions array to JSON file
    fs_1.default.writeFile('data.json', JSON.stringify(submissions, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving submission');
            return;
        }
        res.status(200).send('Submission received and saved');
    });
});
app.get('/submissions', (req, res) => {
    res.status(200).json(submissions);
});
app.delete('/deleteSubmission/:email', (req, res) => {
    const submissionEmail = req.params.email;
    // Find the index of the submission with the provided email
    const index = submissions.findIndex(submission => submission.email === submissionEmail);
    if (index !== -1) {
        // Remove the submission from the submissions array
        submissions.splice(index, 1);
        // Write updated submissions array back to the JSON file
        fs_1.default.writeFile('data.json', JSON.stringify(submissions, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting submission');
                return;
            }
            res.status(200).send('Submission deleted successfully');
        });
    }
    else {
        res.status(404).send('Submission not found');
    }
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
