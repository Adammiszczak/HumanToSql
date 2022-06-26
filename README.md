<h2 align="center">HumanToSql</h2>

<br>

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup and usage](#setup)
- [Available query methods](#available-query-methods)
- [Project Status](#project-status)
- Task description
  - [Required knowledge](#required-knowledge)
  - [Required technology for task](#required-technology-for-task)
  - [Main Goals](#main-goals)
  - [Optional Goals](#optional-goals)
  - [Useful Links](#useful-links)

## General info

- Initially this repository was private, but now it's good opportunity to show my coding skills
- This repository contains one of many tasks which I had to do during my studies at back-end developer mentorship classes
- Previous and initial solution is set up at **main** branch
- Refactored solution is going to be set up at **chain-of-responsibility** branch. More at [Project Status](#project-status)

## Technologies

- nest.js
- node.js
- typescript
- docker (optional, just for easier app development)

## Setup and usage

1. Make your own database or you can simply use my **docker-compose.yml** with your own configuration, compose it and simply start a container
2. Add secrets to **.env** file in order to connect with your database
3. Run `npm i`
4. Start nest.js server `npm run start:dev`
5. Open browser and go to [http://localhost:3000/query/form](http://localhost:3000/query/form)
6. Enter your query and receive response

## Available query methods

- **getAll** - example - example _from("table_name").getAll()_
- **getSpecific** - example _from("table_name").getSpecific(["id","age"])_
- **where** - example _from("table_name").getSpecific(["id","age"]).where("age > 20")_
- **whereNot** - example _from("table_name").getSpecific(["id","age"]).whereNot("age > 50")_
- **whereOr** - example _from("table_name").getSpecific(["id","age"]).whereOr(["age = 1212","age = 13","age = 23"])_
- **whereAnd** - example _from("table_name").getAll().whereAnd(["age = 121","firstName = 'John'"])_
- **orderAsc** - example _from("table_name").getSpecific(["id","age"]).where("age > 10").orderAsc("age")_
- **orderDesc** - example _from("table_name").getSpecific(["id","age"]).where("age > 10").orderDesc("age")_
- **groupBy** - example _from("table_name").getSpecific(["age"]).where("age > 15").groupBy(["age"]).orderDesc("age")_
- **unique** - example _from("table_name").unique("age")_
- **insertRecord** - example _insertRecord(["table_name","John","Smith","121"])_
- **updateRecord** - example _updateRecord(["table_name","age","121"]).where("id = 1")_
- **deleteRecord** - example _deleteRecord(["table_name","age","121"])_
- **clearTable** - example _clearTable("table_name")_

## Project Status

- App refactor is pending, main goal is to use **Chain of Responsibility / Chain of command** design patter at **chain-of-responsibility** branch.

## Required knowledge

- SQL, Node, JS

## Required technology for task

- [Any technology from link](https://www.prisma.io/dataguide/database-tools/top-nodejs-orms-query-builders-and-database-libraries#waterline)

## Main Goals

- [] Make an application which translates given string with a chain of custom methods for valid SQL Query

Example of such query: **from("table_name").getAll().where("name = "Azor"")**.

- List of SQL keywords which your app has to support:
- [] insert
- [] select
- [] from
- [] add
- [] distinct
- [] update
- [] delete
- [] truncate
- [] by xYZ asc
- [] by XYZ desc
- [] where
- [] and
- [] or
- [] not
- [] group by

## Optional goals

- [ ] Make a basic graphical user interface for sending and executing queries

## Useful Links

- Introduction to SQL Keywords: https://www.educba.com/sql-keywords/
