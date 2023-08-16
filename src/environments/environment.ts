// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiPath: 'http://172.20.20.178:3000' // Malibu
  // apiPath: 'http://192.168.100.11:3000', // Asus
  // apiPath: 'http://24.199.110.111:3000', // Digital Ocean
  apiPath: 'http://localhost:3000', // Para utilizar acessando pelo browser
  // apiPath: 'https://lacarte-api.onrender.com', // Render
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
