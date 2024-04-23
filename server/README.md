
# Jobify API

This is the api that interacts with the database. All of the endpoints are listed and the way they should be used.



## Auth

#### Register
`POST /auth/register`

Information needed in the body of the request: 
- firstName - string
- lastName - string
- email - string
- password - string

#### Login
`POST /auth/login`

Information needed in the body of the request: 
- email
- password

## Users

#### Get user Info
`POST /users/get-user`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT` | `string` | Json web token, includes userId |

#### Update user Info
`PUT /users/update-user`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT` | `string` | Json web token, includes userId |

JWT should be included in the auth of the request

Information needed in the body of the request: 
- firstName - string
- lastName - string
- email - string
- password - string
- location - string
- profileUrl - string
- jobTitle - string
- about - string

#### Delete user
`DELETE /users/delete-user/${id}`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Id of the user, which should be deleted |

Mainly used for testing purposes.

## Jobs

#### Get all job posts

`GET /jobs/get-all`

#### Get job details by id

`GET /jobs/get-job-details/${id}`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Id of the job post   |

#### Upload a job post

`POST /jobs/upload-job`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT` | `string` | Json web token, includes userId |

JWT should be included in the auth of the request

Information needed in the body of the request: 
- jobTitle - string
- jobType - string
- location - string
- salary - int
- requirements - string
- vacancies - int
- experience - int

A desc object should contain experience and vacancies

#### Update a job post

`PUT /jobs/update-job/${id}`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT` | `string` | Json web token, includes userId |
| `id` | `int` | Id of the job post   |

JWT should be included in the auth of the request

Information needed in the body of the request: 
- jobTitle - string
- jobType - string
- location - string
- salary - int
- requirements - string
- vacancies - int
- experience - int

A desc object should contain experience and vacancies

#### Delete a job post

`DELETE /jobs/delete-job/${id}`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Id of the job post   |

## Companies

#### Register

`POST /companies/register`

Information needed in the body of the request: 
- name - string
- email - string
- password - string

#### Login

`POST /companies/login`

Information needed in the body of the request: 
- email - string
- password - string

#### Get all companies

`GET /companies/get-all`

#### Get company details by id

`GET /companies/get-company-by-id/${id}`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | Id of the company profile   |

#### Get company Info
`POST /companies/get-company-profile`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT` | `string` | Json web token, includes userId |

JWT should be included in the auth of the request

#### Get company job listings
`POST /companies/get-company-job-listing`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT` | `string` | Json web token, includes userId |

JWT should be included in the auth of the request

#### Update company info
`PUT /companies/update-company-profile`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `JWT` | `string` | Json web token, includes userId |

JWT should be included in the auth of the request

Information needed in the body of the request: 
- name - string
- contact - string
- location - string
- profileUrl - string
- about - string
