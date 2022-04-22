#!/bin/bash
#npm run build
heroku git:remote -a zellobot
git push heroku test:main
