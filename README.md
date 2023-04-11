# Chatbot User Metrics Sender

This is a Google Apps Script code that sends user metrics via email, Hangouts Chat, or both, based on options selected in a Google Sheets. It uses OAuth2 authentication and the Hangouts Chat API to send messages to Direct Message spaces where the bot is installed.

## Functions

### `getChatbotService()`
This function creates and returns an OAuth2 service for authorization. It sets the endpoint URL, private key, issuer, property store, and scope for the Chatbot service.

### `getAccessTokenTest()`
This function tests the access token for the Chatbot service. If the service has access, it logs the access token. Otherwise, it logs the last error.

### `sendUserMetric()`
This function retrieves user metrics data from the "Daily" sheet of the active Google Spreadsheet. It loops over the data and sends communications (email, Chat, or both) based on the options selected in the sheet. It also adds a timestamp to the final column to mark when the communication was sent.

### `sendPushMessage(users)`
This function authorizes and makes a request to the Hangouts Chat API to send messages to Direct Message spaces where the bot is installed. It retrieves all the spaces where the bot has been added, and sends a message with the user metrics data as the text payload to each Direct Message space.

## How to Use

1. Create a new Google Apps Script project in your Google Sheets.
2. Replace the code in the default `Code.gs` file with the provided code.
3. Save and run the `getAccessTokenTest()` function to authorize the Chatbot service and test the access token.
4. Use the "Daily" sheet in your Google Spreadsheet to input user metrics data and select communication options.
5. Run the `sendUserMetric()` function to send the communications (email, Chat, or both) based on the selected options in the "Daily" sheet.

Note: Make sure to configure the OAuth2 credentials (private key, client email, etc.) for the Chatbot service before running the code. You can also customize the code to fit your specific use case or add error handling as needed.

For more information on how to use Google Apps Script, refer to the [official documentation](https://developers.google.com/apps-script/docs).
