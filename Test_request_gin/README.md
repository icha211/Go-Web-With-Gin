# API Tests with Bruno

This folder contains API tests for the Go with Gin project, organized to be used with the Bruno tool.

## Test Structure

```
Test_request_gin/
├── bruno.json                    # Collection configuration
├── environments/                 # Environment variables
│   ├── local.bru                # Local environment
│   └── production.bru           # Production environment
├── auth/                        # Tests for authentication endpoints
│   ├── register.bru             # POST /register
│   ├── login.bru                # POST /login
│   ├── login-invalid-credentials.bru # 401 error test
│   ├── get-profile.bru          # GET /profile
│   └── get-profile-unauthorized.bru # 401 error test
└── albums/                      # Tests for album endpoints
    ├── get-all-albums.bru       # GET /albums
    ├── get-album-by-id.bru      # GET /albums/:id
    ├── create-new-album.bru     # POST /albums
    └── get-albums-unauthorized.bru # 401 error test
```

## Prerequisites

1. **Bruno** : Install Bruno from [bruno.app](https://www.bruno.app/)
2. **API Server** : Make sure your Go server is running on `localhost:8082`

## Usage

### 1. Open Collection in Bruno

1. Launch Bruno
2. Click on "Open Collection"
3. Select the `Test_request_gin` folder

### 2. Configure Environment

1. In Bruno, select the "local" environment from the dropdown menu
2. Verify that `baseUrl` is set to `http://localhost:8082`

### 3. Authentication (Important)

**IMPORTANT** : Album routes now require JWT authentication. 

1. First run the `auth/register.bru` or `auth/login.bru` test
2. The JWT token will be automatically saved in the `authToken` environment variable
3. Album tests will automatically use this token

### 4. Run Tests

#### Individual Tests
- Click on any `.bru` file in the interface
- Click "Send" to execute the request
- Check test results in the "Tests" tab

#### Batch Tests
- Select the "auth" folder to test authentication
- Select the "albums" folder to test albums
- Click "Run Collection" to run all tests in the folder

**Note** : To test albums, make sure you have run `register.bru` or `login.bru` at least once to obtain a token.

## Test Description

### Authentication

#### POST /register
- **File** : `auth/register.bru`
- **Purpose** : Create a new user account
- **Tests** : Status 201 verification, token and user data presence
- **Saved Variables** : `authToken`, `userId`

#### POST /login
- **File** : `auth/login.bru`
- **Purpose** : Login with an existing account
- **Tests** : Status 200 verification, token and user data presence
- **Saved Variables** : `authToken`, `userId`

#### POST /login (invalid credentials)
- **File** : `auth/login-invalid-credentials.bru`
- **Purpose** : Test error handling with invalid credentials
- **Tests** : Status 401 verification, error message

#### GET /profile
- **File** : `auth/get-profile.bru`
- **Purpose** : Get the logged-in user's profile
- **Tests** : Status 200 verification, user profile data
- **Authentication Required** : Yes (Bearer token)

#### GET /profile (unauthorized)
- **File** : `auth/get-profile-unauthorized.bru`
- **Purpose** : Test access without authentication
- **Tests** : Status 401 verification, error message

### Albums

#### GET /albums
- **File** : `albums/get-all-albums.bru`
- **Purpose** : Get all albums
- **Tests** : Status 200 verification, response structure, required data
- **Authentication Required** : Yes (Bearer token)

#### GET /albums/:id
- **File** : `albums/get-album-by-id.bru`
- **Purpose** : Get a specific album
- **Tests** : Status 200 verification, correct album data
- **Authentication Required** : Yes (Bearer token)

#### POST /albums
- **File** : `albums/create-new-album.bru`
- **Purpose** : Create a new album
- **Tests** : Status 201 verification, created album data
- **Authentication Required** : Yes (Bearer token)

#### GET /albums (unauthorized)
- **File** : `albums/get-albums-unauthorized.bru`
- **Purpose** : Test access without authentication
- **Tests** : Status 401 verification, error message

## Environment Variables

### Local
- `baseUrl` : http://localhost:8082
- `timeout` : 5000ms
- `authToken` : (automatically filled after register/login)

### Production
- `baseUrl` : https://your-api-domain.com
- `timeout` : 10000ms
- `authToken` : (automatically filled after register/login)

**Note** : The `authToken` variable is automatically filled when running `register.bru` or `login.bru` tests thanks to the `vars:post-response` section in these files.

## CI/CD Integration

Bruno can be integrated into your CI/CD pipelines:

```bash
# Run all tests
bruno test Test_request_gin

# Run with a specific environment
bruno test Test_request_gin --env local

# Run a specific test
bruno test Test_request_gin/albums/get-all-albums.bru
```

## Customization

To add new tests:

1. Create a new `.bru` file in the appropriate folder
2. Follow the structure of existing files
3. Add your tests in the `tests` section
4. Use the defined environment variables

## Important Notes

- Make sure the API server is running before executing tests
- **Authentication Required** : All album routes now require a JWT token
- Run `auth/register.bru` or `auth/login.bru` first to obtain a token before testing albums
- The token is automatically saved in the `authToken` environment variable
- Album creation tests may affect data state
- For production tests, update the URL in `environments/production.bru`
- JWT tokens are valid for 24 hours
