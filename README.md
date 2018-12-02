# Web-Security Final Project

Members: 







## How to run Demo server

```
cd server
python3 demo_server.py
```

Your localserver will be running at 

http://127.0.0.1:5000



| Route           | Explanation                              | Vulnerability                                                |
| --------------- | ---------------------------------------- | ------------------------------------------------------------ |
| /               | Home page                                |                                                              |
| /contact-info   | Submit contact-informatio                | By seeing "Thank you {name}" in the submit form, you know that your name is a variable for the template, and that you can use name field in the contact form to try XSS injection |
| /contact-submit | Diaplay that the submission was accepted |                                                              |

