const { storeAlgorithmMap, ScrapingAlgorithm } = require("../utils/stores");
const { parse } = require("tldts");
const scraper = require("../services/scraper");
const Model = require("../models/model");
const express = require("express");
const router = express.Router();
module.exports = router;

//POST
router.post("/post", async (req, res) => {
  const item = new Model({
    item: req.body.item,
    store: {
      name: req.body.store,
      url: req.body.url,
    },
    lowestPrice: req.body.price,
    lowestPriceDate: new Date(),
    highestPrice: req.body.price,
    highestPriceDate: new Date(),
  });
  try {
    const itemToSave = await item.save();
    res.status(200).json(itemToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all Method
router.get("/getAll", async (req, res) => {
  try {
    const items = await Model.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by url
router.get("/getByUrl", async (req, res) => {
  const storeUrl = req.query.url;
  try {
    const item = await Model.findOne({ "store.url": storeUrl });
    res.json({
      lowestPrice: item.lowestPrice,
      lowestPriceDate: item.lowestPriceDate,
      highestPrice: item.highestPrice,
      highestPriceDate: item.highestPriceDate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/getOne/:id", async (req, res) => {
  try {
    const item = await Model.findById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Model.findByIdAndDelete(id);
    res.send(`Document ${item.item} has been deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/deleteByUrl", async (req, res) => {
  const storeUrl = req.query.url;
  try {
    const item = await Model.findOneAndDelete({ "store.url": storeUrl });
    res.send(`Document ${item.item} has been deleted`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getCurrentPrices", async (req, res) => {
  try {
    const success = [];
    const fail = [];
    const itemsToUpdate = req.body.urls;
    const currentDate = new Date();
    //iterate each url
    for (const itemUrl of itemsToUpdate) {
      const store = parse(itemUrl).domainWithoutSuffix;
      // if the store is mapped, then it has an algorithm to extract the price and can be pushed to mongo
      if (store in storeAlgorithmMap) {
        //get the price
        const [itemName, price] = await scraper.getPriceByUrl(itemUrl);
        //check if price was obtained
        if (price != "") {
          //check if item already exists
          const currentItem = await Model.findOne({ "store.url": itemUrl });
          //if item doesnt exist, create it
          if (!currentItem) {
            const newItem = await Model.create({
              item: itemName,
              store: {
                name: store,
                url: itemUrl,
              },
              lowestPrice: price,
              lowestPriceDate: currentDate,
              highestPrice: price,
              highestPriceDate: currentDate,
              priceHistory: {
                price: price,
                startDate: currentDate,
                endDate: null,
              },
            });
            success.push(newItem);
          } else {
            //if already exist must be update accordingly
            //get current price in mongo
            const currentPrice = currentItem.priceHistory.find(
              (p) => p.endDate === null
            );
            //if the new price is different must update history
            if (!currentPrice || currentPrice.price != price) {
              if (currentPrice) currentPrice.endDate = currentDate;

              //if the new price is different must update history
              currentItem.priceHistory.push({
                price: price,
                startDate: currentDate,
                endDate: null,
              });

              //also check if the new price is lowest and update
              if (!currentItem.lowestPrice || price < currentItem.lowestPrice) {
                currentItem.lowestPrice = price;
                currentItem.lowestPriceDate = currentDate;
              }
              //also check if the new price is highest and update
              if (
                !currentItem.highestPrice ||
                price > currentItem.highestPrice
              ) {
                currentItem.highestPrice = price;
                currentItem.highestPriceDate = currentDate;
              }
            }
            //if the new price is the same then no changes are needed
            //save to mongo the item
            const updatedItem = await Model.findByIdAndUpdate(
              currentItem.id,
              currentItem.toObject(), // convert to plain object
              { new: true } // return the updated document
            );
            success.push(updatedItem.toObject());
          }
        } else {
          fail.push({
            store: store,
            url: itemUrl,
            error: "precio no encontrado",
          });
        }
      } else {
        fail.push({
          store: store,
          url: itemUrl,
          error: "marca no mappeada",
        });
      }
    }
    res.send({ success, fail });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getCurrentPricesTest", async (req, res) => {
  try {
    const result = [];
    const itemsToUpdate = req.body.urls;
    //iterate each url
    for (const itemUrl of itemsToUpdate) {
      const store = parse(itemUrl).domainWithoutSuffix;
      // if the store is mapped, then it has an algorithm to extract the price
      if (store in storeAlgorithmMap) {
        const [itemName, price] = await scraper.getPriceByUrl(itemUrl);
        result.push({
          store: store,
          url: itemUrl,
          itemName: itemName,
          price: price,
        });
      } else {
        result.push({
          store: store,
          url: itemUrl,
          itemName: "marca no mappeada",
          price: "marca no mappeada",
        });
      }
    }
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getStores", (req, res) => {
  const stores = Object.values(ScrapingAlgorithm);
  res.send(stores);
});
