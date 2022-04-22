#!/bin/bash
heroku git:remote -a zellobot
git push heroku master:main
