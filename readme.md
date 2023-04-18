# Zenith Work

> Backend API for Freelancer web app with Express.js 
> Frontend done with react.js

## Usage

Rename "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run test

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with job posters, students and jobs data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

- Version: 1.0.0
- Author: Zenith

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`PORT`

`MONGO_URI`

`GEOCODER_PROVIDER`

`GEOCODER_API_KEY`
