import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(bodyParser.json());

interface Submission {
    name: string;
    email: string;
    phoneNumber: string;
    githubLink: string;
    stopwatchTime: string;
}

let submissions: Submission[] = [];

console.log('Current working directory:', process.cwd());

// Load submissions from JSON file on server startup
fs.readFile('data.json', 'utf8', (err, data) => {
    if (!err) {
        submissions = JSON.parse(data);
    }
});

app.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running", status: true });
});

app.post('/submit', (req: Request, res: Response) => {
    const newSubmission: Submission = req.body;
    submissions.push(newSubmission);

    // Write submissions array to JSON file
    fs.writeFile('data.json', JSON.stringify(submissions, null, 2), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving submission');
            return;
        }
        res.status(200).send('Submission received and saved');
    });
});

app.get('/submissions', (req: Request, res: Response) => {
    res.status(200).json(submissions);
});


app.delete('/deleteSubmission/:email', (req: Request, res: Response) => {
    const submissionEmail = req.params.email;

    // Find the index of the submission with the provided email
    const index = submissions.findIndex(submission => submission.email === submissionEmail);

    if (index !== -1) {
        // Remove the submission from the submissions array
        submissions.splice(index, 1);

        // Write updated submissions array back to the JSON file
        fs.writeFile('data.json', JSON.stringify(submissions, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error deleting submission');
                return;
            }
            res.status(200).send('Submission deleted successfully');
        });
    } else {
        res.status(404).send('Submission not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});