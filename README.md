![Github CI](https://github.com/aviral282/LetsGetChecked-Backend/workflows/Github%20CI/badge.svg)

## LetsGetChecked-Backend
> Backend is hosted using Heroku, and can be found at http://lets-get-checked-backend.herokuapp.com/

A REST API is provided with seed data for blog posts and comments.  The REST API returns and accepts JSON.

**Base path:** http://lets-get-checked-backend.herokuapp.com/

**GET** `/posts` *List all blog posts*<br>
**GET** `/posts/{id}` *View single blog post*<br>
**GET** `/posts/{id}/comments` *List all comments for single blog post*<br>
**POST** `/posts/{id}/comments` *Add comment to single blog post*<br>
**PUT** `/comments/{id}` *Update single comment*<br>
