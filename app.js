const axios = require('axios')
const cheerio = require('cheerio')
const nodemailer = require('nodemailer')
const cron = require('node-cron')

const urls =
  ['https://www.flipkart.com/takara-tomy-beyblade-burst-dranzer-spiral/p/itmfe6easugwhh7d',
   'https://www.flipkart.com/the-oath-of-the-vayuputras/p/itmfc59rj54bxxdk']

// cron.schedule('0 9 * * *', () => {
// });

urls.forEach((url) => {
  axios.get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);
  
      const target = $('._2i1QSc');
  
      const price = target.children('div').children('div').first().text().substring(1);

      const name = $('._35KyD6').text();
  
      if (price < 500) {
        console.log('Price Dropped. Send Mail');
        sendMail(price, url, name);
      } else {
        console.log('Still too damn expensive. Will check back tomorrow');
      }
    })
    .catch((res) => {
      console.log(res);
    });
})

const sendMail = (price, url, name) => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ``,
      pass: ''
    }
  })

  let mailOptions = {
    from: ``,
    to: '',
    subject:  `${name} - Price Dropped!!`,
    text: `${name} is now available at a cheaper price(Rs.${price}). Visit ${url} to purchase your product.`
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err)
    else console.log('Email Sent!!')
  })
}
