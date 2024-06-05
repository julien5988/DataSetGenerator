const express = require('express');
const { faker } = require('@faker-js/faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.post('/generate-csv', (req, res) => {
  // Récupérer le nombre de leads à générer depuis les paramètres de la requête
  const numberOfLeads = req.query.numberOfLeads || 10; // Par défaut, générer 10 leads

  const leadStatus = [
    "Open - Not Contacted",
    "Working - Contacted",
    "Closed - Converted",
    "Closed - Not Converted"
  ];

  const records = [];

  for (let i = 0; i < numberOfLeads; i++) {
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const randomEmail = faker.internet.email({ firstName: randomFirstName, lastName: randomLastName });
    const randomMobilePhone = `+33 6 ${faker.string.numeric(2)} ${faker.string.numeric(2)} ${faker.string.numeric(2)} ${faker.string.numeric(2)}`;
    const randomFixedPhone = `+33 1 ${faker.string.numeric(2)} ${faker.string.numeric(2)} ${faker.string.numeric(2)} ${faker.string.numeric(2)}`;
    const randomCompany = faker.company.buzzPhrase();
    const randomLeadStatus = leadStatus[Math.floor(Math.random() * leadStatus.length)];

    records.push({
      firstName: randomFirstName,
      lastName: randomLastName,
      email: randomEmail,
      mobilePhone: randomMobilePhone,
      fixedPhone: randomFixedPhone,
      company: randomCompany,
      leadStatus: randomLeadStatus
    });
  }

  const csvWriter = createCsvWriter({
    header: [
      { id: 'firstName', title: 'Prénom' },
      { id: 'lastName', title: 'Nom' },
      { id: 'email', title: 'Email' },
      { id: 'mobilePhone', title: 'Téléphone mobile' },
      { id: 'fixedPhone', title: 'Téléphone fixe' },
      { id: 'company', title: 'Entreprise' },
      { id: 'leadStatus', title: 'Statut du lead' }
    ],
    // Spécifiez le chemin d'accès au fichier CSV
    path: 'leads.csv'
  });

  csvWriter.writeRecords(records)
    .then(() => {
      console.log(`Fichier CSV de ${numberOfLeads} leads généré avec succès`);
      res.download('leads.csv', (err) => {
        if (err) {
          console.error('Erreur lors du téléchargement du fichier CSV :', err);
          res.status(500).send('Erreur lors du téléchargement du fichier CSV');
        }
      });
    })
    .catch(error => {
      console.error('Erreur lors de la génération du fichier CSV :', error);
      res.status(500).send('Erreur lors de la génération du fichier CSV');
    });
});

app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur http://localhost:${port}`);
});
