# Shh URL
A simple self-hosted URL shortner

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMichaelCasaDev%2Fshhh-url&env=PASSWORD,SECRET,BASE_URI,DATABASE_URI&project-name=shhh-url&repo-name=shhh-url)
<img src="imgs/screenshot.png">

## Requirements
- MongoDB
- Node.JS (<16.x)

## Setup
A simple `.ENV` file to save some usefull variables that will be used by **Shhh URL**.
```
  PASSWORD=<dashboard password>
  SECRET=<a string to encrypt the dashboard password>
  
  BASE_URI=<uri of shh url>
  DATABASE_URI=<uri for the connection with the database>
```
## Contributing
Feel free to contribute and open pull requests to made a better version of **Shhh URL** 😉

## License

[GNU General Public License v3.0](https://github.com/MichaelCasaDev/shhh-url/blob/main/LICENSE)
