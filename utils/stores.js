const ScrapingAlgorithm = {
  MercadoLibre: "Mercado Libre",
  Rosen: "Rosen",
  Skechers: "Skechers",
  Jumbo: "Jumbo",
  Tramontina: "Tramontina",
  CruzVerde: "Cruz Verde",
  Salcobrand: "Salcobrand",
  DrSimi: "Dr Simi",
};

const storeAlgorithmMap = {
  mercadolibre: ScrapingAlgorithm.MercadoLibre,
  rosen: ScrapingAlgorithm.Rosen,
  skechers: ScrapingAlgorithm.Skechers,
  spdigital: ScrapingAlgorithm.SPDigital,
  tramontinastore: ScrapingAlgorithm.Tramontina,
  tramontina: ScrapingAlgorithm.Tramontina,
  jumbo: ScrapingAlgorithm.Jumbo,
  cruzverde: ScrapingAlgorithm.CruzVerde,
  salcobrand: ScrapingAlgorithm.Salcobrand,
  drsimi: ScrapingAlgorithm.DrSimi,
};

module.exports = { ScrapingAlgorithm, storeAlgorithmMap };
