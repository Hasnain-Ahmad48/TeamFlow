# Team Flow API

## API Documentation

### Base URL

```text
http://localhost:5000/api
```

### Authentication

Protected endpoints require a valid JWT token.

Include the token in the request header:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# User & Authentication APIs

## 1. Register User

Creates a new user account.

### Endpoint

```http
POST /auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

## 2. Login User

Authenticates a registered user and returns a JWT token.

### Endpoint

```http
POST /auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

## 3. Get Current User

Returns information about the currently authenticated user.

### Endpoint

```http
GET /auth/me
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

No request body is required.

# Project APIs

## 4. Create Project

Creates a new project.

### Endpoint

```http
POST /projects
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 5. Get Projects

Retrieves projects available to the authenticated user.

### Endpoint

```http
GET /projects
```

### Authentication

Required.


# Task APIs

## 6. Create Task

Creates a new task inside a project.

### Endpoint

```http
POST /tasks
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "title": "Complete API documentation",
  "description": "Document all Team Flow APIs",
  "projectId": "PROJECT_ID",
  "assignedTo": "USER_ID",
  "priority": "high",
  "dueDate": "2026-09-15"
}
```

### Request Fields

| Field         | Type   | Required | Description                                   |
| ------------- | ------ | -------- | --------------------------------------------- |
| `title`       | String | Yes      | Title of the task                             |
| `description` | String | No       | Description of the task                       |
| `projectId`   | String | Yes      | ID of the project the task belongs to         |
| `assignedTo`  | String | No       | ID of the project member assigned to the task |
| `priority`    | String | No       | Priority of the task                          |
| `dueDate`     | Date   | Yes      | Due date of the task                          |

## 7. Get Project Tasks

Retrieves tasks belonging to a specific project.

Supports filtering, searching, sorting, and pagination.

### Endpoint

```http
GET /tasks/project/:projectId
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Path Parameters

| Parameter   | Type   | Required | Description       |
| ----------- | ------ | -------- | ----------------- |
| `projectId` | String | Yes      | ID of the project |

### Query Parameters

| Parameter    | Type   | Required | Description                             |
| ------------ | ------ | -------- | --------------------------------------- |
| `status`     | String | No       | Filter tasks by status                  |
| `priority`   | String | No       | Filter tasks by priority                |
| `assignedTo` | String | No       | Filter tasks by assigned user           |
| `search`     | String | No       | Search tasks by title                   |
| `sort`       | String | No       | Sort task results                       |
| `page`       | Number | No       | Page number. Default: `1`               |
| `limit`      | Number | No       | Number of tasks per page. Default: `10` |

### Example Request

```http
GET /tasks/project/PROJECT_ID?status=todo&priority=high&page=1&limit=10
```


## 8. Get My Assigned Tasks

Retrieves all tasks assigned to the currently authenticated user.

### Endpoint

```http
GET /tasks/my-tasks
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

No request body is required.


## 9. Get Task By ID

Retrieves a specific task using its task ID.

### Endpoint

```http
GET /tasks/:taskId
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Path Parameters

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| `taskId`  | String | Yes      | Task ID, for example `TASK-1001` |



## 10. Update Task Status

Updates the status of a task.

### Endpoint

```http
PATCH /tasks/:taskId/status
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Path Parameters

| Parameter | Type   | Required | Description                      |
| --------- | ------ | -------- | -------------------------------- |
| `taskId`  | String | Yes      | Task ID, for example `TASK-1001` |

### Request Body

```json
{
  "status": "in-progress"
}
```



## 11. Update Task

Updates one or more fields of an existing task.

### Endpoint

```http
PATCH /tasks/:taskId
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `taskId`  | String | Yes      | Task ID     |

### Request Body

All fields are optional. Only provided fields are updated.

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "high",
  "dueDate": "2026-09-20",
  "assignedTo": "USER_ID"
}
```

To unassign a task:

```json
{
  "assignedTo": null
}
```


## 12. Delete Task

Deletes an existing task.

### Endpoint

```http
DELETE /tasks/:taskId
```

### Authentication

Required.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Path Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `taskId`  | String | Yes      | Task ID     |

### Request Body

No request body is required.

# Project APIs

## 4. Create Project

Creates a new project.

**Method:** `POST`

**Endpoint:**

```text
/api/projects
```

**Authorization:** Required — Bearer Token

**Request Body:**

```json
{
  "name": "Team Flow",
  "description": "Project management application",
  "status": "todo"
}
```

---

## 5. Get User Projects

Retrieves all projects where the authenticated user is a member.

**Method:** `GET`

**Endpoint:**

```text
/api/projects
```

**Authorization:** Required — Bearer Token

**Request Body:** None

---

## 6. Get Project By ID

Retrieves a specific project using its project ID.

**Method:** `GET`

**Endpoint:**

```text
/api/projects/:projectId
```

**Authorization:** Required — Bearer Token

**Path Parameter:**

| Parameter   | Description                       |
| ----------- | --------------------------------- |
| `projectId` | Unique project ID, e.g. `TF-1001` |

**Request Body:** None

---

## 7. Update Project

Updates the name, description, or status of an existing project.

**Method:** `PATCH`

**Endpoint:**

```text
/api/projects/:projectId
```

**Authorization:** Required — Bearer Token
**Permission:** Only the project owner can update the project.

**Path Parameter:**

| Parameter   | Description                       |
| ----------- | --------------------------------- |
| `projectId` | Unique project ID, e.g. `TF-1001` |

**Request Body:**

```json
{
  "name": "Updated Project Name",
  "description": "Updated project description",
  "status": "in-progress"
}
```

All request body fields are optional. Only the fields provided will be updated.

---

## 8. Delete Project

Deletes an existing project.

**Method:** `DELETE`

**Endpoint:**

```text
/api/projects/:projectId
```

**Authorization:** Required — Bearer Token
**Permission:** Only the project owner can delete the project.

**Path Parameter:**

| Parameter   | Description                       |
| ----------- | --------------------------------- |
| `projectId` | Unique project ID, e.g. `TF-1001` |

**Request Body:** None

---

# Project Member APIs

## 9. Add Project Member

Adds a user to an existing project.

**Method:** `POST`

**Endpoint:**

```text
/api/projects/:projectId/members
```

**Authorization:** Required — Bearer Token

**Path Parameter:**

| Parameter   | Description                       |
| ----------- | --------------------------------- |
| `projectId` | Unique project ID, e.g. `TF-1001` |

**Request Body:**

```json
{
  "userId": "USER_ID"
}
```

---

## 10. Get Project Members

Retrieves all members of a project.

**Method:** `GET`

**Endpoint:**

```text
/api/projects/:projectId/members
```

**Authorization:** Required — Bearer Token

**Path Parameter:**

| Parameter   | Description                       |
| ----------- | --------------------------------- |
| `projectId` | Unique project ID, e.g. `TF-1001` |

**Request Body:** None

---

## 11. Remove Project Member

Removes a user from a project.

**Method:** `DELETE`

**Endpoint:**

```text
/api/projects/:projectId/members/:userId
```

**Authorization:** Required — Bearer Token

**Path Parameters:**

| Parameter   | Description                       |
| ----------- | --------------------------------- |
| `projectId` | Unique project ID, e.g. `TF-1001` |
| `userId`    | ID of the user to remove          |

**Request Body:** None
