# TinyApp

## Functionality

Users will be able to shorten long URLs and share it with the world.

## Images

!["Url's Landing Page"](https://github.com/PointCodeZero/TinyApp-Project/blob/master/docs/urls-land-page.jpg)
!["Short URL's Page"](https://github.com/PointCodeZero/TinyApp-Project/blob/master/docs/urls-page.jpg)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

1. Install all dependencies (run `npm install` command).
2. Run the development web server using the `node express_server.js` command.

### Expected Usage

This program should be executed from the browser, in the following manner:

1. Go to your browser address bar and open `http://localhost/8080/urls`.
2. Register/Login.
3. Add URL to be shorten and submit.
2. Get your brand new shortened URL and add to your address bar.
3. The new shorten URL will redirect you to the webpage of the original URL.
4. All users original URL and short versions will be stored and available on '/urls'.
5. Users can update and delete only short URL's created by them.
