const { storeAlgorithmMap, ScrapingAlgorithm } = require("../utils/stores");

const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

async function getPriceByUrl(url) {
  const store = new URL(url).hostname.split(".")[1];
  const algorithm = storeAlgorithmMap[store] || ScrapingAlgorithm.Default;

  const priceRegex = /\$\d{1,3}(?:\.\d{3})*/g;

  try {
    const { data: html } = await axios.get(url);
    let price = "";
    const $ = cheerio.load(html);
    $(
      'script, style, [style*="display:none"], [style*="display: none"]'
    ).remove();
    switch (algorithm) {
      case ScrapingAlgorithm.MercadoLibre:
        price = $('meta[itemprop="price"]')
          .closest(".andes-money-amount")
          .find(".andes-money-amount__fraction")
          .text()
          .trim();
        break;
      case ScrapingAlgorithm.Tramontina:
        price = $(
          ".vtex-product-price-1-x-currencyContainer.vtex-product-price-1-x-currencyContainer--productSellingPrice"
        )
          .text()
          .trim();
        break;
      default:
        price = $("body").text().match(priceRegex)[0]; // get full visible text
        break;
    }
    return price.replace(/[$.,]/g, "");
  } catch (err) {
    console.error("Error scraping:", err.message);
    return [];
  }
}

module.exports = { getPriceByUrl };
