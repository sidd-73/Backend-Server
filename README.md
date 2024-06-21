# Slidely_Task2_AI Backend

Copy the url and use it the version control.

The data.json file stores the data So that the server's data will be saved even if it gets restarted.

Use the tconfig and package according to this code.
The index.ts is the main file. where it has three end points
/ping- return true always GET
/submit- for submitting a form POST
/submissions -  GET request to read the forms.
/deleteSubmission/:email - DELETE request to delete a form. Not Completed.

fs used to read and write to data.json.
Unable to see the JSON format of data saved in the file, But the GET request works fine always.



