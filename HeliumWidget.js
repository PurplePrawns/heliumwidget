// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;
/* --------------------------------------------------------------
Script: heliumminer.js
Author: PurplePrawns
Version: 1.0.0
Description:
Displays the current Helium Miner/Account statistics.
Changelog:
1.0.0: INIT
-------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////
///////////////////// CHANGE TO YOUR HNT ADDRESS ///////////////////
const address = 'YOURWALLETADDRESS'
// Set the "When Interacting, Open URL" to https://explorer.helium.com/accounts/YOURWALLETADDRESS
////////////////////////////////////////////////////////////////////

/// CONFIG
const hntfract = 100000000
const acctactivityreq = new Request('https://api.helium.io/v1/accounts/' + address + '/activity')
const acctactivityres = await acctactivityreq.loadJSON()
const acctactivitycursor = acctactivityres.cursor
const acctactivityreqclean = new Request('https://api.helium.io/v1/accounts/' + address + '/activity?cursor=' + acctactivitycursor)
const acctactivityresclean = await acctactivityreqclean.loadJSON()
const acctactivitytime = acctactivityresclean.data[0].time

const hntaccturl = 'https://api.helium.io/v1/accounts/' + address
const hntacctreq = new Request(hntaccturl)
const hntacctres = await hntacctreq.loadJSON()
const hntbalance = hntacctres.data.balance / hntfract;

const coingeckoreq = new Request('https://api.coingecko.com/api/v3/simple/price?ids=helium&vs_currencies=USD')
const coingeckores = await coingeckoreq.loadJSON()
const coingeckousd = (coingeckores.helium.usd).toFixed(2);
const usdbalance = (coingeckousd * hntbalance).toFixed(2);

const earnurl = 'https://api.helium.io/v1/accounts/' + address + '/rewards/sum?min_time=-1%20day&bucket=day'
const earnreq = new Request(earnurl)
const earnres = await earnreq.loadJSON()

const earnhntday = (earnres.data[0].total).toFixed(4);
const earnusd = (coingeckousd * hntbalance).toFixed(2);
const earnusdday = (coingeckousd * earnhntday).toFixed(2);

const hntlogo = new Request('https://s2.coinmarketcap.com/static/img/coins/64x64/5665.png')
const img = await hntlogo.loadImage()

// SCRIPT
let widget = createWidget(usdbalance, hntbalance, img)
if (config.runsInWidget) {
  Script.setWidget(widget)
  Script.complete()
}
else {
  widget.presentSmall()
}

// Unix Time Conversion
const convertedTime = convertUnixTime(acctactivitytime);
function convertUnixTime(unix) {
  let a = new Date(unix * 1000),
      year = a.getFullYear(),
      months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'],
      month = months[a.getMonth()],
      date = a.getDate(),
      hour = a.getHours(),
      min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(),
      sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  return `${month} ${date}, ${year}, ${hour}:${min}`;
}

// Widget layout 
function createWidget(usdbalance, hntbalance, img) {
  let w = new ListWidget()
  w.backgroundColor = new Color("#000000")
  
  w.addSpacer(8)

// Uncomment the next 3 lines to use a logo

  let image = w.addImage(img)
  image.imageSize = new Size(30, 30)
  image.centerAlignImage()

// Uncomment the next 4 lines if not using a logo

//  let titleTxt = w.addText("Helium")
//  titleTxt.textColor = new Color('#474DFF')
//  titleTxt.font = Font.boldSystemFont(16)
//  titleTxt.centerAlignText()

  w.addSpacer(10)
  
  let hntPerDayTxt = w.addText(earnhntday + " HNT/day")
  hntPerDayTxt.textColor = new Color('#474DFF')
  hntPerDayTxt.font = Font.systemFont(16)
  hntPerDayTxt.centerAlignText()
  
  let usdPerDayTxt = w.addText("$" + earnusdday + " USD/day")
  usdPerDayTxt.textColor =  Color.green()
  usdPerDayTxt.font = Font.systemFont(10)
  usdPerDayTxt.centerAlignText()

  w.addSpacer(8)
  
  let staticTitle1Text = w.addText("Wallet Balance:")
  staticTitle1Text.textColor = Color.white()
  staticTitle1Text.font = Font.boldSystemFont(12)
  staticTitle1Text.centerAlignText()
  
  let balanceHNTTxt = w.addText(hntbalance + " HNT")
  balanceHNTTxt.textColor = Color.gray()
  balanceHNTTxt.font = Font.systemFont(10)
  balanceHNTTxt.centerAlignText()

  let balanceUSDTxt = w.addText("$" + usdbalance + " USD")  
  balanceUSDTxt.textColor = Color.green()
  balanceUSDTxt.font = Font.systemFont(10)
  balanceUSDTxt.centerAlignText() 
 
  w.addSpacer(8)
  
  let lastUpdateTxt = w.addText(convertUnixTime(acctactivitytime))
  lastUpdateTxt.textColor = Color.gray()
  lastUpdateTxt.font = Font.systemFont(10)
  lastUpdateTxt.centerAlignText()

  w.addSpacer(8)
  w.setPadding(0, 0, 0, 0)
  return w
}
