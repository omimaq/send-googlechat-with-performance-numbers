function getChatbotService() {
 return OAuth2.createService('client-delivery-bot')
 // Set the endpoint URL.
 .setTokenUrl('https://accounts.google.com/o/oauth2/token')
// Set the private key and issuer.
 .setPrivateKey(PRIVATE_KEY)
 .setIssuer(CLIENT_EMAIL)
// Set the property store where authorized tokens should be persisted.
 .setPropertyStore(PropertiesService.getScriptProperties())
// Set the scope.
 .setScope('https://www.googleapis.com/auth/chat.bot');
}


/**
 * Test for getting access token
 */
function getAccessTokenTest() {
  var service = getChatbotService();
  if (service.hasAccess()) {
    Logger.log(service.getAccessToken());
  } else {
    Logger.log(service.getLastError());
  }
}



function sendUserMetric() {


  // select the range from the Summary sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Daily");
  var lastRow = sheet.getLastRow();
   
  var range = sheet.getRange(2,1,lastRow,5).getValues();
  
  // create timestamp to mark when communication was sent
  var timestamp = new Date();
  
  
  // loop over range and send communication if "Yes" option chosen
  for (var i = 0; i < range.length; i++) {
    if (range[i][2] == "Yes") {
      
      // choose email, slack or both channels
      switch (range[i][3]) {
        case "Email":
          // send email to student by calling sendEmail function
          sendEmail(range[i]);
          break;
        
        case "Chat":
          // post message to chat
          sendPushMessage(range[i]);
          break;
          
        case "Both":
          // send email and post to Slack
          sendEmail(range[i]);
          sendToSlack2(range[i]);
          break;
      }
      
      // add timestamp to final column to show when communication was sent
      // sheet.getRange(2,6,1,1).setValue(timestamp); 
    };
  } 
}

/**
 * Authorizes and makes a request to the Hangouts Chat API for :
 * - Getting all spaces the bot is installed
 * - Sending message when space is a Direct Message space
 */
function sendPushMessage(users) {
  var service = getChatbotService();
  if (service.hasAccess()) {
    //WE retrieve all the spaces bot has been added
    var url = 'https://chat.googleapis.com/v1/spaces';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    var rep = JSON.parse(response.getContentText());
    if(rep.spaces && rep.spaces.length > 0){
      for(var i = 0; i < rep.spaces.length; i++) {
        var space = rep.spaces[i];
        if(space.type == "ROOM"){
          //We send message only to Direct Message room.
          //var url = 'https://chat.googleapis.com/v1/'+space.name+'/messages';
          var url = 'https://chat.googleapis.com/v1/'+space.name+'/messages';
          
          
          
          var payload = { "text": users[1] }
                    
                 
          
          var options = {
            method : 'post',
            contentType: 'application/json',
            headers: {
              Authorization: 'Bearer ' + service.getAccessToken()
            },
            payload : JSON.stringify(payload)
          }
          
          //We send message to the DM room
          UrlFetchApp.fetch(url, options);
          console.log()
        }else{
          //If Type is 'ROOM' or 'TYPE_UNSPECIFIED' we don't send notification.
        }
      }
    } else {
      Logger.log('Bot is not added to any spaces');
      console.log()
    }
  } else {
    Logger.log(service.getLastError());
    console.log()
  }
}
