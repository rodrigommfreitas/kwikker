# Kwikker (Twitter clone)

A Twitter clone built with the [T3 Stack](https://create.t3.gg/).

## Notes:
- I decided to test some new **Next.js 13** features, such as the new *app* directory that was still in beta at the time of creating this project. The new app directory includes support for *layouts* and *server components*;
- I didn't completely implement certain features such as deleting kweeks because I felt like I had already learned everything valuable learning from making this project so I decided to leave it as it is for now.

## T3 stack:
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Features:
- Twitter UI clone and responsive design;
- Authentication (NextAuth and Google OAuth);
- Explore your timeline between two modes: 
  - "For you" - shows every existing kweek; 
  - "Following" - shows kweeks and rekweeks from people you follow.
- Post kweeks;
- Reply, Rekweek or Like kweeks;
- Visit other users profiles and explore their page between two modes:
  - "Kweeks" - see kweeks and rekweeks made by the user;
  - "Likes" - see kweeks liked by the user;
- Follow/unfollow other users;
- Edit your own profile.

## Showcase:

- Initial page before any authentication, the user can see kweeks or visit profiles but can't interact with kweeks or users.
![Guest page](https://raw.githubusercontent.com/rodrigommfreitas/kwikker/main/public/showcase/guest.png)

- The user is getting ready to post a kweek on the main feed.
![Guest page](https://raw.githubusercontent.com/rodrigommfreitas/kwikker/main/public/showcase/home.png)

- The user is viewing his own profile page.
![Guest page](https://raw.githubusercontent.com/rodrigommfreitas/kwikker/main/public/showcase/own-profile.png)

- The user is editing his profile information.
![Guest page](https://raw.githubusercontent.com/rodrigommfreitas/kwikker/main/public/showcase/edit-profile.png)

- The user is visiting another users profile page.
![Guest page](https://raw.githubusercontent.com/rodrigommfreitas/kwikker/main/public/showcase/user-profile.png)

- The user is viewing a kweek and its replies.
![Guest page](https://raw.githubusercontent.com/rodrigommfreitas/kwikker/main/public/showcase/kweek.png)

###### If you clone this repository you can always delete the showcase images folder which can be found inside the public folder.

## Setup
After creating your MySQL database (I used [PlanetScale](https://planetscale.com/)) and creating a google project with OAuth, setup your .env file following the structure found in .env.example.

### Update db
```
npx prisma db push
```
### Install dependencies
```
npm install
```
### Run
```
npm run dev
```
