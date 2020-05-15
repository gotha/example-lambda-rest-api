# Example REST API in AWS Lambda

## Requirements

You have to install nodejs, npm an [serverless framework](https://www.serverless.com/)

```sh
npm install -g serverless
```

## Deployment

You need to set up local AWS User credentials.

```sh
npm install
sls deploy
```

### Endpoints

| method | endpoint      |  description                            |
|--------|---------------|-----------------------------------------|
| GET    | /employee     | list all employees                      |
| GET    | /employee/:id | return a single employee object         |
| POST   | /employee     | create new employee object with new ID  |
| PUT    | /employee/:id | update employee information             |
| DELETE | /employee/:id | delete employee                         |

### Data

Employees list is loaded initially from `data.json` in memory and then is being reused.

Once the lambda sleeps, the data is reset.
