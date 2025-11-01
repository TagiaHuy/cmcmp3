# React Project

This is a React project bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Folder Structure

*   `src`: This directory contains all the source code for the application.
    *   `api`: This folder contains all the code related to API calls.
    *   `assets`: This folder contains all the static assets like images, fonts, etc.
    *   `components`: This folder contains all the reusable components.
    *   `contexts`: This folder contains all the React contexts.
    *   `hooks`: This folder contains all the custom React hooks.
    *   `pages`: This folder contains all the pages of the application.
    *   `services`: This folder contains all the services.
    *   `styles`: This folder contains all the global styles.
    *   `utils`: This folder contains all the utility functions.
*   `public`: This directory contains the `index.html` file and other static assets.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Q&A

**Q: What to do if `npm start` fails?**

A: If `npm start` fails, it is likely that you are missing some dependencies. Try running `npm install` to install all the required dependencies. If that doesn't work, try deleting the `node_modules` folder and the `package-lock.json` file and then run `npm install` again.

**Q: what is utility mean?**

In programming, "utility" generally refers to something that      
  provides a useful, practical, or general-purpose function that    
  supports the main application logic but isn't part of its core    
  business domain.

  Think of it as a toolbox of helpful tools. A "utility" helps you  
  get things done more efficiently or consistently.

  For example:
   * Utility functions: As discussed, these are small, reusable     
     functions for common tasks like formatting data, validating    
     input, or performing calculations.
   * Utility classes/modules: Collections of related utility        
     functions or methods.
   * Utility libraries: External packages that provide a wide range 
     of general-purpose functionalities (e.g., Lodash in JavaScript,
     Apache Commons in Java).

  The goal of anything labeled "utility" is to be generic, reusable,
  and to simplify common operations across different parts of a     
  codebase.

**Q: what is reportWebVitals?**

reportWebVitals is a function commonly found in React application,
   especially those created with Create React App. Its purpose is to
  measure and report on various performance metrics known as Web 
  Vitals.
  It's a function designed to measure and report on Web Vitals,
  which are a set of standardized metrics from Google that aim to
  quantify the user experience of a web page. These metrics cover
  aspects of loading performance, interactivity, and visual
  stability.

   * `getCLS` (Cumulative Layout Shift): Measures visual stability.
     It quantifies unexpected layout shifts of visual page content.
   * `getFID` (First Input Delay): Measures interactivity. It
     quantifies the experience users feel when trying to first
     interact with the page.
   * `getFCP` (First Contentful Paint): Measures loading performanc.
      It marks the time from when the page starts loading to when ay
      part of the page's content is rendered on the screen.
   * `getLCP` (Largest Contentful Paint): Measures loading
     performance. It reports the render time of the largest image or
     text block visible within the viewport.
   * `getTTFB` (Time to First Byte): Measures loading performance.
     It's the time it takes for the browser to receive the first bye
      of the response from the server.

  How it works:

  The reportWebVitals function takes a callback function
  (onPerfEntry) as an argument. When each of the Web Vitals metrics
   (CLS, FID, FCP, LCP, TTFB) is measured by the web-vitals
  library, the onPerfEntry callback is invoked with the performance
   entry data.
