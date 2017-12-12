# A Review System

An app to get feedback about your business. It has a user interface to submit new reviews and an admin panel to read those reviews and send auto-generated emails. It was created for a specific company but can be easily modified.

## Getting Started

This application uses Node.js and MongoDB. You can follow the instruction to get a copy of the project up and running on your local machine.

### Prerequisites

You should install [Node.js](https://nodejs.org/en/download/package-manager/) and [MongoDB](https://docs.mongodb.com/v3.4/administration/install-community/). 

### Installation

Firstly, you should install the dependecies using the following command.

```
npm install
```

The next thing is to import the database scheme using the following command.

```
mongorestore -d review_system db
```

The last thing is to configure the nodemailer to use your email address. You can do that by editing [this](config/nodemailer.js) file.

## How to run the app?

Simply use the following command.

```
npm start
```

Bingo! The application is accessible at port `3000`.

## Access

1. Firstly, you should create an account to the `/register` route.

2. and then find the user in the users collection and change its key named `active` to `true`.

### Admin Access

If you want to enable admin access to an account you should also change its key named `isAdmin` to `true`.

## Avaiable Routes

* `/register` - Register new account
* `/login` - Login
* `/newreview` - Create new review
* `/admin` - Admin panel
